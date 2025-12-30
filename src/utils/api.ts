// Use proxy routes to avoid CORS issues
const API_BASE_URL = '';

// Import dummy data for images and descriptions
import dummyData from '../data/beer-image.json'

export interface Beer {
  id: string;
  name: string;
  style?: string;
  description?: string | null;
  abv?: number;
  ibu?: number;
  ebc?: number;
  tagline?: string;
  image_url?: string;
  brewer?: {
    id: string;
    name: string;
  };
}

export interface BeerListResponse {
  beers: Beer[];
  cursor?: string;
  has_more: boolean;
}

export interface BeerDetailResponse extends Beer {
  description?: string | null;
  first_brewed?: string;
  food_pairing?: string[];
  contributed_by?: string;
}

class ApiClient {
  private getHeaders() {
    return {
      'Accept': 'application/json',
    };
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getBeers(params?: { count?: number; cursor?: string }): Promise<BeerListResponse> {
    try {
      const response = await this.get<any>('/api/beers', params);
      
      
      // Handle the actual API response structure
      let beersArray: any[] = [];
      let cursor: string | undefined;
      let hasMore: boolean = false;
      
      if (response && typeof response === 'object') {
        // The API returns: { object: 'list', url: '/beer', has_more: true, next_cursor: 'NQ==', data: [...] }
        beersArray = response.data || [];
        cursor = response.next_cursor;
        hasMore = response.has_more || false;
      } else if (Array.isArray(response)) {
        beersArray = response;
      }
      
      
      // Transform response to match our interface
      const beers: Beer[] = beersArray.map((beer: any, index: number) => ({
        id: beer.id,
        name: beer.name,
        style: beer.style,
        description: dummyData.descriptions[index % dummyData.descriptions.length],
        abv: beer.abv,
        ibu: beer.ibu,
        ebc: beer.ebc,
        tagline: dummyData.taglines[index % dummyData.taglines.length],
        image_url: dummyData.images[index % dummyData.images.length],
        brewer: beer.brewer,
      }));

      return {
        beers,
        cursor,
        has_more: hasMore,
      };
    } catch (error) {
      console.error('Error in getBeers:', error);
      // Return mock data on error
      return {
        beers: [
          {
            id: 'error-1',
            name: 'Error Loading Beers',
            style: 'Unknown',
            tagline: 'Please check console for details',
            abv: 0,
            ibu: 0,
            ebc: 0,
            image_url: undefined,
            brewer: undefined
          }
        ],
        cursor: undefined,
        has_more: false,
      };
    }
  }

  async getBeer(id: string): Promise<BeerDetailResponse> {
    const beer = await this.get<any>(`/api/beers/${id}`);
    
    // Find the index of this beer in the original array to match homepage
    const allBeers = await this.get<any>('/api/beers');
    let allBeersArray: any[] = [];
    
    if (allBeers && typeof allBeers === 'object') {
      allBeersArray = allBeers.data || [];
    } else if (Array.isArray(allBeers)) {
      allBeersArray = allBeers;
    }
    
    const beerIndex = allBeersArray.findIndex((b: any) => b.id === id);
    const index = beerIndex >= 0 ? beerIndex : 0;
    
    return {
      id: beer.id,
      name: beer.name,
      style: beer.style,
      description: dummyData.descriptions[index % dummyData.descriptions.length],
      abv: beer.abv,
      ibu: beer.ibu,
      ebc: beer.ebc,
      tagline: dummyData.taglines[index % dummyData.taglines.length],
      image_url: dummyData.images[index % dummyData.images.length],
      brewer: beer.brewer,
      first_brewed: beer.first_brewed,
      food_pairing: beer.food_pairing,
      contributed_by: beer.contributed_by,
    };
  }

  async searchBeers(query: string, params?: { count?: number; cursor?: string }): Promise<BeerListResponse> {
    // Since the API doesn't have a search endpoint, we'll fetch all beers and filter client-side
    const response = await this.getBeers(params);
    
    if (!query.trim()) {
      return response;
    }

    const filteredBeers = response.beers.filter(beer =>
      beer.name.toLowerCase().includes(query.toLowerCase()) ||
      beer.style?.toLowerCase().includes(query.toLowerCase()) ||
      beer.tagline?.toLowerCase().includes(query.toLowerCase())
    );

    return {
      beers: filteredBeers,
      cursor: response.cursor,
      has_more: response.has_more,
    };
  }
}

export const apiClient = new ApiClient();
