import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { productUpdateSchema } from '@/lib/validators/productSchema';

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
    return res.status(400).json({ error: 'Ürün ID gereklidir.' });
  }

  switch (method) {
    case 'GET':
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, categories(id, name)')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Ürün bulunamadı.' });

        const responseData = {
          ...data,
          size: data.schema_data?.size || '',
          usage: data.schema_data?.usage || '',
          ingredients: data.schema_data?.ingredients || ''
        };

        return res.status(200).json(responseData);
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Ürün yüklenirken bir hata oluştu.' });
      }

    case 'PUT':
      try {
        // Validate request body partially
        const validation = productUpdateSchema.safeParse(req.body);
        if (!validation.success) {
          const errors = validation.error.format();
          return res.status(400).json({ error: 'Geçersiz veri biçimi.', details: errors });
        }

        const { size, usage, ingredients, ...restData } = validation.data;
        
        const updatePayload = {
          ...restData
        };

        if (size !== undefined || usage !== undefined || ingredients !== undefined) {
          updatePayload.schema_data = {
            size: size || null,
            usage: usage || null,
            ingredients: ingredients || null,
            ...(validation.data.schema_data || {})
          };
        }

        // Manage published_at timestamp
        if (updatePayload.status) {
          if (updatePayload.status === 'published') {
            updatePayload.published_at = new Date().toISOString();
          } else {
            updatePayload.published_at = null;
          }
        }

        const { data, error } = await supabase
          .from('products')
          .update(updatePayload)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          if (error.code === '23505') {
            return res.status(400).json({ error: 'Bu slug veya SKU zaten kullanımda.' });
          }
          throw error;
        }

        const responseData = {
          ...data,
          size: data.schema_data?.size || '',
          usage: data.schema_data?.usage || '',
          ingredients: data.schema_data?.ingredients || ''
        };

        return res.status(200).json(responseData);
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Ürün güncellenirken bir hata oluştu.' });
      }

    case 'DELETE':
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) throw error;

        return res.status(200).json({ success: true, message: 'Ürün başarıyla silindi.' });
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Ürün silinirken bir hata oluştu.' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${method} not allowed` });
  }
}
