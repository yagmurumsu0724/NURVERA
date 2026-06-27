import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req, res) {
  // 1. Authenticate Request
  const supabase = createServerSupabaseClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: 'Yetkisiz erişim' });
  }

  // 2. Authorize Request (Admin, Editor, Moderator roles)
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role, is_active')
    .eq('user_id', session.user.id)
    .single();

  if (!roleData || !roleData.is_active || !['admin', 'editor', 'moderator'].includes(roleData.role)) {
    return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    // 3. Fetch Dashboard Stats View
    const { data: viewStats, error: statsError } = await supabase
      .from('dashboard_stats')
      .select('*')
      .single();

    if (statsError) throw statsError;

    // 4. Fetch 30-day Order Trend
    // Grouping orders by date in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('created_at, total')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    if (orderError) throw orderError;

    // Process order data into daily trends
    const dailyMap = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
      const isoStr = d.toISOString().split('T')[0];
      dailyMap[isoStr] = { label: dateStr, count: 0, revenue: 0 };
    }

    orderData?.forEach(order => {
      const dateStr = order.created_at.split('T')[0];
      if (dailyMap[dateStr]) {
        dailyMap[dateStr].count += 1;
        dailyMap[dateStr].revenue += Number(order.total) || 0;
      }
    });

    const trend = Object.keys(dailyMap)
      .sort()
      .map(key => ({
        date: dailyMap[key].label,
        orders: dailyMap[key].count,
        revenue: dailyMap[key].revenue
      }));

    // 5. Fetch Recent Activities (recent products, recent comments)
    const { data: recentProducts } = await supabase
      .from('products')
      .select('id, name, price, stock, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: recentComments } = await supabase
      .from('comments')
      .select('id, customer_name, content, rating, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    return res.status(200).json({
      stats: viewStats || {
        published_products: 0,
        draft_products: 0,
        low_stock_products: 0,
        published_blogs: 0,
        draft_blogs: 0,
        pending_orders: 0,
        todays_orders: 0,
        todays_revenue: 0,
        total_media: 0,
        pending_comments: 0
      },
      trend,
      recentProducts: recentProducts || [],
      recentComments: recentComments || []
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Sunucu hatası oluştu' });
  }
}
