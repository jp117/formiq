-- Fix the admin user access policy that's causing issues
-- First drop the problematic policy
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Recreate the policy with proper logic that doesn't interfere with self-access
-- RLS policies are OR-ed together, so this will work alongside the existing "Users can view their own profile" policy
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    -- Allow if the requesting user is an admin AND approved
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND is_admin = true 
      AND is_approved = true
    )
  ); 