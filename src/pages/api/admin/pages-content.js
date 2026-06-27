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
          // Fetch single page
          const { data, error } = await supabase
            .from('page_content')
            .select('*')
            .eq('page_slug', slug)
            .single();

          if (error) throw error;
          if (!data) return res.status(404).json({ error: 'Sayfa bulunamadı.' });

          return res.status(200).json(data);
        } else {
          // Fetch all pages
          const { data, error } = await supabase
            .from('page_content')
            .select('id, page_slug, page_title, is_published, updated_at')
            .order('page_title', { ascending: true });

          if (error) throw error;
          return res.status(200).json(data);
        }
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Sayfa içerikleri yüklenirken hata oluştu.' });
      }

    case 'PUT':
      try {
        if (!slug) {
          return res.status(400).json({ error: 'Sayfa slug gereklidir.' });
        }

        const { page_title, blocks, is_published } = req.body;

        const updateData = {};
        if (page_title !== undefined) updateData.page_title = page_title;
        if (blocks !== undefined) updateData.blocks = blocks; // Array of JSON blocks
        if (is_published !== undefined) updateData.is_published = is_published;
        updateData.last_edited_by = session.user.id;

        const { data, error } = await supabase
          .from('page_content')
          .update(updateData)
          .eq('page_slug', slug)
          .select()
          .single();

        if (error) throw error;

        return res.status(200).json(data);
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Sayfa güncellenirken hata oluştu.' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).json({ error: `Method ${method} not allowed` });
  }
}
