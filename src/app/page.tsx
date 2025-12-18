import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getBaseUrl } from '@/lib/utils';
import { guesthouse, news_event } from '@prisma/client';
import axios from 'axios';
import { format } from 'date-fns';
import { ArrowDown, CalendarDays, MapPin } from 'lucide-react';

import AuthButton from '@/components/custom/auth-button';
import Navbar from '@/components/custom/navbar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default async function Home() {
  const session = await auth();

  if (session?.user.role === 'admin') {
    redirect('/dashboard');
  }

  let data: guesthouse[] = [];
  let newsEvent: news_event[] = [];

  try {
    const baseUrl = getBaseUrl();

    const response = await axios.get(`${baseUrl}/api/guesthouse`, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });

    data = response.data.data;
  } catch (error) {
    console.error('Failed to fetch data via API:', error);
  }

  try {
    const baseUrl = getBaseUrl();

    const response = await axios.get(`${baseUrl}/api/news-event`, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });

    newsEvent = response.data.data;
  } catch (error) {
    console.error('Failed to fetch data via API:', error);
  }

  console.log(newsEvent);

  return (
    <div className="min-h-screen bg-white">
      <Navbar>
        <AuthButton />
      </Navbar>

      {/* HERO */}
      <section
        className="relative h-screen rounded-br-[250px] border-b bg-cover bg-center bg-no-repeat shadow-2xl"
        style={{ backgroundImage: "url('/sawah_bakas.png')" }}>
        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center text-white">
          <h1 className="font-serif text-6xl font-bold tracking-widest md:text-[150px]">BAKAS</h1>
          <p className="max-w-xl text-center font-sans text-sm leading-relaxed text-white">
            Bakas Village is one of 13 villages located in the Banjarangkan District, Klungkung
            Regency, Bali Province. Geographically, Bakas Village has the following boundaries: To
            the north, it borders Nyalian Village. To the east, it borders Tukad Bubuh, which is
            part of the Klungkung District. South: borders Tusan Village. West: borders Tukad
            Melangit, still within the Banjarangkan Subdistrict.
          </p>
        </div>

        {/* Scroll Indicator */}
        <Link
          href="#content"
          className="absolute bottom-20 left-10 animate-bounce cursor-pointer text-white">
          <ArrowDown />
        </Link>
      </section>

      <main
        id="content"
        className="container space-y-12 py-24">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <h2 className="text-primary font-serif text-2xl font-bold md:text-3xl">
              Available Guest House
            </h2>

            <Input
              type="text"
              placeholder="search location"
              // value={searchQuery}
              // onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg px-4 py-3 md:w-80"
            />
          </div>

          {/* ✅ GRID */}
          <div className="grid gap-12 md:grid-cols-2">
            {data.map((house) => (
              <Link
                href={`/guesthouse/${house.guesthouse_id}`}
                key={house.guesthouse_id}
                className="cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all hover:shadow-2xl">
                <div className="h-72 overflow-hidden">
                  <Image
                    src={house.guesthouse_images[0]}
                    alt={house.guesthouse_name}
                    width={600}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="p-8">
                  <h3 className="mb-3 text-xl font-semibold">{house.guesthouse_name}</h3>
                  <p className="text-card-foreground line-clamp-4 text-sm leading-relaxed">
                    {house.guesthouse_location}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <h2 className="text-center font-serif text-3xl font-bold text-gray-900 md:text-4xl">
              News & Events
            </h2>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {newsEvent.map((item) => (
              <Link
                key={item.id}
                href={`/news-event/${item.id}`}>
                <Card className="flex flex-col overflow-hidden border-none shadow-lg transition-shadow hover:shadow-xl">
                  {/* Image Header */}
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                    {item.image_url && item.image_url.length > 0 ? (
                      <Image
                        src={item.image_url[0]}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <span className="text-sm">No Image Available</span>
                      </div>
                    )}
                    {/* Category Badge overlay */}
                    <div className="absolute top-4 left-4">
                      <Badge
                        variant={item.category === 'EVENT' ? 'default' : 'secondary'}
                        className="tracking-wider uppercase">
                        {item.category}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <div className="text-muted-foreground mb-2 flex items-center gap-2 text-xs">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span>
                        {item.category === 'EVENT' && item.event_date
                          ? format(new Date(item.event_date), 'dd MMMM yyyy')
                          : format(new Date(item.created_at), 'dd MMMM yyyy')}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2 text-xl leading-tight font-bold">
                      {item.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="grow">
                    <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                      {item.content}
                    </p>
                  </CardContent>

                  <CardFooter className="border-t bg-gray-50/50 p-4">
                    {item.category === 'EVENT' && item.location ? (
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <MapPin className="text-primary h-4 w-4" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-xs italic">Published by Admin</p>
                    )}
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
