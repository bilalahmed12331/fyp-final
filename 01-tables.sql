-- ============================================================
-- LIFELINK SUPABASE DATABASE TABLES
-- ============================================================
-- This script creates all required tables for the LifeLink
-- blood donation and emergency healthcare system.
-- ============================================================

-- Create ENUM types for various columns
-- ============================================================

-- Role enum for profiles table
CREATE TYPE user_role AS ENUM ('donor', 'patient', 'hospital', 'admin');

-- Blood group enum
CREATE TYPE blood_group AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');

-- Badge enum for donors
CREATE TYPE badge_level AS ENUM ('none', 'bronze', 'silver', 'gold', 'lifesaver');

-- Urgency enum for blood requests
CREATE TYPE urgency_level AS ENUM ('critical', 'high', 'normal');

-- Status enum for blood requests
CREATE TYPE request_status AS ENUM ('submitted', 'matching', 'accepted', 'en_route', 'delivered', 'cancelled');

-- Response status enum for donor responses
CREATE TYPE response_status AS ENUM ('accepted', 'rejected', 'pending');

-- Notification type enum
CREATE TYPE notification_type AS ENUM ('sos', 'request', 'reward', 'info');

-- ============================================================
-- TABLE 1: PROFILES
-- ============================================================
-- Stores user profile information linked to auth.users
-- ============================================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'donor',
    city TEXT,
    area TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX idx_profiles_city ON profiles(city);
CREATE INDEX idx_profiles_role ON profiles(role);

-- ============================================================
-- TABLE 2: DONORS
-- ============================================================
-- Stores donor-specific information including blood group and stats
-- ============================================================

CREATE TABLE donors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    blood_group blood_group NOT NULL,
    is_available BOOLEAN DEFAULT true,
    last_donated DATE,
    total_donations INTEGER DEFAULT 0,
    reward_points INTEGER DEFAULT 0,
    badge badge_level DEFAULT 'none',
    cnic TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for filtering
CREATE INDEX idx_donors_blood_group ON donors(blood_group);
CREATE INDEX idx_donors_is_available ON donors(is_available);
CREATE INDEX idx_donors_user_id ON donors(user_id);

-- ============================================================
-- TABLE 3: BLOOD REQUESTS
-- ============================================================
-- Stores emergency blood requests with tracking status
-- ============================================================

CREATE TABLE blood_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_code TEXT UNIQUE NOT NULL,
    patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    blood_group blood_group NOT NULL,
    units_needed INTEGER NOT NULL,
    urgency urgency_level NOT NULL DEFAULT 'normal',
    hospital_name TEXT,
    city TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status request_status DEFAULT 'submitted',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for filtering and sorting
CREATE INDEX idx_blood_requests_patient_id ON blood_requests(patient_id);
CREATE INDEX idx_blood_requests_status ON blood_requests(status);
CREATE INDEX idx_blood_requests_city ON blood_requests(city);
CREATE INDEX idx_blood_requests_blood_group ON blood_requests(blood_group);
CREATE INDEX idx_blood_requests_created_at ON blood_requests(created_at DESC);

-- ============================================================
-- TABLE 4: DONOR RESPONSES
-- ============================================================
-- Stores donor responses to blood requests
-- ============================================================

CREATE TABLE donor_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES blood_requests(id) ON DELETE CASCADE,
    donor_id UUID NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
    status response_status DEFAULT 'pending',
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    responded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for filtering
CREATE INDEX idx_donor_responses_request_id ON donor_responses(request_id);
CREATE INDEX idx_donor_responses_donor_id ON donor_responses(donor_id);
CREATE INDEX idx_donor_responses_status ON donor_responses(status);

-- ============================================================
-- TABLE 5: HOSPITALS
-- ============================================================
-- Stores hospital information linked to profiles
-- ============================================================

CREATE TABLE hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT,
    city TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone TEXT
);

-- Add indexes for filtering
CREATE INDEX idx_hospitals_city ON hospitals(city);
CREATE INDEX idx_hospitals_user_id ON hospitals(user_id);

-- ============================================================
-- TABLE 6: BLOOD INVENTORY
-- ============================================================
-- Stores blood inventory levels for each hospital
-- ============================================================

CREATE TABLE blood_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    blood_group blood_group NOT NULL,
    units INTEGER NOT NULL DEFAULT 0,
    max_units INTEGER NOT NULL DEFAULT 100,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(hospital_id, blood_group)
);

-- Add indexes for filtering
CREATE INDEX idx_blood_inventory_hospital_id ON blood_inventory(hospital_id);
CREATE INDEX idx_blood_inventory_blood_group ON blood_inventory(blood_group);

-- ============================================================
-- TABLE 7: DONATIONS
-- ============================================================
-- Records completed donations
-- ============================================================

CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id UUID NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
    request_id UUID REFERENCES blood_requests(id) ON DELETE SET NULL,
    hospital_name TEXT NOT NULL,
    blood_group blood_group NOT NULL,
    units INTEGER NOT NULL,
    donated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for filtering
CREATE INDEX idx_donations_donor_id ON donations(donor_id);
CREATE INDEX idx_donations_donated_at ON donations(donated_at DESC);

-- ============================================================
-- TABLE 8: NOTIFICATIONS
-- ============================================================
-- Stores user notifications
-- ============================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for filtering
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================================
-- ENABLE REALTIME SUBSCRIPTIONS
-- ============================================================
-- Enable realtime on tables that need live updates

ALTER PUBLICATION supabase_realtime ADD TABLE blood_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE donor_responses;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ============================================================
-- END OF TABLE CREATION SCRIPT
-- ============================================================
