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
      className={`fixed top-0 z-50 flex w-full items-center justify-between px-6 py-6 transition-all md:px-14 ${scrolled ? 'bg-white/20 shadow-lg backdrop-blur-md' : 'bg-transparent'}`}>
      <Link
        href="/"
        className="font-serif text-2xl font-light tracking-wider text-white md:text-3xl">
        Bakas
      </Link>
      <div className="text-sm text-white">Guest House</div>
    </nav>
  );
}
