import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { prisma } from '@/lib/prisma';
import { compareSync } from 'bcrypt-ts';

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const email = credentials.email as string;
        const password = credentials.password as string;

        if (!email || !password) {
          return null;
        }

        if (password.length < 6 || !email.includes('@')) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          throw new Error('Invalid email or password');
        }

        const passwordMatches = compareSync(password, user.password);

        if (!passwordMatches) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const ProtectedRoutes = ['/dashboard', '/kuisioner'];

      if (!isLoggedIn && ProtectedRoutes.includes(nextUrl.pathname)) {
        return Response.redirect(new URL('/signin', nextUrl));
      }

      if (isLoggedIn && nextUrl.pathname.startsWith('/signin')) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.fullname = user.fullname;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub;
      session.user.fullname = token.fullname;
      return session;
    },
  },
});
