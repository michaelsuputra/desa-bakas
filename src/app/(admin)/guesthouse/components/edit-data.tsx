import { guesthouse } from '@prisma/client';
import { Edit } from 'lucide-react';

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

export function EditData({ data }: { data: guesthouse }) {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Edit size={18} />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Guesthouse</DialogTitle>
            <DialogDescription>Click save when you&apos;re done.</DialogDescription>
          </DialogHeader>
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
                  placeholder="Kubu Bakas"
                  type="file"
                  accept="image/*"
                  multiple
                  required
                />
              </InputGroup>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
