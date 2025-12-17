'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { CountryItem, fetchCountries } from '@/lib/countries';
import { getBaseUrl } from '@/lib/utils';
import { guesthouse } from '@prisma/client';
import axios from 'axios';
import { format } from 'date-fns';
import { CalendarIcon, Flag } from 'lucide-react';
import { toast } from 'sonner';

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

export default function KuisionerForm({ data }: { data: guesthouse }) {
  const router = useRouter();

  const [dateOfStay, setDateOfStay] = useState<Date>();
  const [dateOfCheckout, setDateOfCheckout] = useState<Date>();
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const baseUrl = getBaseUrl();

    try {
      const response = await axios.post(`${baseUrl}/api/checkout-other-platform`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Kuisioner added successfully.');
        router.refresh();
        // router.push('/booking-history');
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error || 'Failed to create kuisioner');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
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
          onSubmit={handleSubmit}
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
                  placeholder="Enter your fullname"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  disabled={isLoading}
                  required
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>

              <div className="grid w-full items-center gap-3">
                <Label htmlFor="country">Country</Label>
                <Select
                  name="country"
                  disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                  disabled={isLoading}
                  placeholder="Traveloka, Agoda, Direct, etc"
                />
              </div>

              <div className="grid w-full items-center gap-3">
                <Label htmlFor="passport">
                  Passport <span className="text-muted-foreground text-xs">(max 1MB)</span>
                </Label>
                <Input
                  id="passport"
                  name="passport"
                  type="file"
                  accept=".jpg, .png, .jpeg"
                  disabled={isLoading}
                  onChange={handleUploadFile}
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button
              type="submit"
              disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Submit'}
            </Button>
          </div>
        </form>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
