'use client';

import { useEffect, useState } from 'react';

import { redirect } from 'next/navigation';

import { CountryItem, fetchCountries } from '@/lib/countries';
import { format } from 'date-fns';
import { CalendarIcon, Flag } from 'lucide-react';
import { toast } from 'sonner';

import MyButton from '@/components/custom/my-button';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { bookGuestHouse } from '../lib/action';

export default function AddFormPage({
  guesthouseName,
}: {
  guesthouseName: string;
}) {
  const [dateOfStay, setDateOfStay] = useState<Date>();
  const [dateOfCheckout, setDateOfCheckout] = useState<Date>();
  const [countries, setCountries] = useState<CountryItem[]>([]);

  useEffect(() => {
    const fetchCountriesData = async () => {
      const countries = await fetchCountries();
      setCountries(countries);
    };
    fetchCountriesData();
  }, []);

  async function clientAction(formData: FormData) {
    const result = await bookGuestHouse(formData);

    if (result?.success) {
      toast.success(
        'Thank you! Your booking request has been submitted successfully.'
      );
      redirect('/');
    } else {
      console.log(result?.error);
      toast.error('Oops! Something went wrong during the process');
    }
  }

  return (
    <div className="container space-y-8 border-t pt-12">
      <h1 className="text-primary font-serif text-4xl font-semibold">
        Please fill in your personal details
      </h1>

      <form action={clientAction}>
        <input
          type="hidden"
          name="guesthouse_name"
          value={guesthouseName}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="fullname">Fullname</Label>
              <Input
                required
                id="fullname"
                name="fullname"
                placeholder="Enter your fullname"
              />
            </div>

            <div className="grid w-full items-center gap-3">
              <Label htmlFor="age">Age</Label>
              <Input
                required
                id="age"
                name="age"
                placeholder="Enter your age"
                type="number"
              />
            </div>

            <div className="grid w-full items-center gap-3">
              <Label htmlFor="number_of_people">Number of People</Label>
              <Input
                required
                id="number_of_people"
                name="number_of_people"
                placeholder="Enter number of people"
                type="number"
              />
            </div>

            <div className="grid w-full items-center gap-3">
              <Label htmlFor="contact">Contact</Label>
              <Input
                required
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
              <Select
                name="country"
                required>
                <SelectTrigger
                  id="country"
                  className="w-full bg-transparent focus-visible:ring-0">
                  <div className="flex items-center gap-7">
                    <Flag className="text-primary h-5 w-5" />
                    <SelectValue placeholder="Select country" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem
                      key={country.code}
                      value={country.name}>
                      <div className="flex items-center gap-x-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="h-3 w-5"
                          src={country.flags}
                          alt={`Flag of ${country.name}`}></img>
                        <p>{country.name}</p>

                        <input
                          type="hidden"
                          name="country_flag"
                          value={country.flags}
                        />
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2">
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="date_of_stay">Date of Stay</Label>

                <input
                  type="hidden"
                  name="date_of_stay"
                  value={dateOfStay?.toISOString() || ''}
                  required
                />

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!dateOfStay}
                      className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal">
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
                <Label htmlFor="date_of_checkout">Until the Date</Label>

                <input
                  type="hidden"
                  name="date_of_checkout"
                  value={dateOfCheckout?.toISOString() || ''}
                  required
                />

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!dateOfCheckout}
                      className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal">
                      <CalendarIcon />
                      {dateOfCheckout ? (
                        format(dateOfCheckout, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={dateOfCheckout}
                      onSelect={setDateOfCheckout}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid w-full items-center gap-3">
              <Label htmlFor="booking_at">Booking at</Label>
              <Input
                required
                id="booking_at"
                name="booking_at"
                placeholder="Traveloka, Agoda, Direct, etc"
              />
            </div>

            <div className="grid w-full items-center gap-3">
              <Label htmlFor="passport">Passport</Label>
              <Input
                id="passport"
                name="passport"
                type="file"
                accept=".jpg, .png, .jpeg"
              />
            </div>
          </div>

          <div className="grid w-full items-center gap-3 md:col-span-2">
            <Label htmlFor="impression">Share your impression</Label>
            <Textarea
              required
              id="impression"
              name="impression"
              placeholder="Enter your Share your impression"
              className="h-[100px]"
            />
          </div>

          <MyButton className="md:col-span-2" />
        </div>
      </form>
    </div>
  );
}
