import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingBag, Filter, ChevronRight, Star } from 'lucide-react';
import useCartStore from '@/store/cartStore';
import { createClient } from '@supabase/supabase-js';
import FavoriteButton from '@/components/ui/FavoriteButton';

export async function getStaticProps() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data: products } = await supabase
    .from('products')
    .select('id, name, slug, short_description, price, images, schema_data, categories(name)')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  return {
    props: {
      products: products || []
    },
    revalidate: 60,
  };
}

export default function UrunlerPage({ products }) {
  const [filter, setFilter] = useState('Tümü');
  const { addItem } = useCartStore();

  const dynamicCategories = ['Tümü', ...new Set(products.map(p => p.categories?.name).filter(Boolean))];
  const categories = dynamicCategories.length > 1 ? dynamicCategories : ['Tümü', 'Yağlar', 'Kremler'];

  const filteredProducts = filter === 'Tümü' 
    ? products 
    : products.filter(p => p.categories?.name === filter);

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
                <div className="block relative aspect-[4/5] rounded-2xl overflow-hidden bg-nurvera-bg mb-4">
                  <Link href={`/urunler/${product.slug}`}>
                    <Image 
                      src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg'} 
                      alt={product.name} 
                      fill 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </Link>
                  
                  {/* Favorite Button */}
                  <div className="absolute top-3 right-3 z-10">
                    <FavoriteButton productId={product.id} />
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  
                  {/* Hızlı Ekle Butonu */}
                  <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 bg-white text-nurvera-forest font-semibold text-xs tracking-wider uppercase px-6 py-3 rounded-full shadow-lg transition-all duration-300 flex items-center space-x-2 w-[80%] justify-center hover:bg-nurvera-forest hover:text-white"
                  >
                    <ShoppingBag size={16} />
                    <span>Sepete Ekle</span>
                  </button>
                </div>

                {/* Ürün Bilgileri */}
                <div className="flex flex-col flex-grow text-center px-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-nurvera-text/50 font-bold mb-2">
                    {product.categories?.name || 'Kategori'}
                  </span>
                  <Link href={`/urunler/${product.slug}`}>
                    <h3 className="font-serif text-lg text-nurvera-text mb-1 hover:text-[#c5a028] transition-colors">{product.name}</h3>
                  </Link>
                  <p className="text-sm text-nurvera-text/60 mb-3 flex-grow line-clamp-2">
                    {product.short_description}
                  </p>
                  <div className="flex items-center justify-center space-x-3 mt-auto">
                    <span className="font-medium text-lg text-nurvera-forest">{product.price} TL</span>
                    {product.schema_data?.size && <span className="text-xs text-nurvera-text/40">/ {product.schema_data.size}</span>}
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
