import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import GameCard from '../components/GameCard';
import LoadingSpinner from '../components/Loading';
import { gameService, Game } from '../services/gameService';

const FavoritesPage: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [favoriteGames, setFavoriteGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser && userProfile?.favorites) {
      loadFavoriteGames();
    } else {
      setLoading(false);
    }
  }, [currentUser, userProfile?.favorites]);

  const loadFavoriteGames = async () => {
    if (!userProfile?.favorites || userProfile.favorites.length === 0) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Load details for each favorite game
      const gamePromises = userProfile.favorites.map(gameId => 
        gameService.getGameDetails(gameId)
      );
      
      const games = await Promise.all(gamePromises);
      setFavoriteGames(games.filter(game => game)); // Filter out any failed requests
    } catch (err) {
      console.error('Error loading favorite games:', err);
      setError('Failed to load favorite games. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Sign in Required
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            You need to sign in to view your favorite games.
          </p>
          <div className="space-x-4">
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

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
            Your Favorites
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Games you've saved to your collection
          </p>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-5xl mb-4">😞</div>
            <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
            <button
              onClick={loadFavoriteGames}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        ) : favoriteGames.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-6">💔</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No favorites yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
              Start exploring games and click the heart icon to add them to your favorites!
            </p>
            <div className="space-x-4">
              <Link
                to="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Explore Games
              </Link>
              <Link
                to="/browse"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 px-6 py-3 rounded-lg font-medium border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                Browse by Category
              </Link>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Games Count */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {favoriteGames.length} {favoriteGames.length === 1 ? 'game' : 'games'} in your favorites
              </p>
            </motion.div>

            {/* Games Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {favoriteGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/game/${game.id}`}>
                    <GameCard game={game} index={index} />
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mt-12"
            >
              <Link
                to="/"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
              >
                Discover more games →
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;