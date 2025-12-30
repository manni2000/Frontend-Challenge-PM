'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import BeerItem from '@/components/BeerItem';
import BeerDetailModal from '@/components/BeerDetailModal';
import { apiClient, Beer, BeerDetailResponse } from '@/utils/api';
import { FavoritesManager } from '@/utils/favorites';

export default function FavouritesPage() {
  const [favoriteBeers, setFavoriteBeers] = useState<Beer[]>([]);
  const [allBeers, setAllBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBeer, setSelectedBeer] = useState<BeerDetailResponse | null>(null);
  const [similarBeers, setSimilarBeers] = useState<BeerDetailResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load all beers to get the full data
        const allBeersResponse = await apiClient.getBeers({ count: 100 });
        setAllBeers(allBeersResponse.beers);
        
        // Get favorite IDs and filter beers
        const favoriteIds = FavoritesManager.getFavorites();
        const favoriteBeersList = allBeersResponse.beers.filter(beer => 
          favoriteIds.includes(beer.id)
        );
        
        setFavoriteBeers(favoriteBeersList);
        setFavorites(favoriteIds);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load favorite beers');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleToggleFavorite = (beer: Beer) => {
    const isFavorite = FavoritesManager.toggleFavorite(beer.id);
    const updatedFavorites = FavoritesManager.getFavorites();
    setFavorites(updatedFavorites);
    
    // Update the favorite beers list
    if (isFavorite) {
      setFavoriteBeers(prev => [...prev, beer]);
    } else {
      setFavoriteBeers(prev => prev.filter(b => b.id !== beer.id));
    }
  };

  const handleBeerClick = async (beer: Beer) => {
    try {
      const beerDetail = await apiClient.getBeer(beer.id);
      setSelectedBeer(beerDetail);
      
      // Get similar beers
      if (beerDetail.style) {
        try {
          const similar = allBeers
            .filter(b => b.id !== beer.id && b.style === beerDetail.style)
            .slice(0, 3);
          
          const similarDetails = await Promise.all(
            similar.map(b => apiClient.getBeer(b.id))
          );
          setSimilarBeers(similarDetails);
        } catch (err) {
          console.error('Error loading similar beers:', err);
          setSimilarBeers([]);
        }
      } else {
        setSimilarBeers([]);
      }
      
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error loading beer details:', err);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBeer(null);
    setSimilarBeers([]);
  };

  const handleSearch = (query: string) => {
    // Filter favorite beers based on search query
    if (!query.trim()) {
      const favoriteIds = FavoritesManager.getFavorites();
      const favoriteBeersList = allBeers.filter(beer => 
        favoriteIds.includes(beer.id)
      );
      setFavoriteBeers(favoriteBeersList);
    } else {
      const filtered = favoriteBeers.filter(beer =>
        beer.name.toLowerCase().includes(query.toLowerCase()) ||
        beer.style?.toLowerCase().includes(query.toLowerCase()) ||
        beer.tagline?.toLowerCase().includes(query.toLowerCase())
      );
      setFavoriteBeers(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} isSticky={true} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorite Beers</h1>
          <p className="text-gray-600">
            You have {favoriteBeers.length} favorite{favoriteBeers.length !== 1 ? 's' : ''}
          </p>
          <Link 
            href="/"
            className="inline-flex items-center mt-4 text-orange-600 hover:text-orange-700 font-medium"
          >
            <svg 
              className="w-4 h-4 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Back to all beers
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        )}
        
        {!loading && favoriteBeers.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg 
                className="w-16 h-16 mx-auto text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No favorite beers yet</h2>
            <p className="text-gray-600 mb-4">
              Start exploring and add some beers to your favorites!
            </p>
            <Link 
              href="/"
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
            >
              Explore Beers
              <svg 
                className="w-4 h-4 ml-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M14 5l7 7m0 0l-7 7m7-7H3" 
                />
              </svg>
            </Link>
          </div>
        )}
        
        {/* Beer Grid */}
        <div className={`grid gap-8 justify-items-center ${
          favoriteBeers.length === 1 
            ? 'grid-cols-1 max-w-2xl mx-auto' 
            : favoriteBeers.length === 2
            ? 'grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto'
        }`}>
          {favoriteBeers.map((beer) => (
            <div
              key={beer.id}
              className="w-full max-w-sm"
            >
              <BeerItem
                beer={beer}
                isFavorite={favorites.includes(beer.id)}
                onToggleFavorite={handleToggleFavorite}
                onClick={handleBeerClick}
              />
            </div>
          ))}
        </div>
      </main>
      
      {/* Beer Detail Modal */}
      <BeerDetailModal
        beer={selectedBeer}
        similarBeers={similarBeers}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
