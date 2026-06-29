// ============================================================
// LIFELINK EDGE FUNCTION: CREATE-SOS-REQUEST
// ============================================================
// This function creates an emergency blood request with a unique
// request code, finds compatible donors using match-donors logic,
// sends notifications to matched donors, and returns the created request.
// ============================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

// Define the interface for the request body
interface CreateSOSRequest {
  blood_group: string
  units_needed: number
  urgency: string
  hospital_name: string
  city: string
  latitude: number
  longitude: number
  patient_id: string
  notes?: string
}

// Define the interface for the response
interface SOSResponse {
  success: boolean
  request?: {
    id: string
    request_code: string
    patient_id: string
    blood_group: string
    units_needed: number
    urgency: string
    hospital_name: string
    city: string
    latitude: number
    longitude: number
    status: string
    notes: string | null
    created_at: string
  }
  matched_donors?: number
  error?: string
}

// Blood group compatibility matrix
function getCompatibleBloodGroups(requestedGroup: string): string[] {
  const compatibility: Record<string, string[]> = {
    'A+': ['O-', 'O+', 'A-', 'A+'],
    'A-': ['O-', 'A-'],
    'B+': ['O-', 'O+', 'B-', 'B+'],
    'B-': ['O-', 'B-'],
    'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    'AB-': ['O-', 'A-', 'B-', 'AB-'],
    'O+': ['O-', 'O+'],
    'O-': ['O-']
  }
  
  return compatibility[requestedGroup] || []
}

// Haversine formula to calculate distance
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

// Generate unique request code in format LL-XXXXX
function generateRequestCode(): string {
  const randomNum = Math.floor(Math.random() * 90000) + 10000
  return `LL-${randomNum}`
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    })
  }

  try {
    // Parse request body
    const body: CreateSOSRequest = await req.json()
    const { 
      blood_group, 
      units_needed, 
      urgency, 
      hospital_name, 
      city, 
      latitude, 
      longitude, 
      patient_id,
      notes 
    } = body

    // Validate required fields
    if (!blood_group || !units_needed || !urgency || !hospital_name || 
        !city || latitude === undefined || longitude === undefined || !patient_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Generate unique request code
    let requestCode = generateRequestCode()
    let codeExists = true
    
    // Ensure code is unique
    while (codeExists) {
      const { data: existing } = await supabase
        .from('blood_requests')
        .select('request_code')
        .eq('request_code', requestCode)
        .single()
      
      if (!existing) {
        codeExists = false
      } else {
        requestCode = generateRequestCode()
      }
    }

    // Insert the blood request
    const { data: request, error: requestError } = await supabase
      .from('blood_requests')
      .insert({
        request_code: requestCode,
        patient_id,
        blood_group,
        units_needed,
        urgency,
        hospital_name,
        city,
        latitude,
        longitude,
        status: 'submitted',
        notes: notes || null
      })
      .select()
      .single()

    if (requestError) {
      console.error('Error creating blood request:', requestError)
      return new Response(
        JSON.stringify({ error: 'Failed to create blood request' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Find compatible donors
    const compatibleGroups = getCompatibleBloodGroups(blood_group)
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

    const { data: donors, error: donorsError } = await supabase
      .from('donors')
      .select(`
        id,
        user_id,
        blood_group,
        profiles!inner (
          name,
          latitude,
          longitude,
          city
        )
      `)
      .in('blood_group', compatibleGroups)
      .eq('is_available', true)
      .or(`last_donated.is.null,last_donated.lt.${threeMonthsAgo.toISOString()}`)
      .eq('profiles.city', city)

    if (donorsError) {
      console.error('Error fetching donors:', donorsError)
    }

    // Calculate distance and filter donors within reasonable range (50km)
    const matchedDonors = (donors || [])
      .map((donor: any) => {
        const donorLat = donor.profiles.latitude
        const donorLon = donor.profiles.longitude
        
        if (!donorLat || !donorLon) return null

        const distance = calculateDistance(latitude, longitude, donorLat, donorLon)
        
        // Filter donors within 50km
        if (distance > 50) return null

        return {
          donor_id: donor.id,
          user_id: donor.user_id,
          distance: Math.round(distance * 100) / 100
        }
      })
      .filter((donor): donor is NonNullable<typeof donor> => donor !== null)

    // Sort by distance and take top 10
    const topDonors = matchedDonors
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10)

    // Send notifications to matched donors
    if (topDonors.length > 0) {
      const notifications = topDonors.map(donor => ({
        user_id: donor.user_id,
        title: 'Emergency Blood Request',
        message: `SOS: ${blood_group} blood needed urgently at ${hospital_name}, ${city}. Request Code: ${requestCode}. You are ${donor.distance}km away.`,
        type: 'sos',
        is_read: false
      }))

      const { error: notificationError } = await supabase
        .from('notifications')
        .insert(notifications)

      if (notificationError) {
        console.error('Error sending notifications:', notificationError)
      }
    }

    // Update request status to 'matching' if donors were found
    if (topDonors.length > 0) {
      await supabase
        .from('blood_requests')
        .update({ status: 'matching' })
        .eq('id', request.id)
    }

    const response: SOSResponse = {
      success: true,
      request: {
        id: request.id,
        request_code: request.request_code,
        patient_id: request.patient_id,
        blood_group: request.blood_group,
        units_needed: request.units_needed,
        urgency: request.urgency,
        hospital_name: request.hospital_name,
        city: request.city,
        latitude: request.latitude,
        longitude: request.longitude,
        status: topDonors.length > 0 ? 'matching' : 'submitted',
        notes: request.notes,
        created_at: request.created_at
      },
      matched_donors: topDonors.length
    }

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

  } catch (error) {
    console.error('Error in create-sos-request function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})
