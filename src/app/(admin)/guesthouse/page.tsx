import React from 'react';

import Link from 'next/link';

import { Plus } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';

import DataTable from './components/data-table';

export type PageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
};

export default function Page({ searchParams }: PageProps) {
  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-primary font-serif text-3xl font-semibold">Guesthouse</h1>
          <p className="text-muted-foreground font-mono text-sm">
            Here you can manage your guesthouse
          </p>
        </div>

        <Link
          className={buttonVariants({ variant: 'default' })}
          href={'/guesthouse/add'}>
          <Plus />
          Add Guesthouse
        </Link>
      </header>

      <hr />

      <DataTable searchParams={searchParams} />
    </section>
  );
}
