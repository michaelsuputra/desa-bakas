import React from 'react';

import { auth, signIn, signOut } from '@/auth';

import { Button } from '../ui/button';

export default async function AuthButton() {
  // 1. Ambil session di Server Component
  const session = await auth();

  // 2. Cek apakah user sudah login
  if (session && session.user) {
    return (
      <div className="flex items-center gap-4">
        {/* Menampilkan Email User */}
        <p className="text-muted-foreground text-sm font-medium">{session.user.email}</p>

        {/* Tombol Logout */}
        <form
          action={async () => {
            'use server';
            await signOut();
          }}>
          <Button
            variant="ghost"
            type="submit">
            Logout
          </Button>
        </form>
      </div>
    );
  }

  // 3. Tampilan jika user belum login
  return (
    <form
      action={async () => {
        'use server';
        await signIn();
      }}>
      <Button type="submit">Login</Button>
    </form>
  );
}
