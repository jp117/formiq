-- Remove customer data fields (kept in CRM)
ALTER TABLE quotes DROP COLUMN IF EXISTS customer_name;
ALTER TABLE quotes DROP COLUMN IF EXISTS customer_email;
ALTER TABLE quotes DROP COLUMN IF EXISTS customer_phone;

-- Ensure notes column exists and is properly named
-- (notes column should already exist from previous migrations)

-- Update the status column to have a default of 'draft'
ALTER TABLE quotes ALTER COLUMN status SET DEFAULT 'draft';

-- Add comments to clarify the cleaned up schema
COMMENT ON COLUMN quotes.quote_name IS 'Display name for the quote (required)';
COMMENT ON COLUMN quotes.notes IS 'Optional description/notes for the quote';
COMMENT ON COLUMN quotes.status IS 'Quote status (draft, pending, approved, rejected)';
COMMENT ON COLUMN quotes.domestic_requirements IS 'Whether domestic requirements apply (required: yes/no)';
COMMENT ON COLUMN quotes.wbe_requirements IS 'Whether WBE requirements apply (required: yes/no)';

-- Create a check constraint for status values
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'quotes_status_check'
    ) THEN
        ALTER TABLE quotes ADD CONSTRAINT quotes_status_check 
        CHECK (status IN ('draft', 'pending', 'approved', 'rejected'));
    END IF;
END
$$; 