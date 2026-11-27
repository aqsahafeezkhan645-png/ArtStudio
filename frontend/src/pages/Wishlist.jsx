
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight
} from 'lucide-react';

export default function Wishlist() {
  const {
    wishlist,
    products,
    addToCart,
    toggleWishlist
  } = useApp();

  const [movingToCart, setMovingToCart] = useState(false);

  // Match wishlist IDs with actual product IDs.
  const wishlistedCards = products.filter(product =>
    wishlist.some(
      id => String(id) === String(product.id)
    )
  );

  // Available products only.
  const availableCards = wishlistedCards.filter(
    card => Number(card.stock) > 0
  );

  // Remove one product from wishlist.
  const handleRemove = (productId) => {
    toggleWishlist(String(productId));
  };

  // Move all available products to cart.
  const handleMoveAllToCart = async () => {
    if (movingToCart || availableCards.length === 0) return;

    setMovingToCart(true);

    let successCount = 0;

    try {
      for (const card of availableCards) {
        const result = await addToCart(card, 1);

        if (result?.success) {
          successCount++;
        }
      }

      if (successCount > 0) {
        alert(
          `${successCount} product(s) successfully added to your cart!`
        );
      }

      if (successCount < availableCards.length) {
        alert(
          'Some products could not be added. Please check their stock.'
        );
      }
    } finally {
      setMovingToCart(false);
    }
  };

  // Empty wishlist.
  if (wishlistedCards.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">

        <div className="w-20 h-20 rounded-full bg-[#F3ECFA] text-[#7041A6] flex items-center justify-center mx-auto">
          <Heart className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-bold text-[#40334F]">
            Your Wishlist is Empty
          </h2>

          <p className="text-sm text-[#81758F] max-w-md mx-auto">
            Save your favorite greeting cards and gift inspirations here by tapping the heart icon on any card!
          </p>
        </div>

        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#7041A6] hover:bg-[#9B72CF] text-white text-xs font-semibold rounded-xl shadow-md transition-all"
        >
          Browse Our Cards
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* WISHLIST HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E9DDF7] pb-4 gap-4">

        <div>
          <h1 className="font-serif text-3xl font-bold text-[#40334F]">
            My Saved Wishlist ({wishlistedCards.length})
          </h1>

          <p className="text-xs text-[#81758F] mt-1">
            Handcrafted cards you've bookmarked for upcoming celebrations.
          </p>

          <p className="text-xs text-[#7041A6] mt-2 font-medium">
            {availableCards.length} product(s) currently available
          </p>
        </div>

        {/* MOVE ALL TO CART */}
        <button
          onClick={handleMoveAllToCart}
          disabled={movingToCart || availableCards.length === 0}
          className="px-4 py-2.5 bg-[#7041A6] hover:bg-[#9B72CF] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <ShoppingBag className="w-4 h-4" />

          {movingToCart
            ? 'Adding Products...'
            : 'Move Available Items to Cart'}
        </button>
      </div>

      {/* WISHLIST PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {wishlistedCards.map(card => (
          <div
            key={card.id}
            className="bg-white rounded-2xl p-3 border border-[#E9DDF7] shadow-sm hover:shadow-md transition-all"
          >

            {/* PRODUCT CARD */}
            <ProductCard card={card} />

            {/* STOCK STATUS */}
            {Number(card.stock) > 0 ? (
              <p className="text-xs text-green-600 font-semibold text-center mt-3">
                In Stock ({card.stock})
              </p>
            ) : (
              <p className="text-xs text-red-500 font-semibold text-center mt-3">
                Currently Out of Stock
              </p>
            )}

            {/* REMOVE FROM WISHLIST */}
            <button
              onClick={() => handleRemove(card.id)}
              className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#E9DDF7] text-[#B64F79] hover:bg-[#FFF0F5] font-semibold text-sm transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Remove from Wishlist
            </button>

          </div>
        ))}

      </div>

      {/* BOTTOM SHOPPING LINK */}
      <div className="text-center pt-4">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#7041A6] hover:text-[#9B72CF] transition-colors"
        >
          Continue Shopping
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
