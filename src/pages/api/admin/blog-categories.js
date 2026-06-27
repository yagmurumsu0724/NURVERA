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
  const { id } = req.query;

  switch (method) {
    case 'GET':
      try {
        const { data, error } = await supabase
          .from('blog_categories')
          .select('*')
          .order('name', { ascending: true });

        if (error) throw error;
        return res.status(200).json(data);
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Blog kategorileri listelenirken bir hata oluştu.' });
      }

    case 'POST':
      try {
        const { name, slug, description } = req.body;

        if (!name || !slug) {
          return res.status(400).json({ error: 'Kategori adı ve slug gereklidir.' });
        }

        const { data, error } = await supabase
          .from('blog_categories')
          .insert([{
            name,
            slug: slug.toLowerCase().replace(/[^a-z0-9-]+/g, '-'),
            description
          }])
          .select()
          .single();

        if (error) {
          if (error.code === '23505') {
            return res.status(400).json({ error: 'Bu slug zaten kullanımda.' });
          }
          throw error;
        }

        return res.status(201).json(data);
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Kategori eklenirken bir hata oluştu.' });
      }

    case 'DELETE':
      try {
        const targetId = id || req.body.id;

        if (!targetId) {
          return res.status(400).json({ error: 'Kategori ID gereklidir.' });
        }

        // Set blog posts parent to null first
        await supabase
          .from('blog_posts')
          .update({ category_id: null })
          .eq('category_id', targetId);

        const { error } = await supabase
          .from('blog_categories')
          .delete()
          .eq('id', targetId);

        if (error) throw error;
        return res.status(200).json({ success: true, message: 'Blog kategorisi başarıyla silindi.' });
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Kategori silinirken bir hata oluştu.' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).json({ error: `Method ${method} not allowed` });
  }
}
