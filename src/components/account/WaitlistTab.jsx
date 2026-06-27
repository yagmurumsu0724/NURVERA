import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Clock, Trash2, BellRing } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function WaitlistTab({ user }) {
  const supabase = useSupabaseClient();
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWaitlist() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('waitlist')
          .select(`
            id,
            status,
            created_at,
            products:product_id (id, name, main_image, slug, stock_quantity)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setWaitlist(data || []);
      } catch (err) {
        toast.error('Bekleme listesi yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }
    fetchWaitlist();
  }, [user, supabase]);

  const removeWaitlist = async (id) => {
    try {
      const { error } = await supabase
        .from('waitlist')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setWaitlist(waitlist.filter(item => item.id !== id));
      toast.success('Ürün bekleme listesinden çıkarıldı.');
    } catch (err) {
      toast.error('Silme işlemi başarısız oldu.');
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-serif font-bold text-nurvera-text mb-6">Beklediğim Ürünler</h3>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-nurvera-olive border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : waitlist.length > 0 ? (
        <div className="space-y-4">
          {waitlist.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
              <Link href={`/urunler/${item.products?.slug}`} className="shrink-0">
                {item.products?.main_image ? (
                  <img src={item.products.main_image} alt={item.products?.name} className="w-24 h-24 object-cover rounded-lg border border-gray-100" />
                ) : (
                  <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                    <Clock className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </Link>
              
              <div className="flex-1 text-center sm:text-left">
                <Link href={`/urunler/${item.products?.slug}`}>
                  <h4 className="text-[15px] font-semibold text-gray-900 hover:text-nurvera-olive transition-colors mb-1">{item.products?.name}</h4>
                </Link>
                <p className="text-xs text-gray-500 mb-2">Tarih: {new Date(item.created_at).toLocaleDateString('tr-TR')}</p>
                
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  {item.products?.stock_quantity > 0 ? (
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[11px] font-medium flex items-center gap-1">
                      <BellRing className="w-3 h-3" /> Stokta Var
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-yellow-50 text-yellow-600 rounded-md text-[11px] font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Bekleniyor
                    </span>
                  )}
                  {item.status === 'notified' && (
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-[11px] font-medium">Haber Verildi</span>
                  )}
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                {item.products?.stock_quantity > 0 && (
                  <Link href={`/urunler/${item.products?.slug}`} className="px-4 py-2 bg-nurvera-olive text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition-all">
                    Satın Al
                  </Link>
                )}
                <button
                  onClick={() => removeWaitlist(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Listeden Çıkar"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Clock className="w-16 h-16 text-gray-200 mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Beklediğiniz bir ürün yok</h4>
          <p className="text-gray-500 max-w-sm mb-6">Stokta olmayan ürünler için 'Gelince Haber Ver' butonunu kullanarak bekleme listesine ekleyebilirsiniz.</p>
          <Link href="/urunler" className="px-6 py-3 bg-nurvera-olive text-white rounded-xl font-medium hover:bg-opacity-90 transition-all">
            Mağazaya Dön
          </Link>
        </div>
      )}
    </div>
  );
}
