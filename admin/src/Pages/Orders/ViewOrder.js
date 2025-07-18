import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Truck,
  CreditCard,
  Package,
  User,
  Calendar,
  MapPin,
  Star,
  RefreshCw,
  Tag,
  Percent,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

const ViewOrder = () => {
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://api.nypers.in/api/v1/recent-order/${id}`);
        const data = await response.json();
        setOrderData(data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      delivered: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
      processing: "bg-blue-100 text-blue-800",
      confirmed: "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getRefundStatusColor = (refundRequest) => {
    return refundRequest 
      ? "bg-orange-100 text-orange-800 border-orange-200" 
      : "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-lg">{error}</div>
    );
  }

  if (!orderData) {
    return (
      <div className="p-4 bg-gray-50 text-gray-500 rounded-lg">
        No order data found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-3 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{orderData.orderId}
          </h1>
          <p className="text-gray-500 mt-1">
            <Calendar className="inline-block w-4 h-4 mr-1" />
            {formatDate(orderData.orderDate)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {orderData.offerId && Object.keys(orderData.offerId).length > 0 && (
            <div className="bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-green-600" />
                <span className="text-green-700 font-medium text-sm">
                  {orderData.offerId.code}
                </span>
              </div>
            </div>
          )}
          <div
            className={`px-4 py-2 rounded-full ${getStatusColor(
              orderData.status
            )}`}
          >
            <span className="font-medium capitalize">{orderData.status}</span>
          </div>
        </div>
      </div>

      {/* Refund Alert - Show if refund is requested */}
      {orderData.refundRequest && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-800 mb-1">
                Refund Request Pending
              </h3>
              <p className="text-orange-700 text-sm">
                This order has a pending refund request. Please review the details below.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Customer Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold">Customer Details</h2>
          </div>
          <div className="space-y-3">
            <p>
              <span className="text-gray-600">Name:</span>{" "}
              {orderData.userId?.Name}
            </p>
            <p>
              <span className="text-gray-600">Email:</span>{" "}
              {orderData.userId?.Email}
            </p>
            <p>
              <span className="text-gray-600">Phone:</span>{" "}
              {orderData.userId?.ContactNumber}
            </p>
            {orderData.OrderProcessRating > 0 && (
              <div className="flex items-center mt-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="ml-1 font-medium">
                  {orderData.OrderProcessRating}/5
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Shipping Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <MapPin className="w-5 h-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold">Shipping Details</h2>
          </div>
          <div className="space-y-3">
            <p>
              <span className="text-gray-600">Address:</span>{" "}
              {orderData.shipping?.addressLine}
            </p>
            <p>
              <span className="text-gray-600">City:</span>{" "}
              {orderData.shipping?.city}
            </p>
            <p>
              <span className="text-gray-600">State:</span>{" "}
              {orderData.shipping?.state}
            </p>
            <p>
              <span className="text-gray-600">Postal Code:</span>{" "}
              {orderData.shipping?.postCode}
            </p>
            <p>
              <span className="text-gray-600">Phone:</span>{" "}
              {orderData.shipping?.mobileNumber}
            </p>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <CreditCard className="w-5 h-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold">Payment Details</h2>
          </div>
          <div className="border p-4 rounded-md bg-gray-50 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Payment Type:</span>
              <span className="text-gray-800">{orderData.paymentType}</span>
            </div>
            {orderData.paymentType === "ONLINE" && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Transaction ID:</span>
                  <span className="text-gray-800">{orderData.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Status:</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    Paid
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Refund Details - Only show if refund is requested */}
      {orderData.refundRequest && (
        <div className="bg-white rounded-lg shadow-sm border border-orange-200">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <RotateCcw className="w-5 h-5 text-orange-600 mr-2" />
              <h2 className="text-lg font-semibold text-orange-800">Refund Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 font-medium">Refund Status</span>
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    Pending Review
                  </span>
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 font-medium">Refund Amount</span>
                  <CreditCard className="w-4 h-4 text-orange-600" />
                </div>
                <p className="text-orange-700 font-bold text-lg">
                  ₹{orderData.payAmt}
                </p>
              </div>
            </div>
            {orderData.refundReason && (
              <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-medium text-orange-800 mb-2">Refund Reason:</h4>
                <p className="text-orange-700 text-sm bg-white p-3 rounded border border-orange-200">
                  {orderData.refundReason}
                </p>
              </div>
            )}
            <div className="mt-4 p-3 bg-orange-100 rounded-lg border border-orange-200">
              <p className="text-orange-700 text-sm">
                <strong>Note:</strong> Refund requests are typically processed within 3-5 business days. 
                You will receive an email notification once the refund is processed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Offer Details - Only show if offer exists */}
      {orderData.offerId && Object.keys(orderData.offerId).length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg shadow-sm border border-green-200">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Tag className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-lg font-semibold text-green-800">Offer Applied</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Offer Code</span>
                  <Tag className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-green-700 font-bold text-lg mt-1">
                  {orderData.offerId.code}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Discount</span>
                  <Percent className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-green-700 font-bold text-lg mt-1">
                  {orderData.offerId.discount}% OFF
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Min. Amount</span>
                  <CreditCard className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-green-700 font-bold text-lg mt-1">
                  ₹{orderData.offerId.minimumOrderAmount}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">You Saved</span>
                  <Star className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-green-700 font-bold text-lg mt-1">
                  ₹{(orderData.totalAmount - orderData.payAmt).toFixed(2)}
                </p>
              </div>
            </div>
            {orderData.offerId.expirationDate && (
              <div className="mt-4 p-3 bg-green-100 rounded-lg">
                <p className="text-green-700 text-sm">
                  <strong>Valid Until:</strong> {new Date(orderData.offerId.expirationDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Package className="w-5 h-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold">Order Items</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orderData.items?.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 underline text-green-500 whitespace-nowrap">
                    <a href={`/products/edit/${item.productId}?type=View-Product`}>
                      {item.name}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    Size: {item.size || "-"} | Color: {item.color || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{item.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ₹{item.price * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end">
            <div className="w-64 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{orderData.totalAmount}</span>
              </div>
              {orderData.offerId && Object.keys(orderData.offerId).length > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({orderData.offerId.discount}%)</span>
                  <span>-₹{(orderData.totalAmount - orderData.payAmt).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span>{orderData.isDeliveryFeePay ? `₹${orderData.deliveryFee}` : "Free"}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-3">
                <span>Total</span>
                <span>₹{orderData.payAmt}</span>
              </div>
              {orderData.offerId && Object.keys(orderData.offerId).length > 0 && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-green-700 text-sm text-center">
                    🎉 You saved ₹{(orderData.totalAmount - orderData.payAmt).toFixed(2)} with offer {orderData.offerId.code}!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrder;