'use client';

import { useState } from 'react';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';

import { bookGuestHouse } from '../lib/action';

export default function AddFormPage() {
  const [dateOfStay, setDateOfStay] = useState<Date>();
  const [untilTheDate, setUntilTheDate] = useState<Date>();

  return (
    <div className="container space-y-8 border-t pt-12">
      <h1 className="text-primary font-serif text-4xl font-semibold">
        Please fill in your personal details
      </h1>

      <form
        action={bookGuestHouse}
        className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <div className="grid w-full items-center gap-3">
            <Label htmlFor="fullname">Fullname</Label>
            <Input
              id="fullname"
              name="fullname"
              placeholder="Enter your fullname"
            />
          </div>

          <div className="grid w-full items-center gap-3">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              name="age"
              placeholder="Enter your age"
              type="number"
            />
          </div>

          <div className="grid w-full items-center gap-3">
            <Label htmlFor="number_of_people">Number of People</Label>
            <Input
              id="number_of_people"
              name="number_of_people"
              placeholder="Enter number of people"
              type="number"
            />
          </div>

          <div className="grid w-full items-center gap-3">
            <Label htmlFor="contact">Contact</Label>
            <Input
              id="contact"
              name="contact"
              placeholder="Enter your contact number"
              type="number"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid w-full items-center gap-3">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              placeholder="Enter your Country"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="date_of_stay">Date of Stay</Label>

              <input
                type="hidden"
                name="date_of_stay"
                value={dateOfStay ? format(dateOfStay, 'PPP') : ''}
              />

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    data-empty={!dateOfStay}
                    className="data-[empty=true]:text-muted-foreground max-w-full justify-start text-left font-normal">
                    <CalendarIcon />
                    {dateOfStay ? (
                      format(dateOfStay, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateOfStay}
                    onSelect={setDateOfStay}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid w-full items-center gap-3">
              <Label htmlFor="until_the_date">Until the Date</Label>

              <input
                type="hidden"
                name="until_the_date"
                value={untilTheDate ? format(untilTheDate, 'PPP') : ''}
              />

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    data-empty={!untilTheDate}
                    className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal">
                    <CalendarIcon />
                    {untilTheDate ? (
                      format(untilTheDate, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Calendar
                    mode="single"
                    selected={untilTheDate}
                    onSelect={setUntilTheDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid w-full items-center gap-3">
            <Label htmlFor="passport">Passport</Label>
            <Input
              id="passport"
              name="passport"
              type="file"
            />
          </div>
        </div>

        <div className="col-span-2 grid w-full items-center gap-3">
          <Label htmlFor="impression">Share your impression</Label>
          <Textarea
            id="impression"
            name="impression"
            placeholder="Enter your Share your impression"
            className="h-[100px]"
          />
        </div>

        <Button className="col-span-2">Submit</Button>
      </form>
    </div>
  );
}
