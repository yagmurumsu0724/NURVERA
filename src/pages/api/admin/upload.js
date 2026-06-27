import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export const config = {
  api: {
    bodyParser: false, // Disables standard JSON/form body parsing to read raw binary stream
  },
};

const readStreamToBuffer = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', (err) => reject(err));
  });
};

export default async function handler(req, res) {
  const { method } = req;

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${method} not allowed` });
  }

  try {
    const { name, type, folder = 'general' } = req.query;
    
    if (!name) {
      return res.status(400).json({ error: 'Dosya adı (name) parametresi gereklidir.' });
    }

    // Read raw body stream into buffer FIRST, before any awaits that might cause the stream to drop data
    const buffer = await readStreamToBuffer(req);
    
    if (buffer.length === 0) {
      return res.status(400).json({ error: 'Gönderilen dosya içeriği boş.' });
    }

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

    const fileExt = name.split('.').pop();
    const uniqueFileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${uniqueFileName}`;

    // Upload to Supabase Storage using Admin client (bypasses RLS)
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('nurvera-media')
      .upload(filePath, buffer, {
        contentType: type || 'image/jpeg',
        upsert: true
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('nurvera-media')
      .getPublicUrl(filePath);

    // Save to media_files table so it appears in the gallery
    await supabaseAdmin.from('media_files').insert([{
      file_name: uniqueFileName,
      original_name: name,
      file_url: publicUrl,
      file_path: filePath,
      file_type: type || 'image/jpeg',
      file_size: buffer.length,
      folder: folder,
      uploaded_by: session.user.id
    }]);

    return res.status(200).json({ url: publicUrl });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Yükleme sırasında bir hata oluştu.' });
  }
}
