'use client';

import { useEffect, useState } from 'react';

import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';

import { CountryItem, fetchCountries } from '@/lib/countries';
import { getBaseUrl } from '@/lib/utils';
import { guesthouse_transaction } from '@prisma/client';
import axios from 'axios';
import { Flag } from 'lucide-react';
import { toast } from 'sonner';

import MyButton from '@/components/custom/my-button';
import { Button } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function KuisionerForm({
  session,
  booking,
}: {
  session: Session;
  booking: guesthouse_transaction;
}) {
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const baseUrl = getBaseUrl();

    try {
      const response = await axios.post(`${baseUrl}/api/kuisioner`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Kuisioner added successfully.');
        router.refresh();
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
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm">
          Add Kuisioner
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Kuisioner</DialogTitle>
          <DialogDescription>Fill the form below to add a new kuisioner</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <input
            type="hidden"
            name="guesthouse_id"
            value={booking.guesthouse_id || ''}
          />

          <input
            type="hidden"
            name="guesthouse_transaction_id"
            value={booking.guesthouse_transaction_id}
          />

          <input
            type="hidden"
            name="user_id"
            value={session.user.db_user_id || ''}
          />

          <input
            type="hidden"
            name="date_of_stay"
            value={booking.check_in.toISOString()}
          />

          <input
            type="hidden"
            name="date_of_checkout"
            value={booking.check_out.toISOString()}
          />

          <div className="grid gap-4">
            <div className="grid gap-3">
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

            <div className="grid w-full items-center gap-3">
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
            </div>

            <div className="flex flex-col gap-2">
              <MyButton />

              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </div>
          </div>
        </form>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
