import axios from 'axios';

const BASE_URL = 'https://api.rawg.io/api';

// You can get a free API key from https://rawg.io/apidocs
// For demo purposes, we'll use a basic setup - replace with your actual API key
const API_KEY = import.meta.env.VITE_RAWG_API_KEY || '';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add API key as a param if available
api.interceptors.request.use((config) => {
  if (API_KEY) {
    config.params = {
      ...config.params,
      key: API_KEY,
    };
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      // Server responded with error status
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      // Request was made but no response
      console.error('Request error:', error.request);
    } else {
      // Something else happened
      console.error('Error message:', error.message);
    }
    return Promise.reject(error);
  }
);

// Game data interface
export interface Game {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  rating_top: number;
  ratings_count: number;
  released: string;
  metacritic: number;
  description_raw?: string;
  description?: string;
  platforms: Platform[];
  genres: Genre[];
  developers: Developer[];
  publishers: Publisher[];
  website?: string;
  clip?: {
    clip: string;
  };
  short_screenshots: Screenshot[];
}

export interface Platform {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export interface Developer {
  id: number;
  name: string;
  slug: string;
}

export interface Publisher {
  id: number;
  name: string;
  slug: string;
}

export interface Screenshot {
  id: number;
  image: string;
}

export interface GameResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Game[];
}

export interface GenreResponse {
  count: number;
  results: Genre[];
}

// API service functions
export const gameService = {
  // Get popular/trending games
  getPopularGames: async (page: number = 1, pageSize: number = 20): Promise<GameResponse> => {
    try {
      const response = await api.get('/games', {
        params: {
          ordering: '-rating,-metacritic',
          page,
          page_size: pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.warn('RAWG API failed, using mock data. To fix this, add your RAWG API key to .env file');
      
      // Import mock data dynamically to avoid circular imports
      const { mockGameResponse } = await import('./mockData');
      return mockGameResponse;
    }
  },

  // Get games by search query
  searchGames: async (query: string, page: number = 1, pageSize: number = 20): Promise<GameResponse> => {
    try {
      const response = await api.get('/games', {
        params: {
          search: query,
          page,
          page_size: pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.warn('RAWG API failed, using filtered mock data for search');
      
      // Import mock data and filter by query
      const { mockGames } = await import('./mockData');
      const filteredGames = mockGames.filter(game => 
        game.name.toLowerCase().includes(query.toLowerCase())
      );
      
      return {
        count: filteredGames.length,
        next: null,
        previous: null,
        results: filteredGames
      };
    }
  },

  // Get game details by ID
  getGameDetails: async (id: number): Promise<Game> => {
    try {
      const response = await api.get(`/games/${id}`);
      return response.data;
    } catch (error) {
      console.warn('RAWG API failed, using mock game details');
      
      // Import mock data and find game by ID
      const { mockGames } = await import('./mockData');
      const game = mockGames.find(g => g.id === id);
      
      if (!game) {
        throw new Error('Game not found');
      }
      
      return game;
    }
  },

  // Get game screenshots
  getGameScreenshots: async (id: number): Promise<{ results: Screenshot[] }> => {
    const response = await api.get(`/games/${id}/screenshots`);
    return response.data;
  },

  // Get games by genre
  getGamesByGenre: async (
    genreId: number,
    page: number = 1,
    pageSize: number = 20
  ): Promise<GameResponse> => {
    const response = await api.get('/games', {
      params: {
        genres: genreId,
        page,
        page_size: pageSize,
      },
    });
    return response.data;
  },

  // Get games by release year
  getGamesByYear: async (
    year: number,
    page: number = 1,
    pageSize: number = 20
  ): Promise<GameResponse> => {
    const response = await api.get('/games', {
      params: {
        dates: `${year}-01-01,${year}-12-31`,
        page,
        page_size: pageSize,
      },
    });
    return response.data;
  },

  // Get all genres
  getGenres: async (): Promise<GenreResponse> => {
    const response = await api.get('/genres');
    return response.data;
  },

  // Get upcoming games
  getUpcomingGames: async (page: number = 1, pageSize: number = 20): Promise<GameResponse> => {
    const today = new Date().toISOString().split('T')[0];
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const nextYearDate = nextYear.toISOString().split('T')[0];

    const response = await api.get('/games', {
      params: {
        dates: `${today},${nextYearDate}`,
        ordering: 'released',
        page,
        page_size: pageSize,
      },
    });
    return response.data;
  },

  // Get best games of the year
  getBestGamesOfYear: async (
    year: number,
    page: number = 1,
    pageSize: number = 20
  ): Promise<GameResponse> => {
    const response = await api.get('/games', {
      params: {
        dates: `${year}-01-01,${year}-12-31`,
        ordering: '-rating',
        page,
        page_size: pageSize,
      },
    });
    return response.data;
  },
};

export default gameService;