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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const user_id = formData.get('user_id') as string;
    const guesthouse_id = formData.get('guesthouse_id') as string;
    const guesthouse_transaction_id = formData.get('guesthouse_transaction_id') as string;
    const impression = formData.get('impression') as string;
    const rating = Number(formData.get('rating'));

    const reviewEntry = formData.get('review_image') as File;
    const reviewFile = reviewEntry instanceof File && reviewEntry.size > 0 ? reviewEntry : null;

    let reviewUrl: string | null = null;

    if (reviewFile) {
      const folderName = 'desa-bakas/review';

      const bytes = await reviewFile.arrayBuffer();
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

      reviewUrl = res?.secure_url;
    }

    const data = await prisma.review_guesthouse.create({
      data: {
        user_id,
        guesthouse_id,
        guesthouse_transaction_id,
        impression,
        rating,
        review_image: reviewUrl,
      },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error creating guesthouse:', error);
    return NextResponse.json({ error: 'Failed to create Guesthouse' }, { status: 500 });
  }
}
