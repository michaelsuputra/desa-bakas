import Link from 'next/link';

import { ChevronLeft } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';

import AddFormPage from './add-form-page';

export default function Page() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex gap-6">
        <Link
          href={'/guesthouse'}
          className={buttonVariants({ size: 'icon', variant: 'outline' })}>
          <ChevronLeft className="text-primary h-5 w-5" />
        </Link>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold md:text-3xl">Add New Guesthouse</h1>
          <p className="text-muted-foreground text-sm">
            Fill in the details below to add a new guesthouse.
          </p>
        </div>
      </div>

      <hr />

      {/* Content */}
      <AddFormPage />
    </div>
  );
}
