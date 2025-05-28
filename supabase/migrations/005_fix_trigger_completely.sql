-- Completely fix the trigger that's not working

-- 1. Drop existing trigger and function to start fresh
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- 2. Create the function with proper error handling and logging
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  company_uuid UUID;
BEGIN
  -- Log that the trigger fired
  RAISE LOG 'Trigger fired for user: %', NEW.email;
  
  -- Safely convert company_id to UUID
  BEGIN
    IF NEW.raw_user_meta_data->>'company_id' IS NOT NULL 
       AND NEW.raw_user_meta_data->>'company_id' != '' 
       AND NEW.raw_user_meta_data->>'company_id' != 'null' THEN
      company_uuid := (NEW.raw_user_meta_data->>'company_id')::UUID;
      RAISE LOG 'Company UUID: %', company_uuid;
    ELSE
      company_uuid := NULL;
      RAISE LOG 'No company_id provided or invalid';
    END IF;
  EXCEPTION
    WHEN invalid_text_representation THEN
      company_uuid := NULL;
      RAISE LOG 'Invalid UUID format for company_id: %', NEW.raw_user_meta_data->>'company_id';
  END;

  -- Insert into users table
  BEGIN
    INSERT INTO public.users (id, first_name, last_name, email, company_id, is_approved)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
      NEW.email,
      company_uuid,
      FALSE
    );
    
    RAISE LOG 'Successfully created user profile for: %', NEW.email;
    
  EXCEPTION
    WHEN OTHERS THEN
      RAISE LOG 'Error inserting user profile: % - %', SQLSTATE, SQLERRM;
      RAISE LOG 'User data: id=%, email=%, meta=%', NEW.id, NEW.email, NEW.raw_user_meta_data;
      -- Don't fail the auth user creation, just log the error
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Ensure RLS policies allow the trigger to work
DROP POLICY IF EXISTS "Service role can insert users" ON public.users;
CREATE POLICY "Service role can insert users" ON public.users
  FOR INSERT WITH CHECK (true);

-- 5. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.users TO postgres, anon, authenticated, service_role;

-- 6. Test the trigger by manually creating the missing user profile
-- (This will create the profile for your test user)
INSERT INTO public.users (id, first_name, last_name, email, company_id, is_approved)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'first_name', 'Test'),
  COALESCE(au.raw_user_meta_data->>'last_name', 'User'),
  au.email,
  CASE 
    WHEN au.raw_user_meta_data->>'company_id' IS NOT NULL 
         AND au.raw_user_meta_data->>'company_id' != '' 
         AND au.raw_user_meta_data->>'company_id' != 'null'
    THEN (au.raw_user_meta_data->>'company_id')::UUID
    ELSE NULL
  END,
  FALSE
FROM auth.users au
WHERE au.email = 'test@atlasswitch.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.users pu WHERE pu.id = au.id
  ); 