import React from 'react';
import Head from 'next/head';
import { Droplet, Sun, Clock, Info } from 'lucide-react';

export default function UrunKullanimRehberi() {
  return (
    <div className="bg-[#FCFBF9] min-h-screen py-20">
      <Head>
        <title>Ürün Kullanım Rehberi | NURVERA</title>
      </Head>
      
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl text-nurvera-text font-bold mb-6">Ürün Kullanım Rehberi</h1>
          <p className="text-lg text-nurvera-text/70 max-w-2xl mx-auto leading-relaxed">
            Doğanın sunduğu bu saf ürünlerden en yüksek verimi almanız için hazırladığımız destekleyici ve bilgilendirici kullanım detayları.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          
          {/* Önemli Uyarı Kutusu */}
          <div className="bg-[#Fdfbf7] border border-[#D8C7A0] p-6 rounded-2xl mb-12 flex items-start">
            <Info className="text-[#8B6F47] shrink-0 mt-0.5 mr-4" size={24} />
            <div>
              <p className="text-sm text-nurvera-text/80 leading-relaxed font-medium">
                <strong>Bilgilendirme Notu:</strong> Bu rehberdeki bilgiler kesinlikle tıbbi bir tedavi vaadi içermez. Ürünlerimiz destekleyici ve doğal bakım amaçlıdır. Hastalıkların teşhis veya tedavisi için mutlaka uzman bir hekime danışılmalıdır.
              </p>
            </div>
          </div>

          <div className="space-y-12">
            
            {/* Hidrosoller */}
            <section>
              <h2 className="font-serif text-2xl font-bold text-nurvera-text mb-6 pb-2 border-b border-gray-100 flex items-center">
                <Droplet className="mr-3 text-nurvera-olive" size={24} />
                Hidrosoller (Papatya vb.)
              </h2>
              <div className="space-y-4">
                <p className="text-nurvera-text/80 leading-relaxed">
                  <strong>Nasıl Kullanılır:</strong> Cildinizi temizledikten sonra tonik olarak doğrudan püskürtebilir veya pamuk yardımıyla yüzünüze nazikçe uygulayabilirsiniz. Gün içerisinde cildinizi ferahlatmak için dilediğiniz sıklıkta kullanabilirsiniz.
                </p>
                <p className="text-nurvera-text/80 leading-relaxed">
                  <strong>Saklama Koşulları:</strong> Hiçbir sentetik koruyucu içermediğinden ötürü doğrudan güneş ışığından uzak, serin bir yerde saklanmalıdır. Özellikle yaz aylarında buzdolabında muhafaza edilmesi hem raf ömrünü uzatır hem de cildinizde ekstra ferahlatıcı bir etki yaratır.
                </p>
              </div>
            </section>

            {/* Yağlar */}
            <section>
              <h2 className="font-serif text-2xl font-bold text-nurvera-text mb-6 pb-2 border-b border-gray-100 flex items-center">
                <Sun className="mr-3 text-nurvera-olive" size={24} />
                Sarı Kantaron Yağı
              </h2>
              <div className="space-y-4">
                <p className="text-nurvera-text/80 leading-relaxed">
                  <strong>Nasıl Kullanılır:</strong> İhtiyaç duyulan bölgeye birkaç damla damlatılarak çok hafif masaj hareketleriyle cilde yedirilmesi önerilir. 
                </p>
                <p className="text-nurvera-text/80 leading-relaxed text-red-800/80 bg-red-50 p-4 rounded-xl">
                  <strong>Dikkat Edilmesi Gerekenler:</strong> Kantaron yağı ışığa karşı duyarlılığı (fotosensitivite) artırabilir. Bu sebeple ürünü uyguladıktan sonra doğrudan güneşe çıkılması ciltte lekelenmelere yol açabilir. Sadece gece kullanılması tavsiye edilir.
                </p>
              </div>
            </section>

            {/* Tentürler */}
            <section>
              <h2 className="font-serif text-2xl font-bold text-nurvera-text mb-6 pb-2 border-b border-gray-100 flex items-center">
                <Clock className="mr-3 text-nurvera-olive" size={24} />
                Bitkisel Tentür ve Ekstraktlar (Hayıt vb.)
              </h2>
              <div className="space-y-4">
                <p className="text-nurvera-text/80 leading-relaxed">
                  <strong>Kullanım Önerisi:</strong> Yetişkinler için genellikle günde 1 kez, yarım çay bardağı içme suyuna 20-30 damla damlatılarak tüketilmesi tavsiye edilir. Şişeyi her kullanımdan önce mutlaka iyice çalkalayınız.
                </p>
                <p className="text-nurvera-text/80 leading-relaxed">
                  <strong>Kimler Dikkatli Kullanmalı:</strong> Hamileler, emziren anneler, kronik rahatsızlığı olanlar veya düzenli ilaç kullanan kişilerin bu tarz yoğun bitkisel ekstraktları kullanmadan önce kesinlikle doktorlarına danışmaları gerekmektedir.
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
