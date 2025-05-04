"# Sushi Shop Clone

A modern sushi delivery platform built with the MERN stack (MongoDB, Express, React, Node.js). This application provides a seamless experience for customers to browse and order sushi, while giving restaurant staff robust tools to manage their menu, orders, and inventory.

## Project Overview

This application consists of:

- **Customer-facing storefront** - Browse menu, place orders, track delivery
- **Restaurant back-office** - Manage products, orders, and inventory
- **Admin panel** - Platform administration and analytics

## Technology Stack

### Frontend
- React with Vite
- TypeScript
- Chakra UI
- Zustand for state management
- React Router v6+
- React Query / Axios

### Backend
- Express.js
- MongoDB with Mongoose
- Passport.js with JWT
- Cloudinary for product images

### DevOps
- Netlify/Vercel (frontend)
- Railway/Render (backend)
- MongoDB Atlas
- GitHub Actions for CI/CD
- Sentry for monitoring

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- MongoDB (local or Atlas connection)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/SushiShopClone.git
   cd SushiShopClone
   ```

2. Install dependencies for both client and server
   ```bash
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

3. Create environment variables
   - Create `.env` files in both client and server directories
   - See `.env.example` files for required variables

4. Run the development servers
   ```bash
   # Start the backend server
   cd server
   npm run dev
   
   # In a separate terminal, start the client
   cd client
   npm run dev
   ```

5. Access the application
   - Frontend: http://localhost:5173 (default Vite port)
   - Backend API: http://localhost:5000

## Features

- Product catalog with categories and filtering
- User authentication and account management
- Shopping cart and checkout flow
- Order tracking and history
- Admin panel for restaurant management
- Analytics and reporting

## Project Structure

```
/
├── client/             # Frontend React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Route components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── utils/      # Utility functions
│   │   └── assets/     # Static assets
│   └── ...
├── server/             # Backend Express API
│   ├── src/
│   │   ├── controllers/ # Route controllers
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Express middleware
│   │   └── utils/       # Utility functions
│   └── ...
└── ...
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
