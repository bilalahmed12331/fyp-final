-- ============================================================
-- LIFELINK SUPABASE SAMPLE DATA SEEDING
-- ============================================================
-- This script inserts sample data for testing the LifeLink system.
-- Includes 5 sample donors in Lahore, 2 hospitals, blood inventory,
-- and 2 sample blood requests with different statuses.
-- ============================================================

-- ============================================================
-- INSERT SAMPLE PROFILES FOR DONORS
-- ============================================================

-- Note: In production, these would be created via auth signup
-- For testing, we'll insert profile records directly
-- These UUIDs are placeholders - replace with actual auth.user IDs after signup

INSERT INTO profiles (id, name, phone, role, city, area, latitude, longitude, is_verified) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Ahmed Khan', '+92-300-1234567', 'donor', 'Lahore', 'Gulberg', 31.5204, 74.3587, true),
    ('00000000-0000-0000-0000-000000000002', 'Fatima Ali', '+92-301-2345678', 'donor', 'Lahore', 'DHA', 31.4836, 74.3125, true),
    ('00000000-0000-0000-0000-000000000003', 'Usman Malik', '+92-302-3456789', 'donor', 'Lahore', 'Johar Town', 31.4756, 74.2987, true),
    ('00000000-0000-0000-0000-000000000004', 'Ayesha Rahman', '+92-303-4567890', 'donor', 'Lahore', 'Model Town', 31.5024, 74.3456, true),
    ('00000000-0000-0000-0000-000000000005', 'Hassan Shah', '+92-304-5678901', 'donor', 'Lahore', 'Cantt', 31.5564, 74.3876, true);

-- ============================================================
-- INSERT SAMPLE DONORS
-- ============================================================

INSERT INTO donors (id, user_id, blood_group, is_available, last_donated, total_donations, reward_points, badge, cnic) VALUES
    ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'A+', true, '2025-03-15', 5, 750, 'silver', '38403-1234567-1'),
    ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'B+', true, '2025-04-20', 3, 450, 'bronze', '38403-2345678-2'),
    ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'O-', true, '2025-02-10', 8, 1200, 'gold', '38403-3456789-3'),
    ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 'AB+', true, '2025-05-01', 2, 300, 'bronze', '38403-4567890-4'),
    ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', 'A-', true, '2025-01-25', 6, 900, 'silver', '38403-5678901-5');

-- ============================================================
-- INSERT SAMPLE PROFILES FOR HOSPITALS
-- ============================================================

INSERT INTO profiles (id, name, phone, role, city, area, latitude, longitude, is_verified) VALUES
    ('00000000-0000-0000-0000-000000000006', 'Services Hospital', '+92-42-99200123', 'hospital', 'Lahore', 'Lahore', 31.5456, 74.3589, true),
    ('00000000-0000-0000-0000-000000000007', 'Shaukat Khanum Memorial', '+92-42-35905000', 'hospital', 'Lahore', 'Johar Town', 31.4789, 74.3012, true);

-- ============================================================
-- INSERT SAMPLE HOSPITALS
-- ============================================================

INSERT INTO hospitals (id, user_id, name, address, city, latitude, longitude, phone) VALUES
    ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', 'Services Hospital', 'Near GPO, Mall Road, Lahore', 'Lahore', 31.5456, 74.3589, '+92-42-99200123'),
    ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000007', 'Shaukat Khanum Memorial Cancer Hospital', '3-A, Johar Town, Lahore', 'Lahore', 31.4789, 74.3012, '+92-42-35905000');

-- ============================================================
-- INSERT SAMPLE BLOOD INVENTORY FOR HOSPITALS
-- ============================================================

-- Services Hospital Inventory
INSERT INTO blood_inventory (hospital_id, blood_group, units, max_units) VALUES
    ('20000000-0000-0000-0000-000000000001', 'A+', 25, 100),
    ('20000000-0000-0000-0000-000000000001', 'A-', 15, 50),
    ('20000000-0000-0000-0000-000000000001', 'B+', 30, 100),
    ('20000000-0000-0000-0000-000000000001', 'B-', 10, 50),
    ('20000000-0000-0000-0000-000000000001', 'AB+', 12, 50),
    ('20000000-0000-0000-0000-000000000001', 'AB-', 8, 30),
    ('20000000-0000-0000-0000-000000000001', 'O+', 40, 100),
    ('20000000-0000-0000-0000-000000000001', 'O-', 20, 50);

