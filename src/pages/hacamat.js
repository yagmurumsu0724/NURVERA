import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Accordion from '@/components/ui/Accordion';
import HacamatCalendar from '@/components/sections/HacamatCalendar';
import { 
  CheckCircle2, XCircle, ShieldCheck, Clock, CalendarHeart, 
  Droplet, Shield, Brain, Activity, HeartPulse, Sparkles, 
  Leaf, Gem, CheckCircle, Award 
} from 'lucide-react';

export default function HacamatPage() {
  const faqs = [
    {
      question: "Hacamat acı verir mi?",
      answer: "Kişinin ağrı eşiğine göre değişmekle birlikte, uygulama yüzeysel çiziklerle yapıldığından genellikle hafif bir sinek ısırığı hissi olarak tanımlanır. Ağır bir acı beklenmez."
    },
    {
      question: "Kaç dakika sürer?",
      answer: "Ön değerlendirme ve hazırlık süreci dahil olmak üzere bir seans ortalama 30-45 dakika arasında sürmektedir."
    },
    {
      question: "Herkes yaptırabilir mi?",
      answer: "Hayır. Hamileler, kan sulandırıcı kullananlar, ciddi kalp/tansiyon hastaları ve aktif enfeksiyonu olanlar için uygun değildir. Uygulama öncesi durumunuz mutlaka değerlendirilir."
    },
    {
      question: "Aç mı gelmek gerekir?",
      answer: "İşlemden 2-3 saat önce hafif bir yemek yenmiş olması tavsiye edilir. Tamamen aç ya da çok tok olmak önerilmez."
    },
    {
      question: "Seans sonrası nelere dikkat edilmelidir?",
      answer: "Uygulama bölgesi temiz tutulmalı, ilk 24 saat ağır fiziksel aktiviteden kaçınılmalı ve vücudun dinlenmesine izin verilmelidir."
    }
  ];

  const benefits = [
    { id: "vucut-detoksu", icon: Droplet, title: "VÜCUT DETOKSU", desc: "Kan dolaşımını destekler, toksinlerin atılmasına yardımcı olur." },
    { id: "bagisiklik-destegi", icon: Shield, title: "BAĞIŞIKLIK DESTEĞİ", desc: "Bağışıklık sistemini güçlendirir, hastalıklara karşı koruma sağlar." },
    { id: "stres-ve-rahatlama", icon: Brain, title: "STRES & RAHATLAMA", desc: "Zihinsel ve fiziksel stresi azaltır, derin bir rahatlama sağlar." },
    { id: "kan-dolasimi", icon: Activity, title: "KAN DOLAŞIMINI DESTEKLER", desc: "Vücuda oksijen taşınmasını artırır, doğal enerji verir." },
    { id: "agri-ve-yorgunluk", icon: HeartPulse, title: "AĞRI & YORGUNLUK AZALTICI", desc: "Kas ağrılarını, baş ağrılarını ve kronik yorgunluğu hafifletir." },
    { id: "hormon-dengesi", icon: Sparkles, title: "HORMON DENGESİ", desc: "Vücut dengesini düzenler, hormonal döngüye katkı sağlar." }
  ];

  const badges = [
    { icon: Leaf, text: "%100 DOĞAL" },
    { icon: Droplet, text: "GELENEKSEL YÖNTEM" },
    { icon: Gem, text: "PREMİUM KALİTE" },
    { icon: ShieldCheck, text: "GÜVENLİ KULLANIM" }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <>
      <Head>
        <title>NURVERA Hacamat Hizmetleri | Arın, Dengele, Yenilen</title>
        <meta name="description" content="Doğal detoks, denge ve yenilenme. NURVERA Hacamat uygulamaları ile bedeninizi toksinlerden arındırın." />
      </Head>

      {/* Premium Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden bg-[#0f241a]">
        
        {/* Fotoğraf (Bulanık Arka Plan) */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 blur-[8px] scale-105"
            style={{ backgroundImage: "url('/images/ilk_hacamat_1782115144655.png')" }}
          ></div>
          {/* Karartma Gradyanı (Yazıların net okunabilmesi için) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f241a]/90 via-[#1a3c34]/70 to-[#122820]/95"></div>
        </div>

        {/* Dekoratif Arkaplan Işıkları */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#d4af37]/20 blur-[120px] rounded-full mix-blend-screen"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#d4af37]/10 blur-[150px] rounded-full mix-blend-screen"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="inline-flex flex-col items-center mb-8"
          >
            <div className="w-16 h-16 border border-[#d4af37]/30 rounded-full flex items-center justify-center mb-4 bg-[#d4af37]/5 backdrop-blur-sm">
              <Leaf className="w-8 h-8 text-[#d4af37]" />
            </div>
            <span className="text-[#d4af37] tracking-[0.3em] text-sm uppercase font-semibold mb-2">NURVERA HACAMAT</span>
            <span className="text-white/60 tracking-widest text-xs uppercase">Doğadan Gelen Şifa</span>
          </motion.div>

          <motion.h1 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 drop-shadow-lg"
          >
            HACAMAT
          </motion.h1>
          
          <motion.div 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="flex items-center justify-center gap-4 mb-8 text-[#d4af37] font-medium tracking-widest text-sm md:text-base uppercase"
          >
            <span>Doğal Detoks</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
            <span>Denge</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
            <span>Yenilenme</span>
          </motion.div>

          <motion.p 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-12 font-light"
          >
            Vücudunuzu arındırın, dengenizi yeniden keşfedin. Geleneksel şifanın modern dokunuşu ile yaşam kalitenizi yükseltin.
          </motion.p>

          <motion.div 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <Link href="/randevu" className="group relative px-10 py-5 bg-gradient-to-r from-[#d4af37] to-[#c5a028] text-[#0f241a] rounded-full font-bold tracking-widest uppercase overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.3)] transition-all hover:scale-105">
              <span className="relative z-10">Randevu Al</span>
              <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-500"></div>
            </Link>
          </motion.div>
        </div>

        {/* Gönderdiğiniz Görseli buraya bir poster gibi ekleyebiliriz veya arkaplan yapabiliriz */}
        {/* Kullanıcıdan alınan resmi göstermek için: */}
        {/* <div className="absolute inset-0 z-[-1] opacity-20">
              <Image src="/images/hacamat_poster.jpg" alt="Hacamat Poster" fill className="object-cover" />
            </div> */}
      </section>

      {/* ARIN - DENGELE - YENİLEN (Poster İçeriği) */}
      <section className="py-24 bg-[#Fdfbf7] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-nurvera-olive/5 rounded-full blur-[80px]"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-center max-w-4xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-nurvera-text mb-6">Arın • Dengele • Yenilen</h2>
            <p className="text-xl text-nurvera-text/70 leading-relaxed font-light">
              Hacamat, yüzyıllardır uygulanan doğal bir şifa yöntemidir. Bedeninizi toksinlerden arındırın, enerjinizi artırın, yaşam kalitenizi yükseltin.
            </p>
          </motion.div>

          <div className="text-center mb-16">
            <span className="inline-block px-6 py-2 border border-[#d4af37] text-[#c5a028] rounded-full text-sm font-bold tracking-widest uppercase mb-12 bg-[#d4af37]/5">
              Hacamatın Geniş Kapsamlı Faydaları
            </span>
          </div>

          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {benefits.map((benefit, index) => (
              <Link href={`/hacamat/faydalar/${benefit.id}`} key={index}>
                <motion.div 
                  variants={fadeInUp}
                  className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 group h-full cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-nurvera-forest/5 flex items-center justify-center mb-6 group-hover:bg-[#d4af37]/10 transition-colors">
                    <benefit.icon className="w-7 h-7 text-nurvera-forest group-hover:text-[#c5a028] transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-nurvera-text mb-3 tracking-wide group-hover:text-nurvera-olive transition-colors">{benefit.title}</h3>
                  <p className="text-nurvera-text/70 leading-relaxed font-light mb-4">{benefit.desc}</p>
                  <div className="text-nurvera-olive text-sm font-medium flex items-center group-hover:text-[#c5a028] transition-colors">
                    Detaylı İncele <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>

          {/* Badges Section */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="flex flex-wrap justify-center gap-6 mt-20 pt-16 border-t border-black/5"
          >
            {badges.map((badge, index) => (
              <div key={index} className="flex flex-col items-center px-4">
                <div className="w-16 h-16 rounded-full border border-nurvera-olive/20 flex items-center justify-center mb-3">
                  <badge.icon className="w-6 h-6 text-nurvera-olive" />
                </div>
                <span className="text-xs font-bold tracking-widest uppercase text-nurvera-text/60">{badge.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Dinamik Takvim Bölümü */}
      <section className="py-24 bg-[#FAF9F5] relative overflow-hidden border-y border-black/5">
        {/* Çok hafif doğal doku ve yaprak illüstrasyonu (sol üst) */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-nurvera-olive/5 rounded-full blur-[80px] pointer-events-none"></div>
        {/* Yaprak illüstrasyonu (sağ üst) */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4A017]/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="w-full max-w-5xl mx-auto"
          >
            <HacamatCalendar />
          </motion.div>
        </div>
      </section>

      {/* Süreç ve Bilgilendirme */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <h2 className="text-4xl font-serif text-nurvera-text mb-8">Uygulama Süreci</h2>
              <div className="space-y-8">
                {[
                  { title: "Ön Görüşme & Değerlendirme", desc: "Genel sağlık durumunuz uzmanlarımız tarafından incelenir." },
                  { title: "Kişiye Özel Planlama", desc: "Uygulama için en uygun zaman ve bölgeler belirlenir." },
                  { title: "Steril Hazırlık", desc: "Alan temizlenir ve tek kullanımlık materyallerle sterilize edilir." },
                  { title: "Özenli Uygulama", desc: "İşlem büyük bir titizlik ve hijyenik koşullarda tamamlanır." }
                ].map((step, i) => (
                  <div key={i} className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-nurvera-bg border border-nurvera-olive/20 flex items-center justify-center font-serif text-xl text-nurvera-olive shrink-0 mr-6 shadow-sm">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-nurvera-text mb-2">{step.title}</h4>
                      <p className="text-nurvera-text/70 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl"
            >
              {/* Buraya blog için oluşturduğumuz hacamat görselini koyuyoruz */}
              <Image src="/images/hacamat_tarihce_1782115126833.png" alt="NURVERA Hacamat" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
                <h3 className="text-2xl font-serif text-white mb-2">Geleneksel Şifayı Keşfedin</h3>
                <p className="text-white/80">Her detayında doğallık, her ürününde samimiyet ve kaliteyi hissedersiniz.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Uygunluk Alanları (Kırmızı ve Yeşil Kartlar) */}
      <section className="py-24 bg-[#Fdfbf7] border-y border-black/5">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-10">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-nurvera-olive/10"
            >
              <div className="w-16 h-16 rounded-full bg-nurvera-forest/10 flex items-center justify-center mb-8">
                <CheckCircle className="w-8 h-8 text-nurvera-forest" />
              </div>
              <h3 className="text-3xl font-serif text-nurvera-text mb-8">Kimler İçin Uygundur?</h3>
              <ul className="space-y-6">
                {[
                  'Günlük yoğunluk nedeniyle kronik yorgunluk hissedenler',
                  'Boyun, omuz veya sırt bölgesinde tutulma ve gerginlik yaşayanlar',
                  'Geleneksel arınma ve detoks yöntemlerine ilgi duyanlar',
                  'Kişisel değerlendirme sonrası işleme uygun bulunanlar'
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-nurvera-olive mt-2.5 mr-4 shrink-0"></div>
                    <span className="text-nurvera-text/80 text-lg leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="bg-white p-12 rounded-[2.5rem] shadow-sm border-2 border-red-100"
            >
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-8">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-3xl font-serif text-nurvera-text mb-8">Kimler İçin Uygun Değildir?</h3>
              <ul className="space-y-5">
                {[
                  'Hamileler',
                  'Kan sulandırıcı (Antikoagülan) kullananlar',
                  'Hemofili ve kanama bozukluğu olanlar',
                  'İleri derecede kansızlığı (Anemi) olanlar',
                  'Aktif enfeksiyon veya ateşli hastalık geçirenler',
                  'Yeni ameliyat geçiren hastalar'
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-red-400 mt-2.5 mr-4 shrink-0"></div>
                    <span className="text-nurvera-text/80 text-lg leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SSS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif text-nurvera-text mb-4">Aklınıza Takılanlar</h2>
            <p className="text-nurvera-text/70">Uygulama öncesi en çok merak edilen konular.</p>
          </motion.div>
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <Accordion key={index} title={faq.question} content={faq.answer} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modern CTA */}
      <section className="py-32 bg-gradient-to-br from-[#1a3c34] to-[#0f241a] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
        <div className="container mx-auto px-6 max-w-3xl relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <CalendarHeart className="w-20 h-20 text-[#d4af37] mx-auto mb-8 drop-shadow-lg" />
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Şimdi Randevunuzu Alın</h2>
            <p className="text-xl text-white/70 mb-12 font-light">
              Bedeninize yapacağınız en güzel yatırım için doğru zamandasınız.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/randevu" className="px-10 py-5 bg-gradient-to-r from-[#d4af37] to-[#c5a028] text-[#0f241a] rounded-full font-bold tracking-widest uppercase hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                Randevu Oluştur
              </Link>
              <a href="https://wa.me/905354325337" target="_blank" rel="noopener noreferrer" className="px-10 py-5 bg-transparent border-2 border-white/20 text-white rounded-full font-bold tracking-widest uppercase hover:bg-white/10 transition-colors duration-300 backdrop-blur-sm">
                WhatsApp ile Sor
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
