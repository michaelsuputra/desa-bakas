import { type DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

import { Role } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: User & DefaultSession['user'];
  }

  interface User {
    fullname: string | null;
    role: Role;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    sub: string;
    fullname: string | null;
    role: Role;
  }
}
