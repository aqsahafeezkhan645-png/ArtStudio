
import React, { useEffect } from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate
} from 'react-router-dom';

import {
  AppProvider,
  useApp
} from './context/AppContext.jsx';

import { THEMES, applyTheme } from './utils/theme.js';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';

import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import CustomizeCard from './pages/CustomizeCard.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Checkout from './pages/Checkout.jsx';
import MyOrders from './pages/MyOrders.jsx';
import UserProfile from './pages/UserProfile.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import CustomerDashboard from './pages/CustomerDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';

import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';

// ========================================
// PROTECTED ROUTE
// ========================================

function ProtectedRoute({ children, requiredRole }) {
  const { user, authLoading } = useApp();

  // Wait until the backend checks the login session.
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Checking account permissions...</p>
      </div>
    );
  }

  // User must be logged in.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check the user's role.
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// ========================================
// LOAD SAVED THEME
// ========================================

function ThemeInitializer() {
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('artstudio-theme');

      if (savedTheme) {
        const parsed = JSON.parse(savedTheme);
        applyTheme(parsed.colors || THEMES['Light Pink']);
      } else {
        applyTheme(THEMES['Light Pink']);
      }
    } catch (error) {
      console.error('Theme loading error:', error);
      applyTheme(THEMES['Light Pink']);
    }
  }, []);

  return null;
}

// ========================================
// SCROLL TO TOP ON ROUTE CHANGE
// ========================================

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
}

// ========================================
// MAIN APPLICATION
// ========================================

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>

        <ThemeInitializer />
        <ScrollToTop />

        <div
          className="min-h-screen flex flex-col"
          style={{
            backgroundColor: 'var(--theme-background)',
            color: 'var(--theme-text)',
            transition: 'background-color 0.3s ease, color 0.3s ease'
          }}
        >

          <Toast />

          <Navbar />

          <main className="flex-1">

            <Routes>

              {/* MAIN PAGES */}
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/customize" element={<CustomizeCard />} />
              <Route path="/product/:id" element={<ProductDetails />} />

              {/* SHOPPING */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />

              <Route
                path="/checkout"
                element={<Checkout />}
              />

              {/* PUBLIC AUTHENTICATION */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* CUSTOMER ACCOUNT */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredRole="customer">
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />

              {/* PASSWORD RECOVERY */}
              <Route
                path="/forgot-password"
                element={<ForgotPassword />}
              />

              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />

              {/* ADMIN - ADMIN ROLE ONLY */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* INFORMATION */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* FALLBACK */}
              <Route path="*" element={<Home />} />

            </Routes>

          </main>

          <Footer />

        </div>

      </BrowserRouter>
    </AppProvider>
  );
}
