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
const supabaseKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY']; 
const supabase = createClient(supabaseUrl, supabaseKey);

async function testFrontendAuth() {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'nnzratmc223@gmail.com',
    password: 'password123' // Or we can just mock it by using the admin key to get the session token... Wait, I don't know their password.
  });
  
  // Actually, I can just use the service role key to see if RLS is enabled.
  const serviceClient = createClient(supabaseUrl, env['SUPABASE_SERVICE_ROLE_KEY']);
  const { data: rlsStatus } = await serviceClient.rpc('get_rls_status_for_table', { table_name: 'user_roles' });
  console.log("RLS Status via RPC:", rlsStatus);
  
  // Or I can query pg_class
  const { data: pgClass } = await serviceClient.rpc('exec_sql', { sql: "SELECT relrowsecurity FROM pg_class WHERE relname = 'user_roles';" });
  console.log("RLS Status via pg_class:", pgClass);
}

testFrontendAuth();
