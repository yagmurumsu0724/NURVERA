import { z } from 'zod';

export const blogSchema = z.object({
  title: z.string().min(2, 'Başlık en az 2 karakter olmalıdır').max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, 'Slug sadece küçük harf, rakam ve tire içerebilir'),
  content: z.string().optional().nullable(),
  excerpt: z.string().max(500).optional().nullable(),
  cover_image: z.string().optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published', 'scheduled', 'archived']).default('draft'),
  reading_time: z.number().int().min(0).optional().nullable(),
  seo_title: z.string().max(100).optional().nullable(),
  seo_description: z.string().max(250).optional().nullable(),
  seo_keywords: z.string().max(300).optional().nullable(),
});

export const blogUpdateSchema = blogSchema.partial();
