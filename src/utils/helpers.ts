// Environment variables and configuration
export const CONFIG = {
  RAWG_API_KEY: import.meta.env.VITE_RAWG_API_KEY || 'key', // Replace with your actual API key
  RAWG_BASE_URL: 'https://api.rawg.io/api',
};

// Utility functions
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'TBD';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatRating = (rating: number): string => {
  return rating ? rating.toFixed(1) : 'N/A';
};

export const getImageUrl = (url: string | null | undefined): string => {
  if (!url) {
    return '/placeholder-game.jpg'; // You can add a placeholder image
  }
  return url;
};

export const truncateText = (text: string, maxLength: number = 150): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const getPlatformNames = (platforms: any[]): string => {
  if (!platforms || platforms.length === 0) return 'Multiple Platforms';
  return platforms.slice(0, 3).map(p => p.platform.name).join(', ');
};

export const getGenreNames = (genres: any[]): string => {
  if (!genres || genres.length === 0) return 'Various';
  return genres.slice(0, 3).map(g => g.name).join(', ');
};

export const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};