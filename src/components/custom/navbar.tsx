'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import AuthButton from './auth-button';

const NavLinks = [
  // {
  //   label: 'Guest House',
  //   href: '/guesthouse',
  // },
  // {
  //   label: 'Review',
  //   href: '/review',
  // },
  {
    label: 'Login',
    href: '/login',
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 flex w-full items-center justify-center transition-all ${scrolled ? 'bg-white/20 shadow-lg backdrop-blur-md' : 'bg-transparent'}`}>
      <div className={`container flex w-full items-center justify-between py-6`}>
        <Link
          href="/"
          className="font-serif text-2xl font-light tracking-wider text-white text-shadow-2xs md:text-3xl">
          Bakas
        </Link>

        {/* <div className="flex items-center gap-6">
          {NavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="cursor-pointer text-sm text-white hover:opacity-70">
              {link.label}
            </Link>
          ))}
        </div> */}

        <AuthButton />
      </div>
    </nav>
  );
}
