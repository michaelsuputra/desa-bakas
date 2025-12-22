'use client';

import { useState } from 'react';

import { Download } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

import { Button } from '@/components/ui/button';

import { exportKuisionerData } from '../lib/actions';

type ExportButtonProps = {
  filters: {
    search?: string;
    booking?: string;
    country?: string;
    guesthouse?: string;
  };
};

export default function ExportButton({ filters }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      toast.info('Preparing data for export...');

      // Fetch data dari server action
      const data = await exportKuisionerData(filters);

      if (!data || data.length === 0) {
        toast.warning('No data found to export');
        return;
      }

      // Buat Worksheet dan Workbook
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Kuisioner Data');

      // Generate file name dengan timestamp
      const fileName = `Kuisioner_Export_${new Date().toISOString().split('T')[0]}.xlsx`;

      // Download file
      XLSX.writeFile(workbook, fileName);

      toast.success('Export successful!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={loading}
      title="Export to Excel">
      <Download className={`h-4 w-4 ${loading ? 'animate-bounce' : ''}`} />
      Export Excel
    </Button>
  );
}
