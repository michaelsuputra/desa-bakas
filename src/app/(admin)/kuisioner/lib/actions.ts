'use server';

import { format } from 'date-fns';

import { getAllKuisioner } from './kuisioner';

export async function exportKuisionerData(filters: {
  search?: string;
  booking?: string;
  country?: string;
  guesthouse?: string;
}) {
  const data = await getAllKuisioner(
    filters.search,
    filters.booking,
    filters.country,
    filters.guesthouse
  );

  // Format data untuk Excel (Flatten object)
  return data.map((item) => ({
    Guesthouse: item.guesthouse?.guesthouse_name || '-',
    Fullname: item.fullname,
    Age: item.age,
    'Number of People': item.number_of_people,
    Contact: item.contact,
    Country: item.country,
    'Booking Platform': item.booking_at,
    'Date of Stay': item.date_of_stay ? format(new Date(item.date_of_stay), 'yyyy-MM-dd') : '-',
    'Date of Checkout': item.date_of_checkout
      ? format(new Date(item.date_of_checkout), 'yyyy-MM-dd')
      : '-',
  }));
}
