import Image from 'next/image';

import { format } from 'date-fns';
import { House } from 'lucide-react';

import SmartInput from '@/components/custom/smart-input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ImageZoom } from '@/components/ui/shadcn-io/image-zoom';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  getKuisioner,
  getUniqueBooking,
  getUniqueCountry,
} from '../lib/kuisioner';
import { PageProps } from '../page';
import SelectBooking from './select-booking';
import SelectCountry from './select-country';

export default async function DataTable({ searchParams }: PageProps) {
  const { search, page, booking, country } = await searchParams;

  const { data, totalCount } = await getKuisioner(
    Number(page) || 1,
    10,
    search,
    booking,
    country
  );

  const uniqueBooking = await getUniqueBooking();
  const uniqueCountry = await getUniqueCountry();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <SmartInput
          placeholder="Search by guesthouse or fullname"
          query="search"
        />

        <SelectBooking
          bookings={uniqueBooking}
          currentBooking={booking}
        />

        <SelectCountry
          countries={uniqueCountry}
          currentCountry={country}
        />
      </div>
      <ScrollArea className="w-full whitespace-nowrap">
        <ScrollBar orientation="horizontal" />
        <Table className="min-w-full">
          <TableCaption>
            List of kuisioner responses ({totalCount})
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Guesthouse</TableHead>
              <TableHead>Fullname</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>People</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Date of Stay</TableHead>
              <TableHead>Date of Checkout</TableHead>
              <TableHead>Booking at</TableHead>
              <TableHead>Passport</TableHead>
              <TableHead>Impression</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((kuisioner) => (
              <TableRow key={kuisioner.kuisioner_id}>
                <TableCell>{kuisioner.guesthouse_name}</TableCell>
                <TableCell>{kuisioner.fullname}</TableCell>
                <TableCell>{kuisioner.age}</TableCell>
                <TableCell>{kuisioner.number_of_people}</TableCell>
                <TableCell>{kuisioner.contact}</TableCell>
                <TableCell>
                  <div className="flex w-[100px] items-center gap-2">
                    <Image
                      alt="Flag"
                      src={kuisioner.country_flag || ''}
                      height={12}
                      width={20}
                      style={{
                        width: '20px',
                        height: '12px',
                      }}
                    />{' '}
                    {kuisioner.country}
                  </div>
                </TableCell>
                <TableCell>
                  {format(
                    new Date(kuisioner.date_of_stay || 'null'),
                    'dd MMM yyyy'
                  )}
                </TableCell>
                <TableCell>
                  {format(
                    new Date(kuisioner.date_of_checkout || 'null'),
                    'dd MMM yyyy'
                  )}
                </TableCell>
                <TableCell>{kuisioner.booking_at}</TableCell>
                <TableCell>
                  <ImageZoom zoomMargin={100}>
                    <div className="border-primary relative aspect-3/4 max-w-20 overflow-hidden border-2">
                      <Image
                        alt="Passport"
                        src={kuisioner.passport || ''}
                        sizes="80"
                        className="object-cover"
                        fill={true}
                        priority={true}
                      />
                    </div>
                  </ImageZoom>
                </TableCell>
                <TableCell className="max-w-[200px] text-pretty whitespace-normal">
                  {kuisioner.impression}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={10}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
        </Table>
      </ScrollArea>
    </div>
  );
}
