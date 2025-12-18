import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const uniqueOrder = await prisma.kuisioner_guesthouse.findMany({
      where: {
        booking_at: { not: null },
      },
      distinct: ['booking_at'],
      select: {
        booking_at: true,
      },
    });

    const data = uniqueOrder
      .map((item) => item.booking_at)
      .filter((b): b is string => b !== null)
      .sort();

    return NextResponse.json({
      data,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch unique booking data' }, { status: 500 });
  }
}
