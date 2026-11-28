
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

import {
  Sparkles,
  Heart,
  Palette,
  ArrowRight,
  Gift,
  Star,
  Feather,
  Flower2,
  Instagram
} from 'lucide-react';

const API_URL = 'https://art-studio-l9mr.vercel.app/api/site-content';

const DEFAULT_CATEGORIES = [
  {
    title: 'Birthday Cards',
    category: 'Birthday',
    subtitle: 'Whimsical blooms & festive notes',
    image: '/src/assets/images/birthday_card_craft_1794160682865.jpg',
    count: '14 Designs'
  },
  {
    title: 'Anniversary Cards',
    category: 'Anniversary',
    subtitle: 'Twin botanical bouquets & heartfelt vows',
    image: '/src/assets/images/wedding_anniversary_card_1794160683110.jpg',
    count: '9 Designs'
  },
  {
    title: 'Wedding Cards',
    category: 'Wedding',
    subtitle: 'Embossed foil & dried florals',
    image: '/src/assets/images/wedding_anniversary_card_1794160683110.jpg',
    count: '11 Designs'
  },
  {
    title: 'Love & Friendship',
    category: 'Friendship',
    subtitle: 'Kindred spirits & pure warmth',
    image: '/src/assets/images/hero_handmade_cards_1794160681532.jpg',
    count: '16 Designs'
  },
  {
    title: 'Thank You Cards',
    category: 'Thank You',
    subtitle: 'Pressed purple pansies & gratitude',
    image: '/src/assets/images/floral_gratitude_card_1794160684123.jpg',
    count: '8 Designs'
  },
  {
    title: 'Congratulations',
    category: 'Congratulations',
    subtitle: 'Golden blossoms for shining moments',
    image: '/src/assets/images/floral_gratitude_card_1794160684123.jpg',
    count: '10 Designs'
  }
];

const DEFAULT_REVIEWS = [
  {
    name: 'Zara Mansoor',
    location: 'Lahore',
    occasion: 'Anniversary Card',
    rating: 5,
    review: 'The quality of the pressed lavender petals and the gold embossed calligraphy exceeded my expectations. My husband framed it immediately!'
  },
  {
    name: 'Hamza Tariq',
    location: 'Islamabad',
    occasion: 'Custom Birthday Card',
    rating: 5,
    review: 'I used the custom card editor to compose a long poem with soft lilac styling. Seeing the live preview and receiving the actual physical card was magical.'
  },
  {
    name: 'Mahnoor Bilal',
    location: 'Karachi',
    occasion: 'Thank You Note',
    rating: 5,
    review: 'Everything from the deckled paper texture to the lilac wax seal feels genuinely handcrafted with care. Best stationery boutique in Pakistan.'
  }
];

const DEFAULT_TRUST_BADGES = [
  { title: '100%', description: 'Real Dried Botanicals' },
  { title: '350 GSM', description: 'Cotton Rag Paper' },
  { title: 'Free COD', description: 'Orders Over PKR 3,000' }
];

const DEFAULT_WHY_CHOOSE = [
  {
    icon: 'Heart',
    title: 'Handmade with Love',
    description: 'Every fold, wax seal, and pressed petal is placed by hand with obsessive care in our studio.'
  },
  {
    icon: 'Palette',
    title: 'Unique Personalized Designs',
    description: 'Type your personal sentiment, pick custom colorways, and customize recipient names effortlessly.'
  },
  {
    icon: 'Feather',
    title: 'Creative & Beautiful Cards',
    description: 'Artisan 350 GSM cotton rag paper, deckled edges, and hand-embossed metallic gold finishes.'
  },
  {
    icon: 'Gift',
    title: 'Made for Special Moments',
    description: 'From milestone birthdays to weddings and daily gratitude, create memories that last forever.'
  }
];

