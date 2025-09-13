import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: { signIn: '/' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = (user as any).id; // ensure id is on the token
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = (token as any).id ?? token.sub; // sub usually holds id too
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = (auth?.user as any)?.role as 'admin' | 'student' | undefined;
      const path = nextUrl.pathname;

      const isAdminRoute = path.startsWith('/dashboard');
      const isStudentRoute = path.startsWith('/sessions');
      const isLoginPage = path === '/';

      if (!isLoggedIn && (isAdminRoute || isStudentRoute)) return false;

      if (isLoggedIn && isLoginPage) {
        return Response.redirect(new URL(role === 'admin' ? '/dashboard' : '/sessions', nextUrl));
      }

      if (isAdminRoute && role !== 'admin') {
        return Response.redirect(new URL('/sessions', nextUrl));
      }
      if (isStudentRoute && role !== 'student') {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
