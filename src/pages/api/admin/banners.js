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

  if (!roleData || !roleData.is_active || !['admin', 'editor'].includes(roleData.role)) {
    return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
  }

  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      try {
        const { data, error } = await supabase
          .from('banners')
          .select('*')
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false });

        if (error) throw error;
        return res.status(200).json(data);
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Bannerlar yüklenirken bir hata oluştu.' });
      }

    case 'POST':
      try {
        const { 
          title, 
          banner_type, 
          image_url, 
          mobile_image_url, 
          link_url, 
          link_target, 
          button_text, 
          sort_order, 
          is_active, 
          starts_at, 
          ends_at, 
          popup_delay, 
          popup_trigger 
        } = req.body;

        if (!title || !banner_type || !image_url) {
          return res.status(400).json({ error: 'Başlık, banner tipi ve görsel URL alanları zorunludur.' });
        }

        const { data, error } = await supabase
          .from('banners')
          .insert([{
            title,
            banner_type,
            image_url,
            mobile_image_url: mobile_image_url || null,
            link_url: link_url || null,
            link_target: link_target || '_self',
            button_text: button_text || null,
            sort_order: Number(sort_order) || 0,
            is_active: is_active !== false,
            starts_at: starts_at || null,
            ends_at: ends_at || null,
            popup_delay: Number(popup_delay) || 3,
            popup_trigger: popup_trigger || 'load'
          }])
          .select()
          .single();

        if (error) throw error;

        return res.status(201).json(data);
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Banner eklenirken bir hata oluştu.' });
      }

    case 'PUT':
      try {
        const targetId = id || req.body.id;

        if (!targetId) {
          return res.status(400).json({ error: 'Banner ID gereklidir.' });
        }

        const { 
          title, 
          banner_type, 
          image_url, 
          mobile_image_url, 
          link_url, 
          link_target, 
          button_text, 
          sort_order, 
          is_active, 
          starts_at, 
          ends_at, 
          popup_delay, 
          popup_trigger 
        } = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (banner_type !== undefined) updateData.banner_type = banner_type;
        if (image_url !== undefined) updateData.image_url = image_url;
        if (mobile_image_url !== undefined) updateData.mobile_image_url = mobile_image_url;
        if (link_url !== undefined) updateData.link_url = link_url;
        if (link_target !== undefined) updateData.link_target = link_target;
        if (button_text !== undefined) updateData.button_text = button_text;
        if (sort_order !== undefined) updateData.sort_order = Number(sort_order) || 0;
        if (is_active !== undefined) updateData.is_active = is_active;
        if (starts_at !== undefined) updateData.starts_at = starts_at;
        if (ends_at !== undefined) updateData.ends_at = ends_at;
        if (popup_delay !== undefined) updateData.popup_delay = Number(popup_delay);
        if (popup_trigger !== undefined) updateData.popup_trigger = popup_trigger;

        const { data, error } = await supabase
          .from('banners')
          .update(updateData)
          .eq('id', targetId)
          .select()
          .single();

        if (error) throw error;

        return res.status(200).json(data);
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Banner güncellenirken bir hata oluştu.' });
      }

    case 'DELETE':
      try {
        const targetId = id || req.body.id;

        if (!targetId) {
          return res.status(400).json({ error: 'Banner ID gereklidir.' });
        }

        const { error } = await supabase
          .from('banners')
          .delete()
          .eq('id', targetId);

        if (error) throw error;
        return res.status(200).json({ success: true, message: 'Banner başarıyla silindi.' });
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Banner silinirken bir hata oluştu.' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${method} not allowed` });
  }
}
