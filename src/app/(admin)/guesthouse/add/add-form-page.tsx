'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { getBaseUrl } from '@/lib/utils';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupInput, InputGroupTextarea } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';

export default function AddFormPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const baseUrl = getBaseUrl();

    try {
      const response = await axios.post(`${baseUrl}/api/guesthouse`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Guesthouse added successfully.');
        router.refresh();
        router.push('/guesthouse');
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
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6">
        <div className="flex w-full flex-col gap-4 md:flex-row md:gap-8">
          <div className="flex w-full flex-col gap-2">
            <Label htmlFor="guesthouse_name">Guesthouse Name</Label>

            <InputGroup>
              <InputGroupInput
                id="guesthouse_name"
                name="guesthouse_name"
                placeholder="Kubu Bakas"
                disabled={isLoading}
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
                disabled={isLoading}
                required
              />
            </InputGroup>
          </div>

          <div className="flex w-full flex-col gap-2">
            <Label htmlFor="price">Guesthouse Price</Label>

            <InputGroup>
              <InputGroupInput
                id="price"
                name="price"
                type="number"
                placeholder="Guesthouse Price"
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
                multiple
                required
              />
            </InputGroup>
          </div>
        </div>

        <Button
          type="submit"
          variant="default"
          disabled={isLoading}
          className="w-fit space-x-2">
          {isLoading ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            'Submit'
          )}
        </Button>
      </div>
    </form>
  );
}
