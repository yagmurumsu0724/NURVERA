-- ========================================================
-- NURVERA Admin CMS — Database Schema (Supabase PostgreSQL)
-- ========================================================

-- Enable extensions if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Common trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);

CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  brand TEXT,
  sku TEXT UNIQUE,
  barcode TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  old_price NUMERIC(10,2),
  discount_percent NUMERIC(5,2),
  tax_rate NUMERIC(5,2) DEFAULT 18,
  stock INTEGER DEFAULT 0,
  stock_status TEXT DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock','out_of_stock','pre_order')),
  weight NUMERIC(8,3),
  dimensions JSONB, -- {width, height, depth}
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  pdf_url TEXT,
  tags TEXT[] DEFAULT '{}',
  variants JSONB DEFAULT '[]', -- [{name: "Renk", options: ["Kırmızı", "Mavi"]}]
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_popular BOOLEAN DEFAULT false,
  show_on_homepage BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  og_image TEXT,
  schema_data JSONB,
  view_count INTEGER DEFAULT 0,
  sale_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 3. BLOG CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT, -- HTML from TipTap
  excerpt TEXT,
  cover_image TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT, -- Denormalized for display
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','published','scheduled','archived')),
  is_featured BOOLEAN DEFAULT false,
  reading_time INTEGER, -- dakika cinsinden
  view_count INTEGER DEFAULT 0,
  related_posts UUID[] DEFAULT '{}',
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  og_image TEXT,
  published_at TIMESTAMPTZ, -- gelecek tarih = planlı yayın
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 5. ORDERS SEQUENCE AND TABLE
CREATE SEQUENCE IF NOT EXISTS order_seq START 1;

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Müşteri ID'si
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  items JSONB NOT NULL, -- [{product_id, name, price, qty, image}]
  subtotal NUMERIC(10,2) NOT NULL,
  shipping_cost NUMERIC(10,2) DEFAULT 0,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  tax_amount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled','refunded')),
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','refunded')),
  shipping_tracking TEXT,
  notes TEXT,
  admin_notes TEXT,
  order_type TEXT DEFAULT 'standard' CHECK (order_type IN ('standard', 'pre_order')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Automatic Order Number Generator trigger
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number = 'NRV-' || TO_CHAR(now(), 'YYYYMMDD') || '-' || LPAD(nextval('order_seq')::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 6. MEDIA FILES TABLE
CREATE TABLE IF NOT EXISTS media_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Supabase Storage path
  file_type TEXT NOT NULL, -- image/jpeg, image/png, video/mp4, application/pdf
  file_size INTEGER NOT NULL, -- bytes
  width INTEGER, -- görsel genişliği
  height INTEGER, -- görsel yüksekliği
  alt_text TEXT,
  folder TEXT DEFAULT 'general', -- products, blog, banners, pages, general
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_media_files_folder ON media_files(folder);
CREATE INDEX IF NOT EXISTS idx_media_files_type ON media_files(file_type);
CREATE INDEX IF NOT EXISTS idx_media_files_created ON media_files(created_at);

-- 7. BANNERS TABLE
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  banner_type TEXT NOT NULL CHECK (banner_type IN ('hero_slider','campaign','popup','mobile','desktop')),
  image_url TEXT NOT NULL,
  mobile_image_url TEXT,
  link_url TEXT,
  link_target TEXT DEFAULT '_self',
  button_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  popup_delay INTEGER DEFAULT 3, -- saniye (popup için)
  popup_trigger TEXT DEFAULT 'load' CHECK (popup_trigger IN ('load','scroll','exit')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_banners_type ON banners(banner_type);
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(is_active) WHERE is_active = true;

-- 8. PAGE CONTENT TABLE
CREATE TABLE IF NOT EXISTS page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT UNIQUE NOT NULL, -- 'home', 'about', 'contact', 'hacamat', 'suluk'
  page_title TEXT NOT NULL,
  blocks JSONB DEFAULT '[]', -- Sayfa blokları dizisi
  is_published BOOLEAN DEFAULT true,
  last_edited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER page_content_updated_at
  BEFORE UPDATE ON page_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Initial Pages
INSERT INTO page_content (page_slug, page_title, blocks) VALUES
('home', 'Ana Sayfa', '[]'),
('about', 'Hakkımızda', '[]'),
('contact', 'İletişim', '[]'),
('hacamat', 'Hacamat Tedavisi', '[]'),
('suluk', 'Sülük Tedavisi', '[]'),
('privacy', 'Gizlilik Politikası', '[]'),
('kvkk', 'KVKK', '[]'),
('return-policy', 'İade Politikası', '[]'),
('shipping', 'Kargo ve Teslimat', '[]')
ON CONFLICT (page_slug) DO NOTHING;

-- 9. SEO SETTINGS TABLE
CREATE TABLE IF NOT EXISTS seo_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT UNIQUE NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  og_type TEXT DEFAULT 'website',
  twitter_card TEXT DEFAULT 'summary_large_image',
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image TEXT,
  canonical_url TEXT,
  robots TEXT DEFAULT 'index, follow',
  schema_json JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER seo_settings_updated_at
  BEFORE UPDATE ON seo_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 10. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  value_json JSONB,
  group_name TEXT DEFAULT 'general',
  label TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Initial Site Settings
INSERT INTO site_settings (key, label, value, group_name) VALUES
('site_name', 'Site Adı', 'NURVERA', 'general'),
('site_description', 'Site Açıklaması', 'Doğal Şifa Kaynakları', 'general'),
('contact_phone', 'Telefon', '+90 555 000 0000', 'contact'),
('contact_email', 'E-posta', 'info@nurvera.com', 'contact'),
('contact_address', 'Adres', 'İstanbul, Türkiye', 'contact'),
('whatsapp_number', 'WhatsApp', '+90 555 000 0000', 'contact'),
('instagram_url', 'Instagram', 'https://instagram.com/nurvera', 'social'),
('facebook_url', 'Facebook', '', 'social'),
('youtube_url', 'YouTube', '', 'social'),
('tiktok_url', 'TikTok', '', 'social'),
('working_hours', 'Çalışma Saatleri', 'Pzt-Cum 09:00-18:00', 'general'),
('maps_embed_url', 'Google Maps URL', '', 'contact'),
('logo_url', 'Logo URL', '/images/nurvera_logo.png', 'branding'),
('favicon_url', 'Favicon URL', '/favicon.ico', 'branding'),
('footer_text', 'Footer Metni', '© 2026 NURVERA. Tüm hakları saklıdır.', 'general')
ON CONFLICT (key) DO NOTHING;

-- 11. USER ROLES TABLE
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'moderator')),
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);

