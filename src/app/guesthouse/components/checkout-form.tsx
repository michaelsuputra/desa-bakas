'use client';

import { useEffect, useState } from 'react';

import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';

import { formatCurrency, getBaseUrl } from '@/lib/utils';
import { guesthouse } from '@prisma/client';
import axios from 'axios';
import { differenceInCalendarDays, format, isWithinInterval, subDays } from 'date-fns';
import { AlignLeft, BadgeCheck, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

type DateRange = {
  check_in: string;
  check_out: string;
};

export default function CheckoutForm({
  data,
  session,
}: {
  data: guesthouse;
  session: Session | null;
}) {
  const router = useRouter();

  const [dateStart, setDateStart] = useState<Date>();
  const [dateEnd, setDateEnd] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const [bookedDates, setBookedDates] = useState<DateRange[]>([]);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const baseUrl = getBaseUrl();
        const response = await axios.get(
          `${baseUrl}/api/guesthouse/${data.guesthouse_id}/availability`
        );
        if (response.data.success) {
          setBookedDates(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch availability:', error);
        toast.error('Gagal memuat ketersediaan kamar.');
      }
    };

    fetchAvailability();
  }, [data.guesthouse_id]);

  const nights =
    dateStart && dateEnd && dateEnd > dateStart ? differenceInCalendarDays(dateEnd, dateStart) : 0;

  const totalPrice = nights * (data.price ?? 0);

  const isDateDisabled = (date: Date) => {
    // Disable tanggal hari ini dan sebelumnya
    if (date < new Date()) return true;

    // Cek apakah tanggal berada dalam rentang booking yang ada
    // Logika: Tanggal check-in tamu lain tidak bisa dipilih, tapi tanggal check-out mereka BISA menjadi check-in kita
    return bookedDates.some((booking) => {
      const start = new Date(booking.check_in);
      const end = new Date(booking.check_out);

      // Kita disable semua hari DI ANTARA check-in dan check-out
      // Serta hari check-in itu sendiri.
      // Hari check-out tamu sebelumnya biasanya boleh menjadi check-in tamu baru (tergantung kebijakan),
      // tapi untuk keamanan kita anggap blocked range [start, end)
      return isWithinInterval(date, { start: start, end: subDays(end, 1) });
    });
  };

  const isEndDateDisabled = (date: Date) => {
    if (isDateDisabled(date)) return true;
    if (!dateStart) return false;

    // Tidak boleh memilih tanggal sebelum start date
    if (date <= dateStart) return true;

    // Cek apakah ada booking orang lain di antara Start Date dan tanggal yang dipilih
    const isOverlapping = bookedDates.some((booking) => {
      const bookingStart = new Date(booking.check_in);
      return bookingStart > dateStart && bookingStart < date;
    });

    return isOverlapping;
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const baseUrl = getBaseUrl();

    try {
      const response = await axios.post(`${baseUrl}/api/guesthouse-checkout`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Guesthouse added successfully.');
        router.refresh();
        router.push('/booking-history');
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error || 'Failed to create Guesthouse');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border px-5 py-7">
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Price per night</span>
        <h2 className="text-foreground text-2xl font-semibold">
          {formatCurrency(data.price ?? 0)}
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="hidden"
          name="user_id"
          value={session?.user.db_user_id ?? ''}
        />

        <input
          type="hidden"
          name="guesthouse_id"
          value={data.guesthouse_id}
        />

        <input
          type="hidden"
          name="total_price"
          value={totalPrice}
        />
        <input
          type="hidden"
          name="night_count"
          value={nights}
        />
        <input
          type="hidden"
          name="check_in"
          value={dateStart?.toISOString() ?? ''}
        />
        <input
          type="hidden"
          name="check_out"
          value={dateEnd?.toISOString() ?? ''}
        />

        <div className="flex flex-col gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                data-empty={!dateStart}
                disabled={!session}
                className="data-[empty=true]:text-muted-foreground h-10 w-full items-center justify-start gap-6 rounded-full">
                <CalendarIcon />
                {dateStart ? format(dateStart, 'd MMM yyyy') : <span>Pick a start date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateStart}
                onSelect={(date) => {
                  setDateStart(date);
                  setDateEnd(undefined);
                }}
                disabled={isDateDisabled}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                data-empty={!dateEnd}
                disabled={!session}
                className="data-[empty=true]:text-muted-foreground h-10 w-full items-center justify-start gap-6 rounded-full">
                <CalendarIcon />
                {dateEnd ? format(dateEnd, 'd MMM yyyy') : <span>Pick an end date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateEnd}
                onSelect={setDateEnd}
                disabled={isEndDateDisabled}
              />
            </PopoverContent>
          </Popover>

          <InputGroup className="h-10 gap-4 rounded-full">
            <InputGroupInput
              name="description"
              disabled={!session || isLoading}
              placeholder="Additional description"
            />
            <InputGroupAddon>
              <AlignLeft />
            </InputGroupAddon>
          </InputGroup>

          <Button
            disabled={!session || isLoading}
            className="h-10 w-full rounded-full">
            {isLoading ? 'Loading...' : 'Book Now'}
          </Button>

          {!session && (
            <p className="text-destructive text-xs italic">
              Please sign in to book this guesthouse.
            </p>
          )}
        </div>
      </form>

      <hr />

      {nights > 0 && (
        <>
          <div className="flex flex-col gap-2">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground underline">
                {formatCurrency(data.price ?? 0)} x {nights} nights
              </span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>

            <hr />

            <div className="mt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </div>
          <Separator />
        </>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-2">
          <BadgeCheck
            size={20}
            className="text-primary mt-0.5 shrink-0"
          />
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-sm font-medium">Free cancellation</span>
            <span className="text-muted-foreground text-sm font-medium">
              Cancel up to 24 hours in advance for a full refund
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <BadgeCheck
            size={20}
            className="text-primary mt-0.5 shrink-0"
          />
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-sm font-medium">Reserve now & pay later</span>
            <span className="text-muted-foreground text-sm font-medium">
              Keep your travel plans flexible — book your spot and pay nothing today
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
