# The Beer Bank

A modern, responsive web application for exploring and discovering beers. Built with Next.js 16, React 19, and Tailwind CSS, this app provides a beautiful interface for browsing beer collections, managing favorites, and viewing detailed beer information.

## Features

- **Beer Discovery**: Browse an extensive collection of beers with detailed information
- **Search Functionality**: Real-time search by beer name, style, or tagline
- **Favorites System**: Save and manage your favorite beers with localStorage persistence
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Detailed Modal Views**: Interactive modals with beer details, stats, and similar recommendations
- **Infinite Scroll**: Load more beers seamlessly as you browse
- **Beautiful UI**: Modern design with smooth animations and transitions

## Tech Stack

### Frontend
- **Next.js 16.1.1** - React framework with App Router
- **React 19.2.3** - UI library with latest features
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Compiler** - Optimized React components

### API & Data
- **Beer Catalog API** - External beer database integration
- **Next.js API Routes** - Proxy server for CORS handling
- **LocalStorage** - Client-side favorites persistence
- **Dummy Data** - Enhanced beer images and descriptions

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── beers/
│   │       ├── route.ts              # API proxy for beer list
│   │       └── [id]/route.ts         # API proxy for individual beer
│   ├── favourites/
│   │   └── page.tsx                 # Favorites management page
│   ├── globals.css                  # Global styles and utilities
│   ├── layout.tsx                   # Root layout with fonts
│   └── page.tsx                     # Main home page
├── components/
│   ├── Header.tsx                   # Navigation header with search
│   ├── BeerItem.tsx                 # Individual beer card component
│   └── BeerDetailModal.tsx          # Modal for detailed beer information
├── hooks/
│   └── useBeerImage.ts              # Custom hook for beer images
├── utils/
│   ├── api.ts                       # API client with error handling
│   └── favorites.ts                 # Favorites management utilities
└── data/
    └── beer-image.json              # Dummy images and descriptions
```

## Core Components

### BeerItem Component
- Interactive beer cards with hover effects
- Favorite toggle functionality
- Image fallback handling
- Responsive design for all screen sizes
- Click to view detailed information

### BeerDetailModal Component
- Full beer details with images and descriptions
- Beer statistics (ABV, IBU, EBC)
- Food pairing suggestions
- Similar beer recommendations
- Responsive modal with proper scroll handling
- Body scroll lock when open

### Header Component
- Navigation between Home and Favorites
- Real-time search functionality
- Sticky navigation with scroll effects
- Responsive design

## API Integration

### External API
- **Base URL**: `https://api.catalog.beer`
- **Authentication**: Basic Auth with API key
- **Endpoints**: 
  - `/beer` - Get beer list with pagination
  - `/beer/{id}` - Get individual beer details

### API Proxy Routes
The app uses Next.js API routes to proxy requests and handle CORS:
- `/api/beers` - Proxy for beer list endpoint
- `/api/beers/{id}` - Proxy for individual beer endpoint

### Data Enhancement
Since the external API has limited image and description data, the app enhances it with:
- High-quality Unsplash beer images
- Detailed beer descriptions
- Creative taglines
- Consistent data formatting

## Responsive Design

### Mobile (< 640px)
- Single column layout
- Touch-optimized interactions
- Compact modal design
- Simplified navigation

### Tablet (640px - 1024px)
- Two-column grid for beer cards
- Optimized modal sizing
- Enhanced spacing and typography

### Desktop (> 1024px)
- Three-column grid for beer cards
- Full-featured modal layout
- Optimal use of screen real estate

## Styling & UX

### Design System
- **Primary Color**: Orange (#f97316)
- **Typography**: Geist Sans and Geist Mono fonts
- **Animations**: Smooth transitions and hover effects
- **Icons**: Inline SVG icons for optimal performance

### Key UX Features
- Loading states with spinners
- Error handling with fallback content
- Empty states with helpful messaging
- Keyboard navigation support
- Accessibility considerations

## Data Management

### Favorites System
- **Storage**: localStorage for persistence
- **Management**: FavoritesManager class with static methods
- **Features**: Add, remove, toggle, and check favorites
- **Sync**: Real-time updates across components

### State Management
- React hooks for local state
- Props drilling for component communication
- Optimistic updates for better UX
- Error boundaries for graceful failures

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd the-beer-bank
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Tailwind CSS
- Configured with PostCSS
- Custom utilities for text truncation
- Responsive design utilities
- Custom animations

## Troubleshooting

### Common Issues

1. **CORS Errors**: The app uses API proxy routes to handle CORS
2. **Missing Images**: Fallback SVG placeholders are used
3. **Slow Loading**: Pagination and lazy loading implemented
4. **Mobile Scrolling**: Body scroll lock prevents background scrolling

### Debug Features
- Console logging for API responses
- Error boundaries with helpful messages
- Development mode with React DevTools support

## Performance Optimizations

- **Image Optimization**: WebP format with fallbacks
- **Code Splitting**: Automatic with Next.js
- **Lazy Loading**: Implemented for beer images
- **Caching**: API responses cached where appropriate
- **Bundle Size**: Optimized imports and tree shaking

## Security Considerations

- API key stored server-side in proxy routes
- Input sanitization for search queries
- XSS prevention with React's built-in protections
- HTTPS recommended for production

## Deployment

### Vercel (Recommended)
1. Connect repository to Vercel
2. Configure environment variables
3. Deploy automatically on git push

### Other Platforms
- Build with `npm run build`
- Deploy `out` directory to static hosting
- Configure server-side rendering if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Beer Catalog API](https://api.catalog.beer) for beer data
- [Unsplash](https://unsplash.com) for high-quality beer images
- [Tailwind CSS](https://tailwindcss.com) for styling framework
- [Next.js](https://nextjs.org) for the React framework
#
