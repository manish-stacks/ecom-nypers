import React, { useState, useEffect } from 'react';
import { User, Edit3, Package, LogOut, Settings, Phone, Mail, Calendar, CreditCard, MapPin, Star, Clock, Truck, RefreshCw, X } from 'lucide-react';
import axios from 'axios'
import ChangePassword from './ChangePassword';
import { toast } from 'react-toastify';
import ProfileUpdate from './ProfileUpdate';

const Profile = () => {
    const [user, setUser] = useState({});
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(true);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [refundReason, setRefundReason] = useState('');
    const [isRefundLoading, setIsRefundLoading] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem("token_login");

        const fetchUser = async () => {
            setIsLoading(true)
            try {
                const { data } = await axios.get("https://api.nypers.in/api/v1/my-details", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                setUser(data.data)
                setIsLoading(false)
            } catch (error) {
                console.error("Error fetching user details:", error)
            } finally {
                setIsLoading(false)
            }
        }

        const fetchOrder = async () => {
            setIsLoading(true)
            try {
                const { data } = await axios.get("https://api.nypers.in/api/v1/my-all-order", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                setOrders(data.order)
                setIsLoading(false)
            } catch (error) {
                console.log("Internal server error", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (token) {
            fetchUser();
            fetchOrder();
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("token_login");
        window.location.href = '/login';
    };

    const handleDeleteAccount = async () => {
        try {
            const token = sessionStorage.getItem("token_login");
            const { data } = await axios.delete("https://api.nypers.in/api/v1/delete-account", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            toast.success(data.message)
            handleLogout()
        } catch (error) {
            console.log("Internal server error", error)
        }
    }

    const handleRefundRequest = async () => {
        if (!refundReason.trim()) {
            toast.error("Please provide a reason for refund");
            return;
        }

        setIsRefundLoading(true);
        try {
            const token = sessionStorage.getItem("token_login");
            const { data } = await axios.put(`https://api.nypers.in/api/v1/refund-request-order/${selectedOrder._id}`, {
                refundReason: refundReason
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success(data.message);
            
            // Update the order in the local state
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order._id === selectedOrder._id 
                        ? { ...order, refundRequest: true, refundReason: refundReason }
                        : order
                )
            );

            setShowRefundModal(false);
            setRefundReason('');
            setSelectedOrder(null);
        } catch (error) {
            console.error("Error requesting refund:", error);
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("Failed to request refund. Please try again.");
            }
        } finally {
            setIsRefundLoading(false);
        }
    };

    const openRefundModal = (order) => {
        setSelectedOrder(order);
        setShowRefundModal(true);
    };

    const closeRefundModal = () => {
        setShowRefundModal(false);
        setRefundReason('');
        setSelectedOrder(null);
    };

    const canRequestRefund = (order) => {
        // Check if order is delivered and no refund request is already made
        return order.status.toLowerCase() === 'delivered' && !order.refundRequest;
    };

    const getRefundStatus = (order) => {
        if (order.refundRequest) {
            return 'Refund Requested';
        }
        return null;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-black to-[#4e4e4e] px-8 py-12">
                        <div className="flex items-center space-x-6">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <User className="w-12 h-12 text-gray-600" />
                            </div>
                            <div className="text-white">
                                <h1 className="text-3xl font-bold mb-2">{user.Name}</h1>
                                <p className="text-blue-100 mb-1">{user.Email}</p>
                                <div className="flex items-center space-x-4 text-sm">
                                    <span className="flex items-center">
                                        <Phone className="w-4 h-4 mr-1" />
                                        {user.ContactNumber}
                                    </span>
                                    <span className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        Member since {formatDate(user.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'profile'
                                        ? 'bg-blue-50 text-black border-l-4 border-black'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <User className="w-5 h-5 mr-3" />
                                    Profile Details
                                </button>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders'
                                        ? 'bg-blue-50 text-black border-l-4 border-black'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Package className="w-5 h-5 mr-3" />
                                    Order History
                                </button>
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings'
                                        ? 'bg-blue-50 text-black border-l-4 border-black'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Settings className="w-5 h-5 mr-3" />
                                    Settings
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="w-5 h-5 mr-3" />
                                    Logout
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl shadow-lg p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                                        <button onClick={() => setActiveTab('profile-update')} className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-[#1e1f24] transition-colors">
                                            <Edit3 className="w-4 h-4 mr-2" />
                                            Edit Profile
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                                <User className="w-5 h-5 text-gray-400 mr-3" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Full Name</p>
                                                    <p className="font-medium text-gray-900">{user.Name}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Email Address</p>
                                                    <p className="font-medium text-gray-900">{user.Email}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Phone Number</p>
                                                    <p className="font-medium text-gray-900">{user.ContactNumber}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                                <div className="w-5 h-5 mr-3">
                                                    <div className={`w-3 h-3 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Account Status</p>
                                                    <p className="font-medium text-gray-900">{user.isActive ? 'Active' : 'Inactive'}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                                <div className="w-5 h-5 mr-3">
                                                    <div className={`w-3 h-3 rounded-full ${user.isMobileVerifed ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Mobile Verification</p>
                                                    <p className="font-medium text-gray-900">{user.isMobileVerifed ? 'Verified' : 'Pending'}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Member Since</p>
                                                    <p className="font-medium text-gray-900">{formatDate(user.createdAt)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>

                                {orders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">No orders found</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders && (Array.isArray(orders) ? orders : [orders]).map((order) => (
                                            <div key={order._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                                {/* Header */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                            <Package className="w-6 h-6 text-black" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">Order #{order.orderId}</h3>
                                                            <p className="text-sm text-gray-500">
                                                                {formatDate(order.orderDate)} • {order.totalquantity} item{order.totalquantity > 1 ? 's' : ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-semibold text-gray-900">₹{order.totalAmount}</p>
                                                        <div className="flex flex-col items-end space-y-1">
                                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                            </span>
                                                            {getRefundStatus(order) && (
                                                                <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                                    {getRefundStatus(order)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Refund Request Info */}
                                                {order.refundRequest && (
                                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                                                        <div className="flex items-center mb-2">
                                                            <RefreshCw className="w-5 h-5 text-orange-600 mr-2" />
                                                            <h4 className="font-medium text-orange-800">Refund Request Submitted</h4>
                                                        </div>
                                                        <p className="text-sm text-orange-700">
                                                            <strong>Reason:</strong> {order.refundReason}
                                                        </p>
                                                        <p className="text-xs text-orange-600 mt-1">
                                                            Your refund request is being processed. We'll update you soon.
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Offer Details - Show only if offer exists */}
                                                {order.offerId && (
                                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                                        <div className="flex items-center mb-2">
                                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                                                <span className="text-green-600 font-bold text-sm">%</span>
                                                            </div>
                                                            <h4 className="font-medium text-green-800">Offer Applied</h4>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                            <div>
                                                                <span className="text-green-700 font-medium">Code: </span>
                                                                <span className="text-green-800 font-semibold">{order.offerId.code}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-green-700 font-medium">Discount: </span>
                                                                <span className="text-green-800 font-semibold">{order.offerId.discount}%</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-green-700 font-medium">Min Order: </span>
                                                                <span className="text-green-800">₹{order.offerId.minimumOrderAmount}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-green-700 font-medium">Savings: </span>
                                                                <span className="text-green-800 font-semibold">₹{(order.totalAmount - order.payAmt).toFixed(2)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Product Items */}
                                                <div className="space-y-4 mb-4">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="border border-gray-100 rounded-md p-4 bg-gray-50">
                                                            <h4 className="font-medium text-gray-800">{item.name}</h4>
                                                            <p className="text-sm text-gray-600">Color: {item.color} | Size: {item.size}</p>
                                                            <p className="text-sm text-gray-600">Price: ₹{item.price} × {item.quantity}</p>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex justify-between items-center mb-4">
                                                    <div className="flex space-x-2">
                                                        {canRequestRefund(order) && (
                                                            <button
                                                                onClick={() => openRefundModal(order)}
                                                                className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                                                            >
                                                                <RefreshCw className="w-4 h-4 mr-2" />
                                                                Request Refund
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Summary Info */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                    <div className="flex items-center">
                                                        <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                                                        <span className="text-gray-600">Payment: {order.paymentType}</span>
                                                    </div>

                                                    <div className="flex items-center">
                                                        <Clock className="w-4 h-4 text-gray-400 mr-2" />
                                                        <span className="text-gray-600">Status: {order.status}</span>
                                                    </div>

                                                    <div className="flex items-center">
                                                        <Truck className="w-4 h-4 text-gray-400 mr-2" />
                                                        <span className="text-gray-600">Final Amount: ₹{order.payAmt}</span>
                                                    </div>
                                                </div>

                                                {/* Price Breakdown - Show when offer is applied */}
                                                {order.offerId && (
                                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                                        <h5 className="font-medium text-gray-800 mb-2">Price Breakdown</h5>
                                                        <div className="space-y-1 text-sm">
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-600">Subtotal:</span>
                                                                <span className="text-gray-800">₹{order.totalAmount}</span>
                                                            </div>
                                                            <div className="flex justify-between text-green-600">
                                                                <span>Discount ({order.offerId.discount}%):</span>
                                                                <span>-₹{(order.totalAmount - order.payAmt).toFixed(2)}</span>
                                                            </div>
                                                            <div className="flex justify-between font-semibold text-gray-900 pt-1 border-t">
                                                                <span>Final Amount:</span>
                                                                <span>₹{order.payAmt}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Transaction ID */}
                                                {order.paymentType === 'ONLINE' && order.transactionId && (
                                                    <div className="mt-4 text-sm text-gray-700">
                                                        <strong>Transaction ID:</strong> {order.transactionId}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl shadow-lg p-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h3 className="font-medium text-gray-900">Change Password</h3>
                                                <p className="text-sm text-gray-500">Update your account password</p>
                                            </div>
                                            <button onClick={() => setActiveTab('password-change')} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-[#1e1f24] transition-colors">
                                                Change
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                                            <div>
                                                <h3 className="font-medium text-red-900">Delete Account</h3>
                                                <p className="text-sm text-red-600">Permanently delete your account</p>
                                            </div>
                                            <button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'password-change' && <ChangePassword />}
                        {activeTab === 'profile-update' && <ProfileUpdate />}
                    </div>
                </div>
            </div>

            {/* Refund Modal */}
            {showRefundModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Request Refund</h3>
                            <button
                                onClick={closeRefundModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">
                                Order #{selectedOrder?.orderId}
                            </p>
                            <p className="text-sm text-gray-600 mb-4">
                                Total Amount: ₹{selectedOrder?.payAmt}
                            </p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason for Refund <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={refundReason}
                                onChange={(e) => setRefundReason(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                                rows={4}
                                placeholder="Please provide a detailed reason for requesting a refund..."
                            />
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={closeRefundModal}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRefundRequest}
                                disabled={isRefundLoading || !refundReason.trim()}
                                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isRefundLoading ? 'Processing...' : 'Submit Request'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;