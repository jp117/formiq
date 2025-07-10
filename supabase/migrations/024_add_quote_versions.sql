-- Add version fields to quotes table (only if they don't exist)
DO $$
BEGIN
    -- Add version column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'version') THEN
        ALTER TABLE quotes ADD COLUMN version TEXT NOT NULL DEFAULT 'Original';
    ELSE
        -- If column exists but is INTEGER, convert it to TEXT
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'version' AND data_type = 'integer') THEN
            -- Drop dependent views first
            DROP VIEW IF EXISTS quote_versions;
            
            -- Now we can safely alter the column type
            ALTER TABLE quotes ALTER COLUMN version TYPE TEXT USING CASE 
                WHEN version = 1 THEN 'Original'
                ELSE 'v' || version::TEXT
            END;
        END IF;
    END IF;
    
    -- Add parent_quote_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'parent_quote_id') THEN
        ALTER TABLE quotes ADD COLUMN parent_quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE;
    END IF;
    
    -- Add version_notes column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'version_notes') THEN
        ALTER TABLE quotes ADD COLUMN version_notes TEXT;
    END IF;
END
$$;

-- Create indexes for version lookups (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_quotes_parent_quote_id ON quotes(parent_quote_id);
CREATE INDEX IF NOT EXISTS idx_quotes_version ON quotes(version);

-- Add comments (only if columns exist)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'version') THEN
        COMMENT ON COLUMN quotes.version IS 'Version name for this quote (e.g., "Original", "100% Construction Drawings", "bulletin 1")';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'parent_quote_id') THEN
        COMMENT ON COLUMN quotes.parent_quote_id IS 'Reference to original quote for version tracking';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'version_notes') THEN
        COMMENT ON COLUMN quotes.version_notes IS 'Notes about changes made in this version';
    END IF;
END
$$;

-- Create function to check if version name exists for a quote family
CREATE OR REPLACE FUNCTION version_exists_for_quote_family(parent_id UUID, version_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    version_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO version_count
    FROM quotes 
    WHERE (parent_quote_id = parent_id OR id = parent_id)
    AND version = version_name;
    
    RETURN version_count > 0;
END;
$$ LANGUAGE plpgsql;

-- Drop existing function if it exists (with any signature)
DO $$
DECLARE
    func_name text;
BEGIN
    -- Drop all versions of create_quote_version function
    FOR func_name IN 
        SELECT 'create_quote_version(' || pg_get_function_identity_arguments(oid) || ')'
        FROM pg_proc 
        WHERE proname = 'create_quote_version'
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS ' || func_name;
    END LOOP;
END
$$;

-- Create function to create new quote version
CREATE OR REPLACE FUNCTION create_quote_version(
    original_quote_id UUID,
    version_name TEXT,
    new_quote_name TEXT DEFAULT NULL,
    new_due_date DATE DEFAULT NULL,
    new_notes TEXT DEFAULT NULL,
    new_domestic_requirements TEXT DEFAULT NULL,
    new_wbe_requirements TEXT DEFAULT NULL,
    version_notes_param TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    original_quote RECORD;
    new_quote_id UUID;
    root_quote_id UUID;
BEGIN
    -- Validate version name is provided
    IF version_name IS NULL OR TRIM(version_name) = '' THEN
        RAISE EXCEPTION 'Version name is required';
    END IF;
    
    -- Get the original quote data
    SELECT * INTO original_quote FROM quotes WHERE id = original_quote_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Quote not found: %', original_quote_id;
    END IF;
    
    -- Determine root quote (if this is already a version, use its parent)
    IF original_quote.parent_quote_id IS NOT NULL THEN
        root_quote_id := original_quote.parent_quote_id;
    ELSE
        root_quote_id := original_quote_id;
    END IF;
    
    -- Check if version name already exists in this quote family
    IF version_exists_for_quote_family(root_quote_id, TRIM(version_name)) THEN
        RAISE EXCEPTION 'Version name "%" already exists for this quote family', TRIM(version_name);
    END IF;
    
    -- Create new quote version
    INSERT INTO quotes (
        company_id,
        quote_name,
        due_date,
        status,
        total_amount,
        notes,
        domestic_requirements,
        wbe_requirements,
        created_by,
        version,
        parent_quote_id,
        version_notes
    ) VALUES (
        original_quote.company_id,
        COALESCE(new_quote_name, original_quote.quote_name),
        COALESCE(new_due_date, original_quote.due_date),
        'draft', -- New versions always start as draft
        0, -- Reset total amount
        COALESCE(new_notes, original_quote.notes),
        COALESCE(new_domestic_requirements, original_quote.domestic_requirements),
        COALESCE(new_wbe_requirements, original_quote.wbe_requirements),
        auth.uid(),
        TRIM(version_name),
        root_quote_id,
        version_notes_param
    ) RETURNING id INTO new_quote_id;
    
    RETURN new_quote_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add some sample version data for existing quotes (optional)
-- This will make the first version of existing quotes show as "Original"
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'version') THEN
        UPDATE quotes SET version = 'Original' WHERE version IS NULL OR version = '';
    END IF;
END
$$;

-- Create view for getting quote versions with hierarchy
CREATE OR REPLACE VIEW quote_versions AS
SELECT 
    q.*,
    CASE 
        WHEN q.parent_quote_id IS NULL THEN q.id
        ELSE q.parent_quote_id
    END as root_quote_id,
    creator.first_name || ' ' || creator.last_name as creator_name
FROM quotes q
LEFT JOIN users creator ON q.created_by = creator.id
ORDER BY 
    CASE 
        WHEN q.parent_quote_id IS NULL THEN q.id
        ELSE q.parent_quote_id
    END,
    q.version;

-- Enable RLS on the new function (it inherits from quotes table policies)
COMMENT ON FUNCTION create_quote_version IS 'Creates a new version of an existing quote with custom version name';
COMMENT ON FUNCTION version_exists_for_quote_family IS 'Checks if a version name already exists for a quote family';
COMMENT ON VIEW quote_versions IS 'View showing all quotes with version hierarchy'; 