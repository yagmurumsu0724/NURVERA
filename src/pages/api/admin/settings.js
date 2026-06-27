import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req, res) {
  // 1. Authenticate Request
  const supabase = createServerSupabaseClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: 'Yetkisiz erişim' });
  }

  // 2. Authorize Request (Admin only for global settings)
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role, is_active')
    .eq('user_id', session.user.id)
    .single();

  if (!roleData || !roleData.is_active || roleData.role !== 'admin') {
    return res.status(403).json({ error: 'Bu işlem için yetkiniz yok. Sadece sistem yöneticileri ayarları değiştirebilir.' });
  }

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*');

        if (error) throw error;

        // Transform into key-value map for client ease
        const settingsMap = {};
        data.forEach(item => {
          settingsMap[item.key] = item.value_json !== null ? item.value_json : item.value;
        });

        return res.status(200).json(settingsMap);
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Ayarlar yüklenemedi.' });
      }

    case 'PUT':
      try {
        const updates = Object.entries(req.body).map(([key, value]) => {
          const isObj = typeof value === 'object' && value !== null;
          return {
            key,
            value: isObj ? null : String(value),
            value_json: isObj ? value : null,
            updated_at: new Date().toISOString()
          };
        });

        if (updates.length === 0) {
          return res.status(400).json({ error: 'Güncellenecek veri gönderilmedi.' });
        }

        const { data, error } = await supabase
          .from('site_settings')
          .upsert(updates, { onConflict: 'key' });

        if (error) throw error;

        return res.status(200).json({ success: true, message: 'Ayarlar başarıyla güncellendi.' });
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Ayarlar güncellenirken bir hata oluştu.' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).json({ error: `Method ${method} not allowed` });
  }
}
