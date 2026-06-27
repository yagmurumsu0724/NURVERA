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
        const { search, status, page = 1, limit = 10 } = req.query;

        let query = supabase
          .from('comments')
          .select('*, products(id, name)', { count: 'exact' });

        if (search) {
          query = query.or(`customer_name.ilike.%${search}%,content.ilike.%${search}%`);
        }
        if (status) {
          query = query.eq('status', status);
        }

        query = query.order('created_at', { ascending: false });

        // Pagination
        const from = (Number(page) - 1) * Number(limit);
        const to = from + Number(limit) - 1;
        query = query.range(from, to);

        const { data, count, error } = await query;

        if (error) throw error;

        return res.status(200).json({
          comments: data,
          total: count,
          page: Number(page),
          totalPages: Math.ceil(count / Number(limit))
        });
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Yorumlar yüklenirken bir hata oluştu.' });
      }

    case 'PUT':
      try {
        const targetId = id || req.body.id;
        if (!targetId) {
          return res.status(400).json({ error: 'Yorum ID gereklidir.' });
        }

        const { status, admin_reply } = req.body;

        const updateData = {};
        if (status !== undefined) updateData.status = status;
        if (admin_reply !== undefined) {
          updateData.admin_reply = admin_reply;
          updateData.replied_at = new Date().toISOString();
        }

        const { data, error } = await supabase
          .from('comments')
          .update(updateData)
          .eq('id', targetId)
          .select()
          .single();

        if (error) throw error;
        return res.status(200).json(data);
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Yorum güncellenirken bir hata oluştu.' });
      }

    case 'DELETE':
      try {
        const targetId = id || req.body.id;
        if (!targetId) {
          return res.status(400).json({ error: 'Yorum ID gereklidir.' });
        }

        const { error } = await supabase
          .from('comments')
          .delete()
          .eq('id', targetId);

        if (error) throw error;
        return res.status(200).json({ success: true, message: 'Yorum başarıyla silindi.' });
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Yorum silinirken bir hata oluştu.' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${method} not allowed` });
  }
}
