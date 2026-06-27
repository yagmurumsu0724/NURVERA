const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envLocal = fs.readFileSync('.env.local', 'utf8');
const envLines = envLocal.split('\n');
const env = {};
envLines.forEach(line => {
  if (line.includes('=')) {
    const [key, ...rest] = line.split('=');
    env[key.trim()] = rest.join('=').trim().replace(/['"]/g, '');
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY']; // Bypass RLS
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfile() {
  const { data: profile } = await supabase.from('user_profiles').select('*').eq('id', 'fdde063a-b251-4a5f-98e3-477224cd57b5').single();
  console.log("Profile in DB:", profile);
}

checkProfile();
