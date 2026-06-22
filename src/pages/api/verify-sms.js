// src/pages/api/verify-sms.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ success: false, message: 'Telefon numarası ve kod gereklidir.' });
  }

  // send-sms.js'de tanımladığımız bellek (global nesnesi) üzerinden kontrol
  const storedData = global.otpStore ? global.otpStore[phone] : null;

  if (!storedData) {
    return res.status(400).json({ success: false, message: 'Bu numara için oluşturulmuş bir doğrulama kodu bulunamadı veya süresi dolmuş.' });
  }

  // Süre kontrolü
  if (Date.now() > storedData.expiresAt) {
    delete global.otpStore[phone]; // Süresi dolanı sil
    return res.status(400).json({ success: false, message: 'Doğrulama kodunun süresi dolmuş. Lütfen yeni bir kod isteyin.' });
  }

  // Kod eşleşme kontrolü
  if (storedData.code === code) {
    // Doğrulama başarılı olduysa kodu bellekten silebiliriz
    delete global.otpStore[phone];
    
    return res.status(200).json({ success: true, message: 'Doğrulama başarılı.' });
  } else {
    return res.status(400).json({ success: false, message: 'Hatalı doğrulama kodu.' });
  }
}
