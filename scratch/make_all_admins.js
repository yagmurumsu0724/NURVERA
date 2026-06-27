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
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY']; 
const supabase = createClient(supabaseUrl, supabaseKey);

async function makeAllAdmins() {
  const { data: users, error: userError } = await supabase.auth.admin.listUsers();
  if (userError) {
    console.error("Error fetching users:", userError);
    return;
  }
  
  for (const user of users.users) {
    const { data } = await supabase.from('user_roles').select('*').eq('user_id', user.id).single();
    if (!data) {
      await supabase.from('user_roles').insert({
        user_id: user.id,
        role: 'admin',
        is_active: true
      });
      console.log(`Created admin role for: ${user.email}`);
    } else if (data.role !== 'admin') {
      await supabase.from('user_roles').update({ role: 'admin', is_active: true }).eq('user_id', user.id);
      console.log(`Updated to admin role for: ${user.email}`);
    } else {
      console.log(`Already admin: ${user.email}`);
    }
  }
}

makeAllAdmins();
