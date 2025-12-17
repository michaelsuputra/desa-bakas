import { formatCurrency, getBaseUrl } from '@/lib/utils';
import { Prisma, guesthouse } from '@prisma/client';
import axios from 'axios';

import SmartInput from '@/components/custom/smart-input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
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

type BookingData = Prisma.guesthouse_transactionGetPayload<{
  include: {
    guesthouse: true;
    user: true;
    kuisioner_guesthouse: true;
    review_guesthouse: true;
  };
}>;

export default async function DataTable({ searchParams }: PageProps) {
  const { search, page, guesthouse } = await searchParams;

  let data: BookingData[] = [];
  let guesthousesList: guesthouse[] = [];
  let totalCount = 0;

  try {
    const baseUrl = getBaseUrl();

    const response = await axios.get(`${baseUrl}/api/booking`, {
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
          <TableCaption>List of bookings ({totalCount})</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Guesthouse</TableHead>
              <TableHead>User Fullname</TableHead>
              <TableHead>Kuisioner</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Night Count</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Payment Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((guesthouse) => (
              <TableRow key={guesthouse.guesthouse_transaction_id}>
                <TableCell>{guesthouse.guesthouse?.guesthouse_name}</TableCell>
                <TableCell>{guesthouse.user?.fullname}</TableCell>
                <TableCell>
                  <Badge className={guesthouse.kuisioner_guesthouse ? 'bg-sky-500' : 'bg-red-500'}>
                    {guesthouse.kuisioner_guesthouse ? 'Kuisioner Filled' : 'Kuisioner Not Filled'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={guesthouse.review_guesthouse ? 'bg-sky-500' : 'bg-red-500'}>
                    {guesthouse.review_guesthouse ? 'Review Filled' : 'Review Not Filled'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={guesthouse.status === 'success' ? 'bg-sky-500' : 'bg-orange-500'}>
                    {guesthouse.status}
                  </Badge>
                </TableCell>
                <TableCell>{guesthouse.night_count}</TableCell>
                <TableCell>{formatCurrency(guesthouse.total_price ?? 0)}</TableCell>
                <TableCell>{guesthouse.payment_method}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
