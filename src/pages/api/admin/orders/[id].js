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

  if (!roleData || !roleData.is_active || !['admin', 'editor', 'moderator'].includes(roleData.role)) {
    return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
  }

  const { method } = req;
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Sipariş ID gereklidir.' });
  }

  switch (method) {
    case 'GET':
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Sipariş bulunamadı.' });

        return res.status(200).json(data);
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Sipariş yüklenirken bir hata oluştu.' });
      }

    case 'PUT':
      try {
        const { status, payment_status, shipping_tracking, admin_notes } = req.body;

        const updateData = {};
        if (status !== undefined) updateData.status = status;
        if (payment_status !== undefined) updateData.payment_status = payment_status;
        if (shipping_tracking !== undefined) updateData.shipping_tracking = shipping_tracking;
        if (admin_notes !== undefined) updateData.admin_notes = admin_notes;

        const { data, error } = await supabase
          .from('orders')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        return res.status(200).json(data);
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Sipariş güncellenirken bir hata oluştu.' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).json({ error: `Method ${method} not allowed` });
  }
}
