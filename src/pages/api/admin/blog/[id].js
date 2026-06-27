import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { blogUpdateSchema } from '@/lib/validators/blogSchema';

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

  if (!id) {
    return res.status(400).json({ error: 'Yazı ID gereklidir.' });
  }

  switch (method) {
    case 'GET':
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*, blog_categories(id, name)')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Yazı bulunamadı.' });

        return res.status(200).json(data);
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Yazı yüklenirken bir hata oluştu.' });
      }

    case 'PUT':
      try {
        // Validate request body
        const validation = blogUpdateSchema.safeParse(req.body);
        if (!validation.success) {
          const errors = validation.error.format();
          return res.status(400).json({ error: 'Geçersiz veri biçimi.', details: errors });
        }

        const updateData = validation.data;

        // Manage published_at timestamp based on status change
        if (updateData.status) {
          if (updateData.status === 'published') {
            updateData.published_at = new Date().toISOString();
          } else {
            updateData.published_at = null;
          }
        }

        const { data, error } = await supabase
          .from('blog_posts')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          if (error.code === '23505') {
            return res.status(400).json({ error: 'Bu slug zaten kullanımda.' });
          }
          throw error;
        }

        return res.status(200).json(data);
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Yazı güncellenirken bir hata oluştu.' });
      }

    case 'DELETE':
      try {
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return res.status(200).json({ success: true, message: 'Yazı başarıyla silindi.' });
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Yazı silinirken bir hata oluştu.' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${method} not allowed` });
  }
}
