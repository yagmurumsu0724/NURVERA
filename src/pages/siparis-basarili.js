import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

export default function SiparisBasariliPage() {
  return (
    <>
      <Head>
        <title>Siparişiniz Alındı | NURVERA</title>
      </Head>

      <div className="min-h-screen bg-nurvera-bg pt-40 pb-20 flex items-center justify-center">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-24 h-24 bg-nurvera-forest rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl"
          >
            <CheckCircle className="text-white w-12 h-12" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif text-nurvera-text mb-4">Siparişiniz Başarıyla Alındı!</h1>
            <p className="text-lg text-nurvera-text/70 mb-8 max-w-lg mx-auto">
              NURVERA kalitesini tercih ettiğiniz için teşekkür ederiz. Siparişinizin onay maili adresinize gönderildi. Şifa dolu doğal ürünleriniz en kısa sürede kargoya verilecektir.
            </p>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-nurvera-olive/10 mb-10 max-w-md mx-auto">
              <div className="flex items-center justify-center text-nurvera-forest mb-4">
                <Package size={24} className="mr-2" />
                <span className="font-bold tracking-widest uppercase">Sipariş No: #NVR-{(Math.random() * 100000).toFixed(0)}</span>
              </div>
              <p className="text-sm text-nurvera-text/60">
                Siparişinizin durumunu "Hesabım" bölümünden veya size gönderilen e-posta üzerinden takip edebilirsiniz.
              </p>
            </div>

            <Link 
              href="/urunler"
              className="inline-flex items-center bg-transparent border-2 border-nurvera-forest text-nurvera-forest px-8 py-4 rounded-full font-bold tracking-widest uppercase hover:bg-nurvera-forest hover:text-white transition-colors"
            >
              Alışverişe Dön <ArrowRight size={18} className="ml-2" />
            </Link>
          </motion.div>

        </div>
      </div>
    </>
  );
}
