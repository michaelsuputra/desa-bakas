import Image from 'next/image';
import Link from 'next/link';

import { guestHouses } from '@/lib/mockdata';
import { prisma } from '@/lib/prisma';

import AddFormPage from '../components/add-form-page';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const guesthouse = await prisma.guesthouse.findUnique({
    where: {
      guesthouse_id: id,
    },
  });

  if (!guesthouse) {
    return <p className="py-20 text-center text-lg text-gray-500">Loading...</p>;
  }

  return (
    <section className="w-full space-y-8 bg-white pb-20">
      <nav className="flex items-center justify-center border-b bg-white">
        <div className="container flex items-center justify-between py-6">
          <Link
            href="/"
            className="text-primary font-serif text-2xl font-light tracking-wider md:text-3xl">
            Bakas
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-700 hover:opacity-70">
            Guest House
          </Link>
        </div>
      </nav>

      <div className="container space-y-6">
        <h1 className="font-serif text-3xl">{guesthouse.guesthouse_name}</h1>

        <hr />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="h-[420px] overflow-hidden rounded-xl md:col-span-2">
            <Image
              src={guesthouse.guesthouse_images[0]}
              width={900}
              height={600}
              alt={guesthouse.guesthouse_name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-4">
            {guesthouse.guesthouse_images.slice(1, 3).map((img, i) => (
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
              <span className="text-primary font-semibold tracking-wide">PROPERTY LOCATION</span> -{' '}
              {guesthouse.guesthouse_location}
            </h2>

            <p>{guesthouse.guesthouse_description}</p>
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
                src={guesthouse.guesthouse_map_url}
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

      <AddFormPage guesthouseId={guesthouse.guesthouse_id} />
    </section>
  );
}
