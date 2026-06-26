import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Plus, Minus, Info, CheckCircle, ShieldCheck, Leaf } from 'lucide-react';
import { products } from '@/data/products';
import useCartStore from '@/store/cartStore';

export default function UrunDetayPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  const product = products.find(p => p.id === slug);

  if (!product && router.isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nurvera-bg">
        <div className="text-center">
          <h1 className="text-3xl font-serif text-nurvera-text mb-4">Ürün Bulunamadı</h1>
          <Link href="/urunler" className="text-nurvera-olive hover:underline">
            Koleksiyona dön
          </Link>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <>
      <Head>
        <title>{product.name} | NURVERA Koleksiyon</title>
        <meta name="description" content={product.shortDesc} />
      </Head>

      <section className="pt-32 pb-24 bg-white min-h-screen">
        <div className="container mx-auto px-6 max-w-6xl">
          
          <Link href="/urunler" className="inline-flex items-center text-nurvera-text/50 hover:text-nurvera-olive transition-colors mb-10 text-sm font-medium tracking-widest uppercase">
            <ArrowLeft className="w-4 h-4 mr-2" />
            KOLEKSİYONA DÖN
          </Link>

          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Sol: Ürün Görseli */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-nurvera-bg shadow-sm">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  className="object-cover"
                  priority
                />
                {/* Organik rozeti */}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center text-xs font-bold tracking-wider text-nurvera-forest shadow-sm">
                  <Leaf className="w-4 h-4 mr-2 text-nurvera-olive" /> %100 DOĞAL
                </div>
              </div>
            </motion.div>

            {/* Sağ: Ürün Bilgileri */}
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={fadeInUp}
              className="lg:w-1/2 flex flex-col justify-center"
            >
              <div className="mb-8 border-b border-black/5 pb-8">
                <div className="flex items-center text-nurvera-olive text-sm font-bold tracking-widest uppercase mb-4">
                  {product.category} <span className="mx-3 text-gray-300">•</span> {product.size}
                </div>
                <h1 className="text-4xl md:text-5xl font-serif text-nurvera-text mb-6">
                  {product.name}
                </h1>
                <p className="text-xl text-nurvera-text/70 font-light leading-relaxed mb-6">
                  {product.shortDesc}
                </p>
                <div className="text-4xl font-medium text-nurvera-forest">
                  {product.price} TL
                </div>
              </div>

              {/* Miktar Seçici ve Sepete Ekle */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <div className="flex items-center justify-between border border-gray-200 rounded-full px-6 py-4 w-full sm:w-1/3 bg-nurvera-bg/50">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-nurvera-text/50 hover:text-nurvera-forest transition-colors">
                    <Minus size={18} />
                  </button>
                  <span className="font-bold text-lg text-nurvera-text w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="text-nurvera-text/50 hover:text-nurvera-forest transition-colors">
                    <Plus size={18} />
                  </button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="w-full sm:w-2/3 bg-nurvera-forest text-white rounded-full flex items-center justify-center font-bold tracking-widest uppercase py-4 shadow-lg hover:bg-nurvera-text transition-all hover:scale-[1.02]"
                >
                  <ShoppingBag size={20} className="mr-3" />
                  Sepete Ekle
                </button>
              </div>

              {/* Detaylı Bilgiler */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-serif text-nurvera-text mb-3 flex items-center">
                    <Info className="w-5 h-5 mr-2 text-nurvera-olive" /> Ürün Hakkında
                  </h3>
                  <p className="text-nurvera-text/70 leading-relaxed font-light text-[15px]">
                    {product.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-serif text-nurvera-text mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-nurvera-olive" /> Kullanım Şekli
                  </h3>
                  <p className="text-nurvera-text/70 leading-relaxed font-light text-[15px] bg-nurvera-bg p-5 rounded-2xl border border-nurvera-olive/10">
                    {product.usage}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-serif text-nurvera-text mb-3 flex items-center">
                    <ShieldCheck className="w-5 h-5 mr-2 text-nurvera-olive" /> İçindekiler
                  </h3>
                  <p className="text-nurvera-text/70 leading-relaxed font-light text-[15px] italic">
                    {product.ingredients}
                  </p>
                  <p className="text-xs text-nurvera-text/40 mt-2">
                    * Sadece bitkisel yağlar ve doğal mumlar kullanılarak formüle edilmiştir. Koruyucu, paraben ve sentetik esans içermez.
                  </p>
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
