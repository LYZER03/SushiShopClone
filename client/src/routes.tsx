import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';

import AppLayout from './components/layout/AppLayout';

// Use direct imports for the pages we've already created
const ErrorPage = lazy(() => import('./pages/ErrorPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const MenuPage = lazy(() => import('./pages/MenuPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));

// Define the application routes
// Create placeholder components that will be implemented later
const LoginPage = lazy(() => Promise.resolve({ default: () => <div>Login Page - Coming Soon</div> }));
const RegisterPage = lazy(() => Promise.resolve({ default: () => <div>Register Page - Coming Soon</div> }));
const ProfilePage = lazy(() => Promise.resolve({ default: () => <div>Profile Page - Coming Soon</div> }));
const AboutPage = lazy(() => Promise.resolve({ default: () => <div>About Page - Coming Soon</div> }));
const ContactPage = lazy(() => Promise.resolve({ default: () => <div>Contact Page - Coming Soon</div> }));

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
        element: <ProfilePage />
      },
      {
        path: 'about',
        element: <AboutPage />
      },
      {
        path: 'contact',
        element: <ContactPage />
      },
    ],
  },
]);

export default router;
