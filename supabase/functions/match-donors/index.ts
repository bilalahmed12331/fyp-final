// ============================================================
// LIFELINK EDGE FUNCTION: MATCH-DONORS
// ============================================================
// This function finds compatible donors based on blood group,
// location, and availability. It uses the Haversine formula
// to calculate distance and returns the top 10 closest donors.
// ============================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

// Define the interface for the request body
interface MatchDonorsRequest {
  blood_group: string
  latitude: number
  longitude: number
  city: string
}

// Define the interface for donor response
interface DonorMatch {
  id: string
  user_id: string
  blood_group: string
  is_available: boolean
  last_donated: string | null
  total_donations: number
  reward_points: number
  badge: string
  name: string
  phone: string
  latitude: number
  longitude: number
  distance_km: number
}

// Blood group compatibility matrix
// Returns all blood groups that can donate to the requested group
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

// Haversine formula to calculate distance between two points in kilometers
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in km
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
    const { blood_group, latitude, longitude, city }: MatchDonorsRequest = await req.json()

    // Validate required fields
    if (!blood_group || latitude === undefined || longitude === undefined || !city) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: blood_group, latitude, longitude, city' }),
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

    // Get compatible blood groups
    const compatibleGroups = getCompatibleBloodGroups(blood_group)

    // Calculate the date 3 months ago
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

    // Query for available donors with compatible blood groups
    const { data: donors, error: donorsError } = await supabase
      .from('donors')
      .select(`
        id,
        user_id,
        blood_group,
        is_available,
        last_donated,
        total_donations,
        reward_points,
        badge,
        profiles!inner (
          name,
          phone,
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
      return new Response(
        JSON.stringify({ error: 'Failed to fetch donors' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Calculate distance for each donor and filter by location
    const donorsWithDistance: DonorMatch[] = (donors || [])
      .map((donor: any) => {
        const donorLat = donor.profiles.latitude
        const donorLon = donor.profiles.longitude
        
        // Skip if donor doesn't have location data
        if (!donorLat || !donorLon) return null

        const distance = calculateDistance(latitude, longitude, donorLat, donorLon)

        return {
          id: donor.id,
          user_id: donor.user_id,
          blood_group: donor.blood_group,
          is_available: donor.is_available,
          last_donated: donor.last_donated,
          total_donations: donor.total_donations,
          reward_points: donor.reward_points,
          badge: donor.badge,
          name: donor.profiles.name,
          phone: donor.profiles.phone,
          latitude: donorLat,
          longitude: donorLon,
          distance_km: Math.round(distance * 100) / 100 // Round to 2 decimal places
        }
      })
      .filter((donor): donor is DonorMatch => donor !== null)

    // Sort by distance and return top 10
    const topDonors = donorsWithDistance
      .sort((a, b) => a.distance_km - b.distance_km)
      .slice(0, 10)

    return new Response(
      JSON.stringify({ 
        success: true,
        donors: topDonors,
        count: topDonors.length
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

  } catch (error) {
    console.error('Error in match-donors function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})
