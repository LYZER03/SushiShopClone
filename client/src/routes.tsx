import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';

import AppLayout from './components/layout/AppLayout';
import { ProtectedRoute } from './components/auth';

// Lazy load pages with suspense boundary
const ErrorPage = lazy(() => import('./pages/ErrorPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const MenuPage = lazy(() => import('./pages/MenuPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const ShopsPage = lazy(() => import('./pages/ShopsPage'));
const TestPage = lazy(() => import('./pages/TestPage'));

// Auth pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const AuthTestPage = lazy(() => import('./pages/AuthTestPage')); // Auth test page

// Lazy load profile pages
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

// Placeholder pages that will be implemented later
const AboutPage = lazy(() => Promise.resolve({ default: () => <div>About Page - Coming Soon</div> }));
const ContactPage = lazy(() => Promise.resolve({ default: () => <div>Contact Page - Coming Soon</div> }));
const CartPage = lazy(() => Promise.resolve({ default: () => <div>Cart Page - Coming Soon</div> }));
const CheckoutPage = lazy(() => Promise.resolve({ default: () => <div>Checkout Page - Coming Soon</div> }));
const OrderHistoryPage = lazy(() => Promise.resolve({ default: () => <div>Order History - Coming Soon</div> }));

// Define routes with Suspense-ready lazy components
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'menu',
        element: <MenuPage />
      },
      {
        path: 'menu/:id',
        element: <ProductDetailPage />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'about',
        element: <AboutPage />
      },
      {
        path: 'contact',
        element: <ContactPage />
      },
      {
        path: 'shops',
        element: <ShopsPage />
      },
      {
        path: 'cart',
        element: (
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders',
        element: (
          <ProtectedRoute>
            <OrderHistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'test',
        element: <TestPage />
      },
      {
        path: 'auth-test',
        element: <AuthTestPage />
      },
    ],
  },
]);

export default router;
