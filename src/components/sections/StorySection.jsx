import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function StorySection() {
  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          
          {/* Sol Sütun: Metin */}
          <motion.div 
            className="lg:w-1/2 space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-nurvera-text leading-tight tracking-tight">
              Doğanın Bilgeliğini <br/><span className="text-nurvera-accent italic">Geleceğe</span> Taşıyoruz
            </h2>
            
            <div className="prose prose-lg text-nurvera-text/70 leading-loose font-light">
              <p className="font-serif text-nurvera-olive text-2xl mb-6">Merhaba, ben Nurgül.</p>
              
              <p className="mb-4">
                Yıllardır doğanın bize sunduğu bitkileri, geleneksel yöntemleri ve nesilden nesile aktarılan bilgileri büyük bir özenle hayatımın bir parçası olarak benimsedim. Zaman içerisinde şunu fark ettim: Günümüzün hızlı yaşamında insanlar, doğallığa ve güvenilir ürünlere her zamankinden daha fazla ihtiyaç duyuyor.
              </p>
              
              <p className="mb-4">İşte bu düşünceyle, kızımla birlikte <strong>NURVERA</strong>'yı kurduk.</p>
              
              <p className="mb-4">
                NURVERA; doğaya duyduğumuz sevginin, emeğimizin ve güvenilir ürünler üretme isteğimizin bir yansımasıdır. Her ürünümüzü yalnızca bir ürün olarak değil, özenle hazırlanmış bir emanet olarak görüyoruz.
              </p>

              <p className="mb-8">
                Bitkileri seçerken, üretim süreçlerini planlarken ve ürünlerimizi sizlere ulaştırırken doğallığı, sadeliği ve kaliteyi ön planda tutuyoruz. Amacımız; geleneksel bilgiyi modern yaşamla buluşturarak, insanların günlük hayatlarında güvenle tercih edebilecekleri doğal ürünler sunmaktır.
              </p>

              <blockquote className="font-serif italic text-2xl text-nurvera-accent border-l-2 border-nurvera-beige pl-6 my-10">
                "Çünkü inanıyoruz ki gerçek değer, sadelikte ve doğallıkta saklıdır."
              </blockquote>

              <p className="font-medium text-lg mt-8 text-nurvera-text">
                NURVERA'ya hoş geldiniz.<br/>
                <span className="text-nurvera-olive font-serif italic">Doğadan gelen sadeliği birlikte keşfedelim.</span>
              </p>
            </div>
            
          </motion.div>

          {/* Sağ Sütun: Görseller */}
          <div className="lg:w-1/2 relative">
            <div className="grid grid-cols-2 gap-6">
              <motion.div 
                className="space-y-4 pt-20"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              >
                <div className="relative h-96 rounded-2xl overflow-hidden shadow-soft">
                  <Image 
                    src="/images/story_1.png" 
                    alt="Doğadan toplama" 
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover hover:scale-105 transition-transform duration-1000"
                  />
                </div>
              </motion.div>
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              >
                <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-elegant">
                  <Image 
                    src="/images/story_2.png" 
                    alt="Doğal Üretim" 
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover hover:scale-105 transition-transform duration-1000"
                  />
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
