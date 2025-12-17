'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { guesthouse } from '@prisma/client';

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
  guesthouses: guesthouse[];
  currentGuesthouse?: string;
}) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');

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
            key={name.guesthouse_id}
            value={name.guesthouse_name}>
            {name.guesthouse_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
