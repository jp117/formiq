-- Add number_of_sections column to switchboards table
-- This field will be used for scheduling logic to require admin approval 
-- for more than a certain number of sections in a week

ALTER TABLE switchboards 
ADD COLUMN number_of_sections INTEGER NOT NULL DEFAULT 1;

-- Add a comment explaining the purpose
COMMENT ON COLUMN switchboards.number_of_sections IS 'Number of sections in the switchboard, used for scheduling logic and admin approval requirements'; 