import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { blogSchema } from '@/lib/validators/blogSchema';

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
          .from('blog_posts')
          .select('*, blog_categories(id, name)', { count: 'exact' });

        // Apply filters
        if (search) {
          query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`);
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

        return res.status(200).json({
          posts: data,
          total: count,
          page: Number(page),
          totalPages: Math.ceil(count / Number(limit))
        });
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Blog yazıları listelenirken bir hata oluştu.' });
      }

    case 'POST':
      try {
        // Validate request body
        const validation = blogSchema.safeParse(req.body);
        if (!validation.success) {
          const errors = validation.error.format();
          return res.status(400).json({ error: 'Geçersiz veri biçimi.', details: errors });
        }

        const postData = validation.data;

        // Generate publication dates and author metadata
        const published_at = postData.status === 'published' ? new Date().toISOString() : null;

        const { data, error } = await supabase
          .from('blog_posts')
          .insert([{
            ...postData,
            author_id: session.user.id,
            author_name: session.user.email ? session.user.email.split('@')[0] : 'Yönetici',
            published_at
          }])
          .select()
          .single();

        if (error) {
          if (error.code === '23505') {
            return res.status(400).json({ error: 'Bu slug zaten kullanımda.' });
          }
          throw error;
        }

        return res.status(201).json(data);
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Yazı eklenirken bir hata oluştu.' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${method} not allowed` });
  }
}