CREATE TRIGGER user_roles_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 12. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout'
  resource_type TEXT NOT NULL, -- 'product', 'blog', 'banner', etc.
  resource_id TEXT,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- 13. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','spam')),
  admin_reply TEXT,
  replied_at TIMESTAMPTZ,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comments_product ON comments(product_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);

CREATE TRIGGER comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 14. REDIRECTS TABLE
CREATE TABLE IF NOT EXISTS redirects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_path TEXT UNIQUE NOT NULL,
  to_path TEXT NOT NULL,
  redirect_type INTEGER DEFAULT 301 CHECK (redirect_type IN (301, 302)),
  is_active BOOLEAN DEFAULT true,
  hit_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 15. DASHBOARD STATS VIEW
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM products WHERE status = 'published') AS published_products,
  (SELECT COUNT(*) FROM products WHERE status = 'draft') AS draft_products,
  (SELECT COUNT(*) FROM products WHERE stock <= 5 AND status = 'published') AS low_stock_products,
  (SELECT COUNT(*) FROM blog_posts WHERE status = 'published') AS published_blogs,
  (SELECT COUNT(*) FROM blog_posts WHERE status = 'draft') AS draft_blogs,
  (SELECT COUNT(*) FROM orders WHERE status = 'pending') AS pending_orders,
  (SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURRENT_DATE) AS todays_orders,
  (SELECT COALESCE(SUM(total),0) FROM orders WHERE payment_status = 'paid' AND DATE(created_at) = CURRENT_DATE) AS todays_revenue,
  (SELECT COUNT(*) FROM media_files) AS total_media,
  (SELECT COUNT(*) FROM comments WHERE status = 'pending') AS pending_comments;

-- 16. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE redirects ENABLE ROW LEVEL SECURITY;

-- Helper functions for policies
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
  SELECT role FROM user_roles WHERE user_id = $1 AND is_active = true;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
    AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin_or_editor()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'editor')
    AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- PRODUCTS: Public can view published products, admins/editors can do everything
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (status = 'published' OR is_admin_or_editor());

CREATE POLICY "products_admin_write" ON products
  FOR ALL USING (is_admin_or_editor());

-- BLOG POSTS: Public can view published blogs, admins/editors can do everything
CREATE POLICY "blog_public_read" ON blog_posts
  FOR SELECT USING (status = 'published' OR is_admin_or_editor());

CREATE POLICY "blog_admin_write" ON blog_posts
  FOR ALL USING (is_admin_or_editor());

-- CATEGORIES: Public can view active categories, admins/editors can do everything
CREATE POLICY "categories_public_read" ON categories
  FOR SELECT USING (is_active = true OR is_admin_or_editor());

