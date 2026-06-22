import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Accordion from '@/components/ui/Accordion';
import { 
  CheckCircle2, XCircle, ShieldCheck, Activity, Info, 
  CalendarHeart, Droplet, Zap, Shield, HeartPulse, Sparkles, CheckCircle
} from 'lucide-react';

export default function SulukPage() {
  const faqs = [
    {
      question: "Sülük uygulaması acı verir mi?",
      answer: "İlk tutunma anında hafif bir iğne batması veya sinek ısırığı gibi bir his oluşabilir. Sülüğün salgıladığı doğal enzimler sayesinde bu his kısa sürede geçer ve işlem ağrısız devam eder."
    },
    {
      question: "Kaç dakika sürer?",
      answer: "Sülüklerin kendiliğinden bırakması beklenir, bu süre ortalama 45 dakika ile 1.5 saat arasında değişebilir. Kişiye ve bölgeye göre farklılık gösterir."
    },
    {
      question: "Herkes için uygun mudur?",
      answer: "Hayır. Kan sulandırıcı kullananlar, hamileler, hemofili hastaları, ciddi kansızlık ve enfeksiyon durumu olanlar için kesinlikle uygun değildir. Ön değerlendirme şarttır."
    },
    {
      question: "Sonrasında iz kalır mı?",
      answer: "Uygulama bölgesinde ufak bir y-şekilli iz veya hafif kızarıklık oluşabilir. Genellikle zamanla silikleşir ancak kişinin cilt yapısına göre hafif bir iz kalma ihtimali vardır."
    },
    {
      question: "Aynı gün günlük hayata dönülür mü?",
      answer: "İşlem sonrası vücudun dinlendirilmesi ve kanamanın kontrolü açısından ağır fiziksel aktivitelerden kaçınılmalı, dinlenmeye vakit ayrılmalıdır."
    }
  ];

  const benefits = [
    { icon: Droplet, title: "DOĞAL ENZİM MUCİZESİ", desc: "Sülüklerin salgıladığı yüze yakın biyoaktif enzim vücuda şifa dağıtır." },
    { icon: Activity, title: "DOLAŞIM DÜZENLEYİCİ", desc: "Bölgesel kan akışını hızlandırarak dokuların beslenmesini artırır." },
    { icon: Shield, title: "DOĞAL ANTİ-ENFLAMATUAR", desc: "İltihap giderici enzimler sayesinde vücuttaki şişlikleri ve ödemi azaltır." },
    { icon: Zap, title: "AĞRI KESİCİ ETKİ", desc: "İçerdiği doğal anestezik maddelerle kas ve eklem ağrılarını hafifletir." },
    { icon: HeartPulse, title: "DAMAR SAĞLIĞI", desc: "Kanın akışkanlığını artırarak damar tıkanıklığı riskini destekleyici şekilde azaltır." },
    { icon: Sparkles, title: "HÜCRE YENİLENMESİ", desc: "Bozulan dokuların hızla onarılmasına ve hücrelerin yenilenmesine katkıda bulunur." }
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
        <title>NURVERA Sülük Uygulamaları | Tıbbi Sülüklerle Gelen Şifa</title>
        <meta name="description" content="Tıbbi sülüklerin doğal enzimleri ile bedeninize şifa katın. NURVERA'da steril, tek kullanımlık ve profesyonel sülük uygulamaları." />
      </Head>

      {/* Premium Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden bg-gradient-to-br from-[#0f241a] via-[#1a3c34] to-[#1a3128]">
        {/* Dekoratif Arkaplan Işıkları */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#8b9b8b]/20 blur-[120px] rounded-full mix-blend-screen"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#d4af37]/10 blur-[150px] rounded-full mix-blend-screen"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="inline-flex flex-col items-center mb-8"
          >
            <div className="w-16 h-16 border border-[#d4af37]/30 rounded-full flex items-center justify-center mb-4 bg-[#d4af37]/5 backdrop-blur-sm">
              <Droplet className="w-8 h-8 text-[#d4af37]" />
            </div>
            <span className="text-[#d4af37] tracking-[0.3em] text-sm uppercase font-semibold mb-2">NURVERA HİRUDOTERAPİ</span>
            <span className="text-white/60 tracking-widest text-xs uppercase">Doğanın Biyo-Laboratuvarı</span>
          </motion.div>

          <motion.h1 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 drop-shadow-lg"
          >
            SÜLÜK UYGULAMASI
          </motion.h1>
          
          <motion.div 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="flex items-center justify-center gap-4 mb-8 text-[#d4af37] font-medium tracking-widest text-sm md:text-base uppercase"
          >
            <span>Doğal Enzim</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
            <span>Hücre Yenilenmesi</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
            <span>Derin Şifa</span>
          </motion.div>

          <motion.p 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-12 font-light"
          >
            Sadece tıbbi amaçlı kontrollü sülükler ve tamamen steril tek kullanımlık materyallerle doğanın en mucizevi enzimlerini bedeninizle buluşturuyoruz.
          </motion.p>

          <motion.div 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <Link href="/randevu" className="group relative px-10 py-5 bg-gradient-to-r from-[#d4af37] to-[#c5a028] text-[#0f241a] rounded-full font-bold tracking-widest uppercase overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.3)] transition-all hover:scale-105">
              <span className="relative z-10">Randevu Talep Et</span>
              <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-500"></div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Sülük Uygulaması Enzim Faydaları */}
      <section className="py-24 bg-[#Fdfbf7] relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-nurvera-forest/5 rounded-full blur-[100px]"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-center max-w-4xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-nurvera-text mb-6">Mucizevi Enzimlerin Gücü</h2>
            <p className="text-xl text-nurvera-text/70 leading-relaxed font-light">
              Sanılanın aksine sülük uygulaması sadece "pis kanı" almak değildir. Asıl mucize, sülüğün kan emerken bedene zerk ettiği 100'den fazla biyoaktif, tedavi edici enzimdir.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index} variants={fadeInUp}
                className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-nurvera-olive/10 hover:-translate-y-2 transition-transform duration-500 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/10 flex items-center justify-center mb-6 group-hover:bg-nurvera-forest transition-colors">
                  <benefit.icon className="w-7 h-7 text-[#c5a028] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-nurvera-text mb-3 tracking-wide">{benefit.title}</h3>
                <p className="text-nurvera-text/70 leading-relaxed font-light">{benefit.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Süreç ve Bilgilendirme */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center flex-row-reverse">
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl lg:order-2"
            >
              <Image src="/images/suluk_nasil_calisir_1782115135637.png" alt="NURVERA Sülük Uygulaması" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-nurvera-forest/90 via-nurvera-forest/20 to-transparent flex flex-col justify-end p-10">
                <ShieldCheck className="w-12 h-12 text-[#d4af37] mb-4" />
                <h3 className="text-3xl font-serif text-white mb-2">Tamamen Steril, Sadece Size Özel</h3>
                <p className="text-white/80">Kullanılan tüm tıbbi sülükler tek kullanımlıktır ve işlem sonrasında tıbbi atık prosedürüyle imha edilir.</p>
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="lg:order-1">
              <span className="text-[#c5a028] font-bold tracking-widest text-sm uppercase mb-4 block">GÜVENLİ ADIMLAR</span>
              <h2 className="text-4xl font-serif text-nurvera-text mb-8">Uygulama Nasıl Planlanır?</h2>
              
              <div className="space-y-8">
                {[
                  { title: "Detaylı Ön Görüşme", desc: "Kan değerleriniz ve kullandığınız ilaçlar detaylıca analiz edilir." },
                  { title: "Bölge Analizi", desc: "Şikayetlerinize göre sülüklerin yerleştirileceği akupunktur noktaları seçilir." },
                  { title: "Ağrısız Tutunma", desc: "Sülüğün salgıladığı doğal lokal anestezi sayesinde işlem ağrısız devam eder." },
                  { title: "Doğal Bitiş", desc: "Sülükler doyduklarında kendiliklerinden bırakırlar. Zorla koparma yapılmaz." },
                  { title: "Sıkı Pansuman", desc: "Enzimlerin etkisiyle kanama bir süre devam edeceği için bölge sıkıca sarılır." }
                ].map((step, i) => (
                  <div key={i} className="flex items-start group">
                    <div className="w-12 h-12 rounded-full bg-nurvera-bg border border-[#d4af37]/30 flex items-center justify-center font-serif text-xl text-[#c5a028] shrink-0 mr-6 shadow-sm group-hover:bg-[#d4af37] group-hover:text-white transition-colors">
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
          </div>
        </div>
      </section>

      {/* Uygunluk Alanları (Kırmızı ve Yeşil Kartlar) */}
      <section className="py-24 bg-nurvera-bg border-y border-black/5">
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
                  'Bölgesel kan dolaşımı problemi hissedenler',
                  'Kas ve eklemlerde kronik ağrı veya hassasiyet yaşayanlar',
                  'Geleneksel şifa yöntemleriyle bağışıklığını desteklemek isteyenler',
                  'Ön değerlendirme testlerinden başarıyla geçenler'
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
                  'Kan sulandırıcı ilaç kullananlar (Kesin Kontrendikasyon)',
                  'Hamile ve emziren anneler',
                  'Hemofili (Kanama durmama) hastalığı olanlar',
                  'İleri derecede Anemi (Kansızlık) olanlar',
                  'Aktif enfeksiyonu ve ateşi olanlar',
                  'Menstrüasyon (Adet) döneminde olan kadınlar'
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

      {/* Dikkat Edilecekler (Yan yana Kartlar) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif text-nurvera-text mb-4">Öncesi ve Sonrası</h2>
            <p className="text-nurvera-text/70 text-lg">Uygulamanın şifaya dönüşmesi için uymanız gereken çok basit kurallar.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="bg-gradient-to-br from-[#Fdfbf7] to-[#f4ecd8] p-10 rounded-[2rem] border border-[#d4af37]/20"
            >
              <h3 className="text-2xl font-serif text-nurvera-text mb-6 flex items-center">
                <Info className="w-6 h-6 text-[#c5a028] mr-3" /> Öncesinde Dikkat
              </h3>
              <ul className="space-y-4">
                {[
                  'Kullandığınız tüm ilaçları uzmanınıza eksiksiz bildirin.',
                  'Uygulama günü parfüm, deodorant veya kokulu losyon sürmeyin (Sülükler kokuya hassastır).',
                  'İşlemden önce hafif bir yemek yiyin, asla tamamen aç gelmeyin.',
                  'Bölgeyi sıkmayacak, bol ve rahat kıyafetler tercih edin.'
                ].map((item, i) => (
                  <li key={i} className="text-nurvera-text/80 flex items-start leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#c5a028] mt-2.5 mr-3 shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="bg-nurvera-forest/5 p-10 rounded-[2rem] border border-nurvera-olive/20"
            >
              <h3 className="text-2xl font-serif text-nurvera-text mb-6 flex items-center">
                <CheckCircle2 className="w-6 h-6 text-nurvera-forest mr-3" /> Sonrasında Dikkat
              </h3>
              <ul className="space-y-4">
                {[
                  'Uygulama sonrası yapılan sıkı pansumanı en az 12 saat açmayın.',
                  'Enzimlerin etkisiyle hafif kanama sızıntısı 24 saate kadar normaldir.',
                  'İlk gün kesinlikle banyo yapmayın, bölgeye su değdirmeyin.',
                  'Bol su için ve ilk 24 saat ağır fiziksel egzersizden kaçının.'
                ].map((item, i) => (
                  <li key={i} className="text-nurvera-text/80 flex items-start leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-nurvera-forest mt-2.5 mr-3 shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SSS */}
      <section className="py-24 bg-[#Fdfbf7] border-t border-black/5">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif text-nurvera-text mb-4">Sık Sorulan Sorular</h2>
          </motion.div>
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="bg-white p-8 rounded-3xl shadow-sm border border-black/5"
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
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Sizin İçin Uygun Mu?</h2>
            <p className="text-xl text-white/70 mb-12 font-light">
              Sülük uygulaması hakkında detaylı bilgi almak ve size uygunluğunu ücretsiz değerlendirmek için randevu oluşturun.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/randevu" className="px-10 py-5 bg-gradient-to-r from-[#d4af37] to-[#c5a028] text-[#0f241a] rounded-full font-bold tracking-widest uppercase hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                Randevu Talep Et
              </Link>
              <a href="https://wa.me/905354325337" target="_blank" rel="noopener noreferrer" className="px-10 py-5 bg-transparent border-2 border-white/20 text-white rounded-full font-bold tracking-widest uppercase hover:bg-white/10 transition-colors duration-300 backdrop-blur-sm">
                WhatsApp ile Danış
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
