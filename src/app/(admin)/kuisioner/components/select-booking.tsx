'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SelectBooking({
  bookings,
  currentBooking,
}: {
  bookings: string[];
  currentBooking?: string;
}) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (value === 'all') {
      params.delete('booking');
    } else {
      params.set('booking', value);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select
      onValueChange={handleSelect}
      defaultValue={currentBooking || 'all'}>
      <SelectTrigger>
        <SelectValue placeholder="Booking" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Booking</SelectItem>
        {/* Render data dari database */}
        {bookings.map((booking) => (
          <SelectItem
            key={booking}
            value={booking}>
            {booking}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
