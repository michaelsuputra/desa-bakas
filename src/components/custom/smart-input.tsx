'use client';

import { useEffect, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Search } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

import { Input } from '@/components/ui/input';

const SmartInput = ({
  placeholder,
  query,
}: {
  placeholder: string;
  query: string;
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [input, setInput] = useState('');

  useEffect(() => {
    const currentValue = searchParams.get(query) || '';
    setInput(currentValue);
  }, [searchParams, query]);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set(query, term);
    } else {
      params.delete(query);
    }
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <Input
      placeholder={placeholder}
      className="max-w-xs"
      value={input}
      onChange={(e) => {
        setInput(e.target.value);
        handleSearch(e.target.value);
      }}
    />
  );
};

export default SmartInput;
