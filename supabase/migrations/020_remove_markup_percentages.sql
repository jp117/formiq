-- Remove markup_percentage from quote_components table
ALTER TABLE quote_components DROP COLUMN IF EXISTS markup_percentage;

-- Remove base_markup_percentage from assemblies table
ALTER TABLE assemblies DROP COLUMN IF EXISTS base_markup_percentage;

-- Note: Cost will remain as the base cost, and markup will be applied later through tiered markup tables 