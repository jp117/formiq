-- Add production_schedule_access column to users table (if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'production_schedule_access') THEN
        ALTER TABLE users ADD COLUMN production_schedule_access TEXT NOT NULL DEFAULT 'no_access' 
        CHECK (production_schedule_access IN ('no_access', 'view_access', 'edit_access', 'admin_access'));
    END IF;
END
$$;

-- Add frame_parts_access column to users table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'frame_parts_access') THEN
        ALTER TABLE users ADD COLUMN frame_parts_access TEXT NOT NULL DEFAULT 'no_access' 
        CHECK (frame_parts_access IN ('no_access', 'view_access', 'edit_access', 'admin_access'));
    END IF;
END
$$;

-- Add comments to explain the purpose of the new fields
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'production_schedule_access') THEN
        COMMENT ON COLUMN users.production_schedule_access IS 'User access level for production schedule tool: no_access, view_access, edit_access, admin_access';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'frame_parts_access') THEN
        COMMENT ON COLUMN users.frame_parts_access IS 'User access level for frame parts tool: no_access, view_access, edit_access, admin_access';
    END IF;
END
$$; 