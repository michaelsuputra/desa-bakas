import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getBaseUrl } from '@/lib/utils';
import { news_event } from '@prisma/client';
import axios from 'axios';
import { format } from 'date-fns';
import { CalendarDays, ChevronLeft, MapPin, Share2 } from 'lucide-react';

import AuthButton from '@/components/custom/auth-button';
import Navbar from '@/components/custom/navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface PageProps {
  params: Promise<{ id: string }>;
}

// 1. Fungsi untuk mengambil data (Fetch Data)
async function getNewsEventDetail(id: string): Promise<news_event | null> {
  try {
    const baseUrl = getBaseUrl();
    const response = await axios.get(`${baseUrl}/api/news-event/${id}`, {
      headers: { 'Cache-Control': 'no-store' }, // Pastikan data selalu fresh
    });
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch detail:', error);
    return null;
  }
}

// 2. Generate Metadata untuk SEO (Judul di Browser Tab)
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const data = await getNewsEventDetail(id);

  if (!data) {
    return {
      title: 'Not Found - Desa Bakas',
    };
  }

  return {
    title: `${data.title} - Desa Bakas`,
    description: data.content.substring(0, 160),
    openGraph: {
      images: data.image_url[0] ? [data.image_url[0]] : [],
    },
  };
}

// 3. Komponen Utama Page
export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const data = await getNewsEventDetail(id);

  if (!data) {
    return notFound(); // Redirect ke halaman 404 jika data tidak ada
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar>
        <AuthButton />
      </Navbar>

      <main className="container max-w-4xl py-24 md:py-32">
        {/* Navigation & Actions */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/#content">
            <Button
              variant="ghost"
              className="hover:text-primary pl-0 hover:bg-transparent">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to News & Events
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            title="Share">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        <article className="space-y-8">
          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge
                variant={data.category === 'EVENT' ? 'default' : 'secondary'}
                className="px-3 py-1 text-sm tracking-wider uppercase">
                {data.category}
              </Badge>
              <span className="text-muted-foreground text-sm">
                Posted on {format(new Date(data.created_at), 'dd MMMM yyyy')}
              </span>
            </div>

            <h1 className="font-serif text-3xl leading-tight font-bold text-gray-900 md:text-5xl">
              {data.title}
            </h1>

            {/* Event Specific Details */}
            {data.category === 'EVENT' && (
              <div className="flex flex-col gap-3 rounded-lg border bg-gray-50 p-4 sm:flex-row sm:items-center sm:gap-8">
                {data.event_date && (
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CalendarDays className="text-primary h-5 w-5" />
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs">Event Date</span>
                      <span>{format(new Date(data.event_date), 'EEEE, dd MMMM yyyy')}</span>
                    </div>
                  </div>
                )}
                {data.location && (
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="text-primary h-5 w-5" />
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs">Location</span>
                      <span>{data.location}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Featured Image */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-xl">
            {data.image_url && data.image_url.length > 0 ? (
              <Image
                src={data.image_url[0]}
                alt={data.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
                No Image Available
              </div>
            )}
          </div>

          <Separator />

          {/* Content Body */}
          <div className="prose prose-lg max-w-none text-gray-700">
            {/* Menggunakan whitespace-pre-wrap agar enter/paragraf dari database terbaca */}
            <div className="leading-relaxed whitespace-pre-wrap">{data.content}</div>
          </div>

          {/* Image Gallery (Optional: Jika ada lebih dari 1 gambar) */}
          {data.image_url.length > 1 && (
            <div className="pt-8">
              <h3 className="mb-4 font-serif text-2xl font-bold">Gallery</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {data.image_url.slice(1).map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-lg">
                    <Image
                      src={img}
                      alt={`Gallery ${index + 1}`}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
    </div>
  );
}
