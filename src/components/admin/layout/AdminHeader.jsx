import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Bell, ExternalLink, Globe, Home } from 'lucide-react';

const routeMap = {
  admin: 'Dashboard',
  urunler: 'Ürünler',
  yeni: 'Yeni Ekle',
  blog: 'Blog Yazıları',
  kategoriler: 'Kategoriler',
  siparisler: 'Siparişler',
  medya: 'Medya Kütüphanesi',
  bannerlar: 'Bannerlar',
  sayfalar: 'Sayfalar',
  yorumlar: 'Yorumlar',
  seo: 'SEO Yönetimi',
  iletisim: 'İletişim Bilgileri',
  kullanicilar: 'Kullanıcılar',
  ayarlar: 'Site Ayarları',
  yedekleme: 'Yedekleme',
  loglar: 'Sistem Logları',
};

export default function AdminHeader({ title }) {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Load unread count (e.g. pending comments + pending orders)
  useEffect(() => {
    const fetchNotificationCounts = async () => {
      try {
        const { count: pendingOrders } = await supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending');

        const { count: pendingComments } = await supabase
          .from('comments')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending');

        setUnreadNotifications((pendingOrders || 0) + (pendingComments || 0));
      } catch (err) {
        // Silent error handling
      }
    };

    fetchNotificationCounts();
    const interval = setInterval(fetchNotificationCounts, 60000);
    return () => clearInterval(interval);
  }, [supabase]);

  // Generate breadcrumbs dynamically based on path segments
  const pathSegments = router.pathname.split('/').filter(Boolean);
  
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-10">
      {/* Page Title & Dynamic Breadcrumbs */}
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-white tracking-tight leading-none mb-1">
          {title}
        </h1>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Link href="/admin" className="hover:text-white transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>
          {pathSegments.map((segment, index) => {
            if (segment === 'admin') return null; // skip base admin
            
            // Check if segment is a dynamic param (like [id] or [slug])
            const isDynamic = segment.startsWith('[') && segment.endsWith(']');
            const displayLabel = isDynamic 
              ? (router.query.id || router.query.slug || 'Detay')
              : (routeMap[segment] || segment);

            const path = '/' + pathSegments.slice(0, index + 1).join('/');

            return (
              <span key={path} className="flex items-center gap-1.5">
                <span>/</span>
                {index === pathSegments.length - 1 ? (
                  <span className="text-slate-300 font-medium truncate max-w-[120px]">{displayLabel}</span>
                ) : (
                  <Link href={path} className="hover:text-white transition-colors">
                    {displayLabel}
                  </Link>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        {/* Open Public Site Link */}
        <a 
          href="/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs font-semibold border border-slate-700/50 group"
          title="Önizleme (Yeni Sekme)"
        >
          <Globe className="w-3.5 h-3.5 text-[#7FA34D]" />
          <span>Siteyi Görüntüle</span>
          <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-slate-300 transition-colors" />
        </a>

        {/* Notifications Icon */}
        <Link 
          href={unreadNotifications > 0 ? "/admin/siparisler" : "/admin"}
          className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Bildirimler"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-slate-900 animate-ping"></span>
          )}
        </Link>
      </div>
    </header>
  );
}
