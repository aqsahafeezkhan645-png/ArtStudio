
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import {
  ArrowRight,
  CheckCircle2,
  PackageCheck
} from 'lucide-react';

export default function Checkout() {
  const {
    cart,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    placeOrder,
    user,
    showToast
  } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    orderNotes: ''
  });

  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fill customer details after login/session is loaded.
  useEffect(() => {
    if (!user) return;

    setFormData(prev => ({
      ...prev,
      fullName: prev.fullName || user.fullName || user.name || '',
      email: prev.email || user.email || '',
      phone: prev.phone || user.phone || '',
      address: prev.address || user.address || '',
      city: prev.city || user.city || '',
      postalCode: prev.postalCode || user.postalCode || ''
    }));
  }, [user]);

  // ==========================================
  // FORM INPUT HANDLER
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ==========================================
  // PLACE ORDER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!cart || cart.length === 0) {
      showToast('Your shopping cart is empty.', 'error');
      return;
    }

    const requiredFields = [
      'fullName',
      'phone',
      'address',
      'city'
    ];

    const missingField = requiredFields.some(
      field => !String(formData[field] || '').trim()
    );

    if (missingField) {
      showToast(
        'Please fill in all required shipping fields.',
        'error'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await placeOrder({
        subtotal: cartSubtotal,
        deliveryFee,
        discount: 0,
        total: cartTotal,
        shippingDetails: {
          ...formData,
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          postalCode: formData.postalCode.trim(),
          orderNotes: formData.orderNotes.trim()
        }
      });

      // Do not show confirmation if backend failed.
      if (!order || !Array.isArray(order.items)) {
        return;
      }

      setConfirmedOrder(order);

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    } catch (error) {
      console.error('Checkout submission error:', error);

      showToast(
        error.message || 'Unable to place your order.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // ORDER CONFIRMATION
  // ==========================================

  if (confirmedOrder) {
    const confirmedItems = Array.isArray(confirmedOrder.items)
      ? confirmedOrder.items
      : [];

    const orderTotal = Number(confirmedOrder.total || 0);

    return (
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-8 animate-fadeIn">

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#C8A2E8] shadow-xl shadow-[#9B72CF]/15 text-center space-y-6">

          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#7041A6]">
              Order Confirmed
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#40334F]">
              Thank You for Supporting Handcrafted Art!
            </h1>

            <p className="text-sm text-[#81758F]">
              Your order reference is{' '}
              <strong className="text-[#7041A6] font-mono">
                {confirmedOrder.id || confirmedOrder.orderNumber || 'Confirmed'}
              </strong>.
            </p>

            <p className="text-xs text-[#81758F]">
              Your order has been successfully submitted.
            </p>
          </div>

          {/* DELIVERY AND PAYMENT */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left p-4 bg-[#FAF7FD] rounded-2xl border border-[#E9DDF7] text-xs">

            <div>
              <p className="text-[#81758F]">
                Payment Method
              </p>

              <p className="font-bold text-[#40334F] text-sm mt-1">
                Cash on Delivery (COD)
              </p>

              <p className="text-[#81758F] mt-1">
                Pay when your order arrives.
              </p>
            </div>

            <div>
              <p className="text-[#81758F]">
                Estimated Delivery
              </p>

              <p className="font-bold text-[#7041A6] text-sm mt-1">
                2 - 3 Business Days
              </p>

              <p className="text-[#81758F] mt-1">
                Delivery time may vary by location.
              </p>
            </div>

          </div>

          {/* ORDER RECEIPT */}

          <div className="border border-[#E9DDF7] rounded-2xl p-5 text-left space-y-3">

            <h3 className="font-serif text-base font-bold text-[#40334F]">
              Order Receipt
            </h3>

            <div className="divide-y divide-[#F3ECFA] text-xs">

              {confirmedItems.map((item, index) => {
                const itemPrice = Number(item.price || 0);
                const quantity = Number(item.quantity || 0);

                return (
                  <div
                    key={item._id || item.id || index}
                    className="py-3 flex justify-between items-center gap-3"
                  >

                    <div className="min-w-0">
                      <span className="font-semibold text-[#40334F]">
                        {item.name}
                      </span>

                      <span className="text-[#81758F] ml-1">
                        × {quantity}
                      </span>

                      {item.isCustom && (
                        <span className="block text-[11px] text-[#7041A6] italic mt-1">
                          Personalized Inscription
                        </span>
                      )}
                    </div>

                    <span className="font-bold text-[#40334F] tabular-nums whitespace-nowrap">
                      PKR {(itemPrice * quantity).toLocaleString()}
                    </span>

                  </div>
                );
              })}

            </div>

            <div className="pt-3 border-t border-[#E9DDF7] flex justify-between items-center font-bold text-sm text-[#40334F]">

              <span>
                Amount Due Upon Delivery
              </span>

              <span className="text-[#7041A6] font-serif text-lg tabular-nums">
                PKR {orderTotal.toLocaleString()}
              </span>

            </div>

          </div>

          {/* BUTTONS */}

          <div className="flex flex-wrap justify-center gap-4 pt-2">

            <Link
              to="/orders"
              className="px-6 py-3 bg-[#7041A6] hover:bg-[#9B72CF] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <PackageCheck className="w-4 h-4" />
              View in My Orders
            </Link>

            <Link
              to="/shop"
              className="px-6 py-3 bg-[#F3ECFA] hover:bg-[#E9DDF7] text-[#7041A6] text-xs font-semibold rounded-xl border border-[#C8A2E8] transition-all"
            >
              Continue Shopping
            </Link>

          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (!Array.isArray(cart) || cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">

        <h2 className="font-serif text-2xl font-bold text-[#40334F]">
          Your Bag is Empty
        </h2>

        <p className="text-xs text-[#81758F]">
          Please add cards to your shopping bag before checking out.
        </p>

        <Link
          to="/shop"
          className="inline-block px-5 py-2.5 bg-[#7041A6] text-white rounded-xl text-xs font-semibold"
        >
          Explore Shop
        </Link>

      </div>
    );
  }

  // ==========================================
  // CHECKOUT FORM
  // ==========================================

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* TITLE */}

      <div className="border-b border-[#E9DDF7] pb-4">
        <h1 className="font-serif text-3xl font-bold text-[#40334F]">
          Checkout
        </h1>

        <p className="text-xs text-[#81758F]">
          Complete your delivery details for Cash on Delivery.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >

        {/* SHIPPING DETAILS */}

        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E9DDF7] shadow-sm space-y-6">

          <h2 className="font-serif text-xl font-bold text-[#40334F]">
            Shipping & Recipient Details
          </h2>

          {/* NAME AND PHONE */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="text-xs font-semibold text-[#7041A6] block mb-1">
                Full Name *
              </label>

              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full px-3.5 py-3 text-xs bg-[#FAF7FD] border border-[#C8A2E8] rounded-xl text-[#40334F] focus:outline-none focus:ring-2 focus:ring-[#9B72CF]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#7041A6] block mb-1">
                Phone Number *
              </label>

              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+92 300 1234567"
                className="w-full px-3.5 py-3 text-xs bg-[#FAF7FD] border border-[#C8A2E8] rounded-xl text-[#40334F] focus:outline-none focus:ring-2 focus:ring-[#9B72CF]"
              />
            </div>

          </div>

          {/* EMAIL */}

          <div>
            <label className="text-xs font-semibold text-[#7041A6] block mb-1">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full px-3.5 py-3 text-xs bg-[#FAF7FD] border border-[#C8A2E8] rounded-xl text-[#40334F] focus:outline-none focus:ring-2 focus:ring-[#9B72CF]"
            />
          </div>

          {/* ADDRESS */}

          <div>
            <label className="text-xs font-semibold text-[#7041A6] block mb-1">
              Complete Delivery Address *
            </label>

            <textarea
              name="address"
              required
              rows={3}
              value={formData.address}
              onChange={handleChange}
              placeholder="House number, street, area and landmark"
              className="w-full px-3.5 py-3 text-xs bg-[#FAF7FD] border border-[#C8A2E8] rounded-xl text-[#40334F] focus:outline-none focus:ring-2 focus:ring-[#9B72CF] resize-none"
            />
          </div>

          {/* CITY AND POSTAL CODE */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="text-xs font-semibold text-[#7041A6] block mb-1">
                City *
              </label>

              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                placeholder="Your city"
                className="w-full px-3.5 py-3 text-xs bg-[#FAF7FD] border border-[#C8A2E8] rounded-xl text-[#40334F] focus:outline-none focus:ring-2 focus:ring-[#9B72CF]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#7041A6] block mb-1">
                Postal Code
              </label>

              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Postal code"
                className="w-full px-3.5 py-3 text-xs bg-[#FAF7FD] border border-[#C8A2E8] rounded-xl text-[#40334F] focus:outline-none focus:ring-2 focus:ring-[#9B72CF]"
              />
            </div>

          </div>

          {/* ORDER NOTES */}

          <div>
            <label className="text-xs font-semibold text-[#7041A6] block mb-1">
              Delivery Instructions (Optional)
            </label>

            <textarea
              name="orderNotes"
              rows={3}
              value={formData.orderNotes}
              onChange={handleChange}
              placeholder="Any special delivery or packaging instructions?"
              className="w-full px-3.5 py-3 text-xs bg-[#FAF7FD] border border-[#C8A2E8] rounded-xl text-[#40334F] focus:outline-none focus:ring-2 focus:ring-[#9B72CF] resize-none"
            />
          </div>

          {/* PAYMENT METHOD */}

          <div className="pt-4 border-t border-[#F3ECFA] space-y-3">

            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#7041A6]">
              Payment Method
            </h3>

            <div className="p-4 rounded-2xl border-2 border-[#7041A6] bg-[#F3ECFA] flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-5 h-5 rounded-full bg-[#7041A6] text-white flex items-center justify-center text-xs">
                  ✓
                </div>

                <div>
                  <p className="text-xs font-bold text-[#40334F]">
                    Cash on Delivery (COD)
                  </p>

                  <p className="text-[11px] text-[#81758F]">
                    Pay in cash when your handmade cards arrive.
                  </p>
                </div>

              </div>

              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-1 rounded-md">
                Selected
              </span>

            </div>

          </div>

        </div>

        {/* ORDER SUMMARY */}

        <div className="lg:col-span-5 space-y-6">

          <div className="bg-white rounded-3xl p-6 border border-[#E9DDF7] shadow-sm space-y-5">

            <h3 className="font-serif text-lg font-bold text-[#40334F]">
              Order Summary ({cart.length} items)
            </h3>

            {/* CART ITEMS */}

            <div className="divide-y divide-[#F3ECFA] max-h-72 overflow-y-auto pr-1">

              {cart.map((item, index) => (
                <div
                  key={item.cartItemId || item.id || index}
                  className="py-3 flex items-center gap-3"
                >

                  <img
                    src={item.image}
                    alt={item.name || 'Product'}
                    className="w-12 h-12 rounded-xl object-cover border border-[#E9DDF7] shrink-0"
                  />

                  <div className="flex-1 min-w-0">

                    <p className="text-xs font-bold text-[#40334F] truncate">
                      {item.name}
                    </p>

                    <p className="text-[11px] text-[#81758F]">
                      Qty: {item.quantity}
                    </p>

                  </div>

                  <span className="text-xs font-bold text-[#7041A6] tabular-nums shrink-0">
                    PKR {(
                      Number(item.price || 0) *
                      Number(item.quantity || 0)
                    ).toLocaleString()}
                  </span>

                </div>
              ))}

            </div>

            {/* PRICE CALCULATIONS */}

            <div className="pt-3 border-t border-[#F3ECFA] space-y-3 text-xs">

              <div className="flex justify-between text-[#81758F]">
                <span>Subtotal</span>

                <span className="font-semibold text-[#40334F] tabular-nums">
                  PKR {cartSubtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-[#81758F]">
                <span>Delivery Fee</span>

                <span className="font-semibold text-[#40334F] tabular-nums">
                  {deliveryFee === 0
                    ? 'FREE'
                    : `PKR ${deliveryFee.toLocaleString()}`}
                </span>
              </div>

              <div className="pt-3 border-t border-[#F3ECFA] flex justify-between items-baseline text-sm">

                <span className="font-bold text-[#40334F]">
                  Total Due (PKR)
                </span>

                <span className="font-serif font-bold text-xl text-[#7041A6] tabular-nums">
                  PKR {cartTotal.toLocaleString()}
                </span>

              </div>

            </div>

            {/* PLACE ORDER BUTTON */}

            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="w-full py-3.5 bg-[#7041A6] hover:bg-[#9B72CF] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-lg shadow-[#7041A6]/25 flex items-center justify-center gap-2 transition-all"
            >

              {isSubmitting
                ? 'Placing Your Order...'
                : 'Place Order (Cash on Delivery)'}

              {!isSubmitting && (
                <ArrowRight className="w-4 h-4" />
              )}

            </button>

            <div className="text-center text-[11px] text-[#81758F] space-y-1">
              <p>
                🌸 Handcrafted with care and inspected before sealing.
              </p>

              <p>
                Your order details will be saved securely.
              </p>
            </div>

          </div>

        </div>

      </form>

    </div>
  );
}
