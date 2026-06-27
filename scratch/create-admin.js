const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Manually parse .env.local to avoid requiring additional npm packages
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

// 2. Initialize Supabase Admin Client
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Configure admin credentials here
const adminEmail = 'admin@nurvera.com';
const adminPassword = 'NurveraAdminPassword2026!'; // Lütfen bu şifreyi değiştirin!

async function setupAdmin() {
  console.log('----------------------------------------------------');
  console.log('NURVERA Admin CMS — İlk Kullanıcı Kurulumu');
  console.log('----------------------------------------------------');
  console.log(`Hedef E-posta: ${adminEmail}`);
  console.log('Supabase Auth üzerinde kullanıcı aranıyor/oluşturuluyor...');

  try {
    let userId = null;

    // Create user in Auth
    const { data: userData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true
    });

    if (authError) {
      if (authError.message.includes('already exists') || authError.message.includes('registered')) {
        console.log('Kullanıcı zaten Auth sisteminde kayıtlı. ID eşleştiriliyor...');
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        if (listError) throw listError;
        
        const existingUser = users.find(u => u.email === adminEmail);
        if (!existingUser) {
          throw new Error('Kayıtlı kullanıcı bulunamadı.');
        }
        userId = existingUser.id;
      } else {
        throw authError;
      }
    } else {
      console.log('Kullanıcı Auth sisteminde başarıyla oluşturuldu.');
      userId = userData.user.id;
    }

    // Insert role into user_roles table
    console.log(`user_roles tablosuna "admin" rolü atanıyor...`);
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .upsert([
        { user_id: userId, role: 'admin', is_active: true }
      ], { onConflict: 'user_id' });

    if (roleError) {
      console.error('\nHata: Veritabanı rol tablosuna yazma başarısız oldu.');
      console.error('Lütfen öncelikle supabase_schema.sql içeriğini Supabase SQL Editor kısmında çalıştırdığınızdan emin olun!');
      console.error('Hata mesajı:', roleError.message);
      process.exit(1);
    }

    console.log('\n🎉 KURULUM BAŞARIYLA TAMAMLANDI!');
    console.log('----------------------------------------------------');
    console.log('Panel Giriş Bilgileriniz:');
    console.log(`E-posta: ${adminEmail}`);
    console.log(`Şifre:   ${adminPassword}`);
    console.log('----------------------------------------------------');
    console.log('Bu bilgileri kullanarak /login sayfasından giriş yapabilirsiniz.');
  } catch (err) {
    console.error('\nKurulum sırasında beklenmeyen bir hata oluştu:');
    console.error(err.message || err);
  }
}

setupAdmin();
