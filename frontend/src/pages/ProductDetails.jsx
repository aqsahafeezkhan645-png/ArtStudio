import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  Feather,
  Palette,
  ArrowLeft,
  Check,
  Minus,
  Plus,
  Sparkles
} from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, isInWishlist } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  const card = products.find((p) => p.id === id) || products[0];
  const wishlisted = isInWishlist(card?.id);

  if (!card) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#40334F]">Card Not Found</h2>
        <p className="text-sm text-[#81758F]">This handcrafted design may no longer be available.</p>
        <Link to="/shop" className="inline-block px-5 py-2.5 bg-[#7041A6] text-white rounded-xl text-xs font-semibold">
          Return to Shop
        </Link>
      </div>
    );
  }

  const activeImage = selectedImage || card.image;

  // Alternate images for the gallery
  const gallery = [
    card.image,
    '/images/hero_handmade_cards_1794160681532.jpg',
    '/images/floral_gratitude_card_1794160684123.jpg'
  ];

  const relatedProducts = products
    .filter((p) => p.id !== card.id && (p.category === card.category || p.theme === card.theme))
    .slice(0, 3);

  const handleBuyNow = () => {
    addToCart(card, quantity);
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Back button */}
      <div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7041A6] hover:text-[#9B72CF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop Cards
        </Link>
      </div>

      {/* Main PDP Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Sticky Image Showcase */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#E9DDF7] bg-[#FAF7FD] shadow-md">
            <img
              src={activeImage}
              alt={card.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {card.isBestseller && (
              <span className="absolute top-4 left-4 bg-[#7041A6] text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm">
                Bestseller
              </span>
            )}
          </div>

          {/* Gallery Thumbnails */}
          <div className="flex gap-3">
            {gallery.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  activeImage === img
                    ? 'border-[#7041A6] shadow-sm'
                    : 'border-[#E9DDF7] opacity-75 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Purchase Module */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs">
            <span className="px-3 py-1 bg-[#F3ECFA] text-[#7041A6] rounded-full font-semibold">
              {card.category} Collection
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-4 h-4 fill-amber-400 stroke-amber-500" />
              <span className="text-[#40334F]">{card.rating}</span>
              <span className="text-[#81758F]">({card.reviewsCount} customer reviews)</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#40334F] leading-tight">
            {card.name}
          </h1>

          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-serif font-bold text-[#7041A6] tabular-nums">
              PKR {card.discountPrice ? card.discountPrice.toLocaleString() : card.price.toLocaleString()}
            </span>
            {card.discountPrice && (
              <span className="text-sm text-[#81758F] line-through tabular-nums">
                PKR {card.price.toLocaleString()}
              </span>
            )}
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
              In Stock & Ready to Ship
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-[#81758F] leading-relaxed">
            {card.description}
          </p>

          {/* Customization Teaser Prompt */}
          <div className="p-4 rounded-2xl bg-[#F3ECFA] border border-[#C8A2E8]/60 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-[#7041A6] flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                Want this card customized?
              </p>
              <p className="text-[11px] text-[#40334F]">
                Open our Interactive Card Studio to print custom recipient names and inside poetry.
              </p>
            </div>
            <Link
              to="/customize"
              className="px-3.5 py-1.5 bg-white text-[#7041A6] hover:bg-[#FAF7FD] border border-[#C8A2E8] rounded-xl text-xs font-semibold whitespace-nowrap transition-colors"
            >
              Personalize
            </Link>
          </div>

          {/* Handcrafted Specifications Table */}
          <div className="border border-[#E9DDF7] rounded-2xl p-4 bg-white space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[#F3ECFA]">
              <span className="text-[#81758F]">Dimensions</span>
              <span className="font-medium text-[#40334F]">{card.dimensions}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F3ECFA]">
              <span className="text-[#81758F]">Paper Material</span>
              <span className="font-medium text-[#40334F]">{card.paperType}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#81758F]">Complimentary Envelope</span>
              <span className="font-medium text-[#40334F]">{card.envelope}</span>
            </div>
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <label htmlFor="quantityStepper" className="text-xs font-semibold text-[#7041A6]">Quantity:</label>
              <div id="quantityStepper" className="flex items-center border border-[#C8A2E8] rounded-xl bg-[#FAF7FD] p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1 hover:bg-[#E9DDF7] rounded-lg text-[#7041A6] transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-xs font-bold text-[#40334F] tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-1 hover:bg-[#E9DDF7] rounded-lg text-[#7041A6] transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => addToCart(card, quantity)}
                className="w-full py-3.5 bg-[#7041A6] hover:bg-[#9B72CF] text-white font-semibold text-xs rounded-xl shadow-md shadow-[#7041A6]/20 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 bg-[#F3ECFA] hover:bg-[#E9DDF7] text-[#7041A6] border border-[#C8A2E8] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                Buy Now with Cash on Delivery
              </button>
            </div>

            <button
              onClick={() => toggleWishlist(card.id)}
              className="w-full py-2.5 text-xs font-semibold text-[#81758F] hover:text-[#7041A6] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              {wishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-[#E9DDF7] grid grid-cols-2 gap-4 text-xs text-[#81758F]">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#9B72CF] shrink-0" />
              <span>Nationwide 2-3 day shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#9B72CF] shrink-0" />
              <span>Carefully boxed in stiff craft board</span>
            </div>
          </div>

        </div>

      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t border-[#E9DDF7] space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-[#40334F]">
              You May Also Love
            </h2>
            <Link to="/shop" className="text-xs font-semibold text-[#7041A6] hover:text-[#9B72CF]">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} card={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
