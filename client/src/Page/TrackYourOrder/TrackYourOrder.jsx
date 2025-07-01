import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, MapPin, Phone, Calendar, CreditCard, Star, Clock, User, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrackYourOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const trackOrder = async () => {
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = sessionStorage.getItem("token_login");
      
      if (!token) {
        setError('Authentication required. Please login to track your order.');
        return;
      }

      const response = await fetch(`https://www.api.nypers.in/api/v1/my-recent-order/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch order details');
      }

      if (!result.success) {
        throw new Error(result.message || 'Order not found');
      }

      setOrderData(result.data);
    } catch (err) {
      console.error('Error tracking order:', err);
      setError(err.message || 'Something went wrong while fetching order details. Please try again.');
      setOrderData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusSteps = (currentStatus) => {
    const steps = [
      { key: 'pending', label: 'Order Placed', icon: ShoppingBag },
      { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
      { key: 'progress', label: 'Processing', icon: Package },
      { key: 'shipped', label: 'Shipped', icon: Truck },
      { key: 'delivered', label: 'Delivered', icon: CheckCircle }
    ];

    const statusOrder = ['pending', 'confirmed', 'progress', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);

    return steps.map((step, index) => ({
      ...step,
      isCompleted: index <= currentIndex,
      isActive: index === currentIndex,
      isCancelled: currentStatus === 'cancelled' || currentStatus === 'returned'
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-black bg-blue-100';
      case 'progress': return 'text-purple-600 bg-purple-100';
      case 'shipped': return 'text-indigo-600 bg-indigo-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'returned': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your order ID to get real-time updates</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-2">
                Order ID
              </label>
              <input
                id="orderId"
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter your order ID (e.g., ORD123456)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && trackOrder()}
              />
            </div>
            <button
              onClick={trackOrder}
              disabled={isLoading}
              className="px-8 py-3 bg-black text-white rounded-lg hover:bg-[#24262b] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Track Order
                </>
              )}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Order Details */}
        {orderData && (
          <div className="space-y-8">
            {/* Order Status Timeline */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Status</h2>
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Order #{orderData.orderId}</h3>
                  <p className="text-gray-600">Placed on {formatDate(orderData.orderDate)}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(orderData.status)}`}>
                  {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
                </span>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="flex items-center justify-between">
                  {getStatusSteps(orderData.status).map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.key} className="flex flex-col items-center relative">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                          step.isCompleted 
                            ? 'bg-green-500 text-white' 
                            : step.isActive 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <p className={`text-xs text-center font-medium ${
                          step.isCompleted || step.isActive ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </p>
                        {index < getStatusSteps(orderData.status).length - 1 && (
                          <div className={`absolute top-6 left-12 w-full h-0.5 ${
                            step.isCompleted ? 'bg-green-500' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {orderData.estimatedDeliveryDate && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-black mr-2" />
                    <span className="text-black font-medium">
                      Estimated Delivery: {formatDate(orderData.estimatedDeliveryDate)}
                    </span>
                  </div>
                </div>
              )}
            </div>

                          {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Items</h2>
              <div className="space-y-4">
                {orderData.items && orderData.items.length > 0 ? (
                  orderData.items.map((item, index) => (
                    <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-gray-600 text-sm">
                          {item.size && `Size: ${item.size}`}
                          {item.size && item.color && ' • '}
                          {item.color && `Color: ${item.color}`}
                          {(item.size || item.color) && ` • `}
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{item.price}</p>
                        <p className="text-gray-500 text-sm">₹{item.price * item.quantity} total</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No items found in this order</p>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({orderData.totalquantity} items)</span>
                    <span>₹{orderData.totalAmount}</span>
                  </div>
                  {orderData.isDeliveryFeePay && (
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee</span>
                      <span>₹50</span>
                    </div>
                  )}
                  {orderData.totalAmount !== orderData.payAmt && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{orderData.totalAmount - orderData.payAmt}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-black">₹{orderData.payAmt}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping & Payment Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-6 h-6 mr-2 text-black" />
                  Shipping Address
                </h2>
                <div className="space-y-2 text-gray-600">
                  <p>{orderData.shipping.addressLine}</p>
                  <p>{orderData.shipping.city}, {orderData.shipping.state}</p>
                  <p>PIN: {orderData.shipping.postCode}</p>
                  <div className="flex items-center mt-3">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{orderData.shipping.mobileNumber}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-6 h-6 mr-2 text-black" />
                  Payment Information
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">{orderData.paymentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-medium">₹{orderData.payAmt}</span>
                  </div>
                  {orderData.transactionId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-medium text-sm break-all">{orderData.transactionId}</span>
                    </div>
                  )}
                  {!orderData.transactionId && orderData.paymentType === 'COD' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment:</span>
                      <span className="font-medium text-orange-600">Cash on Delivery</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Items:</span>
                    <span className="font-medium">{orderData.totalquantity}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <User className="w-6 h-6 mr-2 text-black" />
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 text-sm">Customer Name</p>
                  <p className="font-medium text-gray-900">{orderData.userId?.Name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Email</p>
                  <p className="font-medium text-gray-900">{orderData.userId?.Email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Phone</p>
                  <p className="font-medium text-gray-900">{orderData.userId?.ContactNumber || orderData.shipping?.mobileNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Order Date</p>
                  <p className="font-medium text-gray-900">{formatDate(orderData.orderDate)}</p>
                </div>
                {orderData.OrderProcessRating > 0 && (
                  <div>
                    <p className="text-gray-600 text-sm">Order Rating</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < orderData.OrderProcessRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">({orderData.OrderProcessRating}/5)</span>
                    </div>
                  </div>
                )}
                {orderData.offerId && (
                  <div>
                    <p className="text-gray-600 text-sm">Offer Applied</p>
                    <p className="font-medium text-green-600">Yes</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you have any questions about your order, please contact our customer support.
          </p>
          <Link to="/contact" className="px-6 py-2 bg-black text-white rounded-lg hover:bg-[#24262b] transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrackYourOrder;