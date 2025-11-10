import { useEffect, useState } from 'react';

import Link from 'next/link';

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
      <div
        className={`container flex w-full items-center justify-between py-6`}>
        <Link
          href="/"
          className="font-serif text-2xl font-light tracking-wider text-white text-shadow-2xs md:text-3xl">
          Bakas
        </Link>

        <div className="cursor-pointer text-sm text-white hover:opacity-70">
          Guest House
        </div>
      </div>
    </nav>
  );
}
