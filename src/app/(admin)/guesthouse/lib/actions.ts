'use server';

import { revalidatePath } from 'next/cache';

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

export async function updateGuestHouse(prevState: any, formData: FormData) {
  try {
    const guesthouseId = formData.get('guesthouse_id') as string;
    const guesthouseName = formData.get('guesthouse_name') as string;
    const guesthouseLocation = formData.get('guesthouse_location') as string;
    const guesthouseMapUrl = formData.get('guesthouse_map_url') as string;
    const guesthouseDescription = formData.get('guesthouse_description') as string;

    if (!guesthouseId) {
      return { success: false, error: { message: 'Guesthouse ID is required' } };
    }

    const guesthouseEntries = formData.getAll('guesthouse_images');
    const validImageFiles = guesthouseEntries.filter(
      (entry): entry is File => entry instanceof File && entry.size > 0
    );

    let dataToUpdate: any = {
      guesthouse_name: guesthouseName,
      guesthouse_location: guesthouseLocation,
      guesthouse_map_url: guesthouseMapUrl,
      guesthouse_description: guesthouseDescription,
    };

    // Hanya upload dan update gambar jika user memilih file baru
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

      const guesthouseImageUrls = await Promise.all(uploadPromises);
      dataToUpdate.guesthouse_images = guesthouseImageUrls;
    }

    await prisma.guesthouse.update({
      where: {
        guesthouse_id: guesthouseId,
      },
      data: dataToUpdate,
    });

    revalidatePath('/guesthouse');
    return { success: true, message: 'Guesthouse updated successfully' };
  } catch (error) {
    console.error('Update Error:', error);
    if (error instanceof Error) {
      return { success: false, error: { message: error.message } };
    }
    return { success: false, error: { message: 'Something went wrong during update' } };
  }
}

export async function deleteGuestHouse(guesthouseId: string) {
  try {
    await prisma.guesthouse.delete({
      where: {
        guesthouse_id: guesthouseId,
      },
    });
    revalidatePath('/guesthouse');
    return { success: true, message: 'Guesthouse deleted successfully' };
  } catch (error) {
    console.error('Delete Error:', error);
    if (error instanceof Error) {
      return { success: false, error: { message: error.message } };
    }
    return { success: false, error: { message: 'Something went wrong during delete' } };
  }
}
