import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Import blog data
import { blogPosts } from '../src/data/blog.js';

async function migrate() {
  console.log('Migrating blog categories...');
  const categoryNames = [...new Set(blogPosts.map(b => b.category))].filter(Boolean);
  const categoryMap = {};

  for (const catName of categoryNames) {
    const slug = catName.toLowerCase().replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9]/g, '-');
    const { data, error } = await supabaseAdmin.from('blog_categories').upsert({
      name: catName,
      slug: slug
    }, { onConflict: 'slug' }).select('id').single();

    if (error) {
      console.error(`Error creating category ${catName}:`, error.message);
    } else {
      categoryMap[catName] = data.id;
    }
  }

  console.log('Migrating blog posts...');
  for (const b of blogPosts) {
    const { error } = await supabaseAdmin.from('blog_posts').upsert({
      title: b.title,
      slug: b.slug,
      content: b.content || '',
      excerpt: b.excerpt || '',
      cover_image: b.image || null,
      category_id: categoryMap[b.category] || null,
      status: 'published',
      reading_time: b.readTime ? parseInt(b.readTime) : 5,
      is_featured: true // Making all initial blogs featured so they show up easily
    }, { onConflict: 'slug' });

    if (error) {
      console.error(`Error migrating blog post ${b.title}:`, error.message);
    } else {
      console.log(`Successfully migrated blog post: ${b.title}`);
    }
  }
  
  console.log('Blog migration complete!');
}

migrate();
