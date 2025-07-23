-- Simple utility setup - run this in SQL editor

-- Clean up first
DROP TABLE IF EXISTS utility_field_options CASCADE;
DROP TABLE IF EXISTS utility_fields CASCADE;
DROP TABLE IF EXISTS utility_types CASCADE;

-- Create basic tables
CREATE TABLE utility_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    active BOOLEAN DEFAULT true
);

CREATE TABLE utility_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    field_name TEXT NOT NULL UNIQUE,
    display_label TEXT NOT NULL,
    field_type TEXT NOT NULL
);

CREATE TABLE utility_field_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    utility_type_id UUID REFERENCES utility_types(id),
    field_id UUID REFERENCES utility_fields(id),
    option_value TEXT NOT NULL,
    display_text TEXT NOT NULL
);

-- Insert basic data
INSERT INTO utility_types (name, display_name) VALUES
('con_edison_ny_377', 'Con Edison NY 377 spec');

INSERT INTO utility_fields (field_name, display_label, field_type) VALUES
('amps', 'Amps', 'select'),
('sequence', 'Sequence', 'select');

-- Enable RLS
ALTER TABLE utility_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE utility_fields ENABLE ROW LEVEL SECURITY;  
ALTER TABLE utility_field_options ENABLE ROW LEVEL SECURITY;

-- Basic read policies
CREATE POLICY "Allow read utility types" ON utility_types FOR SELECT USING (true);
CREATE POLICY "Allow read utility fields" ON utility_fields FOR SELECT USING (true);
CREATE POLICY "Allow read utility options" ON utility_field_options FOR SELECT USING (true); 