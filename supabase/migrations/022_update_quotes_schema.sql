-- Add missing fields to quotes table
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS quote_name TEXT NOT NULL DEFAULT '';
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS due_date DATE;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS domestic_requirements TEXT CHECK (domestic_requirements IN ('yes', 'no'));
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS wbe_requirements TEXT CHECK (wbe_requirements IN ('yes', 'no'));

-- Create a sequence for quote numbers
CREATE SEQUENCE IF NOT EXISTS quote_number_seq START 1;

-- Create a function to generate the next quote number in ATL-xxxxxx format
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TEXT AS $$
DECLARE
    next_number INTEGER;
    quote_number TEXT;
BEGIN
    -- Get the next sequence value
    SELECT nextval('quote_number_seq') INTO next_number;
    
    -- Format as ATL-xxxxxx (6 digits with leading zeros)
    quote_number := 'ATL-' || LPAD(next_number::TEXT, 6, '0');
    
    RETURN quote_number;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically set quote_number on insert
CREATE OR REPLACE FUNCTION set_quote_number()
RETURNS TRIGGER AS $$
BEGIN
    -- Only set quote_number if it's not already provided
    IF NEW.quote_number IS NULL OR NEW.quote_number = '' THEN
        NEW.quote_number := generate_quote_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS set_quote_number_trigger ON quotes;
CREATE TRIGGER set_quote_number_trigger
    BEFORE INSERT ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION set_quote_number();

-- Update the quote_number column to not allow null values
ALTER TABLE quotes ALTER COLUMN quote_number DROP DEFAULT;
ALTER TABLE quotes ALTER COLUMN quote_number SET NOT NULL;

-- Add comments to explain the new fields
COMMENT ON COLUMN quotes.quote_name IS 'Display name for the quote';
COMMENT ON COLUMN quotes.due_date IS 'Due date for the quote';
COMMENT ON COLUMN quotes.domestic_requirements IS 'Whether domestic requirements apply (yes/no)';
COMMENT ON COLUMN quotes.wbe_requirements IS 'Whether WBE requirements apply (yes/no)';
COMMENT ON COLUMN quotes.quote_number IS 'Auto-generated quote number in ATL-xxxxxx format';

-- Create an index on quote_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_quotes_quote_number ON quotes(quote_number); 