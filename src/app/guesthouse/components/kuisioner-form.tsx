'use client';

import { useEffect, useState } from 'react';

import { redirect } from 'next/navigation';

import { CountryItem, fetchCountries } from '@/lib/countries';
import { guesthouse } from '@prisma/client';
import { format } from 'date-fns';
import { CalendarIcon, Flag } from 'lucide-react';
import { toast } from 'sonner';

import MyButton from '@/components/custom/my-button';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

import { alreadyBookGuestHouse } from '../lib/action';

export default function KuisionerForm({ data }: { data: guesthouse }) {
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

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        toast.error('Ukuran file melebihi batas maksimum 1MB.');
        e.target.value = '';
        return;
      }
    }
  };

  async function clientAction(formData: FormData) {
    const result = await alreadyBookGuestHouse(formData);
    if (result?.success) {
      toast.success('Thank you! Your booking request has been submitted successfully.');
      // redirect('/booking-history');
    } else {
      console.log(result?.error);
      toast.error('Oops! Something went wrong during the process');
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="hover:text-primary cursor-pointer underline">click here</span>
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl!">
        <DialogHeader>
          <DialogTitle>Fill Kuisioner for {data.guesthouse_name}</DialogTitle>
          <DialogDescription>
            If you already booked in another platform, please fill the kuisioner
          </DialogDescription>
        </DialogHeader>
        <form
          action={clientAction}
          className="flex flex-col items-end gap-4">
          <input
            type="hidden"
            name="guesthouse_id"
            value={data.guesthouse_id}
          />

          <Separator />

          <div className="grid w-full grid-cols-3 gap-4">
            {/* personal information */}
            <div className="flex flex-col gap-4">
              <div className="grid gap-3">
                <Label htmlFor="fullname">Fullname</Label>
                <Input
                  id="fullname"
                  name="fullname"
                  defaultValue="Pedro Duarte"
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  defaultValue="Pedro Duarte"
                />
              </div>
            </div>

            {/* kuisioner */}
            <div className="flex flex-col gap-4">
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
            </div>

            <div className="flex flex-col gap-4">
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
                      {dateOfStay ? format(dateOfStay, 'PPP') : <span>Pick a date</span>}
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
                <Label htmlFor="date_of_checkout">Date of Checkout</Label>

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
                      {dateOfCheckout ? format(dateOfCheckout, 'PPP') : <span>Pick a date</span>}
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

              <div className="grid w-full items-center gap-3">
                <Label htmlFor="booking_at">Booking at</Label>
                <Input
                  required
                  id="booking_at"
                  name="booking_at"
                  placeholder="Traveloka, Agoda, Direct, etc"
                />
              </div>

              {/* <div className="grid w-full items-center gap-3">
                <Label htmlFor="passport">
                  Passport <span className="text-muted-foreground text-xs">(max 1MB)</span>
                </Label>
                <Input
                  id="passport"
                  name="passport"
                  type="file"
                  accept=".jpg, .png, .jpeg"
                  onChange={handleUploadFile}
                  required
                />
              </div> */}
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <MyButton />
          </div>
        </form>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
