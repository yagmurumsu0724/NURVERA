import React from 'react';
import Head from 'next/head';
import { RefreshCcw, PackageX, Truck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function IadeVeDegisim() {
  return (
    <div className="bg-[#FCFBF9] min-h-screen py-20">
      <Head>
        <title>İade ve Değişim Koşulları | NURVERA</title>
      </Head>
      
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl text-nurvera-text font-bold mb-6">İade ve Değişim Koşulları</h1>
          <p className="text-lg text-nurvera-text/70 max-w-2xl mx-auto leading-relaxed">
            NURVERA deneyiminizden tam anlamıyla memnun kalmanız bizim için önemlidir. Sürecin her adımında şeffaf ve çözüm odaklı yaklaşıyoruz.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-[#F5F7F3] p-6 rounded-2xl flex items-start">
              <RefreshCcw className="text-nurvera-forest shrink-0 mt-1 mr-4" size={24} strokeWidth={1.5} />
              <div>
                <h3 className="font-serif font-bold text-lg text-nurvera-text mb-2">14 Gün İade Hakkı</h3>
                <p className="text-sm text-nurvera-text/80 leading-relaxed">Siparişinizi teslim aldığınız tarihten itibaren 14 gün içerisinde, kullanılmamış ve ambalajı bozulmamış ürünler için iade talebi oluşturabilirsiniz.</p>
              </div>
            </div>
            
            <div className="bg-[#F5F7F3] p-6 rounded-2xl flex items-start">
              <PackageX className="text-nurvera-forest shrink-0 mt-1 mr-4" size={24} strokeWidth={1.5} />
              <div>
                <h3 className="font-serif font-bold text-lg text-nurvera-text mb-2">İade Edilemeyen Ürünler</h3>
                <p className="text-sm text-nurvera-text/80 leading-relaxed">Hijyen ve sağlık kuralları gereği, koruma bandı açılmış, kullanılmış veya hasar görmüş kozmetik ve kişisel bakım ürünlerinin iadesi kabul edilememektedir.</p>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="font-serif text-2xl font-bold text-nurvera-text mb-4">İade Süreci Nasıl İşler?</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-nurvera-olive/10 text-nurvera-forest flex items-center justify-center font-bold text-sm mr-4 shrink-0">1</span>
                  <p className="text-nurvera-text/80">Destek ekibimizle iletişime geçerek iade talebinizi ve sipariş numaranızı iletin.</p>
                </div>
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-nurvera-olive/10 text-nurvera-forest flex items-center justify-center font-bold text-sm mr-4 shrink-0">2</span>
                  <p className="text-nurvera-text/80">Size ileteceğimiz ücretsiz iade kargo kodu ile ürünü faturasıyla birlikte paketleyin.</p>
                </div>
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-nurvera-olive/10 text-nurvera-forest flex items-center justify-center font-bold text-sm mr-4 shrink-0">3</span>
                  <p className="text-nurvera-text/80">Ürün depomuza ulaşıp kalite kontrolünden geçtikten sonra, iade işleminiz onaylanır.</p>
                </div>
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-nurvera-olive/10 text-nurvera-forest flex items-center justify-center font-bold text-sm mr-4 shrink-0">4</span>
                  <p className="text-nurvera-text/80">Ücret iadeniz 3-5 iş günü içerisinde ödeme yaptığınız kartınıza yansıtılır.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-nurvera-text mb-4">Hasarlı veya Yanlış Ürün Durumu</h2>
              <p className="text-nurvera-text/80 leading-relaxed mb-4">
                Kargonuzu teslim alırken paket dışarısında gözle görülür bir hasar varsa paketi teslim almayarak kargo görevlisine tutanak tutturunuz. Paketi açtıktan sonra ürünün hasarlı veya yanlış olduğunu fark ederseniz, aynı gün içerisinde ürün fotoğrafı ile birlikte bize ulaşmanız yeterlidir. Hızlıca yeni ürün gönderimi sağlanacaktır.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between bg-white">
            <div className="mb-4 sm:mb-0">
              <p className="font-medium text-nurvera-text mb-1">Daha fazla yardıma mı ihtiyacınız var?</p>
              <p className="text-sm text-gray-500">Ekibimiz size yardımcı olmaktan mutluluk duyar.</p>
            </div>
            <Link href="/iletisim" className="px-6 py-3 bg-nurvera-olive text-white rounded-xl font-medium hover:bg-[#4a5e29] transition-colors shadow-sm whitespace-nowrap">
              Destek Ekibine Ulaşın
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
