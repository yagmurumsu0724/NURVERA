import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req, res) {
  // 1. Authenticate Request
  const supabase = createServerSupabaseClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: 'Yetkisiz erişim' });
  }

  // 2. Authorize Request
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role, is_active')
    .eq('user_id', session.user.id)
    .single();

  if (!roleData || !roleData.is_active || !['admin', 'editor'].includes(roleData.role)) {
    return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
  }

  const { method } = req;
  const { slug } = req.query;

  switch (method) {
    case 'GET':
      try {
        if (slug) {
          const { data, error } = await supabase
            .from('seo_settings')
            .select('*')
            .eq('page_slug', slug)
            .single();

          if (error && error.code !== 'PGRST116') throw error; // PGRST116 is empty result, which is fine
          return res.status(200).json(data || { page_slug: slug });
        } else {
          const { data, error } = await supabase
            .from('seo_settings')
            .select('*')
            .order('page_slug', { ascending: true });

          if (error) throw error;
          return res.status(200).json(data);
        }
      } catch (err) {
        return res.status(500).json({ error: err.message || 'SEO ayarları yüklenemedi.' });
      }

    case 'PUT':
      try {
        const targetSlug = slug || req.body.page_slug;

        if (!targetSlug) {
          return res.status(400).json({ error: 'Sayfa slug bilgisi gereklidir.' });
        }

        const {
          meta_title,
          meta_description,
          meta_keywords,
          og_title,
          og_description,
          og_image,
          canonical_url,
          robots
        } = req.body;

        const upsertPayload = {
          page_slug: targetSlug,
          meta_title,
          meta_description,
          meta_keywords,
          og_title,
          og_description,
          og_image,
          canonical_url,
          robots: robots || 'index, follow',
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('seo_settings')
          .upsert(upsertPayload, { onConflict: 'page_slug' })
          .select()
          .single();

        if (error) throw error;
        return res.status(200).json(data);
      } catch (err) {
        return res.status(500).json({ error: err.message || 'SEO ayarları güncellenirken bir hata oluştu.' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).json({ error: `Method ${method} not allowed` });
  }
}
