import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import { useSession } from 'next-auth/react';
import { User, Package, Heart, Clock, Loader, LogOut, FileText } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

import ProfileTab from '@/components/account/ProfileTab';
import OrdersTab from '@/components/account/OrdersTab';
import FavoritesTab from '@/components/account/FavoritesTab';
import WaitlistTab from '@/components/account/WaitlistTab';
import PreOrdersTab from '@/components/account/PreOrdersTab';

export default function AccountDashboard() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const { session: supabaseSession, isLoading: isSupabaseLoading } = useSessionContext();
  const { data: nextAuthSession, status: nextAuthStatus } = useSession();
  
  const [activeTab, setActiveTab] = useState('profil');
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Read tab from query string if available
  useEffect(() => {
    if (router.query.tab) {
      setActiveTab(router.query.tab);
    }
  }, [router.query]);

  // Auth checking
  const isNextAuthLoading = nextAuthStatus === 'loading';
  const isAuthenticated = !!supabaseSession || !!nextAuthSession;

  useEffect(() => {
    if (!isSupabaseLoading && !isNextAuthLoading && !isAuthenticated) {
      router.push('/login?redirect=/hesabim');
    }
  }, [isSupabaseLoading, isNextAuthLoading, isAuthenticated, router]);

  // Fetch user profile from Supabase if using Supabase auth
  useEffect(() => {
    async function fetchProfile() {
      if (supabaseSession?.user?.id) {
        setProfileLoading(true);
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', supabaseSession.user.id)
          .single();
          
        if (data) {
          setUserProfile(data);
        }
        setProfileLoading(false);
      } else {
        setProfileLoading(false);
      }
    }
    
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [supabaseSession, isAuthenticated, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // In a real app we'd also call nextAuth signOut if nextAuthSession exists
    router.push('/login');
  };

  if (isSupabaseLoading || isNextAuthLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nurvera-bg">
        <div className="w-10 h-10 border-4 border-nurvera-olive border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const user = supabaseSession?.user || nextAuthSession?.user;
  
  // Tabs configuration
  const menuItems = [
    { id: 'profil', label: 'Profil Bilgilerim', icon: <User className="w-5 h-5" /> },
    { id: 'siparisler', label: 'Geçmiş Siparişlerim', icon: <Package className="w-5 h-5" /> },
    { id: 'favoriler', label: 'Favorilerim', icon: <Heart className="w-5 h-5" /> },
    { id: 'beklediklerim', label: 'Beklediğim Ürünler', icon: <Clock className="w-5 h-5" /> },
    { id: 'on-siparisler', label: 'Ön Siparişlerim', icon: <FileText className="w-5 h-5" /> },
  ];

  const handleTabChange = (id) => {
    setActiveTab(id);
    router.replace(`/hesabim?tab=${id}`, undefined, { shallow: true });
  };

  return (
    <>
      <Head>
        <title>Hesabım | NURVERA</title>
      </Head>

      <Header />

      <main className="min-h-screen bg-nurvera-bg pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-10">
            <h1 className="text-3xl font-serif font-extrabold text-nurvera-text">Hesabım</h1>
            <p className="text-gray-500 mt-2">Hoş geldin, {userProfile?.first_name || user?.name || user?.email?.split('@')[0]}!</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Menu */}
            <div className="w-full lg:w-72 shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-28">
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${
                        activeTab === item.id 
                          ? 'bg-nurvera-olive text-white shadow-md' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-nurvera-olive'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                  
                  <div className="h-px bg-gray-100 my-4"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    Çıkış Yap
                  </button>
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1">
              {profileLoading ? (
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex justify-center">
                  <div className="w-8 h-8 border-2 border-nurvera-olive border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  {activeTab === 'profil' && <ProfileTab user={user} profile={userProfile} />}
                  {activeTab === 'siparisler' && <OrdersTab user={user} />}
                  {activeTab === 'favoriler' && <FavoritesTab user={user} />}
                  {activeTab === 'beklediklerim' && <WaitlistTab user={user} />}
                  {activeTab === 'on-siparisler' && <PreOrdersTab user={user} />}
                </>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
