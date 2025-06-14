-- Remove sell_price column and add markup_percentage
ALTER TABLE quote_components DROP COLUMN IF EXISTS sell_price;
ALTER TABLE quote_components ADD COLUMN markup_percentage DECIMAL(5,2) DEFAULT 0 NOT NULL;

-- Add a computed column or view for sell_price calculation
-- Note: We'll calculate sell_price in the application layer as: cost * (1 + markup_percentage / 100) 