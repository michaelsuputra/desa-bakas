import { type DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      db_user_id: string;
    } & DefaultSession['user'];
  }

  interface User {
    fullname: string | null;
    role: string;
    user_id;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    sub: string;
    fullname: string | null;
    role: string;
    db_user_id: string;
  }
}
