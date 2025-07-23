-- Step 3: Add Con Edison utility data and business rules

-- Get the utility and field IDs we'll need
-- (Using subqueries to avoid needing variables)

-- Insert basic options for amps and sequence
INSERT INTO utility_field_options (utility_type_id, field_id, option_value, display_text, display_order) 
SELECT 
    ut.id, 
    uf.id, 
    '200', 
    '200', 
    1
FROM utility_types ut, utility_fields uf 
WHERE ut.name = 'con_edison_ny_377' AND uf.field_name = 'amps';

INSERT INTO utility_field_options (utility_type_id, field_id, option_value, display_text, display_order) 
SELECT ut.id, uf.id, '400', '400', 2
FROM utility_types ut, utility_fields uf 
WHERE ut.name = 'con_edison_ny_377' AND uf.field_name = 'amps';

INSERT INTO utility_field_options (utility_type_id, field_id, option_value, display_text, display_order) 
SELECT ut.id, uf.id, '600', '600', 3
FROM utility_types ut, utility_fields uf 
WHERE ut.name = 'con_edison_ny_377' AND uf.field_name = 'amps';

INSERT INTO utility_field_options (utility_type_id, field_id, option_value, display_text, display_order) 
SELECT ut.id, uf.id, '800', '800', 4
FROM utility_types ut, utility_fields uf 
WHERE ut.name = 'con_edison_ny_377' AND uf.field_name = 'amps';

-- Sequence options
INSERT INTO utility_field_options (utility_type_id, field_id, option_value, display_text, display_order) 
SELECT ut.id, uf.id, 'Hot', 'Hot', 1
FROM utility_types ut, utility_fields uf 
WHERE ut.name = 'con_edison_ny_377' AND uf.field_name = 'sequence';

INSERT INTO utility_field_options (utility_type_id, field_id, option_value, display_text, display_order) 
SELECT ut.id, uf.id, 'Cold', 'Cold', 2
FROM utility_types ut, utility_fields uf 
WHERE ut.name = 'con_edison_ny_377' AND uf.field_name = 'sequence';

-- Lug type options (line and load)
INSERT INTO utility_field_options (utility_type_id, field_id, option_value, display_text, display_order) 
SELECT ut.id, uf.id, 'Mechanical', 'Mechanical', 1
FROM utility_types ut, utility_fields uf 
WHERE ut.name = 'con_edison_ny_377' AND uf.field_name = 'line_lug_type';

INSERT INTO utility_field_options (utility_type_id, field_id, option_value, display_text, display_order) 
SELECT ut.id, uf.id, 'Compression', 'Compression', 2
FROM utility_types ut, utility_fields uf 
WHERE ut.name = 'con_edison_ny_377' AND uf.field_name = 'line_lug_type';

INSERT INTO utility_field_options (utility_type_id, field_id, option_value, display_text, display_order) 
SELECT ut.id, uf.id, 'Provision', 'Provision', 3
FROM utility_types ut, utility_fields uf 
WHERE ut.name = 'con_edison_ny_377' AND uf.field_name = 'line_lug_type';

-- Copy lug types to load connection
INSERT INTO utility_field_options (utility_type_id, field_id, option_value, display_text, display_order) 
SELECT ut.id, uf.id, 'Mechanical', 'Mechanical', 1
FROM utility_types ut, utility_fields uf 
WHERE ut.name = 'con_edison_ny_377' AND uf.field_name = 'load_lug_type';

INSERT INTO utility_field_options (utility_type_id, field_id, option_value, display_text, display_order) 
SELECT ut.id, uf.id, 'Compression', 'Compression', 2
FROM utility_types ut, utility_fields uf 
WHERE ut.name = 'con_edison_ny_377' AND uf.field_name = 'load_lug_type';

INSERT INTO utility_field_options (utility_type_id, field_id, option_value, display_text, display_order) 
SELECT ut.id, uf.id, 'Provision', 'Provision', 3
FROM utility_types ut, utility_fields uf 
WHERE ut.name = 'con_edison_ny_377' AND uf.field_name = 'load_lug_type';

-- Business rules for Feed Type automation
INSERT INTO utility_rules (utility_type_id, rule_name, rule_type, condition_field, condition_operator, condition_value, target_field, action_type, action_value)
SELECT 
    ut.id,
    'hot_sequence_feed_type',
    'auto_set',
    'sequence',
    'equals',
    'Hot',
    'feed_type',
    'set_value',
    'Lugs/Cable'
FROM utility_types ut 
WHERE ut.name = 'con_edison_ny_377';

INSERT INTO utility_rules (utility_type_id, rule_name, rule_type, condition_field, condition_operator, condition_value, target_field, action_type, action_value)
SELECT 
    ut.id,
    'cold_sequence_feed_type',
    'auto_set',
    'sequence',
    'equals',
    'Cold',
    'feed_type',
    'set_value',
    'Bus'
FROM utility_types ut 
WHERE ut.name = 'con_edison_ny_377'; 