import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { getBaseUrl } from '@/lib/utils';
import { guesthouse } from '@prisma/client';
import axios from 'axios';
import { ArrowDown } from 'lucide-react';

import AuthButton from '@/components/custom/auth-button';
import Navbar from '@/components/custom/navbar';
import { Input } from '@/components/ui/input';

export default async function Home() {
  const session = await auth();

  if (session?.user.role === 'admin') {
    redirect('/dashboard');
  }

  let data: guesthouse[] = [];

  try {
    const baseUrl = getBaseUrl();

    const response = await axios.get(`${baseUrl}/api/guesthouse`, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });

    data = response.data.data;
  } catch (error) {
    console.error('Failed to fetch data via API:', error);
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar>
        <AuthButton />
      </Navbar>

      {/* HERO */}
      <section
        className="relative h-screen rounded-br-[250px] border-b bg-cover bg-center bg-no-repeat shadow-2xl"
        style={{ backgroundImage: "url('/sawah_bakas.png')" }}>
        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center text-white">
          <h1 className="font-serif text-6xl font-bold tracking-widest md:text-[150px]">BAKAS</h1>
          <p className="max-w-xl text-center font-sans text-sm leading-relaxed text-white">
            Bakas Village is one of 13 villages located in the Banjarangkan District, Klungkung
            Regency, Bali Province. Geographically, Bakas Village has the following boundaries: To
            the north, it borders Nyalian Village. To the east, it borders Tukad Bubuh, which is
            part of the Klungkung District. South: borders Tusan Village. West: borders Tukad
            Melangit, still within the Banjarangkan Subdistrict.
          </p>
        </div>

        {/* Scroll Indicator */}
        <Link
          href="#content"
          className="absolute bottom-20 left-10 animate-bounce cursor-pointer text-white">
          <ArrowDown />
        </Link>
      </section>

      <main
        id="content"
        className="container space-y-6 py-24">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <h2 className="text-primary font-serif text-2xl font-bold md:text-3xl">
            Available Guest House
          </h2>

          <Input
            type="text"
            placeholder="search location"
            // value={searchQuery}
            // onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg px-4 py-3 md:w-80"
          />
        </div>

        {/* ✅ GRID */}
        <div className="grid gap-12 md:grid-cols-2">
          {data.map((house) => (
            <Link
              href={`/guesthouse/${house.guesthouse_id}`}
              key={house.guesthouse_id}
              className="cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all hover:shadow-2xl">
              <div className="h-72 overflow-hidden">
                <Image
                  src={house.guesthouse_images[0]}
                  alt={house.guesthouse_name}
                  width={600}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              <div className="p-8">
                <h3 className="mb-3 text-xl font-semibold">{house.guesthouse_name}</h3>
                <p className="text-card-foreground line-clamp-4 text-sm leading-relaxed">
                  {house.guesthouse_location}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
