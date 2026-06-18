import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const reasons = [
  {
    title: 'El Yapımı Üretim',
    description: 'Büyük fabrikalar yerine, her bir ürün küçük partiler halinde özenle elde üretilir.'
  },
  {
    title: '%100 Doğal İçerik',
    description: 'Sadece bitkiler ve su. Hiçbir sentetik esans, boya veya koruyucu içermez.'
  },
  {
    title: 'Vegan ve Cruelty-Free',
    description: 'Hayvanlar üzerinde test edilmez, hayvansal içerik barındırmaz.'
  },
  {
    title: 'Yerel Üreticiye Destek',
    description: 'Anadolu\'nun temiz topraklarında yetişen bitkiler, yerel çiftçilerden tedarik edilir.'
  },
  {
    title: 'Sıfır Atık Hedefi',
    description: 'Doğaya saygılı ambalajlar kullanır, üretim sürecindeki atıkları kompost yaparız.'
  },
  {
    title: 'Taze ve Etkili',
    description: 'Raf ömrünü uzatmak için kimyasal eklemediğimizden, size her zaman taze ulaşır.'
  }
];

export default function WhyNurvera() {
  return (
    <section className="py-32 bg-nurvera-bg">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-nurvera-accent tracking-[0.2em] uppercase text-xs font-bold mb-4 block">Farkımız</span>
          <h2 className="font-serif text-4xl md:text-5xl font-normal text-nurvera-text mb-6">Neden NURVERA?</h2>
          <p className="text-nurvera-text/70 font-light leading-relaxed">
            Sağlığınıza ve doğaya olan bağlılığımızı her bir aşamada kanıtlıyoruz.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
              className="bg-white/80 backdrop-blur-sm border border-nurvera-beige/30 p-10 rounded-2xl hover:bg-white hover:shadow-soft transition-all duration-500 group"
            >
              <div className="w-12 h-12 bg-nurvera-olive/5 rounded-full flex items-center justify-center mb-8 group-hover:bg-nurvera-olive group-hover:text-white transition-colors duration-500 text-nurvera-olive">
                <Check size={20} strokeWidth={2.5} />
              </div>
              <h3 className="font-serif text-xl font-medium text-nurvera-text mb-4">{reason.title}</h3>
              <p className="text-[15px] text-gray-500 leading-relaxed font-light">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
