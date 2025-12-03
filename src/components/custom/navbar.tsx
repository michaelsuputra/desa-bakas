'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

interface NavbarProps {
  children?: React.ReactNode;
}

export default function Navbar({ children }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 700);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getNavBackground = () => {
    if (isHomePage) {
      return scrolled
        ? 'bg-white/40 backdrop-blur-md shadow-md border-gray-200/50'
        : 'bg-transparent';
    }
    return 'bg-white/40 backdrop-blur-sm shadow-sm border-gray-200';
  };

  const getTextColor = () => {
    if (isHomePage && !scrolled) {
      return 'text-white';
    }
    return 'text-foreground';
  };

  return (
    <nav
      className={cn(
        'fixed top-0 z-50 flex w-full items-center justify-center transition-all duration-300 ease-in-out',
        getNavBackground(),
        'py-6'
      )}>
      <div className="container flex w-full items-center justify-between">
        <Link
          href="/"
          className={cn(
            'font-serif text-2xl font-light tracking-wider transition-colors duration-300 md:text-3xl',
            getTextColor(),
            isHomePage && !scrolled && 'shadow-black/20 text-shadow-sm'
          )}>
          Bakas
        </Link>

        <div className={cn('transition-colors duration-300', getTextColor())}>{children}</div>
      </div>
    </nav>
  );
}