CREATE POLICY "categories_admin_write" ON categories
  FOR ALL USING (is_admin_or_editor());

-- ORDERS: Admins/editors only
CREATE POLICY "orders_admin_only" ON orders
  FOR ALL USING (is_admin_or_editor());

-- MEDIA FILES: Public can view, admins/editors can do everything
CREATE POLICY "media_public_read" ON media_files
  FOR SELECT USING (true);

CREATE POLICY "media_admin_write" ON media_files
  FOR ALL USING (is_admin_or_editor());

-- BANNERS: Public can view active, admins/editors can do everything
CREATE POLICY "banners_public_read" ON banners
  FOR SELECT USING (is_active = true OR is_admin_or_editor());

CREATE POLICY "banners_admin_write" ON banners
  FOR ALL USING (is_admin_or_editor());

-- PAGE CONTENT: Public can view, admins/editors can do everything
CREATE POLICY "page_content_public_read" ON page_content
  FOR SELECT USING (is_published = true OR is_admin_or_editor());

CREATE POLICY "page_content_admin_write" ON page_content
  FOR ALL USING (is_admin_or_editor());

-- SEO SETTINGS: Public can view, admins/editors can do everything
CREATE POLICY "seo_settings_public_read" ON seo_settings
  FOR SELECT USING (true);

CREATE POLICY "seo_settings_admin_write" ON seo_settings
  FOR ALL USING (is_admin_or_editor());

-- SITE SETTINGS: Public can view, admins can manage
CREATE POLICY "settings_public_read" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "settings_admin_write" ON site_settings
  FOR ALL USING (is_admin());

-- USER ROLES: Admin only
CREATE POLICY "user_roles_admin_only" ON user_roles
  FOR ALL USING (is_admin());

-- AUDIT LOGS: Admin read, authenticated insert
CREATE POLICY "audit_logs_admin_read" ON audit_logs
  FOR SELECT USING (is_admin());

CREATE POLICY "audit_logs_insert" ON audit_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- COMMENTS: Public can view approved comments, admins/editors can manage
CREATE POLICY "comments_public_read" ON comments
  FOR SELECT USING (status = 'approved' OR is_admin_or_editor());

CREATE POLICY "comments_admin_manage" ON comments
  FOR ALL USING (is_admin_or_editor());

-- REDIRECTS: Public can view active, admins/editors can manage
CREATE POLICY "redirects_public_read" ON redirects
  FOR SELECT USING (is_active = true OR is_admin_or_editor());

CREATE POLICY "redirects_admin_write" ON redirects
  FOR ALL USING (is_admin_or_editor());

-- ========================================================
-- 15. CUSTOMER DASHBOARD TABLES
-- ========================================================

-- User Profiles (Ad, Soyad, Adres vb. saklanır)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Profil için RLS Politikaları
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Kullanıcı kendi profilini görebilir" ON user_profiles
  FOR SELECT USING (auth.uid() = id OR is_admin_or_editor());
CREATE POLICY "Kullanıcı kendi profilini güncelleyebilir" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Otomatik profil oluşturma tetikleyicisi
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, first_name, last_name)
  VALUES (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if trigger exists before creating to prevent errors on multiple runs
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Favorite Collections (Favori Klasörleri)
CREATE TABLE IF NOT EXISTS favorite_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, name)
);

ALTER TABLE favorite_collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Kullanıcı kendi koleksiyonlarını görebilir" ON favorite_collections
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Kullanıcı koleksiyon ekleyebilir/silebilir/güncelleyebilir" ON favorite_collections
  FOR ALL USING (auth.uid() = user_id);

-- Favorites (Favoriler)
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  collection_id UUID REFERENCES favorite_collections(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
  -- UNIQUE is handled by partial indexes or application logic to allow same product in different collections
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_fav_null_collection ON favorites (user_id, product_id) WHERE collection_id IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_fav_collection ON favorites (user_id, product_id, collection_id) WHERE collection_id IS NOT NULL;

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Kullanıcı kendi favorilerini görebilir" ON favorites
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Kullanıcı favori ekleyebilir/silebilir" ON favorites
  FOR ALL USING (auth.uid() = user_id);

-- Waitlist (Beklediğim Ürünler / Gelince Haber Ver)
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'notified', 'purchased')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(email, product_id)
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Kullanıcı kendi beklediklerini görebilir" ON waitlist
  FOR SELECT USING (auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));
CREATE POLICY "Kullanıcı bekleme listesine eklenebilir" ON waitlist
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Kullanıcı kendi kaydını silebilir" ON waitlist
  FOR DELETE USING (auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Orders RLS for customers
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Kullanıcı kendi siparişlerini görebilir" ON orders
  FOR SELECT USING (auth.uid() = user_id OR is_admin_or_editor());

