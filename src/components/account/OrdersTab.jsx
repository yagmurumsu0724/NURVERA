import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function OrdersTab({ user }) {
  const supabase = useSupabaseClient();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      try {
        // order_type = 'standard' for regular orders
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .eq('order_type', 'standard')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        toast.error('Siparişler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user, supabase]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-xs font-medium flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Bekliyor</span>;
      case 'processing': return <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> Hazırlanıyor</span>;
      case 'shipped': return <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> Kargoya Verildi</span>;
      case 'delivered': return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Teslim Edildi</span>;
      case 'cancelled': return <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" /> İptal Edildi</span>;
      default: return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-serif font-bold text-nurvera-text mb-6">Geçmiş Siparişlerim</h3>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-nurvera-olive border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Sipariş No</p>
                  <p className="font-semibold text-gray-900">{order.order_number}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tarih</p>
                  <p className="font-medium text-gray-700">{new Date(order.created_at).toLocaleDateString('tr-TR')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tutar</p>
                  <p className="font-semibold text-nurvera-olive">₺{order.total}</p>
                </div>
                <div>
                  {getStatusBadge(order.status)}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col gap-4">
                  {order.items && order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg border border-gray-100" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-300" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{item.qty} Adet x ₺{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="w-16 h-16 text-gray-200 mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Henüz siparişiniz yok</h4>
          <p className="text-gray-500 max-w-sm mb-6">Doğal ve katkısız ürünlerimizi keşfetmek için mağazamızı ziyaret edebilirsiniz.</p>
          <Link href="/urunler" className="px-6 py-3 bg-nurvera-olive text-white rounded-xl font-medium hover:bg-opacity-90 transition-all">
            Alışverişe Başla
          </Link>
        </div>
      )}
    </div>
  );
}
