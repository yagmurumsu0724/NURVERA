import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req, res) {
  // 1. Authenticate Request
  const supabase = createServerSupabaseClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: 'Yetkisiz erişim' });
  }

  // 2. Authorize Request (Admin, Editor, Moderator)
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
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false });

        if (error) throw error;
        return res.status(200).json(data);
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Kategoriler listelenirken bir hata oluştu.' });
      }

    case 'POST':
      try {
        const { name, slug, description, parent_id, image_url, sort_order, is_active, seo_title, seo_description } = req.body;

        if (!name || !slug) {
          return res.status(400).json({ error: 'Kategori adı ve slug gereklidir.' });
        }

        const { data, error } = await supabase
          .from('categories')
          .insert([{
            name,
            slug: slug.toLowerCase().replace(/[^a-z0-9-]+/g, '-'),
            description,
            parent_id: parent_id || null,
            image_url,
            sort_order: Number(sort_order) || 0,
            is_active: is_active !== false,
            seo_title,
            seo_description
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
        return res.status(500).json({ error: err.message || 'Kategori eklenirken bir hata oluştu.' });
      }

    case 'PUT':
      try {
        const { id: bodyId, name, slug, description, parent_id, image_url, sort_order, is_active, seo_title, seo_description } = req.body;
        const targetId = id || bodyId;

        if (!targetId) {
          return res.status(400).json({ error: 'Kategori ID gereklidir.' });
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (slug !== undefined) updateData.slug = slug.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
        if (description !== undefined) updateData.description = description;
        if (parent_id !== undefined) updateData.parent_id = parent_id || null;
        if (image_url !== undefined) updateData.image_url = image_url;
        if (sort_order !== undefined) updateData.sort_order = Number(sort_order) || 0;
        if (is_active !== undefined) updateData.is_active = is_active;
        if (seo_title !== undefined) updateData.seo_title = seo_title;
        if (seo_description !== undefined) updateData.seo_description = seo_description;

        const { data, error } = await supabase
          .from('categories')
          .update(updateData)
          .eq('id', targetId)
          .select()
          .single();

        if (error) {
          if (error.code === '23505') {
            return res.status(400).json({ error: 'Bu slug zaten kullanımda.' });
          }
          throw error;
        }

        return res.status(200).json(data);
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Kategori güncellenirken bir hata oluştu.' });
      }

    case 'DELETE':
      try {
        const targetId = id || req.body.id;

        if (!targetId) {
          return res.status(400).json({ error: 'Kategori ID gereklidir.' });
        }

        // Set subcategories parent to null first (PostgreSQL reference constraint checks)
        await supabase
          .from('categories')
          .update({ parent_id: null })
          .eq('parent_id', targetId);

        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', targetId);

        if (error) throw error;
        return res.status(200).json({ success: true, message: 'Kategori başarıyla silindi.' });
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Kategori silinirken bir hata oluştu.' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${method} not allowed` });
  }
}
