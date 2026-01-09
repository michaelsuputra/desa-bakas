'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useDebouncedCallback } from 'use-debounce';

import { Input } from '@/components/ui/input';

export default function GuesthouseSearch({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Fungsi ini akan dijalankan 300ms setelah user berhenti mengetik
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    // Update URL tanpa refresh halaman
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 500);

  return (
    <Input
      type="text"
      placeholder={placeholder}
      onChange={(e) => handleSearch(e.target.value)}
      defaultValue={searchParams.get('query')?.toString()}
      className="w-full rounded-lg px-4 py-3 md:w-80"
    />
  );
}
