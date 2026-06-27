import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import Logo from '@/components/ui/Logo';

export default function Login() {
  const { data: session, status } = useSession();
  const supabase = useSupabaseClient();
  const { session: supabaseSession } = useSessionContext();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('customer_login'); // 'customer_login', 'customer_register', 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle redirects on load or session changes
  useEffect(() => {
    // NextAuth Customer redirect (for backward compatibility with Google/FB)
    if (status === 'authenticated') {
      router.push(router.query.redirect || '/hesabim');
    }
  }, [status, router]);

  useEffect(() => {
    // Supabase session redirect
    if (supabaseSession) {
      supabase
        .from('user_roles')
        .select('role, is_active')
        .eq('user_id', supabaseSession.user.id)
        .single()
        .then(({ data, error }) => {
          if (data && data.is_active && ['admin', 'editor', 'moderator'].includes(data.role)) {
            router.push(router.query.redirect || '/admin');
          } else {
            // Customer redirect
            router.push(router.query.redirect || '/hesabim');
          }
        });
    }
  }, [supabaseSession, router, supabase]);

  const handleCustomerRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (error) throw error;
      setSuccessMsg('Kayıt başarılı! Giriş yapabilirsiniz.');
      setActiveTab('customer_login');
      setPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'Kayıt olurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message === 'Invalid login credentials' ? 'E-posta adresi veya şifre hatalı.' : (error.message === 'Email not confirmed' ? 'Lütfen e-posta adresinize gönderilen onay bağlantısına tıklayın (veya Supabase ayarlarından e-posta onayını kapatın).' : error.message));
      // Session effect will handle redirect
    } catch (err) {
      setErrorMsg(err.message || 'Giriş yaparken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error('E-posta adresi veya şifre hatalı.');

      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role, is_active')
        .eq('user_id', data.user.id)
        .single();

      if (roleError || !roleData || !roleData.is_active || !['admin', 'editor', 'moderator'].includes(roleData.role)) {
        await supabase.auth.signOut();
        throw new Error('Bu panele erişim yetkiniz bulunmamaktadır.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{`Giriş Yap / Üye Ol | NURVERA`}</title>
      </Head>
      <div className="min-h-screen bg-nurvera-bg flex flex-col justify-center py-12 px-6 lg:px-8 mt-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center transform scale-[1.5] mb-8">
            <Logo className="text-nurvera-olive" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-serif font-extrabold text-nurvera-text">
            NURVERA Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Doğal şifa ve sağlıklı yaşam platformu.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl sm:px-10 border border-gray-50">
            
            <div className="flex border-b border-gray-100 mb-8">
              <button
                type="button"
                onClick={() => { setActiveTab('customer_login'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 pb-4 text-[15px] font-semibold text-center border-b-2 transition-all ${
                  activeTab === 'customer_login'
                    ? 'border-nurvera-olive text-nurvera-olive'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Giriş Yap
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('customer_register'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 pb-4 text-[15px] font-semibold text-center border-b-2 transition-all ${
                  activeTab === 'customer_register'
                    ? 'border-nurvera-olive text-nurvera-olive'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Üye Ol
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('admin'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 pb-4 text-[15px] font-semibold text-center border-b-2 transition-all ${
                  activeTab === 'admin'
                    ? 'border-nurvera-olive text-nurvera-olive'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Yönetici
              </button>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-sm text-red-700 font-medium">
                {errorMsg}
              </div>
            )}
            
            {successMsg && (
              <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg text-sm text-emerald-700 font-medium">
                {successMsg}
              </div>
            )}

            {activeTab === 'customer_login' && (
              <div className="space-y-6">
                <form onSubmit={handleCustomerLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-posta Adresi</label>
                    <input
                      type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-nurvera-olive/20 focus:border-nurvera-olive transition-all text-[15px]"
                      placeholder="ornek@nurvera.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Şifre</label>
                    <input
                      type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-nurvera-olive/20 focus:border-nurvera-olive transition-all text-[15px]"
                      placeholder="••••••••"
                    />
                  </div>
                  <button
                    type="submit" disabled={loading}
                    className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-[15px] font-semibold text-white bg-nurvera-olive hover:bg-opacity-90 transition-all disabled:opacity-50"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Giriş Yap'}
                  </button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                    <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-400 font-medium">veya sosyal ağlarla</span></div>
                  </div>
                  <div className="mt-6 space-y-3">
                    <button onClick={() => signIn('google', { callbackUrl: '/hesabim' })} className="w-full flex justify-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-[14px] font-medium text-gray-700 hover:bg-gray-50 transition-all items-center">
                      <img className="h-5 w-5 mr-3" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" /> Google
                    </button>
                    <button onClick={() => signIn('facebook', { callbackUrl: '/hesabim' })} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm bg-[#1877F2] text-[14px] font-medium text-white hover:bg-[#166FE5] transition-all items-center">
                      <img className="h-5 w-5 mr-3 filter brightness-0 invert" src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" /> Facebook
                    </button>
                  </div>
                  
                  <div className="mt-8 text-center">
                    <button onClick={() => router.push('/')} className="text-sm font-medium text-gray-500 hover:text-nurvera-olive transition-colors">
                      Üye Olmadan Alışverişe Devam Et &rarr;
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'customer_register' && (
              <form onSubmit={handleCustomerRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adınız</label>
                    <input
                      type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-nurvera-olive/20 focus:border-nurvera-olive transition-all text-[15px]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Soyadınız</label>
                    <input
                      type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-nurvera-olive/20 focus:border-nurvera-olive transition-all text-[15px]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-posta Adresi</label>
                  <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-nurvera-olive/20 focus:border-nurvera-olive transition-all text-[15px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şifre</label>
                  <input
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-nurvera-olive/20 focus:border-nurvera-olive transition-all text-[15px]"
                    minLength="6"
                  />
                </div>
                <button
                  type="submit" disabled={loading}
                  className="w-full flex justify-center py-3.5 px-4 mt-2 border border-transparent rounded-xl shadow-md text-[15px] font-semibold text-white bg-nurvera-olive hover:bg-opacity-90 transition-all disabled:opacity-50"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Üye Ol'}
                </button>
              </form>
            )}

            {activeTab === 'admin' && (
              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-posta Adresi</label>
                  <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-nurvera-olive/20 focus:border-nurvera-olive transition-all text-[15px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şifre</label>
                  <input
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-nurvera-olive/20 focus:border-nurvera-olive transition-all text-[15px]"
                  />
                </div>
                <button
                  type="submit" disabled={loading}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-[15px] font-semibold text-white bg-slate-800 hover:bg-slate-900 transition-all disabled:opacity-50"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Yönetici Girişi'}
                </button>
              </form>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

