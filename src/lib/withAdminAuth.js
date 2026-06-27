import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react';

/**
 * Higher Order Component to protect admin pages.
 * @param {React.Component} Component - The page component to wrap
 * @param {string[]} allowedRoles - List of roles permitted to view this page
 */
export function withAdminAuth(Component, allowedRoles = ['admin', 'editor', 'moderator']) {
  return function ProtectedPage(props) {
    const router = useRouter();
    const { session, isLoading } = useSessionContext();
    const supabase = useSupabaseClient();
    const [role, setRole] = useState(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
      if (!isLoading) {
        if (!session) {
          // If not logged in, redirect to login
          router.replace(`/login?redirect=${encodeURIComponent(router.pathname)}`);
          return;
        }

        // Fetch user role
        supabase
          .from('user_roles')
          .select('role, is_active')
          .eq('user_id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error || !data || !data.is_active || !allowedRoles.includes(data.role)) {
              // Redirect if unauthorized or inactive
              router.replace('/login?error=unauthorized');
            } else {
              setRole(data.role);
              setChecking(false);
            }
          });
      }
    }, [session, isLoading, router, supabase]);

    if (isLoading || checking) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#7FA34D] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium animate-pulse text-sm">Doğrulanıyor...</p>
          </div>
        </div>
      );
    }

    return <Component {...props} userRole={role} />;
  };
}
