import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import StatsCard from '@/components/admin/dashboard/StatsCard';
import { withAdminAuth } from '@/lib/withAdminAuth';
import { 
  Package, 
  FileText, 
  ShoppingBag, 
  Image, 
  Plus, 
  Upload, 
  Settings, 
  TrendingUp, 
  AlertTriangle,
  MessageSquare,
  ChevronRight,
  Eye
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch('/api/admin/dashboard-stats');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Stats fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="space-y-8 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-800 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-80 bg-slate-800 rounded-xl"></div>
            <div className="h-80 bg-slate-800 rounded-xl"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const stats = data?.stats || {
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
  };

  const trendData = data?.trend || [];
  const recentProducts = data?.recentProducts || [];
  const recentComments = data?.recentComments || [];

  return (
    <AdminLayout title="Dashboard">
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          title="Yayınlanan Ürünler" 
          value={stats.published_products} 
          icon={Package} 
          color="green" 
        />
        <StatsCard 
          title="Bekleyen Siparişler" 
          value={stats.pending_orders} 
          icon={ShoppingBag} 
          color="gold" 
        />
        <StatsCard 
          title="Blog Yazıları" 
          value={stats.published_blogs} 
          icon={FileText} 
          color="blue" 
        />
        <StatsCard 
          title="Bekleyen Yorumlar" 
          value={stats.pending_comments} 
          icon={MessageSquare} 
          color="red" 
        />
      </div>

      {/* Grafik + Hızlı İşlemler */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Satış Grafiği */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#7FA34D]" />
              Son 30 Günlük Sipariş Trendi
            </h3>
            {stats.todays_orders > 0 && (
              <span className="text-xs px-2.5 py-1 bg-[#1E4D3A] text-[#7FA34D] font-bold rounded-full animate-pulse">
                Bugün {stats.todays_orders} Yeni Sipariş!
              </span>
            )}
          </div>
          
          <div className="w-full h-[280px]">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7FA34D" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#7FA34D" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ 
                      background: '#0f172a', 
                      border: '1px solid #1e293b', 
                      borderRadius: '12px',
                      color: '#f8fafc'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    name="Sipariş" 
                    dataKey="orders" 
                    stroke="#7FA34D" 
                    strokeWidth={2}
                    fill="url(#colorOrders)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
                Grafik verisi bulunmuyor
              </div>
            )}
          </div>
        </div>

        {/* Hızlı İşlemler */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#7FA34D]" />
              Hızlı İşlemler
            </h3>
            <div className="space-y-3">
              <Link 
                href="/admin/urunler/yeni"
                className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/30 hover:border-[#7FA34D]/30 hover:bg-[#1E4D3A]/20 transition-all group text-sm text-slate-300 hover:text-white"
              >
                <div className="p-2 rounded-lg bg-[#1E4D3A] text-[#7FA34D] group-hover:scale-110 transition-transform">
                  <Package className="w-4 h-4" />
                </div>
                <span>Yeni Ürün Ekle</span>
              </Link>

              <Link 
                href="/admin/blog/yeni"
                className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/30 hover:border-[#7FA34D]/30 hover:bg-[#1E4D3A]/20 transition-all group text-sm text-slate-300 hover:text-white"
              >
                <div className="p-2 rounded-lg bg-blue-900/50 text-blue-400 group-hover:scale-110 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <span>Yeni Blog Yazısı Yaz</span>
              </Link>

              <Link 
                href="/admin/medya"
                className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/30 hover:border-[#7FA34D]/30 hover:bg-[#1E4D3A]/20 transition-all group text-sm text-slate-300 hover:text-white"
              >
                <div className="p-2 rounded-lg bg-purple-900/50 text-purple-400 group-hover:scale-110 transition-transform">
                  <Upload className="w-4 h-4" />
                </div>
                <span>Medya Kütüphanesine Yükle</span>
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 mt-6">
            <Link 
              href="/admin/ayarlar"
              className="flex items-center justify-between text-xs text-[#7FA34D] hover:underline font-semibold"
            >
              <span>Site ayarlarına git</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Son Eklenenler Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Son Ürünler */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Son Eklenen Ürünler</h3>
            <Link href="/admin/urunler" className="text-xs text-[#7FA34D] hover:underline font-semibold flex items-center gap-1">
              <span>Tümünü Gör</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-xs uppercase text-slate-400 bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3">Ürün</th>
                  <th className="px-4 py-3">Stok</th>
                  <th className="px-4 py-3">Fiyat</th>
                  <th className="px-4 py-3">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentProducts.length > 0 ? (
                  recentProducts.map(prod => (
                    <tr key={prod.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-white truncate max-w-[180px]" title={prod.name}>
                        {prod.name}
                      </td>
                      <td className="px-4 py-3 font-mono">{prod.stock}</td>
                      <td className="px-4 py-3 font-mono text-emerald-400">{prod.price} TL</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          prod.status === 'published' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                        }`}>
                          {prod.status === 'published' ? 'Yayında' : 'Taslak'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-slate-500">Ürün bulunamadı</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Son Yorumlar */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Son Yorumlar</h3>
            <Link href="/admin/yorumlar" className="text-xs text-[#7FA34D] hover:underline font-semibold flex items-center gap-1">
              <span>Tümünü Gör</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentComments.length > 0 ? (
              recentComments.map(comment => (
                <div key={comment.id} className="p-3 bg-slate-800/30 border border-slate-800/50 rounded-xl flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{comment.customer_name}</span>
                    <span className="text-slate-500">
                      {new Date(comment.created_at).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 truncate" title={comment.content}>
                    {comment.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < comment.rating ? 'opacity-100' : 'opacity-20'}>★</span>
                      ))}
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      comment.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : comment.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {comment.status === 'pending' ? 'Bekliyor' : comment.status === 'approved' ? 'Onaylı' : 'Reddedildi'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm">Henüz yorum bulunmuyor</div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

AdminDashboard.getLayout = (page) => page;

export default withAdminAuth(AdminDashboard);
