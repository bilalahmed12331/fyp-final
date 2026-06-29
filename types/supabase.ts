// ============================================================
// LIFELINK SUPABASE TYPESCRIPT TYPES
// ============================================================
// This file contains TypeScript types for all Supabase tables
// matching the database schema. Includes Row, Insert, and Update types.
// ============================================================

// ============================================================
// ENUM TYPES
// ============================================================

export type UserRole = 'donor' | 'patient' | 'hospital' | 'admin'
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
export type BadgeLevel = 'none' | 'bronze' | 'silver' | 'gold' | 'lifesaver'
export type UrgencyLevel = 'critical' | 'high' | 'normal'
export type RequestStatus = 'submitted' | 'matching' | 'accepted' | 'en_route' | 'delivered' | 'cancelled'
export type ResponseStatus = 'accepted' | 'rejected' | 'pending'
export type NotificationType = 'sos' | 'request' | 'reward' | 'info'

// ============================================================
// PROFILES TABLE TYPES
// ============================================================

export interface Profile {
  id: string
  name: string
  phone: string | null
  role: UserRole
  city: string | null
  area: string | null
  latitude: number | null
  longitude: number | null
  is_verified: boolean
  created_at: string
}

export interface ProfileInsert {
  id: string
  name: string
  phone?: string | null
  role?: UserRole
  city?: string | null
  area?: string | null
  latitude?: number | null
  longitude?: number | null
  is_verified?: boolean
  created_at?: string
}

export interface ProfileUpdate {
  name?: string
  phone?: string | null
  role?: UserRole
  city?: string | null
  area?: string | null
  latitude?: number | null
  longitude?: number | null
  is_verified?: boolean
}

// ============================================================
// DONORS TABLE TYPES
// ============================================================

export interface Donor {
  id: string
  user_id: string
  blood_group: BloodGroup
  is_available: boolean
  last_donated: string | null
  total_donations: number
  reward_points: number
  badge: BadgeLevel
  cnic: string | null
  created_at: string
}

export interface DonorInsert {
  id?: string
  user_id: string
  blood_group: BloodGroup
  is_available?: boolean
  last_donated?: string | null
  total_donations?: number
  reward_points?: number
  badge?: BadgeLevel
  cnic?: string | null
  created_at?: string
}

export interface DonorUpdate {
  blood_group?: BloodGroup
  is_available?: boolean
  last_donated?: string | null
  total_donations?: number
  reward_points?: number
  badge?: BadgeLevel
  cnic?: string | null
}

// ============================================================
// BLOOD REQUESTS TABLE TYPES
// ============================================================

export interface BloodRequest {
  id: string
  request_code: string
  patient_id: string
  blood_group: BloodGroup
  units_needed: number
  urgency: UrgencyLevel
  hospital_name: string
  city: string
  latitude: number
  longitude: number
  status: RequestStatus
  notes: string | null
  created_at: string
}

export interface BloodRequestInsert {
  id?: string
  request_code: string
  patient_id: string
  blood_group: BloodGroup
  units_needed: number
  urgency?: UrgencyLevel
  hospital_name: string
  city: string
  latitude: number
  longitude: number
  status?: RequestStatus
  notes?: string | null
  created_at?: string
}

export interface BloodRequestUpdate {
  blood_group?: BloodGroup
  units_needed?: number
  urgency?: UrgencyLevel
  hospital_name?: string
  city?: string
  latitude?: number
  longitude?: number
  status?: RequestStatus
  notes?: string | null
}

// ============================================================
// DONOR RESPONSES TABLE TYPES
// ============================================================

export interface DonorResponse {
  id: string
  request_id: string
  donor_id: string
  status: ResponseStatus
  location_lat: number | null
  location_lng: number | null
  responded_at: string
}

export interface DonorResponseInsert {
  id?: string
  request_id: string
  donor_id: string
  status?: ResponseStatus
  location_lat?: number | null
  location_lng?: number | null
  responded_at?: string
}

export interface DonorResponseUpdate {
  status?: ResponseStatus
  location_lat?: number | null
  location_lng?: number | null
}

// ============================================================
// HOSPITALS TABLE TYPES
// ============================================================

export interface Hospital {
  id: string
  user_id: string
  name: string
  address: string | null
  city: string
  latitude: number | null
  longitude: number | null
  phone: string | null
}

export interface HospitalInsert {
  id?: string
  user_id: string
  name: string
  address?: string | null
  city: string
  latitude?: number | null
  longitude?: number | null
  phone?: string | null
}

export interface HospitalUpdate {
  name?: string
  address?: string | null
  city?: string
  latitude?: number | null
  longitude?: number | null
  phone?: string | null
}

// ============================================================
// BLOOD INVENTORY TABLE TYPES
// ============================================================

export interface BloodInventory {
  id: string
  hospital_id: string
  blood_group: BloodGroup
  units: number
  max_units: number
  updated_at: string
}

