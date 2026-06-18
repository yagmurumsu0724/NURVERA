import React from 'react';
import Head from 'next/head';

export default function GizlilikVeGuvenlik() {
  return (
    <div className="bg-[#FCFBF9] min-h-screen py-20">
      <Head>
        <title>Gizlilik ve Güvenlik Politikası | NURVERA</title>
      </Head>
      
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="font-serif text-3xl md:text-4xl text-nurvera-text font-bold mb-4">Gizlilik ve Güvenlik Politikası</h1>
          <p className="text-sm text-nurvera-text/60 max-w-2xl mx-auto uppercase tracking-wider">Son Güncelleme: 1 Haziran 2026</p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-nurvera-text/80 text-sm leading-relaxed space-y-8">
          
          <section>
            <h2 className="font-serif text-xl font-bold text-nurvera-text mb-3">1. Verilerinizin Gizliliği</h2>
            <p>
              NURVERA olarak, kişisel verilerinizin güvenliğine ve gizliliğine büyük önem veriyoruz. Sitemize üye olurken, alışveriş yaparken veya iletişim formlarını kullanırken bizimle paylaştığınız tüm bilgiler, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında ve en yüksek dijital güvenlik standartlarında korunmaktadır.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-nurvera-text mb-3">2. Hangi Bilgileri Topluyoruz?</h2>
            <p className="mb-2">Sipariş süreçlerinizi eksiksiz ve hızlı bir şekilde yürütebilmek amacıyla aşağıdaki verileri topluyoruz:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ad, soyad ve iletişim bilgileri (Telefon, e-posta)</li>
              <li>Teslimat ve fatura adresleri</li>
              <li>Sipariş ve tercih geçmişiniz</li>
            </ul>
            <p className="mt-2 font-medium text-nurvera-forest">
              Önemli: Kredi kartı ve banka kartı numaralarınız sistemimizde kesinlikle saklanmamaktadır.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-nurvera-text mb-3">3. Bilgilerinizin Kullanım Amacı</h2>
            <p>
              Toplanan kişisel verileriniz; siparişlerinizin size güvenle ulaştırılması, iade/değişim süreçlerinin yönetilmesi, taleplerinize yanıt verilmesi ve (yalnızca izin vermeniz halinde) size özel kampanya bilgilendirmelerinin yapılması amacıyla kullanılmaktadır. Bilgileriniz, kargo teslimatı gibi mecburi durumlar haricinde hiçbir üçüncü taraf şirketle satılmaz veya izinsiz paylaşılmaz.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-nurvera-text mb-3">4. Veri Güvenliği ve SSL Sertifikası</h2>
            <p>
              Web sitemiz üzerinden yapılan tüm işlemler, ödeme bilgileri ve veri akışları 256-bit SSL (Secure Sockets Layer) şifreleme teknolojisi ile korunmaktadır. Bu teknoloji, verilerinizin dışarıdan müdahaleye karşı güvende olmasını sağlar.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-nurvera-text mb-3">5. Haklarınız ve İletişim</h2>
            <p>
              Kayıtlı verilerinize ulaşma, bu verilerin güncellenmesini, silinmesini veya anonimleştirilmesini talep etme hakkına sahipsiniz. KVKK kapsamındaki haklarınızı kullanmak veya güvenlik politikamızla ilgili detaylı bilgi almak için <strong>nurveradogalyasam@gmail.com</strong> adresinden bize ulaşabilirsiniz.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
