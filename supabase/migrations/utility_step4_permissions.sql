-- Step 4: Add quote-admin permissions for utility management

-- Allow quote admins and regular admins to manage utility types
CREATE POLICY "Allow quote admins to manage utility types" ON utility_types
    FOR ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND (users.is_admin = true OR users.is_quote_admin = true)
        )
    );

-- Allow quote admins to manage utility fields
CREATE POLICY "Allow quote admins to manage utility fields" ON utility_fields
    FOR ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND (users.is_admin = true OR users.is_quote_admin = true)
        )
    );

-- Allow quote admins to manage utility field options
CREATE POLICY "Allow quote admins to manage utility field options" ON utility_field_options
    FOR ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND (users.is_admin = true OR users.is_quote_admin = true)
        )
    );

-- Allow quote admins to manage utility rules
CREATE POLICY "Allow quote admins to manage utility rules" ON utility_rules
    FOR ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND (users.is_admin = true OR users.is_quote_admin = true)
        )
    ); 