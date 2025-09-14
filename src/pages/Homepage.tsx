import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GameCard from '../components/GameCard';
import SearchBar from '../components/SearchBar';
import ApiKeyNotice from '../components/ApiKeyNotice';
import LoadingSpinner, { GameGridSkeleton } from '../components/Loading';
import { usePopularGames } from '../hooks/useGames';

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { games, loading, error, hasMore } = usePopularGames(page);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/search');
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

  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <GameGridSkeleton count={12} />
        </div>
      </div>
    );
  }

  if (error && games.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-600 dark:text-red-400 text-xl mb-4">
              ⚠️ Failed to load games
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      {/* API Key Notice */}
      <ApiKeyNotice />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Discover Amazing{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Games
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Explore the world's largest collection of games. Find your next favorite,
            discover new genres, and stay up-to-date with the latest releases.
          </p>
          
          {/* Hero Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search for your next adventure..."
              className=""
            />
          </div>
          
          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            {['Action', 'RPG', 'Adventure', 'Strategy'].map((genre) => (
              <button
                key={genre}
                onClick={() => handleSearch(genre)}
                className="px-6 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                {genre}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Popular Games Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              🔥 Popular Games
            </h2>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span>{games.length} games loaded</span>
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {games.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
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
                  'Load More Games'
                )}
              </button>
            </div>
          )}
        </motion.section>

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                500K+
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Games in Database</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                50+
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Gaming Platforms</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                Daily
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Database Updates</p>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div className="card p-6 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Advanced Search
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Find games by name, genre, platform, or release date with our powerful search engine.
            </p>
          </div>
          
          <div className="card p-6 text-center">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Detailed Reviews
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get comprehensive information including ratings, reviews, and screenshots.
            </p>
          </div>
          
          <div className="card p-6 text-center">
            <div className="text-4xl mb-4">💾</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Save Favorites
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create your personal gaming wishlist and keep track of games you want to play.
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Homepage;