-- Shaukat Khanum Inventory
INSERT INTO blood_inventory (hospital_id, blood_group, units, max_units) VALUES
    ('20000000-0000-0000-0000-000000000002', 'A+', 35, 100),
    ('20000000-0000-0000-0000-000000000002', 'A-', 18, 50),
    ('20000000-0000-0000-0000-000000000002', 'B+', 28, 100),
    ('20000000-0000-0000-0000-000000000002', 'B-', 12, 50),
    ('20000000-0000-0000-0000-000000000002', 'AB+', 15, 50),
    ('20000000-0000-0000-0000-000000000002', 'AB-', 10, 30),
    ('20000000-0000-0000-0000-000000000002', 'O+', 45, 100),
    ('20000000-0000-0000-0000-000000000002', 'O-', 25, 50);

-- ============================================================
-- INSERT SAMPLE PROFILES FOR PATIENTS
-- ============================================================

INSERT INTO profiles (id, name, phone, role, city, area, latitude, longitude, is_verified) VALUES
    ('00000000-0000-0000-0000-000000000008', 'Sara Ahmed', '+92-305-6789012', 'patient', 'Lahore', 'Gulberg', 31.5210, 74.3590, true),
    ('00000000-0000-0000-0000-000000000009', 'Imran Qureshi', '+92-306-7890123', 'patient', 'Lahore', 'DHA', 31.4840, 74.3130, true);

-- ============================================================
-- INSERT SAMPLE BLOOD REQUESTS
-- ============================================================

-- Request 1: Submitted status
INSERT INTO blood_requests (id, request_code, patient_id, blood_group, units_needed, urgency, hospital_name, city, latitude, longitude, status, notes) VALUES
    ('30000000-0000-0000-0000-000000000001', 'LL-12345', '00000000-0000-0000-0000-000000000008', 'A+', 2, 'critical', 'Services Hospital', 'Lahore', 31.5456, 74.3589, 'submitted', 'Emergency surgery required');

-- Request 2: Accepted status with donor response
INSERT INTO blood_requests (id, request_code, patient_id, blood_group, units_needed, urgency, hospital_name, city, latitude, longitude, status, notes) VALUES
    ('30000000-0000-0000-0000-000000000002', 'LL-12346', '00000000-0000-0000-0000-000000000009', 'B+', 1, 'high', 'Shaukat Khanum Memorial', 'Lahore', 31.4789, 74.3012, 'accepted', 'Cancer patient needs blood');

-- ============================================================
-- INSERT SAMPLE DONOR RESPONSES
-- ============================================================

-- Response for Request 2 (accepted)
INSERT INTO donor_responses (id, request_id, donor_id, status, location_lat, location_lng, responded_at) VALUES
    ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'accepted', 31.4836, 74.3125, NOW() - INTERVAL '2 hours');

-- ============================================================
-- INSERT SAMPLE DONATIONS
-- ============================================================

-- Sample donation records for donors
INSERT INTO donations (id, donor_id, request_id, hospital_name, blood_group, units, donated_at) VALUES
    ('50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', NULL, 'Services Hospital', 'A+', 1, '2025-03-15'),
    ('50000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', NULL, 'Shaukat Khanum Memorial', 'A+', 1, '2025-04-10'),
    ('50000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', NULL, 'Services Hospital', 'O-', 1, '2025-02-10'),
    ('50000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003', NULL, 'Shaukat Khanum Memorial', 'O-', 1, '2025-03-20');

-- ============================================================
-- INSERT SAMPLE NOTIFICATIONS
-- ============================================================

-- Notifications for sample users
INSERT INTO notifications (id, user_id, title, message, type, is_read) VALUES
    ('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'New Blood Request', 'There is a critical blood request for A+ in your area.', 'request', false),
    ('60000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Reward Earned', 'You earned 150 reward points for your donation!', 'reward', true),
    ('60000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000008', 'Donor Found', 'A donor has accepted your blood request LL-12345.', 'request', false),
    ('60000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000009', 'SOS Alert', 'Your blood request LL-12346 has been accepted.', 'sos', false);

-- ============================================================
-- END OF SAMPLE DATA SEEDING SCRIPT
-- ============================================================
