import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const guesthouse_id = formData.get('guesthouse_id') as string;

    // create user
    const fullname = formData.get('fullname') as string;
    const email = formData.get('email') as string;
    const password = 'pa$$word123';

    // kuisioner fill
    const age = Number(formData.get('age'));
    const number_of_people = Number(formData.get('number_of_people'));
    const contact = formData.get('contact') as string;
    const country = formData.get('country') as string;
    const country_flag = formData.get('country_flag') as string;
    const date_of_stay = formData.get('date_of_stay') as Date | string;
    const date_of_checkout = formData.get('date_of_checkout') as Date | string;
    const booking_at = formData.get('booking_at') as string;
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

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (user)
      throw new Error('Email already exists, please use another email or login to platform');

    user = await prisma.user.create({
      data: {
        fullname,
        email,
        password,
        role: 'wisatawan',
      },
    });

    console.log({ 'Success create user': user });

    const kuisioner = await prisma.kuisioner_guesthouse.create({
      data: {
        guesthouse_id,
        user_id: user.user_id,
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

    console.log({ 'Success create kuisioner': kuisioner });

    return NextResponse.json({ success: true, user, kuisioner });
  } catch (error) {
    console.error('Error create kuisioner', error);
    return NextResponse.json({ error: 'Failed to create kuisioner' }, { status: 500 });
  }
}
