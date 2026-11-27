
import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import {
  UserRound,
  Package,
  Heart,
  ShoppingBag,
  LogOut,
  ArrowRight,
  Flower2,
  MapPin,
  Mail,
  Phone,
  Clock
} from 'lucide-react';

export default function CustomerDashboard() {
  const {
    user,
    orders = [],
    wishlist = [],
    products = [],
    logout,
    authLoading
  } = useApp();

  const navigate = useNavigate();

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-9 h-9 border-4 border-[#E9DDF7] border-t-[#7041A6] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Only show wishlist products that still exist
  const wishlistProducts = products.filter(product =>
    wishlist.some(id => String(id) === String(product.id))
  );

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(order =>
    ['pending', 'processing'].includes(
      String(order.status || '').toLowerCase()
    )
  ).length;

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const formatPrice = (price) =>
    `Rs. ${Number(price || 0).toLocaleString('en-PK')}`;

  return (
    <div className="min-h-screen bg-[#FAF7FD] px-4 py-10">

      <div className="max-w-7xl mx-auto space-y-8">

        {/* WELCOME HEADER */}
        <div className="bg-gradient-to-r from-[#7041A6] to-[#9B72CF] rounded-3xl p-7 sm:p-10 text-white shadow-lg">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

            <div>
              <div className="flex items-center gap-2 text-white/80 text-xs mb-3">
                <Flower2 className="w-4 h-4" />
                ARTSTUDIO CUSTOMER SPACE
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold">
                Welcome, {user.name || user.fullName || 'Customer'}!
              </h1>

              <p className="text-sm text-white/80 mt-2">
                Your personal space for orders, saved cards and account details.
              </p>
            </div>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#7041A6] px-5 py-3 rounded-xl text-sm font-bold hover:bg-[#F3ECFA] transition"
            >
              Visit Store
              <ArrowRight className="w-4 h-4" />
            </Link>

          </div>
        </div>

        {/* DASHBOARD STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

          <div className="bg-white border border-[#E9DDF7] rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-[#81758F]">Total Orders</p>
                <h2 className="text-3xl font-bold text-[#40334F] mt-2">
                  {totalOrders}
                </h2>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#F3ECFA] flex items-center justify-center">
                <Package className="text-[#7041A6] w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E9DDF7] rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-[#81758F]">Active Orders</p>
                <h2 className="text-3xl font-bold text-[#40334F] mt-2">
                  {pendingOrders}
                </h2>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#F3ECFA] flex items-center justify-center">
                <Clock className="text-[#7041A6] w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E9DDF7] rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-[#81758F]">Wishlist Items</p>
                <h2 className="text-3xl font-bold text-[#40334F] mt-2">
                  {wishlist.length}
                </h2>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#F3ECFA] flex items-center justify-center">
                <Heart className="text-[#7041A6] w-6 h-6" />
              </div>
            </div>
          </div>

        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* PROFILE */}
          <div className="bg-white border border-[#E9DDF7] rounded-2xl p-6 shadow-sm">

            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-[#F3ECFA] flex items-center justify-center">
                <UserRound className="text-[#7041A6]" />
              </div>

              <div>
                <h2 className="font-bold text-[#40334F]">My Profile</h2>
                <p className="text-xs text-[#81758F]">Account information</p>
              </div>
            </div>

            <div className="space-y-5">

              <div className="flex items-start gap-3">
                <UserRound className="w-4 h-4 text-[#9B72CF] mt-1" />
                <div>
                  <p className="text-[11px] text-[#81758F]">Full Name</p>
                  <p className="text-sm text-[#40334F] font-semibold">
                    {user.name || user.fullName || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#9B72CF] mt-1" />
                <div>
                  <p className="text-[11px] text-[#81758F]">Email</p>
                  <p className="text-sm text-[#40334F] font-semibold break-all">
                    {user.email || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#9B72CF] mt-1" />
                <div>
                  <p className="text-[11px] text-[#81758F]">Phone</p>
                  <p className="text-sm text-[#40334F] font-semibold">
                    {user.phone || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#9B72CF] mt-1" />
                <div>
                  <p className="text-[11px] text-[#81758F]">Address</p>
                  <p className="text-sm text-[#40334F] font-semibold">
                    {[user.address, user.city, user.postalCode]
                      .filter(Boolean)
                      .join(', ') || 'No address added'}
                  </p>
                </div>
              </div>

            </div>

            <div className="mt-6 pt-5 border-t border-[#F0E8F7]">
              <p className="text-[11px] text-[#81758F]">
                Profile editing will be connected to your database in the next step.
              </p>
            </div>

          </div>

          {/* RECENT ORDERS */}
          <div className="lg:col-span-2 bg-white border border-[#E9DDF7] rounded-2xl p-6 shadow-sm">

            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-bold text-[#40334F]">Recent Orders</h2>
                <p className="text-xs text-[#81758F] mt-1">
                  Your latest purchases
                </p>
              </div>
              <Package className="text-[#9B72CF] w-6 h-6" />
            </div>

            {orders.length === 0 ? (

              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 mx-auto text-[#C8A2E8] mb-3" />
                <h3 className="font-semibold text-[#40334F]">
                  No orders yet
                </h3>
                <p className="text-xs text-[#81758F] mt-1">
                  Your purchases will appear here.
                </p>
                <Link
                  to="/"
                  className="inline-block mt-4 bg-[#7041A6] text-white px-5 py-2.5 rounded-xl text-xs font-semibold"
                >
                  Start Shopping
                </Link>
              </div>

            ) : (

              <div className="space-y-4">

                {orders.slice(0, 5).map((order, index) => (

                  <div
                    key={order.id || order._id || index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#FAF7FD] rounded-xl border border-[#F0E8F7]"
                  >

                    <div>
                      <p className="text-sm font-bold text-[#40334F]">
                        {order.id || order._id || 'Order'}
                      </p>

                      <p className="text-[11px] text-[#81758F] mt-1">
                        {order.date || order.createdAt
                          ? new Date(order.date || order.createdAt).toLocaleDateString()
                          : 'Date unavailable'}
                      </p>

                      <p className="text-xs text-[#7041A6] mt-1">
                        {order.items?.length || 0} item(s)
                      </p>
                    </div>

                    <div className="sm:text-right">

                      <p className="text-sm font-bold text-[#40334F]">
                        {formatPrice(order.total)}
                      </p>

                      <span className="inline-block mt-1 text-[10px] font-bold px-3 py-1 rounded-full bg-[#F0E8F7] text-[#7041A6]">
                        {order.status || 'Pending'}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            )}

            <p className="text-[11px] text-[#81758F] mt-5">
              These orders currently come from your existing app order state.
              They are not yet stored as customer-specific orders in MongoDB.
            </p>

          </div>

        </div>

        {/* WISHLIST */}
        <div className="bg-white border border-[#E9DDF7] rounded-2xl p-6 shadow-sm">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="font-bold text-[#40334F]">My Wishlist</h2>
              <p className="text-xs text-[#81758F] mt-1">
                Cards you have saved
              </p>
            </div>

            <Heart className="text-[#9B72CF] w-6 h-6" />

          </div>

          {wishlistProducts.length === 0 ? (

            <div className="text-center py-8">
              <Heart className="w-10 h-10 mx-auto text-[#C8A2E8] mb-3" />
              <p className="text-sm font-semibold text-[#40334F]">
                Your wishlist is empty
              </p>
              <p className="text-xs text-[#81758F] mt-1">
                Save your favorite handmade cards to see them here.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 mt-4 text-xs font-bold text-[#7041A6]"
              >
                Explore Cards <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          ) : (

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

              {wishlistProducts.slice(0, 8).map(product => (

                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group border border-[#E9DDF7] rounded-xl overflow-hidden hover:shadow-md transition"
                >

                  <div className="aspect-square bg-[#FAF7FD] overflow-hidden">
                    <img
                      src={product.image || product.imageUrl || product.images?.[0] || ''}
                      alt={product.name || product.title || 'Handmade card'}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  <div className="p-3">
                    <p className="text-xs font-semibold text-[#40334F] truncate">
                      {product.name || product.title || 'Handmade Card'}
                    </p>

                    <p className="text-xs font-bold text-[#7041A6] mt-1">
                      {formatPrice(product.price)}
                    </p>
                  </div>

                </Link>

              ))}

            </div>

          )}

        </div>

        {/* LOGOUT */}
        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-sm font-semibold transition"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>

      </div>
    </div>
  );
}
