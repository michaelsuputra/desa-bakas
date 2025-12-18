import Image from 'next/image';

import { getBaseUrl } from '@/lib/utils';
import { news_event } from '@prisma/client';
import axios from 'axios';
import { format } from 'date-fns';
import { CalendarDays, MapPin } from 'lucide-react';

import SmartInput from '@/components/custom/smart-input';
import { Badge } from '@/components/ui/badge';
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
import DeleteData from './delete-data';
import { EditData } from './edit-data';

export default async function DataTable({ searchParams }: PageProps) {
  const { search, page } = await searchParams;

  let data: news_event[] = [];
  let totalCount = 0;

  try {
    const baseUrl = getBaseUrl();

    const response = await axios.get(`${baseUrl}/api/news-event`, {
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
          <TableCaption>List of news events ({totalCount})</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Event Date</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((newsEvent) => (
              <TableRow key={newsEvent.id}>
                <TableCell>{newsEvent.title}</TableCell>
                <TableCell>
                  <Badge
                    variant={newsEvent.category === 'EVENT' ? 'default' : 'secondary'}
                    className="text-[10px] uppercase">
                    {newsEvent.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="line-clamp-4 max-w-[400px] text-pretty whitespace-normal">
                    {newsEvent.content}
                  </div>
                </TableCell>
                <TableCell>
                  {newsEvent.location ? (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="text-muted-foreground h-3 w-3" />
                      <span className="max-w-[150px] truncate">{newsEvent.location}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {newsEvent.event_date ? (
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays className="text-muted-foreground h-3 w-3" />
                      <span>{format(new Date(newsEvent.event_date), 'dd MMM yyyy')}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">-</span>
                  )}
                </TableCell>

                <TableCell>
                  <ImageZoom zoomMargin={100}>
                    <div className="border-primary relative aspect-video max-w-20 overflow-hidden border-2">
                      <Image
                        alt="Passport"
                        src={newsEvent.image_url[0] || ''}
                        sizes="80"
                        className="object-cover"
                        fill={true}
                        priority={true}
                      />
                    </div>
                  </ImageZoom>
                </TableCell>

                <TableCell>
                  <div className="flex items-center">
                    <EditData data={newsEvent} />
                    <DeleteData id={newsEvent.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
