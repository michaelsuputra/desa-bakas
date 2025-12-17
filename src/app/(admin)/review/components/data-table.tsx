import Image from 'next/image';

import { getBaseUrl } from '@/lib/utils';
import { Prisma, guesthouse } from '@prisma/client';
import axios from 'axios';

import SmartInput from '@/components/custom/smart-input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ImageZoom } from '@/components/ui/shadcn-io/image-zoom';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import SelectGuesthouse from '../../kuisioner/components/select-guesthouse';
import { PageProps } from '../page';

type ReviewData = Prisma.review_guesthouseGetPayload<{
  include: {
    guesthouse: true;
    user: true;
  };
}>;

export default async function DataTable({ searchParams }: PageProps) {
  const { search, page, guesthouse } = await searchParams;

  let data: ReviewData[] = [];
  let guesthousesList: guesthouse[] = [];
  let totalCount = 0;

  try {
    const baseUrl = getBaseUrl();

    const response = await axios.get(`${baseUrl}/api/review`, {
      params: {
        page: Number(page) || 1,
        limit: 10,
        search,
        guesthouse,
      },
      headers: {
        'Cache-Control': 'no-store',
      },
    });

    data = response.data.data;
    totalCount = response.data.totalCount;
  } catch (error) {
    console.error('Failed to fetch data via API:', error);
  }

  try {
    const baseUrl = getBaseUrl();

    const response = await axios.get(`${baseUrl}/api/guesthouse`, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });

    guesthousesList = response.data.data;
  } catch (error) {
    console.error('Failed to fetch guesthouses via API:', error);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <SmartInput
          placeholder="Search by guesthouse"
          query="search"
        />

        <SelectGuesthouse
          guesthouses={guesthousesList}
          currentGuesthouse={guesthouse}
        />
      </div>

      <ScrollArea className="w-full whitespace-nowrap">
        <ScrollBar orientation="horizontal" />
        <Table className="min-w-full">
          <TableCaption>List of reviews ({totalCount})</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Guesthouse</TableHead>
              <TableHead>User Fullname</TableHead>
              <TableHead>Impression</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((guesthouse: ReviewData) => (
              <TableRow key={guesthouse.review_id}>
                <TableCell>{guesthouse.guesthouse?.guesthouse_name}</TableCell>
                <TableCell>{guesthouse.user?.fullname}</TableCell>
                <TableCell>
                  <div className="line-clamp-4 max-w-[400px] text-pretty whitespace-normal">
                    {guesthouse.impression}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-primary font-bold">{guesthouse.rating}</span> out of 5 stars
                </TableCell>
                <TableCell>
                  {guesthouse.review_image ? (
                    <ImageZoom zoomMargin={100}>
                      <div className="border-primary relative aspect-video max-w-20 overflow-hidden border-2">
                        <Image
                          alt="Passport"
                          src={guesthouse.review_image || ''}
                          sizes="80"
                          className="object-cover"
                          fill={true}
                          priority={true}
                        />
                      </div>
                    </ImageZoom>
                  ) : (
                    <span className="text-muted-foreground">No Image</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
