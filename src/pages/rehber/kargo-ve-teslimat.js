import React from 'react';
import Head from 'next/head';
import { Truck, MapPin, PackageOpen, AlertCircle } from 'lucide-react';

export default function KargoVeTeslimat() {
  return (
    <div className="bg-[#FCFBF9] min-h-screen py-20">
      <Head>
        <title>Kargo ve Teslimat | NURVERA</title>
      </Head>
      
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl text-nurvera-text font-bold mb-6">Kargo ve Teslimat</h1>
          <p className="text-lg text-nurvera-text/70 max-w-2xl mx-auto leading-relaxed">
            Siparişlerinizin doğallığı bozulmadan, en güvenli ve hızlı şekilde kapınıza ulaşması için titizlikle çalışıyoruz.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            <div className="flex items-start p-6 bg-[#F5F7F3] rounded-2xl">
              <Truck className="text-nurvera-forest shrink-0 mt-1 mr-4" size={24} strokeWidth={1.5} />
              <div>
                <h3 className="font-serif font-bold text-lg text-nurvera-text mb-1">Teslimat Süresi</h3>
                <p className="text-sm text-nurvera-text/80">Siparişleriniz ortalama 1-3 iş günü içerisinde adresinize teslim edilmektedir.</p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-[#F5F7F3] rounded-2xl">
              <MapPin className="text-nurvera-forest shrink-0 mt-1 mr-4" size={24} strokeWidth={1.5} />
              <div>
                <h3 className="font-serif font-bold text-lg text-nurvera-text mb-1">Takip Kolaylığı</h3>
                <p className="text-sm text-nurvera-text/80">Siparişiniz kargoya verildiğinde tarafınıza SMS ve E-Posta ile takip numarası iletilir.</p>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="font-serif text-2xl font-bold text-nurvera-text mb-4">Hazırlık ve Paketleme</h2>
              <p className="text-nurvera-text/80 leading-relaxed mb-4">
                Siparişiniz onaylandıktan sonra, taze ürünlerimiz cam şişelerin zarar görmemesi için özel koruyucu malzemelere sarılarak paketlenir. Plastik kullanımını en aza indirgemeye özen gösteriyor, doğa dostu ambalajlar tercih ediyoruz. Siparişleriniz aynı gün veya en geç ertesi iş günü <strong>Yurtiçi Kargo</strong> yetkililerine teslim edilir.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-nurvera-text mb-4 flex items-center">
                <PackageOpen size={24} className="mr-3 text-nurvera-olive" /> 
                Teslimat Sırasında Dikkat Edilmesi Gerekenler
              </h2>
              <p className="text-nurvera-text/80 leading-relaxed mb-4">
                Kargonuzu teslim alırken pakette herhangi bir ezilme, yırtılma veya ıslanma fark ederseniz paketi kesinlikle teslim almayınız. Kargo görevlisinden <strong>"Hasar Tespit Tutanağı"</strong> hazırlamasını isteyiniz ve durumu derhal bize bildiriniz. Tutanak tutulmadan teslim alınan ve sonradan hasarlı olduğu bildirilen ürünlerde, kargo firması sorumluluk kabul etmediği için değişim/iade süreci zorlaşmaktadır.
              </p>
            </section>

            <section className="bg-nurvera-olive/5 border border-nurvera-olive/20 rounded-2xl p-6">
              <h2 className="font-serif text-lg font-bold text-nurvera-text mb-2 flex items-center">
                <AlertCircle size={20} className="mr-2 text-nurvera-forest" /> 
                Adreste Bulunmama Durumu
              </h2>
              <p className="text-sm text-nurvera-text/80 leading-relaxed">
                Teslimat sırasında adresinizde bulunmamanız halinde, kargo yetkilisi paketinizi en yakın şubeye teslim eder ve size bilgi mesajı bırakır. Paketinizi 3 iş günü içerisinde şubeden teslim almanız gerekmektedir. Teslim alınmayan paketler NURVERA'ya iade olarak döner.
              </p>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
