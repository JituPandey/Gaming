import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GameCard from '../components/GameCard';
import LoadingSpinner from '../components/Loading';
import { gameService, Game, Genre } from '../services/gameService';
import { ChevronDownIcon, FunnelIcon as FilterIcon } from '@heroicons/react/24/outline';

interface FilterOptions {
  genre: number | null;
  year: number | null;
  ordering: string;
}

const BrowsePage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [genresLoading, setGenresLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    genre: null,
    year: null,
    ordering: '-rating'
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);
  
  const orderingOptions = [
    { value: '-rating', label: 'Highest Rated' },
    { value: '-metacritic', label: 'Best Metacritic Score' },
    { value: '-released', label: 'Newest' },
    { value: 'released', label: 'Oldest' },
    { value: 'name', label: 'A-Z' },
    { value: '-name', label: 'Z-A' }
  ];

  useEffect(() => {
    loadGenres();
    loadGames(1, true);
  }, [filters]);

  const loadGenres = async () => {
    try {
      setGenresLoading(true);
      const response = await gameService.getGenres();
      setGenres(response.results || []);
    } catch (err) {
      console.error('Error loading genres:', err);
    } finally {
      setGenresLoading(false);
    }
  };

  const loadGames = async (page: number = 1, reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (filters.genre) {
        response = await gameService.getGamesByGenre(filters.genre, page);
      } else if (filters.year) {
        response = await gameService.getGamesByYear(filters.year, page);
      } else {
        response = await gameService.getPopularGames(page);
      }

      if (reset) {
        setGames(response.results || []);
      } else {
        setGames(prev => [...prev, ...(response.results || [])]);
      }
      
      setHasMore(!!response.next);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error loading games:', err);
      setError('Failed to load games. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
    setGames([]);
  };

  const clearFilters = () => {
    setFilters({
      genre: null,
      year: null,
      ordering: '-rating'
    });
    setCurrentPage(1);
    setGames([]);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.genre) count++;
    if (filters.year) count++;
    if (filters.ordering !== '-rating') count++;
    return count;
  };

  const getSelectedGenreName = () => {
    if (!filters.genre) return 'All Genres';
    const genre = genres.find(g => g.id === filters.genre);
    return genre ? genre.name : 'All Genres';
  };

  const getSelectedOrderingLabel = () => {
    const option = orderingOptions.find(o => o.value === filters.ordering);
    return option ? option.label : 'Highest Rated';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Browse Games
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover games by genre, year, and popularity
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FilterIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Filters
              </h2>
              {getActiveFilterCount() > 0 && (
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {getActiveFilterCount()} active
                </span>
              )}
            </div>
            {getActiveFilterCount() > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Genre Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Genre
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-left shadow-sm focus:border-blue-500 focus:ring-blue-500 flex items-center justify-between"
                  disabled={genresLoading}
                >
                  <span className="text-gray-900 dark:text-white">
                    {genresLoading ? 'Loading...' : getSelectedGenreName()}
                  </span>
                  <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && !genresLoading && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                    <button
                      onClick={() => {
                        handleFilterChange('genre', null);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 ${
                        !filters.genre ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : ''
                      }`}
                    >
                      All Genres
                    </button>
                    {genres.map((genre) => (
                      <button
                        key={genre.id}
                        onClick={() => {
                          handleFilterChange('genre', genre.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white ${
                          filters.genre === genre.id ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : ''
                        }`}
                      >
                        {genre.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Release Year
              </label>
              <select
                value={filters.year || ''}
                onChange={(e) => handleFilterChange('year', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={filters.ordering}
                onChange={(e) => handleFilterChange('ordering', e.target.value)}
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
              >
                {orderingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quick Filters
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFilterChange('year', currentYear)}
                  className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  {currentYear}
                </button>
                <button
                  onClick={() => handleFilterChange('year', currentYear - 1)}
                  className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  {currentYear - 1}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
            <button
              onClick={() => loadGames(1, true)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        ) : (
          <>
            {/* Games Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
            >
              {games.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/game/${game.id}`}>
                    <GameCard game={game} />
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Load More Button */}
            {hasMore && !loading && games.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <button
                  onClick={() => loadGames(currentPage + 1, false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Load More Games
                </button>
              </motion.div>
            )}

            {/* Loading */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center py-12"
              >
                <LoadingSpinner />
              </motion.div>
            )}

            {/* No Results */}
            {!loading && games.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  No games found with the current filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  Clear filters and try again
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;