-- Add quotes_access column to users table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'quotes_access') THEN
        ALTER TABLE users ADD COLUMN quotes_access TEXT NOT NULL DEFAULT 'no_access' 
        CHECK (quotes_access IN ('no_access', 'view_access', 'edit_access', 'admin_access'));
    END IF;
END
$$;

-- Add comment to explain the purpose of the new field
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'quotes_access') THEN
        COMMENT ON COLUMN users.quotes_access IS 'User access level for quotes tool: no_access, view_access, edit_access, admin_access';
    END IF;
END
$$; 