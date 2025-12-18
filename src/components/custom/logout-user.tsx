'use client';

import { getBaseUrl } from '@/lib/utils';
import axios from 'axios';
import { toast } from 'sonner';

import { Button } from '../ui/button';

export default function LogoutUser() {
  const handleLogout = async () => {
    const baseUrl = getBaseUrl();
    try {
      const response = await axios.post(`${baseUrl}/api/logout`);

      if (response.data.success) {
        window.location.href = '/signin';
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Gagal melakukan logout');
    }
  };

  return (
    <Button
      variant="destructive"
      size="lg"
      onClick={handleLogout}>
      Logout
    </Button>
  );
}
