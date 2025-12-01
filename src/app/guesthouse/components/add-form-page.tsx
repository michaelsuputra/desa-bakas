'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { CountryItem, fetchCountries } from '@/lib/countries';
import { format } from 'date-fns';
import {
  CalendarIcon,
  Camera,
  ChevronDown,
  ChevronUp,
  Flag,
  MessageSquarePlus,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';

import MyButton from '@/components/custom/my-button';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
import { Rating, RatingButton } from '@/components/ui/shadcn-io/rating';
import { Textarea } from '@/components/ui/textarea';

import { bookGuestHouse, reviewGuestHouse } from '../lib/action';

export default function AddFormPage({ guesthouseId }: { guesthouseId: string }) {
  const [dateOfStay, setDateOfStay] = useState<Date>();
  const [dateOfCheckout, setDateOfCheckout] = useState<Date>();
  const [countries, setCountries] = useState<CountryItem[]>([]);

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);

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
    const result = await bookGuestHouse(formData);

    if (result?.success) {
      toast.success('Thank you! Your booking request has been submitted successfully.');
      redirect('/');
    } else {
      console.log(result?.error);
      toast.error('Oops! Something went wrong during the process');
    }
  }

  async function clientActionReview(formData: FormData) {
    const result = await reviewGuestHouse(formData);

    if (result?.success) {
      toast.success('Thank you! Your review has been submitted successfully.');
      redirect('/');
    } else {
      console.log(result?.error);
      toast.error(result?.error?.message || 'Failed to create review');
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
          name="guesthouse_id"
          value={guesthouseId}
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
          </div>

          <div className="col-span-1 mt-6 flex flex-col gap-6 md:col-span-2">
            <MyButton />
          </div>
        </div>
      </form>

      <form action={clientActionReview}>
        <input
          type="hidden"
          name="guesthouse_id"
          value={guesthouseId}
        />

        <Collapsible
          open={isReviewOpen}
          onOpenChange={setIsReviewOpen}>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                <MessageSquarePlus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Add a Review?</h3>
                <p className="text-muted-foreground text-xs">Share your experience with us</p>
              </div>
            </div>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2">
                {isReviewOpen ? 'Cancel' : 'Write Review'}
                {isReviewOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="space-y-6 pt-2 pb-6">
            <div className="bg-muted/30 grid gap-6 rounded-lg border border-dashed p-6">
              {/* Rating Input */}
              <div className="space-y-3">
                <Label className="text-base font-medium">How was your stay?</Label>
                <div className="flex items-center gap-4">
                  <Rating
                    value={ratingValue}
                    onValueChange={setRatingValue}
                    className="gap-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <RatingButton
                        key={index}
                        size={28}
                        className="transition-transform hover:scale-110"
                        icon={
                          <Star
                            className={
                              index < ratingValue
                                ? 'fill-orange-400 text-orange-400'
                                : 'text-gray-300'
                            }
                          />
                        }
                      />
                    ))}
                  </Rating>
                  <span className="text-muted-foreground text-sm font-medium">
                    {ratingValue > 0 ? `${ratingValue} out of 5 stars` : 'Select stars'}
                  </span>
                  {/* Hidden Input for Backend Submission */}
                  <input
                    type="hidden"
                    name="rating"
                    value={ratingValue}
                  />
                </div>
              </div>

              {/* Impression Textarea */}
              <div className="space-y-3">
                <Label
                  htmlFor="impression"
                  className="text-base font-medium">
                  Tell us more about your experience
                </Label>
                <Textarea
                  id="impression"
                  name="impression"
                  placeholder="What did you like best? What could be improved?"
                  className="min-h-[120px] resize-none bg-white"
                />
              </div>

              {/* Review Image Upload */}
              <div className="space-y-3">
                <Label
                  htmlFor="review_image"
                  className="text-base font-medium">
                  Add Photos
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="review_image"
                    name="review_image"
                    type="file"
                    accept="image/*"
                    onChange={handleUploadFile}
                  />
                  <Camera className="text-muted-foreground h-5 w-5" />
                </div>
              </div>

              <MyButton />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </form>
    </div>
  );
}
