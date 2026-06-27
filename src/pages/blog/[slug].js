import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function BlogPost({ post }) {
  if (!post) return <div>Yazı bulunamadı.</div>;

  return (
    <>
      <Head>
        <title>{post.title} | NURVERA Dergi</title>
        <meta name="description" content={post.excerpt} />
      </Head>

      <div className="bg-[#Fdfbf7] pt-32 pb-24 min-h-screen">
        
        {/* Üst Kısım: Başlık ve Görsel */}
        <div className="container mx-auto px-6 max-w-4xl mb-16 relative z-10">
          <Link href="/blog" className="inline-flex items-center text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-nurvera-olive transition-colors mb-8 relative z-50">
            <ArrowLeft size={16} className="mr-2" /> Blog'a Dön
          </Link>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <div className="inline-block bg-nurvera-olive/10 text-nurvera-olive text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">
              {post.blog_categories?.name || 'Genel'}
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-nurvera-text leading-tight mb-8">
              {post.title}
            </h1>
            <div className="flex items-center justify-center text-xs font-bold tracking-widest text-gray-400 uppercase space-x-3 mb-12">
              <span>{post.created_at ? format(new Date(post.created_at), 'd MMMM yyyy', { locale: tr }) : ''}</span>
              <span className="text-nurvera-beige">•</span>
              <span>{post.reading_time || 5} dk okuma</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative h-[400px] md:h-[500px] w-full rounded-3xl overflow-hidden shadow-elegant border border-gray-100"
          >
            <Image 
              src={post.cover_image || '/images/placeholder.jpg'} 
              alt={post.title} 
              fill
              priority
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* İçerik */}
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.article 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="prose prose-lg md:prose-xl prose-stone mx-auto
                       prose-headings:font-serif prose-headings:font-normal prose-headings:text-nurvera-text
                       prose-p:text-gray-600 prose-p:font-light prose-p:leading-loose
                       prose-a:text-nurvera-olive prose-a:no-underline hover:prose-a:text-nurvera-accent
                       prose-blockquote:border-l-2 prose-blockquote:border-nurvera-beige prose-blockquote:bg-nurvera-olive/5 prose-blockquote:p-6 prose-blockquote:rounded-r-xl prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:text-nurvera-accent prose-blockquote:text-2xl
                       prose-strong:text-nurvera-text prose-strong:font-medium
                       prose-li:text-gray-600 prose-li:font-light"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('status', 'published');

  const paths = posts?.map((post) => ({
    params: { slug: post.slug },
  })) || [];

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*, blog_categories(name)')
    .eq('slug', params.slug)
    .single();

  if (!post) {
    return { notFound: true };
  }

  return { props: { post }, revalidate: 60 };
}
