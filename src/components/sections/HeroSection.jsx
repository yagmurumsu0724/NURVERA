import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#1F291E]">
      
      {/* Premium Arka Plan Resmi & Deep Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/hero_background.png" 
          alt="Nurvera Doğal Yaşam" 
          fill
          priority
          className="object-cover object-center scale-105"
        />
        {/* Master Plan Gradient Overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(15,25,18,0.35), rgba(15,25,18,0.65))' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center text-white mt-20 max-w-4xl">
        
        {/* Marka İsmi / Tipografi */}
        <motion.h1 
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-normal leading-tight mb-8 tracking-wide text-nurvera-bg drop-shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        >
          Doğanın Saflığı,<br/>
          <span className="italic font-light">Evinizin Şifası</span>
        </motion.h1>
        
        {/* Hikaye/Slogan */}
        <motion.p 
          className="text-sm md:text-lg lg:text-xl font-sans font-light text-white/90 mb-14 drop-shadow-md tracking-wider leading-relaxed max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        >
          Annemin yıllara dayanan tecrübesiyle hazırlanan, %100 doğal ve el yapımı içeriklerle yaşam alanlarınıza saf bir nefes katın.
        </motion.p>
        
        {/* Premium Butonlar */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
        >
          <Link 
            href="/urunler" 
            className="group relative px-10 h-[56px] flex items-center justify-center bg-nurvera-olive text-white rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-elegant w-full sm:w-auto"
          >
            <span className="relative z-10 font-medium tracking-wider text-[15px]">Koleksiyonu Keşfet</span>
            <div className="absolute inset-0 bg-nurvera-forest transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
          </Link>
          
          <Link 
            href="/hakkimizda" 
            className="px-10 h-[56px] flex items-center justify-center bg-transparent border border-white/30 text-white rounded-xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm w-full sm:w-auto font-medium tracking-wider text-[15px]"
          >
            Hikayemiz
          </Link>
        </motion.div>

      </div>
      
      {/* Aşağı Kaydır İkonu */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 text-white/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="w-[1px] h-16 bg-white/30 overflow-hidden relative mx-auto">
          <motion.div 
            className="w-full h-1/2 bg-white absolute top-0"
            animate={{ top: ['-50%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
