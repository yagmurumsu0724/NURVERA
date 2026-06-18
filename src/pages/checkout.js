import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Logo from '@/components/ui/Logo';
import { Lock, ShieldCheck, Truck, ChevronLeft, CreditCard, CheckCircle2 } from 'lucide-react';
import useCartStore from '@/store/cartStore';

export default function Checkout() {
  const { items, getTotalPrice } = useCartStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Eğer sepet boşsa anasayfaya yönlendir (Sadece client side'da)
  if (typeof window !== 'undefined' && items.length === 0 && !isSubmitting) {
    router.push('/urunler');
    return null;
  }

  const shippingCost = 0; // Şimdilik ücretsiz kargo
  const total = getTotalPrice() + shippingCost;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simüle edilmiş ödeme süreci
    setTimeout(() => {
      alert("Ödeme başarılı! Teşekkür ederiz.");
      router.push('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FCFBF9] font-sans selection:bg-nurvera-olive selection:text-white">
      <Head>
        <title>Güvenli Ödeme | NURVERA</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      {/* Minimal Checkout Header */}
      <header className="w-full bg-white border-b border-gray-100 py-6 sticky top-0 z-50">
        <div className="container mx-auto px-6 max-w-6xl flex items-center justify-between">
          <Link href="/urunler" className="flex items-center text-gray-500 hover:text-nurvera-olive transition-colors group">
            <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium tracking-wide">Alışverişe Dön</span>
          </Link>
          
          <Link href="/" className="scale-90 opacity-90 hover:opacity-100 transition-opacity">
            <Logo variant="secondary" className="text-nurvera-forest" />
          </Link>
          
          <div className="flex items-center text-nurvera-forest font-medium text-sm tracking-widest uppercase">
            <Lock size={16} className="mr-2" strokeWidth={2} />
            <span className="hidden sm:inline">Güvenli Ödeme</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 max-w-6xl py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
          
          {/* Sol Sütun: Form Alanı */}
          <div className="w-full lg:w-[55%] xl:w-[60%]">
            
            <div className="mb-10">
              <h1 className="font-serif text-3xl text-nurvera-text mb-3">Siparişi Güvenle Tamamla</h1>
              <p className="text-nurvera-text/60 font-light">Ödeme bilgileriniz 256-bit SSL sertifikası ile şifrelenerek korunmaktadır.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
              
              {/* Teslimat Bilgileri */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 rounded-full bg-nurvera-olive/10 text-nurvera-forest flex items-center justify-center font-bold text-sm mr-3">1</div>
                  <h2 className="font-serif text-xl text-nurvera-text font-medium">Teslimat Bilgileri</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-nurvera-text/80 ml-1">Adınız</label>
                    <input required type="text" placeholder="Örn: Ayşe" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-nurvera-olive focus:ring-1 focus:ring-nurvera-olive transition-all text-nurvera-text placeholder-gray-400" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-nurvera-text/80 ml-1">Soyadınız</label>
                    <input required type="text" placeholder="Örn: Yılmaz" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-nurvera-olive focus:ring-1 focus:ring-nurvera-olive transition-all text-nurvera-text placeholder-gray-400" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-nurvera-text/80 ml-1">Telefon Numarası</label>
                    <input required type="tel" placeholder="05XX XXX XX XX" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-nurvera-olive focus:ring-1 focus:ring-nurvera-olive transition-all text-nurvera-text placeholder-gray-400" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-nurvera-text/80 ml-1">E-Posta Adresi</label>
                    <input required type="email" placeholder="Sipariş onayı için" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-nurvera-olive focus:ring-1 focus:ring-nurvera-olive transition-all text-nurvera-text placeholder-gray-400" />
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-sm font-medium text-nurvera-text/80 ml-1">Açık Adres</label>
                    <textarea required rows="3" placeholder="Mahalle, sokak, apartman ve daire numarası" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-nurvera-olive focus:ring-1 focus:ring-nurvera-olive transition-all text-nurvera-text placeholder-gray-400 resize-none"></textarea>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-nurvera-text/80 ml-1">İl</label>
                    <input required type="text" placeholder="Örn: İstanbul" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-nurvera-olive focus:ring-1 focus:ring-nurvera-olive transition-all text-nurvera-text placeholder-gray-400" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-nurvera-text/80 ml-1">İlçe</label>
                    <input required type="text" placeholder="Örn: Kadıköy" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-nurvera-olive focus:ring-1 focus:ring-nurvera-olive transition-all text-nurvera-text placeholder-gray-400" />
                  </div>
                </div>
              </section>

              {/* Ödeme Bilgileri */}
              <section>
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 rounded-full bg-nurvera-olive/10 text-nurvera-forest flex items-center justify-center font-bold text-sm mr-3">2</div>
                  <h2 className="font-serif text-xl text-nurvera-text font-medium">Ödeme Detayları</h2>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-nurvera-olive/5 rounded-bl-full -z-10"></div>
                  
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center text-nurvera-text font-medium">
                      <CreditCard className="mr-2 text-nurvera-forest" size={20} />
                      Kredi / Banka Kartı
                    </div>
                    <div className="flex gap-2 opacity-60">
                      {/* Basit Kart İkonları */}
                      <div className="w-10 h-6 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-[10px] font-bold">VISA</div>
                      <div className="w-10 h-6 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-[10px] font-bold">MC</div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-nurvera-text/80 ml-1">Kart Üzerindeki İsim</label>
                      <input required type="text" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-nurvera-olive focus:bg-white focus:ring-1 focus:ring-nurvera-olive transition-all text-nurvera-text uppercase" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-nurvera-text/80 ml-1">Kart Numarası</label>
                      <div className="relative">
                        <input required type="text" maxLength="19" placeholder="0000 0000 0000 0000" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-4 pr-10 py-3.5 focus:outline-none focus:border-nurvera-olive focus:bg-white focus:ring-1 focus:ring-nurvera-olive transition-all text-nurvera-text tracking-widest font-mono text-sm" />
                        <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-nurvera-text/80 ml-1">Son K. Tarihi</label>
                        <input required type="text" placeholder="AA / YY" maxLength="5" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-nurvera-olive focus:bg-white focus:ring-1 focus:ring-nurvera-olive transition-all text-nurvera-text text-center font-mono text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-nurvera-text/80 ml-1">CVV</label>
                        <input required type="text" placeholder="***" maxLength="3" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-nurvera-olive focus:bg-white focus:ring-1 focus:ring-nurvera-olive transition-all text-nurvera-text text-center font-mono text-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Güven ve Onay Alanı */}
              <div className="space-y-6 pt-4">
                <div className="flex items-start bg-[#F5F7F3] p-4 rounded-xl border border-nurvera-sage/30">
                  <ShieldCheck className="text-nurvera-forest shrink-0 mt-0.5 mr-3" size={20} />
                  <p className="text-sm text-nurvera-forest/80 leading-relaxed font-medium">
                    Kart bilgileriniz NURVERA sunucularında saklanmaz. Doğrudan BDDK onaylı güvenli ödeme kuruluşuna şifrelenerek iletilir.
                  </p>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-nurvera-olive text-white h-[64px] rounded-xl font-medium text-lg tracking-wide hover:bg-[#4a5e29] transition-all duration-300 shadow-elegant hover:-translate-y-1 flex items-center justify-center disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">İşleniyor...</span>
                  ) : (
                    <span className="flex items-center">
                      <Lock size={18} className="mr-2 opacity-80" />
                      Siparişi Güvenle Tamamla
                    </span>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Sağ Sütun: Sipariş Özeti (Sticky) */}
          <div className="w-full lg:w-[45%] xl:w-[40%] mt-12 lg:mt-0">
            <div className="sticky top-32">
              
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.03)]">
                <h3 className="font-serif text-xl text-nurvera-text font-bold mb-6 pb-4 border-b border-gray-100">Sipariş Özeti</h3>
                
                {/* Ürün Listesi */}
                <div className="space-y-5 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="relative w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 shrink-0 overflow-hidden">
                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-nurvera-text text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-grow flex flex-col justify-center">
                        <h4 className="font-medium text-nurvera-text text-sm leading-tight">{item.product.name}</h4>
                        <span className="text-xs text-gray-500 mt-1">{item.product.volume}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium text-nurvera-text text-sm">{item.product.price}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tutar Kalemleri */}
                <div className="space-y-3 py-5 border-t border-gray-100">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Ara Toplam</span>
                    <span className="font-medium text-nurvera-text">{getTotalPrice().toFixed(2).replace('.', ',')} ₺</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Kargo Ücreti</span>
                    {shippingCost === 0 ? (
                      <span className="font-medium text-nurvera-forest bg-nurvera-olive/10 px-2 py-0.5 rounded text-xs">ÜCRETSİZ</span>
                    ) : (
                      <span className="font-medium text-nurvera-text">{shippingCost.toFixed(2).replace('.', ',')} ₺</span>
                    )}
                  </div>
                  {/* İleride indirim vs eklenebilir */}
                </div>

                <div className="flex justify-between items-end pt-5 border-t border-gray-200">
                  <span className="text-sm font-bold uppercase tracking-wider text-nurvera-text/60">Genel Toplam</span>
                  <span className="font-serif text-3xl font-bold text-nurvera-text">{total.toFixed(2).replace('.', ',')} ₺</span>
                </div>
              </div>

              {/* Güven Rozetleri Kompakt Alanı */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <ShieldCheck className="text-nurvera-olive" size={24} strokeWidth={1.5} />
                  <span className="text-xs font-bold tracking-wide text-nurvera-text/80 leading-tight">%100 Güvenli<br/>Ödeme</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <Truck className="text-nurvera-olive" size={24} strokeWidth={1.5} />
                  <span className="text-xs font-bold tracking-wide text-nurvera-text/80 leading-tight">Hızlı<br/>Gönderim</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <CheckCircle2 className="text-nurvera-olive" size={24} strokeWidth={1.5} />
                  <span className="text-xs font-bold tracking-wide text-nurvera-text/80 leading-tight">Kolay İade<br/>Garantisi</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <Lock className="text-nurvera-olive" size={24} strokeWidth={1.5} />
                  <span className="text-xs font-bold tracking-wide text-nurvera-text/80 leading-tight">Gizlilik<br/>Koruması</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// Global Layout'u devreden çıkarıyoruz
Checkout.getLayout = function getLayout(page) {
  return <>{page}</>;
}
