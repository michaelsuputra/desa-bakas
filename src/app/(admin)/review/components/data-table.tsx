import React from 'react';

import Image from 'next/image';

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
import { getGuesthousesList } from '../../kuisioner/lib/kuisioner';
import { getReview } from '../lib/review';
import { PageProps } from '../page';

export default async function DataTable({ searchParams }: PageProps) {
  const { search, page, guesthouse } = await searchParams;

  const { data, totalCount } = await getReview(Number(page) || 1, 10, search, guesthouse);

  const guesthousesList = await getGuesthousesList();

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
              <TableHead>Impression</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((guesthouse) => (
              <TableRow key={guesthouse.review_id}>
                <TableCell>{guesthouse.guesthouse?.guesthouse_name}</TableCell>
                <TableCell>
                  <div className="line-clamp-4 max-w-[400px] text-pretty whitespace-normal">
                    {guesthouse.impression}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-primary font-bold">{guesthouse.rating}</span> out of 5 stars
                </TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
