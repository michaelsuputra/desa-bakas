import Image from 'next/image';

import { getBaseUrl } from '@/lib/utils';
import { Prisma, guesthouse } from '@prisma/client';
import axios from 'axios';
import { format } from 'date-fns';

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

import { getUniqueBooking, getUniqueCountry } from '../lib/kuisioner';
import { PageProps } from '../page';
import SelectBooking from './select-booking';
import SelectCountry from './select-country';
import SelectGuesthouse from './select-guesthouse';

type KuisionerData = Prisma.kuisioner_guesthouseGetPayload<{
  include: {
    guesthouse: true;
    user: true;
  };
}>;

export default async function DataTable({ searchParams }: PageProps) {
  const { search, page, booking, country, guesthouse } = await searchParams;

  let data: KuisionerData[] = [];
  let guesthousesList: guesthouse[] = [];
  let totalCount = 0;

  try {
    const baseUrl = getBaseUrl();

    const response = await axios.get(`${baseUrl}/api/kuisioner`, {
      params: {
        page: Number(page) || 1,
        limit: 10,
        search,
        booking,
        country,
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

  const [uniqueBooking, uniqueCountry] = await Promise.all([
    getUniqueBooking(),
    getUniqueCountry(),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <SmartInput
          placeholder="Search by guesthouse or fullname"
          query="search"
        />

        <SelectGuesthouse
          guesthouses={guesthousesList}
          currentGuesthouse={guesthouse}
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
          <TableCaption>List of kuisioner responses ({totalCount})</TableCaption>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((kuisioner: KuisionerData) => (
              <TableRow key={kuisioner.kuisioner_id}>
                <TableCell>{kuisioner.guesthouse?.guesthouse_name}</TableCell>
                <TableCell>{kuisioner.user?.fullname}</TableCell>
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
                  {format(new Date(kuisioner.date_of_stay || 'null'), 'dd MMM yyyy')}
                </TableCell>
                <TableCell>
                  {format(new Date(kuisioner.date_of_checkout || 'null'), 'dd MMM yyyy')}
                </TableCell>
                <TableCell>{kuisioner.booking_at}</TableCell>
                <TableCell>
                  {kuisioner.passport ? (
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
                  ) : (
                    'No passport'
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
