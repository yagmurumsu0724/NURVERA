import React from 'react';
import Head from 'next/head';
import { Leaf, Sparkles, AlertTriangle } from 'lucide-react';

export default function DogalKullanimBilgilendirmeleri() {
  return (
    <div className="bg-[#FCFBF9] min-h-screen py-20">
      <Head>
        <title>Doğal Kullanım Bilgilendirmeleri | NURVERA</title>
      </Head>
      
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-nurvera-olive/10 text-nurvera-forest rounded-full flex items-center justify-center mx-auto mb-6">
            <Leaf size={32} strokeWidth={1.5} />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-nurvera-text font-bold mb-6">Doğal Yaşam Notları</h1>
          <p className="text-lg text-nurvera-text/70 max-w-2xl mx-auto leading-relaxed">
            Doğanın sunduğu ham ve işlenmemiş ürünleri günlük hayatınıza dahil ederken bilmeniz gereken geleneksel yaklaşımlar ve şeffaf uyarılar.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">

          <div className="mb-12 text-center border-b border-gray-100 pb-12">
            <h2 className="font-serif text-2xl font-bold text-nurvera-text mb-4">Her Cilt, Her Bünye Benzersizdir</h2>
            <p className="text-nurvera-text/80 leading-relaxed max-w-2xl mx-auto">
              %100 doğal olması, bir ürünün herkes için tamamen reaksiyonsuz olacağı anlamına gelmez. Doğal bileşenler de bitkisel alerjenler içerebilir. Bu yüzden, bir ürünü ilk kez kullanırken daima "Yama Testi" (cildin ufak bir bölümünde deneme) yapmanızı tavsiye ediyoruz.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start">
              <div className="mt-1 bg-nurvera-olive/10 p-3 rounded-xl mr-5 shrink-0 text-nurvera-forest">
                <Sparkles size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-nurvera-text mb-3">Renk ve Koku Değişimleri Normaldir</h3>
                <p className="text-nurvera-text/70 leading-relaxed text-sm">
                  Sentetik esans, yapay renklendirici veya kimyasal sabitleyici kullanmadığımız için ürünlerimizde mevsimsel olarak renk, kıvam veya koku tonu farklılıkları görülebilir. Doğada hiçbir bitki bir sonrakinin tıpatıp aynısı değildir. Sirkelerimizde "sirke anası" adı verilen doğal tortuların oluşması ürünün canlı ve fermente olduğunun kanıtıdır.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mt-1 bg-nurvera-olive/10 p-3 rounded-xl mr-5 shrink-0 text-nurvera-forest">
                <AlertTriangle size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-nurvera-text mb-3">Tıbbi İddialardan Uzak Duruyoruz</h3>
                <p className="text-nurvera-text/70 leading-relaxed text-sm">
                  Anadolu'nun kadim bitki bilgeliğine ve geleneksel yöntemlere inanıyoruz. Ancak ürünlerimizi size sunarken "iyileştirir", "tedavi eder", "kökten çözer" gibi medikal kavramlar kullanmayı etik bulmuyoruz. Bedeniniz mükemmel bir sistemdir ve doğal ürünler bu sisteme sadece saygılı bir destek sunar. Tedavi gerektiren konularda bilimin ve hekimlerin yönlendirmesine güvenin.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
