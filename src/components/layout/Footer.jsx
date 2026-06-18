import React from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { MapPin, Mail, Phone, Instagram } from 'lucide-react';

export default function Footer() {
  const addressQuery = encodeURIComponent('Bahçeli Evler Mahallesi, Yasemin Sokak No: 6, Çelikhan, Adıyaman');
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${addressQuery}`;

  return (
    <footer className="bg-nurvera-footer text-nurvera-bg pt-24 pb-12 border-t-4 border-nurvera-olive/30">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 mb-20">
          
          {/* Sütun 1: Marka & Açıklama */}
          <div className="col-span-1 flex flex-col items-start">
            <div className="mb-10 text-nurvera-bg">
              <Logo variant="primary" />
            </div>
            <p className="text-nurvera-bg/80 text-[15px] font-light leading-relaxed mb-8 pr-4">
              Doğanın sunduğu saf mucizeleri, annemin yıllara dayanan tecrübesi ve özeniyle harmanlayan NURVERA; sadeliği, doğallığı ve güveni yaşamınıza taşır.
            </p>
            {/* Sosyal Medya */}
            <div className="flex space-x-5">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full border border-nurvera-bg/20 flex items-center justify-center text-nurvera-beige hover:bg-nurvera-olive hover:text-white hover:border-nurvera-olive transition-all duration-300 group"
                aria-label="Instagram sayfamızı ziyaret edin"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-300">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>

          {/* Sütun 2: Hızlı Linkler (Keşfet) */}
          <div className="col-span-1 lg:pl-10">
            <h4 className="font-serif text-xl tracking-wide text-nurvera-beige mb-6 pb-2 border-b border-nurvera-bg/10 inline-block">Keşfet</h4>
            <ul className="space-y-4 text-[15px] font-light text-nurvera-bg/80">
              <li>
                <Link href="/hakkimizda" className="hover:text-white hover:pl-1 transition-all duration-300 inline-block">
                  Hikayemiz
                </Link>
              </li>
              <li>
                <Link href="/urunler" className="hover:text-white hover:pl-1 transition-all duration-300 inline-block">
                  Tüm Koleksiyon
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white hover:pl-1 transition-all duration-300 inline-block">
                  Doğal Yaşam Blogu
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="hover:text-white hover:pl-1 transition-all duration-300 inline-block">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Sütun 3: İletişim */}
          <div className="col-span-1">
            <h4 className="font-serif text-xl tracking-wide text-nurvera-beige mb-6 pb-2 border-b border-nurvera-bg/10 inline-block">Bize Ulaşın</h4>
            <ul className="space-y-6 text-[15px] font-light text-nurvera-bg/80">
              
              {/* Adres */}
              <li className="group">
                <a 
                  href={mapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-start hover:text-white transition-colors duration-300"
                  aria-label="Google Haritalarda adresi aç"
                >
                  <MapPin size={20} className="mr-4 mt-0.5 text-nurvera-olive group-hover:text-[#8ea959] transition-colors shrink-0" />
                  <span className="leading-relaxed">
                    Bahçeli Evler Mahallesi,<br/>
                    Yasemin Sokak No: 6,<br/>
                    Adıyaman / Çelikhan
                  </span>
                </a>
              </li>

              {/* Telefon */}
              <li className="group">
                <a 
                  href="tel:+905354325337" 
                  className="flex items-center hover:text-white transition-colors duration-300"
                  aria-label="Bizi arayın"
                >
                  <Phone size={20} className="mr-4 text-nurvera-olive group-hover:text-[#8ea959] transition-colors shrink-0" />
                  <span className="tracking-wider">0535 432 53 37</span>
                </a>
              </li>

              {/* E-posta */}
              <li className="group">
                <a 
                  href="mailto:nurveradestek@gmail.com" 
                  className="flex items-center hover:text-white transition-colors duration-300"
                  aria-label="Bize e-posta gönderin"
                >
                  <Mail size={20} className="mr-4 text-nurvera-olive group-hover:text-[#8ea959] transition-colors shrink-0" />
                  <span>nurveradestek@gmail.com</span>
                </a>
              </li>

            </ul>
          </div>

        </div>

        {/* Alt Bilgi */}
        <div className="pt-8 border-t border-nurvera-bg/10 flex flex-col md:flex-row justify-between items-center text-xs text-nurvera-bg/50 tracking-wider">
          <p className="mb-4 md:mb-0">© 2026 NURVERA. Tüm Hakları Saklıdır.</p>
          <div className="flex items-center space-x-3 font-medium uppercase">
            <span className="hover:text-nurvera-beige transition-colors">Doğal</span>
            <span className="text-nurvera-olive/50">•</span>
            <span className="hover:text-nurvera-beige transition-colors">Saf</span>
            <span className="text-nurvera-olive/50">•</span>
            <span className="hover:text-nurvera-beige transition-colors">Özenli</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
