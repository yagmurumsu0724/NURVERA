import React from 'react';
import Head from 'next/head';
import { Lock, ShieldCheck, EyeOff, KeyRound } from 'lucide-react';
import Link from 'next/link';

export default function GuvenliOdeme() {
  return (
    <div className="bg-[#FCFBF9] min-h-screen py-20">
      <Head>
        <title>Güvenli Ödeme | NURVERA</title>
      </Head>
      
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-nurvera-olive/10 text-nurvera-forest rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={32} strokeWidth={1.5} />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-nurvera-text font-bold mb-6">Güvenli Ödeme</h1>
          <p className="text-lg text-nurvera-text/70 max-w-2xl mx-auto leading-relaxed">
            Finansal güvenliğiniz bizim için önceliktir. Alışveriş deneyiminiz, en üst düzey güvenlik protokolleriyle şifrelenir ve korunur.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50/50 hover:border-nurvera-olive/30 transition-colors">
              <ShieldCheck className="text-nurvera-olive mb-4" size={28} />
              <h3 className="font-bold text-nurvera-text mb-2">256-Bit SSL Sertifikası</h3>
              <p className="text-sm text-nurvera-text/70 leading-relaxed">Tüm bağlantılarınız uçtan uca şifrelenir. Verileriniz, aktarım sırasında üçüncü şahısların erişimine tamamen kapalıdır.</p>
            </div>
            
            <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50/50 hover:border-nurvera-olive/30 transition-colors">
              <EyeOff className="text-nurvera-olive mb-4" size={28} />
              <h3 className="font-bold text-nurvera-text mb-2">Kart Bilgileriniz Gizlidir</h3>
              <p className="text-sm text-nurvera-text/70 leading-relaxed">Kredi kartı numaranız ve CVV bilginiz NURVERA sunucularında asla saklanmaz. Doğrudan BDDK onaylı ödeme kuruluşuna iletilir.</p>
            </div>
            
            <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50/50 hover:border-nurvera-olive/30 transition-colors">
              <KeyRound className="text-nurvera-olive mb-4" size={28} />
              <h3 className="font-bold text-nurvera-text mb-2">3D Secure Doğrulaması</h3>
              <p className="text-sm text-nurvera-text/70 leading-relaxed">Ödemelerinizde bankanızın SMS onayı (3D Secure) istenir. Sizin haberiniz olmadan herhangi bir çekim işlemi yapılamaz.</p>
            </div>

            <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50/50 hover:border-nurvera-olive/30 transition-colors">
              <Lock className="text-nurvera-olive mb-4" size={28} />
              <h3 className="font-bold text-nurvera-text mb-2">Gizli Ücret Yoktur</h3>
              <p className="text-sm text-nurvera-text/70 leading-relaxed">Ödeme ekranında gördüğünüz genel toplam tutarı dışında sizden hiçbir şekilde ek kargo, vergi veya gizli bir işlem bedeli tahsil edilmez.</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-nurvera-text border-b border-gray-100 pb-4">Ödeme Yöntemleri</h2>
            <p className="text-nurvera-text/80 leading-relaxed">
              Sitemiz üzerinden yapacağınız alışverişlerde <strong>Visa</strong> ve <strong>Mastercard</strong> özellikli tüm kredi ve banka (debit) kartlarını güvenle kullanabilirsiniz. Dilerseniz taksit seçeneklerinden faydalanabilirsiniz.
            </p>
          </div>

          <div className="mt-12 flex justify-center">
            <Link href="/checkout" className="px-8 py-4 bg-nurvera-forest text-white rounded-xl font-medium hover:bg-black transition-colors shadow-elegant flex items-center">
              <Lock size={18} className="mr-3 opacity-80" />
              Güvenli Ödeme Ekranına Git
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
