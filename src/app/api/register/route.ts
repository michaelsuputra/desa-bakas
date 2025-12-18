import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { hashSync } from 'bcrypt-ts';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const fullname = formData.get('fullname') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!fullname || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Semua field wajib diisi',
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email sudah digunakan',
        },
        { status: 409 }
      );
    }

    const hashedPassword = hashSync(password, 10);

    const user = await prisma.user.create({
      data: {
        fullname,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Sukses melakukan registrasi customer',
        data: user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menambahkan data',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
