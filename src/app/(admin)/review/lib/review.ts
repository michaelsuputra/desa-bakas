import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function getReview(
  currentPage: number,
  pageSize: number = 10,
  searchQuery?: string,
  guesthouseQuery?: string
) {
  const skip = (currentPage - 1) * pageSize;

  const where: Prisma.review_guesthouseWhereInput = {};

  if (searchQuery) {
    where.OR = [
      { guesthouse: { guesthouse_name: { contains: searchQuery, mode: 'insensitive' } } },
    ];
  }

  if (guesthouseQuery) {
    where.guesthouse = {
      guesthouse_name: { equals: guesthouseQuery, mode: 'insensitive' },
    };
  }

  const [data, totalCount] = await Promise.all([
    prisma.review_guesthouse.findMany({
      take: pageSize,
      skip,
      where,
      include: {
        guesthouse: true,
      },
    }),
    prisma.review_guesthouse.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data,
    totalCount,
    totalPages,
  };
}
