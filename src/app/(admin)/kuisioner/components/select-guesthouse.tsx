'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SelectGuesthouse({
  guesthouses,
  currentGuesthouse,
}: {
  guesthouses: string[];
  currentGuesthouse?: string;
}) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // Reset ke halaman 1 saat filter berubah

    if (value === 'all') {
      params.delete('guesthouse');
    } else {
      params.set('guesthouse', value);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select
      onValueChange={handleSelect}
      defaultValue={currentGuesthouse || 'all'}>
      <SelectTrigger className="w-[180px]">
        {/* Tambahkan width agar rapi */}
        <SelectValue placeholder="Guesthouse" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Guesthouse</SelectItem>
        {guesthouses.map((name) => (
          <SelectItem
            key={name}
            value={name}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
