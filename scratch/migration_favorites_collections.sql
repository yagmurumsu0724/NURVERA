-- 1. Create favorite_collections table
CREATE TABLE IF NOT EXISTS favorite_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, name)
);

-- 2. Enable RLS and policies for favorite_collections
ALTER TABLE favorite_collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Kullanıcı kendi koleksiyonlarını görebilir" ON favorite_collections
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Kullanıcı koleksiyon ekleyebilir/silebilir/güncelleyebilir" ON favorite_collections
  FOR ALL USING (auth.uid() = user_id);

-- 3. Modify favorites table
-- Drop the existing unique constraint if it exists (the name might vary, typically favorites_user_id_product_id_key)
ALTER TABLE favorites DROP CONSTRAINT IF EXISTS favorites_user_id_product_id_key;

-- Add collection_id column
ALTER TABLE favorites ADD COLUMN IF NOT EXISTS collection_id UUID REFERENCES favorite_collections(id) ON DELETE CASCADE;

-- Create partial unique indexes to allow same product in different collections
CREATE UNIQUE INDEX IF NOT EXISTS idx_fav_null_collection ON favorites (user_id, product_id) WHERE collection_id IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_fav_collection ON favorites (user_id, product_id, collection_id) WHERE collection_id IS NOT NULL;
