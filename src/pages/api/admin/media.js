import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req, res) {
  const { method } = req;
  const supabase = createServerSupabaseClient({ req, res });

  // 1. Authenticate Request
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

  switch (method) {
    case 'GET':
      try {
        const { folder } = req.query;
        let query = supabaseAdmin
          .from('media_files')
          .select('*')
          .order('created_at', { ascending: false });

        if (folder && folder !== 'all') {
          query = query.eq('folder', folder);
        }

        const { data, error } = await query;
        if (error) throw error;

        return res.status(200).json(data);
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Medyalar listelenirken hata oluştu.' });
      }

    case 'DELETE':
      try {
        const { id, filePath } = req.body;
        if (!id || !filePath) {
          return res.status(400).json({ error: 'ID ve dosya yolu gereklidir.' });
        }

        // 1. Delete from Supabase Storage
        const { error: storageError } = await supabaseAdmin.storage
          .from('nurvera-media')
          .remove([filePath]);

        if (storageError) {
          // It's possible the file doesn't exist in storage anymore, log it but don't fail completely
          console.error('Storage deletion error:', storageError);
        }

        // 2. Delete from media_files table
        const { error: dbError } = await supabaseAdmin
          .from('media_files')
          .delete()
          .eq('id', id);

        if (dbError) throw dbError;

        return res.status(200).json({ message: 'Medya başarıyla silindi.' });
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Silme işlemi başarısız oldu.' });
      }

    default:
      res.setHeader('Allow', ['GET', 'DELETE']);
      return res.status(405).json({ error: `Method ${method} not allowed` });
  }
}
