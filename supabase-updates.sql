-- Admin users table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update promo_codes table to add new fields
ALTER TABLE promo_codes 
  ADD COLUMN IF NOT EXISTS max_uses INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS current_uses INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS valid_days INTEGER DEFAULT 7,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_promo_codes_active ON promo_codes(active);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Add RLS policies for admin access
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Products storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy for product images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');
