
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

import {
  Heart,
  ShoppingBag,
  Sparkles,
  Search,
  Menu,
  X,
  User,
  ShieldCheck,
  Palette,
  Flower2
} from 'lucide-react';

const API = 'http://localhost:5000/api/site-content';

export default function Navbar() {
  const {
    cartCount,
    wishlist,
    products,
    user,
    logout
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const [headerContent, setHeaderContent] = useState({
    announcement: 'Complimentary hand-lettered wax seal envelope with every customized card order!',
    storeName: 'ArtStudio',
    tagline: 'HANDMADE & CUSTOMIZED',
    logo: '',
    showAnnouncement: true
  });

  const navigate = useNavigate();

  // Only show admin links to actual admin accounts.
  const isAdmin = user?.role === 'admin';

  // CORRECT WISHLIST COUNT
  const wishlistCount = products.filter(product =>
    wishlist.some(
      id => String(id) === String(product.id)
    )
  ).length;

  // Theme colors
  const theme = {
    primary: 'var(--theme-primary)',
    secondary: 'var(--theme-secondary)',
    accent: 'var(--theme-accent)',
    light: 'var(--theme-light)',
    soft: 'var(--theme-soft)',
    background: 'var(--theme-background)',
    text: 'var(--theme-text)',
    muted: 'var(--theme-muted)'
  };

  // LOAD HEADER CONTENT FROM MONGODB
  useEffect(() => {
    let active = true;

    async function loadHeader() {
      try {
        const response = await fetch(API);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error('Unable to load header content');
        }

        if (active && data.content?.header) {
          setHeaderContent(previous => ({
            ...previous,
            ...data.content.header
          }));
        }
      } catch (error) {
        console.error('Navbar CMS error:', error);
      }
    }

    loadHeader();

    return () => {
      active = false;
    };
  }, []);

  // SEARCH
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(
        `/shop?search=${encodeURIComponent(searchQuery.trim())}`
      );

      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop Cards', path: '/shop' },
    {
      name: 'Customize Your Card',
      path: '/customize',
      highlight: true
    },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' }
  ];

  return (
    <>
      <style>{`
        .artstudio-navbar a,
        .artstudio-navbar button {
          transition: color .2s ease, background-color .2s ease, box-shadow .2s ease,
            border-color .2s ease, transform .2s ease;
        }
        .artstudio-navbar a:hover,
        .artstudio-navbar button:hover {
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--theme-primary) 14%, transparent),
            0 7px 18px color-mix(in srgb, var(--theme-primary) 22%, transparent);
        }
        .artstudio-brand-mark {
          box-shadow: 0 4px 12px color-mix(in srgb, var(--theme-primary) 28%, transparent);
          transition: box-shadow .25s ease, transform .25s ease;
        }
        .artstudio-brand:hover .artstudio-brand-mark {
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--theme-primary) 18%, transparent),
            0 8px 22px color-mix(in srgb, var(--theme-primary) 35%, transparent);
          transform: translateY(-1px) scale(1.04);
        }
      `}</style>

      {/* ANNOUNCEMENT BAR */}
      {headerContent.showAnnouncement !== false && (
        <div
          className="text-xs font-medium py-1.5 px-4 text-center border-b flex flex-wrap items-center justify-center gap-3"
          style={{
            backgroundColor: theme.soft,
            color: theme.secondary,
            borderColor: theme.light
          }}
        >
          <div className="flex items-center gap-1.5">
            <Sparkles
              className="w-3.5 h-3.5"
              style={{ color: theme.primary }}
            />

            <span>{headerContent.announcement}</span>
          </div>

          {isAdmin && (
            <>
              <span
                className="hidden md:inline"
                style={{ color: theme.accent }}
              >
                |
              </span>

              <Link
                to="/admin"
                className="inline-flex items-center gap-1 font-bold underline transition-colors"
                style={{ color: theme.secondary }}
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Atelier Admin Panel</span>
              </Link>
            </>
          )}
        </div>
      )}

      {/* MAIN NAVBAR */}
      <header
        className="artstudio-navbar sticky top-0 z-40 backdrop-blur-md border-b transition-all duration-200"
        style={{
          backgroundColor: 'rgba(255,255,255,0.96)',
          borderColor: theme.light
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">

          {/* BRAND LOGO */}
          <Link to="/" className="artstudio-brand flex items-center gap-2.5 group rounded-xl">

            <div
              className="artstudio-brand-mark w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                color: '#FFFFFF'
              }}
            >
              {headerContent.logo ? (
                <img
                  src={headerContent.logo}
                  alt={`${headerContent.storeName} logo`}
                  className="w-full h-full object-contain rounded-2xl"
                />
              ) : (
                <Flower2 className="w-5 h-5" />
              )}
            </div>

            <div className="flex flex-col">
              <span
                className="text-2xl font-serif font-bold tracking-tight transition-colors leading-none"
                style={{ color: theme.secondary }}
              >
                {headerContent.storeName || 'ArtStudio'}
              </span>

              <span
                className="text-[10px] tracking-wider uppercase font-medium font-sans mt-0.5"
                style={{ color: theme.muted }}
              >
                {headerContent.tagline || 'HANDMADE & CUSTOMIZED'}
              </span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors relative py-1 ${
                    link.highlight
                      ? 'flex items-center gap-1.5'
                      : ''
                  }`
                }
                style={({ isActive }) => ({
                  color: isActive || link.highlight
                    ? theme.secondary
                    : theme.text,
                  fontWeight: isActive ? 700 : 500
                })}
              >
                {({ isActive }) => (
                  <>
                    {link.highlight && (
                      <Palette
                        className="w-3.5 h-3.5"
                        style={{ color: theme.primary }}
                      />
                    )}

                    {link.name}

                    {isActive && (
                      <span
                        className="absolute bottom-0 left-0 w-full h-0.5 rounded-full"
                        style={{ backgroundColor: theme.primary }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* ACTION ICONS */}
          <div className="flex items-center gap-3 sm:gap-4">

            {/* SEARCH */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-xl transition-colors"
              style={{ color: theme.text }}
              title="Search cards"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* WISHLIST */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-xl transition-colors"
              style={{ color: theme.text }}
              title="Wishlist"
              aria-label={`Wishlist with ${wishlistCount} products`}
            >
              <Heart className="w-5 h-5" />

              {wishlistCount > 0 && (
                <span
                  className="absolute top-1 right-1 w-4 h-4 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none"
                  style={{ backgroundColor: theme.primary }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* CART */}
            <Link
              to="/cart"
              className="relative p-2 rounded-xl transition-colors"
              style={{ color: theme.text }}
              title="Shopping Cart"
              aria-label={`Cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />

              {cartCount > 0 && (
                <span
                  className="absolute top-1 right-1 w-4 h-4 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none"
                  style={{ backgroundColor: theme.secondary }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* ADMIN PANEL - ADMIN ONLY */}
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all"
                style={{
                  backgroundColor: theme.soft,
                  color: theme.secondary,
                  borderColor: theme.accent
                }}
                title="Open Admin Dashboard"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </Link>
            )}

            {/* USER ACCOUNT */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 pr-3 border rounded-xl transition-colors text-xs font-medium"
                  style={{
                    backgroundColor: theme.soft,
                    borderColor: theme.light,
                    color: theme.text
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs"
                    style={{
                      backgroundColor: theme.accent,
                      color: theme.secondary
                    }}
                  >
                    {user.name
                      ? user.name.charAt(0).toUpperCase()
                      : 'U'}
                  </div>

                  <span className="hidden sm:inline max-w-[90px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </button>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-xs font-semibold px-3 py-1.5 transition-colors"
                    style={{ color: theme.secondary }}
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className="text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-sm transition-all text-white"
                    style={{ backgroundColor: theme.secondary }}
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* ACCOUNT DROPDOWN */}
              {userDropdownOpen && user && (
                <div
                  className="absolute right-0 mt-2 w-52 rounded-2xl shadow-xl border py-2 z-50 animate-fadeIn"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: theme.light
                  }}
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div
                    className="px-4 py-2 border-b"
                    style={{ borderColor: theme.light }}
                  >
                    <p
                      className="text-xs"
                      style={{ color: theme.muted }}
                    >
                      Signed in as
                    </p>

                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: theme.text }}
                    >
                      {user.name}
                    </p>

                    <p
                      className="text-xs truncate"
                      style={{ color: theme.muted }}
                    >
                      {user.email}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium"
                    style={{ color: theme.text }}
                  >
                    <User
                      className="w-4 h-4"
                      style={{ color: theme.primary }}
                    />
                    My Profile
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium"
                    style={{ color: theme.text }}
                  >
                    <ShoppingBag
                      className="w-4 h-4"
                      style={{ color: theme.primary }}
                    />
                    My Orders
                  </Link>

                  <Link
                    to="/customize"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium"
                    style={{ color: theme.text }}
                  >
                    <Palette
                      className="w-4 h-4"
                      style={{ color: theme.primary }}
                    />
                    Card Studio
                  </Link>

                  {/* ADMIN DASHBOARD - ADMIN ONLY */}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium"
                      style={{ color: theme.secondary }}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Admin Dashboard
                    </Link>
                  )}

                  <div
                    className="border-t my-1"
                    style={{ borderColor: theme.light }}
                  />

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl transition-colors"
              style={{ color: theme.text }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen
                ? <X className="w-6 h-6" />
                : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* SEARCH DRAWER */}
        {searchOpen && (
          <div
            className="border-t px-4 py-3"
            style={{
              backgroundColor: theme.background,
              borderColor: theme.light
            }}
          >
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-2xl mx-auto flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Search
                  className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: theme.muted }}
                />

                <input
                  type="text"
                  placeholder="Search cards by occasion, style, or flower type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border text-sm focus:outline-none focus:ring-2"
                  style={{
                    borderColor: theme.accent,
                    color: theme.text
                  }}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 text-white text-xs font-medium rounded-xl transition-colors shrink-0"
                style={{ backgroundColor: theme.secondary }}
              >
                Search
              </button>

              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2"
                style={{ color: theme.muted }}
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* MOBILE NAVIGATION */}
        {mobileMenuOpen && (
          <div
            className="md:hidden border-t px-4 pt-3 pb-6 space-y-2"
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: theme.light
            }}
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-medium"
                style={({ isActive }) => ({
                  backgroundColor: isActive ? theme.soft : 'transparent',
                  color: isActive ? theme.secondary : theme.text,
                  fontWeight: isActive ? 700 : 500
                })}
              >
                {link.name}
              </NavLink>
            ))}

            <div
              className="pt-3 border-t space-y-2"
              style={{ borderColor: theme.light }}
            >
              {/* ADMIN DASHBOARD - ADMIN ONLY */}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
                  style={{ color: theme.secondary }}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              )}

              {!user && (
                <div className="flex gap-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center text-xs font-semibold border rounded-xl"
                    style={{
                      color: theme.secondary,
                      borderColor: theme.accent
                    }}
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center text-xs font-semibold text-white rounded-xl"
                    style={{ backgroundColor: theme.secondary }}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
