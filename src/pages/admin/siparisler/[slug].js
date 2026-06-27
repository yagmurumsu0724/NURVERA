import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { withAdminAuth } from '@/lib/withAdminAuth';
import { 
  ChevronLeft, 
  ShoppingBag, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Truck, 
  Save, 
  FileText 
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

function OrderDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const id = slug;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [tracking, setTracking] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
        setStatus(data.status);
        setPaymentStatus(data.payment_status);
        setTracking(data.shipping_tracking || '');
        setAdminNotes(data.admin_notes || '');
      } else {
        toast.error('Sipariş yüklenemedi.');
        router.push('/admin/siparisler');
      }
    } catch (err) {
      toast.error('Bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          payment_status: paymentStatus,
          shipping_tracking: tracking,
          admin_notes: adminNotes
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Sipariş başarıyla güncellendi.');
        setOrder(data);
      } else {
        toast.error(data.error || 'Güncelleme hatası.');
      }
    } catch (err) {
      toast.error('Bir hata oluştu.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Sipariş Detayı">
        <div className="flex items-center justify-center h-96">
          <div className="w-8 h-8 border-2 border-[#7FA34D] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout title="Sipariş Detayı">
        <div className="py-12 text-center text-slate-500">Sipariş bulunamadı.</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={order.order_number || `Sipariş Detayı`}>
      <div className="flex flex-col gap-6">
        
        {/* Back Link */}
        <div className="flex items-center">
          <Link 
            href="/admin/siparisler" 
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sipariş Listesine Dön</span>
          </Link>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT COLUMN: Customer and Items (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Customer Information Card */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#7FA34D]" />
                Müşteri ve Teslimat Bilgileri
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                {/* Contact details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-300">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="font-medium text-white">{order.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span>{order.customer_email}</span>
                  </div>
                  {order.customer_phone && (
                    <div className="flex items-center gap-3 text-slate-300">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <span>{order.customer_phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-slate-300">
                    <CreditCard className="w-4 h-4 text-slate-500" />
                    <span>Ödeme Türü: <span className="text-white font-semibold uppercase">{order.payment_method || 'Kredi Kartı'}</span></span>
                  </div>
                </div>

                {/* Address details */}
                <div className="space-y-2 text-slate-300">
                  <span className="text-xs uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    Teslimat Adresi
                  </span>
                  <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800 text-xs leading-relaxed">
                    <p className="font-semibold text-white mb-1">
                      {order.shipping_address?.title || 'Adres'}
                    </p>
                    <p>{order.shipping_address?.address || '-'}</p>
                    <p className="mt-1 font-semibold">
                      {order.shipping_address?.city || '-'} / {order.shipping_address?.district || '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#7FA34D]" />
                Sipariş İçeriği
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-300">
                  <thead className="text-xs uppercase text-slate-400 bg-slate-800/50">
                    <tr>
                      <th className="px-4 py-3">Ürün</th>
                      <th className="px-4 py-3 text-right">Birim Fiyat</th>
                      <th className="px-4 py-3 text-center">Adet</th>
                      <th className="px-4 py-3 text-right">Toplam</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {order.items?.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/20">
                        <td className="px-4 py-3 font-semibold text-white flex items-center gap-3">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-slate-800" />
                          )}
                          <span className="truncate max-w-[200px]" title={item.name}>{item.name}</span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs">{item.price} TL</td>
                        <td className="px-4 py-3 text-center font-mono">{item.qty}</td>
                        <td className="px-4 py-3 text-right font-mono text-emerald-400 font-semibold">
                          {(Number(item.price) * item.qty).toFixed(2)} TL
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Order pricing summary */}
              <div className="mt-6 pt-6 border-t border-slate-800 flex justify-end">
                <div className="w-64 space-y-2 text-sm text-slate-400">
                  <div className="flex justify-between">
                    <span>Ara Toplam:</span>
                    <span className="font-mono text-white">{order.subtotal} TL</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kargo Ücreti:</span>
                    <span className="font-mono text-white">{order.shipping_cost || '0.00'} TL</span>
                  </div>
                  {Number(order.discount_amount) > 0 && (
                    <div className="flex justify-between text-red-400">
                      <span>İndirim:</span>
                      <span className="font-mono">-{order.discount_amount} TL</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                    <span>Genel Toplam:</span>
                    <span className="font-mono text-emerald-400">{order.total} TL</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Order Control Status Panel (1/3) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Status updates Form */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#7FA34D]" />
                Sipariş Yönetimi
              </h3>

              <form onSubmit={handleUpdateOrder} className="space-y-4">
                {/* Order Status */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Sipariş Durumu</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:border-[#7FA34D]"
                  >
                    <option value="pending">Beklemede</option>
                    <option value="confirmed">Onaylandı</option>
                    <option value="processing">Hazırlanıyor</option>
                    <option value="shipped">Kargolandı</option>
                    <option value="delivered">Teslim Edildi</option>
                    <option value="cancelled">İptal Edildi</option>
                    <option value="refunded">İade Edildi</option>
                  </select>
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Ödeme Durumu</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:border-[#7FA34D]"
                  >
                    <option value="pending">Ödenmedi</option>
                    <option value="paid">Ödendi</option>
                    <option value="failed">Başarısız</option>
                    <option value="refunded">İade Edildi</option>
                  </select>
                </div>

                {/* Shipping Tracking */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Kargo Takip Numarası</label>
                  <input
                    type="text"
                    value={tracking}
                    onChange={(e) => setTracking(e.target.value)}
                    placeholder="MNG12345678"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:border-[#7FA34D]"
                  />
                </div>

                {/* Admin Notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-slate-550" />
                    Yönetici Notları (Gizli)
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Siparişle ilgili özel notlar..."
                    rows="3"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:outline-none focus:border-[#7FA34D] resize-none text-xs"
                  />
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-slate-950 bg-[#7FA34D] hover:bg-[#8eb85c] focus:outline-none transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {updating ? (
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Güncellemeleri Kaydet</span>
                    </>
                  )}
                </button>

              </form>
            </div>

          </div>

        </div>

      </div>
    </AdminLayout>
  );
}

OrderDetailPage.getLayout = (page) => page;

export default withAdminAuth(OrderDetailPage);
