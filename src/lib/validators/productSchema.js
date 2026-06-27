import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Ürün adı en az 2 karakter olmalıdır').max(200, 'Ürün adı en fazla 200 karakter olabilir'),
  slug: z.string().min(2, 'Slug en az 2 karakter olmalıdır').max(200, 'Slug en fazla 200 karakter olabilir').regex(/^[a-z0-9-]+$/, 'Slug sadece küçük harf, rakam ve tire içerebilir'),
  short_description: z.string().max(500, 'Kısa açıklama en fazla 500 karakter olabilir').optional().nullable(),
  description: z.string().optional().nullable(),
  category_id: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : val),
    z.string().uuid('Geçersiz kategori formatı').optional().nullable()
  ),
  size: z.string().max(100, 'Boyut en fazla 100 karakter olabilir').optional().nullable(),
  usage: z.string().optional().nullable(),
  ingredients: z.string().optional().nullable(),
  brand: z.string().max(100).optional().nullable(),
  sku: z.string().max(50).optional().nullable(),
  barcode: z.string().max(50).optional().nullable(),
  price: z.preprocess(
    (val) => (val === '' || val === null || val === undefined || isNaN(Number(val)) ? 0 : Number(val)),
    z.number().min(0, 'Fiyat 0 veya daha büyük olmalıdır').max(999999, 'Fiyat çok yüksek')
  ),
  old_price: z.preprocess(
    (val) => (val === '' || val === null || val === undefined || isNaN(Number(val)) ? null : Number(val)),
    z.number().min(0, 'Eski fiyat 0 veya daha büyük olmalıdır').max(999999).optional().nullable()
  ),
  discount_percent: z.preprocess(
    (val) => (val === '' || val === null || val === undefined || isNaN(Number(val)) ? null : Number(val)),
    z.number().min(0).max(100).optional().nullable()
  ),
  tax_rate: z.preprocess(
    (val) => (val === '' || val === null || val === undefined || isNaN(Number(val)) ? 18 : Number(val)),
    z.number().min(0).max(100).default(18)
  ),
  stock: z.preprocess(
    (val) => (val === '' || val === null || val === undefined || isNaN(Number(val)) ? 0 : Number(val)),
    z.number().int('Stok tam sayı olmalıdır').min(0, 'Stok 0 veya daha büyük olmalıdır').default(0)
  ),
  stock_status: z.enum(['in_stock', 'out_of_stock', 'pre_order']).default('in_stock'),
  weight: z.preprocess(
    (val) => (val === '' || val === null || val === undefined || isNaN(Number(val)) ? null : Number(val)),
    z.number().min(0, 'Ağırlık 0 veya daha büyük olmalıdır').optional().nullable()
  ),
  images: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  is_featured: z.boolean().default(false),
  is_new: z.boolean().default(false),
  is_popular: z.boolean().default(false),
  show_on_homepage: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  seo_title: z.string().max(100, 'SEO başlığı en fazla 100 karakter olabilir').optional().nullable(),
  seo_description: z.string().max(250, 'SEO açıklaması en fazla 250 karakter olabilir').optional().nullable(),
  seo_keywords: z.string().max(300, 'SEO anahtar kelimeleri en fazla 300 karakter olabilir').optional().nullable(),
});

export const productUpdateSchema = productSchema.partial();
