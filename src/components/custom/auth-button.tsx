import React from 'react';

import Link from 'next/link';

import { auth, signIn, signOut } from '@/auth';

import { Button, buttonVariants } from '../ui/button';

export default async function AuthButton() {
  // 1. Ambil session di Server Component
  const session = await auth();

  // 2. Cek apakah user sudah login
  if (session && session.user) {
    return (
      <div className="flex items-center gap-4">
        <Link
          className="text-sm font-medium"
          href="/booking-history">
          My Booking
        </Link>
        {/* Menampilkan Email User */}
        <p className="text-sm font-medium">{session.user.email}</p>

        {/* Tombol Logout */}
        <form
          action={async () => {
            'use server';
            await signOut();
          }}>
          <Button
            variant="destructive"
            type="submit">
            Logout
          </Button>
        </form>
      </div>
    );
  }

  return (
    <form
      action={async () => {
        'use server';
        await signIn();
      }}>
      <Link
        className={buttonVariants({ variant: 'default' })}
        href="/signin">
        Login
      </Link>
    </form>
  );
}
