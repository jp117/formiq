-- Fix Security Definer View issue for quote_versions
-- Views cannot actually have SECURITY DEFINER in PostgreSQL, but Supabase may be 
-- detecting some issue with how the view was created. Recreate it cleanly.

-- Drop the existing view
DROP VIEW IF EXISTS quote_versions;

-- Recreate the view with explicit security model
CREATE VIEW quote_versions 
WITH (security_invoker=true)
AS
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

-- Add comprehensive security documentation
COMMENT ON VIEW quote_versions IS 'View showing all quotes with version hierarchy. Uses security_invoker=true to ensure RLS policies from underlying tables (quotes, users) are properly enforced for the querying user, not the view creator.';

-- Grant appropriate permissions
GRANT SELECT ON quote_versions TO authenticated;
GRANT SELECT ON quote_versions TO anon; 