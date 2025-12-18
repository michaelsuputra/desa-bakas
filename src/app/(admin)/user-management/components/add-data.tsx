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
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const baseUrl = getBaseUrl();

    try {
      const response = await axios.post(`${baseUrl}/api/user`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success(`User added successfully.`);
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

          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="fullname">fullname</Label>
              <Input
                id="fullname"
                name="fullname"
                placeholder="Masukkan fullname"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">email</Label>
              <Input
                id="email"
                name="email"
                placeholder="Masukkan email"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">password</Label>
              <Input
                id="password"
                name="password"
                placeholder="Masukkan password"
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
