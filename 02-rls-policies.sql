-- ============================================================
-- LIFELINK SUPABASE ROW LEVEL SECURITY POLICIES
-- ============================================================
-- This script creates RLS policies for all tables to ensure
-- proper data access control based on user roles and ownership.
-- ============================================================

-- Enable RLS on all tables
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE donor_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES TABLE POLICIES
-- ============================================================
-- Policy: Users can read all profiles but only update their own
-- ============================================================

-- Allow all authenticated users to read all profiles
CREATE POLICY "profiles_read_all" ON profiles
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow users to update only their own profile
CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- Allow users to insert their own profile (for signup trigger)
CREATE POLICY "profiles_insert_own" ON profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- ============================================================
-- DONORS TABLE POLICIES
-- ============================================================
-- Policy: Anyone can read but only the donor can update their own record
-- ============================================================

-- Allow all authenticated users to read donor information
CREATE POLICY "donors_read_all" ON donors
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow donors to update only their own record
CREATE POLICY "donors_update_own" ON donors
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = donors.user_id
            AND profiles.id = auth.uid()
        )
    );

-- Allow donors to insert their own record
CREATE POLICY "donors_insert_own" ON donors
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = donors.user_id
            AND profiles.id = auth.uid()
        )
    );

-- ============================================================
-- BLOOD REQUESTS TABLE POLICIES
-- ============================================================
-- Policy: Authenticated users can insert and anyone can read
-- but only the patient who created it can update it
-- ============================================================

-- Allow all authenticated users to read blood requests
CREATE POLICY "blood_requests_read_all" ON blood_requests
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to insert blood requests
CREATE POLICY "blood_requests_insert_authenticated" ON blood_requests
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow only the patient who created the request to update it
CREATE POLICY "blood_requests_update_own" ON blood_requests
    FOR UPDATE
    TO authenticated
    USING (patient_id = auth.uid());

-- ============================================================
-- DONOR RESPONSES TABLE POLICIES
-- ============================================================
-- Policy: Donors can insert and update their own responses
-- and patients can read responses to their requests
-- ============================================================

-- Allow donors to read their own responses
CREATE POLICY "donor_responses_read_own" ON donor_responses
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM donors
            WHERE donors.id = donor_responses.donor_id
            AND donors.user_id = auth.uid()
        )
    );

-- Allow patients to read responses to their requests
CREATE POLICY "donor_responses_read_patient" ON donor_responses
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM blood_requests
            WHERE blood_requests.id = donor_responses.request_id
            AND blood_requests.patient_id = auth.uid()
        )
    );

-- Allow donors to insert their own responses
CREATE POLICY "donor_responses_insert_own" ON donor_responses
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM donors
            WHERE donors.id = donor_responses.donor_id
            AND donors.user_id = auth.uid()
        )
    );

-- Allow donors to update their own responses
CREATE POLICY "donor_responses_update_own" ON donor_responses
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM donors
            WHERE donors.id = donor_responses.donor_id
            AND donors.user_id = auth.uid()
        )
    );

-- ============================================================
-- HOSPITALS TABLE POLICIES
-- ============================================================
-- Policy: Anyone can read but only the hospital owner can update
-- ============================================================

-- Allow all authenticated users to read hospital information
CREATE POLICY "hospitals_read_all" ON hospitals
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow hospital owners to update their own hospital
CREATE POLICY "hospitals_update_own" ON hospitals
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = hospitals.user_id
            AND profiles.id = auth.uid()
        )
    );

-- Allow hospital owners to insert their own hospital
CREATE POLICY "hospitals_insert_own" ON hospitals
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = hospitals.user_id
            AND profiles.id = auth.uid()
        )
    );

-- ============================================================
-- BLOOD INVENTORY TABLE POLICIES
-- ============================================================
-- Policy: Anyone can read but only hospital owners can update
-- ============================================================

-- Allow all authenticated users to read blood inventory
CREATE POLICY "blood_inventory_read_all" ON blood_inventory
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow hospital owners to update their hospital's inventory
CREATE POLICY "blood_inventory_update_own" ON blood_inventory
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM hospitals
            WHERE hospitals.id = blood_inventory.hospital_id
            AND hospitals.user_id = auth.uid()
        )
    );

-- Allow hospital owners to insert inventory for their hospital
CREATE POLICY "blood_inventory_insert_own" ON blood_inventory
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM hospitals
            WHERE hospitals.id = blood_inventory.hospital_id
            AND hospitals.user_id = auth.uid()
        )
    );

-- ============================================================
-- DONATIONS TABLE POLICIES
-- ============================================================
-- Policy: Donors can insert their own and anyone can read
-- ============================================================

-- Allow all authenticated users to read donation records
CREATE POLICY "donations_read_all" ON donations
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow donors to insert their own donation records
CREATE POLICY "donations_insert_own" ON donations
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM donors
            WHERE donors.id = donations.donor_id
            AND donors.user_id = auth.uid()
        )
    );

-- ============================================================
-- NOTIFICATIONS TABLE POLICIES
-- ============================================================
-- Policy: Users can only read and update their own notifications
-- ============================================================

-- Allow users to read only their own notifications
CREATE POLICY "notifications_read_own" ON notifications
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Allow users to update only their own notifications (mark as read)
CREATE POLICY "notifications_update_own" ON notifications
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

-- Allow system to insert notifications for users
CREATE POLICY "notifications_insert_system" ON notifications
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- ============================================================
-- END OF RLS POLICIES SCRIPT
-- ============================================================
