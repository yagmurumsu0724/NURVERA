import React from 'react';
import Head from 'next/head';
import { ShoppingBag, CreditCard, CheckCircle, Package, Truck, Smile } from 'lucide-react';
import Link from 'next/link';

export default function SatisVeSiparisSureci() {
  const steps = [
    {
      icon: <ShoppingBag size={28} strokeWidth={1.5} />,
      title: "1. Sepetinizi Oluşturun",
      desc: "İhtiyacınız olan %100 doğal içerikli ürünlerimizi inceleyin ve sepetinize ekleyin."
    },
    {
      icon: <CreditCard size={28} strokeWidth={1.5} />,
      title: "2. Güvenle Ödeyin",
      desc: "Ödeme adımına geçerek 256-bit SSL güvencesiyle siparişinizi şeffaf bir şekilde tamamlayın."
    },
    {
      icon: <CheckCircle size={28} strokeWidth={1.5} />,
      title: "3. Sipariş Onayı Alın",
      desc: "Siparişiniz başarıyla alındığında size e-posta ve SMS yoluyla bir onay mesajı iletilir."
    },
    {
      icon: <Package size={28} strokeWidth={1.5} />,
      title: "4. Özenle Hazırlıyoruz",
      desc: "Ürünleriniz, doğallığı ve formları korunacak şekilde, cam şişelere uygun özel malzemelerle paketlenir."
    },
    {
      icon: <Truck size={28} strokeWidth={1.5} />,
      title: "5. Kargoya Teslim",
      desc: "Siparişleriniz genellikle 1-2 iş günü içerisinde kargo firmasına teslim edilir ve takip numarası paylaşılır."
    },
    {
      icon: <Smile size={28} strokeWidth={1.5} />,
      title: "6. Size Ulaşıyor",
      desc: "NURVERA şifası kapınıza gelir. Doğanın saf mucizesini deneyimlemeye başlayabilirsiniz."
    }
  ];

  return (
    <div className="bg-[#FCFBF9] min-h-screen py-20">
      <Head>
        <title>Satış ve Sipariş Süreci | NURVERA</title>
      </Head>
      
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl text-nurvera-text font-bold mb-6">Satış ve Sipariş Süreci</h1>
          <p className="text-lg text-nurvera-text/70 max-w-2xl mx-auto leading-relaxed">
            Tıklamanızdan teslimata kadar geçen tüm süreç şeffaf ve güvenlidir. Satın alma deneyiminizin her aşamasında yanınızdayız.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 relative">
            {/* Masaüstü için ortadaki dikey ince çizgi */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-100 -translate-x-1/2"></div>
            
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center md:items-start text-center md:text-left group">
                <div className="w-16 h-16 rounded-2xl bg-[#F5F7F3] text-nurvera-forest flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-nurvera-olive group-hover:text-white transition-all duration-300 shadow-sm">
                  {step.icon}
                </div>
                <h3 className="font-serif font-bold text-xl text-nurvera-text mb-3">{step.title}</h3>
                <p className="text-nurvera-text/70 leading-relaxed text-sm">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-nurvera-beige/10 p-8 rounded-2xl border border-nurvera-beige/30 text-center">
            <h3 className="font-serif text-xl font-bold text-nurvera-text mb-3">Siparişe Müdahale Etmek İsterseniz</h3>
            <p className="text-nurvera-text/70 text-sm leading-relaxed mb-6">
              Siparişiniz "Kargoya Verildi" statüsüne geçmeden önce adres değişikliği, ürün ekleme/çıkarma veya iptal işlemlerini destek ekibimiz üzerinden hızlıca gerçekleştirebilirsiniz.
            </p>
            <Link href="/iletisim" className="inline-block px-8 py-3 border border-nurvera-olive text-nurvera-forest rounded-xl font-medium hover:bg-nurvera-olive hover:text-white transition-colors">
              Bize Ulaşın
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
