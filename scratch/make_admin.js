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

async function makeAdmin() {
  const user_id = 'fdde063a-b251-4a5f-98e3-477224cd57b5';
  
  // First check if role exists
  const { data, error } = await supabase.from('user_roles').select('*').eq('user_id', user_id).single();
  
  if (!data) {
    console.log("No role found, creating admin role...");
    const { error: insertError } = await supabase.from('user_roles').insert({
      user_id: user_id,
      role: 'admin',
      is_active: true
    });
    if (insertError) console.error("Error inserting role:", insertError);
    else console.log("Success! User is now admin.");
  } else {
    console.log("Role already exists:", data.role);
    if (data.role !== 'admin') {
      const { error: updateError } = await supabase.from('user_roles').update({ role: 'admin', is_active: true }).eq('user_id', user_id);
      if (updateError) console.error("Error updating role:", updateError);
      else console.log("Success! User updated to admin.");
    }
  }
}

makeAdmin();
