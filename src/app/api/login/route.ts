import { AuthError } from 'next-auth';
import { NextResponse } from 'next/server';

import { signIn } from '@/auth';

export async function POST(request: Request) {
  const formData = await request.formData();

  const email = formData.get('email');
  const password = formData.get('password');

  try {
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email dan Password wajib diisi' },
        { status: 400 }
      );
    }

    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return NextResponse.json({ success: true, message: 'Login successful' }, { status: 200 });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return NextResponse.json(
            { success: false, message: 'Invalid credentials.' },
            { status: 401 }
          );
        default:
          return NextResponse.json(
            { success: false, message: 'Something went wrong.' },
            { status: 500 }
          );
      }
    }

    console.error('Login Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
