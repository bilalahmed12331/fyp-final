// ============================================================
// LIFELINK EDGE FUNCTION: UPDATE-REQUEST-STATUS
// ============================================================
// This function updates the status of a blood request.
// When status is 'accepted', it updates donor response and notifies patient.
// When status is 'delivered', it adds a donation record, increments donor
// stats, adds reward points, and updates badge based on points.
// ============================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

// Define the interface for the request body
interface UpdateStatusRequest {
  request_id: string
  new_status: string
  donor_id?: string
}

// Badge thresholds
const BADGE_THRESHOLDS = {
  bronze: 100,
  silver: 500,
  gold: 1000,
  lifesaver: 2000
}

// Calculate badge based on reward points
function calculateBadge(points: number): string {
  if (points >= BADGE_THRESHOLDS.lifesaver) return 'lifesaver'
  if (points >= BADGE_THRESHOLDS.gold) return 'gold'
  if (points >= BADGE_THRESHOLDS.silver) return 'silver'
  if (points >= BADGE_THRESHOLDS.bronze) return 'bronze'
  return 'none'
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
    const { request_id, new_status, donor_id }: UpdateStatusRequest = await req.json()

    // Validate required fields
    if (!request_id || !new_status) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: request_id, new_status' }),
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

    // Get the current request details
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

    // Update the request status
    const { error: updateError } = await supabase
      .from('blood_requests')
      .update({ status: new_status })
      .eq('id', request_id)

    if (updateError) {
      console.error('Error updating request status:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update request status' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Handle status-specific logic
    if (new_status === 'accepted' && donor_id) {
      // Update donor response to accepted
      const { error: responseError } = await supabase
        .from('donor_responses')
        .update({ status: 'accepted' })
        .eq('request_id', request_id)
        .eq('donor_id', donor_id)

      if (responseError) {
        console.error('Error updating donor response:', responseError)
      }

      // Send notification to patient
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: request.patient_id,
          title: 'Donor Accepted',
          message: `A donor has accepted your blood request ${request.request_code}. They are on their way!`,
          type: 'request',
          is_read: false
        })

      if (notificationError) {
        console.error('Error sending notification:', notificationError)
      }

    } else if (new_status === 'delivered' && donor_id) {
      // Get donor details
      const { data: donor, error: donorError } = await supabase
        .from('donors')
        .select('*')
        .eq('id', donor_id)
        .single()

      if (donorError || !donor) {
        return new Response(
          JSON.stringify({ error: 'Donor not found' }),
          { 
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }

      // Add donation record
      const { error: donationError } = await supabase
        .from('donations')
        .insert({
          donor_id: donor_id,
          request_id: request_id,
          hospital_name: request.hospital_name,
          blood_group: request.blood_group,
          units: request.units_needed,
          donated_at: new Date().toISOString()
        })

      if (donationError) {
        console.error('Error creating donation record:', donationError)
      }

      // Increment donor total donations
      const newTotalDonations = donor.total_donations + 1
      const { error: updateDonorError } = await supabase
        .from('donors')
        .update({ 
          total_donations: newTotalDonations,
          last_donated: new Date().toISOString()
        })
        .eq('id', donor_id)

      if (updateDonorError) {
        console.error('Error updating donor stats:', updateDonorError)
      }

      // Add reward points (150 points per donation)
      const newRewardPoints = donor.reward_points + 150
      const newBadge = calculateBadge(newRewardPoints)

      const { error: updatePointsError } = await supabase
        .from('donors')
        .update({ 
          reward_points: newRewardPoints,
          badge: newBadge
        })
        .eq('id', donor_id)

      if (updatePointsError) {
        console.error('Error updating donor points:', updatePointsError)
      }

      // Send notification to donor about reward
      const { error: rewardNotificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: donor.user_id,
          title: 'Reward Earned!',
          message: `You earned 150 reward points for your donation! Total: ${newRewardPoints} points. Badge: ${newBadge}`,
          type: 'reward',
          is_read: false
        })

      if (rewardNotificationError) {
        console.error('Error sending reward notification:', rewardNotificationError)
      }

      // Send notification to patient
      const { error: patientNotificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: request.patient_id,
          title: 'Blood Delivered',
          message: `Your blood request ${request.request_code} has been fulfilled. Thank you for using LifeLink!`,
          type: 'request',
          is_read: false
        })

      if (patientNotificationError) {
        console.error('Error sending patient notification:', patientNotificationError)
      }

    } else if (new_status === 'en_route' && donor_id) {
      // Update donor response to en_route
      const { error: responseError } = await supabase
        .from('donor_responses')
        .update({ status: 'accepted' })
        .eq('request_id', request_id)
        .eq('donor_id', donor_id)

      if (responseError) {
        console.error('Error updating donor response:', responseError)
      }

      // Send notification to patient
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: request.patient_id,
          title: 'Donor En Route',
          message: `Your donor is on their way to ${request.hospital_name} for request ${request.request_code}.`,
          type: 'request',
          is_read: false
        })

      if (notificationError) {
        console.error('Error sending notification:', notificationError)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Request status updated successfully',
        request_id,
        new_status
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
    console.error('Error in update-request-status function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})