export interface BloodInventoryInsert {
  id?: string
  hospital_id: string
  blood_group: BloodGroup
  units?: number
  max_units?: number
  updated_at?: string
}

export interface BloodInventoryUpdate {
  units?: number
  max_units?: number
  updated_at?: string
}

// ============================================================
// DONATIONS TABLE TYPES
// ============================================================

export interface Donation {
  id: string
  donor_id: string
  request_id: string | null
  hospital_name: string
  blood_group: BloodGroup
  units: number
  donated_at: string
}

export interface DonationInsert {
  id?: string
  donor_id: string
  request_id?: string | null
  hospital_name: string
  blood_group: BloodGroup
  units: number
  donated_at?: string
}

export interface DonationUpdate {
  request_id?: string | null
  hospital_name?: string
  blood_group?: BloodGroup
  units?: number
  donated_at?: string
}

// ============================================================
// NOTIFICATIONS TABLE TYPES
// ============================================================

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: NotificationType
  is_read: boolean
  created_at: string
}

export interface NotificationInsert {
  id?: string
  user_id: string
  title: string
  message: string
  type?: NotificationType
  is_read?: boolean
  created_at?: string
}

export interface NotificationUpdate {
  title?: string
  message?: string
  type?: NotificationType
  is_read?: boolean
}

// ============================================================
// DATABASE TYPE (Supabase Format)
// ============================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: ProfileInsert
        Update: ProfileUpdate
      }
      donors: {
        Row: Donor
        Insert: DonorInsert
        Update: DonorUpdate
      }
      blood_requests: {
        Row: BloodRequest
        Insert: BloodRequestInsert
        Update: BloodRequestUpdate
      }
      donor_responses: {
        Row: DonorResponse
        Insert: DonorResponseInsert
        Update: DonorResponseUpdate
      }
      hospitals: {
        Row: Hospital
        Insert: HospitalInsert
        Update: HospitalUpdate
      }
      blood_inventory: {
        Row: BloodInventory
        Insert: BloodInventoryInsert
        Update: BloodInventoryUpdate
      }
      donations: {
        Row: Donation
        Insert: DonationInsert
        Update: DonationUpdate
      }
      notifications: {
        Row: Notification
        Insert: NotificationInsert
        Update: NotificationUpdate
      }
    }
  }
}

// ============================================================
// EDGE FUNCTION REQUEST/RESPONSE TYPES
// ============================================================

// Match Donors
export interface MatchDonorsRequest {
  blood_group: BloodGroup
  latitude: number
  longitude: number
  city: string
}

export interface MatchDonorsResponse {
  success: boolean
  donors: Array<{
    id: string
    user_id: string
    blood_group: BloodGroup
    is_available: boolean
    last_donated: string | null
    total_donations: number
    reward_points: number
    badge: BadgeLevel
    name: string
    phone: string
    latitude: number
    longitude: number
    distance_km: number
  }>
  count: number
}

// Create SOS Request
export interface CreateSOSRequest {
  blood_group: BloodGroup
  units_needed: number
  urgency: UrgencyLevel
  hospital_name: string
  city: string
  latitude: number
  longitude: number
  patient_id: string
  notes?: string
}

export interface CreateSOSResponse {
  success: boolean
  request: BloodRequest
  matched_donors: number
}

// Update Request Status
export interface UpdateStatusRequest {
  request_id: string
  new_status: RequestStatus
  donor_id?: string
}

export interface UpdateStatusResponse {
  success: boolean
  message: string
  request_id: string
  new_status: RequestStatus
}

// Get Tracking Data
export interface TrackingRequest {
  request_id: string
}

export interface TrackingResponse {
  success: boolean
  request: BloodRequest
  donor_responses: Array<{
    id: string
    donor_id: string
    status: ResponseStatus
    location_lat: number
    location_lng: number
    responded_at: string
    donor_name: string
    donor_phone: string
    donor_blood_group: BloodGroup
    distance_km: number
  }>
  estimated_arrival?: string
}

// Get Dashboard Stats
export interface DashboardStatsRequest {
  user_id: string
  role: UserRole
}

export interface DashboardStatsResponse {
  success: boolean
  role: UserRole
  donor_stats?: {
    total_donations: number
    reward_points: number
    badge: BadgeLevel
    recent_donations: Array<{
      id: string
      hospital_name: string
      blood_group: BloodGroup
      units: number
      donated_at: string
    }>
    unread_notifications: number
  }
  patient_stats?: {
    total_requests: number
    fulfilled_requests: number
    pending_requests: number
    recent_requests: Array<{
      id: string
      request_code: string
      blood_group: BloodGroup
      units_needed: number
      status: RequestStatus
      created_at: string
    }>
  }
  hospital_stats?: {
    blood_inventory: Array<{
      blood_group: BloodGroup
      units: number
      max_units: number
      percentage: number
    }>
    pending_requests: number
    recent_requests: Array<{
      id: string
      request_code: string
      blood_group: BloodGroup
      units_needed: number
      urgency: UrgencyLevel
      status: RequestStatus
    }>
  }
}
