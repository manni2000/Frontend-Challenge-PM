'use client';

import { BeerDetailResponse } from '@/utils/api';
import { useEffect, useState } from 'react';

interface BeerDetailModalProps {
  beer: BeerDetailResponse | null;
  similarBeers: BeerDetailResponse[];
  isOpen: boolean;
  onClose: () => void;
}

export default function BeerDetailModal({ beer, similarBeers, isOpen, onClose }: BeerDetailModalProps) {
  const [localSimilarBeers, setSimilarBeers] = useState<BeerDetailResponse[]>(similarBeers);

  // Simple fallback function for placeholder images
  const getRandomPlaceholderImage = () => {
    const placeholders = [
      '/images/beer-placeholder-1.svg',
      '/images/beer-placeholder-2.svg',
      '/images/beer-placeholder-3.svg',
      '/images/beer-placeholder-4.svg',
      '/images/beer-placeholder-5.svg',
    ];
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  };

  // Add/remove no-scroll class to body when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  if (!isOpen || !beer) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden mx-4 sm:mx-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 border-b">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Image */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-full max-w-sm lg:w-96 h-64 sm:h-80 lg:h-96 bg-gray-100 rounded-lg overflow-hidden">
                {beer.image_url ? (
                  <img
                    src={beer.image_url}
                    alt={beer.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <svg
                        className="w-24 h-24 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                        />
                      </svg>
                      <p>No Image</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">{beer.name}</h2>
              <p className="text-base sm:text-lg text-gray-600 mb-4">{beer.tagline}</p>

              {/* Beer Stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
                <div className="bg-gray-100 p-2 sm:p-3 rounded-lg text-center">
                  <div className="text-lg sm:text-2xl font-bold text-orange-600">{beer.ibu || 'N/A'}</div>
                  <div className="text-xs sm:text-sm text-gray-600">IBU</div>
                </div>
                <div className="bg-gray-100 p-2 sm:p-3 rounded-lg text-center">
                  <div className="text-lg sm:text-2xl font-bold text-orange-600">{beer.abv ? `${beer.abv}%` : 'N/A'}</div>
                  <div className="text-xs sm:text-sm text-gray-600">ABV</div>
                </div>
                <div className="bg-gray-100 p-2 sm:p-3 rounded-lg text-center">
                  <div className="text-lg sm:text-2xl font-bold text-orange-600">{beer.ebc || 'N/A'}</div>
                  <div className="text-xs sm:text-sm text-gray-600">EBC</div>
                </div>
              </div>

              {/* Description */}
              {beer.description && (
                <div className="mb-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-orange-600">Description</h3>
                  <p className="text-sm sm:text-base text-gray-700">{beer.description}</p>
                </div>
              )}

              {/* Best Served With */}
              {beer.food_pairing && beer.food_pairing.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-orange-600">Best served with:</h3>
                  <ul className="list-disc list-inside text-sm sm:text-base text-gray-700">
                    {beer.food_pairing.map((food, index) => (
                      <li key={index}>{food}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* You Might Also Like */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-orange-600">You might also like:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {similarBeers.map((similarBeer) => (
                    <div
                      key={similarBeer.id}
                      className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                    >
                      <div className="w-full h-20 sm:h-24 bg-gray-200 rounded mb-2 overflow-hidden">
                        {similarBeer.image_url ? (
                          <img
                            src={similarBeer.image_url}
                            alt={similarBeer.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={getRandomPlaceholderImage()}
                            alt={similarBeer.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <h4 className="font-semibold text-xs sm:text-sm text-orange-600 truncate">{similarBeer.name}</h4>
                      <p className="text-xs text-gray-600 truncate">{similarBeer.tagline || similarBeer.style}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
