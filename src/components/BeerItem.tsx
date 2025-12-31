'use client';

import { useState } from 'react';
import { Beer } from '@/utils/api';

interface BeerItemProps {
  beer: Beer;
  isFavorite: boolean;
  onToggleFavorite: (beer: Beer) => void;
  onClick: (beer: Beer) => void;
}

export default function BeerItem({ beer, isFavorite, onToggleFavorite, onClick }: BeerItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(beer);
  };

  const handleClick = () => {
    onClick(beer);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md border-2 transition-all duration-300 cursor-pointer ${
        isHovered ? 'border-orange-400 shadow-xl transform scale-105' : 'border-gray-200'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="relative">
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200"
          aria-label="Toggle favorite"
        >
          <svg
            className={`w-6 h-6 transition-colors duration-200 ${
              isFavorite ? 'text-orange-500 fill-current' : 'text-gray-400'
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            fill={isFavorite ? 'currentColor' : 'none'}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>

        {/* Beer Image */}
        <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100">
          {beer.image_url && !imageError ? (
            <img
              src={beer.image_url}
              alt={beer.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4">
              <svg
                className="w-24 h-24 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
              <p className="text-gray-500 text-sm font-medium text-center">No Image</p>
            </div>
          )}
        </div>

        {/* Beer Info */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-orange-600 mb-1 line-clamp-2 text-center">
            {beer.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 text-center">
            {beer.tagline || beer.style || 'No tagline available'}
          </p>
          
          {/* Additional Info */}
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
            {beer.abv && (
              <span className="bg-gray-100 px-2 py-1 rounded">
                ABV: {beer.abv}%
              </span>
            )}
            {beer.ibu && (
              <span className="bg-gray-100 px-2 py-1 rounded">
                IBU: {beer.ibu}
              </span>
            )}
            {beer.style && (
              <span className="bg-gray-100 px-2 py-1 rounded">
                {beer.style}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
