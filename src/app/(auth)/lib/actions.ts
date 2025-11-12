'use server';

import { AuthError } from 'next-auth';

import { prisma } from '@/lib/prisma';
import { hashSync } from 'bcrypt-ts';

import { signIn } from '../../../../auth';

export async function signUpUser(formData: FormData) {
  try {
    const fullname = formData.get('fullname') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return { error: 'Email already exists', success: false };
    }

    const hashedPassword = hashSync(password, 10);

    const user = await prisma.user.create({
      data: {
        fullname,
        email,
        password: hashedPassword,
      },
    });

    console.log({ status: 'success', data: user });

    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: error, success: false };
  }
}

export async function signInUser(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    await signIn('credentials', { email, password, redirectTo: '/dashboard' });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { message: 'Invalid email or password', success: false };

        default:
          return { message: 'Something went wrong', success: false };
      }
    }

    throw error;
  }
}
