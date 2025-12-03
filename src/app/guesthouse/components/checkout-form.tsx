'use client';

import React, { useState } from 'react';

import { guesthouse } from '@prisma/client';
import { format } from 'date-fns';
import { AlignLeft, BadgeCheck } from 'lucide-react';
import { Users } from 'lucide-react';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function CheckoutForm({ data }: { data: guesthouse }) {
  const [dateStart, setDateStart] = useState<Date>();
  const [dateEnd, setDateEnd] = useState<Date>();

  return (
    <div className="flex flex-col gap-4 rounded-xl border px-5 py-7">
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">From</span>
        <h2 className="text-foreground text-2xl font-semibold">
          {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
          }).format(data.price ?? 0)}{' '}
        </h2>
      </div>

      <form>
        <div className="flex flex-col gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                data-empty={!dateStart}
                className="data-[empty=true]:text-muted-foreground h-10 w-full items-center justify-start gap-6 rounded-full">
                <CalendarIcon />
                {dateStart ? format(dateStart, 'd MMM yyyy') : <span>Pick a start date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateStart}
                onSelect={setDateStart}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                data-empty={!dateEnd}
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
              />
            </PopoverContent>
          </Popover>

          <InputGroup className="h-10 gap-4 rounded-full">
            <InputGroupInput
              name="description"
              placeholder="Additional description"
            />
            <InputGroupAddon>
              <AlignLeft />
            </InputGroupAddon>
          </InputGroup>

          <Button className="h-10 w-full rounded-full">Book Now</Button>
        </div>
      </form>

      <hr />

      <div className="flex flex-col gap-3">Total</div>

      <hr />

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
