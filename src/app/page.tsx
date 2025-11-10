'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { guestHouses } from '@/lib/mockdata';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHouses, setFilteredHouses] = useState(guestHouses);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  // Search filter
  useEffect(() => {
    const filtered = guestHouses.filter(
      (house) =>
        house.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        house.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredHouses(filtered);
  }, [searchQuery]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll
  const scrollToContent = () => {
    const content = document.getElementById('content');
    if (content) content.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen`}>
      {/* ✅ HERO */}
      <section
        className="relative h-screen rounded-br-[250px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/sawah_bakas.png')" }}>
        {/* Navbar */}
        <nav
          className={`fixed top-0 z-50 flex w-full items-center justify-between px-6 py-6 transition-all md:px-14 ${scrolled ? 'bg-white/20 shadow-lg backdrop-blur-md' : 'bg-transparent'}`}>
          <Link
            href="/"
            className="font-serif text-2xl font-light tracking-[3px] text-white md:text-3xl">
            Bakas
          </Link>
          <div className="text-sm tracking-widest text-white">Guest House</div>
        </nav>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center text-white">
          <h1 className="font-serif text-[60px] font-light tracking-[20px] md:text-[150px]">
            BAKAS
          </h1>
          <p className="-mt-1 max-w-xl text-sm leading-relaxed opacity-90 md:-mt-10">
            Bakas Village is one of 13 villages located in the Banjarangkan
            District, Klungkung Regency, Bali Province. Geographically, Bakas
            Village has the following boundaries: To the north, it borders
            Nyalian Village. To the east, it borders Tukad Bubuh, which is part
            of the Klungkung District. South: borders Tusan Village. West:
            borders Tukad Melangit, still within the Banjarangkan Subdistrict.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div
          onClick={scrollToContent}
          className="absolute bottom-20 left-10 animate-bounce cursor-pointer text-4xl text-white">
          ↓
        </div>
      </section>

      {/* ✅ CONTENT */}
      <main
        id="content"
        className="mx-auto max-w-7xl space-y-6 rounded-3xl bg-white px-6 pt-12 md:px-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-6">
          <h2 className="font-serif text-2xl font-bold text-orange-500 md:text-3xl">
            Available Guest House
          </h2>

          <input
            type="text"
            placeholder="search location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300 md:w-80"
          />
        </div>

        {/* ✅ GRID */}
        <div className="grid gap-12 md:grid-cols-2">
          {filteredHouses.map((house) => (
            <div
              key={house.id}
              onClick={() => router.push(`/guesthouse/${house.id}`)}
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
                <h3 className="mb-3 font-serif text-xl">{house.name}</h3>
                <p className="line-clamp-4 text-sm leading-relaxed text-gray-600">
                  {house.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
