import React from 'react';

import { prisma } from '@/lib/prisma';
import { getBaseUrl } from '@/lib/utils';
import axios from 'axios';

import ChartWisatawan from './chart-wisatawan';

export default async function Page() {
  let formattedData: any;

  try {
    const baseUrl = getBaseUrl();

    const response = await axios.get(`${baseUrl}/api/chart-guesthouse`, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });

    formattedData = response.data.formattedData;
  } catch (error) {
    console.error('Failed to fetch data via API:', error);
  }

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-primary font-serif text-3xl font-semibold">Admin Dashboard</h1>
        <p className="text-muted-foreground font-mono text-sm">
          Welcome to the admin dashboard. Here you can manage your guesthouse
        </p>
      </header>

      <hr />
      <ChartWisatawan data={formattedData} />
    </section>
  );
}
