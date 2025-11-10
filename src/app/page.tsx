'use client'

import { guestHouses } from "@/lib/mockdata";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredHouses, setFilteredHouses] = useState(guestHouses);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  // Search filter
  useEffect(() => {
    const filtered = guestHouses.filter(house =>
      house.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      house.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredHouses(filtered);
  }, [searchQuery]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll
  const scrollToContent = () => {
    const content = document.getElementById("content");
    if (content) content.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={`min-h-screen`}>

      {/* ✅ HERO */}
      <section className="relative h-screen bg-cover bg-center bg-no-repeat rounded-br-[250px]"
        style={{ backgroundImage: "url('/sawah_bakas.png')" }}
      >
        {/* Navbar */}
        <nav
          className={`fixed top-0 w-full flex justify-between items-center px-6 md:px-14 py-6 z-50 transition-all 
              ${scrolled ? "bg-white/20 backdrop-blur-md shadow-lg" : "bg-transparent"}`}
        >
          <Link href='/' className="text-white text-2xl md:text-3xl font-light tracking-[3px] font-serif">Bakas</Link>
          <div className="text-white text-sm tracking-widest">Guest House</div>
        </nav>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-8">
          <h1 className="font-serif text-[60px] md:text-[150px] tracking-[20px] font-light">
            BAKAS
          </h1>
          <p className="max-w-xl text-sm opacity-90 leading-relaxed -mt-1 md:-mt-10">
            Bakas Village is one of 13 villages located in the Banjarangkan District, Klungkung Regency, Bali Province.  Geographically, Bakas Village has the following boundaries: To the north, it borders Nyalian Village.
            To the east, it borders Tukad Bubuh, which is part of the Klungkung District.
            South: borders Tusan Village. West: borders Tukad Melangit, still within the Banjarangkan Subdistrict.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div
          onClick={scrollToContent}
          className="absolute bottom-20 left-10 text-white text-4xl cursor-pointer animate-bounce"
        >
          ↓
        </div>
      </section>

      {/* ✅ CONTENT */}
      <main id="content" className="max-w-7xl space-y-6 pt-12 mx-auto px-6 md:px-10 bg-white rounded-3xl">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-6 ">
          <h2 className="text-2xl md:text-3xl font-bold text-orange-500 font-serif">Available Guest House</h2>

          <input
            type="text"
            placeholder="search location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 px-4 py-3 rounded-lg w-full md:w-80 bg-gray-50 focus:ring-2 focus:ring-orange-300 outline-none"
          />
        </div>

        {/* ✅ GRID */}
        <div className="grid md:grid-cols-2 gap-12">
          {filteredHouses.map((house) => (
            <div
              key={house.id}
              onClick={() => router.push(`/guesthouse/${house.id}`)}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer border border-gray-100"
            >
              <div className="h-72 overflow-hidden">
                <Image
                  src={house.mainImage}
                  alt={house.name}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-8">
                <h3 className="font-serif text-xl mb-3">{house.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
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
