import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { FileText, Clock, Package, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function PreOrdersTab({ user }) {
  const supabase = useSupabaseClient();
  const [preOrders, setPreOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPreOrders() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .eq('order_type', 'pre_order')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPreOrders(data || []);
      } catch (err) {
        toast.error('Ön siparişler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }
    fetchPreOrders();
  }, [user, supabase]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-xs font-medium flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Ön Sipariş Alındı</span>;
      case 'processing': return <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> Üretimde</span>;
      case 'shipped': return <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> Kargoya Verildi</span>;
      case 'delivered': return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Teslim Edildi</span>;
      case 'cancelled': return <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" /> İptal Edildi</span>;
      default: return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-serif font-bold text-nurvera-text mb-6">Ön Siparişlerim</h3>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-nurvera-olive border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : preOrders.length > 0 ? (
        <div className="space-y-6">
          {preOrders.map((order) => (
            <div key={order.id} className="border border-nurvera-olive/20 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
              <div className="absolute top-0 right-0 bg-nurvera-olive text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">
                ÖN SİPARİŞ
              </div>
              
              <div className="bg-[#fcfdfa] px-6 py-4 border-b border-nurvera-olive/10 flex flex-wrap justify-between items-center gap-4">
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
                
                <div className="mt-4 pt-4 border-t border-gray-100 bg-blue-50/50 p-4 rounded-xl flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Ön siparişiniz başarıyla alınmıştır. Ürünler stoklarımıza girdiğinde kargoya verilecek ve size SMS/E-posta ile bilgilendirme yapılacaktır. Tahmini teslimat süresi ürün sayfasında belirtildiği gibidir.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="w-16 h-16 text-gray-200 mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Henüz ön siparişiniz yok</h4>
          <p className="text-gray-500 max-w-sm mb-6">Özel üretim veya yeni sezon ürünlerimizi ön siparişle ayırtabilirsiniz.</p>
          <Link href="/urunler" className="px-6 py-3 bg-nurvera-olive text-white rounded-xl font-medium hover:bg-opacity-90 transition-all">
            Mağazayı İncele
          </Link>
        </div>
      )}
    </div>
  );
}
