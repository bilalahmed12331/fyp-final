// ============================================================
// LIFELINK EDGE FUNCTION: GET-TRACKING-DATA
// ============================================================
// This function returns full tracking information for a blood request
// including current status, accepted donor responses with donor details,
// distance calculations, and estimated arrival time.
// ============================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

// Define the interface for the request body
interface TrackingRequest {
  request_id: string
}

// Define the interface for donor response with details
interface DonorResponse {
  id: string
  donor_id: string
  status: string
  location_lat: number
  location_lng: number
  responded_at: string
  donor_name: string
  donor_phone: string
  donor_blood_group: string
  distance_km: number
}

// Define the interface for tracking response
interface TrackingResponse {
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
  donor_responses?: DonorResponse[]
  estimated_arrival?: string
  error?: string
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

// Estimate arrival time based on distance (assuming average speed of 30km/h in city)
function estimateArrivalTime(distanceKm: number): string {
  const avgSpeed = 30 // km/h
  const timeHours = distanceKm / avgSpeed
  const timeMinutes = Math.round(timeHours * 60)
  
  const now = new Date()
  const arrival = new Date(now.getTime() + timeMinutes * 60000)
  
  return arrival.toISOString()
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
    const { request_id }: TrackingRequest = await req.json()

    // Validate required fields
    if (!request_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: request_id' }),
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

    // Get the blood request details
    const { data: request, error: requestError } = await supabase
      .from('blood_requests')
      .select('*')
      .eq('id', request_id)
      .single()

    if (requestError || !request) {
      return new Response(
        JSON.stringify({ error: 'Blood request not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Get donor responses for this request
    const { data: responses, error: responsesError } = await supabase
      .from('donor_responses')
      .select(`
        id,
        donor_id,
        status,
        location_lat,
        location_lng,
        responded_at,
        donors!inner (
          blood_group,
          profiles!inner (
            name,
            phone
          )
        )
      `)
      .eq('request_id', request_id)
      .eq('status', 'accepted')

    if (responsesError) {
      console.error('Error fetching donor responses:', responsesError)
    }

    // Process donor responses with distance calculations
    const donorResponses: DonorResponse[] = (responses || [])
      .map((response: any) => {
        const donorLat = response.location_lat
        const donorLon = response.location_lng
        const requestLat = request.latitude
        const requestLon = request.longitude

        if (!donorLat || !donorLon || !requestLat || !requestLon) {
          return null
        }

        const distance = calculateDistance(requestLat, requestLon, donorLat, donorLon)

        return {
          id: response.id,
          donor_id: response.donor_id,
          status: response.status,
          location_lat: donorLat,
          location_lng: donorLon,
          responded_at: response.responded_at,
          donor_name: response.donors.profiles.name,
          donor_phone: response.donors.profiles.phone,
          donor_blood_group: response.donors.blood_group,
          distance_km: Math.round(distance * 100) / 100
        }
      })
      .filter((response): response is DonorResponse => response !== null)

    // Calculate estimated arrival time based on closest donor
    let estimatedArrival: string | undefined
    if (donorResponses.length > 0) {
      const closestDonor = donorResponses.reduce((closest, current) => 
        current.distance_km < closest.distance_km ? current : closest
      )
      estimatedArrival = estimateArrivalTime(closestDonor.distance_km)
    }

    const trackingResponse: TrackingResponse = {
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
        status: request.status,
        notes: request.notes,
        created_at: request.created_at
      },
      donor_responses: donorResponses,
      estimated_arrival: estimatedArrival
    }

    return new Response(
      JSON.stringify(trackingResponse),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

  } catch (error) {
    console.error('Error in get-tracking-data function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})
