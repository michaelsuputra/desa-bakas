import DataTable from './components/data-table';

export type PageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    guesthouse?: string;
  }>;
};

export default function Page({ searchParams }: PageProps) {
  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-primary font-serif text-3xl font-semibold">Booking</h1>
          <p className="text-muted-foreground font-mono text-sm">
            Here you can manage your booking
          </p>
        </div>
      </header>

      <hr />

      <DataTable searchParams={searchParams} />
    </section>
  );
}
