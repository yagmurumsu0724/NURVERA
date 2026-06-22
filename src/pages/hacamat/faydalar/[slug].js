import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, ExternalLink, CalendarHeart, Sparkles } from 'lucide-react';
import { hacamatFaydalar } from '@/data/hacamatFaydalar';

export default function FaydaDetayPage() {
  const router = useRouter();
  const { slug } = router.query;

  // Eğer sayfa henüz yüklenmemişse
  if (!slug) return null;

  const fayda = hacamatFaydalar.find(f => f.id === slug);

  // Yanlış URL girildiyse 404 gibi davran veya listeye yönlendir
  if (!fayda) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nurvera-bg">
        <div className="text-center">
          <h1 className="text-3xl font-serif text-nurvera-text mb-4">Sayfa Bulunamadı</h1>
          <Link href="/hacamat" className="text-nurvera-olive hover:underline">
            Hacamat sayfasına dön
          </Link>
        </div>
      </div>
    );
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <>
      <Head>
        <title>{fayda.title} | NURVERA Hacamat Faydaları</title>
        <meta name="description" content={fayda.shortDesc} />
      </Head>

      {/* Premium Hero Section */}
      <section className="relative pt-40 pb-32 bg-gradient-to-br from-[#0f241a] via-[#1a3c34] to-[#122820] overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-[#d4af37]/5 blur-[120px] mix-blend-screen pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <Link href="/hacamat" className="inline-flex items-center text-[#d4af37] hover:text-white transition-colors mb-8 group text-sm tracking-widest uppercase font-semibold">
            <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
            HACAMAT SAYFASINA DÖN
          </Link>

          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight drop-shadow-md">
              {fayda.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/80 font-light leading-relaxed mb-8">
              {fayda.shortDesc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* İçerik Alanı */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 max-w-6xl mx-auto">
            
            {/* Metin Alanı */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="lg:w-2/3"
            >
              <div 
                className="prose prose-lg prose-headings:font-serif prose-headings:text-nurvera-text prose-p:text-nurvera-text/80 prose-p:leading-relaxed prose-blockquote:border-l-[#d4af37] prose-blockquote:bg-nurvera-bg prose-blockquote:p-6 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-nurvera-text prose-blockquote:shadow-sm prose-a:text-nurvera-olive hover:prose-a:text-[#d4af37] max-w-none"
                dangerouslySetInnerHTML={{ __html: fayda.content }}
              />

              {/* Kaynakça Alanı */}
              {fayda.sources && fayda.sources.length > 0 && (
                <div className="mt-16 pt-10 border-t border-black/10">
                  <h3 className="text-xl font-serif text-nurvera-text mb-6 flex items-center">
                    <BookOpen className="w-5 h-5 mr-3 text-nurvera-olive" />
                    Bilimsel Referanslar ve Kaynaklar
                  </h3>
                  <ul className="space-y-4">
                    {fayda.sources.map((source, idx) => (
                      <li key={idx}>
                        <a 
                          href={source.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-nurvera-text/70 hover:text-nurvera-olive transition-colors group text-sm"
                        >
                          <ExternalLink className="w-4 h-4 mr-3 text-gray-400 group-hover:text-[#d4af37]" />
                          {source.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-xs text-gray-500 italic">
                    * Yukarıdaki referanslar, içeriğin bilimsel çerçevesini desteklemek amacıyla sunulmuştur.
                  </p>
                </div>
              )}
            </motion.div>

            {/* Yan Menü / Görsel */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="lg:w-1/3"
            >
              <div className="sticky top-32">
                <div className="relative rounded-3xl overflow-hidden aspect-[3/4] shadow-xl mb-8">
                  <Image src={fayda.image} alt={fayda.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center text-[#d4af37] mb-2">
                      <Sparkles className="w-5 h-5 mr-2" />
                      <span className="font-bold tracking-wider text-sm uppercase">NURVERA</span>
                    </div>
                    <p className="text-white/90 text-sm leading-relaxed">Bilimsel dayanaklar ışığında geleneksel şifayı keşfedin.</p>
                  </div>
                </div>

                <div className="bg-nurvera-bg p-8 rounded-3xl border border-black/5 text-center">
                  <CalendarHeart className="w-12 h-12 text-nurvera-olive mx-auto mb-4" />
                  <h4 className="text-xl font-serif text-nurvera-text mb-3">Randevunuzu Planlayın</h4>
                  <p className="text-nurvera-text/70 text-sm mb-6">Ön görüşme ve detaylı değerlendirme için bizimle iletişime geçin.</p>
                  <Link href="/randevu" className="block w-full py-4 bg-nurvera-forest text-white rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-nurvera-olive transition-colors">
                    Randevu Al
                  </Link>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  );
}
