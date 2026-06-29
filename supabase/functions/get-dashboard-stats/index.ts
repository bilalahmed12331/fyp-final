// ============================================================
// LIFELINK EDGE FUNCTION: GET-DASHBOARD-STATS
// ============================================================
// This function returns dashboard statistics based on user role:
// - Donor: total donations, reward points, badge, recent donations, unread notifications
// - Patient: total requests, fulfilled requests, pending requests
// - Hospital: blood inventory levels, incoming pending requests
// ============================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

// Define the interface for the request body
interface DashboardStatsRequest {
  user_id: string
  role: string
}

// Define the interface for donor stats
interface DonorStats {
  total_donations: number
  reward_points: number
  badge: string
  recent_donations: Array<{
    id: string
    hospital_name: string
    blood_group: string
    units: number
    donated_at: string
  }>
  unread_notifications: number
}

// Define the interface for patient stats
interface PatientStats {
  total_requests: number
  fulfilled_requests: number
  pending_requests: number
  recent_requests: Array<{
    id: string
    request_code: string
    blood_group: string
    units_needed: number
    status: string
    created_at: string
  }>
}

// Define the interface for hospital stats
interface HospitalStats {
  blood_inventory: Array<{
    blood_group: string
    units: number
    max_units: number
    percentage: number
  }>
  pending_requests: number
  recent_requests: Array<{
    id: string
    request_code: string
    blood_group: string
    units_needed: number
    urgency: string
    status: string
  }>
}

// Define the interface for the response
interface DashboardStatsResponse {
  success: boolean
  role: string
  donor_stats?: DonorStats
  patient_stats?: PatientStats
  hospital_stats?: HospitalStats
  error?: string
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
    const { user_id, role }: DashboardStatsRequest = await req.json()

    // Validate required fields
    if (!user_id || !role) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: user_id, role' }),
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

    const response: DashboardStatsResponse = {
      success: true,
      role
    }

    // Handle donor role
    if (role === 'donor') {
      // Get donor information
      const { data: donor, error: donorError } = await supabase
        .from('donors')
        .select('*')
        .eq('user_id', user_id)
        .single()

      if (donorError || !donor) {
        return new Response(
          JSON.stringify({ error: 'Donor profile not found' }),
          { 
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }

      // Get recent donations
      const { data: recentDonations, error: donationsError } = await supabase
        .from('donations')
        .select('id, hospital_name, blood_group, units, donated_at')
        .eq('donor_id', donor.id)
        .order('donated_at', { ascending: false })
        .limit(5)

      if (donationsError) {
        console.error('Error fetching donations:', donationsError)
      }

      // Get unread notifications count
      const { count: unreadCount, error: notificationError } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user_id)
        .eq('is_read', false)

      if (notificationError) {
        console.error('Error fetching notifications:', notificationError)
      }

      response.donor_stats = {
        total_donations: donor.total_donations,
        reward_points: donor.reward_points,
        badge: donor.badge,
        recent_donations: recentDonations || [],
        unread_notifications: unreadCount || 0
      }
    }

    // Handle patient role
    else if (role === 'patient') {
      // Get blood requests for this patient
      const { data: requests, error: requestsError } = await supabase
        .from('blood_requests')
        .select('id, request_code, blood_group, units_needed, status, created_at')
        .eq('patient_id', user_id)
        .order('created_at', { ascending: false })

      if (requestsError) {
        console.error('Error fetching requests:', requestsError)
      }

      const allRequests = requests || []
      const fulfilledRequests = allRequests.filter(r => r.status === 'delivered').length
      const pendingRequests = allRequests.filter(r => 
        ['submitted', 'matching', 'accepted', 'en_route'].includes(r.status)
      ).length

      response.patient_stats = {
        total_requests: allRequests.length,
        fulfilled_requests: fulfilledRequests,
        pending_requests: pendingRequests,
        recent_requests: allRequests.slice(0, 5)
      }
    }

    // Handle hospital role
    else if (role === 'hospital') {
      // Get hospital information
      const { data: hospital, error: hospitalError } = await supabase
        .from('hospitals')
        .select('*')
        .eq('user_id', user_id)
        .single()

      if (hospitalError || !hospital) {
        return new Response(
          JSON.stringify({ error: 'Hospital profile not found' }),
          { 
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }

      // Get blood inventory
      const { data: inventory, error: inventoryError } = await supabase
        .from('blood_inventory')
        .select('blood_group, units, max_units')
        .eq('hospital_id', hospital.id)

      if (inventoryError) {
        console.error('Error fetching inventory:', inventoryError)
      }

      const inventoryWithPercentage = (inventory || []).map(item => ({
        blood_group: item.blood_group,
        units: item.units,
        max_units: item.max_units,
        percentage: Math.round((item.units / item.max_units) * 100)
      }))

      // Get pending blood requests for this hospital
      const { data: hospitalRequests, error: hospitalRequestsError } = await supabase
        .from('blood_requests')
        .select('id, request_code, blood_group, units_needed, urgency, status')
        .eq('hospital_name', hospital.name)
        .in('status', ['submitted', 'matching', 'accepted', 'en_route'])
        .order('created_at', { ascending: false })

      if (hospitalRequestsError) {
        console.error('Error fetching hospital requests:', hospitalRequestsError)
      }

      response.hospital_stats = {
        blood_inventory: inventoryWithPercentage,
        pending_requests: (hospitalRequests || []).length,
        recent_requests: (hospitalRequests || []).slice(0, 5)
      }
    }

    // Handle admin role (optional)
    else if (role === 'admin') {
      // Admin can see overall stats
      const { count: totalDonors } = await supabase
        .from('donors')
        .select('*', { count: 'exact', head: true })

      const { count: totalRequests } = await supabase
        .from('blood_requests')
        .select('*', { count: 'exact', head: true })

      const { count: activeRequests } = await supabase
        .from('blood_requests')
        .select('*', { count: 'exact', head: true })
        .in('status', ['submitted', 'matching', 'accepted', 'en_route'])

      // Return admin stats in a generic format
      response.donor_stats = {
        total_donations: totalDonors || 0,
        reward_points: totalRequests || 0,
        badge: 'admin',
        recent_donations: [],
        unread_notifications: activeRequests || 0
      }
    }

    else {
      return new Response(
        JSON.stringify({ error: 'Invalid role specified' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
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
    console.error('Error in get-dashboard-stats function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})
