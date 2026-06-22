import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { blogPosts } from '@/data/blog';

export default function BlogIndex() {
  const [activeCategory, setActiveCategory] = useState('Tümü');

  const categories = ['Tümü', 'Geleneksel Uygulamalar', 'Hidrosol Rehberi', 'Doğal Yaşam', 'Cilt Bakımı', 'İçerik Analizi'];

  const filteredPosts = activeCategory === 'Tümü' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <>
      <Head>
        <title>NURVERA Blog | Doğal Yaşam Rehberi</title>
      </Head>

      <div className="bg-[#Fdfbf7] pt-32 pb-24 min-h-screen">
        <div className="container mx-auto px-6">
          
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-nurvera-accent tracking-[0.2em] uppercase text-xs font-bold mb-4 block">Blog & Rehber</span>
            <h1 className="font-serif text-5xl md:text-6xl font-normal text-nurvera-text mb-6">Doğal Yaşam Dergisi</h1>
            <p className="text-lg text-nurvera-text/70 font-light leading-relaxed">
              Bitkilerin gizli dünyasını keşfedin, sağlığınızı korumak için doğal ve kimyasalsız yöntemleri öğrenin.
            </p>
          </motion.div>

          {/* Kategori Filtreleri */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-20"
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

          {/* Blog Kartları */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence>
              {filteredPosts.map((post, index) => (
                <motion.article 
                  key={post.id} 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-elegant transition-all duration-500 flex flex-col h-full group border border-gray-100"
                >
                  <Link href={`/blog/${post.slug}`} className="block relative h-64 overflow-hidden">
                    <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md text-nurvera-olive text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                      {post.category}
                    </div>
                    <Image 
                      src={post.image} 
                      alt={post.title} 
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                  </Link>
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center text-xs font-bold tracking-widest text-gray-400 uppercase mb-4 space-x-3">
                      <span>{post.date}</span>
                      <span className="text-nurvera-beige">•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <Link href={`/blog/${post.slug}`} className="block">
                      <h2 className="font-serif text-2xl font-medium text-nurvera-text mb-4 group-hover:text-nurvera-olive transition-colors leading-snug">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-[15px] text-gray-500 mb-8 font-light leading-relaxed flex-grow">
                      {post.excerpt}
                    </p>
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center font-bold tracking-widest uppercase text-xs text-nurvera-olive hover:text-nurvera-accent transition-colors mt-auto"
                    >
                      Okumaya Devam Et <span className="ml-2 text-lg leading-none">&rarr;</span>
                    </Link>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </>
  );
}
