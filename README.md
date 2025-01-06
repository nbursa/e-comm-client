# E-Commerce Platform

Modern e-commerce platform built with Quasar Framework and Vue 3.

## Live Demo

🚀 <a href="https://shop.nenadbursac.com" target="_blank" rel="noopener noreferrer">Live Demo</a>

## Features

- 🛍️ Product catalog with categories
- 🛒 Shopping cart with real-time updates
- 🌐 Multi-language support (EN/SR)
- 🎨 Light/Dark theme
- 💾 Caching system for products and categories
- 📱 Responsive design for mobile and desktop

## Tech Stack

- Vue 3 + TypeScript
- Quasar Framework
- Pinia for state management
- Vue-i18n for internationalization
- Tailwind CSS for styling

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Lint files
npm run lint

# Format files
npm run format
```

## Development

The app will be available at: http://localhost:9000

Network URL will be displayed in the terminal

## Environment Variables

Create a .env file:

```
VITE_API_URL=your_api_url_here
```

## Caching

Products are cached for 5 minutes
Categories are cached separately
Cache is stored in localStorage
