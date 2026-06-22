// src/pages/api/send-sms.js
// Bu servis, kullanıcının girdiği numaraya SMS gönderilmesini simüle veya entegre eder.

// Bellek üzerinde basit bir OTP deposu (Gerçek uygulamalarda Redis veya Veritabanı kullanılmalıdır)
global.otpStore = global.otpStore || {};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: 'Telefon numarası gereklidir.' });
  }

  // Rastgele 4 haneli kod üretimi
  const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
  
  // Kodu bellekte 5 dakikalığına sakla (Telefon numarası anahtar kelime olarak)
  global.otpStore[phone] = {
    code: otpCode,
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 dakika geçerli
  };

  const messageText = `NURVERA randevu dogrulama kodunuz: ${otpCode}. Bizi tercih ettiginiz icin tesekkur ederiz.`;

  // GELİŞTİRİCİ İÇİN: Kodu konsola yazdırıyoruz ki terminalden görüp test edilebilsin
  console.log(`\n===========================================`);
  console.log(`[SMS SIMULASYONU] Alıcı: ${phone}`);
  console.log(`[SMS SIMULASYONU] Mesaj: ${messageText}`);
  console.log(`[SMS SIMULASYONU] Kod: ${otpCode}`);
  console.log(`===========================================\n`);

  try {
    // GERÇEK SMS ENTEGRASYONU (Örnek Netgsm Altyapısı)
    // Eğer .env dosyasında SMS_API_USER tanımlıysa gerçekten SMS atar
    if (process.env.SMS_API_USER && process.env.SMS_API_PASSWORD) {
      
      /* NetGSM Örnek XML İsteği
      const xmlData = \`<?xml version="1.0" encoding="UTF-8"?>
      <mainbody>
        <header>
          <company>Netgsm</company>
          <usercode>\${process.env.SMS_API_USER}</usercode>
          <password>\${process.env.SMS_API_PASSWORD}</password>
          <msgheader>\${process.env.SMS_SENDER_TITLE}</msgheader>
        </header>
        <body>
          <msg><![CDATA[\${messageText}]]></msg>
          <no>\${phone.replace(/\\D/g, '')}</no>
        </body>
      </mainbody>\`;

      await fetch('https://api.netgsm.com.tr/sms/send/xml', {
        method: 'POST',
        headers: { 'Content-Type': 'application/xml' },
        body: xmlData
      });
      */
      
      // Şimdilik sadece başarılı yanıt dönüyoruz.
    }

    // Her halükarda başarılı döner (Test edilebilmesi için)
    return res.status(200).json({ 
      success: true, 
      message: 'Doğrulama kodu başarıyla gönderildi.',
      // development ortamında kolay test için kodu frontend'e gönderebilirsiniz, prod'da kapatın
      testCode: process.env.NODE_ENV === 'development' ? otpCode : undefined
    });

  } catch (error) {
    console.error('SMS Gönderme Hatası:', error);
    return res.status(500).json({ success: false, message: 'SMS gönderilirken bir hata oluştu.' });
  }
}
