-- Create switchboards table
CREATE TABLE switchboards (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  designation text NOT NULL,
  nema_type text NOT NULL,
  original_scheduled_ship_date date NOT NULL,
  current_scheduled_ship_date date NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create integration table
CREATE TABLE integration (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  designation text NOT NULL,
  type text NOT NULL,
  original_scheduled_ship_date date NOT NULL,
  current_scheduled_ship_date date NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create misc table
CREATE TABLE misc (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  quantity integer NOT NULL,
  description text NOT NULL,
  original_scheduled_ship_date date NOT NULL,
  current_scheduled_ship_date date NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create purchase_orders table
CREATE TABLE purchase_orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  po_number text NOT NULL,
  switchboard_id uuid REFERENCES switchboards(id) ON DELETE CASCADE,
  integration_id uuid REFERENCES integration(id) ON DELETE CASCADE,
  misc_id uuid REFERENCES misc(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT purchase_orders_product_check CHECK (
    (switchboard_id IS NOT NULL AND integration_id IS NULL AND misc_id IS NULL) OR
    (switchboard_id IS NULL AND integration_id IS NOT NULL AND misc_id IS NULL) OR
    (switchboard_id IS NULL AND integration_id IS NULL AND misc_id IS NOT NULL)
  )
);

-- Create components table
CREATE TABLE components (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_order_id uuid REFERENCES purchase_orders(id) ON DELETE CASCADE,
  component_name text NOT NULL,
  original_scheduled_ship_date date NOT NULL,
  current_scheduled_ship_date date NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX switchboards_company_id_idx ON switchboards(company_id);
CREATE INDEX integration_company_id_idx ON integration(company_id);
CREATE INDEX misc_company_id_idx ON misc(company_id);
CREATE INDEX purchase_orders_company_id_idx ON purchase_orders(company_id);
CREATE INDEX purchase_orders_switchboard_id_idx ON purchase_orders(switchboard_id);
CREATE INDEX purchase_orders_integration_id_idx ON purchase_orders(integration_id);
CREATE INDEX purchase_orders_misc_id_idx ON purchase_orders(misc_id);
CREATE INDEX components_purchase_order_id_idx ON components(purchase_order_id);

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_switchboards_updated_at BEFORE UPDATE ON switchboards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integration_updated_at BEFORE UPDATE ON integration
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_misc_updated_at BEFORE UPDATE ON misc
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_components_updated_at BEFORE UPDATE ON components
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE switchboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration ENABLE ROW LEVEL SECURITY;
ALTER TABLE misc ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE components ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their company's switchboards" ON switchboards
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their company's switchboards" ON switchboards
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their company's switchboards" ON switchboards
  FOR UPDATE USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their company's switchboards" ON switchboards
  FOR DELETE USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Similar policies for integration
CREATE POLICY "Users can view their company's integration" ON integration
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their company's integration" ON integration
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their company's integration" ON integration
  FOR UPDATE USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their company's integration" ON integration
  FOR DELETE USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Similar policies for misc
CREATE POLICY "Users can view their company's misc" ON misc
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their company's misc" ON misc
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their company's misc" ON misc
  FOR UPDATE USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their company's misc" ON misc
  FOR DELETE USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Similar policies for purchase_orders
CREATE POLICY "Users can view their company's purchase_orders" ON purchase_orders
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their company's purchase_orders" ON purchase_orders
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their company's purchase_orders" ON purchase_orders
  FOR UPDATE USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their company's purchase_orders" ON purchase_orders
  FOR DELETE USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Similar policies for components
CREATE POLICY "Users can view their company's components" ON components
  FOR SELECT USING (
    purchase_order_id IN (
      SELECT id FROM purchase_orders WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert their company's components" ON components
  FOR INSERT WITH CHECK (
    purchase_order_id IN (
      SELECT id FROM purchase_orders WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update their company's components" ON components
  FOR UPDATE USING (
    purchase_order_id IN (
      SELECT id FROM purchase_orders WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete their company's components" ON components
  FOR DELETE USING (
    purchase_order_id IN (
      SELECT id FROM purchase_orders WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  );
