import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function getBooking(
  currentPage: number,
  pageSize: number = 10,
  searchQuery?: string,
  guesthouseQuery?: string
) {
  const skip = (currentPage - 1) * pageSize;

  const where: Prisma.guesthouse_transactionWhereInput = {};

  if (searchQuery) {
    where.OR = [
      {
        guesthouse: {
          guesthouse_name: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        },
      },
    ];
  }

  if (guesthouseQuery) {
    where.guesthouse = {
      guesthouse_name: { equals: guesthouseQuery, mode: 'insensitive' },
    };
  }

  const [data, totalCount] = await Promise.all([
    prisma.guesthouse_transaction.findMany({
      take: pageSize,
      skip,
      where,
      include: {
        guesthouse: true,
        user: true,
        kuisioner_guesthouse: true,
        review_guesthouse: true,
      },
    }),
    prisma.guesthouse_transaction.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data,
    totalCount,
    totalPages,
  };
}
