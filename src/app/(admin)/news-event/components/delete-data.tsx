'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { getBaseUrl } from '@/lib/utils';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';

export default function DeleteData({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const baseUrl = getBaseUrl();

      const response = await axios.delete(`${baseUrl}/api/news-event/${id}`);

      if (response.data.success) {
        toast.success('Data berhasil dihapus');
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error('Gagal menghapus data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={handleDelete}
      className={`hover:text-destructive cursor-pointer ${loading ? 'text-destructive' : ''}`}>
      <Trash size={16} />
    </div>
  );
}
