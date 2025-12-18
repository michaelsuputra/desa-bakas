import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const uniqueOrder = await prisma.kuisioner_guesthouse.findMany({
      where: {
        country: { not: null },
      },
      distinct: ['country'],
      select: {
        country: true,
      },
    });

    const data = uniqueOrder
      .map((item) => item.country)
      .filter((b): b is string => b !== null)
      .sort();

    return NextResponse.json({
      data,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch unique country data' }, { status: 500 });
  }
}
