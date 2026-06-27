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

async function checkDB() {
  console.log("Checking favorites table (bypassing RLS)...");
  const { data: favs, error: favsError } = await supabase.from('favorites').select('*, products(name)');
  if (favsError) console.error("Error fetching favorites:", favsError);
  else console.log(`Found ${favs.length} favorites:`, JSON.stringify(favs, null, 2));

  console.log("Checking favorite_collections table...");
  const { data: cols, error: colsError } = await supabase.from('favorite_collections').select('*');
  if (colsError) console.error("Error fetching collections:", colsError);
  else console.log(`Found ${cols.length} collections:`, JSON.stringify(cols, null, 2));
}

checkDB();
