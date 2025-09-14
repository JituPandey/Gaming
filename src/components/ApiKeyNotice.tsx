import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const ApiKeyNotice: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 mx-4 sm:mx-6 lg:mx-8"
      >
        <div className="flex items-start">
          <InformationCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
          <div className="flex-grow">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
              Using Demo Data
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              Currently showing demo games. For full access to the latest games database, get a free API key from{' '}
              <a 
                href="https://rawg.io/apidocs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline font-medium hover:text-blue-800 dark:hover:text-blue-200"
              >
                RAWG.io
              </a>{' '}
              and add it to your .env file.
            </p>
            <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 rounded px-2 py-1 font-mono">
              VITE_RAWG_API_KEY=your_api_key_here
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-blue-400 dark:text-blue-500 hover:text-blue-600 dark:hover:text-blue-300 ml-3"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ApiKeyNotice;