import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

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

  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      try {
        // Fetch all user roles
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('*')
          .order('created_at', { ascending: false });

        if (rolesError) throw rolesError;

        // Fetch auth users from Supabase Admin API to match emails
        const { data: { users }, error: authError } = await supabaseAdmin.auth.admin.listUsers();
        if (authError) throw authError;

        // Merge role data with auth user email
        const userList = roles.map(roleItem => {
          const authUser = users.find(u => u.id === roleItem.user_id);
          return {
            ...roleItem,
            email: authUser ? authUser.email : 'Bilinmeyen Kullanıcı',
            last_sign_in: authUser ? authUser.last_sign_in_at : null
          };
        });

        return res.status(200).json(userList);
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Kullanıcılar yüklenemedi.' });
      }

    case 'PUT':
      try {
        const targetId = id || req.body.id;
        if (!targetId) {
          return res.status(400).json({ error: 'Kullanıcı ID gereklidir.' });
        }

        const { role, is_active } = req.body;

        const updateData = {};
        if (role !== undefined) updateData.role = role;
        if (is_active !== undefined) updateData.is_active = is_active;
        updateData.updated_at = new Date().toISOString();

        const { data, error } = await supabase
          .from('user_roles')
          .update(updateData)
          .eq('id', targetId)
          .select()
          .single();

        if (error) throw error;
        return res.status(200).json(data);
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Kullanıcı güncellenemedi.' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).json({ error: `Method ${method} not allowed` });
  }
}
