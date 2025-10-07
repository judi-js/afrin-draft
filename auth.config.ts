// auth.config.ts
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: { signIn: '/' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = (token as any).id ?? token.sub;
      }
      return session;
    },
    // No redirect logic here anymore
    authorized({ auth }) {
      return !!auth?.user; // just check if logged in
    },
  },
  providers: [],
} satisfies NextAuthConfig;
