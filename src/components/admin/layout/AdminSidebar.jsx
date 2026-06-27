import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';

// Menu definitions
export const adminMenuItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: 'LayoutDashboard',
    exact: true
  },
  {
    label: 'Ürünler',
    icon: 'Package',
    children: [
      { label: 'Tüm Ürünler', href: '/admin/urunler' },
      { label: 'Yeni Ürün', href: '/admin/urunler/yeni' },
      { label: 'Kategoriler', href: '/admin/kategoriler' },
    ]
  },
  {
    label: 'Blog',
    icon: 'FileText',
    children: [
      { label: 'Tüm Yazılar', href: '/admin/blog' },
      { label: 'Yeni Yazı', href: '/admin/blog/yeni' },
    ]
  },
  {
    label: 'Siparişler',
    href: '/admin/siparisler',
    icon: 'ShoppingBag',
    badgeKey: 'pending_orders'
  },
  {
    label: 'Medya',
    href: '/admin/medya',
    icon: 'Image'
  },
  {
    label: 'Bannerlar',
    href: '/admin/bannerlar',
    icon: 'Layers'
  },
  {
    label: 'Sayfalar',
    href: '/admin/sayfalar',
    icon: 'Layout'
  },
  {
    label: 'Yorumlar',
    href: '/admin/yorumlar',
    icon: 'MessageSquare',
    badgeKey: 'pending_comments'
  },
  {
    label: 'SEO',
    href: '/admin/seo',
    icon: 'Search'
  },
  {
    label: 'İletişim',
    href: '/admin/ayarlar?tab=contact',
    icon: 'Phone'
  },
  {
    label: 'Kullanıcılar',
    href: '/admin/kullanicilar',
    icon: 'Users',
    adminOnly: true
  },
  {
    label: 'Ayarlar',
    href: '/admin/ayarlar',
    icon: 'Settings'
  },
  {
    label: 'Yedekleme',
    href: '/admin/yedekleme',
    icon: 'Database',
    adminOnly: true
  },
  {
    label: 'Loglar',
    href: '/admin/loglar',
    icon: 'Activity',
    adminOnly: true
  }
];

export default function AdminSidebar({ collapsed, onToggle }) {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const { session } = useSessionContext();
  
  const [userRole, setUserRole] = useState('editor');
  const [userEmail, setUserEmail] = useState('');
  const [stats, setStats] = useState({ pending_orders: 0, pending_comments: 0 });
  const [openMenus, setOpenMenus] = useState({});

  // Get user details and role
  useEffect(() => {
    if (session?.user) {
      setUserEmail(session.user.email);
      supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single()
        .then(({ data }) => {
          if (data?.role) {
            setUserRole(data.role);
          }
        });
    }
  }, [session, supabase]);

  // Fetch pending badge counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const { data: orderData } = await supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending');

        const { data: commentData } = await supabase
          .from('comments')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending');

        setStats({
          pending_orders: orderData?.length || 0,
          pending_comments: commentData?.length || 0
        });
      } catch (err) {
        // Silent catch
      }
    };

    if (session) {
      fetchCounts();
      // Poll every 60 seconds
      const interval = setInterval(fetchCounts, 60000);
      return () => clearInterval(interval);
    }
  }, [session, supabase]);

  // Toggle submenu open status
  const toggleMenu = (label) => {
    setOpenMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const renderIcon = (name, className = "w-5 h-5") => {
    const IconComponent = Icons[name] || Icons.HelpCircle;
    return <IconComponent className={className} />;
  };

  // Helper to determine if a menu item is active
  const isItemActive = (item) => {
    if (item.href) {
      return item.exact ? router.pathname === item.href : router.pathname.startsWith(item.href);
    }
    if (item.children) {
      return item.children.some(child => router.pathname === child.href);
    }
    return false;
  };

  return (
    <aside 
      className={`h-screen bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-all duration-300 admin-sidebar ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2 font-serif text-xl font-bold text-white tracking-wider">
              <span className="text-[#7FA34D]">NUR</span>VERA
              <span className="text-xs px-2 py-0.5 bg-[#1E4D3A] text-[#7FA34D] font-sans font-medium rounded-full">CMS</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/admin" className="mx-auto font-serif text-2xl font-bold text-[#7FA34D]">
              N
            </Link>
          )}
          <button 
            onClick={onToggle}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            {collapsed ? renderIcon('ChevronRight', 'w-4 h-4') : renderIcon('ChevronLeft', 'w-4 h-4')}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {adminMenuItems.map((item) => {
            // Check adminOnly permission
            if (item.adminOnly && userRole !== 'admin') return null;

            const active = isItemActive(item);
            const hasChildren = !!item.children;
            const isOpen = openMenus[item.label] || active;

            if (hasChildren) {
              return (
                <div key={item.label} className="space-y-1">
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      active 
                        ? 'bg-[#1E4D3A]/50 text-white' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {renderIcon(item.icon, `w-5 h-5 transition-colors ${active ? 'text-[#7FA34D]' : 'text-slate-400 group-hover:text-white'}`)}
                      {!collapsed && <span>{item.label}</span>}
                    </div>
                    {!collapsed && renderIcon(isOpen ? 'ChevronDown' : 'ChevronRight', 'w-4 h-4 text-slate-500')}
                  </button>

                  {!collapsed && isOpen && (
                    <div className="pl-9 space-y-1 mt-1 border-l border-slate-800 ml-5">
                      {item.children.map((child) => {
                        const childActive = router.pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                              childActive 
                                ? 'text-[#7FA34D] bg-slate-800' 
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                            }`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  active 
                    ? 'bg-[#1E4D3A] text-white border-l-4 border-[#7FA34D] pl-2' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {renderIcon(item.icon, `w-5 h-5 transition-colors ${active ? 'text-[#7FA34D]' : 'text-slate-400 group-hover:text-white'}`)}
                  {!collapsed && <span>{item.label}</span>}
                </div>
                {!collapsed && item.badgeKey && stats[item.badgeKey] > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-[#7FA34D] text-slate-900 rounded-full animate-pulse">
                    {stats[item.badgeKey]}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        {!collapsed ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1E4D3A] border border-[#7FA34D]/30 flex items-center justify-center font-bold text-[#7FA34D]">
                {userEmail ? userEmail[0].toUpperCase() : 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate text-slate-200">{userEmail}</p>
                <p className="text-xs text-[#7FA34D] uppercase font-bold tracking-wider">{userRole}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-slate-800 hover:border-red-500/30 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all text-xs font-semibold"
            >
              {renderIcon('LogOut', 'w-4 h-4')}
              <span>Çıkış Yap</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-[#1E4D3A] border border-[#7FA34D]/30 flex items-center justify-center font-bold text-[#7FA34D] cursor-pointer" title={userEmail}>
              {userEmail ? userEmail[0].toUpperCase() : 'A'}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
              title="Çıkış Yap"
            >
              {renderIcon('LogOut', 'w-4 h-4')}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
