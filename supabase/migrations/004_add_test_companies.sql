-- Add some test companies if they don't exist
INSERT INTO companies (company_name, domain) 
VALUES 
  ('Atlas Switch', 'atlasswitch.com'),
  ('Demo Company', 'demo.com'),
  ('Test Electrical', 'testelectrical.com'),
  ('Power Solutions Inc', 'powersolutions.com')
ON CONFLICT (company_name) DO NOTHING; 