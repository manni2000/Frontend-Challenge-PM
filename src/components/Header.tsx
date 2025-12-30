'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  onSearch: (query: string) => void;
  isSticky?: boolean;
}

export default function Header({ onSearch, isSticky = false }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleHomeClick = () => {
    setSearchQuery('');
    onSearch('');
    router.push('/');
  };

  return (
    <header className={`bg-orange-500 transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
      <div className="container mx-auto px-4">
        {/* Navigation */}
        <nav className="flex justify-end items-center py-4">
          <div className="flex space-x-6">
            <button
              onClick={handleHomeClick}
              className="text-white font-semibold hover:text-orange-200 transition-colors duration-200"
            >
              HOME
            </button>
            <Link
              href="/favourites"
              className="text-white font-semibold hover:text-orange-200 transition-colors duration-200"
            >
              FAVOURITE
            </Link>
          </div>
        </nav>

        {/* Title and Subtitle */}
        <div className="text-center py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            The Beer Bank
          </h1>
          <p className="text-lg md:text-xl text-orange-100">
            Find your favourite beer here
          </p>
        </div>

        {/* Search Bar */}
        <div className="pb-8">
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search for beer name"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-orange-300 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 transition-all duration-200"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
