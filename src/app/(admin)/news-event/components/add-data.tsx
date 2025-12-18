'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { getBaseUrl } from '@/lib/utils';
import axios from 'axios';
import { format } from 'date-fns';
import { CalendarIcon, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export function AddData() {
  const [dateStart, setDateStart] = useState<Date | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string>('NEWS');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const baseUrl = getBaseUrl();

    if (selectedCategory === 'EVENT' && !dateStart) {
      toast.error('Event Date is required for events');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/api/news-event`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success(`${selectedCategory} added successfully.`);
        setIsOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error || 'Failed to create News Event');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  }
  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Tambah Data <PlusIcon className="-mt-0.5 size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Data</DialogTitle>
          <DialogDescription>Isi detail informasi untuk Berita atau Acara baru.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {/* Hidden Input untuk Date */}
          <input
            type="hidden"
            name="event_date"
            value={dateStart ? dateStart.toISOString() : ''}
          />

          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Masukkan Judul"
                required
              />
            </div>

            {/* Category */}
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                name="category"
                required
                onValueChange={(value) => setSelectedCategory(value)}
                defaultValue="NEWS">
                <SelectTrigger
                  className="w-full"
                  id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="NEWS">News</SelectItem>
                    <SelectItem value="EVENT">Event</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Content */}
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Masukkan Isi Konten"
                required
                className="min-h-[100px]"
              />
            </div>

            {/* CONDITIONAL RENDERING: Hanya muncul jika EVENT */}
            {selectedCategory === 'EVENT' && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Lokasi Acara"
                    required // Wajib jika Event
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Event Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${!dateStart && 'text-muted-foreground'}`}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateStart ? format(dateStart, 'd MMM yyyy') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateStart}
                        onSelect={setDateStart}
                        disabled={(date) => date < new Date('1900-01-01')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}

            {/* Image Upload */}
            <div className="grid gap-2">
              <Label htmlFor="image_url">Image</Label>
              <Input
                id="image_url"
                name="image_url"
                type="file"
                accept="image/*"
                multiple // Jika ingin upload banyak gambar
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
