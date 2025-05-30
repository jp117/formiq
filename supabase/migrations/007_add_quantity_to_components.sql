-- Add quantity column to components table
ALTER TABLE components 
ADD COLUMN quantity integer NOT NULL DEFAULT 1;

-- Update the quantity column to remove the default after adding it
ALTER TABLE components 
ALTER COLUMN quantity DROP DEFAULT; 