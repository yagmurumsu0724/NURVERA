import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingBag, Filter, ChevronRight, Star } from 'lucide-react';
import { products } from '@/data/products';
import useCartStore from '@/store/cartStore';

export default function UrunlerPage() {
  const [filter, setFilter] = useState('Tümü');
  const { addItem } = useCartStore();

  const categories = ['Tümü', 'Yağlar', 'Kremler'];

  const filteredProducts = filter === 'Tümü' 
    ? products 
    : products.filter(p => p.category === filter);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addItem(product, 1);
    // Bildirim veya animasyon eklenebilir
  };

  return (
    <>
      <Head>
        <title>NURVERA Koleksiyon | Geleneksel Doğal Bakım Ürünleri</title>
        <meta name="description" content="NURVERA'nın %100 doğal, bitkisel yağlar ve kremlerden oluşan şifa koleksiyonunu keşfedin." />
      </Head>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 bg-nurvera-bg overflow-hidden border-b border-black/5">
        <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-nurvera-olive/10 blur-[100px] rounded-bl-full pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <span className="text-[#c5a028] tracking-[0.3em] text-xs font-bold uppercase mb-4 block">NURVERA KOLEKSİYON</span>
            <h1 className="text-4xl md:text-6xl font-serif text-nurvera-text mb-6">Doğanın En Saf Hali</h1>
            <p className="text-lg text-nurvera-text/70 max-w-2xl mx-auto font-light leading-relaxed">
              Katkı maddesi, sentetik parfüm ve petrol türevleri içermeyen; tamamen geleneksel yöntemlerle elde edilmiş doğal yağlar ve onarıcı kremler.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ürün Listesi */}
      <section className="py-16 bg-white min-h-screen">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {/* Filtreler */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Filter size={18} className="text-nurvera-text/50" />
              <span className="text-nurvera-text/70 text-sm font-medium uppercase tracking-wider">Filtrele:</span>
            </div>
            <div className="flex space-x-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    filter === cat 
                      ? 'bg-nurvera-forest text-white shadow-md' 
                      : 'bg-nurvera-bg text-nurvera-text/70 hover:bg-nurvera-olive/10 hover:text-nurvera-text'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Ürün Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex flex-col"
              >
                <Link href={`/urunler/${product.id}`} className="block relative aspect-[4/5] rounded-2xl overflow-hidden bg-nurvera-bg mb-4">
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill 
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Hızlı Ekle Butonu */}
                  <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-white/95 backdrop-blur-sm text-nurvera-forest px-6 py-3 rounded-full flex items-center shadow-lg hover:bg-nurvera-forest hover:text-white font-medium text-sm w-[85%] justify-center"
                  >
                    <ShoppingBag size={16} className="mr-2" />
                    Sepete Ekle
                  </button>

                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold tracking-wider text-nurvera-forest">
                    {product.size}
                  </div>
                </Link>

                <div className="flex flex-col flex-grow px-2">
                  <div className="flex justify-between items-start mb-2">
                    <Link href={`/urunler/${product.id}`}>
                      <h3 className="text-lg font-serif text-nurvera-text group-hover:text-nurvera-olive transition-colors">{product.name}</h3>
                    </Link>
                    <span className="text-lg font-medium text-nurvera-forest">{product.price} TL</span>
                  </div>
                  <p className="text-sm text-nurvera-text/60 line-clamp-2 mb-4 flex-grow">
                    {product.shortDesc}
                  </p>
                  <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-nurvera-text/40 pt-2 border-t border-black/5">
                    <span>{product.category}</span>
                    <Link href={`/urunler/${product.id}`} className="flex items-center text-nurvera-olive hover:text-nurvera-forest transition-colors">
                      İncele <ChevronRight size={14} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
