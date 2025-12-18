import Image from 'next/image';

import { getBaseUrl } from '@/lib/utils';
import { news_event, user } from '@prisma/client';
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

  let data: user[] = [];
  let totalCount = 0;

  try {
    const baseUrl = getBaseUrl();

    const response = await axios.get(`${baseUrl}/api/user`, {
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

  console.log(data);

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
              <TableHead>Fullname</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell>{user.fullname}</TableCell>
                <TableCell>{user.email}</TableCell>

                <TableCell>
                  <div className="flex items-center">
                    {/* <EditData data={user} />
                    <DeleteData id={newsEvent.id} /> */}
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
