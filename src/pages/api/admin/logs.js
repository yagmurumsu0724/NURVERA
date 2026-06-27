import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req, res) {
  // 1. Authenticate Request
  const supabase = createServerSupabaseClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: 'Yetkisiz erişim' });
  }

  // 2. Authorize Request (Admin ONLY)
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role, is_active')
    .eq('user_id', session.user.id)
    .single();

  if (!roleData || !roleData.is_active || roleData.role !== 'admin') {
    return res.status(403).json({ error: 'Bu işlem için yetkiniz yok. Sadece sistem yöneticileri bu paneli görebilir.' });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { action, resource_type, page = 1, limit = 15 } = req.query;

    let query = supabase
      .from('audit_logs')
      .select('*', { count: 'exact' });

    if (action) {
      query = query.eq('action', action);
    }
    if (resource_type) {
      query = query.eq('resource_type', resource_type);
    }

    query = query.order('created_at', { ascending: false });

    // Pagination
    const from = (Number(page) - 1) * Number(limit);
    const to = from + Number(limit) - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) throw error;

    return res.status(200).json({
      logs: data,
      total: count,
      page: Number(page),
      totalPages: Math.ceil(count / Number(limit))
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Loglar yüklenirken bir hata oluştu.' });
  }
}
