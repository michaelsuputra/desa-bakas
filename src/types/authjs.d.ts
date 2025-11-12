import { type DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: User & DefaultSession['user'];
  }

  interface User {
    fullname: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    sub: string;
    fullname: string | null;
  }
}
