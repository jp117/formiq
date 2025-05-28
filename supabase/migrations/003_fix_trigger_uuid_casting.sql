-- Fix the trigger function to handle UUID casting properly
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  company_uuid UUID;
BEGIN
  -- Safely convert company_id to UUID
  BEGIN
    IF NEW.raw_user_meta_data->>'company_id' IS NOT NULL 
       AND NEW.raw_user_meta_data->>'company_id' != '' 
       AND NEW.raw_user_meta_data->>'company_id' != 'null' THEN
      company_uuid := (NEW.raw_user_meta_data->>'company_id')::UUID;
    ELSE
      company_uuid := NULL;
    END IF;
  EXCEPTION
    WHEN invalid_text_representation THEN
      -- If UUID conversion fails, set to NULL
      company_uuid := NULL;
      RAISE LOG 'Invalid UUID format for company_id: %', NEW.raw_user_meta_data->>'company_id';
  END;

  -- Insert into users table with error handling
  INSERT INTO users (id, first_name, last_name, email, company_id, is_approved)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email,
    company_uuid,
    FALSE
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the auth user creation
    RAISE LOG 'Error creating user profile: % - %', SQLSTATE, SQLERRM;
    RAISE LOG 'User data: id=%, email=%, meta=%', NEW.id, NEW.email, NEW.raw_user_meta_data;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Also ensure we have the right policies
DROP POLICY IF EXISTS "Service role can insert users" ON users;
CREATE POLICY "Service role can insert users" ON users
  FOR INSERT WITH CHECK (true);

-- Make sure companies can be read by authenticated users
DROP POLICY IF EXISTS "Allow anonymous read access to companies" ON companies;
CREATE POLICY "Authenticated users can read companies" ON companies
  FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'anon'); 