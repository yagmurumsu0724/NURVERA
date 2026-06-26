import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import useCartStore from '@/store/cartStore';

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay (Koyu arka plan) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Çekmece */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
          >
            {/* Üst Kısım: Başlık */}
            <div className="flex items-center justify-between p-6 border-b border-black/5">
              <h2 className="text-xl font-serif text-nurvera-text flex items-center">
                <ShoppingBag className="mr-3 text-nurvera-olive" size={24} />
                Sepetiniz ({getTotalItems()})
              </h2>
              <button 
                onClick={closeCart}
                className="p-2 hover:bg-nurvera-bg rounded-full transition-colors text-nurvera-text/50 hover:text-nurvera-text"
              >
                <X size={20} />
              </button>
            </div>

            {/* Orta Kısım: Ürünler */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                  <ShoppingBag size={48} className="text-nurvera-olive/50 mb-4" strokeWidth={1} />
                  <p className="text-lg font-serif text-nurvera-text mb-2">Sepetiniz şu an boş.</p>
                  <p className="text-sm text-nurvera-text/60 font-light mb-6">Şifa dolu doğal ürünlerimizi incelemek ister misiniz?</p>
                  <Link 
                    href="/urunler" 
                    onClick={closeCart}
                    className="bg-nurvera-bg border border-nurvera-olive/20 text-nurvera-text px-6 py-3 rounded-full text-sm font-medium hover:bg-nurvera-olive hover:text-white transition-colors"
                  >
                    Koleksiyona Göz At
                  </Link>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map((item) => (
                    <li key={item.product.id} className="flex gap-4 items-center">
                      <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-nurvera-bg flex-shrink-0">
                        <Image 
                          src={item.product.image} 
                          alt={item.product.name} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-serif text-nurvera-text">{item.product.name}</h3>
                            <p className="text-xs text-nurvera-text/50">{item.product.size}</p>
                          </div>
                          <button 
                            onClick={() => removeItem(item.product.id)}
                            className="text-nurvera-text/30 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="flex items-center border border-black/10 rounded-full px-3 py-1 bg-white">
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="text-nurvera-text/50 hover:text-nurvera-forest"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="text-nurvera-text/50 hover:text-nurvera-forest"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="font-medium text-nurvera-forest">
                            {item.product.price * item.quantity} TL
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Alt Kısım: Toplam ve Buton */}
            {items.length > 0 && (
              <div className="p-6 bg-nurvera-bg/50 border-t border-black/5 mt-auto">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-serif text-nurvera-text/80">Ara Toplam:</span>
                  <span className="text-2xl font-medium text-nurvera-forest">{getTotalPrice()} TL</span>
                </div>
                <p className="text-xs text-nurvera-text/50 text-center mb-4">Kargo ücreti ödeme adımında hesaplanacaktır.</p>
                
                <Link 
                  href="/odeme"
                  onClick={closeCart}
                  className="w-full bg-nurvera-forest text-white rounded-full py-4 flex items-center justify-center font-bold tracking-widest uppercase shadow-lg hover:bg-nurvera-text transition-all hover:scale-[1.02] group"
                >
                  Güvenli Ödeme Adımına Geç
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
