'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SelectCountry({
  countries,
  currentCountry,
}: {
  countries: string[];
  currentCountry?: string;
}) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (value === 'all') {
      params.delete('country');
    } else {
      params.set('country', value);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select
      onValueChange={handleSelect}
      defaultValue={currentCountry || 'all'}>
      <SelectTrigger>
        <SelectValue placeholder="Country" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Country</SelectItem>
        {/* Render data dari database */}
        {countries.map((country) => (
          <SelectItem
            key={country}
            value={country}>
            {country}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
