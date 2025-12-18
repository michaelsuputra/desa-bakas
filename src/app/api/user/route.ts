import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('limit')) || 10;
  const searchQuery = searchParams.get('search') || undefined;

  const skip = (page - 1) * pageSize;

  const where: Prisma.userWhereInput = {
    role: 'wisatawan',
  };

  if (searchQuery) {
    where.OR = [{ fullname: { contains: searchQuery, mode: 'insensitive' } }];
  }

  try {
    const [data, totalCount] = await Promise.all([
      prisma.user.findMany({
        take: pageSize,
        skip,
        where,
        orderBy: {
          created_at: 'desc',
        },
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return NextResponse.json({
      data,
      totalCount,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const fullname = formData.get('fullname') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const data = await prisma.user.create({
      data: {
        fullname,
        email,
        password,
        role: 'wisatawan',
      },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error creating guesthouse:', error);
    return NextResponse.json({ error: 'Failed to create News Event' }, { status: 500 });
  }
}
