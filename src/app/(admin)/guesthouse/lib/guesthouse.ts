import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function getGuesthouse(
  currentPage: number,
  pageSize: number = 10,
  searchQuery?: string
) {
  const skip = (currentPage - 1) * pageSize;

  const where: Prisma.guesthouseWhereInput = {};

  if (searchQuery) {
    where.OR = [{ guesthouse_name: { contains: searchQuery, mode: 'insensitive' } }];
  }

  const [data, totalCount] = await Promise.all([
    prisma.guesthouse.findMany({
      take: pageSize,
      skip,
      where,
    }),
    prisma.guesthouse.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data,
    totalCount,
    totalPages,
  };
}
