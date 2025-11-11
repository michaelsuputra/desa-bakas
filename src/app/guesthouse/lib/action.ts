'use server';

import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function bookGuestHouse(formData: FormData) {
  try {
    const guesthouse_name = formData.get('guesthouse_name') as string;
    const fullname = formData.get('fullname') as string;
    const age = Number(formData.get('age'));
    const number_of_people = Number(formData.get('number_of_people'));
    const contact = formData.get('contact') as string;
    const country = formData.get('country') as string;
    const country_flag = formData.get('country_flag') as string;
    const date_of_stay = formData.get('date_of_stay') as string;
    const date_of_checkout = formData.get('date_of_checkout') as string;
    const booking_at = formData.get('booking_at') as string;
    const impression = formData.get('impression') as string;

    const passportEntry = formData.get('passport') as File;
    const passportFile =
      passportEntry instanceof File && passportEntry.size > 0
        ? passportEntry
        : null;

    let passportUrl: string | null = null;

    if (passportFile) {
      const folderName = 'desa-bakas/passport';

      const bytes = await passportFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const res: { secure_url: string } = await new Promise(
        (resolve, reject) => {
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
        }
      );

      passportUrl = res?.secure_url;
    }

    const data = await prisma.kuisioner_guesthouse.create({
      data: {
        guesthouse_name,
        fullname,
        age,
        number_of_people,
        contact,
        country,
        country_flag,
        date_of_stay,
        date_of_checkout,
        passport: passportUrl,
        booking_at,
        impression,
      },
    });

    console.log(data);

    return { success: true };
  } catch (error) {
    return {
      message: 'Unable to complete the action. Please try again',
      error: error,
      success: false,
    };
  }
}
