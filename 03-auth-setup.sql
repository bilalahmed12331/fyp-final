-- ============================================================
-- LIFELINK SUPABASE AUTH SETUP AND TRIGGERS
-- ============================================================
-- This script sets up authentication and creates triggers
-- to automatically create profile records when users sign up.
-- ============================================================

-- ============================================================
-- ENABLE EMAIL AND PASSWORD AUTHENTICATION
-- ============================================================
-- Note: Email authentication is enabled by default in Supabase.
-- You can verify this in the Supabase Dashboard under:
-- Authentication > Providers > Email

-- ============================================================
-- CREATE FUNCTION TO HANDLE NEW USER SIGNUP
-- ============================================================
-- This function automatically creates a profile record when a new
-- user signs up, using metadata from the signup request.

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert a new profile record using the user's metadata
    INSERT INTO profiles (id, name, phone, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', 'Anonymous'),
        COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
        COALESCE(NEW.raw_user_meta_data->>'role', 'donor')::user_role
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- CREATE TRIGGER TO CALL THE FUNCTION ON SIGNUP
-- ============================================================
-- This trigger fires after a new user is created in auth.users

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- CREATE HELPER FUNCTION TO UPDATE USER METADATA
-- ============================================================
-- This function allows updating user profile information safely

CREATE OR REPLACE FUNCTION update_profile_metadata(
    p_id UUID,
    p_name TEXT,
    p_phone TEXT,
    p_role user_role,
    p_city TEXT,
    p_area TEXT,
    p_latitude DECIMAL,
    p_longitude DECIMAL
)
RETURNS VOID AS $$
BEGIN
    UPDATE profiles
    SET 
        name = COALESCE(p_name, name),
        phone = COALESCE(p_phone, phone),
        role = COALESCE(p_role, role),
        city = COALESCE(p_city, city),
        area = COALESCE(p_area, area),
        latitude = COALESCE(p_latitude, latitude),
        longitude = COALESCE(p_longitude, longitude)
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- CREATE FUNCTION TO GENERATE UNIQUE REQUEST CODE
-- ============================================================
-- This function generates a unique request code in format LL-XXXXX

CREATE OR REPLACE FUNCTION generate_request_code()
RETURNS TEXT AS $$
DECLARE
    random_num INTEGER;
    request_code TEXT;
    code_exists BOOLEAN;
BEGIN
    -- Generate a unique code
    LOOP
        random_num := FLOOR(RANDOM() * 90000) + 10000;
        request_code := 'LL-' || random_num;
        
        -- Check if code already exists
        SELECT EXISTS(
            SELECT 1 FROM blood_requests WHERE request_code = request_code
        ) INTO code_exists;
        
        -- If code doesn't exist, return it
        IF NOT code_exists THEN
            RETURN request_code;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- CREATE FUNCTION TO UPDATE DONOR BADGE BASED ON POINTS
-- ============================================================
-- This function automatically updates donor badge based on reward points

CREATE OR REPLACE FUNCTION update_donor_badge(p_donor_id UUID)
RETURNS VOID AS $$
DECLARE
    current_points INTEGER;
BEGIN
    -- Get current reward points
    SELECT reward_points INTO current_points
    FROM donors
    WHERE id = p_donor_id;
    
    -- Update badge based on points thresholds
    UPDATE donors
    SET badge = CASE
        WHEN current_points >= 2000 THEN 'lifesaver'
        WHEN current_points >= 1000 THEN 'gold'
        WHEN current_points >= 500 THEN 'silver'
        WHEN current_points >= 100 THEN 'bronze'
        ELSE 'none'
    END::badge_level
    WHERE id = p_donor_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- CREATE FUNCTION TO CALCULATE DISTANCE BETWEEN TWO POINTS
-- ============================================================
-- Uses Haversine formula to calculate distance in kilometers

CREATE OR REPLACE FUNCTION calculate_distance(
    lat1 DECIMAL,
    lon1 DECIMAL,
    lat2 DECIMAL,
    lon2 DECIMAL
)
RETURNS DECIMAL AS $$
DECLARE
    R DECIMAL := 6371; -- Earth's radius in km
    dLat DECIMAL;
    dLon DECIMAL;
    a DECIMAL;
    c DECIMAL;
BEGIN
    -- Convert to radians
    dLat := RADIANS(lat2 - lat1);
    dLon := RADIANS(lon2 - lon1);
    
    -- Haversine formula
    a := SIN(dLat / 2) * SIN(dLat / 2) +
         COS(RADIANS(lat1)) * COS(RADIANS(lat2)) *
         SIN(dLon / 2) * SIN(dLon / 2);
    
    c := 2 * ASIN(SQRT(a));
    
    RETURN R * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================
-- CREATE FUNCTION TO GET COMPATIBLE BLOOD GROUPS
-- ============================================================
-- Returns all blood groups that can donate to the requested group

CREATE OR REPLACE FUNCTION get_compatible_donors(p_blood_group blood_group)
RETURNS blood_group[] AS $$
BEGIN
    -- Blood group compatibility matrix
    -- O- can donate to all
    -- O+ can donate to O+, A+, B+, AB+
    -- A- can donate to A-, A+, AB-, AB+
    -- A+ can donate to A+, AB+
    -- B- can donate to B-, B+, AB-, AB+
    -- B+ can donate to B+, AB+
    -- AB- can donate to AB-, AB+
    -- AB+ can only receive from all (cannot donate to others)
    
    CASE p_blood_group
        WHEN 'A+' THEN
            RETURN ARRAY['O-', 'O+', 'A-', 'A+']::blood_group[];
        WHEN 'A-' THEN
            RETURN ARRAY['O-', 'A-']::blood_group[];
        WHEN 'B+' THEN
            RETURN ARRAY['O-', 'O+', 'B-', 'B+']::blood_group[];
        WHEN 'B-' THEN
            RETURN ARRAY['O-', 'B-']::blood_group[];
        WHEN 'AB+' THEN
            RETURN ARRAY['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']::blood_group[];
        WHEN 'AB-' THEN
            RETURN ARRAY['O-', 'A-', 'B-', 'AB-']::blood_group[];
        WHEN 'O+' THEN
            RETURN ARRAY['O-', 'O+']::blood_group[];
        WHEN 'O-' THEN
            RETURN ARRAY['O-']::blood_group[];
        ELSE
            RETURN ARRAY[]::blood_group[];
    END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================
-- END OF AUTH SETUP SCRIPT
-- ============================================================
