import Image from 'next/image';

import { auth } from '@/auth';
import { guestHouses } from '@/lib/mockdata';
import { getBaseUrl } from '@/lib/utils';
import { guesthouse } from '@prisma/client';
import axios from 'axios';

import AuthButton from '@/components/custom/auth-button';
import Navbar from '@/components/custom/navbar';

import CheckoutForm from '../components/checkout-form';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  let guesthouseData: guesthouse | null = null;

  try {
    const baseUrl = getBaseUrl();
    const response = await axios.get(`${baseUrl}/api/guesthouse/${id}`, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });

    if (response.data.success) {
      guesthouseData = response.data.data;
    }
  } catch (error) {
    console.error('Failed to fetch guesthouse data:', error);
  }

  if (!guesthouseData) {
    return <p className="py-20 text-center text-lg text-gray-500">Loading...</p>;
  }

  return (
    <section className="w-full space-y-8 bg-white pb-20">
      <Navbar>
        <AuthButton />
      </Navbar>

      <div className="container space-y-3 pt-32">
        <h1 className="font-serif text-3xl">{guesthouseData.guesthouse_name}</h1>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-10">
          <div className="col-span-1 space-y-6 lg:col-span-7">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="h-[420px] overflow-hidden rounded-xl md:col-span-2">
                <Image
                  src={guesthouseData.guesthouse_images[0]}
                  width={900}
                  height={600}
                  alt={guesthouseData.guesthouse_name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-4">
                {guesthouseData.guesthouse_images.slice(1, 3).map((img, i) => (
                  <div
                    key={i}
                    className="h-[200px] overflow-hidden rounded-xl">
                    <Image
                      src={img}
                      width={500}
                      height={300}
                      alt={'gallery-' + i}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-8">
              <div className="space-y-2 md:col-span-5">
                <h2 className="text-muted-foreground text-[13px]">
                  <span className="text-primary font-semibold tracking-wide">
                    PROPERTY LOCATION
                  </span>{' '}
                  - {guesthouseData.guesthouse_location}
                </h2>

                <p>{guesthouseData.guesthouse_description}</p>
              </div>

              <div className="w-full space-y-4 md:col-span-3">
                <div className="space-y-2">
                  <h3 className="font-semibold">FACILITIES</h3>

                  <hr />

                  <div className="grid cursor-pointer grid-cols-4 items-center justify-center gap-4 rounded-xl">
                    {guestHouses[0].facilities.map((item, i) => (
                      <div
                        key={i}
                        className="hover:bg-primary/10 flex flex-col items-center justify-center rounded-lg py-4 transition">
                        <span className="text-4xl">{item.icon}</span>
                        <span className="mt-2 text-center text-xs">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  <hr />
                </div>

                <div className="overflow-hidden rounded-xl bg-gray-100 shadow-md">
                  <iframe
                    src={guesthouseData.guesthouse_map_url}
                    width="100%"
                    height="260"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps"></iframe>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-3">
            <CheckoutForm
              session={session}
              data={guesthouseData}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
