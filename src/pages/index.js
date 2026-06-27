import Head from "next/head";
import { createClient } from "@supabase/supabase-js";
import HeroSection from "@/components/sections/HeroSection";
import StorySection from "@/components/sections/StorySection";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import ProcessSection from "@/components/sections/ProcessSection";
import WhyNurvera from "@/components/sections/WhyNurvera";
import ServicesSection from "@/components/sections/ServicesSection";

export async function getStaticProps() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data: featuredProducts } = await supabase
    .from('products')
    .select('id, name, slug, short_description, price, images, schema_data')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(3);

  return {
    props: {
      featuredProducts: featuredProducts || []
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
}

export default function Home({ featuredProducts }) {
  return (
    <>
      <Head>
        <title>NURVERA | Doğanın Saf Gücünü Evinize Taşıyoruz</title>
        <meta name="description" content="NURVERA ile %100 doğal, katkısız ve el yapımı hidrosol ve uçucu yağları keşfedin. Doğanın şifası, kimyasal kullanmadan sizinle." />
      </Head>
      
      <div className="flex flex-col w-full">
        <HeroSection />
        <StorySection />
        <FeaturedProducts products={featuredProducts} />
        <ProcessSection />
        <WhyNurvera />
        <ServicesSection />
      </div>
    </>
  );
}
