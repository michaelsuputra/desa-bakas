'use client';

import React, { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { guestHouses } from '@/lib/mockdata';

export default function Page() {
  const router = useRouter();
  const { id } = useParams(); // ✅ App Router
  const house = guestHouses.find((h) => h.id === Number(id));

  const [formData, setFormData] = useState({
    name: '',
    country: '',
    age: '',
    dateOfStay: '',
    untilDate: '',
    numberOfPeople: '',
    passport: null,
    contactNumber: '',
    impression: '',
  });

  if (!house) {
    return (
      <p className="py-20 text-center text-lg text-gray-500">Loading...</p>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, passport: file }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Booking submitted successfully!');
  };

  return (
    <section className="min-h-screen w-full bg-white">
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

      <div className="container">
        <h1 className="mt-10 mb-5 font-serif text-3xl">{house.name}</h1>

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

        {/* ✅ Property Location */}
        <div className="mt-6">
          <h2 className="text-[13px] text-gray-600">
            <span className="text-primary font-semibold tracking-wide">
              PROPERTY LOCATION
            </span>{' '}
            - {house.propertyLocation}
          </h2>
        </div>

        {/* ✅ Content layout */}
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          {/* Left: description */}
          <p className="text-justify text-[14px] leading-7 text-gray-700">
            {house.location}
          </p>

          {/* Right: facilities & map */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">FACILITIES</h3>

            <div className="mb-3 grid grid-cols-2 gap-4">
              {house.facilities.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center rounded-lg py-4 transition hover:bg-gray-100">
                  <span className="text-4xl">{item.icon}</span>
                  <span className="mt-2 text-xs">{item.label}</span>
                </div>
              ))}
            </div>

            {house.mapUrl && (
              <div className="mt-4 overflow-hidden rounded-xl shadow-md">
                <iframe
                  src={house.mapUrl}
                  width="100%"
                  height="260"
                  loading="lazy"
                  className="border-0"></iframe>
              </div>
            )}
          </div>
        </div>

        {/* ✅ Booking Form */}
        <div className="mt-14 border-t bg-gray-50 py-10">
          <h2 className="mb-6 text-2xl font-semibold">
            Please fill in your personal details.
          </h2>

          <form
            onSubmit={handleSubmit}
            className="max-w-3xl space-y-6">
            {/* Row 1 */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-semibold">Name</label>
                <input
                  type="text"
                  name="name"
                  className="mt-1 w-full rounded-lg border p-3"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Country</label>
                <input
                  type="text"
                  name="country"
                  className="mt-1 w-full rounded-lg border p-3"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-semibold">Age</label>
                <input
                  type="number"
                  name="age"
                  className="mt-1 w-full rounded-lg border p-3"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Date of stay</label>
                <input
                  type="date"
                  name="dateOfStay"
                  className="mt-1 w-full rounded-lg border p-3"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Until the date</label>
                <input
                  type="date"
                  name="untilDate"
                  className="mt-1 w-full rounded-lg border p-3"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-semibold">
                  Number of people
                </label>
                <input
                  type="number"
                  name="numberOfPeople"
                  className="mt-1 w-full rounded-lg border p-3"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Passport</label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="mt-1 block w-full rounded-lg border bg-white p-3"
                />
              </div>
            </div>

            {/* Row 4 */}
            <div>
              <label className="text-sm font-semibold">Contact number</label>
              <input
                type="text"
                name="contactNumber"
                className="mt-1 w-full rounded-lg border p-3"
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Row 5 */}
            <div>
              <label className="text-sm font-semibold">
                Share your impression
              </label>
              <textarea
                name="impression"
                rows={4}
                className="mt-1 w-full rounded-lg border p-3"
                onChange={handleInputChange}></textarea>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="mt-4 rounded-full bg-orange-500 py-3 text-white shadow-md transition hover:bg-orange-600">
              send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
