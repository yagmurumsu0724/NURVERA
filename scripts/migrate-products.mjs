import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Import products data
import { products } from '../src/data/products.js';

async function migrate() {
  console.log('Migrating categories...');
  const categoryNames = [...new Set(products.map(p => p.category))].filter(Boolean);
  const categoryMap = {};

  for (const catName of categoryNames) {
    const slug = catName.toLowerCase().replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9]/g, '-');
    const { data, error } = await supabaseAdmin.from('categories').upsert({
      name: catName,
      slug: slug
    }, { onConflict: 'slug' }).select('id').single();

    if (error) {
      console.error(`Error creating category ${catName}:`, error.message);
    } else {
      categoryMap[catName] = data.id;
    }
  }

  console.log('Migrating products...');
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const isFeatured = i < 3; // Make first 3 products featured for homepage

    const schema_data = {};
    if (p.size) schema_data.size = p.size;
    if (p.usage) schema_data.usage = p.usage;
    if (p.ingredients) schema_data.ingredients = p.ingredients;

    const { error } = await supabaseAdmin.from('products').upsert({
      name: p.name,
      slug: p.id, // The hardcoded ID acts as a slug
      short_description: p.shortDesc || '',
      description: p.description || '',
      category_id: categoryMap[p.category] || null,
      price: p.price,
      stock: 100, // Dummy stock
      status: 'published',
      images: p.image ? [p.image] : [],
      is_featured: isFeatured,
      schema_data
    }, { onConflict: 'slug' });

    if (error) {
      console.error(`Error migrating product ${p.name}:`, error.message);
    } else {
      console.log(`Successfully migrated product: ${p.name}`);
    }
  }
  
  console.log('Migration complete!');
}

migrate();
