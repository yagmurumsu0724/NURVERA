const fs = require('fs');

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

async function checkOpenAPI() {
  const res = await fetch(`${supabaseUrl}/rest/v1/`, {
    headers: { 'apikey': supabaseKey }
  });
  const json = await res.json();
  console.log(Object.keys(json.definitions.orders.properties));
}

checkOpenAPI();
