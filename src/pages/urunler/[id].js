import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { ShoppingCart, Heart, ShieldCheck, Truck, RefreshCcw, Star, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { products, getProductById } from '@/data/products';
import useCartStore from '@/store/cartStore';

export default function ProductDetail({ product }) {
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product?.images[0]);
  const { addItem, toggleCart } = useCartStore();

  if (!product) return <div>Ürün bulunamadı.</div>;

  const handleAddToCart = () => {
    // Add multiple items by calling addItem multiple times or update the store to handle quantity
    // Currently, addItem adds 1. We will call it multiple times for simplicity, or we can just add 1 and notify.
    // Assuming cartStore groups by id.
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    toggleCart(); // Open cart drawer
  };

  return (
    <>
      <Head>
        <title>{product.name} | NURVERA</title>
        <meta name="description" content={product.shortDescription} />
      </Head>

      <div className="bg-[#Fdfbf7] pt-32 pb-24 min-h-screen">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            
            {/* Sol Taraf: Görseller */}
            <motion.div 
              className="w-full lg:w-1/2 space-y-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="bg-white rounded-3xl overflow-hidden h-[500px] md:h-[650px] relative shadow-soft border border-gray-100">
                <Image 
                  src={mainImage} 
                  alt={product.name} 
                  fill
                  className="object-cover"
                />
                {product.badge && (
                  <div className="absolute top-6 left-6 z-10 bg-nurvera-olive text-white text-xs font-bold px-4 py-2 uppercase tracking-widest shadow-lg">
                    {product.badge}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setMainImage(img)}
                    className={`bg-white rounded-xl overflow-hidden h-28 relative cursor-pointer border-2 transition-all duration-300 ${mainImage === img ? 'border-nurvera-olive opacity-100' : 'border-transparent opacity-60 hover:opacity-100 shadow-sm'}`}
                  >
                    <Image src={img} alt={`${product.name} detay ${idx}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Sağ Taraf: Detaylar */}
            <motion.div 
              className="w-full lg:w-1/2 flex flex-col justify-center"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <div className="flex items-center space-x-2 text-nurvera-accent mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} fill="currentColor" />
                  ))}
                </div>
                <span className="text-sm font-medium text-nurvera-text/60 tracking-wider">(24 Mükemmel Yorum)</span>
              </div>

              <h1 className="font-serif text-4xl md:text-5xl font-normal text-nurvera-text mb-3">
                {product.name}
              </h1>
              
              <div className="text-nurvera-accent/80 text-xs font-bold tracking-[0.2em] uppercase mb-6">
                {product.description}
              </div>
              
              <p className="text-3xl font-medium text-nurvera-olive mb-8">
                {product.price}
              </p>
              
              <p className="text-nurvera-text/70 leading-relaxed mb-10 font-light text-lg">
                {product.shortDescription}
              </p>

              {/* Hacim */}
              <div className="mb-10">
                <span className="block text-xs font-bold text-gray-400 tracking-widest uppercase mb-3">Miktar</span>
                <div className="inline-block border border-nurvera-olive/40 text-nurvera-olive bg-nurvera-olive/5 font-semibold px-6 py-2 rounded-lg">
                  {product.volume}
                </div>
              </div>

              {/* Sepet İşlemleri */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
                <div className="flex items-center border border-gray-200 rounded-none h-14 bg-white w-full sm:w-auto">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-6 text-gray-500 hover:text-nurvera-olive text-xl transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium text-nurvera-text">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-6 text-gray-500 hover:text-nurvera-olive text-xl transition-colors"
                  >
                    +
                  </button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="w-full sm:flex-1 bg-nurvera-olive text-white h-14 flex items-center justify-center text-sm font-bold tracking-[0.15em] uppercase hover:bg-[#4a5e29] transition-all duration-300 shadow-elegant"
                >
                  <ShoppingCart size={18} className="mr-3" />
                  Sepete Ekle
                </button>
              </div>

              {/* Güven Rozetleri */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-y border-gray-200 py-8 mb-12">
                <div className="flex flex-col items-center text-center space-y-2">
                  <ShieldCheck className="text-nurvera-olive" size={28} strokeWidth={1.5} />
                  <span className="text-xs font-bold tracking-wider text-nurvera-text/80 uppercase">%100 Doğal İçerik</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-2">
                  <Truck className="text-nurvera-olive" size={28} strokeWidth={1.5} />
                  <span className="text-xs font-bold tracking-wider text-nurvera-text/80 uppercase">Hızlı Kargo</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-2">
                  <RefreshCcw className="text-nurvera-olive" size={28} strokeWidth={1.5} />
                  <span className="text-xs font-bold tracking-wider text-nurvera-text/80 uppercase">Kolay İade</span>
                </div>
              </div>

              {/* Sekmeler (Tabs) */}
              <div className="bg-white p-8 rounded-2xl shadow-soft border border-gray-100">
                <div className="flex border-b border-gray-100 space-x-6 md:space-x-10 mb-6 overflow-x-auto whitespace-nowrap pb-2">
                  <button 
                    className={`pb-4 font-bold text-xs tracking-widest uppercase transition-colors relative ${activeTab === 'description' ? 'text-nurvera-olive' : 'text-gray-400 hover:text-nurvera-olive'}`}
                    onClick={() => setActiveTab('description')}
                  >
                    Özellikler & İçerik
                    {activeTab === 'description' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-nurvera-olive"></span>}
                  </button>
                  <button 
                    className={`pb-4 font-bold text-xs tracking-widest uppercase transition-colors relative ${activeTab === 'usage' ? 'text-nurvera-olive' : 'text-gray-400 hover:text-nurvera-olive'}`}
                    onClick={() => setActiveTab('usage')}
                  >
                    Kullanım Şekli
                    {activeTab === 'usage' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-nurvera-olive"></span>}
                  </button>
                  <button 
                    className={`pb-4 font-bold text-xs tracking-widest uppercase transition-colors relative ${activeTab === 'warnings' ? 'text-nurvera-olive' : 'text-gray-400 hover:text-nurvera-olive'}`}
                    onClick={() => setActiveTab('warnings')}
                  >
                    Dikkat Edilecekler
                    {activeTab === 'warnings' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-nurvera-olive"></span>}
                  </button>
                </div>

                <div className="text-sm text-gray-600 leading-loose font-light min-h-[150px]">
                  {activeTab === 'description' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                      <p className="mb-4">
                        NURVERA kalitesiyle hazırlanan bu ürün, doğanın saf gücünü cildinize veya bedeninize taşır. Fabrikasyon değil, butik ve özenli üretim süreçlerinden geçmiştir.
                      </p>
                      <h4 className="font-bold text-nurvera-text mb-2 tracking-widest uppercase text-xs">İçindekiler</h4>
                      <p className="bg-nurvera-bg p-4 rounded-lg border border-nurvera-beige/30">{product.ingredients}</p>
                    </motion.div>
                  )}
                  {activeTab === 'usage' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                      <div className="flex items-start">
                        <Check className="text-nurvera-olive mt-1 mr-3 flex-shrink-0" size={18} />
                        <p>{product.usage}</p>
                      </div>
                    </motion.div>
                  )}
                  {activeTab === 'warnings' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                      <div className="bg-red-50/50 p-5 border border-red-100 rounded-lg text-red-800/90">
                        <p className="mb-2 font-bold uppercase text-xs tracking-widest">Uyarılar</p>
                        <p>{product.warnings}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const paths = products.map((product) => ({
    params: { id: product.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const product = getProductById(params.id);
  return { props: { product } };
}
