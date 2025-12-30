import { Beer } from './api';

const FAVORITES_KEY = 'beer-bank-favorites';

export class FavoritesManager {
  static getFavorites(): string[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const favorites = localStorage.getItem(FAVORITES_KEY);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  }

  static addFavorite(beerId: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const favorites = this.getFavorites();
      if (!favorites.includes(beerId)) {
        favorites.push(beerId);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  }

  static removeFavorite(beerId: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const favorites = this.getFavorites();
      const updatedFavorites = favorites.filter(id => id !== beerId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }

  static toggleFavorite(beerId: string): boolean {
    const favorites = this.getFavorites();
    const isFavorite = favorites.includes(beerId);
    
    if (isFavorite) {
      this.removeFavorite(beerId);
    } else {
      this.addFavorite(beerId);
    }
    
    return !isFavorite;
  }

  static isFavorite(beerId: string): boolean {
    return this.getFavorites().includes(beerId);
  }

  static getFavoriteBeers(allBeers: Beer[]): Beer[] {
    const favoriteIds = this.getFavorites();
    return allBeers.filter(beer => favoriteIds.includes(beer.id));
  }
}
