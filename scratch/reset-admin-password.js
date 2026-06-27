const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.join(__dirname, '../.env.local');
let supabaseUrl = '';
let supabaseServiceKey = '';

if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  lines.forEach(line => {
    const cleanLine = line.trim();
    if (cleanLine && !cleanLine.startsWith('#')) {
      const parts = cleanLine.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        if (key === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = value;
        if (key === 'SUPABASE_SERVICE_ROLE_KEY') supabaseServiceKey = value;
      }
    }
  });
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Hata: .env.local dosyasında Supabase URL veya Service Role Key bulunamadı!');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const adminEmail = 'admin@nurvera.com';
const adminPassword = 'NurveraAdminPassword2026!';

async function resetPassword() {
  console.log('Admin şifresi sıfırlanıyor...');
  try {
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;

    const existingUser = users.find(u => u.email === adminEmail);
    if (!existingUser) {
      console.log('Kullanıcı bulunamadı, yeniden oluşturuluyor...');
      const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true
      });
      if (createError) throw createError;
      console.log('Kullanıcı oluşturuldu.');
      
      await supabaseAdmin.from('user_roles').upsert([{ user_id: userData.user.id, role: 'admin', is_active: true }]);
    } else {
      console.log(`Kullanıcı bulundu (ID: ${existingUser.id}). Şifresi güncelleniyor...`);
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
        password: adminPassword
      });
      if (updateError) throw updateError;
      console.log('Şifre başarıyla güncellendi.');
      
      // Make sure they have the role
      await supabaseAdmin.from('user_roles').upsert([{ user_id: existingUser.id, role: 'admin', is_active: true }]);
    }
    console.log('Şifre başarıyla NurveraAdminPassword2026! olarak belirlendi.');
  } catch (err) {
    console.error('Hata:', err.message || err);
  }
}

resetPassword();
