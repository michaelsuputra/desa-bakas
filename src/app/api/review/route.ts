import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('limit')) || 10;
  const searchQuery = searchParams.get('search') || undefined;
  const guesthouseQuery = searchParams.get('guesthouse') || undefined;

  const skip = (page - 1) * pageSize;

  const where: Prisma.review_guesthouseWhereInput = {};

  if (searchQuery) {
    where.OR = [
      { guesthouse: { guesthouse_name: { contains: searchQuery, mode: 'insensitive' } } },
    ];
  }

  if (guesthouseQuery) {
    where.guesthouse = {
      guesthouse_name: { equals: guesthouseQuery, mode: 'insensitive' },
    };
  }

  try {
    const [data, totalCount] = await Promise.all([
      prisma.review_guesthouse.findMany({
        take: pageSize,
        skip,
        where,
        include: {
          guesthouse: true,
          user: true,
        },
      }),
      prisma.review_guesthouse.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return NextResponse.json({
      data,
      totalCount,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch kuisioner data' }, { status: 500 });
  }
}
