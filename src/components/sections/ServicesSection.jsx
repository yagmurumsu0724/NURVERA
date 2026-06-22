import React from 'react';
import Link from 'next/link';
import { Droplets, Activity, Info, Calendar } from 'lucide-react';

export default function ServicesSection() {
  const cards = [
    {
      title: 'Hacamat Uygulamaları',
      icon: <Droplets className="w-8 h-8 mb-4 text-nurvera-olive" strokeWidth={1.5} />,
      points: [
        'Seans öncesi değerlendirme',
        'Hijyenik uygulama alanı',
        'Bilgilendirme ve takip',
      ],
      link: '/hacamat',
    },
    {
      title: 'Sülük Uygulamaları',
      icon: <Activity className="w-8 h-8 mb-4 text-nurvera-olive" strokeWidth={1.5} />,
      points: [
        'Tıbbi amaçlı steril ürün yaklaşımı',
        'Kişiye özel planlama',
        'Uygulama öncesi yönlendirme',
      ],
      link: '/suluk',
    },
    {
      title: 'Ön Bilgilendirme',
      icon: <Info className="w-8 h-8 mb-4 text-nurvera-olive" strokeWidth={1.5} />,
      points: [
        'Kimler yaptırabilir?',
        'Kimler için uygun değildir?',
        'Uygulama öncesi nelere dikkat edilir?',
      ],
      link: '/hacamat', // Point to hacamat's FAQ or general info section
    },
    {
      title: 'Randevu Al',
      icon: <Calendar className="w-8 h-8 mb-4 text-nurvera-olive" strokeWidth={1.5} />,
      points: [
        'Size uygun gün ve saat için iletişime geçin.',
      ],
      link: '/randevu',
    },
  ];

  return (
    <section className="py-20 bg-nurvera-bg relative overflow-hidden border-t border-b border-black/5">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-nurvera-text mb-6">
            Geleneksel Uygulamalarda Özenli Hizmet
          </h2>
          <p className="text-nurvera-text/80 text-lg leading-relaxed">
            NURVERA, hacamat ve sülük uygulamalarında bilgilendirme, hijyen, güven ve düzenli randevu sistemini ön planda tutar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, idx) => (
            <Link 
              key={idx} 
              href={card.link}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-black/5 group flex flex-col h-full hover:-translate-y-1"
            >
              <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300 transform origin-left">
                {card.icon}
              </div>
              <h3 className="font-serif text-xl text-nurvera-text mb-4">
                {card.title}
              </h3>
              <ul className="space-y-3 mb-6 flex-grow">
                {card.points.map((point, pointIdx) => (
                  <li key={pointIdx} className="text-sm text-nurvera-text/70 flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-nurvera-olive mt-1.5 mr-2 flex-shrink-0"></span>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
              <div className="text-sm font-medium text-nurvera-forest flex items-center group-hover:text-nurvera-olive transition-colors mt-auto">
                Detaylı İncele <span className="ml-1 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
