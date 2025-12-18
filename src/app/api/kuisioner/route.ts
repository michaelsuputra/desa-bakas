import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('limit')) || 10;
  const searchQuery = searchParams.get('search') || undefined;
  const bookingQuery = searchParams.get('booking') || undefined;
  const countryQuery = searchParams.get('country') || undefined;
  const guesthouseQuery = searchParams.get('guesthouse') || undefined;

  const skip = (page - 1) * pageSize;

  const where: Prisma.kuisioner_guesthouseWhereInput = {};

  if (searchQuery) {
    where.OR = [
      { user: { fullname: { contains: searchQuery, mode: 'insensitive' } } },
      {
        guesthouse: {
          guesthouse_name: { contains: searchQuery, mode: 'insensitive' },
        },
      },
    ];
  }

  if (bookingQuery) {
    where.booking_at = { contains: bookingQuery, mode: 'insensitive' };
  }

  if (countryQuery) {
    where.country = { contains: countryQuery, mode: 'insensitive' };
  }

  if (guesthouseQuery) {
    where.guesthouse = {
      guesthouse_name: { equals: guesthouseQuery, mode: 'insensitive' },
    };
  }

  try {
    const [data, totalCount] = await Promise.all([
      prisma.kuisioner_guesthouse.findMany({
        take: pageSize,
        skip,
        where,
        include: {
          guesthouse: true,
          user: true,
        },
      }),
      prisma.kuisioner_guesthouse.count({ where }),
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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const guesthouse_id = formData.get('guesthouse_id') as string;
    const user_id = formData.get('user_id') as string;
    const guesthouse_transaction_id = formData.get('guesthouse_transaction_id') as string;
    const age = Number(formData.get('age'));
    const number_of_people = Number(formData.get('number_of_people'));
    const contact = formData.get('contact') as string;
    const country = formData.get('country') as string;
    const country_flag = formData.get('country_flag') as string;
    const date_of_stay = formData.get('date_of_stay') as string;
    const date_of_checkout = formData.get('date_of_checkout') as string;
    const booking_at = 'Website Platform';

    const passportEntry = formData.get('passport') as File;
    const passportFile =
      passportEntry instanceof File && passportEntry.size > 0 ? passportEntry : null;

    let passportUrl: string | null = null;

    if (passportFile) {
      const folderName = 'desa-bakas/passport';

      const bytes = await passportFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const res: { secure_url: string } = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folderName,
          },
          (error, result) => {
            if (error) return reject(error);
            if (result && result.secure_url) {
              resolve(result as { secure_url: string });
            } else {
              reject(new Error('Upload failed'));
            }
          }
        );
        uploadStream.end(buffer);
      });

      passportUrl = res?.secure_url;
    }

    const data = await prisma.kuisioner_guesthouse.create({
      data: {
        guesthouse_id,
        user_id,
        guesthouse_transaction_id,
        age,
        number_of_people,
        contact,
        country,
        country_flag,
        date_of_stay,
        date_of_checkout,
        booking_at,
        passport: passportUrl,
      },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error creating guesthouse:', error);
    return NextResponse.json({ error: 'Failed to create Guesthouse' }, { status: 500 });
  }
}
