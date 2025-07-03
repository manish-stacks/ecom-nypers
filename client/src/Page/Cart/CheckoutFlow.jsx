import React, { useState, useEffect } from "react"
import { ArrowLeft, MapPin, CreditCard, Smartphone, CheckCircle, Loader, AlertCircle, X, Package, ShoppingBag, Truck, Phone, User, Star } from "lucide-react"
import axios from "axios"

const CheckoutFlow = () => {
  const [setting, setSetting] = useState({})
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [couponCodeId, setCouponCodeId] = useState("")

  // Cart and user data
  const [cartItems, setCartItems] = useState([])
  const [user, setUser] = useState({})
  const [orderTotal, setOrderTotal] = useState(0)
  const [cartSubtotal, setCartSubtotal] = useState(0)
  const [shipping, setShipping] = useState(0)

  // Coupon data
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [discountAmount, setDiscountAmount] = useState(0)

  // Address form
  const [address, setAddress] = useState({
    addressLine: "",
    city: "",
    state: "",
    postCode: "",
    mobileNumber: "",
  })

  const [qrCodeUrl, setQRCodeUrl] = useState("")

  const handleFetchSetting = async () => {
    try {
      const { data } = await axios.get("https://api.nypers.in/api/v1/admin/settings")
      console.log("data.data.paymentImage", data.data.paymentImage)
      setQRCodeUrl(data.data.paymentImage)
    } catch (error) {
      console.error("Error fetching setting:", error)
    }
  }
  useEffect(() => {
    handleFetchSetting();
  })

  // Payment
  const [paymentMethod, setPaymentMethod] = useState("")
  const [transactionId, setTransactionId] = useState("")

  // Order data
  const [createdOrder, setCreatedOrder] = useState(null)

  useEffect(() => {
    // Load cart items and user data
    const storedCart = JSON.parse(sessionStorage.getItem("cartItems") || "[]")
    const token = sessionStorage.getItem("token_login")
    console.log("token", token)

    // Load applied coupon data
    const storedCoupon = sessionStorage.getItem("appliedCoupon")

    setCartItems(storedCart)

    // Calculate subtotal
    const subtotal = storedCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setCartSubtotal(subtotal)

    // Calculate shipping
    const shippingCost = subtotal > 100 ? 0 : 9.99
    setShipping(shippingCost)

    // Apply coupon if exists
    if (storedCoupon) {
      const couponData = JSON.parse(storedCoupon)
      setAppliedCoupon(couponData)
      setDiscountAmount(couponData.discountAmount)
      // Calculate total with discount
      setOrderTotal(subtotal - couponData.discountAmount + shippingCost)
      setCouponCodeId(couponData.offerId)
    } else {
      // Calculate total without discount
      setOrderTotal(subtotal + shippingCost)
    }

    // Fetch user details
    if (token) {
      fetchUserDetails(token)
    }
  }, [])

  const fetchUserDetails = async (token) => {
    try {
      const response = await fetch("https://api.nypers.in/api/v1/my-details", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      console.log("data", data)
      setUser(data.data)
    } catch (error) {
      console.error("Error fetching user details:", error)
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setDiscountAmount(0)
    setOrderTotal(cartSubtotal + shipping)
    sessionStorage.removeItem("appliedCoupon")
  }

  const handleAddressSubmit = () => {
    if (!address.addressLine || !address.city || !address.state || !address.postCode || !address.mobileNumber) {
      setError("Please fill in all address fields")
      return
    }
    setError("")
    setCurrentStep(2)
  }

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method)
    if (method === "COD") {
      setCurrentStep(4)
    } else {
      setCurrentStep(3)
    }
  }

  const handleCreateOrder = async () => {
    setLoading(true)
    setError("")

    try {
      const token = sessionStorage.getItem("token_login")
      console.log("cartItem", cartItems)
      // Prepare order data with coupon information
      const orderData = {
        items: cartItems.map((item) => ({
          product_id: item.product,
          product_name: item.product_name,
          Qunatity: item.quantity,
          price_after_discount: item.price,
          Varient_id: item.variantId || null,
          variant: item.variant || "",
          size: item.size,
          color: item.color,
        })),
        totalAmount: cartSubtotal, // Original amount before discount
        payAmt: orderTotal, // Final amount after discount
        isVarientInCart: cartItems.some((item) => item.variantId),
        paymentType: paymentMethod,
        offerId: appliedCoupon ? appliedCoupon.offerId : null, // Include offer ID if available
        shipping: address,
        discountAmount: discountAmount,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        transactionId: paymentMethod === "ONLINE" ? transactionId : null,
      }
      console.log("orderData", orderData)
      const response = await fetch("https://api.nypers.in/api/v1/add-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (result.success) {
        setCreatedOrder(result.order)
        setSuccess(true)
        // Clear cart and coupon data
        sessionStorage.removeItem("cartItems")
        sessionStorage.removeItem("appliedCoupon")
        setCartItems([])
      } else {
        setError(result.message || "Failed to create order")
      }
    } catch (error) {
      setError("Failed to create order")
    } finally {
      setLoading(false)
    }
  }

  const handleOnlinePaymentConfirm = () => {
    if (!transactionId.trim()) {
      setError("Please enter transaction ID")
      return
    }
    setError("")
    handleCreateOrder()
  }

  if (success && createdOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-emerald-100">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
            Order Confirmed!
          </h2>
          <p className="text-gray-600 mb-6">Thank you for your purchase. We'll process your order soon.</p>
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mb-6 border border-gray-100">
            <div className="flex items-center justify-center mb-2">
              <Package className="w-5 h-5 text-blue-600 mr-2" />
              <p className="text-sm font-medium text-gray-700">Order ID</p>
            </div>
            <p className="text-xl font-bold text-gray-900 font-mono">{createdOrder.orderId}</p>
          </div>
          <button
            onClick={() => (window.location.href = "/shop")}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  const stepLabels = {
    1: { icon: MapPin, title: "Delivery Address", color: "from-blue-500 to-cyan-500" },
    2: { icon: CreditCard, title: "Payment Method", color: "from-purple-500 to-pink-500" },
    3: { icon: Smartphone, title: "Online Payment", color: "from-emerald-500 to-teal-500" },
    4: { icon: CheckCircle, title: "Confirm Order", color: "from-orange-500 to-red-500" }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <button
              onClick={() => (currentStep > 1 ? setCurrentStep(currentStep - 1) : window.history.back())}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span className="font-medium">Back</span>
            </button>
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Checkout
              </h1>
              <p className="text-sm text-gray-500 mt-1">Secure & Fast</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">Step {currentStep} of 4</div>
              <div className="text-xs text-gray-500">{stepLabels[currentStep]?.title}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Progress Bar */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-6">
            {[1, 2, 3, 4].map((step) => {
              const StepIcon = stepLabels[step].icon
              const isActive = step === currentStep
              const isCompleted = step < currentStep

              return (
                <div key={step} className="flex items-center">
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${isActive
                          ? `bg-gradient-to-r ${stepLabels[step].color} text-white shadow-lg scale-110`
                          : isCompleted
                            ? "bg-emerald-500 text-white shadow-md"
                            : "bg-gray-200 text-gray-600"
                        }`}
                    >
                      {isCompleted ? (
                        <CheckCircle size={20} />
                      ) : (
                        <StepIcon size={20} />
                      )}
                    </div>
                    {isActive && (
                      <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
                    )}
                  </div>
                  {step < 4 && (
                    <div className={`w-20 h-1 mx-4 rounded-full transition-all duration-500 ${step < currentStep ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : "bg-gray-200"
                      }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-4 mb-6 shadow-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Address */}
            {currentStep === 1 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Delivery Address</h2>
                    <p className="text-gray-600">Where should we deliver your order?</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Complete Address</label>
                    <textarea
                      value={address.addressLine}
                      onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                      className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 hover:border-gray-300"
                      rows="3"
                      placeholder="Enter your complete address with landmarks"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">City</label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 hover:border-gray-300"
                        placeholder="Your city"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">State</label>
                      <input
                        type="text"
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 hover:border-gray-300"
                        placeholder="Your state"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">PIN Code</label>
                      <input
                        type="text"
                        value={address.postCode}
                        onChange={(e) => setAddress({ ...address, postCode: e.target.value })}
                        className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 hover:border-gray-300"
                        placeholder="PIN Code"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Mobile Number</label>
                      <input
                        type="tel"
                        value={address.mobileNumber}
                        onChange={(e) => setAddress({ ...address, mobileNumber: e.target.value })}
                        className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 hover:border-gray-300"
                        placeholder="10-digit mobile number"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleAddressSubmit}
                  className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
                    <p className="text-gray-600">Choose your preferred payment option</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <button
                    onClick={() => handlePaymentMethodSelect("ONLINE")}
                    className="w-full border-2 border-gray-200 rounded-2xl p-6 text-left hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 transform hover:scale-105 group"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                        <Smartphone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">Online Payment</h3>
                        <p className="text-sm text-gray-600">Pay instantly using UPI, Net Banking, or Cards</p>
                        <div className="flex items-center mt-2">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-xs text-gray-500">Most Popular</span>
                        </div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => handlePaymentMethodSelect("COD")}
                    className="w-full border-2 border-gray-200 rounded-2xl p-6 text-left hover:border-green-500 hover:bg-green-50 transition-all duration-200 transform hover:scale-105 group"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                        <Truck className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">Cash on Delivery</h3>
                        <p className="text-sm text-gray-600">Pay when your order arrives at your doorstep</p>
                        <div className="flex items-center mt-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-xs text-gray-500">Safe & Secure</span>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: QR Code Payment */}
            {currentStep === 3 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mr-4">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Scan QR Code to Pay</h2>
                      <p className="text-gray-600">Use any UPI app to complete payment</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 mb-6 border border-gray-100">
                    <div className="bg-white rounded-2xl p-6 inline-block shadow-lg">
                      <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-48 h-48 mx-auto mb-4 rounded-xl" />
                    </div>
                    <div className="mt-6">
                      <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        ₹{orderTotal.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">Scan with PhonePe, GPay, Paytm or any UPI app</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Transaction ID</label>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white/50 text-center font-mono"
                        placeholder="Enter 12-digit transaction ID"
                      />
                    </div>
                    <button
                      onClick={handleOnlinePaymentConfirm}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-2xl font-semibold hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <Loader className="w-6 h-6 animate-spin mr-3" />
                          Confirming Payment...
                        </div>
                      ) : (
                        "Confirm Payment"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: COD Confirmation */}
            {currentStep === 4 && paymentMethod === "COD" && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
                    Confirm Your Order
                  </h2>
                  <p className="text-gray-600 mb-8 text-lg">
                    You have selected Cash on Delivery. Please confirm your order to proceed.
                  </p>
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 mb-6 border border-orange-200">
                    <div className="flex items-center justify-center mb-2">
                      <Truck className="w-5 h-5 text-orange-600 mr-2" />
                      <span className="font-medium text-orange-800">Cash on Delivery</span>
                    </div>
                    <p className="text-sm text-gray-600">Pay ₹{orderTotal.toFixed(2)} when your order arrives</p>
                  </div>
                  <button
                    onClick={handleCreateOrder}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-2xl font-semibold hover:from-orange-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <Loader className="w-6 h-6 animate-spin mr-3" />
                        Creating Order...
                      </div>
                    ) : (
                      "Confirm Order"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 sticky top-8 border border-white/20">
              <div className="flex items-center mb-6">
                <ShoppingBag className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
              </div>

              {/* Applied Coupon Display */}
              {appliedCoupon && (
                <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-emerald-800">🎉 Coupon Applied</p>
                      <p className="text-xs text-emerald-600 font-mono bg-emerald-100 px-2 py-1 rounded-lg mt-1">
                        {appliedCoupon.code}
                      </p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-600 hover:text-red-700 hover:bg-red-100 p-2 rounded-full transition-all duration-200"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.product} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.product_name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                      {item.color && <p className="text-xs text-gray-500">Color: {item.color}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-gray-200 pt-6 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    Subtotal
                  </span>
                  <span className="font-semibold">₹{cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center">
                    <Truck className="w-4 h-4 mr-2" />
                    Shipping
                  </span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-emerald-600 font-bold">Free</span>
                    ) : (
                      `₹${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-2" />
                      Discount ({appliedCoupon.code})
                    </span>
                    <span className="font-bold">-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t-2 border-gray-300">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ₹{orderTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {currentStep >= 1 && address.addressLine && (
                <div className="mt-8 pt-6 border-t-2 border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    Delivery Address
                  </h4>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <strong>{address.addressLine}</strong>
                      <br />
                      {address.city}, {address.state} - {address.postCode}
                      <br />
                      <span className="flex items-center mt-2">
                        <Phone className="w-4 h-4 mr-2 text-blue-600" />
                        {address.mobileNumber}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {paymentMethod && (
                <div className="mt-6 pt-6 border-t-2 border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
                    Payment Method
                  </h4>
                  <div className={`rounded-2xl p-4 border-2 ${paymentMethod === "ONLINE"
                      ? "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200"
                      : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                    }`}>
                    <p className="text-sm font-semibold text-gray-800 flex items-center">
                      {paymentMethod === "ONLINE" ? (
                        <>
                          <Smartphone className="w-4 h-4 mr-2 text-blue-600" />
                          Online Payment
                        </>
                      ) : (
                        <>
                          <Truck className="w-4 h-4 mr-2 text-green-600" />
                          Cash on Delivery
                        </>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Trust Indicators */}
              <div className="mt-8 pt-6 border-t-2 border-gray-200">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1 text-emerald-500" />
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center">
                      <Truck className="w-4 h-4 mr-1 text-blue-500" />
                      <span>Fast Delivery</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      <span>Quality</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutFlow