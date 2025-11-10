'use client';

import React, { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { guestHouses } from '@/lib/mockdata';

import AddFormPage from '../components/add-form-page';

export default function Page() {
  const { id } = useParams(); // ✅ App Router
  const house = guestHouses.find((h) => h.id === Number(id));

  if (!house) {
    return (
      <p className="py-20 text-center text-lg text-gray-500">Loading...</p>
    );
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
        <h1 className="font-serif text-3xl">{house.name}</h1>

        <hr className="" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="h-[420px] overflow-hidden rounded-xl md:col-span-2">
            <Image
              src={house.mainImage}
              width={900}
              height={600}
              alt={house.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-4">
            {house.images.slice(1, 3).map((img, i) => (
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

        <div className="mt-8 grid grid-cols-8 gap-4">
          <div className="col-span-5 space-y-2">
            <h2 className="text-muted-foreground text-[13px]">
              <span className="text-primary font-semibold tracking-wide">
                PROPERTY LOCATION
              </span>{' '}
              - {house.propertyLocation}
            </h2>

            <p>{house.location}</p>
          </div>

          <div className="col-span-3 w-full space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">FACILITIES</h3>

              <hr />

              <div className="grid cursor-pointer grid-cols-4 items-center justify-center gap-4 rounded-xl">
                {house.facilities.map((item, i) => (
                  <div
                    key={i}
                    className="hover:bg-primary/10 flex flex-col items-center justify-center rounded-lg py-4 transition">
                    <span className="text-4xl">{item.icon}</span>
                    <span className="mt-2 text-center text-xs">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <hr />
            </div>

            <div className="overflow-hidden rounded-xl shadow-md">
              <iframe
                src={house.mapUrl}
                width="100%"
                height="260"
                loading="lazy"
                className="border-0"></iframe>
            </div>
          </div>
        </div>
      </div>

      <AddFormPage />
    </section>
  );
}
