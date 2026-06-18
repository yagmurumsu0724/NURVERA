import React from 'react';
import Head from 'next/head';
import StorySection from '@/components/sections/StorySection';
import ProcessSection from '@/components/sections/ProcessSection';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>Hikayemiz | NURVERA</title>
      </Head>
      <div className="pt-24">
        <StorySection />
        <ProcessSection />
      </div>
    </>
  );
}
