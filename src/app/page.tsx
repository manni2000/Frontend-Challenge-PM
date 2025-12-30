'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Header from '@/components/Header';
import BeerItem from '@/components/BeerItem';
import BeerDetailModal from '@/components/BeerDetailModal';
import { apiClient, Beer, BeerDetailResponse } from '@/utils/api';
import { FavoritesManager } from '@/utils/favorites';

export default function Home() {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cursor, setCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);
  const [selectedBeer, setSelectedBeer] = useState<BeerDetailResponse | null>(null);
  const [similarBeers, setSimilarBeers] = useState<BeerDetailResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const lastBeerElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !searchQuery) {
        loadMoreBeers();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, searchQuery]);

  useEffect(() => {
    setFavorites(FavoritesManager.getFavorites());
  }, []);

  const loadBeers = useCallback(async (isInitial = false, search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (search.trim()) {
        response = await apiClient.searchBeers(search, { count: 20 });
      } else {
        response = await apiClient.getBeers({ 
          count: isInitial ? 20 : 10,
          cursor: isInitial ? undefined : cursor 
        });
      }
      
      if (isInitial || search.trim()) {
        setBeers(response.beers);
      } else {
        setBeers(prev => [...prev, ...response.beers]);
      }
      
      setCursor(response.cursor);
      setHasMore(response.has_more);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load beers');
    } finally {
      setLoading(false);
    }
  }, [cursor]);

  const loadMoreBeers = useCallback(() => {
    if (!loading && hasMore && !searchQuery) {
      loadBeers(false, searchQuery);
    }
  }, [loading, hasMore, searchQuery, loadBeers]);

  useEffect(() => {
    loadBeers(true, searchQuery);
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCursor(undefined);
    setHasMore(true);
  };

  const handleToggleFavorite = (beer: Beer) => {
    const isFavorite = FavoritesManager.toggleFavorite(beer.id);
    setFavorites(FavoritesManager.getFavorites());
    
    // Update the beer in the local state
    setBeers(prev => prev.map(b => 
      b.id === beer.id ? b : b
    ));
  };

  const handleBeerClick = async (beer: Beer) => {
    // Close any existing modal first
    handleCloseModal();
    
    try {
      const beerDetail = await apiClient.getBeer(beer.id);
      setSelectedBeer(beerDetail);
      
      // Get similar beers (for now, just get some random beers from the same style)
      if (beerDetail.style) {
        try {
          const allBeersResponse = await apiClient.getBeers({ count: 50 });
          const similar = allBeersResponse.beers
            .filter(b => b.id !== beer.id && b.style === beerDetail.style)
            .slice(0, 3);
          
          // If not enough similar beers, get some random ones
          let finalSimilar = similar;
          if (similar.length < 3) {
            const otherBeers = allBeersResponse.beers
              .filter(b => b.id !== beer.id && !similar.some(s => s.id === b.id))
              .slice(0, 3 - similar.length);
            finalSimilar = [...similar, ...otherBeers];
          }
          
          // Deduplicate by ID to prevent duplicates
          const uniqueSimilar = finalSimilar.filter((beer, index, self) => 
            index === self.findIndex((b) => b.id === beer.id)
          );
          
          const similarDetails = await Promise.all(
            uniqueSimilar.map(b => apiClient.getBeer(b.id))
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} isSticky={true} />
      
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {loading && beers.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        )}
        
        {!loading && beers.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {searchQuery ? 'No beers found matching your search.' : 'No beers available.'}
            </p>
          </div>
        )}
        
        {/* Beer Grid */}
        <div className={`grid gap-8 justify-items-center ${
          beers.length === 1 
            ? 'grid-cols-1 max-w-2xl mx-auto' 
            : beers.length === 2
            ? 'grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto'
        }`}>
          {beers.map((beer, index) => (
            <div
              key={beer.id}
              ref={index === beers.length - 1 ? lastBeerElementRef : null}
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
        
        {/* Loading Indicator */}
        {loading && beers.length > 0 && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        )}
        
        {/* End of Results */}
        {!hasMore && beers.length > 0 && !searchQuery && (
          <div className="text-center py-8 text-gray-600">
            <p>You've reached the end of our beer collection!</p>
          </div>
        )}
      </main>
      
      {/* Beer Detail Modal */}
      {isModalOpen && (
        <BeerDetailModal
          key={`modal-${selectedBeer?.id || 'new'}`}
          beer={selectedBeer}
          similarBeers={similarBeers}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
