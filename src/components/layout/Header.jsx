import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Logo from '@/components/ui/Logo';
import { ShoppingBag, Phone, Menu, X, User, ChevronDown, ShieldCheck } from 'lucide-react';
import useCartStore from '@/store/cartStore';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileGuideOpen, setMobileGuideOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { getTotalItems, toggleCart } = useCartStore();
  const router = useRouter();

  const isHomePage = router.pathname === '/';

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileGuideOpen(false);
  };

  const isSolid = !isHomePage || scrolled;

  const headerClasses = isSolid
    ? 'bg-white/90 backdrop-blur-[18px] border-b border-black/5 shadow-header'
    : 'bg-transparent';

  const logoColor = isSolid ? 'text-nurvera-forest' : 'text-nurvera-bg';
  const iconColor = isSolid ? 'text-nurvera-forest' : 'text-nurvera-bg';
  const linkColor = isSolid ? 'text-nurvera-text hover:text-nurvera-olive' : 'text-white/90 hover:text-white';

  const guideLinks = [
    { title: 'İade ve Değişim Koşulları', path: '/rehber/iade-ve-degisim' },
    { title: 'Satış ve Sipariş Süreci', path: '/rehber/satis-ve-siparis-sureci' },
    { title: 'Güvenli Ödeme', path: '/rehber/guvenli-odeme' },
    { title: 'Kargo ve Teslimat', path: '/rehber/kargo-ve-teslimat' },
    { title: 'Ürün Kullanım Rehberi', path: '/rehber/urun-kullanim-rehberi' },
    { title: 'Doğal Kullanım Bilgileri', path: '/rehber/dogal-kullanim-bilgilendirmeleri' },
    { title: 'Sık Sorulan Sorular', path: '/rehber/sik-sorulan-sorular' },
    { title: 'Gizlilik Politikası', path: '/rehber/gizlilik-ve-guvenlik' },
    { title: 'Mesafeli Satış Sözleşmesi', path: '/rehber/mesafeli-satis-sozlesmesi' },
    { title: 'Destek ve İletişim', path: '/iletisim' }
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 h-[88px] flex items-center ${headerClasses}`}>
      <div className="container mx-auto px-6 flex justify-between items-center w-full">
        
        <Link href="/" className="flex items-center group" aria-label="Ana Sayfa">
          <div className={`hidden md:block transition-colors duration-300 ${logoColor} group-hover:scale-[1.02]`}>
            <Logo variant="secondary" />
          </div>
          <div className={`block md:hidden transition-colors duration-300 ${logoColor} group-hover:scale-[1.02]`}>
            <Logo variant="icon" />
          </div>
        </Link>

        <nav className="hidden lg:flex space-x-10 items-center">
          <Link href="/" className={`text-[15px] font-medium transition-colors duration-300 tracking-wide ${linkColor}`}>Ana Sayfa</Link>
          <Link href="/urunler" className={`text-[15px] font-medium transition-colors duration-300 tracking-wide ${linkColor}`}>Koleksiyon</Link>
          <Link href="/hakkimizda" className={`text-[15px] font-medium transition-colors duration-300 tracking-wide ${linkColor}`}>Hikayemiz</Link>
          
          {/* Mega Menu Trigger */}
          <div className="relative group h-[88px] flex items-center">
            <button className={`flex items-center text-[15px] font-medium transition-colors duration-300 tracking-wide ${linkColor}`}>
              Güven ve Rehber
              <ChevronDown size={14} className="ml-1 opacity-70 group-hover:rotate-180 transition-transform duration-300" />
            </button>
            
            {/* Mega Menu Dropdown */}
            <div className="absolute top-[88px] left-1/2 -translate-x-1/2 w-[700px] bg-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-gray-100 rounded-b-2xl overflow-hidden cursor-default">
              <div className="flex">
                <div className="w-2/3 p-8 bg-white grid grid-cols-2 gap-x-6 gap-y-4">
                  {guideLinks.map((link, idx) => (
                    <Link key={idx} href={link.path} className="text-sm text-nurvera-text/80 hover:text-nurvera-olive transition-colors font-medium flex items-center group/link">
                      <span className="w-1.5 h-1.5 rounded-full bg-nurvera-olive/30 mr-2 group-hover/link:bg-nurvera-olive transition-colors"></span>
                      {link.title}
                    </Link>
                  ))}
                </div>
                <div className="w-1/3 bg-nurvera-bg/50 p-8 flex flex-col justify-center border-l border-gray-100">
                  <ShieldCheck className="text-nurvera-olive mb-4" size={32} strokeWidth={1.5} />
                  <h4 className="font-serif text-lg text-nurvera-text mb-2">Şeffaf Süreçler</h4>
                  <p className="text-xs text-nurvera-text/70 leading-relaxed font-medium">Sipariş sürecinizi şeffaf ve güvenli biçimde yönetiyoruz. İade, teslimat ve destek süreçlerimiz açık ve erişilebilir.</p>
                </div>
              </div>
            </div>
          </div>
          
          <Link href="/blog" className={`text-[15px] font-medium transition-colors duration-300 tracking-wide ${linkColor}`}>Dergi</Link>
        </nav>

        <div className="flex items-center space-x-6">
          <Link href="/login" className={`transition-all duration-300 hover:-translate-y-0.5 hidden sm:block ${iconColor}`}>
            <User size={22} strokeWidth={1.5} />
          </Link>
          <a href="tel:+905354325337" className={`transition-all duration-300 hover:-translate-y-0.5 hidden sm:block ${iconColor}`}>
            <Phone size={22} strokeWidth={1.5} />
          </a>
          <button onClick={toggleCart} className={`relative transition-all duration-300 hover:-translate-y-0.5 ${iconColor}`} aria-label="Sepeti Aç">
            <ShoppingBag size={22} strokeWidth={1.5} />
            {mounted && getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-nurvera-earth text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                {getTotalItems()}
              </span>
            )}
          </button>
          <button className={`lg:hidden p-1 transition-colors duration-300 ${iconColor}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menüyü Aç">
            {mobileMenuOpen ? <X size={26} strokeWidth={1.5} /> : <Menu size={26} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobil Menü (Açılır) */}
      <div className={`lg:hidden absolute top-[88px] left-0 w-full bg-white shadow-elegant transition-all duration-400 ease-in-out overflow-y-auto ${mobileMenuOpen ? 'max-h-[calc(100vh-88px)] opacity-100 border-t border-black/5' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col px-8 py-8 space-y-5">
          <Link href="/" onClick={closeMobileMenu} className="text-xl font-serif text-nurvera-text">Ana Sayfa</Link>
          <Link href="/urunler" onClick={closeMobileMenu} className="text-xl font-serif text-nurvera-text">Koleksiyon</Link>
          <Link href="/hakkimizda" onClick={closeMobileMenu} className="text-xl font-serif text-nurvera-text">Hikayemiz</Link>
          
          {/* Mobil Akordeon */}
          <div className="border-y border-gray-100 py-2 my-2">
            <button 
              className="w-full flex items-center justify-between text-xl font-serif text-nurvera-text focus:outline-none"
              onClick={() => setMobileGuideOpen(!mobileGuideOpen)}
            >
              Güven ve Rehber
              <ChevronDown size={20} className={`text-nurvera-olive transition-transform duration-300 ${mobileGuideOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${mobileGuideOpen ? 'max-h-[500px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="flex flex-col space-y-3 pl-4 border-l border-nurvera-olive/20 pb-2">
                {guideLinks.map((link, idx) => (
                  <Link key={idx} href={link.path} onClick={closeMobileMenu} className="text-sm font-medium text-nurvera-text/70">
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/blog" onClick={closeMobileMenu} className="text-xl font-serif text-nurvera-text">Dergi</Link>
          
          <div className="flex flex-col space-y-4 pt-4 mt-2">
            <Link href="/login" onClick={closeMobileMenu} className="flex items-center text-nurvera-forest font-medium">
              <User size={18} className="mr-3" /> Giriş Yap / Üye Ol
            </Link>
            <a href="tel:+905354325337" className="flex items-center text-nurvera-forest font-medium">
              <Phone size={18} className="mr-3" /> 0535 432 53 37
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
