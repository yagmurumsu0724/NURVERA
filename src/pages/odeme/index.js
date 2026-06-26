import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShieldCheck, Truck, CreditCard, ChevronRight, CheckCircle2 } from 'lucide-react';
import useCartStore from '@/store/cartStore';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Eğer sepet boşsa ürünler sayfasına yönlendir
    if (items.length === 0) {
      router.push('/urunler');
    }
  }, [items, router]);

  const kargoUcreti = getTotalPrice() > 500 ? 0 : 50;
  const genelToplam = getTotalPrice() + kargoUcreti;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Temsili ödeme süreci (1.5 saniye)
    setTimeout(() => {
      clearCart();
      router.push('/siparis-basarili');
    }, 1500);
  };

  if (!mounted || items.length === 0) return null;

  return (
    <>
      <Head>
        <title>Güvenli Ödeme | NURVERA</title>
      </Head>

      <div className="min-h-screen bg-nurvera-bg pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-6xl">
          
          <div className="flex items-center text-sm font-medium text-nurvera-text/50 mb-10">
            <Link href="/urunler" className="hover:text-nurvera-olive">Koleksiyon</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-nurvera-forest">Güvenli Ödeme</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sol Form Alanı */}
            <div className="lg:w-2/3">
              <form id="checkout-form" onSubmit={handleSubmit}>
                
                {/* İletişim Bilgileri */}
                <div className="bg-white p-8 rounded-2xl shadow-sm mb-8">
                  <h2 className="text-xl font-serif text-nurvera-text mb-6">İletişim Bilgileri</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-nurvera-text/70 mb-2">Ad Soyad</label>
                      <input required type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-nurvera-olive transition-colors bg-gray-50/50" placeholder="Adınız Soyadınız" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-nurvera-text/70 mb-2">Telefon</label>
                      <input required type="tel" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-nurvera-olive transition-colors bg-gray-50/50" placeholder="0 (5XX) XXX XX XX" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-nurvera-text/70 mb-2">E-posta</label>
                      <input required type="email" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-nurvera-olive transition-colors bg-gray-50/50" placeholder="E-posta adresiniz" />
                    </div>
                  </div>
                </div>

                {/* Teslimat Adresi */}
                <div className="bg-white p-8 rounded-2xl shadow-sm mb-8">
                  <h2 className="text-xl font-serif text-nurvera-text mb-6 flex items-center">
                    <Truck className="mr-2 text-nurvera-olive" size={20} /> Teslimat Adresi
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-nurvera-text/70 mb-2">Açık Adres</label>
                      <textarea required rows="3" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-nurvera-olive transition-colors bg-gray-50/50" placeholder="Mahalle, sokak, bina, daire no..."></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-nurvera-text/70 mb-2">İl</label>
                      <input required type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-nurvera-olive transition-colors bg-gray-50/50" placeholder="İl" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-nurvera-text/70 mb-2">İlçe</label>
                      <input required type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-nurvera-olive transition-colors bg-gray-50/50" placeholder="İlçe" />
                    </div>
                  </div>
                </div>

                {/* Ödeme Bilgileri */}
                <div className="bg-white p-8 rounded-2xl shadow-sm">
                  <h2 className="text-xl font-serif text-nurvera-text mb-6 flex items-center">
                    <CreditCard className="mr-2 text-nurvera-olive" size={20} /> Ödeme Bilgileri
                  </h2>
                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-6 flex items-start">
                    <ShieldCheck className="text-blue-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-sm text-blue-800 font-medium">Bu bir test ortamıdır. Lütfen gerçek kredi kartı bilgilerinizi girmeyiniz. Rastgele sayılar girebilirsiniz.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-nurvera-text/70 mb-2">Kart Üzerindeki İsim</label>
                      <input required type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-nurvera-olive transition-colors bg-gray-50/50" placeholder="Ad Soyad" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-nurvera-text/70 mb-2">Kart Numarası</label>
                      <input required type="text" maxLength="19" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-nurvera-olive transition-colors bg-gray-50/50" placeholder="XXXX XXXX XXXX XXXX" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-nurvera-text/70 mb-2">Son Kullanma (AA/YY)</label>
                        <input required type="text" maxLength="5" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-nurvera-olive transition-colors bg-gray-50/50" placeholder="MM/YY" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-nurvera-text/70 mb-2">CVV</label>
                        <input required type="text" maxLength="3" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-nurvera-olive transition-colors bg-gray-50/50" placeholder="123" />
                      </div>
                    </div>
                  </div>
                </div>

              </form>
            </div>

            {/* Sağ Sipariş Özeti */}
            <div className="lg:w-1/3">
              <div className="bg-white p-8 rounded-2xl shadow-sm sticky top-32">
                <h2 className="text-xl font-serif text-nurvera-text mb-6">Sipariş Özeti</h2>
                
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-nurvera-bg flex-shrink-0">
                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className="text-sm font-medium text-nurvera-text">{item.product.name}</h4>
                        <div className="flex justify-between text-xs text-nurvera-text/60 mt-1">
                          <span>{item.quantity} x {item.product.price} TL</span>
                          <span className="font-medium text-nurvera-forest">{item.product.price * item.quantity} TL</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-nurvera-text/70">
                    <span>Ara Toplam</span>
                    <span>{getTotalPrice()} TL</span>
                  </div>
                  <div className="flex justify-between text-sm text-nurvera-text/70">
                    <span>Kargo Ücreti</span>
                    <span>{kargoUcreti === 0 ? 'Ücretsiz' : `${kargoUcreti} TL`}</span>
                  </div>
                  {kargoUcreti > 0 && (
                    <p className="text-xs text-nurvera-olive italic">500 TL ve üzeri kargo bedava!</p>
                  )}
                  <div className="flex justify-between text-lg font-bold text-nurvera-forest pt-3 border-t border-gray-100">
                    <span>Genel Toplam</span>
                    <span>{genelToplam} TL</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  form="checkout-form"
                  disabled={isSubmitting}
                  className={`w-full bg-nurvera-forest text-white rounded-full py-4 flex items-center justify-center font-bold tracking-widest uppercase shadow-lg transition-all ${isSubmitting ? 'opacity-70 cursor-wait' : 'hover:bg-nurvera-text hover:scale-[1.02]'}`}
                >
                  {isSubmitting ? 'Sipariş Onaylanıyor...' : 'Siparişi Tamamla'}
                </button>
                
                <div className="mt-4 flex items-center justify-center text-xs text-nurvera-text/50">
                  <ShieldCheck size={14} className="mr-1" /> 256-bit SSL Güvenli Ödeme
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
