
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import {
  Flower2,
  Heart,
  Instagram,
  Facebook,
  Sparkles,
  Send,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

const API = 'https://art-studio-l9mr.vercel.app/api/site-content';

export default function Footer() {
  const { showToast } = useApp();

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [storeName, setStoreName] = useState('My Art Studio');

  useEffect(() => {
    let isMounted = true;

    async function fetchWebsiteContent() {
      try {
        const response = await fetch(API);
        const data = await response.json();

        if (isMounted && response.ok && data.content?.header?.storeName) {
          setStoreName(data.content.header.storeName);
        }
      } catch (error) {
        console.error('Unable to load footer website name:', error);
      }
    }

    fetchWebsiteContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    setSubscribed(true);
    showToast('Thank you for subscribing to our card club! 💌');
    setEmail('');
  };

  const themeText = {
    color: 'var(--theme-text)'
  };

  const themeMuted = {
    color: 'var(--theme-muted)'
  };

  const themePrimary = {
    color: 'var(--theme-secondary)'
  };

  const themeSoft = {
    backgroundColor: 'var(--theme-soft)'
  };

  const themeLogo = {
    background: 'linear-gradient(135deg, var(--theme-secondary), var(--theme-primary))'
  };

  const themeButton = {
    backgroundColor: 'var(--theme-secondary)',
    color: '#ffffff'
  };

  return (
    <footer
      className="relative overflow-hidden border-t pt-16 pb-10"
      style={{
        backgroundColor: 'var(--theme-background)',
        color: 'var(--theme-text)',
        borderColor: 'var(--theme-light)'
      }}
    >
      {/* Theme-colored background decorations */}
      <div
        className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-30"
        style={{ backgroundColor: 'var(--theme-accent)' }}
      />

      <div
        className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-25"
        style={{ backgroundColor: 'var(--theme-light)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Main Footer */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b"
          style={{ borderColor: 'var(--theme-light)' }}
        >

          {/* Brand Information */}
          <div className="lg:col-span-2 space-y-4">

            <Link to="/" className="flex items-center gap-2.5">

              {/* Dynamic Logo */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                style={themeLogo}
              >
                <Flower2 className="w-5 h-5 text-white" />
              </div>

              {/* Dynamic Website Name */}
              <span
                className="text-2xl font-serif font-bold tracking-tight"
                style={themePrimary}
              >
                {storeName}
              </span>

            </Link>

            <p
              className="text-xl font-handwritten tracking-wide"
              style={themePrimary}
            >
              "Made with Love, Designed by You."
            </p>

            <p
              className="text-xs leading-relaxed max-w-sm"
              style={themeMuted}
            >
              {storeName} is a creative boutique specializing in handmade
              and personalized greeting cards. Every card is crafted with
              love using organic botanical petals, deckled cotton papers,
              and custom calligraphy.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-75"
                style={{ ...themeSoft, color: 'var(--theme-secondary)' }}
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-75"
                style={{ ...themeSoft, color: 'var(--theme-secondary)' }}
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Pinterest"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-75"
                style={{ ...themeSoft, color: 'var(--theme-secondary)' }}
              >
                <Sparkles className="w-4 h-4" />
              </a>

            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">

            <h4
              className="text-sm font-semibold uppercase tracking-wider"
              style={themePrimary}
            >
              Quick Links
            </h4>

            <ul className="space-y-2 text-xs" style={themeMuted}>
              <li><Link to="/" className="hover:opacity-70">Home</Link></li>
              <li><Link to="/shop" className="hover:opacity-70">Shop All Cards</Link></li>
              <li>
                <Link
                  to="/customize"
                  className="font-semibold hover:opacity-70"
                  style={themePrimary}
                >
                  Design Custom Card ✨
                </Link>
              </li>
              <li><Link to="/about" className="hover:opacity-70">Our Story & Mission</Link></li>
              <li><Link to="/contact" className="hover:opacity-70">Contact Studio</Link></li>
              <li><Link to="/orders" className="hover:opacity-70">Order Tracking</Link></li>
              <li>
                <Link
                  to="/admin"
                  className="font-semibold flex items-center gap-1 hover:opacity-70"
                  style={themePrimary}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Card Categories */}
          <div className="space-y-3">

            <h4
              className="text-sm font-semibold uppercase tracking-wider"
              style={themePrimary}
            >
              Card Categories
            </h4>

            <ul className="space-y-2 text-xs" style={themeMuted}>
              <li><Link to="/shop?category=Birthday" className="hover:opacity-70">Birthday Cards</Link></li>
              <li><Link to="/shop?category=Anniversary" className="hover:opacity-70">Anniversary Keepsakes</Link></li>
              <li><Link to="/shop?category=Wedding" className="hover:opacity-70">Wedding Invitations & Cards</Link></li>
              <li><Link to="/shop?category=Friendship" className="hover:opacity-70">Friendship & Love</Link></li>
              <li><Link to="/shop?category=Thank%20You" className="hover:opacity-70">Thank You & Gratitude</Link></li>
              <li><Link to="/shop?category=Congratulations" className="hover:opacity-70">Milestone & Congratulations</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">

            <h4
              className="text-sm font-semibold uppercase tracking-wider"
              style={themePrimary}
            >
              Stay Inspired
            </h4>

            <p className="text-xs leading-relaxed" style={themeMuted}>
              Subscribe to get secret studio drops, seasonal floral card
              launches, and calligraphy tips.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 pt-1">

              <div className="flex gap-1.5">

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full min-w-0 px-3 py-2 text-xs rounded-xl border outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--theme-soft)',
                    color: 'var(--theme-text)',
                    borderColor: 'var(--theme-accent)',
                    '--tw-ring-color': 'var(--theme-primary)'
                  }}
                />

                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="px-3.5 py-2 rounded-xl text-xs font-medium shrink-0 flex items-center justify-center hover:opacity-85 transition-opacity"
                  style={themeButton}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>

              </div>

              {subscribed && (
                <p
                  className="text-[11px] flex items-center gap-1 font-medium"
                  style={themePrimary}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  You're in our private mailing club!
                </p>
              )}

            </form>
          </div>

        </div>

        {/* Copyright */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs gap-4"
          style={themeMuted}
        >

          <p className="flex items-center gap-1 text-center">
            © {new Date().getFullYear()} {storeName}. Handcrafted with

            <Heart
              className="w-3.5 h-3.5 inline"
              style={{
                color: 'var(--theme-primary)',
                fill: 'var(--theme-primary)'
              }}
            />

            for memorable celebrations.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">

            <span className="font-medium" style={themePrimary}>
              Cash on Delivery Available Across Pakistan
            </span>

            <span>·</span>

            <Link
              to="/about"
              className="hover:opacity-70"
              style={themeText}
            >
              Handmade Quality Guarantee
            </Link>

          </div>
        </div>

      </div>
    </footer>
  );
}
