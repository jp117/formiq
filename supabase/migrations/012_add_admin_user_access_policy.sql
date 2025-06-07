-- Add RLS policy to allow admins to view all users
-- This works alongside the existing "Users can view their own profile" policy
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    -- Allow if the requesting user is an admin
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND is_admin = true 
      AND is_approved = true
    )
  ); 