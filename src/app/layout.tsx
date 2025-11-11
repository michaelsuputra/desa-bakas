import type { Metadata } from 'next';
import { Merriweather, Montserrat, Ubuntu_Mono } from 'next/font/google';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';

import './globals.css';

const montserratSans = Montserrat({
  variable: '--font-montserrat-sans',
  subsets: ['latin'],
});

const merriweatherSerif = Merriweather({
  variable: '--font-merriweather-serif',
  subsets: ['latin'],
});

const ubuntuMono = Ubuntu_Mono({
  variable: '--font-ubuntu-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Guest House Bakas',
  description: 'Project by Mike, Dipz, Ran',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning>
      <body
        className={`${montserratSans.variable} ${merriweatherSerif.variable} ${ubuntuMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange>
          {children}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
