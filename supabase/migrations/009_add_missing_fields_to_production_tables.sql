-- Add missing fields to switchboards table (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'switchboards' AND column_name = 'sales_order_number') THEN
        ALTER TABLE switchboards ADD COLUMN sales_order_number TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'switchboards' AND column_name = 'customer') THEN
        ALTER TABLE switchboards ADD COLUMN customer TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'switchboards' AND column_name = 'job_name') THEN
        ALTER TABLE switchboards ADD COLUMN job_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'switchboards' AND column_name = 'job_address') THEN
        ALTER TABLE switchboards ADD COLUMN job_address TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'switchboards' AND column_name = 'completed') THEN
        ALTER TABLE switchboards ADD COLUMN completed BOOLEAN NOT NULL DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'switchboards' AND column_name = 'dwg_rev') THEN
        ALTER TABLE switchboards ADD COLUMN dwg_rev TEXT;
    END IF;
END
$$;

-- Add missing fields to integration table (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'integration' AND column_name = 'sales_order_number') THEN
        ALTER TABLE integration ADD COLUMN sales_order_number TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'integration' AND column_name = 'customer') THEN
        ALTER TABLE integration ADD COLUMN customer TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'integration' AND column_name = 'job_name') THEN
        ALTER TABLE integration ADD COLUMN job_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'integration' AND column_name = 'job_address') THEN
        ALTER TABLE integration ADD COLUMN job_address TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'integration' AND column_name = 'completed') THEN
        ALTER TABLE integration ADD COLUMN completed BOOLEAN NOT NULL DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'integration' AND column_name = 'dwg_rev') THEN
        ALTER TABLE integration ADD COLUMN dwg_rev TEXT;
    END IF;
END
$$;

-- Add missing fields to misc table (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'misc' AND column_name = 'sales_order_number') THEN
        ALTER TABLE misc ADD COLUMN sales_order_number TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'misc' AND column_name = 'customer') THEN
        ALTER TABLE misc ADD COLUMN customer TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'misc' AND column_name = 'job_name') THEN
        ALTER TABLE misc ADD COLUMN job_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'misc' AND column_name = 'job_address') THEN
        ALTER TABLE misc ADD COLUMN job_address TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'misc' AND column_name = 'completed') THEN
        ALTER TABLE misc ADD COLUMN completed BOOLEAN NOT NULL DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'misc' AND column_name = 'dwg_rev') THEN
        ALTER TABLE misc ADD COLUMN dwg_rev TEXT;
    END IF;
END
$$;

-- Add vendor field to purchase_orders table (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'purchase_orders' AND column_name = 'vendor') THEN
        ALTER TABLE purchase_orders ADD COLUMN vendor TEXT;
    END IF;
END
$$;

-- Add quantity field to components table (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'components' AND column_name = 'quantity') THEN
        ALTER TABLE components ADD COLUMN quantity INTEGER NOT NULL DEFAULT 1;
    END IF;
END
$$;

-- Add catalog_number field to components table (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'components' AND column_name = 'catalog_number') THEN
        ALTER TABLE components ADD COLUMN catalog_number TEXT;
    END IF;
END
$$;

-- Add received field to components table (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'components' AND column_name = 'received') THEN
        ALTER TABLE components ADD COLUMN received BOOLEAN NOT NULL DEFAULT FALSE;
    END IF;
END
$$;

-- Add notes field to components table (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'components' AND column_name = 'notes') THEN
        ALTER TABLE components ADD COLUMN notes TEXT;
    END IF;
END
$$;

-- Add comments to explain the purpose of new fields (only add comments for columns that exist)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'switchboards' AND column_name = 'job_name') THEN
        COMMENT ON COLUMN switchboards.job_name IS 'Optional job/project name for the switchboard';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'switchboards' AND column_name = 'job_address') THEN
        COMMENT ON COLUMN switchboards.job_address IS 'Optional job site address';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'switchboards' AND column_name = 'completed') THEN
        COMMENT ON COLUMN switchboards.completed IS 'Whether this switchboard is completed';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'switchboards' AND column_name = 'sales_order_number') THEN
        COMMENT ON COLUMN switchboards.sales_order_number IS 'Sales order number for tracking';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'switchboards' AND column_name = 'customer') THEN
        COMMENT ON COLUMN switchboards.customer IS 'Customer name';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'switchboards' AND column_name = 'dwg_rev') THEN
        COMMENT ON COLUMN switchboards.dwg_rev IS 'Drawing revision number released against';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'integration' AND column_name = 'job_name') THEN
        COMMENT ON COLUMN integration.job_name IS 'Optional job/project name for the integration';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'integration' AND column_name = 'job_address') THEN
        COMMENT ON COLUMN integration.job_address IS 'Optional job site address';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'integration' AND column_name = 'completed') THEN
        COMMENT ON COLUMN integration.completed IS 'Whether this integration is completed';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'integration' AND column_name = 'sales_order_number') THEN
        COMMENT ON COLUMN integration.sales_order_number IS 'Sales order number for tracking';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'integration' AND column_name = 'customer') THEN
        COMMENT ON COLUMN integration.customer IS 'Customer name';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'integration' AND column_name = 'dwg_rev') THEN
        COMMENT ON COLUMN integration.dwg_rev IS 'Drawing revision number released against';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'misc' AND column_name = 'job_name') THEN
        COMMENT ON COLUMN misc.job_name IS 'Optional job/project name for the misc item';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'misc' AND column_name = 'job_address') THEN
        COMMENT ON COLUMN misc.job_address IS 'Optional job site address';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'misc' AND column_name = 'completed') THEN
        COMMENT ON COLUMN misc.completed IS 'Whether this misc item is completed';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'misc' AND column_name = 'sales_order_number') THEN
        COMMENT ON COLUMN misc.sales_order_number IS 'Sales order number for tracking';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'misc' AND column_name = 'customer') THEN
        COMMENT ON COLUMN misc.customer IS 'Customer name';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'misc' AND column_name = 'dwg_rev') THEN
        COMMENT ON COLUMN misc.dwg_rev IS 'Drawing revision number released against';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'purchase_orders' AND column_name = 'vendor') THEN
        COMMENT ON COLUMN purchase_orders.vendor IS 'Vendor/supplier for this purchase order';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'components' AND column_name = 'quantity') THEN
        COMMENT ON COLUMN components.quantity IS 'Quantity of this component';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'components' AND column_name = 'catalog_number') THEN
        COMMENT ON COLUMN components.catalog_number IS 'Catalog/part number for this component';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'components' AND column_name = 'received') THEN
        COMMENT ON COLUMN components.received IS 'Whether this component has been received';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'components' AND column_name = 'notes') THEN
        COMMENT ON COLUMN components.notes IS 'Additional notes about this component';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'switchboards' AND column_name = 'dwg_rev') THEN
        COMMENT ON COLUMN switchboards.dwg_rev IS 'Drawing revision number released against';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'integration' AND column_name = 'dwg_rev') THEN
        COMMENT ON COLUMN integration.dwg_rev IS 'Drawing revision number released against';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'misc' AND column_name = 'dwg_rev') THEN
        COMMENT ON COLUMN misc.dwg_rev IS 'Drawing revision number released against';
    END IF;
END
$$; 