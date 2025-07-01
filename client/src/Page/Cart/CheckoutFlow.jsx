
import React, { useState, useEffect } from "react"
import { ArrowLeft, MapPin, CreditCard, Smartphone, CheckCircle, Loader, AlertCircle, X } from "lucide-react"
import axios from "axios"

const CheckoutFlow = () => {
  const [setting,setSetting] = useState({})
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

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
  
  const [qrCodeUrl,setQRCodeUrl] = useState("")

  const handleFetchSetting = async () => {
    try {
      const {data} = await axios.get("https://api.nypers.in/v1/admin/settings")
      console.log("data.data.paymentImage",data.data.paymentImage)
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
    console.log("token",token)

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
      const response = await fetch("https://api.nypers.in/v1/my-details", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      console.log("data",data)
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
        console.log("cartItem",cartItems)
      // Prepare order data with coupon information
      const orderData = {
        items: cartItems.map((item) => ({
          product_id: item.product,
          product_name: item.product_name,
          Qunatity: item.quantity,
          price_after_discount: item.price,
          variantId: item.variantId || null,
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

      const response = await fetch("https://api.nypers.in/v1/add-order", {
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600 mb-4">Thank you for your purchase</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Order ID:</p>
            <p className="text-lg font-semibold text-gray-900">{createdOrder.orderId}</p>
          </div>
          <button
            onClick={() => (window.location.href = "/shop")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => (currentStep > 1 ? setCurrentStep(currentStep - 1) : window.history.back())}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <div className="text-sm text-gray-600">Step {currentStep} of 4</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && <div className={`w-16 h-1 mx-2 ${step < currentStep ? "bg-blue-600" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Address */}
            {currentStep === 1 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <MapPin className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Delivery Address</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address Line</label>
                    <textarea
                      value={address.addressLine}
                      onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                      placeholder="Enter your full address"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="State"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label>
                      <input
                        type="text"
                        value={address.postCode}
                        onChange={(e) => setAddress({ ...address, postCode: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="PIN Code"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                      <input
                        type="tel"
                        value={address.mobileNumber}
                        onChange={(e) => setAddress({ ...address, mobileNumber: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Mobile Number"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleAddressSubmit}
                  className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <CreditCard className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                </div>
                <div className="space-y-4">
                  <button
                    onClick={() => handlePaymentMethodSelect("ONLINE")}
                    className="w-full border-2 border-gray-200 rounded-lg p-4 text-left hover:border-blue-500 transition-colors"
                  >
                    <div className="flex items-center">
                      <Smartphone className="w-6 h-6 text-blue-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">Online Payment</h3>
                        <p className="text-sm text-gray-600">Pay using UPI, Net Banking, or Cards</p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => handlePaymentMethodSelect("COD")}
                    className="w-full border-2 border-gray-200 rounded-lg p-4 text-left hover:border-blue-500 transition-colors"
                  >
                    <div className="flex items-center">
                      <CreditCard className="w-6 h-6 text-green-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">Cash on Delivery</h3>
                        <p className="text-sm text-gray-600">Pay when your order is delivered</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: QR Code Payment */}
            {currentStep === 3 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Scan QR Code to Pay</h2>
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-48 h-48 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-gray-900">₹{orderTotal.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Scan with any UPI app</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Transaction ID</label>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter transaction ID after payment"
                      />
                    </div>
                    <button
                      onClick={handleOnlinePaymentConfirm}
                      disabled={loading}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <Loader className="w-5 h-5 animate-spin mr-2" />
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
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Confirm Order</h2>
                  <p className="text-gray-600 mb-6">You have selected Cash on Delivery. Please confirm your order.</p>
                  <button
                    onClick={handleCreateOrder}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <Loader className="w-5 h-5 animate-spin mr-2" />
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

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

              {/* Applied Coupon Display */}
              {appliedCoupon && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">Coupon Applied</p>
                      <p className="text-xs text-green-600">{appliedCoupon.code}</p>
                    </div>
                    <button onClick={removeCoupon} className="text-red-600 hover:text-red-700">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.product} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{item.product_name}</p>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>₹{orderTotal.toFixed(2)}</span>
                </div>
              </div>

              {currentStep >= 1 && address.addressLine && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                  <p className="text-sm text-gray-600">
                    {address.addressLine}
                    <br />
                    {address.city}, {address.state} {address.postCode}
                    <br />
                    {address.mobileNumber}
                  </p>
                </div>
              )}

              {paymentMethod && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Payment Method</h4>
                  <p className="text-sm text-gray-600">
                    {paymentMethod === "ONLINE" ? "Online Payment" : "Cash on Delivery"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutFlow
