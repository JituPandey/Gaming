import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import GameCard from '../components/GameCard';
import LoadingSpinner, { GameGridSkeleton } from '../components/Loading';
import { useGameSearch } from '../hooks/useGames';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  
  const { games, loading, error, hasMore } = useGameSearch(searchQuery, page);

  // Get search query from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get('q') || '';
    setSearchQuery(query);
    setPage(1);
  }, [location.search]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    
    // Update URL with search query
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set('q', query.trim());
    }
    
    navigate({
      pathname: '/search',
      search: params.toString(),
    });
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Find Your Next{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Adventure
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Search through thousands of games to find exactly what you're looking for
          </p>

          {/* Search Bar */}
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search games, genres, developers..."
            className="max-w-2xl mx-auto"
          />
        </motion.div>

        {/* Search Results */}
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {loading && page === 1 ? (
                  'Searching...'
                ) : games.length > 0 ? (
                  `Found ${games.length} games for "${searchQuery}"`
                ) : (
                  `No results for "${searchQuery}"`
                )}
              </h2>
              
              {games.length > 0 && (
                <button
                  onClick={() => navigate('/')}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  ← Back to Home
                </button>
              )}
            </div>

            {/* Loading State */}
            {loading && page === 1 && <GameGridSkeleton count={12} />}

            {/* Error State */}
            {error && games.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-red-600 dark:text-red-400 text-xl mb-4">
                  ⚠️ Search Error
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {error}
                </p>
                <button
                  onClick={() => handleSearch(searchQuery)}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </motion.div>
            )}

            {/* No Results */}
            {!loading && searchQuery && games.length === 0 && !error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  No games found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Try searching with different keywords or check for typos in your search.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['Action', 'RPG', 'Adventure', 'Strategy', 'Indie'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSearch(suggestion)}
                      className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Games Grid */}
            {games.length > 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {games.map((game, index) => (
                    <GameCard key={`${game.id}-${index}`} game={game} index={index} />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="btn-primary inline-flex items-center gap-2 px-8 py-3"
                    >
                      {loading ? (
                        <>
                          <LoadingSpinner size="sm" />
                          Loading...
                        </>
                      ) : (
                        'Load More Results'
                      )}
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Popular Searches (when no search query) */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
              Popular Searches
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                'Cyberpunk 2077',
                'The Witcher 3',
                'God of War',
                'Call of Duty',
                'Minecraft',
                'GTA V',
                'Red Dead Redemption',
                'Assassin\'s Creed',
                'FIFA',
                'Fortnite',
                'Among Us',
                'Fall Guys'
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSearch(suggestion)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;