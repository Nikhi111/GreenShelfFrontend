# GreenShelf Frontend

A modern e-commerce platform for plants and gardening supplies built with React, Vite, and Tailwind CSS. GreenShelf connects plant enthusiasts with local nurseries, offering a seamless shopping experience with AI-powered plant recommendations.

## Features

### For Customers
- **Browse Plants**: Explore a wide variety of indoor plants, outdoor plants, succulents, and flowering plants
- **AI Plant Advisor**: Get personalized plant recommendations based on your preferences and environment
- **Shopping Cart & Checkout**: Secure and intuitive shopping experience
- **Order Tracking**: Monitor your orders from purchase to delivery
- **User Dashboard**: Manage profile, addresses, wishlist, and order history

### For Sellers
- **Seller Dashboard**: Comprehensive business management tools
- **Product Management**: Add, edit, and manage plant inventory
- **Order Management**: Process and track customer orders
- **Nursery Management**: Manage multiple nursery locations
- **Business Analytics**: Track sales performance and business metrics

### For Administrators
- **Admin Dashboard**: Complete platform oversight
- **User Management**: Manage customers and sellers
- **Verification System**: Approve seller and nursery registrations
- **Product Oversight**: Monitor all platform products
- **System Configuration**: Platform settings and configurations

## Tech Stack

### Frontend Framework
- **React 19.2.4** - Modern React with latest features
- **Vite 8.0.4** - Fast development and build tool
- **React Router DOM 7.14.0** - Client-side routing

### Styling & UI
- **Tailwind CSS 4.2.2** - Utility-first CSS framework
- **Framer Motion 12.38.0** - Animation library
- **Lucide React 1.7.0** - Icon library
- **React Icons 5.6.0** - Additional icon components

### State Management & Data
- **Zustand 5.0.12** - Lightweight state management
- **Axios 1.14.0** - HTTP client for API calls

### Development Tools
- **ESLint 9.39.4** - Code linting and formatting
- **React Compiler** - Optimized React compilation
- **GH Pages 6.3.0** - Deployment to GitHub Pages

## Project Structure

```
src/
|-- components/          # Reusable UI components
|   |-- auth/           # Authentication components
|   |-- admin/          # Admin-specific components
|   |-- layout/         # Layout components (Navbar, etc.)
|   |-- products/       # Product-related components
|   |-- seller/         # Seller-specific components
|   |-- HomePage.jsx    # Main landing page
|   |-- AdminLayout.jsx # Admin dashboard layout
|   |-- SellerLayout.jsx # Seller dashboard layout
|   |-- UserLayout.jsx  # User dashboard layout
|
|-- pages/              # Page components
|   |-- admin/          # Admin pages
|   |-- seller/         # Seller pages
|   |-- LoginPage.jsx   # User authentication
|   |-- ProductsPage.jsx # Product listing
|   |-- CartPage.jsx    # Shopping cart
|   |-- CheckoutPage.jsx # Checkout process
|   |-- RecommendationPage.jsx # AI recommendations
|
|-- services/           # API services
|   |-- productService.js # Product API calls
|   |-- authService.js   # Authentication API
|
|-- store/              # State management (Zustand)
|-- utils/              # Utility functions
|-- context/            # React contexts
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Nikhi111/GreenShelfFrontend.git
cd GreenShelfFrontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file in the root directory
VITE_WEATHER_API_KEY=your_weather_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run predeploy` - Build before deployment
- `npm run deploy` - Deploy to GitHub Pages

## API Integration

The frontend connects to a backend API hosted at:
- **Production**: `https://greenshelf-sh2b.onrender.com`

### Key API Endpoints
- `/products/public` - Get public product listings
- `/products/search` - Search products
- `/auth/login` - User authentication
- `/auth/register` - User registration
- `/orders` - Order management

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_WEATHER_API_KEY=ec8a92a497452b7731c15b3f2836f9f9
```

## Deployment

### GitHub Pages
The project is configured for automatic deployment to GitHub Pages:

1. Push changes to the main branch
2. GitHub Actions will automatically build and deploy
3. The site will be available at your GitHub Pages URL

### Manual Deployment
```bash
npm run build
npm run deploy
```

## Key Features Explained

### Multi-Role System
- **Customers**: Browse and purchase plants
- **Sellers**: Manage inventory and orders
- **Administrators**: Oversee the entire platform

### AI-Powered Recommendations
The platform includes an AI advisor that provides personalized plant recommendations based on:
- User preferences
- Local climate conditions
- Care requirements
- Available space

### Secure Authentication
- JWT-based authentication
- Role-based access control
- Protected routes for different user types

### Responsive Design
- Mobile-first approach
- Tailwind CSS for consistent styling
- Smooth animations with Framer Motion

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team

---

**GreenShelf** - Growing together, one plant at a time!
