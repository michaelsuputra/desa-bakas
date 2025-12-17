import { prisma } from '@/lib/prisma';

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
