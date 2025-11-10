'use client'

import { guestHouses } from '@/lib/mockdata';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'

export default function Page() {
  const router = useRouter();
  const { id } = useParams(); // ✅ App Router
  const house = guestHouses.find((h) => h.id === Number(id));

  const [formData, setFormData] = useState({
    name: "",
    country: "",
    age: "",
    dateOfStay: "",
    untilDate: "",
    numberOfPeople: "",
    passport: null,
    contactNumber: "",
    impression: "",
  });

  if (!house) {
    return (
      <p className="text-center py-20 text-gray-500 text-lg">Loading...</p>
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
    console.log("Form submitted:", formData);
    alert("Booking submitted successfully!");
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* ✅ Navbar */}
      <nav className="flex justify-between items-center p-6 border-b">
        <div
          className="text-2xl font-serif cursor-pointer"
          onClick={() => router.push("/")}
        >
          Bakas
        </div>
        <button
          onClick={() => router.push("/")}
          className="text-sm text-gray-700 hover:opacity-70"
        >
          Guest House
        </button>
      </nav>

      {/* ✅ Title */}
      <h1 className="text-3xl font-serif mt-10 mb-5 px-6">{house.name}</h1>

      {/* ✅ Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6">
        <div className="md:col-span-2 h-[420px] rounded-xl overflow-hidden">
          <Image
            src={house.mainImage}
            width={900}
            height={600}
            alt={house.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-4">
          {house.images.slice(1, 3).map((img, i) => (
            <div key={i} className="h-[200px] rounded-xl overflow-hidden">
              <Image
                src={img}
                width={500}
                height={300}
                alt={"gallery-" + i}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Property Location */}
      <div className="px-6 mt-6">
        <h2 className="text-[13px] text-gray-600">
          <span className="text-blue-600 font-semibold tracking-wide">
            PROPERTY LOCATION
          </span>{" "}
          - {house.propertyLocation}
        </h2>
      </div>

      {/* ✅ Content layout */}
      <div className="grid md:grid-cols-2 gap-10 px-6 mt-8">
        {/* Left: description */}
        <p className="text-gray-700 text-[14px] leading-7 text-justify">
          {house.location}
        </p>

        {/* Right: facilities & map */}
        <div>
          <h3 className="text-lg font-semibold mb-3">FACILITIES</h3>

          <div className="grid grid-cols-2 gap-4 mb-3">
            {house.facilities.map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center py-4 rounded-lg hover:bg-gray-100 transition"
              >
                <span className="text-4xl">{item.icon}</span>
                <span className="text-xs mt-2">{item.label}</span>
              </div>
            ))}
          </div>

          {house.mapUrl && (
            <div className="rounded-xl overflow-hidden shadow-md mt-4">
              <iframe
                src={house.mapUrl}
                width="100%"
                height="260"
                loading="lazy"
                className="border-0"
              ></iframe>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Booking Form */}
      <div className="bg-gray-50 mt-14 px-6 py-10 border-t">
        <h2 className="text-2xl font-semibold mb-6">
          Please fill in your personal details.
        </h2>

        <form
          onSubmit={handleSubmit}
          className="max-w-3xl space-y-6"
        >
          {/* Row 1 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold">Name</label>
              <input
                type="text"
                name="name"
                className="mt-1 w-full p-3 border rounded-lg"
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Country</label>
              <input
                type="text"
                name="country"
                className="mt-1 w-full p-3 border rounded-lg"
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold">Age</label>
              <input
                type="number"
                name="age"
                className="mt-1 w-full p-3 border rounded-lg"
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Date of stay</label>
              <input
                type="date"
                name="dateOfStay"
                className="mt-1 w-full p-3 border rounded-lg"
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Until the date</label>
              <input
                type="date"
                name="untilDate"
                className="mt-1 w-full p-3 border rounded-lg"
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold">Number of people</label>
              <input
                type="number"
                name="numberOfPeople"
                className="mt-1 w-full p-3 border rounded-lg"
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Passport</label>
              <input
                type="file"
                onChange={handleFileUpload}
                className="mt-1 block w-full border p-3 rounded-lg bg-white"
              />
            </div>
          </div>

          {/* Row 4 */}
          <div>
            <label className="text-sm font-semibold">Contact number</label>
            <input
              type="text"
              name="contactNumber"
              className="mt-1 w-full p-3 border rounded-lg"
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Row 5 */}
          <div>
            <label className="text-sm font-semibold">Share your impression</label>
            <textarea
              name="impression"
              rows={4}
              className="mt-1 w-full p-3 border rounded-lg"
              onChange={handleInputChange}
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-4 px-6 py-3 bg-orange-500 text-white rounded-full shadow-md hover:bg-orange-600 transition"
          >
            send
          </button>
        </form>
      </div>
    </div>
  )
}
