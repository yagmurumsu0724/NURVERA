import React from 'react';
import Head from 'next/head';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Logo from '@/components/ui/Logo';

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "authenticated") {
    router.push('/');
    return null;
  }

  return (
    <>
      <Head>
        <title>Giriş Yap | NURVERA</title>
      </Head>
      <div className="min-h-screen bg-nurvera-bg flex flex-col justify-center py-12 px-6 lg:px-8 mt-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center transform scale-[1.5] mb-8">
            <Logo className="text-nurvera-olive" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-serif font-extrabold text-nurvera-text">
            NURVERA'ya Hoş Geldiniz
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sağlıklı ve doğal yaşama adım atın.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl sm:px-10 border border-gray-50">
            <div className="space-y-4">
              <button
                onClick={() => signIn('google', { callbackUrl: '/' })}
                className="w-full flex justify-center py-3.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-[15px] font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all items-center"
              >
                <img className="h-5 w-5 mr-3" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                Google ile Devam Et
              </button>

              <button
                onClick={() => signIn('facebook', { callbackUrl: '/' })}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm bg-[#1877F2] text-[15px] font-medium text-white hover:bg-[#166FE5] transition-all items-center"
              >
                <img className="h-5 w-5 mr-3 filter brightness-0 invert" src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" />
                Facebook ile Devam Et
              </button>
            </div>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-400 font-medium">veya</span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => router.push('/')}
                  className="w-full flex justify-center py-3.5 px-4 border-2 border-nurvera-olive rounded-xl bg-transparent text-[15px] font-semibold text-nurvera-olive hover:bg-nurvera-olive hover:text-white transition-all items-center group"
                >
                  Üye Olmadan Devam Et
                  <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
                <p className="mt-4 text-center text-xs text-gray-400 leading-relaxed">
                  Üye olmadan yapacağınız alışverişlerde sipariş takibini e-posta adresiniz üzerinden yapabilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
