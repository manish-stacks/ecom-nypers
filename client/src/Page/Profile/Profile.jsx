import React, { useState, useEffect } from 'react';
import { User, Edit3, Package, LogOut, Settings, Phone, Mail, Calendar, CreditCard, MapPin, Star, Clock, Truck } from 'lucide-react';
import axios from 'axios'
import ChangePassword from './ChangePassword';
import { toast } from 'react-toastify';
import ProfileUpdate from './ProfileUpdate';

const Profile = () => {
    const [user, setUser] = useState({});
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem("token_login");


        const fetchUser = async () => {
            setIsLoading(true)
            try {
                const { data } = await axios.get("https://api.nypers.in/v1/my-details", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                setUser(data.data)
                setIsLoading(false)
                // console.log("data.data", data.data)
            } catch (error) {
                console.error("Error fetching user details:", error)
            } finally {
                setIsLoading(false)
            }
        }

        const fetchOrder = async () => {
            setIsLoading(true)
            try {
                const { data } = await axios.get("https://api.nypers.in/v1/my-all-order", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                // console.log("data.data", data.order)
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

    const handleDeleteAccount = async() => {
        try {
            const token = sessionStorage.getItem("token_login");
            const { data } = await axios.delete("https://api.nypers.in/v1/delete-account", {
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
                                        <button  onClick={() => setActiveTab('profile-update')} className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-[#1e1f24] transition-colors">
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
                                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                        </span>
                                                    </div>
                                                </div>

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
                                                        <span className="text-gray-600">Amount: ₹{order.payAmt}</span>
                                                    </div>
                                                </div>

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

                                        {/* <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                                                <p className="text-sm text-gray-500">Add an extra layer of security</p>
                                            </div>
                                            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                                                Enable
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h3 className="font-medium text-gray-900">Email Notifications</h3>
                                                <p className="text-sm text-gray-500">Manage your email preferences</p>
                                            </div>
                                            <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-[#1e1f24] transition-colors">
                                                Manage
                                            </button>
                                        </div> */}

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
        </div>
    );
};

export default Profile;