const DEFAULT_GALLERY = [
  {
    image: '/src/assets/images/birthday_card_craft_1794160682865.jpg',
    alt: 'ArtStudio birthday card'
  },
  {
    image: '/src/assets/images/wedding_anniversary_card_1794160683110.jpg',
    alt: 'ArtStudio wedding card'
  },
  {
    image: '/src/assets/images/floral_gratitude_card_1794160684123.jpg',
    alt: 'ArtStudio floral gratitude card'
  },
  {
    image: '/src/assets/images/hero_handmade_cards_1794160681532.jpg',
    alt: 'ArtStudio handmade cards'
  }
];

const ICONS = {
  Heart,
  Palette,
  Feather,
  Gift,
  Flower2,
  Sparkles,
  Star
};

export default function Home() {
  const { products } = useApp();

  const [siteContent, setSiteContent] = useState(null);

  // Load website content from MongoDB
  useEffect(() => {
    let isMounted = true;

    const loadSiteContent = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Unable to load website content.');
        }

        if (isMounted) {
          setSiteContent(data.content);
        }
      } catch (error) {
        console.error('Homepage CMS loading error:', error.message);
      }
    };

    loadSiteContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const home = siteContent?.home || {};

  // Products from AppContext
  const bestsellingCards = products
    .filter(product => product.isBestseller)
    .slice(0, 4);

  const newArrivals = products
    .filter(product => product.isNew || !product.isBestseller)
    .slice(0, 4);

  // CMS categories with fallback content
  const categories =
    Array.isArray(home.categories) && home.categories.length > 0
      ? home.categories
      : DEFAULT_CATEGORIES;

  // CMS reviews with fallback content
  const reviews =
    Array.isArray(home.reviews) && home.reviews.length > 0
      ? home.reviews
      : DEFAULT_REVIEWS;

  // CMS trust badges with fallback content
  const trustBadges =
    Array.isArray(home.trustBadges) && home.trustBadges.length > 0
      ? home.trustBadges
      : DEFAULT_TRUST_BADGES;

  // CMS Why Choose section with fallback content
  const whyChoose =
    Array.isArray(home.whyChoose) && home.whyChoose.length > 0
      ? home.whyChoose
      : DEFAULT_WHY_CHOOSE;

  // CMS Instagram gallery with fallback content
  const gallery =
    Array.isArray(home.instagramGallery) && home.instagramGallery.length > 0
      ? home.instagramGallery
      : DEFAULT_GALLERY;

  // Customization banner
  const customizationBanner = {
    badge: 'Interactive Card Studio',
    heading: 'Your Words, Your Design, Your Card!',
    description:
      'Create a personalized greeting card with your own heartfelt message, custom pastel colors, elegant fonts, and botanical decorations.',
    buttonText: 'Design My Card Now',
    ...home.customizationBanner
  };

  return (
    <div className="space-y-20 pb-20 overflow-hidden">

      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3ECFA] border border-[#E9DDF7] text-xs font-semibold text-[#7041A6]">
                <Flower2 className="w-3.5 h-3.5 text-[#9B72CF]" />

                <span>
                  {home.heroBadge || 'Handmade with Love & Artisanal Botanicals'}
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#40334F] leading-[1.15] text-balance">
                {home.heroHeading || 'A Little Card,'}
                <br />
                <span className="text-[#7041A6] italic font-normal">
                  {home.heroAccent || 'A Lot of Love.'}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#81758F] leading-relaxed max-w-xl">
                {home.heroDescription ||
                  'Beautiful handmade cards, thoughtfully designed to make your special moments unforgettable. Personalize every word, background, and delicate dried petal decoration.'}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">

                <Link
                  to="/shop"
                  className="px-6 py-3.5 bg-[#7041A6] hover:bg-[#9B72CF] text-white font-semibold text-sm rounded-2xl shadow-lg shadow-[#7041A6]/25 transition-all hover:-translate-y-0.5 flex items-center gap-2"
                >
                  {home.heroButtonText || 'Explore Our Cards'}
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/customize"
                  className="px-6 py-3.5 bg-white hover:bg-[#FAF7FD] text-[#7041A6] border-2 border-[#C8A2E8] font-semibold text-sm rounded-2xl shadow-sm transition-all hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <Palette className="w-4 h-4 text-[#9B72CF]" />
                  Create Your Own Card
                </Link>

              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-[#E9DDF7] grid grid-cols-3 gap-4 text-left">
                {trustBadges.map((badge, index) => (
                  <div key={index}>
                    <p className="text-lg font-bold text-[#7041A6] font-serif">
                      {badge.title}
                    </p>
                    <p className="text-xs text-[#81758F]">
                      {badge.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl shadow-[#9B72CF]/20">

                <img
                  src={
                    home.heroImage ||
                    '/src/assets/images/hero_handmade_cards_1794160681532.jpg'
                  }
                  alt="Handcrafted lavender greeting cards"
                  className="w-full h-auto aspect-[4/3] object-cover"
                />

                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-[#E9DDF7] shadow-lg flex items-center justify-between">

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F3ECFA] text-[#7041A6] flex items-center justify-center font-bold">
                      🌸
                    </div>

                    <div>
                      <p className="text-xs font-bold text-[#40334F]">
                        {home.featuredTitle || 'Artisanal Lavender Suite'}
                      </p>
                      <p className="text-[11px] text-[#81758F]">
                        {home.featuredDescription || 'With silk ribbons & dried flora'}
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/shop"
                    className="text-xs font-semibold text-[#7041A6] hover:text-[#9B72CF]"
                  >
                    View
                  </Link>

                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-[#7041A6] text-white p-3 rounded-2xl shadow-lg rotate-6 hidden sm:flex items-center gap-1.5 text-xs font-semibold">
                <Heart className="w-4 h-4 fill-white" />
                Hand-lettered
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="text-xs font-semibold tracking-wider uppercase text-[#7041A6]">
            Handmade Collections
          </div>

          <h2 className="font-serif text-3xl font-bold text-[#40334F]">
            {home.categoriesHeading || 'Cards for Every Cherished Occasion'}
          </h2>

          <p className="text-sm text-[#81758F]">
            {home.categoriesSubtitle ||
              'Browse our specially curated categories, designed with delicate dried florals and deckled paper.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, index) => (
            <Link
              key={cat._id || index}
              to={`/shop?category=${encodeURIComponent(cat.category || 'Birthday')}`}
              className="group relative rounded-3xl overflow-hidden border border-[#E9DDF7] bg-white hover:border-[#C8A2E8] shadow-sm hover:shadow-xl hover:shadow-[#9B72CF]/15 transition-all duration-300 flex flex-col"
            >
              <div className="aspect-[16/10] overflow-hidden bg-[#FAF7FD]">
                <img
                  src={cat.image || '/src/assets/images/hero_handmade_cards_1794160681532.jpg'}
                  alt={cat.title || 'ArtStudio category'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#40334F] group-hover:text-[#7041A6] transition-colors">
                    {cat.title}
                  </h3>

                  <p className="text-xs text-[#81758F] mt-0.5">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="w-8 h-8 rounded-full bg-[#F3ECFA] text-[#7041A6] group-hover:bg-[#7041A6] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. BESTSELLING PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#7041A6]">
              Customer Favorites
            </span>

            <h2 className="font-serif text-3xl font-bold text-[#40334F] mt-1">
              Bestselling Handmade Cards
            </h2>
          </div>

          <Link
            to="/shop"
            className="text-xs font-semibold text-[#7041A6] hover:text-[#9B72CF] flex items-center gap-1.5 group"
          >
            Browse Full Catalog
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellingCards.map(card => (
            <ProductCard key={card.id} card={card} />
          ))}
        </div>

      </section>

      {/* 4. CUSTOMIZATION BANNER - UPDATED FOR THEME CONTRAST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div
          className="relative rounded-3xl p-8 sm:p-12 text-white overflow-hidden shadow-xl transition-all duration-300"
          style={{
            background: `linear-gradient(
              110deg,
              var(--theme-secondary),
              color-mix(in srgb, var(--theme-secondary) 78%, var(--theme-text))
            )`
          }}
        >

          <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
            <Flower2 className="w-96 h-96 text-white" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">

            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{customizationBanner.badge}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
              {customizationBanner.heading}
            </h2>

            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              {customizationBanner.description}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/customize"
                className="px-7 py-3.5 bg-white font-bold text-sm rounded-2xl shadow-lg transition-transform hover:scale-105"
                style={{ color: 'var(--theme-secondary)' }}
              >
                {customizationBanner.buttonText} ✨
              </Link>

              <span className="text-xs text-white/90">
                • Real-time Live Preview & Instant PNG Download
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE ARTSTUDIO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#7041A6]">
            The ArtStudio Difference
          </span>

          <h2 className="font-serif text-3xl font-bold text-[#40334F]">
            Why Customers Love ArtStudio
          </h2>

          <p className="text-sm text-[#81758F]">
            Every greeting card is an heirloom piece crafted to be treasured for years.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChoose.map((item, index) => {
            const Icon = ICONS[item.icon] || Heart;

            return (
              <div
                key={item._id || index}
                className="p-6 bg-white rounded-3xl border border-[#E9DDF7] space-y-3 text-center hover:border-[#C8A2E8] transition-colors"
              >
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#F3ECFA] text-[#7041A6] flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="font-serif text-base font-bold text-[#40334F]">
                  {item.title}
                </h3>

                <p className="text-xs text-[#81758F] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#7041A6]">
              Fresh from the Easel
            </span>

            <h2 className="font-serif text-3xl font-bold text-[#40334F] mt-1">
              New Handmade Arrivals
            </h2>
          </div>

          <Link
            to="/shop"
            className="text-xs font-semibold text-[#7041A6] hover:text-[#9B72CF] flex items-center gap-1.5"
          >
            View All Cards
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map(card => (
            <ProductCard key={card.id} card={card} />
          ))}
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="bg-[#FAF7FD] border border-[#E9DDF7] rounded-3xl p-8 sm:p-12">

          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#7041A6]">
              Heartfelt Words
            </span>

            <h2 className="font-serif text-3xl font-bold text-[#40334F]">
              Loved by Gift Givers Across Pakistan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <div
                key={review._id || index}
                className="bg-white rounded-2xl p-6 border border-[#E9DDF7] shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex text-amber-400 gap-1">
                    {[...Array(Math.max(0, Math.min(5, Number(review.rating) || 5)))].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 stroke-amber-400"
                      />
                    ))}
                  </div>

                  <p className="text-xs text-[#40334F] italic leading-relaxed">
                    "{review.review}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F3ECFA]">
                  <p className="text-xs font-bold text-[#40334F]">
                    {review.name}
                  </p>

                  <p className="text-[11px] text-[#81758F]">
                    {review.location}
                    {review.occasion ? ` · ${review.occasion}` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. INSTAGRAM GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">

        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#7041A6]">
            Studio Sneak Peeks
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#40334F] mt-1">
            Follow Our Creative Journey @ArtStudioCards
          </h2>

          <p className="text-xs text-[#81758F] mt-1">
            Tag your cards with #ArtStudioMoments to be featured in our gallery
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {gallery.map((item, index) => (
            <div
              key={item._id || index}
              className="rounded-2xl overflow-hidden aspect-square border border-[#E9DDF7] group relative"
            >
              <img
                src={item.image || item.url}
                alt={item.alt || 'ArtStudio craft showcase'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              <div className="absolute inset-0 bg-[#7041A6]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Instagram className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
