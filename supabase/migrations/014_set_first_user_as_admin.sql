-- Set the first approved user as admin
-- This is useful for bootstrapping the admin system
UPDATE users 
SET is_admin = true 
WHERE is_approved = true 
AND id = (
  SELECT id 
  FROM users 
  WHERE is_approved = true 
  ORDER BY created_at ASC 
  LIMIT 1
); 