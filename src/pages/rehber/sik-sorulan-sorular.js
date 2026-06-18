import React, { useState } from 'react';
import Head from 'next/head';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

export default function SikSorulanSorular() {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      question: 'Siparişim ne zaman kargoya verilir?',
      answer: 'Siparişleriniz, doğallığını koruyacak şekilde özel olarak paketlenir ve genellikle 1-2 iş günü içerisinde kargo firmasına teslim edilir. Teslimat sırasında size SMS ve e-posta ile takip numarası iletilecektir.'
    },
    {
      question: 'İade süresi kaç gündür?',
      answer: 'Siparişinizi teslim aldığınız tarihten itibaren 14 gün içerisinde iade talebi oluşturabilirsiniz. Ancak hijyen kuralları gereği, koruma bandı açılmış veya kullanılmış ürünlerin iadesi yapılamamaktadır.'
    },
    {
      question: 'Ürünleri açtıktan sonra iade edebilir miyim?',
      answer: 'Hayır. Kozmetik ve kişisel bakım ürünlerinde hijyen ve sağlık standartları gereği, ambalajı veya koruma bandı açılmış, kullanılmış ürünlerin iadesi yasal olarak mümkün değildir.'
    },
    {
      question: 'Kart bilgilerim sisteminize kaydediliyor mu?',
      answer: 'Kesinlikle hayır. Kart bilgileriniz hiçbir şekilde sunucularımızda saklanmaz. Ödeme adımında girdiğiniz veriler, 256-bit SSL şifreleme teknolojisi ile doğrudan BDDK onaylı güvenli ödeme kuruluşuna iletilir.'
    },
    {
      question: 'Kargo ücretiniz var mı?',
      answer: 'Belirli bir sipariş tutarının (Örn: 500 ₺) üzerindeki alışverişlerinizde kargo ücretsizdir. Bu tutarın altındaki siparişlerde standart kargo ücreti ödeme ekranında şeffaf bir şekilde sepetinize eklenir.'
    },
    {
      question: 'Ürünleriniz gerçekten %100 doğal mı?',
      answer: 'Evet. NURVERA ürünlerinin tamamı bitkilerin saf distilasyonu veya maserasyonu ile elde edilir. İçerisinde sentetik koruyucu, parfüm, boya veya kimyasal katkı maddesi bulunmaz.'
    },
    {
      question: 'Ürünleri nasıl saklamalıyım?',
      answer: 'İçerisinde koruyucu bulunmadığı için ürünlerimizi doğrudan güneş ışığı almayan, serin ve karanlık ortamlarda saklamanızı öneririz. Hidrosolleri yaz aylarında buzdolabında saklamak raf ömrünü uzatır.'
    },
    {
      question: 'Toplu sipariş veya toptan alım yapabilir miyim?',
      answer: 'Evet, kurumsal talepleriniz ve toptan alım ihtiyaçlarınız için doğrudan "İletişim" sayfamız üzerinden bize ulaşabilir, destek ekibimizle görüşebilirsiniz.'
    }
  ];

  return (
    <div className="bg-[#FCFBF9] min-h-screen py-20">
      <Head>
        <title>Sık Sorulan Sorular | NURVERA</title>
      </Head>
      
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-nurvera-olive/10 text-nurvera-forest rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle size={32} strokeWidth={1.5} />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-nurvera-text font-bold mb-6">Sık Sorulan Sorular</h1>
          <p className="text-lg text-nurvera-text/70 max-w-2xl mx-auto leading-relaxed">
            Aklınıza takılan soruların yanıtlarını sizin için bir araya getirdik. Cevabını bulamadığınız her konu için bize ulaşabilirsiniz.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-gray-100 rounded-2xl overflow-hidden bg-white hover:border-nurvera-olive/30 transition-colors"
              >
                <button 
                  className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                >
                  <span className="font-medium text-nurvera-text pr-4">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="text-nurvera-olive shrink-0" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-400 shrink-0" size={20} />
                  )}
                </button>
                
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaq === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-nurvera-text/70 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-[#F5F7F3] p-8 rounded-2xl text-center">
            <h3 className="font-serif text-xl font-bold text-nurvera-text mb-3">Burada aradığınızı bulamadınız mı?</h3>
            <p className="text-nurvera-text/70 text-sm leading-relaxed mb-6 max-w-lg mx-auto">
              Destek ekibimiz hafta içi 09:00 - 18:00 saatleri arasında size yardımcı olmak için hazır.
            </p>
            <Link href="/iletisim" className="inline-block px-8 py-3 bg-nurvera-olive text-white rounded-xl font-medium hover:bg-[#4a5e29] transition-colors shadow-sm">
              İletişime Geçin
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
