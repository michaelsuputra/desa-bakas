'use client';

import { useActionState, useEffect, useState } from 'react';

import { guesthouse } from '@prisma/client';
import { Edit } from 'lucide-react';
import { toast } from 'sonner';

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
import { InputGroup, InputGroupInput, InputGroupTextarea } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';

import { updateGuestHouse } from '../lib/actions';

const initialState = {
  success: false,
  message: '',
};

export function EditData({ data }: { data: guesthouse }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(updateGuestHouse, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success('Guesthouse Updated', {
        description: 'The guesthouse data has been successfully updated.',
      });
      setOpen(false); // Tutup dialog jika sukses
    } else if (state.error?.message) {
      toast.error('Update Failed', {
        description: state.error.message,
      });
    }
  }, [state]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Edit size={18} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Guesthouse</DialogTitle>
          <DialogDescription>Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>

        <form action={formAction}>
          <input
            type="hidden"
            name="guesthouse_id"
            value={data.guesthouse_id}
          />

          <div className="grid gap-4">
            <div className="flex w-full flex-col gap-2">
              <Label htmlFor="guesthouse_name">Guesthouse Name</Label>

              <InputGroup>
                <InputGroupInput
                  id="guesthouse_name"
                  name="guesthouse_name"
                  placeholder="Kubu Bakas"
                  defaultValue={data.guesthouse_name}
                  required
                />
              </InputGroup>
            </div>

            <div className="flex w-full flex-col gap-2">
              <Label htmlFor="guesthouse_location">Guesthouse Location</Label>

              <InputGroup>
                <InputGroupInput
                  id="guesthouse_location"
                  name="guesthouse_location"
                  defaultValue={data.guesthouse_location}
                  placeholder="Jalan Subak Bungah, Bakas, Kec. Banjarangkan...."
                  required
                />
              </InputGroup>
            </div>

            <div className="flex w-full flex-col gap-2">
              <Label htmlFor="guesthouse_map_url">Guesthouse Map URL</Label>

              <InputGroup>
                <InputGroupInput
                  id="guesthouse_map_url"
                  name="guesthouse_map_url"
                  placeholder="Google Maps URL"
                  defaultValue={data.guesthouse_map_url}
                  required
                />
              </InputGroup>
            </div>

            <div className="flex w-full flex-col gap-2">
              <Label htmlFor="guesthouse_description">Guesthouse Description</Label>

              <InputGroup>
                <InputGroupTextarea
                  id="guesthouse_description"
                  name="guesthouse_description"
                  defaultValue={data.guesthouse_description}
                  placeholder="Jalan Subak Bungah, Bakas, Kec. Banjarangkan...."
                  required
                />
              </InputGroup>
            </div>

            <div className="flex w-full flex-col gap-2">
              <Label htmlFor="guesthouse_images">
                Guesthouse Images{' '}
                <span className="text-muted-foreground text-xs">
                  (Multiple, Max 3, Max Size 2MB)
                </span>
              </Label>

              <InputGroup>
                <InputGroupInput
                  id="guesthouse_images"
                  name="guesthouse_images"
                  type="file"
                  accept="image/*"
                  multiple
                />
              </InputGroup>
              {data.guesthouse_images.length > 0 && (
                <p className="text-muted-foreground text-xs">
                  Current: {data.guesthouse_images.length} images
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
