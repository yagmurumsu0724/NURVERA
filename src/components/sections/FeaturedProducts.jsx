import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import useCartStore from '@/store/cartStore';
import { motion } from 'framer-motion';
import { products } from '@/data/products';

export default function FeaturedProducts({ showLink = true }) {
  const { addItem, toggleCart } = useCartStore();

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    addItem(product);
    toggleCart();
  };

  return (
    <section className="py-24 bg-[#Fdfbf7]">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-nurvera-accent tracking-[0.2em] uppercase text-xs font-bold mb-4 block">Özel Seçki</span>
          <h2 className="font-serif text-4xl md:text-5xl font-normal text-nurvera-text mb-6">Doğanın En İyileri</h2>
          <p className="text-lg text-nurvera-text/70 font-light">
            Güzelliğinizi doğanın saf ve güçlü özleriyle destekleyin.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.slice(0, 3).map((product, index) => (
            <motion.div 
              key={product.id} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group bg-white overflow-hidden hover:shadow-elegant transition-all duration-700 border border-gray-100 flex flex-col"
            >
              {/* Görsel Alanı */}
              <Link href={`/urunler/${product.id}`} className="block relative h-[360px] overflow-hidden bg-[#f9f8f6] cursor-pointer">
                {product.badge && (
                  <div className="absolute top-6 left-6 z-10 bg-nurvera-olive text-white text-[10px] font-bold px-4 py-1.5 uppercase tracking-widest">
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
        </div>

        {showLink && (
          <motion.div 
            className="text-center mt-24"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Link 
              href="/urunler" 
              className="inline-block border-b-2 border-nurvera-olive pb-2 text-nurvera-olive font-semibold tracking-[0.15em] uppercase text-sm hover:text-nurvera-accent hover:border-nurvera-accent transition-colors"
            >
              Tüm Koleksiyonu Gör
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
