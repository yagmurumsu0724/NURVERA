import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from '@/components/ui/CartDrawer';
import Logo from '@/components/ui/Logo';

export default function Layout({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1.2s preloader delay according to Master Plan
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-nurvera-bg font-sans">
      {/* Premium Preloader */}
      {loading && (
        <div className="fixed inset-0 z-[100] bg-nurvera-bg flex flex-col items-center justify-center animate-fade-out-late">
          <div className="text-nurvera-forest animate-fade-in-up">
            <Logo variant="icon" />
            <div className="font-serif text-2xl tracking-[0.2em] mt-4 text-center">NURVERA</div>
          </div>
        </div>
      )}

      <Header />
      <CartDrawer />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
