import React from 'react';

import { prisma } from '@/lib/prisma';

import { ChartCountries } from './chart-country';
import { ChartKuisioner } from './chart-kuisioner';

export default async function Page() {
  // 1. DATA GUESTHOUSE POPULER (Existing)
  const popularDataRaw = await prisma.guesthouse.findMany({
    select: {
      guesthouse_name: true,
      _count: { select: { kuisioner_guesthouse: true } },
    },
    orderBy: { kuisioner_guesthouse: { _count: 'desc' } },
  });

  const popularData = popularDataRaw.map((item) => ({
    guesthouse: item.guesthouse_name,
    total: item._count.kuisioner_guesthouse,
  }));

  // 2. DATA DEMOGRAFI NEGARA (New)
  const countryDataRaw = await prisma.kuisioner_guesthouse.groupBy({
    by: ['country'],
    _count: { country: true },
    orderBy: { _count: { country: 'desc' } },
    // take: 5,
  });

  const chartColors = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
  ];

  const countryData = countryDataRaw.map((item, index) => ({
    country: item.country || 'Unknown',
    visitors: item._count.country,
    fill: chartColors[index % chartColors.length],
  }));

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-primary font-serif text-3xl font-semibold">Admin Dashboard</h1>
        <p className="text-muted-foreground font-mono text-sm">
          Welcome to the admin dashboard. Here you can manage your guesthouse
        </p>
      </header>

      <hr />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <ChartKuisioner data={popularData} />
        </div>

        <div className="col-span-3">
          <ChartCountries data={countryData} />
        </div>
      </div>
    </section>
  );
}
