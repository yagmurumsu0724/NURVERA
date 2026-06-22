import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { CalendarHeart, CheckCircle2, AlertCircle, Smartphone, Lock, ShieldAlert, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function RandevuPage() {
  const router = useRouter();
  const { date: initialDate } = router.query;

  const [step, setStep] = useState(1); // 1: Form, 2: SMS Doğrulama, 3: Başarılı
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    date: '',
    timePreference: '',
    healthNote: '',
    note: '',
    kvkk: false,
    womenOnly: false
  });
  const [smsCode, setSmsCode] = useState(['', '', '', '']);
  const [smsError, setSmsError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [minDate, setMinDate] = useState('');
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [expectedSmsCode, setExpectedSmsCode] = useState(''); // Sadece test amaçlı göstermek için

  // Saat aralıkları
  const timeSlots = [
    '09:00 - 10:00',
    '10:30 - 11:30',
    '12:00 - 13:00',
    '14:00 - 15:00',
    '15:30 - 16:30',
    '17:00 - 18:00'
  ];

  useEffect(() => {
    // Yarının tarihini hesapla (En erken randevu yarına alınabilir)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    const minD = `${yyyy}-${mm}-${dd}`;
    setMinDate(minD);

    // URL'den gelen tarihi ayarla
    if (initialDate && initialDate >= minD) {
      setFormData(prev => ({ ...prev, date: initialDate }));
    } else if (initialDate) {
      // Eğer geçmiş bir tarihse bugüne (veya yarına) yuvarlamıyoruz, boş bırakıyoruz
      console.warn("Seçilen tarih geçmiş veya geçersiz.");
    }
  }, [initialDate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Saat veya tarih değişirse hatayı temizle
    if (name === 'timePreference' || name === 'date') {
      setTimeError('');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Dolu saat simülasyonu (Örnek: Her gün 14:00 ve 10:30 dolu kabul edilsin)
    if (formData.timePreference === '14:00 - 15:00' || formData.timePreference === '10:30 - 11:30') {
      setTimeError('Seçtiğiniz saat dilimi doludur. Lütfen başka bir saat seçiniz.');
      return;
    }

    setIsSendingSms(true);
    
    try {
      const res = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        if (data.testCode) {
          setExpectedSmsCode(data.testCode); // Sadece Development ortamı için (Ekranda göstermek adına)
        }
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert(data.message || 'SMS gönderilirken bir hata oluştu.');
      }
    } catch (error) {
      alert('Sunucuya bağlanılamadı.');
    } finally {
      setIsSendingSms(false);
    }
  };

  const handleSmsChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newCode = [...smsCode];
    newCode[index] = value;
    setSmsCode(newCode);

    // Otomatik odaklanma
    if (value !== '' && index < 3) {
      document.getElementById(`sms-${index + 1}`).focus();
    }
  };

  const handleSmsSubmit = async (e) => {
    e.preventDefault();
    const code = smsCode.join('');
    
    setIsVerifying(true);
    setSmsError('');

    try {
      const res = await fetch('/api/verify-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, code })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setSmsError(data.message || 'Hatalı doğrulama kodu.');
        setSmsCode(['', '', '', '']); // Kutuları temizle
        document.getElementById(`sms-0`).focus();
      }
    } catch (error) {
      setSmsError('Sunucuya bağlanılamadı.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <Head>
        <title>Randevu Al | NURVERA Geleneksel Uygulamalar</title>
        <meta name="description" content="NURVERA Hacamat ve Sülük uygulamaları sadece kadınlara özeldir. Randevu talebinizi hemen oluşturun." />
      </Head>

      <section className="min-h-screen pt-32 pb-20 bg-nurvera-bg">
        <div className="container mx-auto px-6 max-w-3xl">
          
          <div className="text-center mb-12">
            <CalendarHeart className="w-16 h-16 text-nurvera-olive mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-serif text-nurvera-text mb-4">Randevu Talebi</h1>
            <p className="text-nurvera-text/80 text-lg">
              Size en uygun zamanı planlamak ve ön değerlendirme yapmak için lütfen aşağıdaki formu doldurun.
            </p>
          </div>

          {step === 1 && (
            <form onSubmit={handleFormSubmit} className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-black/5">
              
              <div className="bg-red-50 p-6 rounded-xl border border-red-100 mb-8 flex items-start">
                <ShieldAlert className="w-6 h-6 text-red-500 mr-4 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-800 mb-1">Kadınlara Özel Hizmet</h3>
                  <p className="text-sm text-red-700 leading-relaxed">
                    NURVERA bünyesindeki Hacamat ve Sülük uygulamaları <strong className="font-bold">SADECE KADINLARA</strong> özel olarak hizmet vermektedir. Erkek danışan kabul edilmemektedir.
                  </p>
                </div>
              </div>

              <div className="bg-nurvera-bg/50 p-6 rounded-xl border border-nurvera-olive/20 mb-8 flex items-start">
                <AlertCircle className="w-6 h-6 text-nurvera-olive mr-4 shrink-0 mt-0.5" />
                <p className="text-sm text-nurvera-text/80 leading-relaxed">
                  Randevunuz, <strong className="font-bold">SMS doğrulaması</strong> ve sağlık durumunuzun değerlendirilmesi sonrasında kesinleştirilecektir. Lütfen bilgilerinizi eksiksiz giriniz.
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-nurvera-text mb-2">Adınız Soyadınız *</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-nurvera-olive focus:ring-1 focus:ring-nurvera-olive outline-none transition-colors bg-gray-50/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-nurvera-text mb-2">Telefon Numaranız *</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      required
                      pattern="[0-9]*"
                      placeholder="Örn: 05321234567"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-nurvera-olive focus:ring-1 focus:ring-nurvera-olive outline-none transition-colors bg-gray-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-nurvera-text mb-2">Tercih Edilen Hizmet *</label>
                  <select 
                    id="service" 
                    name="service" 
                    required
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-nurvera-olive focus:ring-1 focus:ring-nurvera-olive outline-none transition-colors bg-gray-50/50 appearance-none"
                  >
                    <option value="" disabled>Lütfen seçiniz</option>
                    <option value="hacamat">Hacamat Uygulaması</option>
                    <option value="suluk">Sülük Uygulaması</option>
                    <option value="ikisi">Hacamat ve Sülük Birlikte</option>
                    <option value="danisma">Sadece Ön Görüşme</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-nurvera-text mb-2">Randevu Tarihi *</label>
                    <input 
                      type="date" 
                      id="date" 
                      name="date" 
                      required
                      min={minDate}
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-nurvera-olive focus:ring-1 focus:ring-nurvera-olive outline-none transition-colors bg-gray-50/50"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">En erken yarına randevu alınabilir.</p>
                  </div>
                  <div>
                    <label htmlFor="timePreference" className="block text-sm font-medium text-nurvera-text mb-2">Randevu Saati *</label>
                    <select 
                      id="timePreference" 
                      name="timePreference" 
                      required
                      value={formData.timePreference}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border focus:outline-none transition-colors appearance-none ${timeError ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:border-nurvera-olive focus:ring-1 focus:ring-nurvera-olive bg-gray-50/50'}`}
                    >
                      <option value="" disabled>Saat Seçiniz</option>
                      {timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                    {timeError && <p className="text-sm text-red-500 mt-2 font-medium">{timeError}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="healthNote" className="block text-sm font-medium text-nurvera-text mb-2">Sağlık Notu (Kronik hastalıklar, kan sulandırıcı kullanımı vb.) *</label>
                  <textarea 
                    id="healthNote" 
                    name="healthNote" 
                    rows="3"
                    required
                    placeholder="Lütfen varsa sağlık sorunlarınızı ve kullandığınız ilaçları belirtin. Yoksa 'Yok' yazabilirsiniz."
                    value={formData.healthNote}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-nurvera-olive focus:ring-1 focus:ring-nurvera-olive outline-none transition-colors bg-gray-50/50 resize-none"
                  ></textarea>
                </div>

                <div className="flex items-start mt-8 pt-4 border-t border-gray-100">
                  <input 
                    type="checkbox" 
                    id="womenOnly" 
                    name="womenOnly" 
                    required
                    checked={formData.womenOnly}
                    onChange={handleChange}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-nurvera-olive focus:ring-nurvera-olive"
                  />
                  <label htmlFor="womenOnly" className="ml-3 text-sm font-medium text-nurvera-text">
                    Uygulamaların SADECE KADINLARA ÖZEL olduğunu anladım ve kabul ediyorum. *
                  </label>
                </div>

                <div className="flex items-start mt-4">
                  <input 
                    type="checkbox" 
                    id="kvkk" 
                    name="kvkk" 
                    required
                    checked={formData.kvkk}
                    onChange={handleChange}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-nurvera-olive focus:ring-nurvera-olive"
                  />
                  <label htmlFor="kvkk" className="ml-3 text-sm text-nurvera-text/70">
                    Kişisel verilerimin randevu oluşturma ve sağlık değerlendirmesi amacıyla işlenmesini ve <Link href="/rehber/gizlilik-ve-guvenlik" className="underline hover:text-nurvera-olive">Aydınlatma Metni</Link>'ni okuyup anladığımı kabul ediyorum. *
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-4 mt-6 bg-nurvera-forest text-white rounded-xl font-medium tracking-wide hover:bg-nurvera-olive transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center"
                  disabled={!formData.kvkk || !formData.womenOnly || isSendingSms}
                >
                  {isSendingSms ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> SMS Gönderiliyor...</>
                  ) : (
                    "Devam Et (SMS Doğrulaması)"
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="bg-white p-8 md:p-16 rounded-3xl shadow-sm border border-black/5 text-center max-w-lg mx-auto">
              <div className="w-20 h-20 bg-nurvera-bg rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-10 h-10 text-nurvera-olive" />
              </div>
              <h2 className="text-2xl font-serif text-nurvera-text mb-4">Gerçek SMS Doğrulama</h2>
              <p className="text-nurvera-text/80 leading-relaxed mb-4">
                <strong className="font-bold text-nurvera-text">{formData.phone}</strong> numaralı telefonunuza API üzerinden gönderilen 4 haneli doğrulama kodunu giriniz.
              </p>
              
              {expectedSmsCode && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl mb-6 text-sm">
                  <strong>Geliştirici Modu Aktif:</strong> Telefonunuza giden kodu simüle etmek için <code>{expectedSmsCode}</code> değerini giriniz. (Canlıda bu uyarı gizlenir).
                </div>
              )}
              
              <form onSubmit={handleSmsSubmit}>
                <div className="flex justify-center gap-4 mb-8">
                  {[0, 1, 2, 3].map((index) => (
                    <input
                      key={index}
                      id={`sms-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      required
                      value={smsCode[index]}
                      onChange={(e) => handleSmsChange(index, e.target.value)}
                      className="w-14 h-14 text-center text-2xl font-bold rounded-xl border border-gray-300 focus:border-nurvera-olive focus:ring-2 focus:ring-nurvera-olive/20 outline-none transition-all"
                    />
                  ))}
                </div>

                {smsError && (
                  <p className="text-red-500 text-sm mb-6 bg-red-50 py-2 rounded-lg">{smsError}</p>
                )}

                <button 
                  type="submit" 
                  className="w-full py-4 bg-nurvera-forest text-white rounded-xl font-medium tracking-wide hover:bg-nurvera-olive transition-colors shadow-sm flex justify-center items-center disabled:opacity-50"
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                     <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Doğrulanıyor...</>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Doğrula ve Randevuyu Onayla
                    </>
                  )}
                </button>
                
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="mt-6 text-sm text-nurvera-text/60 hover:text-nurvera-olive underline transition-colors"
                >
                  Numarayı veya bilgileri değiştirmek için geri dön
                </button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white p-12 rounded-3xl shadow-sm text-center border border-nurvera-olive/20">
              <div className="w-20 h-20 bg-nurvera-forest/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-nurvera-forest" />
              </div>
              <h2 className="text-3xl font-serif text-nurvera-text mb-4">Randevunuz Onaylandı</h2>
              <p className="text-nurvera-text/80 leading-relaxed mb-6 text-lg">
                Sayın {formData.name}, randevu talebiniz başarıyla alınmış ve <strong className="text-nurvera-text">telefon numaranız doğrulanmıştır</strong>.
              </p>
              <div className="bg-nurvera-bg p-6 rounded-xl text-left max-w-sm mx-auto mb-8 border border-black/5">
                <p className="mb-2"><strong className="text-nurvera-text">Tarih:</strong> <span className="text-nurvera-text/80">{formData.date}</span></p>
                <p className="mb-2"><strong className="text-nurvera-text">Saat:</strong> <span className="text-nurvera-text/80">{formData.timePreference}</span></p>
                <p><strong className="text-nurvera-text">Hizmet:</strong> <span className="text-nurvera-text/80">{formData.service.toUpperCase()}</span></p>
              </div>
              <p className="text-nurvera-text/70 mb-8 text-sm">
                * Sağlık durumunuz uzmanlarımız tarafından incelenecek ve size özel hazırlık detayları SMS/WhatsApp ile iletilecektir.
              </p>
              <Link href="/" className="inline-block px-8 py-4 bg-nurvera-forest text-white rounded-xl font-medium tracking-wide hover:bg-nurvera-olive transition-colors">
                Ana Sayfaya Dön
              </Link>
            </div>
          )}

        </div>
      </section>
    </>
  );
}
