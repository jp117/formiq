-- Create quote_line_items table for storing individual line items in quotes
CREATE TABLE quote_line_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  component_name TEXT NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  notes TEXT,
  switchboard_name TEXT,
  switchboard_designation TEXT,
  switchboard_nema_type TEXT,
  switchboard_sections INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX quote_line_items_quote_id_idx ON quote_line_items(quote_id);
CREATE INDEX quote_line_items_component_name_idx ON quote_line_items(component_name);

-- Add updated_at trigger
CREATE TRIGGER update_quote_line_items_updated_at BEFORE UPDATE ON quote_line_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE quote_line_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for quote_line_items
CREATE POLICY "Users can view their company's quote line items" ON quote_line_items
  FOR SELECT USING (
    quote_id IN (
      SELECT id FROM quotes WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert their company's quote line items" ON quote_line_items
  FOR INSERT WITH CHECK (
    quote_id IN (
      SELECT id FROM quotes WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update their company's quote line items" ON quote_line_items
  FOR UPDATE USING (
    quote_id IN (
      SELECT id FROM quotes WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete their company's quote line items" ON quote_line_items
  FOR DELETE USING (
    quote_id IN (
      SELECT id FROM quotes WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  );

-- Add comment to explain the table purpose
COMMENT ON TABLE quote_line_items IS 'Individual line items/components used in specific quotes';
COMMENT ON COLUMN quote_line_items.quote_id IS 'Reference to the quote this line item belongs to';
COMMENT ON COLUMN quote_line_items.component_name IS 'Name of the component/line item';
COMMENT ON COLUMN quote_line_items.description IS 'Description of the component/line item';
COMMENT ON COLUMN quote_line_items.quantity IS 'Quantity of this component';
COMMENT ON COLUMN quote_line_items.unit_price IS 'Unit price of this component';
COMMENT ON COLUMN quote_line_items.total_price IS 'Total price (unit_price * quantity)';
COMMENT ON COLUMN quote_line_items.notes IS 'Additional notes about this line item';
COMMENT ON COLUMN quote_line_items.switchboard_name IS 'Name of the switchboard this component belongs to (if applicable)';
COMMENT ON COLUMN quote_line_items.switchboard_designation IS 'Designation of the switchboard (if applicable)';
COMMENT ON COLUMN quote_line_items.switchboard_nema_type IS 'NEMA type of the switchboard (if applicable)';
COMMENT ON COLUMN quote_line_items.switchboard_sections IS 'Number of sections in the switchboard (if applicable)'; 