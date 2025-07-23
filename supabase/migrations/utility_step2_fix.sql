-- Step 2 Fix: Only add what doesn't exist

-- Add missing columns to utility_fields (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'utility_fields' AND column_name = 'section') THEN
        ALTER TABLE utility_fields ADD COLUMN section TEXT DEFAULT 'basic';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'utility_fields' AND column_name = 'required') THEN
        ALTER TABLE utility_fields ADD COLUMN required BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'utility_fields' AND column_name = 'display_order') THEN
        ALTER TABLE utility_fields ADD COLUMN display_order INTEGER DEFAULT 0;
    END IF;
END $$;

-- Add missing columns to utility_field_options (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'utility_field_options' AND column_name = 'display_order') THEN
        ALTER TABLE utility_field_options ADD COLUMN display_order INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'utility_field_options' AND column_name = 'active') THEN
        ALTER TABLE utility_field_options ADD COLUMN active BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Insert additional field definitions (ignore duplicates)
INSERT INTO utility_fields (field_name, display_label, field_type, section, required, display_order) VALUES
-- Line connection fields
('feed_type', 'Feed Type', 'text', 'line_connection', false, 1),
('line_lug_type', 'Lug Type', 'select', 'line_connection', false, 2),
('line_cable_material', 'Cable Material', 'select', 'line_connection', false, 3),
('line_cable_size', 'Cable Size', 'select', 'line_connection', false, 4),
('line_cables_per_phase', 'Cables/Ph', 'select', 'line_connection', false, 5),
('utility_termination', 'Utility Termination', 'boolean', 'line_connection', false, 6),

-- Load connection fields
('load_type', 'Load Type', 'select', 'load_connection', false, 1),
('load_lug_type', 'Lug Type', 'select', 'load_connection', false, 2),
('load_cable_material', 'Cable Material', 'select', 'load_connection', false, 3),
('load_exit', 'Load Exit', 'select', 'load_connection', false, 4),
('load_cable_size', 'Cable Size', 'select', 'load_connection', false, 5),
('load_cables_per_phase', 'Cables/Ph', 'select', 'load_connection', false, 6),

-- Utility specs fields
('sockets', 'Sockets', 'select', 'utility_specs', false, 1),
('figure', 'Figure', 'select', 'utility_specs', false, 2),
('clips', 'Clips', 'select', 'utility_specs', false, 3),
('current_transformer_type', 'Current Transformer Type', 'select', 'utility_specs', false, 4),
('pt_compartment_height', 'PT Compartment Height', 'select', 'utility_specs', false, 5),
('potential_transformers', 'Potential Transformers', 'boolean', 'utility_specs', false, 6)
ON CONFLICT (field_name) DO NOTHING;

-- Create utility_rules table only if it doesn't exist
CREATE TABLE IF NOT EXISTS utility_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    utility_type_id UUID REFERENCES utility_types(id) ON DELETE CASCADE,
    rule_name TEXT NOT NULL,
    rule_type TEXT NOT NULL CHECK (rule_type IN ('auto_set', 'restriction', 'validation')),
    condition_field TEXT,
    condition_operator TEXT CHECK (condition_operator IN ('equals', 'not_equals', 'in', 'not_in')),
    condition_value TEXT,
    target_field TEXT,
    action_type TEXT CHECK (action_type IN ('set_value', 'disable_field')),
    action_value TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on utility_rules if not already enabled
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'utility_rules' AND policyname = 'Allow read utility rules'
    ) THEN
        ALTER TABLE utility_rules ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Allow read utility rules" ON utility_rules FOR SELECT USING (true);
    END IF;
END $$; 