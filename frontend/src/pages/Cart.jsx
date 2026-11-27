import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Palette,
  Truck
} from 'lucide-react';

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    deliveryFee,
    cartTotal
  } = useApp();

  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#F3ECFA] text-[#7041A6] flex items-center justify-center mx-auto text-3xl">
          🛍️
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-bold text-[#40334F]">
            Your Shopping Bag is Empty
          </h2>
          <p className="text-sm text-[#81758F] max-w-md mx-auto">
            You haven't added any handcrafted cards to your bag yet. Explore our bestselling cards or personalize your own!
          </p>
        </div>
        <div className="flex justify-center gap-4 pt-2">
          <Link
            to="/shop"
            className="px-6 py-3 bg-[#7041A6] hover:bg-[#9B72CF] text-white text-xs font-semibold rounded-xl shadow-md transition-all"
          >
            Explore Cards
          </Link>
          <Link
            to="/customize"
            className="px-6 py-3 bg-[#F3ECFA] hover:bg-[#E9DDF7] text-[#7041A6] border border-[#C8A2E8] text-xs font-semibold rounded-xl transition-all"
          >
            Personalize a Card ✨
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E9DDF7] pb-4 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#40334F]">
            Shopping Bag
          </h1>
          <p className="text-xs text-[#81758F]">
            Review your handcrafted cards and personalized stationery orders.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.cartItemId}
              className="bg-white rounded-3xl p-5 border border-[#E9DDF7] shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between transition-all"
            >
              
              {/* Product Info Left */}
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#FAF7FD] border border-[#E9DDF7] shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-base font-bold text-[#40334F]">
                      {item.name}
                    </h3>
                    {item.isCustom && (
                      <span className="px-2 py-0.5 bg-[#F3ECFA] text-[#7041A6] text-[10px] font-bold rounded-md">
                        Custom Inscribed
                      </span>
                    )}
                  </div>

                  {/* If custom, show details badge list */}
                  {item.isCustom && item.customData && (
                    <div className="text-[11px] text-[#81758F] space-y-0.5 bg-[#FAF7FD] p-2 rounded-xl border border-[#F3ECFA] max-w-md">
                      <p>
                        <strong className="text-[#40334F]">Occasion:</strong> {item.customData.occasion} ·{' '}
                        <strong className="text-[#40334F]">Theme:</strong> {item.customData.theme}
                      </p>
                      {item.customData.recipientName && (
                        <p>
                          <strong className="text-[#40334F]">Recipient:</strong> {item.customData.recipientName}
                        </p>
                      )}
                      {item.customData.customPhotoUrl && (
                        <p className="text-[#7041A6] font-medium">
                          <strong>Attached Picture:</strong> {item.customData.photoFrameStyle} style
                          {item.customData.photoCaption ? ` ("${item.customData.photoCaption}")` : ''}
                        </p>
                      )}
                      {item.customData.personalMessage && (
                        <p className="italic truncate text-[#7041A6]">
                          "{item.customData.personalMessage}"
                        </p>
                      )}
                      {item.customData.selectedDecorations?.length > 0 && (
                        <p>
                          <strong className="text-[#40334F]">Embellishments:</strong>{' '}
                          {item.customData.selectedDecorations.join(' ')}
                        </p>
                      )}
                    </div>
                  )}

                  <p className="text-xs font-bold text-[#7041A6] tabular-nums">
                    PKR {item.price.toLocaleString()} each
                  </p>
                </div>
              </div>

              {/* Quantity & Total Price Right */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-[#F3ECFA]">
                
                {/* Quantity Controls */}
                <div className="flex items-center border border-[#C8A2E8] rounded-xl bg-[#FAF7FD] p-1">
                  <button
                    onClick={() => updateCartQuantity(item.cartItemId, -1)}
                    className="p-1 hover:bg-[#E9DDF7] rounded-lg text-[#7041A6] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-[#40334F] tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.cartItemId, 1)}
                    className="p-1 hover:bg-[#E9DDF7] rounded-lg text-[#7041A6] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal for Item */}
                <div className="text-right">
                  <p className="text-sm font-bold text-[#40334F] tabular-nums">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.cartItemId)}
                  className="p-2 text-[#81758F] hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}

          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7041A6] hover:text-[#9B72CF]"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping Cards
            </Link>
          </div>
        </div>

        {/* Order Summary Right */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-[#E9DDF7] shadow-sm space-y-5">
            <h3 className="font-serif text-lg font-bold text-[#40334F]">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-[#81758F]">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#40334F] tabular-nums">
                  PKR {cartSubtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-[#81758F]">
                <span>Standard Delivery (Pakistan)</span>
                <span className="font-semibold text-[#40334F] tabular-nums">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    `PKR ${deliveryFee}`
                  )}
                </span>
              </div>

              {deliveryFee > 0 && (
                <div className="p-2.5 bg-[#F3ECFA] rounded-xl text-[11px] text-[#7041A6] flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Add PKR {(3000 - cartSubtotal).toLocaleString()} more to qualify for Free Shipping!
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-[#F3ECFA] flex justify-between items-baseline text-sm">
                <span className="font-bold text-[#40334F]">Final Total</span>
                <span className="font-serif font-bold text-xl text-[#7041A6] tabular-nums">
                  PKR {cartTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 bg-[#7041A6] hover:bg-[#9B72CF] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#7041A6]/25 flex items-center justify-center gap-2 transition-transform active:scale-98"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center text-[11px] text-[#81758F]">
              🔒 Cash on Delivery (COD) available with no upfront fee
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
