'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { guestHouses } from '@/lib/mockdata';
import { ArrowDown } from 'lucide-react';

import Navbar from '@/components/custom/navbar';
import { Input } from '@/components/ui/input';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHouses, setFilteredHouses] = useState(guestHouses);

  useEffect(() => {
    const filtered = guestHouses.filter(
      (house) =>
        house.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        house.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredHouses(filtered);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section
        className="relative h-screen rounded-br-[250px] border-b bg-cover bg-center bg-no-repeat shadow-2xl"
        style={{ backgroundImage: "url('/sawah_bakas.png')" }}>
        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center text-white">
          <h1 className="font-serif text-6xl font-bold tracking-widest md:text-[150px]">
            BAKAS
          </h1>
          <p className="max-w-xl text-center font-sans text-sm leading-relaxed text-white">
            Bakas Village is one of 13 villages located in the Banjarangkan
            District, Klungkung Regency, Bali Province. Geographically, Bakas
            Village has the following boundaries: To the north, it borders
            Nyalian Village. To the east, it borders Tukad Bubuh, which is part
            of the Klungkung District. South: borders Tusan Village. West:
            borders Tukad Melangit, still within the Banjarangkan Subdistrict.
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg px-4 py-3 md:w-80"
          />
        </div>

        {/* ✅ GRID */}
        <div className="grid gap-12 md:grid-cols-2">
          {filteredHouses.map((house) => (
            <Link
              href={`/guesthouse/${house.id}`}
              key={house.id}
              className="cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all hover:shadow-2xl">
              <div className="h-72 overflow-hidden">
                <Image
                  src={house.mainImage}
                  alt={house.name}
                  width={600}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              <div className="p-8">
                <h3 className="mb-3 text-xl font-semibold">{house.name}</h3>
                <p className="text-card-foreground line-clamp-4 text-sm leading-relaxed">
                  {house.location}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
