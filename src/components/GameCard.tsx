import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { Game } from '../services/gameService';
import { formatDate, formatRating, getImageUrl, getPlatformNames, truncateText } from '../utils/helpers';

interface GameCardProps {
  game: Game;
  index?: number;
}

const GameCard: React.FC<GameCardProps> = ({ game, index = 0 }) => {
  const { currentUser, isFavorite, addToFavorites, removeFromFavorites } = useAuth();
  
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94] as any,
      },
    },
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentUser) return;

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

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        scale: 1.03,
        y: -5,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
      className="game-card group transform-gpu"
    >
      <div className="relative overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <Link to={`/game/${game.id}`} className="block">
          {/* Game Image */}
          <div className="relative h-48 bg-gray-300 dark:bg-gray-600 overflow-hidden">
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
              src={getImageUrl(game.background_image)}
              alt={game.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-game.jpg';
              }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Rating Badge with Animation */}
            {game.rating > 0 && (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: index * 0.1 + 0.3, 
                  duration: 0.5, 
                  type: "spring",
                  stiffness: 200 
                }}
                className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
              >
                ⭐ {formatRating(game.rating)}
              </motion.div>
            )}

            {/* Metacritic Score */}
            {game.metacritic && (
              <motion.div
                initial={{ scale: 0, x: -50 }}
                animate={{ scale: 1, x: 0 }}
                transition={{ 
                  delay: index * 0.1 + 0.4, 
                  duration: 0.5, 
                  type: "spring",
                  stiffness: 200 
                }}
                className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold text-white ${
                  game.metacritic >= 75 
                    ? 'bg-green-600' 
                    : game.metacritic >= 50 
                    ? 'bg-yellow-600' 
                    : 'bg-red-600'
                }`}
              >
                {game.metacritic}
              </motion.div>
            )}

            {/* Favorite Button */}
            {currentUser && (
              <motion.button
                onClick={handleFavoriteClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-2 right-2 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-white/30 dark:border-gray-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                {isFavorite(game.id) ? (
                  <HeartIconSolid className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </motion.button>
            )}

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/30"
              >
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </motion.div>
            </div>
          </div>

          {/* Game Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className="p-4"
          >
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {game.name}
            </h3>

            {/* Release Date */}
            {game.released && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Released: {formatDate(game.released)}
              </p>
            )}

            {/* Genres */}
            {game.genres && game.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {game.genres.slice(0, 3).map((genre) => (
                  <span
                    key={genre.id}
                    className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Platforms */}
            {game.platforms && game.platforms.length > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {getPlatformNames(game.platforms)}
              </p>
            )}
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
};

export default GameCard;