-- Siparişler tablosundaki eksik sütunları ekle
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS order_type TEXT DEFAULT 'standard' CHECK (order_type IN ('standard', 'pre_order'));
