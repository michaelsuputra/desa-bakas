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

  const where: Prisma.news_eventWhereInput = {};

  if (searchQuery) {
    where.OR = [{ title: { contains: searchQuery, mode: 'insensitive' } }];
  }

  try {
    const [data, totalCount] = await Promise.all([
      prisma.news_event.findMany({
        take: pageSize,
        skip,
        where,
        orderBy: {
          created_at: 'desc',
        },
      }),
      prisma.news_event.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return NextResponse.json({
      data,
      totalCount,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news event data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const category = formData.get('category') as 'NEWS' | 'EVENT';
    const content = formData.get('content') as string;

    let location: string | null = null;
    let eventDate: Date | null = null;

    if (category === 'EVENT') {
      location = formData.get('location') as string;
      const dateString = formData.get('event_date') as string;
      if (dateString) {
        eventDate = new Date(dateString);
      } else {
        return NextResponse.json({ error: 'Event date is required for events' }, { status: 400 });
      }
    }

    const guesthouseEntries = formData.getAll('image_url');
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
              folder: 'desa-bakas/newsevent',
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

    const data = await prisma.news_event.create({
      data: {
        title,
        category,
        content,
        location,
        event_date: eventDate,
        image_url: guesthouseImageUrls,
      },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error creating guesthouse:', error);
    return NextResponse.json({ error: 'Failed to create News Event' }, { status: 500 });
  }
}
