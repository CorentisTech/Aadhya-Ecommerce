-- Add new roles to user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'editor';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'support';

-- Add admin management fields to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

-- Add active flag to user_devices for Single-Device Policy
ALTER TABLE user_devices
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS session_version VARCHAR(255);

-- Index for fast lookup of active devices
CREATE INDEX IF NOT EXISTS idx_user_devices_active ON user_devices(user_id, is_active) WHERE is_active = true;

-- Function to handle new login (revokes old devices)
CREATE OR REPLACE FUNCTION handle_new_device_login(p_user_id UUID, p_device_id VARCHAR, p_session_version VARCHAR)
RETURNS VOID AS $$
BEGIN
    -- Revoke all existing active devices for this user
    UPDATE user_devices 
    SET is_active = false, revoked_at = NOW() 
    WHERE user_id = p_user_id AND is_active = true;
    
    -- Insert or update the new device
    INSERT INTO user_devices (user_id, device_id, session_version, is_active, last_active, created_at)
    VALUES (p_user_id, p_device_id, p_session_version, true, NOW(), NOW())
    ON CONFLICT (user_id, device_id) 
    DO UPDATE SET 
        session_version = EXCLUDED.session_version,
        is_active = true,
        last_active = NOW(),
        revoked_at = NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
