import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const code = body.external_id;
    const xenditStatus = body.status;
    const statusDb = xenditStatus === 'PAID' ? 'success' : 'failed';

    if (code.startsWith('GH-')) {
      await prisma.guesthouse_transaction.update({
        where: {
          code: code,
        },
        data: {
          status: statusDb,
          payment_method: body.payment_channel,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
  return NextResponse.json({ success: true });
}
