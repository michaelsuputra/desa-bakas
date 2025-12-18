'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { getBaseUrl } from '@/lib/utils';
import { news_event } from '@prisma/client';
import axios from 'axios';
import { format } from 'date-fns';
import { CalendarIcon, Edit, Edit2, Loader2, PlusIcon } from 'lucide-react';
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

export function EditData({ data }: { data: news_event }) {
  const [dateStart, setDateStart] = useState<Date | undefined>(
    data.event_date ? new Date(data.event_date) : undefined
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(data.category);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const baseUrl = getBaseUrl();

    // Validasi Client Side
    if (selectedCategory === 'EVENT' && !dateStart) {
      toast.error('Event Date is required for events');
      setIsLoading(false);
      return;
    }

    try {
      // Menggunakan PATCH untuk update
      const response = await axios.patch(`${baseUrl}/api/news-event/${data.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Data updated successfully.');
        setIsOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error || 'Failed to update data');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Data</DialogTitle>
          <DialogDescription>
            Ubah informasi di bawah ini. Kosongkan gambar jika tidak ingin mengubahnya.
          </DialogDescription>
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
                defaultValue={data.title}
              />
            </div>

            {/* Category */}
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                name="category"
                required
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value)}>
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
                defaultValue={data.content}
                className="min-h-[150px]"
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
                    required
                    defaultValue={data.location || ''}
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
              <Label htmlFor="image_url">
                Image{' '}
                <span className="text-muted-foreground text-xs">(Optional: Upload to replace)</span>
              </Label>
              <Input
                id="image_url"
                name="image_url"
                type="file"
                accept="image/*"
                multiple
                // HAPUS required agar user tidak wajib upload ulang gambar saat edit
              />
              {data.image_url && data.image_url.length > 0 && (
                <p className="text-muted-foreground mt-1 text-xs">
                  Current image: {data.image_url.length} file(s) attached.
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
