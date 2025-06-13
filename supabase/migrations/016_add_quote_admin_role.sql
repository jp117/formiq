-- Add quote_admin column to users table
ALTER TABLE users ADD COLUMN is_quote_admin BOOLEAN DEFAULT FALSE;

-- Create RLS policy for quote components
CREATE POLICY "Quote admins can view quote components" ON quote_components
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (is_admin = true OR is_quote_admin = true)
    )
  );

CREATE POLICY "Quote admins can insert quote components" ON quote_components
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (is_admin = true OR is_quote_admin = true)
    )
  );

CREATE POLICY "Quote admins can update quote components" ON quote_components
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (is_admin = true OR is_quote_admin = true)
    )
  );

CREATE POLICY "Quote admins can delete quote components" ON quote_components
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (is_admin = true OR is_quote_admin = true)
    )
  ); 