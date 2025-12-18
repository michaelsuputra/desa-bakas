import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Fetch guesthouses with the count of successful transactions
    const guesthouseData = await prisma.guesthouse.findMany({
      select: {
        guesthouse_name: true,
        _count: {
          select: {
            guesthouse_transaction: {
              where: {
                status: 'success', // Only count successful bookings
              },
            },
          },
        },
      },
    });

    // Format data for the chart: { guesthouse: string, total: number }
    const formattedData = guesthouseData
      .map((item) => ({
        guesthouse: item.guesthouse_name,
        total: item._count.guesthouse_transaction,
      }))
      .sort((a, b) => b.total - a.total); // Sort by most popular

    return NextResponse.json({
      formattedData,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch booking data' }, { status: 500 });
  }
}
