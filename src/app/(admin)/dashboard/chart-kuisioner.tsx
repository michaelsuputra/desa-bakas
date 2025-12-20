'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  total: {
    label: 'Total Pesanan',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

interface ChartKuisionerProps {
  data: {
    guesthouse: string;
    total: number;
  }[];
}

export function ChartKuisioner({ data }: ChartKuisionerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistik Pemesanan</CardTitle>
        <CardDescription>Jumlah kuisioner yang masuk berdasarkan Guesthouse</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="guesthouse"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => (value.length > 10 ? `${value.slice(0, 10)}...` : value)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="total"
              fill="var(--color-total)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Menampilkan total data kuisioner untuk semua guesthouse
        </div>
      </CardFooter>
    </Card>
  );
}
