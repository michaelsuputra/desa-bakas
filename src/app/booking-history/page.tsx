import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarDays, CheckCircle2, MapPin, Moon, Star } from 'lucide-react';

import AuthButton from '@/components/custom/auth-button';
import Navbar from '@/components/custom/navbar';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ImageZoom } from '@/components/ui/shadcn-io/image-zoom';

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

  const reviews = await prisma.review_guesthouse.findMany({
    where: {
      user_id: session.user.db_user_id,
    },
  });

  const kuisioners = await prisma.kuisioner_guesthouse.findMany({
    where: {
      user_id: session.user.db_user_id,
    },
  });

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
          bookings.map((booking) => {
            // Cek Review (By Transaction ID)
            const existingReview = reviews.find(
              (r) => r.guesthouse_transaction_id === booking.guesthouse_transaction_id
            );

            // Cek Kuisioner (By Transaction ID) - BARU
            const existingKuisioner = kuisioners.find(
              (k) => k.guesthouse_transaction_id === booking.guesthouse_transaction_id
            );

            return (
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

                    {/* BAGIAN BADGE STATUS & KUISIONER */}
                    <div className="ml-auto flex items-center gap-2">
                      {existingKuisioner && (
                        <Badge
                          variant="secondary"
                          className="gap-1 border-blue-200 bg-blue-100 text-blue-700 hover:bg-blue-100">
                          <CheckCircle2 size={12} />
                          Kuisioner Filled
                        </Badge>
                      )}
                      <StatusBadge status={booking.status || 'pending'} />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* ... Bagian Content (Image & Details) sama seperti sebelumnya ... */}
                  <div className="flex flex-col gap-6 md:flex-row">
                    <div className="relative aspect-video w-full overflow-hidden rounded-md md:w-48 lg:w-64">
                      <Image
                        src={booking.guesthouse?.guesthouse_images[0] || '/placeholder.jpg'}
                        alt={booking.guesthouse?.guesthouse_name || 'Guesthouse'}
                        fill
                        className="object-cover"
                      />
                    </div>
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
                            {formatCurrency(booking.total_price ?? 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="bg-muted/10 flex flex-col items-end gap-8 border-t px-6 py-4">
                  <div className="flex gap-2">
                    {booking.status === 'pending' && (
                      <Link
                        className={buttonVariants({ variant: 'default', size: 'sm' })}
                        href={booking.invoice_url || ''}
                        target="_blank">
                        Pay Now
                      </Link>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      asChild>
                      <Link href={`/guesthouse/${booking.guesthouse_id}`}>View Property</Link>
                    </Button>

                    {/* KONDISIONAL TOMBOL KUISIONER */}
                    {!existingKuisioner && (
                      <KuisionerForm
                        booking={booking}
                        session={session}
                      />
                    )}
                  </div>

                  <div className="w-full">
                    {existingReview ? (
                      <div className="bg-background w-full rounded-lg border p-4 shadow-sm">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="font-semibold">Your Review</h4>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-bold text-orange-500">
                              {existingReview.rating}
                            </span>
                            <Star
                              className="fill-orange-500 text-orange-500"
                              size={16}
                            />
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm italic">
                          &quot;{existingReview.impression}&quot;
                        </p>
                        {existingReview.review_image && (
                          <div className="mt-3">
                            <ImageZoom zoomMargin={40}>
                              <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                                <Image
                                  src={existingReview.review_image}
                                  alt="Review proof"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </ImageZoom>
                          </div>
                        )}
                      </div>
                    ) : (
                      <ReviewForm
                        booking={booking}
                        session={session}
                      />
                    )}
                  </div>
                </CardFooter>
              </Card>
            );
          })
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
