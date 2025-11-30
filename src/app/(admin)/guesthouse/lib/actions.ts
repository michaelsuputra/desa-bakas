'use server';

import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function addGuestHouse(formData: FormData) {
  try {
    const guesthouseName = formData.get('guesthouse_name') as string;
    const guesthouseLocation = formData.get('guesthouse_location') as string;
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
        guesthouse_map_url: guesthouseMapUrl,
        guesthouse_description: guesthouseDescription,
        guesthouse_images: guesthouseImageUrls,
      },
    });

    console.log(data);

    return { success: true };
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      return { error: { message: error.message }, success: false };
    }

    return { error: { message: 'Something went wrong' }, success: false };
  }
}
