import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import LoadingSpinner from '../components/Loading';
import { useGameDetails } from '../hooks/useGames';
import { formatDate, formatRating, getImageUrl, getPlatformNames, getGenreNames } from '../utils/helpers';
import { gameService, Screenshot } from '../services/gameService';

const GameDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, isFavorite, addToFavorites, removeFromFavorites, addToGameHistory } = useAuth();
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string>('');
  const [isLoadingScreenshots, setIsLoadingScreenshots] = useState(false);

  const gameId = id ? parseInt(id) : null;
  const { game, loading, error } = useGameDetails(gameId);

  // Load screenshots and add to history when game is loaded
  useEffect(() => {
    if (game?.id) {
      loadScreenshots(game.id);
      // Add to user's game history
      if (currentUser) {
        addToGameHistory(game.id).catch(console.error);
      }
    }
  }, [game?.id, currentUser]);

  const loadScreenshots = async (gameId: number) => {
    try {
      setIsLoadingScreenshots(true);
      const screenshotData = await gameService.getGameScreenshots(gameId);
      setScreenshots(screenshotData.results || []);
      if (screenshotData.results && screenshotData.results.length > 0) {
        setSelectedScreenshot(screenshotData.results[0].image);
      }
    } catch (err) {
      console.error('Error loading screenshots:', err);
    } finally {
      setIsLoadingScreenshots(false);
    }
  };

  const handleFavoriteClick = async () => {
    if (!currentUser || !game) return;

    try {
      if (isFavorite(game.id)) {
        await removeFromFavorites(game.id);
      } else {
        await addToFavorites(game.id);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button Skeleton */}
          <div className="mb-6">
            <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-32 animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Skeleton */}
            <div>
              <div className="h-96 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse mb-4"></div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-20 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
            
            {/* Content Skeleton */}
            <div>
              <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-3/4 animate-pulse"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4 w-1/2 animate-pulse"></div>
              <div className="space-y-2 mb-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                ))}
              </div>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-8 w-20 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-red-600 dark:text-red-400 text-xl mb-4">
              ⚠️ Game not found
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {error || 'The requested game could not be found.'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors mb-6"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Game Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image */}
            <div className="relative mb-4">
              <img
                src={selectedScreenshot || getImageUrl(game.background_image)}
                alt={game.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-game.jpg';
                }}
              />
              
              {/* Rating Badge */}
              {game.rating > 0 && (
                <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg">
                  ⭐ {formatRating(game.rating)}
                </div>
              )}
              
              {/* Metacritic Score */}
              {game.metacritic && (
                <div className={`absolute top-4 left-4 px-3 py-2 rounded-lg font-bold text-white ${
                  game.metacritic >= 75 ? 'bg-green-600' : 
                  game.metacritic >= 50 ? 'bg-yellow-600' : 
                  'bg-red-600'
                }`}>
                  Metacritic: {game.metacritic}
                </div>
              )}
            </div>

            {/* Screenshot Thumbnails */}
            {screenshots.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                <img
                  src={getImageUrl(game.background_image)}
                  alt={`${game.name} main`}
                  className={`h-20 w-20 object-cover rounded cursor-pointer flex-shrink-0 transition-all ${
                    (selectedScreenshot === getImageUrl(game.background_image)) || !selectedScreenshot
                      ? 'ring-2 ring-blue-500'
                      : 'hover:ring-1 hover:ring-gray-400'
                  }`}
                  onClick={() => setSelectedScreenshot(getImageUrl(game.background_image))}
                />
                {screenshots.map((screenshot, index) => (
                  <img
                    key={screenshot.id}
                    src={screenshot.image}
                    alt={`${game.name} screenshot ${index + 1}`}
                    className={`h-20 w-20 object-cover rounded cursor-pointer flex-shrink-0 transition-all ${
                      selectedScreenshot === screenshot.image
                        ? 'ring-2 ring-blue-500'
                        : 'hover:ring-1 hover:ring-gray-400'
                    }`}
                    onClick={() => setSelectedScreenshot(screenshot.image)}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Game Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
                {game.name}
              </h1>
              
              {/* Favorite Button */}
              {currentUser && (
                <motion.button
                  onClick={handleFavoriteClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  {isFavorite(game.id) ? (
                    <>
                      <HeartIconSolid className="w-5 h-5 text-red-500" />
                      <span className="text-red-500 font-medium">Favorited</span>
                    </>
                  ) : (
                    <>
                      <HeartIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Add to Favorites</span>
                    </>
                  )}
                </motion.button>
              )}
            </div>

            {/* Basic Info */}
            <div className="space-y-3 mb-6">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Release Date: </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatDate(game.released)}
                </span>
              </div>
              
              <div>
                <span className="text-gray-600 dark:text-gray-400">Platforms: </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {getPlatformNames(game.platforms)}
                </span>
              </div>
              
              {game.developers && game.developers.length > 0 && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Developer: </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {game.developers.map(dev => dev.name).join(', ')}
                  </span>
                </div>
              )}
              
              {game.publishers && game.publishers.length > 0 && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Publisher: </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {game.publishers.map(pub => pub.name).join(', ')}
                  </span>
                </div>
              )}
            </div>

            {/* Rating and Reviews */}
            {game.ratings_count > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Player Ratings
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatRating(game.rating)}/5
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    ({game.ratings_count.toLocaleString()} reviews)
                  </div>
                </div>
              </div>
            )}

            {/* Genres */}
            {game.genres && game.genres.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Genres
                </h3>
                <div className="flex flex-wrap gap-2">
                  {game.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm px-3 py-1 rounded-full"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Website Link */}
            {game.website && (
              <div className="mb-6">
                <a
                  href={game.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  <span>Official Website</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary">
                ❤️ Add to Favorites
              </button>
              <button className="btn-secondary">
                📤 Share Game
              </button>
            </div>
          </motion.div>
        </div>

        {/* Game Description */}
        {game.description_raw && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              About {game.name}
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {game.description_raw}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GameDetailPage;