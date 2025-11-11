import React from 'react';

import DataTable from './components/table';

export type PageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    booking?: string;
    country?: string;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-primary font-serif text-3xl font-semibold">
          Kuisioner
        </h1>
        <p className="text-muted-foreground font-mono text-sm">
          Halaman untuk mengelola kuisioner
        </p>
      </header>

      <hr />

      <DataTable searchParams={searchParams} />
    </section>
  );
}
