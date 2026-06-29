import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// ============================================================
// EDGE FUNCTION HELPERS
// ============================================================

/**
 * Call the match-donors edge function
 */
export async function matchDonors(
  bloodGroup: Database["public"]["Enums"]["blood_group"],
  latitude: number,
  longitude: number,
  city: string
) {
  const { data, error } = await supabase.functions.invoke('match-donors', {
    body: {
      blood_group: bloodGroup,
      latitude,
      longitude,
      city
    }
  });

  if (error) {
    console.error('Error matching donors:', error);
    throw error;
  }

  return data;
}

/**
 * Call the create-sos-request edge function
 */
export async function createSOSRequest(requestData: {
  blood_group: Database["public"]["Enums"]["blood_group"];
  units_needed: number;
  urgency: Database["public"]["Enums"]["urgency_level"];
  hospital_name: string;
  city: string;
  latitude: number;
  longitude: number;
  patient_id: string;
  notes?: string;
}) {
  const { data, error } = await supabase.functions.invoke('create-sos-request', {
    body: requestData
  });

  if (error) {
    console.error('Error creating SOS request:', error);
    throw error;
  }

  return data;
}

/**
 * Call the update-request-status edge function
 */
export async function updateRequestStatus(
  requestId: string,
  newStatus: Database["public"]["Enums"]["request_status"],
  donorId?: string
) {
  const { data, error } = await supabase.functions.invoke('update-request-status', {
    body: {
      request_id: requestId,
      new_status: newStatus,
      donor_id: donorId
    }
  });

  if (error) {
    console.error('Error updating request status:', error);
    throw error;
  }

  return data;
}

/**
 * Call the get-tracking-data edge function
 */
export async function getTrackingData(requestId: string) {
  const { data, error } = await supabase.functions.invoke('get-tracking-data', {
    body: {
      request_id: requestId
    }
  });

  if (error) {
    console.error('Error getting tracking data:', error);
    throw error;
  }

  return data;
}

/**
 * Call the get-dashboard-stats edge function
 */
export async function getDashboardStats(userId: string, role: Database["public"]["Enums"]["user_role"]) {
  const { data, error } = await supabase.functions.invoke('get-dashboard-stats', {
    body: {
      user_id: userId,
      role
    }
  });

  if (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }

  return data;
}

// ============================================================
// REALTIME SUBSCRIPTION HELPERS
// ============================================================

/**
 * Subscribe to notifications for a specific user
 */
export function subscribeToNotifications(
  userId: string,
  callback: (payload: any) => void
) {
  const subscription = supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe();

  return subscription;
}

/**
 * Subscribe to blood request status updates
 */
export function subscribeToRequestStatus(
  requestId: string,
  callback: (payload: any) => void
) {
  const subscription = supabase
    .channel(`blood_requests:${requestId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'blood_requests',
        filter: `id=eq.${requestId}`
      },
      callback
    )
    .subscribe();

  return subscription;
}

/**
 * Subscribe to donor responses for a specific request
 */
export function subscribeToDonorResponses(
  requestId: string,
  callback: (payload: any) => void
) {
  const subscription = supabase
    .channel(`donor_responses:${requestId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'donor_responses',
        filter: `request_id=eq.${requestId}`
      },
      callback
    )
    .subscribe();

  return subscription;
}

/**
 * Unsubscribe from a channel
 */
export function unsubscribe(subscription: any) {
  supabase.removeChannel(subscription);
}

// ============================================================
// AUTH HELPERS
// ============================================================

/**
 * Sign up a new user with email and password
 */
export async function signUp(
  email: string,
  password: string,
  metadata: {
    name: string;
    phone?: string;
    role?: Database["public"]["Enums"]["user_role"];
  }
) {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: metadata.name,
        phone: metadata.phone || null,
        role: metadata.role || 'donor'
      }
    }
  });
}

/**
 * Sign in an existing user
 */
export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
}

/**
 * Sign out the current user
 */
export async function signOut() {
  return await supabase.auth.signOut();
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  return user;
}

/**
 * Get the current session
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  return session;
}
