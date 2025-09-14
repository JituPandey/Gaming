# 🎮 GameHub - Modern Gaming Website

A comprehensive gaming website built with React, TypeScript, and Firebase. Discover, search, and manage your favorite games with a beautiful, responsive interface featuring full authentication, favorites system, and dark/light themes.

![GameHub Preview](https://gogogaming.netlify.app/))

## ✨ Features

### 🎯 Core Functionality
- **Game Discovery** - Browse trending and popular games from 500,000+ database
- **Advanced Search** - Find games by title, genre, or developer  
- **Detailed Game Pages** - Screenshots, videos, reviews, and comprehensive metadata
- **Smart Filtering** - Filter by genre, release year, platform, and rating
- **Responsive Design** - Perfect experience on desktop, tablet, and mobile

### 🔐 User Features  
- **Firebase Authentication** - Secure login/registration with Google OAuth
- **Favorites System** - Save and manage your favorite games
- **User Profiles** - Personalized gaming experience
- **Dark/Light Themes** - Customizable appearance with system preference detection
- **Protected Routes** - Secure user-specific features

### � Technical Features
- **Modern React 18** - Latest React features with TypeScript
- **Framer Motion** - Smooth animations and page transitions
- **Tailwind CSS v3** - Utility-first responsive styling with dark mode
- **RAWG API Integration** - Real-time access to massive games database
- **Firebase Firestore** - Cloud database for user data
- **Vite Build System** - Lightning-fast development and builds  
- 🔐 **User Authentication** - Firebase Auth integration
- ❤️ **Favorites System** - Save and manage favorite games
- 🌓 **Dark/Light Mode** - Theme switching functionality

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v3
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **API**: RAWG Video Games Database
- **HTTP Client**: Axios
- **Development**: ESLint, PostCSS

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- RAWG API key (free at [rawg.io](https://rawg.io/apidocs))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gaming-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your RAWG API key:
   ```env
   VITE_RAWG_API_KEY=your_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── GameCard.tsx    # Game display card
│   ├── Header.tsx      # Navigation header
│   ├── Loading.tsx     # Loading states
│   └── SearchBar.tsx   # Search functionality
├── pages/              # Main application pages
│   ├── Homepage.tsx    # Landing page
│   ├── SearchPage.tsx  # Search results
│   └── GameDetailPage.tsx # Game details
├── services/           # API integration
│   └── gameService.ts  # RAWG API calls
├── hooks/              # Custom React hooks
│   └── useGames.ts     # Game data hooks
├── utils/              # Utility functions
│   └── helpers.ts      # Helper functions
├── context/            # React context providers
└── styles/             # Global styles
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## 🌟 Key Features Breakdown

### Homepage
- Hero section with search capability
- Popular games grid with infinite loading
- Stats and features showcase
- Quick genre navigation

### Search Functionality
- Real-time search with debouncing
- Search suggestions and popular searches
- Filtered results with load more
- Empty state handling

### Game Details
- Comprehensive game information
- Screenshot gallery with thumbnails
- Rating and review statistics
- Platform and developer information
- Genre tags and official links

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interactions
- Accessible navigation

## 🎨 Design System

### Colors
- Primary: Blue gradient (#3B82F6 to #1D4ED8)
- Secondary: Purple accent (#8B5CF6)
- Background: Gray variations for light/dark mode
- Status: Green, Yellow, Red for ratings

### Components
- Cards with hover effects
- Buttons with loading states
- Form inputs with focus styles
- Loading skeletons

### Animations
- Page transitions
- Card hover effects
- Loading states
- Micro-interactions

## 🔗 API Integration

The app uses the RAWG Video Games Database API:

- **Popular Games**: Trending and top-rated games
- **Search**: Game search by name, genre, platform
- **Game Details**: Comprehensive game information
- **Screenshots**: Game media and screenshots
- **Genres**: Available game categories

### Rate Limiting
The RAWG API has rate limits. The free tier allows:
- 20,000 requests per month
- No more than 5 requests per second

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify
1. Connect repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Other Platforms
The app can be deployed to any static hosting platform:
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

## 🔮 Upcoming Features

1. **Categories Page** - Browse games by genre, platform, year
2. **Advanced Filters** - Price, rating, release date filtering
3. **User Accounts** - Registration and login with Firebase
4. **Favorites System** - Personal game library
5. **Reviews** - User ratings and reviews
6. **Wishlist** - Save games for later
7. **Dark Mode** - System preference detection
8. **Social Features** - Share games, friend lists
9. **Recommendations** - Personalized game suggestions
10. **Mobile App** - React Native version

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [RAWG](https://rawg.io) - For the amazing games database API
- [Tailwind CSS](https://tailwindcss.com) - For the utility-first CSS framework
- [Framer Motion](https://framer.com/motion) - For smooth animations
- [React](https://react.dev) - For the component-based architecture
- [Vite](https://vitejs.dev) - For the lightning-fast development experience

## 📞 Support

If you have any questions or issues:

1. Check the [Issues](../../issues) page
2. Create a new issue with details
3. Join our community discussions

---

**Happy Gaming! 🎮**te

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
