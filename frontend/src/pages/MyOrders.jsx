import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import {
  Package,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ArrowRight,
  Eye,
  X
} from 'lucide-react';

export default function MyOrders() {
  const { orders, cancelOrder } = useApp();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Shipped':
        return 'bg-purple-100 text-[#7041A6] border-purple-200';
      case 'Processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#F3ECFA] text-[#7041A6] flex items-center justify-center mx-auto text-3xl">
          📦
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-bold text-[#40334F]">
            No Orders Yet
          </h2>
          <p className="text-sm text-[#81758F] max-w-md mx-auto">
            You haven't placed any handmade greeting card orders yet. Start creating cherished moments today!
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 bg-[#7041A6] hover:bg-[#9B72CF] text-white text-xs font-semibold rounded-xl shadow-md transition-all"
        >
          Explore Handmade Cards
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="border-b border-[#E9DDF7] pb-4">
        <h1 className="font-serif text-3xl font-bold text-[#40334F]">
          My Orders ({orders.length})
        </h1>
        <p className="text-xs text-[#81758F]">
          Track the status of your handcrafted card deliveries across Pakistan.
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => {
          const canCancel = order.status === 'Pending' || order.status === 'Processing';

          return (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-6 border border-[#E9DDF7] shadow-sm hover:border-[#C8A2E8] transition-all space-y-4"
            >
              
              {/* Order Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F3ECFA] pb-3 text-xs">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[#81758F]">Order ID: </span>
                    <strong className="text-[#7041A6] font-mono">{order.id}</strong>
                  </div>
                  <div>
                    <span className="text-[#81758F]">Date: </span>
                    <span className="text-[#40334F]">{order.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    ● {order.status}
                  </span>
                  <span className="text-[#81758F] font-medium hidden sm:inline">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-8 space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img
                        src={item.image || '/images/birthday_card_craft_1794160682865.jpg'}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#E9DDF7] shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#40334F] truncate">{item.name}</p>
                        <p className="text-[11px] text-[#81758F]">
                          Qty: {item.quantity} · PKR {item.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total & Action Buttons */}
                <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-0 border-[#F3ECFA]">
                  <div>
                    <span className="text-xs text-[#81758F]">Total Amount: </span>
                    <span className="font-serif text-lg font-bold text-[#7041A6] tabular-nums">
                      PKR {order.total.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3.5 py-1.5 border border-[#C8A2E8] text-[#7041A6] hover:bg-[#F3ECFA] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Details
                    </button>

                    {canCancel && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#E9DDF7] shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#F3ECFA] pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#40334F]">
                  Order #{selectedOrder.id}
                </h3>
                <p className="text-xs text-[#81758F]">Placed on {selectedOrder.date}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-full hover:bg-[#F3ECFA] text-[#81758F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#FAF7FD] rounded-xl border border-[#E9DDF7] space-y-1">
                <p className="font-semibold text-[#7041A6]">Shipping Information</p>
                <p className="text-[#40334F]">
                  {selectedOrder.shippingDetails?.fullName || selectedOrder.shippingAddress || 'Ayla Noor'}
                </p>
                <p className="text-[#81758F]">
                  {selectedOrder.shippingDetails?.address || 'House #42, Street 7, Lavender Heights'}
                  {selectedOrder.shippingDetails?.city ? `, ${selectedOrder.shippingDetails.city}` : ''}
                </p>
                <p className="text-[#81758F]">
                  Phone: {selectedOrder.shippingDetails?.phone || '+92 300 1234567'}
                </p>
              </div>

              <div>
                <p className="font-semibold text-[#40334F] mb-2">Order Items:</p>
                <div className="divide-y divide-[#F3ECFA]">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="py-2 flex justify-between">
                      <span className="text-[#40334F]">
                        {it.name} × {it.quantity}
                      </span>
                      <span className="font-bold text-[#7041A6] tabular-nums">
                        PKR {(it.price * it.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#E9DDF7] space-y-1 text-xs">
                <div className="flex justify-between text-[#81758F]">
                  <span>Delivery Fee</span>
                  <span>{selectedOrder.deliveryFee === 0 ? 'FREE' : `PKR ${selectedOrder.deliveryFee}`}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#40334F] pt-1">
                  <span>Grand Total</span>
                  <span className="text-[#7041A6] font-serif text-base tabular-nums">
                    PKR {selectedOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2.5 bg-[#7041A6] hover:bg-[#9B72CF] text-white text-xs font-semibold rounded-xl"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
