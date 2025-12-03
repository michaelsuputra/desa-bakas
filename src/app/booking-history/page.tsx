import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { CalendarDays, MapPin, MessageSquarePlus, Moon, Plus } from 'lucide-react';

import AuthButton from '@/components/custom/auth-button';
import Navbar from '@/components/custom/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

import KuisionerForm from './components/kuisioner-form';
import ReviewForm from './components/review-form';

export default async function BookingHistoryPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/signin');
  }

  const bookings = await prisma.guesthouse_transaction.findMany({
    where: {
      user_id: session.user.db_user_id,
    },
    include: {
      guesthouse: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <Navbar>
        <AuthButton />
      </Navbar>

      <div className="bg-primary pt-28 pb-20">
        <div className="container mt-10 space-y-2 text-white">
          <h1 className="font-serif text-3xl font-bold">My Bookings</h1>
          <p className="text-primary-foreground/80">See your history and upcoming stays</p>
        </div>
      </div>

      <main className="container -my-14 space-y-6">
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <CalendarDays className="text-muted-foreground h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold">No bookings found</h3>
              <p className="text-muted-foreground mb-4 max-w-sm text-sm">
                You haven&apos;t made any bookings yet. Start exploring our beautiful guesthouses!
              </p>
              <Button asChild>
                <Link href="/">Explore Guesthouses</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          bookings.map((booking) => (
            <Card
              key={booking.guesthouse_transaction_id}
              className="overflow-hidden">
              <CardHeader className="bg-muted/30 border-b py-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      Booking ID
                    </span>
                    <span className="font-mono text-sm font-bold">#{booking.code}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      Date Ordered
                    </span>
                    <span className="text-sm">
                      {format(new Date(booking.created_at), 'dd MMM yyyy, HH:mm')}
                    </span>
                  </div>
                  <div className="ml-auto">
                    <StatusBadge status={booking.status} />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="flex flex-col gap-6 md:flex-row">
                  {/* Image Guesthouse */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-md md:w-48 lg:w-64">
                    <Image
                      src={booking.guesthouse?.guesthouse_images[0] || '/placeholder.jpg'}
                      alt={booking.guesthouse?.guesthouse_name || 'Guesthouse'}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Detail Booking */}
                  <div className="flex flex-1 flex-col justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-primary font-serif text-xl font-semibold">
                        {booking.guesthouse?.guesthouse_name}
                      </h3>
                      <div className="text-muted-foreground flex items-center gap-1 text-sm">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{booking.guesthouse?.guesthouse_location}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                      <div className="space-y-1">
                        <span className="text-muted-foreground block text-xs">Check-in</span>
                        <span className="font-medium">
                          {format(new Date(booking.check_in), 'EEE, dd MMM yyyy')}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground block text-xs">Check-out</span>
                        <span className="font-medium">
                          {format(new Date(booking.check_out), 'EEE, dd MMM yyyy')}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground block text-xs">Duration</span>
                        <div className="flex items-center gap-1 font-medium">
                          <Moon className="h-3.5 w-3.5" />
                          <span>{booking.night_count} Nights</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground block text-xs">Total Price</span>
                        <span className="text-foreground font-bold">
                          {formatCurrency(booking.total_price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-muted/10 flex flex-col items-end gap-8 border-t px-6 py-4">
                <div className="flex gap-2">
                  {booking.status === 'pending' && <Button size="sm">Pay Now</Button>}

                  <Button
                    variant="outline"
                    size="sm"
                    asChild>
                    <Link href={`/guesthouse/${booking.guesthouse_id}`}>View Property</Link>
                  </Button>

                  <KuisionerForm
                    booking={booking}
                    session={session}
                  />
                </div>

                <div className="w-full">
                  <ReviewForm
                    booking={booking}
                    session={session}
                  />
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </main>
    </div>
  );
}

// Komponen Badge Sederhana untuk Status
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    success: 'bg-green-100 text-green-700 border-green-200',
    failed: 'bg-red-100 text-red-700 border-red-200',
    cancelled: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const defaultStyle = 'bg-gray-100 text-gray-700 border-gray-200';

  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
        styles[status.toLowerCase()] || defaultStyle
      }`}>
      {status}
    </span>
  );
}
