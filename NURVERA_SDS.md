# NURVERA YÖNETİM PANELİ (Admin CMS)
# Software Design Specification (SDS)
## Versiyon 1.0 | Hazırlayan: Antigravity AI | Tarih: 2026-06-26

---

> **Bu belge**, NURVERA e-ticaret sitesi için geliştirilecek tam kapsamlı Admin CMS panelinin teknik tasarım dokümanıdır. Bir geliştirici veya yapay zekâ asistanı bu belgeyi referans alarak sistemi sıfırdan kurabilir.

---

# İÇİNDEKİLER

1. [Sistem Mimarisi](#bölüm-1-sistem-mimarisi)
2. [Veritabanı Tasarımı](#bölüm-2-veritabanı-tasarımı)
3. [Admin Paneli Tasarımı](#bölüm-3-admin-paneli-tasarımı)
4. [Ürün Yönetimi](#bölüm-4-ürün-yönetimi)
5. [Blog CMS](#bölüm-5-blog-cms)
6. [Sayfa Oluşturucu (Page Builder)](#bölüm-6-sayfa-oluşturucu)
7. [Medya Yönetimi](#bölüm-7-medya-yönetimi)
8. [SEO Yönetimi](#bölüm-8-seo-yönetimi)
9. [Banner ve Kampanya Sistemi](#bölüm-9-banner-ve-kampanya-sistemi)
10. [Kullanıcı ve Yetkilendirme](#bölüm-10-kullanıcı-ve-yetkilendirme)
11. [Analitik Paneli](#bölüm-11-analitik-paneli)
12. [Yorum ve İletişim Yönetimi](#bölüm-12-yorum-ve-iletişim-yönetimi)
13. [Güvenlik Mimarisi](#bölüm-13-güvenlik-mimarisi)
14. [Yedekleme, Loglama ve Deployment](#bölüm-14-yedekleme-loglama-ve-deployment)
15. [Gelecek Modüller ve Genişletme Rehberi](#bölüm-15-gelecek-modüller)

---

# BÖLÜM 1: SİSTEM MİMARİSİ

## 1.1 Genel Mimari

NURVERA Admin CMS, mevcut Next.js 16.2.9 Pages Router tabanlı projeye **entegre** olarak geliştirilecektir. Projeye bağımsız bir uygulama olarak değil, `/admin` route grubu altında ayrı bir panel olarak eklenmektedir.

### Neden App Router Değil?

Mevcut proje `src/pages/` dizininde kurulu olan **Pages Router** mimarisini kullanmaktadır. App Router eklemek için:
- Mevcut tüm sayfaların `app/` dizinine taşınması,
- `getServerSideProps`, `getStaticProps` API'lerinin kaldırılması,
- Layout yapısının tamamen yeniden yazılması gerekirdi.

Bu değişiklikler saatler süren bir migration çalışması gerektirir ve mevcut çalışan kodu bozma riski taşır. Bu nedenle **Admin paneli de Pages Router (`src/pages/admin/`) içinde geliştirilecektir.**

### Neden TypeScript Değil?

Mevcut tüm dosyalar `.js` uzantılıdır. TypeScript eklemek için `tsconfig.json` oluşturulması ve `next.config` güncellenmesi yeterli olurdu, ancak sonraki adımda mevcut tüm dosyalara type annotation eklenmesi gerekirdi. Bu kapsam dışındadır. Panel JavaScript (ESNext) olarak yazılacak; buna karşın JSDoc ile tip güvenliği sağlanacaktır.

### Mimari Diyagram

```
┌─────────────────────────────────────────────────┐
│                 NURVERA Web Sitesi               │
│                                                  │
│  ┌─────────────────┐   ┌─────────────────────┐  │
│  │   Public Site   │   │    Admin Panel      │  │
│  │  /pages/*.js   │   │  /pages/admin/*.js  │  │
│  │                 │   │                     │  │
│  │  - Ana Sayfa    │   │  - Dashboard        │  │
│  │  - Ürünler      │   │  - Ürün CRUD        │  │
│  │  - Blog         │   │  - Blog CMS         │  │
│  │  - Hacamat      │   │  - Medya            │  │
│  │  - Sülük        │   │  - SEO              │  │
│  └────────┬────────┘   └──────────┬──────────┘  │
│           │                       │              │
│           └─────────┬─────────────┘              │
│                     │                            │
│              ┌──────▼───────┐                    │
│              │  API Routes  │                    │
│              │ /api/admin/* │                    │
│              └──────┬───────┘                    │
└─────────────────────┼───────────────────────────┘
                      │
         ┌────────────▼─────────────┐
         │        Supabase          │
         │  ┌──────────────────┐    │
         │  │   PostgreSQL DB  │    │
         │  │  (tüm tablolar)  │    │
         │  └──────────────────┘    │
         │  ┌──────────────────┐    │
         │  │  Supabase Auth   │    │
         │  │  (JWT + RLS)     │    │
         │  └──────────────────┘    │
         │  ┌──────────────────┐    │
         │  │ Supabase Storage │    │
         │  │  (tüm görseller) │    │
         │  └──────────────────┘    │
         └──────────────────────────┘
```

## 1.2 Teknoloji Seçimi ve Gerekçeleri

| Paket | Versiyon | Gerekçe |
|-------|----------|---------|
| `next` | 16.2.9 | Mevcut proje altyapısı |
| `@supabase/supabase-js` | ^2.x | PostgreSQL + Auth + Storage tek pakette |
| `@supabase/auth-helpers-nextjs` | ^0.10.x | Next.js ile Supabase Auth entegrasyonu |
| `react-hook-form` | ^7.x | Performanslı form yönetimi (re-render minimize) |
| `zod` | ^3.x | Runtime type validation, form schema |
| `@hookform/resolvers` | ^3.x | Zod'u RHF ile bağlar |
| `@tiptap/react` | ^2.x | Modern, extensible rich text editör |
| `react-dropzone` | ^14.x | Drag & drop dosya yükleme |
| `recharts` | ^2.x | Dashboard grafikleri (React native) |
| `react-hot-toast` | ^2.x | Minimal, güzel toast bildirimleri |
| `date-fns` | ^3.x | Tarih format/parse işlemleri |
| `@hello-pangea/dnd` | ^16.x | Drag & drop sıralama (react-beautiful-dnd fork) |
| `framer-motion` | ^12.x | Zaten mevcut — animasyonlar |
| `lucide-react` | ^1.x | Zaten mevcut — ikonlar |

### Paket Kurulumu

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs @supabase/auth-helpers-react react-hook-form zod @hookform/resolvers @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder react-dropzone recharts react-hot-toast date-fns @hello-pangea/dnd
```

## 1.3 Tam Klasör Yapısı

```
NURVERA/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── layout/
│   │   │   │   ├── AdminLayout.jsx        # Ana panel layout (sidebar + header + content)
│   │   │   │   ├── AdminSidebar.jsx       # Sol navigasyon menüsü
│   │   │   │   └── AdminHeader.jsx        # Üst bar (breadcrumb, bildirimler, kullanıcı)
│   │   │   ├── dashboard/
│   │   │   │   ├── StatsCard.jsx          # İstatistik kartı (animasyonlu)
│   │   │   │   ├── RecentProducts.jsx     # Son eklenen ürünler
│   │   │   │   ├── RecentBlogs.jsx        # Son blog yazıları
│   │   │   │   ├── SalesChart.jsx         # Satış grafiği (Recharts)
│   │   │   │   └── QuickActions.jsx       # Hızlı işlem butonları
│   │   │   ├── products/
│   │   │   │   ├── ProductForm.jsx        # Ürün ekleme/düzenleme formu
│   │   │   │   ├── ProductTable.jsx       # Ürün listesi tablosu
│   │   │   │   └── ProductVariants.jsx    # Varyant yönetimi (renk, boyut)
│   │   │   ├── blog/
│   │   │   │   ├── BlogForm.jsx           # Blog yazısı formu
│   │   │   │   └── BlogTable.jsx          # Blog listesi tablosu
│   │   │   ├── media/
│   │   │   │   ├── MediaUploader.jsx      # Drag & drop yükleyici
│   │   │   │   ├── MediaGrid.jsx          # Medya kütüphanesi grid görünümü
│   │   │   │   └── MediaPickerModal.jsx   # Form içi görsel seçici modal
│   │   │   ├── ui/
│   │   │   │   ├── DataTable.jsx          # Yeniden kullanılabilir tablo bileşeni
│   │   │   │   ├── ConfirmModal.jsx       # Silme onay modalı
│   │   │   │   ├── RichTextEditor.jsx     # TipTap editör sarmalayıcı
│   │   │   │   ├── ImageUpload.jsx        # Tekil görsel yükleme alanı
│   │   │   │   ├── StatusBadge.jsx        # Durum rozeti (yayınlandı/taslak)
│   │   │   │   ├── Skeleton.jsx           # Loading iskelet bileşeni
│   │   │   │   ├── SearchInput.jsx        # Arama kutusu
│   │   │   │   └── Pagination.jsx         # Sayfalama bileşeni
│   │   │   └── seo/
│   │   │       └── SeoForm.jsx            # SEO meta alanları formu
│   │   ├── cart/                          # (mevcut)
│   │   ├── layout/                        # (mevcut)
│   │   ├── sections/                      # (mevcut)
│   │   └── ui/                            # (mevcut)
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── index.js                   # Dashboard
│   │   │   ├── urunler/
│   │   │   │   ├── index.js               # Ürün listesi
│   │   │   │   ├── yeni.js                # Yeni ürün ekle
│   │   │   │   └── [id].js                # Ürün düzenle
│   │   │   ├── blog/
│   │   │   │   ├── index.js               # Blog listesi
│   │   │   │   ├── yeni.js                # Yeni yazı
│   │   │   │   └── [id].js                # Yazı düzenle
│   │   │   ├── kategoriler/
│   │   │   │   └── index.js               # Kategori yönetimi
│   │   │   ├── siparisler/
│   │   │   │   ├── index.js               # Sipariş listesi
│   │   │   │   └── [id].js                # Sipariş detayı
│   │   │   ├── medya/
│   │   │   │   └── index.js               # Medya kütüphanesi
│   │   │   ├── bannerlar/
│   │   │   │   └── index.js               # Banner yönetimi
│   │   │   ├── sayfalar/
│   │   │   │   ├── index.js               # Sayfa listesi
│   │   │   │   └── [slug].js              # Sayfa düzenleyici
│   │   │   ├── yorumlar/
│   │   │   │   └── index.js               # Yorum yönetimi
│   │   │   ├── iletisim/
│   │   │   │   └── index.js               # İletişim bilgileri
│   │   │   ├── seo/
│   │   │   │   └── index.js               # Global SEO ayarları
│   │   │   ├── kullanicilar/
│   │   │   │   └── index.js               # Kullanıcı yönetimi
│   │   │   ├── ayarlar/
│   │   │   │   └── index.js               # Site ayarları
│   │   │   ├── yedekleme/
│   │   │   │   └── index.js               # Yedekleme & geri yükleme
│   │   │   └── loglar/
│   │   │       └── index.js               # İşlem logları
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── products.js            # Ürün CRUD API
│   │   │   │   ├── products/[id].js       # Tekil ürün API
│   │   │   │   ├── blog.js                # Blog CRUD API
│   │   │   │   ├── blog/[id].js           # Tekil blog API
│   │   │   │   ├── categories.js          # Kategori API
│   │   │   │   ├── orders.js              # Sipariş API
│   │   │   │   ├── media.js               # Medya API
│   │   │   │   ├── banners.js             # Banner API
│   │   │   │   ├── pages-content.js       # Sayfa içeriği API
│   │   │   │   ├── seo.js                 # SEO API
│   │   │   │   ├── comments.js            # Yorum API
│   │   │   │   ├── users.js               # Kullanıcı API
│   │   │   │   ├── settings.js            # Ayarlar API
│   │   │   │   └── dashboard-stats.js     # Dashboard istatistikleri
│   │   │   └── auth/                      # (mevcut)
│   │   └── ...                            # (mevcut sayfalar)
│   ├── lib/
│   │   ├── supabase.js                    # Supabase client (browser)
│   │   ├── supabaseAdmin.js               # Supabase admin client (server-only)
│   │   ├── withAdminAuth.js               # Admin sayfası HOC
│   │   ├── adminMiddleware.js             # API route auth kontrolü
│   │   └── validators/
│   │       ├── productSchema.js           # Zod: ürün validation
│   │       ├── blogSchema.js              # Zod: blog validation
│   │       └── bannerSchema.js            # Zod: banner validation
│   ├── styles/
│   │   ├── globals.css                    # (mevcut)
│   │   └── admin.css                      # Admin paneli özel stiller
│   ├── store/                             # (mevcut)
│   └── data/                              # (mevcut — geçici, Supabase'e migrate edilecek)
├── middleware.js                           # /admin/* route koruması (YENİ)
├── .env.local                             # Environment variables
└── ...
```

## 1.4 Kod Standartları

### Dosya Adlandırma
- **Bileşenler:** PascalCase → `AdminSidebar.jsx`, `ProductForm.jsx`
- **Sayfalar:** lowercase → `index.js`, `yeni.js`, `[id].js`
- **Yardımcılar:** camelCase → `supabase.js`, `withAdminAuth.js`
- **Stiller:** kebab-case → `admin.css`

### Bileşen Mimarisi (Pattern)

```jsx
// Tüm admin bileşenleri bu pattern'i izler

/**
 * @component ProductForm
 * @description Ürün ekleme ve düzenleme formu
 * @param {Object} props
 * @param {Object} [props.product] - Düzenleme modunda mevcut ürün verisi
 * @param {Function} props.onSuccess - Başarılı kayıt sonrası callback
 */
export default function ProductForm({ product = null, onSuccess }) {
  // 1. Hook'lar (form, state, query)
  // 2. Derived state / computed values
  // 3. Handler functions
  // 4. useEffect (side effects)
  // 5. JSX (render)
}
```

### API Route Pattern

```js
// src/pages/api/admin/products.js
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req, res) {
  // 1. Auth kontrolü
  const supabase = createServerSupabaseClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return res.status(401).json({ error: 'Yetkisiz erişim' });

  // 2. Rol kontrolü
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', session.user.id)
    .single();
  if (!['admin', 'editor'].includes(roleData?.role)) {
    return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
  }

  // 3. Method routing
  switch (req.method) {
    case 'GET': return handleGet(req, res, supabase);
    case 'POST': return handlePost(req, res, supabase);
    default: return res.status(405).json({ error: 'Method not allowed' });
  }
}
```

## 1.5 State Yönetimi Stratejisi

| Durum Tipi | Çözüm | Açıklama |
|-----------|-------|---------|
| Server state (DB verisi) | Supabase SDK | `useEffect` + `useState` ile fetch |
| Form state | React Hook Form | Controlled form, validation |
| UI state (modal açık/kapalı vb.) | `useState` (local) | Global state gerektirmez |
| Auth state | Supabase Auth + `useSession` | `@supabase/auth-helpers-react` |
| Sepet state | Zustand (mevcut) | Değiştirilmeyecek |

## 1.6 Environment Variables

`.env.local` dosyası tam içeriği:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# NextAuth (mevcut)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Site
NEXT_PUBLIC_SITE_URL=https://nurvera.com

# Admin
ADMIN_EMAIL=admin@nurvera.com
```

---

# BÖLÜM 2: VERİTABANI TASARIMI

## 2.1 Supabase Proje Yapısı

Supabase Dashboard → yeni proje oluştur → SQL Editor'e aşağıdaki SQL'leri sırayla uygula.

## 2.2 Tablolar — Tam SQL Şema

### `categories` Tablosu

```sql
CREATE TABLE categories (
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

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- Trigger: updated_at otomatik güncelle
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### `products` Tablosu

```sql
CREATE TABLE products (
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

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_sku ON products(sku);

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### `blog_categories` Tablosu

```sql
CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### `blog_posts` Tablosu

```sql
CREATE TABLE blog_posts (
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

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_featured ON blog_posts(is_featured) WHERE is_featured = true;
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### `orders` Tablosu

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
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
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Otomatik sipariş numarası üret
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'NRV-' || TO_CHAR(now(), 'YYYYMMDD') || '-' || LPAD(nextval('order_seq')::text, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS order_seq START 1;

CREATE TRIGGER orders_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### `media_files` Tablosu

```sql
CREATE TABLE media_files (
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

CREATE INDEX idx_media_files_folder ON media_files(folder);
CREATE INDEX idx_media_files_type ON media_files(file_type);
CREATE INDEX idx_media_files_created ON media_files(created_at);
```

### `banners` Tablosu

```sql
CREATE TABLE banners (
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

CREATE INDEX idx_banners_type ON banners(banner_type);
CREATE INDEX idx_banners_active ON banners(is_active) WHERE is_active = true;
```

### `page_content` Tablosu

```sql
CREATE TABLE page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT UNIQUE NOT NULL, -- 'home', 'about', 'contact', 'hacamat', 'suluk'
  page_title TEXT NOT NULL,
  blocks JSONB DEFAULT '[]', -- Sayfa blokları dizisi
  is_published BOOLEAN DEFAULT true,
  last_edited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Başlangıç verileri
INSERT INTO page_content (page_slug, page_title, blocks) VALUES
('home', 'Ana Sayfa', '[]'),
('about', 'Hakkımızda', '[]'),
('contact', 'İletişim', '[]'),
('hacamat', 'Hacamat Tedavisi', '[]'),
('suluk', 'Sülük Tedavisi', '[]'),
('privacy', 'Gizlilik Politikası', '[]'),
('kvkk', 'KVKK', '[]'),
('return-policy', 'İade Politikası', '[]'),
('shipping', 'Kargo ve Teslimat', '[]');
```

### `seo_settings` Tablosu

```sql
CREATE TABLE seo_settings (
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
```

### `site_settings` Tablosu

```sql
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  value_json JSONB,
  group_name TEXT DEFAULT 'general',
  label TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Başlangıç ayarları
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
('footer_text', 'Footer Metni', '© 2024 NURVERA. Tüm hakları saklıdır.', 'general');
```

### `user_roles` Tablosu

```sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'moderator')),
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);
```

### `audit_logs` Tablosu

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout'
  resource_type TEXT NOT NULL, -- 'product', 'blog', 'banner', vb.
  resource_id TEXT,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

### `comments` Tablosu

```sql
CREATE TABLE comments (
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

CREATE INDEX idx_comments_product ON comments(product_id);
CREATE INDEX idx_comments_status ON comments(status);
```

### `redirects` Tablosu

```sql
CREATE TABLE redirects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_path TEXT UNIQUE NOT NULL,
  to_path TEXT NOT NULL,
  redirect_type INTEGER DEFAULT 301 CHECK (redirect_type IN (301, 302)),
  is_active BOOLEAN DEFAULT true,
  hit_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## 2.3 Supabase Storage Bucket Yapısı

```
Buckets:
├── nurvera-media (public bucket)
│   ├── products/          # Ürün görselleri
│   ├── blog/              # Blog kapak görselleri
│   ├── banners/           # Banner görselleri
│   ├── pages/             # Sayfa görselleri
│   ├── categories/        # Kategori görselleri
│   └── general/           # Genel görseller
```

Bucket oluşturma SQL:
```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('nurvera-media', 'nurvera-media', true);
```

## 2.4 Row Level Security (RLS) Politikaları

```sql
-- Tüm tablolar için RLS'yi etkinleştir
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

-- Yardımcı fonksiyon: kullanıcının rolünü döndür
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
  SELECT role FROM user_roles WHERE user_id = $1 AND is_active = true;
$$ LANGUAGE sql SECURITY DEFINER;

-- Yardımcı fonksiyon: admin mi?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
    AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Yardımcı fonksiyon: admin veya editör mü?
CREATE OR REPLACE FUNCTION is_admin_or_editor()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'editor')
    AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- PRODUCTS: Herkes yayınlanmış ürünleri görebilir, yalnızca admin/editor düzenleyebilir
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (status = 'published' OR is_admin_or_editor());

CREATE POLICY "products_admin_write" ON products
  FOR ALL USING (is_admin_or_editor());

-- BLOG POSTS: Herkes yayınlanmış yazıları görebilir
CREATE POLICY "blog_public_read" ON blog_posts
  FOR SELECT USING (status = 'published' OR is_admin_or_editor());

CREATE POLICY "blog_admin_write" ON blog_posts
  FOR ALL USING (is_admin_or_editor());

-- ORDERS: Yalnızca admin/editor görebilir
CREATE POLICY "orders_admin_only" ON orders
  FOR ALL USING (is_admin_or_editor());

-- MEDIA FILES: Herkes okuyabilir (public bucket), yalnızca admin/editor ekleyebilir
CREATE POLICY "media_public_read" ON media_files
  FOR SELECT USING (true);

CREATE POLICY "media_admin_write" ON media_files
  FOR ALL USING (is_admin_or_editor());

-- USER ROLES: Yalnızca admin yönetebilir
CREATE POLICY "user_roles_admin_only" ON user_roles
  FOR ALL USING (is_admin());

-- AUDIT LOGS: Yalnızca admin görebilir
CREATE POLICY "audit_logs_admin_read" ON audit_logs
  FOR SELECT USING (is_admin());

-- Her kullanıcı kendi loglarını yazabilir (insert)
CREATE POLICY "audit_logs_insert" ON audit_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- SITE SETTINGS: Herkes okuyabilir, admin yazabilir
CREATE POLICY "settings_public_read" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "settings_admin_write" ON site_settings
  FOR ALL USING (is_admin());

-- COMMENTS: Herkes okuyabilir (onaylananlar), admin yönetebilir
CREATE POLICY "comments_public_read" ON comments
  FOR SELECT USING (status = 'approved' OR is_admin_or_editor());

CREATE POLICY "comments_admin_manage" ON comments
  FOR ALL USING (is_admin_or_editor());

-- Storage bucket politikası
CREATE POLICY "media_storage_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'nurvera-media');

CREATE POLICY "media_storage_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'nurvera-media' AND is_admin_or_editor());

CREATE POLICY "media_storage_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'nurvera-media' AND is_admin_or_editor());
```

## 2.5 Dashboard İstatistik View'ları

```sql
-- Dashboard istatistikleri için view
CREATE VIEW dashboard_stats AS
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
```

---

# BÖLÜM 3: ADMİN PANELİ TASARIMI

## 3.1 Supabase Client Kurulumu

### `src/lib/supabase.js`
```js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables eksik!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### `src/lib/supabaseAdmin.js` (server-only)
```js
import { createClient } from '@supabase/supabase-js';

// Bu dosyayı asla client-side'da import etme!
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
```

## 3.2 Middleware — Route Koruması

### `middleware.js` (proje kökünde)

```js
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();

  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isApiAdminRoute = req.nextUrl.pathname.startsWith('/api/admin');

  // Admin rotalarını koru
  if (isAdminRoute || isApiAdminRoute) {
    if (!session) {
      // Giriş yapılmamış → /login'e yönlendir
      if (isAdminRoute) {
        const redirectUrl = new URL('/login', req.url);
        redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
      }
      // API route → 401
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    // Rol kontrolü
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role, is_active')
      .eq('user_id', session.user.id)
      .single();

    if (!roleData || !roleData.is_active) {
      if (isAdminRoute) {
        return NextResponse.redirect(new URL('/login?error=unauthorized', req.url));
      }
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
};
```

## 3.3 withAdminAuth HOC

### `src/lib/withAdminAuth.js`

```js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { supabase } from './supabase';

/**
 * Admin sayfalarını koruyan Higher Order Component.
 * Kullanım: export default withAdminAuth(MyAdminPage);
 *
 * @param {React.Component} Component - Korunacak bileşen
 * @param {string[]} [allowedRoles=['admin','editor','moderator']] - İzin verilen roller
 */
export function withAdminAuth(Component, allowedRoles = ['admin', 'editor', 'moderator']) {
  return function ProtectedPage(props) {
    const router = useRouter();
    const { session, isLoading } = useSessionContext();
    const [role, setRole] = useState(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
      if (!isLoading) {
        if (!session) {
          router.replace(`/login?redirect=${router.pathname}`);
          return;
        }
        // Rol kontrolü
        supabase
          .from('user_roles')
          .select('role, is_active')
          .eq('user_id', session.user.id)
          .single()
          .then(({ data }) => {
            if (!data || !data.is_active || !allowedRoles.includes(data.role)) {
              router.replace('/login?error=unauthorized');
            } else {
              setRole(data.role);
              setChecking(false);
            }
          });
      }
    }, [session, isLoading]);

    if (isLoading || checking) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900">
          <div className="text-white">Yükleniyor...</div>
        </div>
      );
    }

    return <Component {...props} userRole={role} />;
  };
}
```

## 3.4 AdminLayout Bileşeni

### `src/components/admin/layout/AdminLayout.jsx`

```jsx
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function AdminLayout({ children, title = 'Admin Panel' }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Ana içerik */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title={title} />

        {/* Sayfa içeriği */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-900">
          <AnimatePresence mode="wait">
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Toast bildirimleri */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
          },
          success: { iconTheme: { primary: '#7FA34D', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </div>
  );
}

// Sayfa düzeyi getLayout fonksiyonu — _app.js'de otomatik uygulanır
AdminLayout.getLayout = (page) => page;
```

## 3.5 AdminSidebar Menü Yapısı

### Navigasyon Öğeleri

```js
// src/components/admin/layout/AdminSidebar.jsx içinde kullanılacak menü yapısı
export const adminMenuItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: 'LayoutDashboard',
    exact: true
  },
  {
    label: 'Ürünler',
    icon: 'Package',
    children: [
      { label: 'Tüm Ürünler', href: '/admin/urunler' },
      { label: 'Yeni Ürün', href: '/admin/urunler/yeni' },
      { label: 'Kategoriler', href: '/admin/kategoriler' },
    ]
  },
  {
    label: 'Blog',
    icon: 'FileText',
    children: [
      { label: 'Tüm Yazılar', href: '/admin/blog' },
      { label: 'Yeni Yazı', href: '/admin/blog/yeni' },
    ]
  },
  {
    label: 'Siparişler',
    href: '/admin/siparisler',
    icon: 'ShoppingBag',
    badge: 'pending_orders' // dinamik badge
  },
  {
    label: 'Medya',
    href: '/admin/medya',
    icon: 'Image'
  },
  {
    label: 'Bannerlar',
    href: '/admin/bannerlar',
    icon: 'Layers'
  },
  {
    label: 'Sayfalar',
    href: '/admin/sayfalar',
    icon: 'Layout'
  },
  {
    label: 'Yorumlar',
    href: '/admin/yorumlar',
    icon: 'MessageSquare',
    badge: 'pending_comments'
  },
  {
    label: 'SEO',
    href: '/admin/seo',
    icon: 'Search'
  },
  {
    label: 'İletişim',
    href: '/admin/iletisim',
    icon: 'Phone'
  },
  {
    label: 'Kullanıcılar',
    href: '/admin/kullanicilar',
    icon: 'Users',
    adminOnly: true
  },
  {
    label: 'Ayarlar',
    href: '/admin/ayarlar',
    icon: 'Settings'
  },
  {
    label: 'Yedekleme',
    href: '/admin/yedekleme',
    icon: 'Database',
    adminOnly: true
  },
  {
    label: 'Loglar',
    href: '/admin/loglar',
    icon: 'Activity',
    adminOnly: true
  }
];
```

### Tasarım Özellikleri

```
Sidebar Tasarım Sistemi:
- Arka plan: bg-slate-800
- Aktif öğe: bg-[#1E4D3A] + left border #7FA34D
- Hover: bg-slate-700
- İkon rengi: text-slate-400 → text-white (aktif)
- Genişlik açık: 240px | kapalı: 64px
- Transition: Framer Motion (layout animation)
- Logo: NURVERA logosu + "Admin" etiketi
- Alt kısım: kullanıcı avatarı + çıkış butonu
```

## 3.6 Dashboard Sayfası

### İstatistik Kartları

```jsx
// src/components/admin/dashboard/StatsCard.jsx
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatsCard({ title, value, change, changeType, icon: Icon, color }) {
  const colorMap = {
    green: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    gold: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`bg-gradient-to-br ${colorMap[color]} border rounded-xl p-6 backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white mt-1"
          >
            {value}
          </motion.p>
        </div>
        <div className={`p-3 rounded-lg bg-white/10`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>

      {change !== undefined && (
        <div className="mt-4 flex items-center gap-1">
          {changeType === 'up' ? (
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          ) : changeType === 'down' ? (
            <TrendingDown className="w-4 h-4 text-red-400" />
          ) : (
            <Minus className="w-4 h-4 text-slate-400" />
          )}
          <span className={`text-sm font-medium ${
            changeType === 'up' ? 'text-emerald-400' :
            changeType === 'down' ? 'text-red-400' : 'text-slate-400'
          }`}>
            {change}% geçen haftaya göre
          </span>
        </div>
      )}
    </motion.div>
  );
}
```

### Dashboard Sayfası Layout

```jsx
// src/pages/admin/index.js
import AdminLayout from '@/components/admin/layout/AdminLayout';
import StatsCard from '@/components/admin/dashboard/StatsCard';
import { withAdminAuth } from '@/lib/withAdminAuth';
import { Package, FileText, ShoppingBag, Image, TrendingUp, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useSWR from 'swr'; // veya useEffect + useState

function AdminDashboard() {
  // TODO: Supabase'den veri çek
  // const { data: stats } = useSWR('/api/admin/dashboard-stats');

  return (
    <AdminLayout title="Dashboard">
      {/* İstatistik Kartları - 2x2 grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Toplam Ürün" value="40" change={5} changeType="up" icon={Package} color="green" />
        <StatsCard title="Blog Yazısı" value="13" change={2} changeType="up" icon={FileText} color="blue" />
        <StatsCard title="Bekleyen Sipariş" value="3" icon={ShoppingBag} color="gold" />
        <StatsCard title="Medya Dosyası" value="89" icon={Image} color="blue" />
      </div>

      {/* Satış Grafiği + Hızlı İşlemler */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-white font-semibold mb-4">Son 30 Günlük Sipariş Trendi</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={[]}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7FA34D" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#7FA34D" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              />
              <Area type="monotone" dataKey="orders" stroke="#7FA34D" fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Hızlı İşlemler */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-white font-semibold mb-4">Hızlı İşlemler</h3>
          <div className="space-y-2">
            {[
              { label: 'Yeni Ürün Ekle', href: '/admin/urunler/yeni', color: '#1E4D3A' },
              { label: 'Blog Yaz', href: '/admin/blog/yeni', color: '#1E3A5F' },
              { label: 'Görsel Yükle', href: '/admin/medya', color: '#4A1942' },
              { label: 'Banner Güncelle', href: '/admin/bannerlar', color: '#4A3A1A' },
            ].map(action => (
              <a key={action.href} href={action.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
              >
                <div className="w-2 h-2 rounded-full" style={{ background: action.color }}/>
                {action.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Son Eklenen Ürünler + Bekleyen Yorumlar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Son Ürünler tablosu buraya */}
        {/* Bekleyen yorumlar listesi buraya */}
      </div>
    </AdminLayout>
  );
}

// Admin sayfa getLayout — public Layout kullanmaması için
AdminDashboard.getLayout = (page) => page;

export default withAdminAuth(AdminDashboard);
```

---

# BÖLÜM 4: ÜRÜN YÖNETİMİ

## 4.1 Zod Validation Schema

```js
// src/lib/validators/productSchema.js
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Ürün adı en az 2 karakter olmalıdır').max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, 'Slug sadece küçük harf, rakam ve tire içerebilir'),
  short_description: z.string().max(300).optional(),
  description: z.string().optional(),
  category_id: z.string().uuid().optional().nullable(),
  brand: z.string().max(100).optional(),
  sku: z.string().max(50).optional(),
  barcode: z.string().max(50).optional(),
  price: z.number().min(0, 'Fiyat 0 veya daha büyük olmalıdır').max(999999),
  old_price: z.number().min(0).max(999999).optional().nullable(),
  discount_percent: z.number().min(0).max(100).optional().nullable(),
  tax_rate: z.number().min(0).max(100).default(18),
  stock: z.number().int().min(0).default(0),
  stock_status: z.enum(['in_stock', 'out_of_stock', 'pre_order']).default('in_stock'),
  weight: z.number().min(0).optional().nullable(),
  images: z.array(z.string().url()).default([]),
  tags: z.array(z.string()).default([]),
  is_featured: z.boolean().default(false),
  is_new: z.boolean().default(false),
  is_popular: z.boolean().default(false),
  show_on_homepage: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  seo_title: z.string().max(60).optional(),
  seo_description: z.string().max(160).optional(),
  seo_keywords: z.string().max(200).optional(),
});

export const productUpdateSchema = productSchema.partial();
```

## 4.2 Ürün API Routes

```js
// src/pages/api/admin/products.js
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { productSchema } from '@/lib/validators/productSchema';

export default async function handler(req, res) {
  const supabase = createServerSupabaseClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return res.status(401).json({ error: 'Yetkisiz erişim' });

  // Rol kontrolü
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', session.user.id)
    .single();

  if (!['admin', 'editor'].includes(roleData?.role)) {
    return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
  }

  try {
    switch (req.method) {
      case 'GET': {
        const { page = 1, limit = 20, search, category, status } = req.query;
        const offset = (page - 1) * limit;

        let query = supabase
          .from('products')
          .select('*, categories(name)', { count: 'exact' });

        if (search) query = query.ilike('name', `%${search}%`);
        if (category) query = query.eq('category_id', category);
        if (status) query = query.eq('status', status);

        query = query
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        const { data, count, error } = await query;
        if (error) throw error;

        return res.status(200).json({ data, count, page: Number(page), limit: Number(limit) });
      }

      case 'POST': {
        // Validation
        const validation = productSchema.safeParse(req.body);
        if (!validation.success) {
          return res.status(400).json({ error: 'Geçersiz veri', details: validation.error.flatten() });
        }

        // Slug benzersizlik kontrolü
        const { data: existing } = await supabase
          .from('products')
          .select('id')
          .eq('slug', validation.data.slug)
          .single();

        if (existing) {
          return res.status(409).json({ error: 'Bu slug zaten kullanımda' });
        }

        const { data, error } = await supabase
          .from('products')
          .insert({
            ...validation.data,
            published_at: validation.data.status === 'published' ? new Date().toISOString() : null
          })
          .select()
          .single();

        if (error) throw error;

        // Audit log kaydet
        await supabase.from('audit_logs').insert({
          user_id: session.user.id,
          user_email: session.user.email,
          action: 'create',
          resource_type: 'product',
          resource_id: data.id,
          new_data: data
        });

        return res.status(201).json({ data });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Products API error:', error);
    return res.status(500).json({ error: 'Sunucu hatası', message: error.message });
  }
}
```

## 4.3 ProductForm Bileşeni Yapısı

```
ProductForm alanları (React Hook Form + Zod):
┌─────────────────────────────────────────┐
│  TEMEL BİLGİLER                         │
│  - Ürün Adı (text input)                │
│  - Slug (text + otomatik üret butonu)   │
│  - Kategori (select, tree yapısında)    │
│  - Marka (text)                         │
│  - Kısa Açıklama (textarea, max 300)    │
├─────────────────────────────────────────┤
│  AÇIKLAMA                               │
│  - Tam Açıklama (TipTap RichText)       │
│  - Kullanım Şekli (TipTap)              │
│  - İçindekiler (TipTap)                 │
├─────────────────────────────────────────┤
│  FİYATLANDIRMA                          │
│  - Satış Fiyatı (number + TL)           │
│  - Eski Fiyat (number + TL, isteğe bağlı) │
│  - İndirim % (otomatik hesaplanır)      │
│  - KDV Oranı (% select: 0,1,8,18,20)   │
├─────────────────────────────────────────┤
│  STOK                                   │
│  - SKU (text)                           │
│  - Barkod (text)                        │
│  - Stok Miktarı (number)               │
│  - Stok Durumu (select)                 │
│  - Ağırlık (number + gr)               │
├─────────────────────────────────────────┤
│  GÖRSELLER                              │
│  - Görsel Galerisi (drag & drop)        │
│  - Video URL (isteğe bağlı)             │
│  - PDF Dosyası (isteğe bağlı)           │
├─────────────────────────────────────────┤
│  ETİKETLER & GÖRÜNÜRLÜK                 │
│  - Etiketler (multi-input)              │
│  - Öne Çıkan ürün (toggle)             │
│  - Yeni ürün (toggle)                  │
│  - Popüler ürün (toggle)               │
│  - Ana sayfada göster (toggle)          │
├─────────────────────────────────────────┤
│  SEO                                    │
│  - SEO Başlığı (text, max 60 karakter)  │
│  - SEO Açıklaması (textarea, max 160)  │
│  - Anahtar Kelimeler (text)             │
│  - OG Görseli (görsel seçici)          │
├─────────────────────────────────────────┤
│  DURUM                                  │
│  - Taslak / Yayınlandı / Arşivlendi    │
│  [Taslak Kaydet] [Yayınla]             │
└─────────────────────────────────────────┘
```

## 4.4 Görsel Yükleme (MediaUploader)

```jsx
// src/components/admin/media/MediaUploader.jsx
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { Upload, X, Image } from 'lucide-react';

/**
 * @component MediaUploader
 * @param {string} folder - Yükleme klasörü (products, blog, banners, vb.)
 * @param {Function} onUpload - Yükleme tamamlandığında çağrılır (url dizisi)
 * @param {boolean} multiple - Çoklu yükleme
 * @param {string[]} accept - Kabul edilen MIME tipleri
 */
export default function MediaUploader({
  folder = 'general',
  onUpload,
  multiple = true,
  accept = { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] },
  maxSize = 5 * 1024 * 1024 // 5MB
}) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState([]);

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    // Reddedilen dosyalar
    rejectedFiles.forEach(({ file, errors }) => {
      errors.forEach(e => {
        if (e.code === 'file-too-large') toast.error(`${file.name} çok büyük (max 5MB)`);
        if (e.code === 'file-invalid-type') toast.error(`${file.name} desteklenmiyor`);
      });
    });

    if (!acceptedFiles.length) return;

    setUploading(true);
    const uploadedUrls = [];

    for (const file of acceptedFiles) {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2,9)}.${ext}`;
      const filePath = `${folder}/${fileName}`;

      try {
        // Supabase Storage'a yükle
        const { error: uploadError } = await supabase.storage
          .from('nurvera-media')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Public URL al
        const { data: { publicUrl } } = supabase.storage
          .from('nurvera-media')
          .getPublicUrl(filePath);

        // media_files tablosuna kaydet
        await supabase.from('media_files').insert({
          file_name: fileName,
          original_name: file.name,
          file_url: publicUrl,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          folder: folder
        });

        uploadedUrls.push(publicUrl);
      } catch (err) {
        toast.error(`${file.name} yüklenemedi: ${err.message}`);
      }
    }

    setUploading(false);
    if (uploadedUrls.length > 0) {
      toast.success(`${uploadedUrls.length} dosya yüklendi`);
      onUpload?.(uploadedUrls);
    }
  }, [folder, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept,
    maxSize
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragActive
            ? 'border-[#7FA34D] bg-[#7FA34D]/10 scale-105'
            : 'border-slate-600 hover:border-slate-400 hover:bg-slate-800/50'
          }
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className={`w-10 h-10 mx-auto mb-3 ${isDragActive ? 'text-[#7FA34D]' : 'text-slate-400'}`} />
        <p className="text-slate-300 font-medium">
          {isDragActive ? 'Dosyaları bırakın...' : 'Dosyaları sürükleyin veya tıklayın'}
        </p>
        <p className="text-slate-500 text-sm mt-1">PNG, JPG, WebP • Maks. 5MB</p>
        {uploading && <p className="text-[#7FA34D] mt-2 text-sm animate-pulse">Yükleniyor...</p>}
      </div>
    </div>
  );
}
```

---

# BÖLÜM 5: BLOG CMS

## 5.1 TipTap Editör Kurulumu

```bash
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit \
  @tiptap/extension-image @tiptap/extension-link \
  @tiptap/extension-placeholder @tiptap/extension-text-align \
  @tiptap/extension-highlight @tiptap/extension-color \
  @tiptap/extension-table @tiptap/extension-table-row \
  @tiptap/extension-table-cell @tiptap/extension-table-header \
  @tiptap/extension-code-block-lowlight lowlight
```

## 5.2 RichTextEditor Bileşeni

```jsx
// src/components/admin/ui/RichTextEditor.jsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import {
  Bold, Italic, Strikethrough, Link as LinkIcon,
  AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Quote, Code,
  Heading1, Heading2, Heading3,
  Image as ImageIcon, Highlighter, Undo, Redo
} from 'lucide-react';

export default function RichTextEditor({ content = '', onChange, placeholder = 'İçerik yazın...' }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] }
      }),
      Image.configure({ resizable: true }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  if (!editor) return null;

  const ToolbarButton = ({ onClick, active, title, children }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-colors ${
        active ? 'bg-[#1E4D3A] text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-slate-600 rounded-xl overflow-hidden bg-slate-900">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-slate-700 bg-slate-800">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Kalın">
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="İtalik">
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Üzeri çizili">
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px bg-slate-600 mx-1" />

        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Başlık 1">
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Başlık 2">
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Başlık 3">
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px bg-slate-600 mx-1" />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Madde listesi">
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numaralı liste">
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Alıntı">
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Kod bloğu">
          <Code className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px bg-slate-600 mx-1" />

        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Sola hizala">
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Ortala">
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Sağa hizala">
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px bg-slate-600 mx-1" />

        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Geri al">
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Yenile">
          <Redo className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Editör alanı */}
      <EditorContent
        editor={editor}
        className="min-h-64 p-4 prose prose-invert max-w-none focus:outline-none text-slate-200"
      />
    </div>
  );
}
```

## 5.3 Blog Form Yapısı

```
BlogForm alanları:
┌─────────────────────────────────────────┐
│  TEMEL BİLGİLER                         │
│  - Başlık (text, otomatik slug üret)    │
│  - Slug (text + düzenle butonu)         │
│  - Özet / Excerpt (textarea)            │
├─────────────────────────────────────────┤
│  KAPAK GÖRSELİ                          │
│  - MediaUploader (tek dosya)            │
│  - Mevcut görsel önizleme               │
├─────────────────────────────────────────┤
│  İÇERİK                                 │
│  - TipTap RichTextEditor                │
├─────────────────────────────────────────┤
│  SINIFLANDIRMA                          │
│  - Kategori (select)                    │
│  - Etiketler (multi-tag input)          │
│  - Yazar Adı (text)                     │
├─────────────────────────────────────────┤
│  YAYINLAMA                              │
│  - Yayın Tarihi (datetime picker)       │
│  - Okuma Süresi (dakika, otomatik)      │
│  - Öne Çıkan (toggle)                  │
│  - Durum (draft/published/scheduled)    │
├─────────────────────────────────────────┤
│  SEO                                    │
│  - SEO Başlığı                          │
│  - SEO Açıklaması                       │
│  - OG Görseli                           │
├─────────────────────────────────────────┤
│  [Taslak Kaydet] [Önizle] [Yayınla]    │
└─────────────────────────────────────────┘
```

## 5.4 Blog API Route

```js
// src/pages/api/admin/blog.js
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

// Okuma süresi hesaplama
function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, ''); // HTML taglarını kaldır
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Slug üretici
function generateSlug(title) {
  const trMap = { 'ı':'i','ğ':'g','ü':'u','ş':'s','ö':'o','ç':'c','İ':'i','Ğ':'g','Ü':'u','Ş':'s','Ö':'o','Ç':'c' };
  return title
    .replace(/[ığüşöçİĞÜŞÖÇ]/g, char => trMap[char] || char)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default async function handler(req, res) {
  const supabase = createServerSupabaseClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return res.status(401).json({ error: 'Yetkisiz' });

  switch (req.method) {
    case 'GET': {
      const { page = 1, limit = 20, search, status } = req.query;
      const offset = (page - 1) * limit;

      let query = supabase
        .from('blog_posts')
        .select('id, title, slug, status, is_featured, view_count, created_at, published_at, cover_image', { count: 'exact' });

      if (search) query = query.ilike('title', `%${search}%`);
      if (status) query = query.eq('status', status);

      query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

      const { data, count, error } = await query;
      if (error) return res.status(500).json({ error: error.message });

      return res.status(200).json({ data, count });
    }

    case 'POST': {
      const { title, content, ...rest } = req.body;

      // Otomatik hesaplamalar
      const slug = rest.slug || generateSlug(title);
      const reading_time = calculateReadingTime(content || '');
      const published_at = rest.status === 'published' ? (rest.published_at || new Date().toISOString()) : rest.published_at;

      const { data, error } = await supabase
        .from('blog_posts')
        .insert({ title, content, slug, reading_time, published_at, author_id: session.user.id, ...rest })
        .select()
        .single();

      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json({ data });
    }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
```

---

# BÃ–LÃœM 6: SAYFA OLUÅTURUCU (PAGE BUILDER)

## 6.1 Mimari YaklaÅŸÄ±m

Sayfa iÃ§erikleri **JSON tabanlÄ± blok sistemi** ile yÃ¶netilir. Her sayfa, Supabase `page_content` tablosunda `blocks` alanÄ±nda bir dizi blok nesnesi olarak saklanÄ±r.

```json
{
  "page_slug": "home",
  "blocks": [
    {
      "id": "block-1",
      "type": "hero",
      "order": 1,
      "data": {
        "title": "DoÄŸanÄ±n ÅifasÄ±, NURVERA'nÄ±n Kalitesi",
        "subtitle": "100% doÄŸal yaÄŸlar ve kremler",
        "backgroundImage": "https://storage.supabase.../hero.png",
        "buttonText": "ÃœrÃ¼nleri KeÅŸfet",
        "buttonUrl": "/urunler"
      }
    }
  ]
}
```

## 6.2 Blok Tipleri

| Blok Tipi | AÃ§Ä±klama |
|-----------|---------|
| `hero` | Ana banner bÃ¶lÃ¼mÃ¼ (baÅŸlÄ±k, gÃ¶rsel, buton) |
| `text` | Zengin metin bÃ¶lÃ¼mÃ¼ |
| `image` | Tek gÃ¶rsel |
| `gallery` | GÃ¶rsel galerisi |
| `cta` | Call-to-action |
| `cards` | Kart listesi |
| `faq` | SSS accordion |
| `video` | YouTube/Vimeo embed |
| `counter` | SayaÃ§/istatistik |
| `testimonials` | MÃ¼ÅŸteri yorumlarÄ± |
| `contact_form` | Ä°letiÅŸim formu |
| `products_grid` | ÃœrÃ¼n grid gÃ¶sterimi |
| `blog_grid` | Blog yazÄ±larÄ± grid |
| `spacer` | BoÅŸluk |
| `divider` | AyÄ±rÄ±cÄ± Ã§izgi |

## 6.3 YÃ¶netilebilir Sayfalar

| Sayfa AdÄ± | Slug | URL |
|-----------|------|-----|
| Ana Sayfa | `home` | `/` |
| HakkÄ±mÄ±zda | `about` | `/hakkimizda` |
| Ä°letiÅŸim | `contact` | `/iletisim` |
| Hacamat Tedavisi | `hacamat` | `/hacamat` |
| SÃ¼lÃ¼k Tedavisi | `suluk` | `/suluk` |
| Gizlilik PolitikasÄ± | `privacy` | `/rehber/gizlilik-ve-guvenlik` |
| KVKK | `kvkk` | `/rehber/kvkk` |
| Ä°ade ve DeÄŸiÅŸim | `return-policy` | `/rehber/iade-ve-degisim` |
| Kargo ve Teslimat | `shipping` | `/rehber/kargo-ve-teslimat` |

---

# BÃ–LÃœM 7: MEDYA YÃ–NETÄ°MÄ°

## 7.1 Dosya YÃ¼kleme KÄ±sÄ±tlamalarÄ±

```js
// src/lib/mediaConfig.js
export const MEDIA_CONFIG = {
  maxFileSizeMB: 10,
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  allowedVideoTypes: ['video/mp4', 'video/webm'],
  allowedDocTypes: ['application/pdf'],
  folders: ['products', 'blog', 'banners', 'pages', 'categories', 'general'],
};
```

## 7.2 Medya API

```js
// src/pages/api/admin/media.js
export default async function handler(req, res) {
  const supabase = createServerSupabaseClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return res.status(401).json({ error: 'Yetkisiz' });

  switch (req.method) {
    case 'GET': {
      const { folder, search, page = 1, limit = 48 } = req.query;
      const offset = (page - 1) * limit;

      let query = supabase
        .from('media_files')
        .select('*', { count: 'exact' });

      if (folder) query = query.eq('folder', folder);
      if (search) query = query.ilike('original_name', `%${search}%`);

      query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
      const { data, count, error } = await query;
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ data, count });
    }

    case 'DELETE': {
      const { ids } = req.body;
      for (const id of ids) {
        const { data: file } = await supabase.from('media_files').select('file_path').eq('id', id).single();
        if (file) await supabase.storage.from('nurvera-media').remove([file.file_path]);
      }
      await supabase.from('media_files').delete().in('id', ids);
      return res.status(200).json({ success: true });
    }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
```

---

# BÃ–LÃœM 8: SEO YÃ–NETÄ°MÄ°

## 8.1 SEO Paneli Sekmeleri

```
1. Genel Ayarlar   â†’ Site baÅŸlÄ±ÄŸÄ±, aÃ§Ä±klamasÄ±, favicon, OG gÃ¶rseli
2. Sayfalar         â†’ Her sayfa iÃ§in meta title/description
3. ÃœrÃ¼nler          â†’ ÃœrÃ¼n bazlÄ± SEO
4. Blog             â†’ Blog bazlÄ± SEO
5. Redirects        â†’ 301/302 yÃ¶nlendirme
6. Robots.txt       â†’ Robots dosyasÄ± dÃ¼zenleyici
7. Sitemap          â†’ Otomatik sitemap Ã¶nizleme
```

## 8.2 Otomatik Sitemap

```js
// src/pages/api/sitemap.js
export default async function handler(req, res) {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nurvera.com';

  const { data: products } = await supabase
    .from('products').select('slug, updated_at').eq('status', 'published');

  const { data: blogs } = await supabase
    .from('blog_posts').select('slug, updated_at').eq('status', 'published');

  const staticPages = [
    { url: '/', priority: '1.0' },
    { url: '/urunler', priority: '0.9' },
    { url: '/blog', priority: '0.8' },
    { url: '/hacamat', priority: '0.7' },
    { url: '/suluk', priority: '0.7' },
    { url: '/hakkimizda', priority: '0.6' },
    { url: '/iletisim', priority: '0.6' },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(p => `  <url><loc>${baseUrl}${p.url}</loc><priority>${p.priority}</priority></url>`).join('\n')}
${(products || []).map(p => `  <url><loc>${baseUrl}/urunler/${p.slug}</loc><priority>0.8</priority></url>`).join('\n')}
${(blogs || []).map(b => `  <url><loc>${baseUrl}/blog/${b.slug}</loc><priority>0.6</priority></url>`).join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.write(sitemap);
  res.end();
}
```

---

# BÃ–LÃœM 9: BANNER VE KAMPANYA SÄ°STEMÄ°

## 9.1 Banner Tipleri

| Tip | KullanÄ±m |
|-----|---------|
| `hero_slider` | Ana sayfa slider |
| `campaign` | Sayfa Ã¼stÃ¼ kampanya |
| `popup` | ZiyaretÃ§i popup'Ä± |
| `mobile` | Sadece mobilde |
| `desktop` | Sadece masaÃ¼stÃ¼nde |

## 9.2 Public Banner API

```js
// src/pages/api/public/banners.js
export default async function handler(req, res) {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { type } = req.query;
  const now = new Date().toISOString();

  let query = supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gte.${now}`)
    .order('sort_order', { ascending: true });

  if (type) query = query.eq('banner_type', type);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
  return res.status(200).json({ data });
}
```

---

# BÃ–LÃœM 10: KULLANICI VE YETKÄ°LENDÄ°RME

## 10.1 Ä°lk Admin Kurulumu

```sql
-- Supabase SQL Editor'de Ã§alÄ±ÅŸtÄ±r
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'admin@nurvera.com';
```

## 10.2 Rol Ä°zin Matrisi

| Ä°ÅŸlem | Admin | Editor | Moderator |
|-------|-------|--------|-----------|
| ÃœrÃ¼n ekle/dÃ¼zenle | âœ… | âœ… | âŒ |
| ÃœrÃ¼n sil | âœ… | âŒ | âŒ |
| Blog ekle/dÃ¼zenle | âœ… | âœ… | âŒ |
| Yorum onayla | âœ… | âœ… | âœ… |
| Medya yÃ¼kle | âœ… | âœ… | âŒ |
| Medya sil | âœ… | âŒ | âŒ |
| Sayfa dÃ¼zenle | âœ… | âœ… | âŒ |
| Banner yÃ¶net | âœ… | âœ… | âŒ |
| SEO yÃ¶net | âœ… | âœ… | âŒ |
| KullanÄ±cÄ± yÃ¶net | âœ… | âŒ | âŒ |
| Ayarlar | âœ… | âŒ | âŒ |
| Yedekleme | âœ… | âŒ | âŒ |
| Audit loglar | âœ… | âŒ | âŒ |
| SipariÅŸ gÃ¶rÃ¼ntÃ¼le | âœ… | âœ… | âœ… |

---

# BÃ–LÃœM 11: ANALÄ°TÄ°K PANELÄ°

## 11.1 Dashboard Ä°statistikleri API

```js
// src/pages/api/admin/dashboard-stats.js
export default async function handler(req, res) {
  const supabase = createServerSupabaseClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return res.status(401).json({ error: 'Yetkisiz' });

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    { count: totalProducts },
    { count: totalBlogs },
    { count: pendingOrders },
    { count: pendingComments },
    { data: recentProducts },
    { data: recentBlogs },
    { data: lowStock },
    { data: salesByDay },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('comments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('products').select('id, name, price, status, created_at, images').order('created_at', { ascending: false }).limit(5),
    supabase.from('blog_posts').select('id, title, status, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('products').select('id, name, stock, sku').eq('status', 'published').lte('stock', 5).order('stock', { ascending: true }).limit(10),
    supabase.from('orders').select('created_at, total').eq('payment_status', 'paid').gte('created_at', thirtyDaysAgo.toISOString()),
  ]);

  // GÃ¼nlÃ¼k satÄ±ÅŸ Ã¶zeti
  const salesData = {};
  (salesByDay || []).forEach(order => {
    const date = order.created_at.split('T')[0];
    salesData[date] = (salesData[date] || 0) + Number(order.total);
  });

  return res.status(200).json({
    stats: { totalProducts, totalBlogs, pendingOrders, pendingComments },
    recentProducts,
    recentBlogs,
    lowStock,
    salesChart: Object.entries(salesData).map(([date, revenue]) => ({ date, revenue }))
  });
}
```

---

# BÃ–LÃœM 12: YORUM VE Ä°LETÄ°ÅÄ°M YÃ–NETÄ°MÄ°

## 12.1 Yorum API

```js
// src/pages/api/admin/comments.js
export default async function handler(req, res) {
  const supabase = createServerSupabaseClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return res.status(401).json({ error: 'Yetkisiz' });

  switch (req.method) {
    case 'GET': {
      const { status = 'pending', page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;
      const { data, count } = await supabase
        .from('comments')
        .select('*, products(name, slug)', { count: 'exact' })
        .eq('status', status)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      return res.status(200).json({ data, count });
    }

    case 'PUT': {
      const { id } = req.query;
      const { status, admin_reply } = req.body;
      const updateData = { status };
      if (admin_reply) {
        updateData.admin_reply = admin_reply;
        updateData.replied_at = new Date().toISOString();
      }
      const { data, error } = await supabase
        .from('comments').update(updateData).eq('id', id).select().single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ data });
    }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
```

---

# BÃ–LÃœM 13: GÃœVENLÄ°K MÄ°MARÄ°SÄ°

## 13.1 GÃ¼venlik KatmanlarÄ±

```
1. Middleware     â†’ JWT doÄŸrulama, /admin/* koruma, rol kontrolÃ¼
2. API Route      â†’ Session + rol tekrar kontrol, Zod validation
3. DB Level       â†’ Supabase RLS politikalarÄ±
4. Client Level   â†’ withAdminAuth HOC
```

## 13.2 Rate Limiting

```js
// src/lib/rateLimit.js
const rateLimitStore = new Map();

export function rateLimit({ windowMs = 60000, max = 20 }) {
  return function(req, res) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const key = `${ip}:${req.url}`;
    const now = Date.now();
    const record = rateLimitStore.get(key) || { count: 0, resetTime: now + windowMs };

    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + windowMs;
    }
    record.count++;
    rateLimitStore.set(key, record);

    if (record.count > max) {
      res.status(429).json({ error: 'Ã‡ok fazla istek. LÃ¼tfen bekleyin.' });
      return false;
    }
    return true;
  };
}
```

## 13.3 Soft Delete

```sql
ALTER TABLE products ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE products ADD COLUMN deleted_by UUID REFERENCES auth.users(id);
```

```js
// Silme (soft)
async function softDelete(table, id, userId) {
  return supabase.from(table).update({
    deleted_at: new Date().toISOString(),
    deleted_by: userId
  }).eq('id', id);
}

// Geri yÃ¼kleme
async function restore(table, id) {
  return supabase.from(table).update({ deleted_at: null, deleted_by: null }).eq('id', id);
}
```

---

# BÃ–LÃœM 14: YEDEKLEME, LOGLAMA VE DEPLOYMENT

## 14.1 Vercel KonfigÃ¼rasyonu

```json
// vercel.json
{
  "framework": "nextjs",
  "regions": ["fra1"],
  "headers": [
    {
      "source": "/admin/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

## 14.2 Environment Variables (Vercel)

| Key | Environment |
|-----|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | TÃ¼m ortamlar |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | TÃ¼m ortamlar |
| `SUPABASE_SERVICE_ROLE_KEY` | Production + Preview |
| `NEXTAUTH_SECRET` | TÃ¼m ortamlar |
| `NEXTAUTH_URL` | Production |
| `NEXT_PUBLIC_SITE_URL` | Production |

## 14.3 DÄ±ÅŸa Aktarma (Export) API

```js
// src/pages/api/admin/export.js
export default async function handler(req, res) {
  const supabase = createServerSupabaseClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return res.status(401).json({ error: 'Yetkisiz' });

  const { resource } = req.query;
  const tableMap = { products: 'products', blog: 'blog_posts', orders: 'orders' };
  const table = tableMap[resource];
  if (!table) return res.status(400).json({ error: 'GeÃ§ersiz kaynak' });

  const { data } = await supabase.from(table).select('*');
  const json = JSON.stringify(data, null, 2);
  const filename = `${resource}-backup-${new Date().toISOString().split('T')[0]}.json`;

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(json);
}
```

---

# BÃ–LÃœM 15: GELECEK MODÃœLLER VE KURULUM REHBERÄ°

## 15.1 AdÄ±m AdÄ±m Kurulum

### AdÄ±m 1: Supabase Projesi
1. [supabase.com](https://supabase.com) â†’ New Project â†’ BÃ¶lge: Frankfurt
2. Settings â†’ API â†’ URL ve anon key kopyala

### AdÄ±m 2: SQL ÅemasÄ±
Supabase â†’ SQL Editor â†’ BÃ¶lÃ¼m 2'deki tÃ¼m SQL'leri sÄ±rayla Ã§alÄ±ÅŸtÄ±r

### AdÄ±m 3: npm Paketleri
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs @supabase/auth-helpers-react react-hook-form zod @hookform/resolvers @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder @tiptap/extension-text-align @tiptap/extension-highlight react-dropzone recharts react-hot-toast date-fns @hello-pangea/dnd isomorphic-dompurify
```

### AdÄ±m 4: .env.local
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXTAUTH_SECRET=nurvera-admin-secret-2024
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### AdÄ±m 5: Ä°lk Admin KullanÄ±cÄ±sÄ±
1. Supabase â†’ Authentication â†’ Users â†’ Invite user
2. Email'den gelen link ile ÅŸifre belirle
3. SQL Editor'de:
```sql
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'admin@nurvera.com';
```

### AdÄ±m 6: Test
```bash
npm run dev
# /admin â†’ /login yÃ¶nlendirmeli
# GiriÅŸ sonrasÄ± /admin dashboard gÃ¶rÃ¼nmeli
```

## 15.2 Gelecek Ã–deme ModÃ¼lleri

```
Ä°yzico: npm install iyzipay
PayTR: REST API direkt kullanÄ±m
Stripe: npm install stripe
```

## 15.3 E-posta Otomasyonu

```js
// npm install resend
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'NURVERA <noreply@nurvera.com>',
  to: order.customer_email,
  subject: `SipariÅŸiniz AlÄ±ndÄ± - ${order.order_number}`,
  html: orderConfirmationTemplate(order),
});
```

## 15.4 Yapay ZekÃ¢ Ä°Ã§erik Ãœretimi

```js
// npm install openai
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateProductDescription(productName) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{
      role: 'user',
      content: `NURVERA markasÄ± iÃ§in "${productName}" Ã¼rÃ¼nÃ¼nÃ¼n TÃ¼rkÃ§e aÃ§Ä±klamasÄ±nÄ± yaz. 150-200 kelime, SEO dostu.`
    }]
  });
  return completion.choices[0].message.content;
}
```

---

*NURVERA Admin CMS â€” Software Design Specification v1.0*
*Antigravity AI tarafÄ±ndan hazÄ±rlanmÄ±ÅŸtÄ±r â€” 2026-06-26*
