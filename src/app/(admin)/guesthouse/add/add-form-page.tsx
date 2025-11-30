'use client';

import { redirect } from 'next/navigation';

import { toast } from 'sonner';

import MyButton from '@/components/custom/my-button';
import { InputGroup, InputGroupInput, InputGroupTextarea } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';

import { addGuestHouse } from '../lib/actions';

export default function AddFormPage() {
  async function clientAction(formData: FormData) {
    const result = await addGuestHouse(formData);

    if (result?.success) {
      toast.success('Guesthouse added successfully.');

      redirect('/guesthouse');
    } else {
      console.log(result?.error);
      toast.error(result?.error?.message || 'Failed to create Guesthouse');
    }
  }

  return (
    <form action={clientAction}>
      <div className="flex flex-col gap-6">
        <div className="flex w-full flex-col gap-4 md:flex-row md:gap-8">
          <div className="flex w-full flex-col gap-2">
            <Label htmlFor="guesthouse_name">Guesthouse Name</Label>

            <InputGroup>
              <InputGroupInput
                id="guesthouse_name"
                name="guesthouse_name"
                placeholder="Kubu Bakas"
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
                placeholder="Jalan Subak Bungah, Bakas, Kec. Banjarangkan...."
                required
              />
            </InputGroup>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 md:flex-row md:gap-8">
          <div className="flex w-full flex-col gap-2">
            <Label htmlFor="guesthouse_map_url">Guesthouse Map URL</Label>

            <InputGroup>
              <InputGroupInput
                id="guesthouse_map_url"
                name="guesthouse_map_url"
                placeholder="Google Maps URL"
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
                placeholder="Jalan Subak Bungah, Bakas, Kec. Banjarangkan...."
                required
              />
            </InputGroup>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 md:flex-row md:gap-8">
          <div className="flex w-full flex-col gap-2">
            <Label htmlFor="guesthouse_images">
              Guesthouse Images{' '}
              <span className="text-muted-foreground text-xs">(Multiple, Max 3, Max Size 2MB)</span>
            </Label>

            <InputGroup>
              <InputGroupInput
                id="guesthouse_images"
                name="guesthouse_images"
                placeholder="Kubu Bakas"
                type="file"
                accept="image/*"
                multiple
                required
              />
            </InputGroup>
          </div>
        </div>

        <MyButton />
      </div>
    </form>
  );
}
