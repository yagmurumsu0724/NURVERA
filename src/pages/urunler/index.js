import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '@/data/products';
import useCartStore from '@/store/cartStore';

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const { addItem, toggleCart } = useCartStore();

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    addItem(product);
    toggleCart();
  };

  const categories = ['Tümü', 'Hidrosol', 'Sirke', 'Yağ'];

  const filteredProducts = activeCategory === 'Tümü'
    ? products
    : products.filter(p => {
        // Simple mock filtering logic based on name since we don't have explicit category in data
        if (activeCategory === 'Hidrosol') return p.name.includes('Hidrosol');
        if (activeCategory === 'Sirke') return p.name.includes('Sirke');
        if (activeCategory === 'Yağ') return p.name.includes('Yağı') || p.name.includes('Tentür');
        return true;
      });

  return (
    <>
      <Head>
        <title>Koleksiyon | NURVERA</title>
      </Head>

      <div className="bg-[#Fdfbf7] min-h-screen pt-32 pb-24">
        
        {/* Sayfa Başlığı (Hero) */}
        <div className="container mx-auto px-6 mb-16">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-nurvera-accent tracking-[0.2em] uppercase text-xs font-bold mb-4 block">Koleksiyon</span>
            <h1 className="font-serif text-5xl md:text-6xl font-normal text-nurvera-text mb-6">Doğanın Saf Özleri</h1>
            <p className="text-lg text-nurvera-text/70 font-light leading-relaxed">
              Katkı maddesi içermeyen, tamamen doğal ve geleneksel yöntemlerle üretilen koleksiyonumuzla tanışın.
            </p>
          </motion.div>
        </div>

        {/* Kategoriler */}
        <div className="container mx-auto px-6 mb-12">
          <motion.div 
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-500 ${
                  activeCategory === category 
                    ? 'bg-nurvera-olive text-white shadow-md' 
                    : 'bg-white text-gray-400 hover:text-nurvera-olive border border-gray-200 hover:border-nurvera-olive'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Ürün Listesi */}
        <div className="container mx-auto px-6">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div 
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-white overflow-hidden hover:shadow-elegant transition-all duration-700 border border-gray-100 flex flex-col"
                >
                  {/* Görsel Alanı */}
                  <Link href={`/urunler/${product.id}`} className="block relative h-[360px] overflow-hidden bg-[#f9f8f6] cursor-pointer">
                    {product.badge && (
                      <div className="absolute top-6 left-6 z-10 bg-nurvera-olive text-white text-[10px] font-bold px-4 py-1.5 uppercase tracking-widest shadow-sm">
                        {product.badge}
                      </div>
                    )}
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                    />
                  </Link>

                  {/* İçerik Alanı */}
                  <div className="p-8 flex flex-col flex-grow bg-white">
                    <div className="flex-grow">
                      <Link href={`/urunler/${product.id}`}>
                        <h3 className="font-serif text-2xl font-normal text-nurvera-text mb-2 hover:text-nurvera-olive transition-colors cursor-pointer">{product.name}</h3>
                      </Link>
                      <div className="text-nurvera-accent/80 text-[11px] font-bold tracking-[0.15em] uppercase mb-4">
                        {product.description}
                      </div>
                      <div className="flex justify-between items-end mt-6">
                        <span className="text-xl font-medium text-nurvera-olive">{product.price}</span>
                        <span className="text-sm text-gray-400">{product.volume}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 mt-8 pt-6 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <button 
                        onClick={(e) => handleAddToCart(product, e)}
                        className="flex-1 flex justify-center items-center py-4 bg-nurvera-olive text-white text-xs font-bold tracking-widest uppercase hover:bg-[#4a5e29] transition-colors"
                      >
                        Sepete Ekle
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  );
}
