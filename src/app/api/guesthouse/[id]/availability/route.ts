// src/app/api/guesthouse/[id]/availability/route.ts
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const transactions = await prisma.guesthouse_transaction.findMany({
      where: {
        guesthouse_id: id,
        status: {
          in: ['pending', 'success'],
        },
      },
      select: {
        check_in: true,
        check_out: true,
      },
    });

    return NextResponse.json({ success: true, data: transactions });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}
