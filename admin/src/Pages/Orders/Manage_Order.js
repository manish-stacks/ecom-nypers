import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, Package, Tag } from "lucide-react";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  returned: "bg-gray-100 text-gray-800",
  progress: "bg-indigo-100 text-indigo-800",
};

const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async (page) => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.nypers.in/api/v1/admin/get-all-order?page=${page}&limit=6`);
      const responseData = await response.json();
      const { data, totalPages } = responseData;
      setOrders(data);
      setTotalPages(totalPages);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch orders. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleStatusChange = async (orderId, status) => {
    try {
      console.log("orderId, status", orderId, status);
      setLoading(true);
      const response = await fetch("https://api.nypers.in/api/v1/admin/change-order-status", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status }),
      });
      const data = await response.json();
      console.log(data);
      fetchOrders(currentPage);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        setLoading(true);
        await fetch(`https://api.nypers.in/api/v1/admin/delete-order/${orderId}`, {
          method: 'DELETE',
        });
        fetchOrders(currentPage);
        alert("Order deleted successfully");
      } catch (err) {
        console.log(err);
        setError("Failed to delete order. Please try again later.");
        setLoading(false);
      }
    }
  };

  const handlePrintOrder = (order) => {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Order Details - ${order.orderId}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');
            body {
              font-family: 'Roboto', sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f0f0f0;
              color: #333;
            }
            .container {
              width: 100%;
              max-width: 800px;
              margin: 20px auto;
              background-color: #ffffff;
              box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
              border-radius: 8px;
              overflow: hidden;
            }
            .header {
              background-color: #4a90e2;
              color: #ffffff;
              padding: 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
            }
            .order-info, .shipping-info, .customer-details, .order-items, .order-summary, .footer, .offer-details {
              padding: 20px;
            }
            .order-info, .shipping-info, .offer-details {
              background-color: #f9f9f9;
              border-bottom: 1px solid #e0e0e0;
            }
            .order-info div, .shipping-info div, .offer-details div {
              margin-bottom: 10px;
            }
            .order-info h2, .shipping-info h2, .offer-details h2 {
              font-size: 18px;
              margin-bottom: 10px;
              color: #4a90e2;
            }
            .status {
              font-weight: bold;
              color: #4caf50;
            }
            .offer-badge {
              background-color: #e8f5e8;
              color: #2d5a2d;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
            }
            .table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            .table th, .table td {
              border: 1px solid #e0e0e0;
              padding: 12px;
              text-align: left;
            }
            .table th {
              background-color: #f4f4f4;
              font-weight: bold;
              color: #4a90e2;
            }
            .table tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .total {
              font-size: 16px;
              font-weight: bold;
              margin-top: 20px;
              text-align: right;
              color: #4a90e2;
            }
            .footer {
              background-color: #f4f4f4;
              font-size: 14px;
              color: #666;
              border-top: 1px solid #e0e0e0;
            }
            .footer h3 {
              color: #4a90e2;
              margin-bottom: 5px;
            }
            .footer ul {
              padding-left: 5px;
              margin: 0;
            }
            .footer li {
              margin-bottom: 5px;
            }
            @media print {
              body { background-color: #ffffff; }
              .container { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Invoice</h1>
            </div>
            
            <div class="order-info">
              <h2>Order Details</h2>
              <p><strong>Order ID:</strong> ${order.orderId}</p>
              <p><strong>Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
              <p><strong>Status:</strong> <span class="status">${order.status}</span></p>
              <p><strong>Payment Type:</strong> ${order.paymentType}</p>
              ${
                order.transactionId
                  ? `<p><strong>Transaction ID:</strong> ${order.transactionId}</p>`
                  : ""
              }
            </div>

            ${order.offerId ? `
            <div class="offer-details">
              <h2>Offer Applied</h2>
              <p><strong>Offer Code:</strong> <span class="offer-badge">${order.offerId.code}</span></p>
              <p><strong>Discount:</strong> ${order.offerId.discount}%</p>
              <p><strong>Minimum Order Amount:</strong> ₹${order.offerId.minimumOrderAmount}</p>
              <p><strong>Original Amount:</strong> ₹${order.totalAmount.toFixed(2)}</p>
              <p><strong>Discount Amount:</strong> ₹${(order.totalAmount - order.payAmt).toFixed(2)}</p>
            </div>
            ` : ''}

            <div class="shipping-info">
              <h2>Shipping Information</h2>
              <p><strong>Address:</strong> ${order.shipping.addressLine}, ${order.shipping.city}, ${order.shipping.state}, ${order.shipping.postCode}</p>
              <p><strong>Mobile:</strong> ${order.shipping.mobileNumber}</p>
            </div>

            <div class="customer-details">
              <h2>Customer Details</h2>
              <p><strong>Name:</strong> ${order.userId?.Name}</p>
              <p><strong>Email:</strong> ${order.userId?.Email}</p>
              <p><strong>Contact Number:</strong> ${order.userId?.ContactNumber}</p>
            </div>

            <div class="order-items">
              <h2>Order Items</h2>
              <table class="table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Size</th>
                    <th>Color</th>
                    <th>Quantity</th>
                    <th>Price (₹)</th>
                    <th>Total (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items.map(item => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.size}</td>
                      <td>${item.color}</td>
                      <td>${item.quantity}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="order-summary">
              <div class="total">
                ${order.offerId ? `
                  <p>Subtotal: ₹${order.totalAmount.toFixed(2)}</p>
                  <p>Discount (${order.offerId.discount}%): -₹${(order.totalAmount - order.payAmt).toFixed(2)}</p>
                  <p style="font-size: 20px; border-top: 1px solid #e0e0e0; padding-top: 10px;">Final Amount: ₹${order.payAmt.toFixed(2)}</p>
                ` : `
                  <p>Total Paid: ₹${order.payAmt.toFixed(2)}</p>
                `}
              </div>
            </div>

            <div class="footer">
              <h3>Terms and Conditions</h3>
              <ul>
                <li>All sales are final. Returns accepted within 30 days of purchase with the original receipt.</li>
                <li>Shipping times may vary depending on location and availability.</li>
                <li>Prices include all applicable taxes and fees.</li>
              </ul>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-red-500">
          <AlertCircle className="w-8 h-8" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center gap-3 mb-8">
          <Package className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
        </header>

        <div className="overflow-x-auto bg-white shadow-sm rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Order ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Offer</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Payment</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-900 font-medium">{order.orderId}</td>
                  <td className="px-4 py-2 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    <div className="flex flex-col">
                      {order.offerId ? (
                        <>
                          <span className="text-gray-500 line-through text-xs">₹{order.totalAmount.toFixed(2)}</span>
                          <span className="text-green-600 font-medium">₹{order.payAmt.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="font-medium">₹{order.payAmt.toFixed(2)}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {order.offerId ? (
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-green-500" />
                        <div className="flex flex-col">
                          <span className="text-green-600 font-medium text-xs">{order.offerId.code}</span>
                          <span className="text-gray-500 text-xs">{order.offerId.discount}% off</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">No offer</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">{order.paymentType}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePrintOrder(order)}
                          className="px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
                        >
                          Print
                        </button>
                        <button
                          onClick={() => window.location.href = `/order/${order?.orderId}`}
                          className="px-3 py-1 text-xs font-medium text-white bg-green-500 rounded hover:bg-green-600"
                        >
                          View
                        </button>
                      </div>
                      <select
                        className="px-2 py-1 text-xs bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          if (selectedValue === "delete") {
                            handleDeleteOrder(order._id);
                          } else if (selectedValue) {
                            handleStatusChange(order._id, selectedValue);
                          }
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select Action
                        </option>
                        {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(
                          (status) => (
                            <option key={status} value={status}>
                              Set to {status}
                            </option>
                          )
                        )}
                        <option value="delete" className="text-red-600">
                          Delete Order
                        </option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageOrder;