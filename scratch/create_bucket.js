const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
  if (match) {
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Checking storage buckets in Supabase...');
  
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error('Error listing buckets:', listError.message);
    process.exit(1);
  }

  console.log('Current buckets:', buckets.map(b => b.name));

  const hasMediaBucket = buckets.some(b => b.name === 'nurvera-media');
  
  if (!hasMediaBucket) {
    console.log("Bucket 'nurvera-media' not found. Creating it...");
    const { data, error } = await supabase.storage.createBucket('nurvera-media', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    });

    if (error) {
      console.error('Error creating bucket:', error.message);
    } else {
      console.log("Bucket 'nurvera-media' successfully created as PUBLIC!");
    }
  } else {
    console.log("Bucket 'nurvera-media' already exists.");
    
    // Ensure it is public just in case
    const bucket = buckets.find(b => b.name === 'nurvera-media');
    if (!bucket.public) {
      console.log("Bucket is private. Making it public...");
      const { data, error } = await supabase.storage.updateBucket('nurvera-media', {
        public: true
      });
      if (error) {
        console.error('Error updating bucket:', error.message);
      } else {
        console.log("Bucket is now public.");
      }
    }
  }
}

main();
