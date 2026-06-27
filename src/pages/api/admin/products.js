import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { productSchema } from '@/lib/validators/productSchema';

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

  switch (method) {
    case 'GET':
      try {
        const { search, category_id, status, page = 1, limit = 10, sort_by = 'created_at', sort_order = 'desc' } = req.query;
        
        let query = supabase
          .from('products')
          .select('*, categories(id, name)', { count: 'exact' });

        // Apply filters
        if (search) {
          query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%,description.ilike.%${search}%`);
        }
        if (category_id) {
          query = query.eq('category_id', category_id);
        }
        if (status) {
          query = query.eq('status', status);
        }

        // Apply Sorting
        query = query.order(sort_by, { ascending: sort_order === 'asc' });

        // Pagination
        const from = (Number(page) - 1) * Number(limit);
        const to = from + Number(limit) - 1;
        query = query.range(from, to);

        const { data, count, error } = await query;

        if (error) throw error;

        const mappedProducts = (data || []).map(p => ({
          ...p,
          size: p.schema_data?.size || '',
          usage: p.schema_data?.usage || '',
          ingredients: p.schema_data?.ingredients || ''
        }));

        return res.status(200).json({
          products: mappedProducts,
          total: count,
          page: Number(page),
          totalPages: Math.ceil(count / Number(limit))
        });
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Ürünler listelenirken bir hata oluştu.' });
      }

    case 'POST':
      try {
        // Validate request body
        const validation = productSchema.safeParse(req.body);
        if (!validation.success) {
          const errors = validation.error.format();
          return res.status(400).json({ error: 'Geçersiz veri biçimi.', details: errors });
        }

        const { size, usage, ingredients, ...restData } = validation.data;
        const schema_data = {
          size: size || null,
          usage: usage || null,
          ingredients: ingredients || null,
          ...(validation.data.schema_data || {})
        };

        // Generate publish date if active
        const published_at = restData.status === 'published' ? new Date().toISOString() : null;

        const { data, error } = await supabase
          .from('products')
          .insert([{
            ...restData,
            schema_data,
            published_at
          }])
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

        return res.status(201).json(responseData);
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Ürün eklenirken bir hata oluştu.' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${method} not allowed` });
  }
}
