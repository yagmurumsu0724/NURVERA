import React, { useState } from 'react';
import Head from 'next/head';
import { MapPin, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react';

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      question: 'Ürünlerinizde koruyucu madde kullanıyor musunuz?',
      answer: 'Hayır, ürünlerimizin hiçbirinde sentetik koruyucu, parfüm veya boya kullanmıyoruz. Sadece %100 saf bitki distilatlarından oluşmaktadır.'
    },
    {
      question: 'Kargo süreniz nedir?',
      answer: 'Siparişleriniz genellikle 1-2 iş günü içerisinde kargoya teslim edilmektedir. Doğal içeriğin bozulmaması için sıcak hava dalgalarında gönderim planlaması yapabiliyoruz.'
    },
    {
      question: 'Hangi kargo şirketiyle çalışıyorsunuz?',
      answer: 'Özenle paketlediğimiz cam şişelerin size güvenle ulaşması için Yurtiçi Kargo ile çalışıyoruz.'
    },
    {
      question: 'İade kabul ediyor musunuz?',
      answer: 'Hijyen ve sağlık kuralları gereği açılmış ve kullanılmış ürünlerde iade kabul edemiyoruz. Ancak kargoda hasar gören ürünler için aynı gün bizimle iletişime geçebilirsiniz.'
    },
    {
      question: 'Hidrosolleri nasıl saklamalıyım?',
      answer: 'Ürünlerimiz koruyucu içermediği için güneş ışığından uzak, serin ve karanlık bir yerde (tercihen buzdolabında) saklanmasını tavsiye ediyoruz.'
    }
  ];

  return (
    <>
      <Head>
        <title>İletişim & S.S.S | NURVERA</title>
      </Head>

      <div className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-nurvera-text mb-6">Bize Ulaşın</h1>
            <p className="text-lg text-nurvera-text/70">
              Sorularınız, önerileriniz veya toptan sipariş talepleriniz için buradayız. Sizinle iletişimde olmak bizi mutlu eder.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Sol Taraf: İletişim Bilgileri & Form */}
            <div className="w-full lg:w-1/2 space-y-12">
              
              <div className="bg-nurvera-bg p-8 rounded-2xl">
                <h2 className="font-serif text-2xl font-bold text-nurvera-text mb-6">İletişim Bilgilerimiz</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-nurvera-olive shrink-0 shadow-sm mr-4">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-nurvera-text">Adres</h4>
                      <p className="text-nurvera-text/70 mt-1">Bahçeli Evler Mahallesi, Yasemin Sokak No: 6, Çelikhan, Adıyaman</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-nurvera-olive shrink-0 shadow-sm mr-4">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-nurvera-text">Telefon / WhatsApp</h4>
                      <p className="text-nurvera-text/70 mt-1">0535 432 53 37</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-nurvera-olive shrink-0 shadow-sm mr-4">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-nurvera-text">E-Posta</h4>
                      <p className="text-nurvera-text/70 mt-1">nurveradogalyasam@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-nurvera-text mb-6">Mesaj Gönderin</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-nurvera-text/80 mb-1">Adınız Soyadınız</label>
                      <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-nurvera-olive/50 focus:border-nurvera-olive transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-nurvera-text/80 mb-1">E-Posta Adresiniz</label>
                      <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-nurvera-olive/50 focus:border-nurvera-olive transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nurvera-text/80 mb-1">Konu</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-nurvera-olive/50 focus:border-nurvera-olive transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nurvera-text/80 mb-1">Mesajınız</label>
                    <textarea rows="5" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-nurvera-olive/50 focus:border-nurvera-olive transition-all resize-none"></textarea>
                  </div>
                  <button type="button" className="w-full bg-nurvera-olive text-white font-medium rounded-lg px-6 py-4 hover:bg-[#4a5e29] transition-colors shadow-md">
                    Mesajı Gönder
                  </button>
                </form>
              </div>

            </div>

            {/* Sağ Taraf: SSS */}
            <div className="w-full lg:w-1/2">
              <h2 className="font-serif text-3xl font-bold text-nurvera-text mb-8">Sıkça Sorulan Sorular</h2>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div 
                    key={index} 
                    className="border border-nurvera-beige/50 rounded-xl overflow-hidden bg-white hover:border-nurvera-olive/30 transition-colors"
                  >
                    <button 
                      className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
                      onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    >
                      <span className="font-medium text-nurvera-text pr-4">{faq.question}</span>
                      {openFaq === index ? (
                        <ChevronUp className="text-nurvera-olive shrink-0" size={20} />
                      ) : (
                        <ChevronDown className="text-nurvera-text/40 shrink-0" size={20} />
                      )}
                    </button>
                    
                    <div 
                      className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                        openFaq === index ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <p className="text-nurvera-text/70 text-sm leading-relaxed border-t border-gray-100 pt-4">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 bg-nurvera-beige/20 border border-nurvera-beige p-6 rounded-xl text-center">
                <p className="font-serif text-lg text-nurvera-text mb-2">Cevabını Bulamadınız mı?</p>
                <p className="text-sm text-nurvera-text/70 mb-4">Müşteri temsilcilerimiz size yardım etmek için hazır.</p>
                <a href="https://wa.me/905354325337" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 bg-[#25D366] text-white font-medium rounded-lg hover:bg-[#20b858] transition-colors shadow-sm">
                  WhatsApp'tan Yazın
                </a>
              </div>

            </div>

          </div>

        </div>
      </div>
    </>
  );
}
