'use client';

import React from 'react';

import { Trash } from 'lucide-react';
import { toast } from 'sonner';

import { deleteGuestHouse } from '../lib/actions';

export default function DeleteData({ id }: { id: string }) {
  return (
    <button
      type="submit"
      onClick={async () => {
        const result = await deleteGuestHouse(id);
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.error?.message || 'Something went wrong');
        }
      }}>
      <Trash size={18} />
    </button>
  );
}
