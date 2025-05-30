-- Add vendor column to purchase_orders table
ALTER TABLE purchase_orders 
ADD COLUMN vendor text NOT NULL DEFAULT '';

-- Update the vendor column to remove the default after adding it
ALTER TABLE purchase_orders 
ALTER COLUMN vendor DROP DEFAULT; 