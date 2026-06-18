import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function MesafeliSatisSozlesmesi() {
  return (
    <div className="bg-[#FCFBF9] min-h-screen py-20">
      <Head>
        <title>Mesafeli Satış Sözleşmesi | NURVERA</title>
      </Head>
      
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="font-serif text-3xl md:text-4xl text-nurvera-text font-bold mb-4">Mesafeli Satış Sözleşmesi</h1>
          <p className="text-sm text-nurvera-text/60 max-w-2xl mx-auto uppercase tracking-wider">Geçerlilik Tarihi: 1 Haziran 2026</p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-nurvera-text/80 text-sm leading-relaxed space-y-8">
          
          <div className="bg-[#F5F7F3] p-6 rounded-xl border border-nurvera-beige/30 mb-8">
            <p className="text-nurvera-forest font-medium">Özet Bilgilendirme</p>
            <p className="mt-2 text-xs leading-relaxed text-nurvera-text/70">
              Bu sözleşme, Tüketicinin Korunması Hakkında Kanun gereği, NURVERA web sitesi üzerinden yapacağınız alışverişlerin hukuki zeminini şeffaf bir şekilde ortaya koymak için hazırlanmıştır. Müşteri memnuniyeti bizim birincil önceliğimizdir.
            </p>
          </div>

          <section>
            <h2 className="font-serif text-lg font-bold text-nurvera-text mb-2">Madde 1 - Taraflar</h2>
            <p className="font-medium mb-1">SATICI</p>
            <p className="mb-4">Ünvanı: NURVERA Doğal Yaşam <br/> Adres: Bahçeli Evler Mahallesi, Yasemin Sokak No: 6, Çelikhan, Adıyaman <br/> E-posta: nurveradogalyasam@gmail.com <br/> Telefon: 0535 432 53 37</p>
            
            <p className="font-medium mb-1">ALICI</p>
            <p>Satıcı'ya ait web sitesi üzerinden sipariş veren, fatura ve teslimat bilgileri alınan nihai tüketicidir.</p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-nurvera-text mb-2">Madde 2 - Sözleşmenin Konusu</h2>
            <p>
              İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait web sitesinden elektronik ortamda siparişini yaptığı ürün/ürünlerin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-nurvera-text mb-2">Madde 3 - Teslimat Koşulları</h2>
            <p>
              Sözleşme konusu ürün, yasal 30 günlük süreyi aşmamak koşulu ile her bir ürün için ALICI'nın yerleşim yerinin uzaklığına bağlı olarak kargo şirketi aracılığıyla ALICI veya gösterdiği adresteki kişi/kuruluşa teslim edilir. Paket teslimatında hasar tespiti ALICI'nın sorumluluğundadır. Hasarlı paketler teslim alınmamalı ve tutanak tutturulmalıdır.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-nurvera-text mb-2">Madde 4 - Cayma Hakkı</h2>
            <p>
              ALICI, ürünü teslim aldığı tarihten itibaren 14 (on dört) gün içerisinde hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin malı reddederek sözleşmeden cayma hakkına sahiptir. Ancak hijyenik nedenlerle ambalajı veya koruma bandı açılmış, denenmiş veya kullanılmış kozmetik/kişisel bakım ürünlerinde cayma hakkı kullanılamaz. İade işlemlerinin detaylarına <Link href="/rehber/iade-ve-degisim" className="text-nurvera-olive underline hover:text-nurvera-forest">İade ve Değişim</Link> sayfamızdan ulaşabilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-nurvera-text mb-2">Madde 5 - Yetkili Mahkeme</h2>
            <p>
              İşbu sözleşmenin uygulanmasında, Gümrük ve Ticaret Bakanlığınca ilan edilen değere kadar Tüketici Hakem Heyetleri ile ALICI'nın veya SATICI'nın yerleşim yerindeki Tüketici Mahkemeleri yetkilidir.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
