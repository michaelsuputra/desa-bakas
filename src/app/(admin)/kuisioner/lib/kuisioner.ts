import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function getKuisioner(
  currentPage: number,
  pageSize: number = 10,
  searchQuery?: string,
  bookingQuery?: string,
  countryQuery?: string
) {
  const skip = (currentPage - 1) * pageSize;

  const where: Prisma.kuisioner_guesthouseWhereInput = {};

  if (searchQuery) {
    where.OR = [
      { fullname: { contains: searchQuery, mode: 'insensitive' } },
      { guesthouse_name: { contains: searchQuery, mode: 'insensitive' } },
    ];
  }

  if (bookingQuery) {
    where.booking_at = { contains: bookingQuery, mode: 'insensitive' };
  }

  if (countryQuery) {
    where.country = { contains: countryQuery, mode: 'insensitive' };
  }

  const [data, totalCount] = await Promise.all([
    prisma.kuisioner_guesthouse.findMany({
      take: pageSize,
      skip,
      where,
    }),
    prisma.kuisioner_guesthouse.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data,
    totalCount,
    totalPages,
  };
}

export async function getUniqueBooking() {
  const uniqueOrder = await prisma.kuisioner_guesthouse.findMany({
    where: {
      booking_at: { not: null },
    },
    distinct: ['booking_at'],
    select: {
      booking_at: true,
    },
  });

  return uniqueOrder
    .map((item) => item.booking_at)
    .filter((b): b is string => b !== null)
    .sort();
}

export async function getUniqueCountry() {
  const uniqueOrder = await prisma.kuisioner_guesthouse.findMany({
    where: {
      country: { not: null },
    },
    distinct: ['country'],
    select: {
      country: true,
    },
  });

  return uniqueOrder
    .map((item) => item.country)
    .filter((b): b is string => b !== null)
    .sort();
}
