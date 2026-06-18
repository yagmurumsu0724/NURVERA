import Head from "next/head";
import HeroSection from "@/components/sections/HeroSection";
import StorySection from "@/components/sections/StorySection";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import ProcessSection from "@/components/sections/ProcessSection";
import WhyNurvera from "@/components/sections/WhyNurvera";

export default function Home() {
  return (
    <>
      <Head>
        <title>NURVERA | Doğanın Saf Gücünü Evinize Taşıyoruz</title>
        <meta name="description" content="NURVERA ile %100 doğal, katkısız ve el yapımı hidrosol ve uçucu yağları keşfedin. Doğanın şifası, kimyasal kullanmadan sizinle." />
      </Head>
      
      <div className="flex flex-col w-full">
        <HeroSection />
        <StorySection />
        <FeaturedProducts />
        <ProcessSection />
        <WhyNurvera />
      </div>
    </>
  );
}
