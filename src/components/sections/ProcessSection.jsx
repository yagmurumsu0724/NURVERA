import React from 'react';
import { Leaf, Droplets, FlaskConical, PackageCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    id: 1,
    title: 'Özenle Toplama',
    description: 'Bitkiler en doğru mevsimde, doğaya zarar vermeden elle toplanır.',
    icon: <Leaf size={32} className="text-nurvera-olive" />
  },
  {
    id: 2,
    title: 'Geleneksel Distilasyon',
    description: 'Bakır imbiklerde, yavaş ve odun ateşinde distile edilir.',
    icon: <Droplets size={32} className="text-nurvera-olive" />
  },
  {
    id: 3,
    title: 'Saf Dinlendirme',
    description: 'Elde edilen şifalı sular, karanlık ve serin ortamda demlenmeye bırakılır.',
    icon: <FlaskConical size={32} className="text-nurvera-olive" />
  },
  {
    id: 4,
    title: 'Güvenli Paketleme',
    description: 'Cam şişelere aktarılır ve korunaklı şekilde size ulaştırılır.',
    icon: <PackageCheck size={32} className="text-nurvera-olive" />
  }
];

export default function ProcessSection() {
  return (
    <section className="py-32 bg-[#Fdfbf7] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-nurvera-accent tracking-[0.2em] uppercase text-xs font-bold mb-4 block">Üretim Sürecimiz</span>
          <h2 className="font-serif text-4xl md:text-5xl font-normal text-nurvera-text mb-6">4 Adımda Saf Üretim</h2>
          <p className="text-nurvera-text/70 leading-relaxed font-light">
            Tohumdan şişeye uzanan yolculuğumuzda, şeffaflık ve güven her zaman önceliğimizdir.
          </p>
        </motion.div>

        <div className="relative mt-16">
          {/* Bağlantı Çizgisi (Sadece masaüstü) */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-nurvera-beige/50 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            {steps.map((step, index) => (
              <motion.div 
                key={step.id} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-soft mb-8 border border-gray-100 group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="group-hover:scale-110 transition-transform duration-500">
                    {step.icon}
                  </div>
                </div>
                <h3 className="font-serif text-xl font-medium text-nurvera-text mb-3">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-[250px] font-light">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
