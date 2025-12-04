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
import { getGuesthousesList } from '../../kuisioner/lib/kuisioner';
import { getBooking } from '../lib/booking';
import { PageProps } from '../page';

export default async function DataTable({ searchParams }: PageProps) {
  const { search, page, guesthouse } = await searchParams;

  const { data, totalCount } = await getBooking(Number(page) || 1, 10, search, guesthouse);

  const guesthousesList = await getGuesthousesList();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value);

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
                  <Badge
                    className={
                      guesthouse.kuisioner_guesthouse.length > 0 ? 'bg-sky-500' : 'bg-red-500'
                    }>
                    {guesthouse.kuisioner_guesthouse.length > 0
                      ? 'Kuisioner Filled'
                      : 'Kuisioner Not Filled'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      guesthouse.review_guesthouse.length > 0 ? 'bg-sky-500' : 'bg-red-500'
                    }>
                    {guesthouse.review_guesthouse.length > 0
                      ? 'Review Filled'
                      : 'Review Not Filled'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={guesthouse.status === 'success' ? 'bg-sky-500' : 'bg-orange-500'}>
                    {guesthouse.status}
                  </Badge>
                </TableCell>
                <TableCell>{guesthouse.night_count}</TableCell>
                <TableCell>{formatCurrency(guesthouse.total_price)}</TableCell>
                <TableCell>{guesthouse.payment_method}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
