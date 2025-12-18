import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { generateRandomString } from '@/lib/utils';
import xenditClient from '@/lib/xendit';
import { CreateInvoiceRequest, Invoice } from 'xendit-node/invoice/models';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const user_id = formData.get('user_id') as string;
    const guesthouse_id = formData.get('guesthouse_id') as string;
    const check_in = formData.get('check_in') as string;
    const check_out = formData.get('check_out') as string;
    const night_count = Number(formData.get('night_count'));
    const total_price = Number(formData.get('total_price'));
    const description = formData.get('description') as string;

    const transactionCode = 'GH-' + generateRandomString(15);

    const transaction = await prisma.guesthouse_transaction.create({
      data: {
        user_id,
        guesthouse_id,
        check_in,
        check_out,
        night_count,
        total_price,
        description,

        status: 'pending',
        code: transactionCode,
      },
    });

    const data: CreateInvoiceRequest = {
      amount: total_price,
      invoiceDuration: 86400,
      externalId: transactionCode,
      currency: 'IDR',
      successRedirectUrl: 'http://localhost:3000/booking-history',
    };

    const response: Invoice = await xenditClient.Invoice.createInvoice({ data });

    await prisma.guesthouse_transaction.update({
      where: {
        guesthouse_transaction_id: transaction.guesthouse_transaction_id,
      },
      data: {
        invoice_url: response.invoiceUrl,
      },
    });

    console.log(response);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error creating guesthouse:', error);
    return NextResponse.json({ error: 'Failed to create guesthouse checkout' }, { status: 500 });
  }
}
