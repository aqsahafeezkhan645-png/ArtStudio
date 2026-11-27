
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

import {
  Heart,
  ShoppingBag,
  Star,
  Eye,
  Loader2,
  Trash2
} from 'lucide-react';

export default function ProductCard({ card }) {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist
  } = useApp();

  const [adding, setAdding] = useState(false);

  const wishlisted = isInWishlist(card.id);

  const stockCount = Number(card.stock ?? 0);

  const isOutOfStock =
    !Number.isFinite(stockCount) || stockCount <= 0;

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

  // Main action handler
  const handleAction = async () => {
    if (adding) return;

    // Out of stock: toggle wishlist
    if (isOutOfStock) {
      toggleWishlist(card.id);
      return;
    }

    // In stock: add to cart
    setAdding(true);

    try {
      const result = await addToCart(card, 1);

      if (!result?.success) {
        return;
      }
    } catch (error) {
      console.error('Add to cart error:', error);
    } finally {
      setAdding(false);
    }
  };

  const getStockLabel = () => {
    if (isOutOfStock) return 'Out of Stock';
    if (stockCount === 1) return 'Only 1 Left!';
    if (stockCount <= 5) return `Only ${stockCount} Left`;

    return `In Stock (${stockCount})`;
  };

  return (
    <div
      className="group rounded-3xl border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
      style={{
        backgroundColor: theme.background,
        borderColor: theme.accent
      }}
    >
      {/* IMAGE CONTAINER */}
      <div
        className="relative aspect-[4/3] overflow-hidden"
        style={{ backgroundColor: theme.light }}
      >
        <img
          src={card.image}
          alt={card.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* WISHLIST ICON */}
        <button
          type="button"
          onClick={() => toggleWishlist(card.id)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all backdrop-blur-md shadow-sm"
          style={{
            backgroundColor: wishlisted
              ? theme.secondary
              : 'rgba(255,255,255,0.92)',
            color: wishlisted ? '#FFFFFF' : theme.text
          }}
          title={
            wishlisted
              ? 'Remove from Wishlist'
              : 'Add to Wishlist'
          }
          aria-label={
            wishlisted
              ? 'Remove from Wishlist'
              : 'Add to Wishlist'
          }
        >
          <Heart
            className="w-4 h-4"
            fill={wishlisted ? 'currentColor' : 'none'}
          />
        </button>

        {/* CATEGORY */}
        <div
          className="absolute bottom-3 left-3 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-semibold shadow-sm"
          style={{
            backgroundColor: 'rgba(255,255,255,0.94)',
            color: theme.secondary
          }}
        >
          {card.category}
        </div>

        {/* BESTSELLER */}
        {card.isBestseller && (
          <div
            className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase shadow-sm"
            style={{
              backgroundColor: theme.secondary,
              color: '#FFFFFF'
            }}
          >
            Bestseller
          </div>
        )}

        {/* OUT OF STOCK OVERLAY */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
            <span className="bg-white px-4 py-2 rounded-xl text-sm font-bold text-red-600 shadow-lg">
              OUT OF STOCK
            </span>
          </div>
        )}
      </div>

      {/* CARD INFORMATION */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* RATING */}
          <div
            className="flex items-center gap-1.5 text-xs mb-1"
            style={{ color: theme.muted }}
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />

            <span
              className="font-semibold"
              style={{ color: theme.text }}
            >
              {card.rating}
            </span>

            <span>
              ({card.reviewsCount || 0} reviews)
            </span>
          </div>

          {/* PRODUCT NAME */}
          <Link to={`/product/${card.id}`}>
            <h3
              className="font-serif text-base font-semibold transition-colors line-clamp-1"
              style={{ color: theme.text }}
            >
              {card.name}
            </h3>
          </Link>

          {/* DESCRIPTION */}
          <p
            className="text-xs line-clamp-2 mt-1 leading-relaxed"
            style={{ color: theme.muted }}
          >
            {card.description}
          </p>
        </div>

        {/* PRICE AND ACTIONS */}
        <div
          className="pt-3 border-t space-y-3"
          style={{ borderColor: theme.light }}
        >
          {/* PRICE AND STOCK */}
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span
                className="text-lg font-bold tabular-nums"
                style={{ color: theme.secondary }}
              >
                PKR {Number(
                  card.discountPrice || card.price || 0
                ).toLocaleString()}
              </span>

              {card.discountPrice && (
                <span
                  className="text-xs line-through tabular-nums"
                  style={{ color: theme.muted }}
                >
                  PKR {Number(
                    card.price || 0
                  ).toLocaleString()}
                </span>
              )}
            </div>

            <span
              className="text-[11px] font-semibold whitespace-nowrap"
              style={{
                color: isOutOfStock
                  ? '#DC2626'
                  : stockCount <= 5
                    ? '#D97706'
                    : '#15803D'
              }}
            >
              {getStockLabel()}
            </span>
          </div>

          {/* ACTION BUTTONS */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* DETAILS */}
            <Link
              to={`/product/${card.id}`}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border"
              style={{
                borderColor: theme.primary,
                color: theme.secondary,
                backgroundColor: theme.soft
              }}
            >
              <Eye className="w-3.5 h-3.5" />
              Details
            </Link>

            {/* CART / WISHLIST */}
            <button
              type="button"
              onClick={handleAction}
              disabled={adding}
              className="w-full py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundColor: wishlisted && isOutOfStock
                  ? '#DC2626'
                  : theme.secondary,
                color: '#FFFFFF'
              }}
            >
              {adding ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Adding...
                </>
              ) : isOutOfStock ? (
                wishlisted ? (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove from Wishlist
                  </>
                ) : (
                  <>
                    <Heart className="w-3.5 h-3.5" />
                    Add to Wishlist
                  </>
                )
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
