import Image from 'next/image';
import Link from 'next/link';

import { formatCurrency, getBaseUrl } from '@/lib/utils';
import { guesthouse } from '@prisma/client';
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

import { PageProps } from '../page';

export default async function DataTable({ searchParams }: PageProps) {
  const { search, page } = await searchParams;

  let data: guesthouse[] = [];
  let totalCount = 0;

  try {
    const baseUrl = getBaseUrl();

    const response = await axios.get(`${baseUrl}/api/guesthouse`, {
      params: {
        page: Number(page) || 1,
        limit: 10,
        search,
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <SmartInput
          placeholder="Search by guesthouse"
          query="search"
        />
      </div>

      <ScrollArea className="w-full whitespace-nowrap">
        <ScrollBar orientation="horizontal" />
        <Table className="min-w-full">
          <TableCaption>List of guesthouses ({totalCount})</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Guesthouse Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Map URL</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((guesthouse) => (
              <TableRow key={guesthouse.guesthouse_id}>
                <TableCell>{guesthouse.guesthouse_name}</TableCell>
                <TableCell>
                  <div className="line-clamp-2 max-w-[300px] whitespace-normal">
                    {guesthouse.guesthouse_location}
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(guesthouse.price)}</TableCell>
                <TableCell>
                  <Link
                    href={guesthouse.guesthouse_map_url}
                    className="hover:text-primary underline"
                    target="_blank">
                    Link
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="line-clamp-4 max-w-[400px] text-pretty whitespace-normal">
                    {guesthouse.guesthouse_description}
                  </div>
                </TableCell>
                <TableCell>
                  <ImageZoom zoomMargin={100}>
                    <div className="border-primary relative aspect-video max-w-20 overflow-hidden border-2">
                      <Image
                        alt="Passport"
                        src={guesthouse.guesthouse_images[0] || ''}
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
