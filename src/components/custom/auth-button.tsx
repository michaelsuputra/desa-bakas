import React from 'react';

import Link from 'next/link';

import { auth, signIn, signOut } from '@/auth';
import { getBaseUrl } from '@/lib/utils';
import axios from 'axios';
import { toast } from 'sonner';

import { Button, buttonVariants } from '../ui/button';
import LogoutUser from './logout-user';

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

        {session.user.role !== 'wisatawan' && (
          <Link
            className="text-sm font-medium"
            href="/dashboard">
            Dashboard
          </Link>
        )}

        {/* Menampilkan Email User */}
        <p className="text-sm font-medium">{session.user.email}</p>

        {/* Tombol Logout */}
        <LogoutUser />
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
