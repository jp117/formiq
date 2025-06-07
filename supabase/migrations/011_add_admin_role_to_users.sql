-- Add is_admin column to users table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_admin') THEN
        ALTER TABLE users ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT FALSE;
    END IF;
END
$$;

-- Add comment to explain the purpose of the new field
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_admin') THEN
        COMMENT ON COLUMN users.is_admin IS 'Whether the user has admin privileges to manage other users';
    END IF;
END
$$; 