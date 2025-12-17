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

  const skip = (page - 1) * pageSize;

  const where: Prisma.guesthouseWhereInput = {};

  if (searchQuery) {
    where.OR = [{ guesthouse_name: { contains: searchQuery, mode: 'insensitive' } }];
  }

  try {
    const [data, totalCount] = await Promise.all([
      prisma.guesthouse.findMany({
        take: pageSize,
        skip,
        where,
      }),
      prisma.guesthouse.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return NextResponse.json({
      data,
      totalCount,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch booking data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const guesthouseName = formData.get('guesthouse_name') as string;
    const guesthouseLocation = formData.get('guesthouse_location') as string;
    const price = Number(formData.get('price'));
    const guesthouseMapUrl = formData.get('guesthouse_map_url') as string;
    const guesthouseDescription = formData.get('guesthouse_description') as string;
    const guesthouseEntries = formData.getAll('guesthouse_images');

    const validImageFiles = guesthouseEntries.filter(
      (entry): entry is File => entry instanceof File && entry.size > 0
    );

    let guesthouseImageUrls: string[] = [];

    if (validImageFiles.length > 0) {
      const uploadPromises = validImageFiles.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        return new Promise<string>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'desa-bakas/guesthouse',
            },
            (error, result) => {
              if (error) return reject(error);
              if (result?.secure_url) {
                resolve(result.secure_url);
              } else {
                reject(new Error('Upload failed: No secure_url returned'));
              }
            }
          );

          uploadStream.end(buffer);
        });
      });

      guesthouseImageUrls = await Promise.all(uploadPromises);
    }

    const data = await prisma.guesthouse.create({
      data: {
        guesthouse_name: guesthouseName,
        guesthouse_location: guesthouseLocation,
        price,
        guesthouse_map_url: guesthouseMapUrl,
        guesthouse_description: guesthouseDescription,
        guesthouse_images: guesthouseImageUrls,
      },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error creating guesthouse:', error);
    return NextResponse.json({ error: 'Failed to create Guesthouse' }, { status: 500 });
  }
}
