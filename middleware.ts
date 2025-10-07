// middleware.ts
import { NextResponse } from 'next/server';
import { auth } from './auth';

export default auth(async (req) => {
  const { nextUrl } = req;
  const session = req.auth; // from NextAuth middleware wrapper

  const isLoggedIn = !!session?.user;
  const role = (session?.user as any)?.role as 'admin' | 'student' | undefined;

  const path = nextUrl.pathname;
  const isAdminRoute = path.startsWith('/dashboard/register');
  const isStudentRoute = path.startsWith('/sessions');
  const isLoginPage = path === '/';

  // Not logged in but trying to access protected routes
  if (!isLoggedIn && (isAdminRoute || isStudentRoute)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Logged in and visiting login page → send to role home
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(
      new URL(role === 'admin' ? '/dashboard/register' : '/sessions', req.url)
    );
  }

  // Wrong role for route
  if (isAdminRoute && role !== 'admin') {
    return NextResponse.redirect(new URL('/sessions', req.url));
  }
  if (isStudentRoute && role !== 'student') {
    return NextResponse.redirect(new URL('/dashboard/register', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
