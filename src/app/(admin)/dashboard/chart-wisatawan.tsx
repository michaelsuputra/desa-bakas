'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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

export const description = 'A bar chart';

const chartConfig = {
  total: {
    label: 'Total Bookings',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

interface ChartWisatawanProps {
  data: {
    guesthouse: string;
    total: number;
  }[];
}

export default function ChartWisatawan({ data }: ChartWisatawanProps) {
  const totalBookings = data.reduce((acc, curr) => acc + curr.total, 0);
  const topGuesthouse = data.length > 0 ? data[0].guesthouse : 'N/A';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guesthouse Popularity</CardTitle>
        <CardDescription>Total successful bookings per guesthouse</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="horizontal">
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="guesthouse"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // Truncate long names if necessary or hide if too many
              tickFormatter={(value) => (value.length > 10 ? `${value.slice(0, 10)}...` : value)}
            />
            <YAxis allowDecimals={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel={false} />}
            />
            <Bar
              dataKey="total"
              fill="#ff7e5f"
              radius={[4, 4, 0, 0]}
              name="Bookings"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Top guesthouse: {topGuesthouse} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total of {totalBookings} bookings across all guesthouses
        </div>
      </CardFooter>
    </Card>
  );
}
