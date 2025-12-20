import React from 'react';

import { ChartKuisioner } from './chart-kuisioner';

export default function Page() {
  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-primary font-serif text-3xl font-semibold">Admin Dashboard</h1>
        <p className="text-muted-foreground font-mono text-sm">
          Welcome to the admin dashboard. Here you can manage your guesthouse
        </p>
      </header>

      <hr />

      <div className="grid grid-cols-2 gap-4">
        <ChartKuisioner />
      </div>
    </section>
  );
}
