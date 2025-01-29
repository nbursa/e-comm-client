# E-Comm Shop

This project is a simple client application for an e-commerce platform, built using the Quasar Framework and Vue 3. It forms the API layer of a three-tier system, providing a modern, responsive, and user-friendly interface for managing products and their categories. This client app ensures efficient interaction with the backend API and delivers a seamless shopping experience. 🚀 [Live Demo](https://shop.nenadbursac.com)

## Backend

The backend for this application is built using the Gin framework in Go. It provides a simple API for managing products and their categories. Repository can be found at: [E-commerce Platform API](https://github.com/nbursa/e-comm-api)

## Features

- **User Authentication**: Secure login, registration functionality, token-based authentication.
- **Profile Management**: Update user profile and change password.
- **Product Management**: Browse, search, and filter products by categories.
- **Shopping Cart**: Add, update, and remove products from the cart.
- **Checkout Process**: Seamless checkout experience with order summary and payment options.
- **Order Management**: View order history and order details.
- **Localization**: Multi-language support for a global audience.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Dark Mode**: Toggle between light and dark themes.
- **Notifications**: Real-time notifications for various actions.
- **Caching**: Efficient caching of products and categories for improved performance.

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
NODE_ENV=development // or production
```

## Caching

Products are cached for 5 minutes
Categories are cached separately
Cache is stored in localStorage
