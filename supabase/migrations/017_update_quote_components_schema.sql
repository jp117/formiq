-- Create the set_updated_at() function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing quote_components table and recreate with new schema
DROP TABLE IF EXISTS quote_components;

CREATE TABLE quote_components (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(255) NOT NULL,
  vendor VARCHAR(255) NOT NULL,
  catalog_number VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  sell_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE quote_components ENABLE ROW LEVEL SECURITY;

-- Allow quote admins to view quote components
CREATE POLICY "Quote admins can view quote components" ON quote_components
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (is_admin = true OR is_quote_admin = true)
    )
  );

-- Allow quote admins to insert quote components
CREATE POLICY "Quote admins can insert quote components" ON quote_components
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (is_admin = true OR is_quote_admin = true)
    )
  );

-- Allow quote admins to update quote components
CREATE POLICY "Quote admins can update quote components" ON quote_components
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (is_admin = true OR is_quote_admin = true)
    )
  );

-- Allow quote admins to delete quote components
CREATE POLICY "Quote admins can delete quote components" ON quote_components
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (is_admin = true OR is_quote_admin = true)
    )
  );

-- Create updated_at trigger
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON quote_components
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Create index on type for faster filtering
CREATE INDEX idx_quote_components_type ON quote_components(type);

-- Create index on vendor for faster filtering
CREATE INDEX idx_quote_components_vendor ON quote_components(vendor);

-- Create index on catalog_number for faster lookups
CREATE INDEX idx_quote_components_catalog_number ON quote_components(catalog_number); 