-- Create assemblies table for standard switchboard configurations
CREATE TABLE assemblies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL, -- e.g., 'Cubicle', 'Panel', 'Switchboard'
  amperage INTEGER, -- e.g., 4000
  enclosure_type VARCHAR(50), -- e.g., 'NEMA1', 'NEMA3R'
  product_line VARCHAR(100), -- e.g., 'Spectra', 'ReliaGear', 'EMAX'
  base_markup_percentage DECIMAL(5,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create assembly_components junction table (which components make up each assembly)
CREATE TABLE assembly_components (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assembly_id UUID REFERENCES assemblies(id) ON DELETE CASCADE,
  component_id UUID REFERENCES quote_components(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  is_optional BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create quote_assemblies table (assemblies used in specific quotes)
CREATE TABLE quote_assemblies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  assembly_id UUID REFERENCES assemblies(id) ON DELETE RESTRICT, -- Don't allow deleting assemblies used in quotes
  quantity INTEGER NOT NULL DEFAULT 1,
  custom_markup_percentage DECIMAL(5,2), -- Override assembly's base markup for this quote
  custom_name VARCHAR(255), -- Allow customizing assembly name for this quote
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create quote_assembly_modifications table (for custom component additions/removals per quote)
CREATE TABLE quote_assembly_modifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_assembly_id UUID REFERENCES quote_assemblies(id) ON DELETE CASCADE,
  component_id UUID REFERENCES quote_components(id) ON DELETE CASCADE,
  modification_type VARCHAR(20) NOT NULL CHECK (modification_type IN ('add', 'remove', 'quantity_change')),
  quantity_change INTEGER DEFAULT 0, -- positive for additions, negative for removals
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes for better performance
CREATE INDEX assemblies_category_idx ON assemblies(category);
CREATE INDEX assemblies_amperage_idx ON assemblies(amperage);
CREATE INDEX assemblies_product_line_idx ON assemblies(product_line);
CREATE INDEX assembly_components_assembly_id_idx ON assembly_components(assembly_id);
CREATE INDEX assembly_components_component_id_idx ON assembly_components(component_id);
CREATE INDEX quote_assemblies_quote_id_idx ON quote_assemblies(quote_id);
CREATE INDEX quote_assemblies_assembly_id_idx ON quote_assemblies(assembly_id);
CREATE INDEX quote_assembly_modifications_quote_assembly_id_idx ON quote_assembly_modifications(quote_assembly_id);

-- Add updated_at triggers
CREATE TRIGGER set_assemblies_updated_at
  BEFORE UPDATE ON assemblies
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_quote_assemblies_updated_at
  BEFORE UPDATE ON quote_assemblies
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Enable RLS
ALTER TABLE assemblies ENABLE ROW LEVEL SECURITY;
ALTER TABLE assembly_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_assemblies ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_assembly_modifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assemblies (viewable by all approved users, manageable by quote admins)
CREATE POLICY "Approved users can view assemblies" ON assemblies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND is_approved = true
    )
  );

CREATE POLICY "Quote admins can manage assemblies" ON assemblies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (is_admin = true OR is_quote_admin = true)
    )
  );

-- RLS Policies for assembly_components
CREATE POLICY "Approved users can view assembly components" ON assembly_components
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND is_approved = true
    )
  );

CREATE POLICY "Quote admins can manage assembly components" ON assembly_components
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (is_admin = true OR is_quote_admin = true)
    )
  );

-- RLS Policies for quote_assemblies (users can only access their company's quotes)
CREATE POLICY "Users can view their company's quote assemblies" ON quote_assemblies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quotes q
      JOIN users u ON u.company_id = q.company_id
      WHERE q.id = quote_assemblies.quote_id
      AND u.id = auth.uid()
      AND u.is_approved = true
    )
  );

CREATE POLICY "Users can manage their company's quote assemblies" ON quote_assemblies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM quotes q
      JOIN users u ON u.company_id = q.company_id
      WHERE q.id = quote_assemblies.quote_id
      AND u.id = auth.uid()
      AND u.is_approved = true
    )
  );

-- RLS Policies for quote_assembly_modifications
CREATE POLICY "Users can view their company's quote assembly modifications" ON quote_assembly_modifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quote_assembly_modifications qam
      JOIN quote_assemblies qa ON qa.id = qam.quote_assembly_id
      JOIN quotes q ON q.id = qa.quote_id
      JOIN users u ON u.company_id = q.company_id
      WHERE qam.id = quote_assembly_modifications.id
      AND u.id = auth.uid()
      AND u.is_approved = true
    )
  );

CREATE POLICY "Users can manage their company's quote assembly modifications" ON quote_assembly_modifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM quote_assembly_modifications qam
      JOIN quote_assemblies qa ON qa.id = qam.quote_assembly_id
      JOIN quotes q ON q.id = qa.quote_id
      JOIN users u ON u.company_id = q.company_id
      WHERE qam.id = quote_assembly_modifications.id
      AND u.id = auth.uid()
      AND u.is_approved = true
    )
  ); 