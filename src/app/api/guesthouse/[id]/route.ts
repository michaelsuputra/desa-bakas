import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const guesthouse = await prisma.guesthouse.findUnique({
      where: {
        guesthouse_id: id,
      },
    });

    if (!guesthouse) {
      return NextResponse.json({ success: false, error: 'Guesthouse not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: guesthouse });
  } catch (error) {
    console.error('Error fetching guesthouse detail:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
