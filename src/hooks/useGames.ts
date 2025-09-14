import { useState, useEffect } from 'react';
import { gameService, Game, GameResponse, Genre } from '../services/gameService';

// Custom hook for fetching popular games
export const usePopularGames = (page: number = 1) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await gameService.getPopularGames(page);
        setGames(prev => page === 1 ? response.results : [...prev, ...response.results]);
        setHasMore(!!response.next);
        setError(null);
      } catch (err) {
        setError('Failed to fetch popular games');
        console.error('Error fetching popular games:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [page]);

  return { games, loading, error, hasMore };
};

// Custom hook for searching games
export const useGameSearch = (query: string, page: number = 1) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!query.trim()) {
      setGames([]);
      setLoading(false);
      return;
    }

    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await gameService.searchGames(query, page);
        setGames(prev => page === 1 ? response.results : [...prev, ...response.results]);
        setHasMore(!!response.next);
        setError(null);
      } catch (err) {
        setError('Failed to search games');
        console.error('Error searching games:', err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchGames, 300); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [query, page]);

  return { games, loading, error, hasMore };
};

// Custom hook for fetching game details
export const useGameDetails = (id: number | null) => {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setGame(null);
      setLoading(false);
      return;
    }

    const fetchGame = async () => {
      try {
        setLoading(true);
        const gameData = await gameService.getGameDetails(id);
        setGame(gameData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch game details');
        console.error('Error fetching game details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  return { game, loading, error };
};

// Custom hook for fetching genres
export const useGenres = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const response = await gameService.getGenres();
        setGenres(response.results);
        setError(null);
      } catch (err) {
        setError('Failed to fetch genres');
        console.error('Error fetching genres:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  return { genres, loading, error };
};

// Custom hook for fetching games by genre
export const useGamesByGenre = (genreId: number | null, page: number = 1) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!genreId) {
      setGames([]);
      setLoading(false);
      return;
    }

    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await gameService.getGamesByGenre(genreId, page);
        setGames(prev => page === 1 ? response.results : [...prev, ...response.results]);
        setHasMore(!!response.next);
        setError(null);
      } catch (err) {
        setError('Failed to fetch games by genre');
        console.error('Error fetching games by genre:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [genreId, page]);

  return { games, loading, error, hasMore };
};