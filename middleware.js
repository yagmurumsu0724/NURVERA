import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components/Middleware
  const { data: { session } } = await supabase.auth.getSession();

  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isApiAdminRoute = req.nextUrl.pathname.startsWith('/api/admin');

  if (isAdminRoute || isApiAdminRoute) {
    if (!session) {
      if (isAdminRoute) {
        const redirectUrl = new URL('/login', req.url);
        redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
      }
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    // Role check
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role, is_active')
      .eq('user_id', session.user.id)
      .single();

    if (!roleData || !roleData.is_active || !['admin', 'editor', 'moderator'].includes(roleData.role)) {
      if (isAdminRoute) {
        return NextResponse.redirect(new URL('/login?error=unauthorized', req.url));
      }
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
};
