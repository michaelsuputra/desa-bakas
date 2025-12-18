import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const newsEvent = await prisma.news_event.findUnique({
      where: { id },
    });

    if (!newsEvent) {
      return NextResponse.json({ success: false, error: 'Data not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: newsEvent });
  } catch (error) {
    console.error('Error fetching news/event detail:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const formData = await request.formData();

    // 1. Ambil Data Text
    const title = formData.get('title') as string;
    const category = formData.get('category') as 'NEWS' | 'EVENT';
    const content = formData.get('content') as string;

    // 2. Logic Kategori (News vs Event)
    let location: string | null = null;
    let eventDate: Date | null = null;

    if (category === 'EVENT') {
      location = formData.get('location') as string;
      const dateString = formData.get('event_date') as string;
      if (dateString) {
        eventDate = new Date(dateString);
      }
    }
    // Jika berubah jadi NEWS, location & eventDate otomatis null

    // 3. Logic Gambar
    const imageEntries = formData.getAll('image_url');
    const newImageFiles = imageEntries.filter(
      (entry): entry is File => entry instanceof File && entry.size > 0
    );

    let finalImageUrls: string[] = [];

    if (newImageFiles.length > 0) {
      // KASUS A: User upload gambar baru
      const uploadPromises = newImageFiles.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        return new Promise<string>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'desa-bakas/newsevent' },
            (error, result) => {
              if (error) return reject(error);
              if (result?.secure_url) resolve(result.secure_url);
              else reject(new Error('Upload failed'));
            }
          );
          uploadStream.end(buffer);
        });
      });

      finalImageUrls = await Promise.all(uploadPromises);
    } else {
      // KASUS B: User tidak upload gambar (pakai gambar lama)
      // Ambil data lama dari DB
      const existingData = await prisma.news_event.findUnique({
        where: { id },
        select: { image_url: true },
      });
      finalImageUrls = existingData?.image_url || [];
    }

    // 4. Update Database
    const updatedData = await prisma.news_event.update({
      where: { id },
      data: {
        title,
        category,
        content,
        location, // Akan null jika NEWS
        event_date: eventDate, // Akan null jika NEWS
        image_url: finalImageUrls,
      },
    });

    return NextResponse.json({ success: true, data: updatedData });
  } catch (error) {
    console.error('Error updating news/event:', error);
    return NextResponse.json({ success: false, error: 'Failed to update data' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await prisma.news_event.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'News Event berhasil dihapus',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menghapus data',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
