
import React, { useState, useEffect } from "react"
import { X, Plus, Minus, ShoppingBag, ArrowLeft, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"

const CartPage = () => {
  const [user, setUser] = useState({})

  useEffect(() => {
    const token = sessionStorage.getItem("token_login")
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("https://api.nypers.in/api/v1/my-details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setUser(data.data)
        console.log("data.data", data.data)
      } catch (error) {
        console.error("Error fetching user details:", error)
      }
    }

    if (token) {
      fetchUser()
    }
  }, [])

  const [cartItems, setCartItems] = useState(() => {
    const storedCart = sessionStorage.getItem("cartItems")
    return storedCart ? JSON.parse(storedCart) : []
  })

  const [savedItems, setSavedItems] = useState(() => {
    const storedSaved = sessionStorage.getItem("savedItems")
    return storedSaved ? JSON.parse(storedSaved) : []
  })

  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [couponError, setCouponError] = useState("")

  // Load existing coupon data from sessionStorage
  useEffect(() => {
    const storedCoupon = sessionStorage.getItem("appliedCoupon")
    if (storedCoupon) {
      const couponData = JSON.parse(storedCoupon)
      setPromoCode(couponData.code)
      setPromoApplied(couponData.applied)
      setDiscountAmount(couponData.discountAmount)
    }
  }, [])

  const cartSubtotal = cartItems.reduce((total, item) => total + Number(item.price) * Number(item.quantity), 0)

  const shipping = cartSubtotal > 100 ? 0 : 9.99
  const cartTotal = promoApplied ? cartSubtotal - discountAmount + shipping : cartSubtotal + shipping

  const applyPromoCode = async () => {
    setCouponError("")
    // console.log("i am hit")
    try {
      const response = await axios.post("https://api.nypers.in/api/v1/apply-coupon", {
        code: promoCode,
        orderAmount: cartSubtotal,
      })

      const { discountAmount: discount, finalAmount,appliedCoupon } = response.data
      // console.log("appliedCoupon",appliedCoupon)
      setPromoApplied(true)
      setDiscountAmount(discount)

      // Store coupon data in sessionStorage
      const couponData = {
        code: promoCode,
        applied: true,
        discountAmount: discount,
        originalAmount: cartSubtotal,
        finalAmount: finalAmount,
        offerId: appliedCoupon._id
      }
      sessionStorage.setItem("appliedCoupon", JSON.stringify(couponData))
    } catch (error) {
      setPromoApplied(false)
      setDiscountAmount(0)
      // Remove coupon data from sessionStorage
      sessionStorage.removeItem("appliedCoupon")

      if (error.response) {
        setCouponError(error.response.data.message)
      } else {
        setCouponError("Failed to apply coupon. Try again later.")
      }
    }
  }

  const handleCheckout = () => {
    const token = sessionStorage.getItem("token_login")
    if (!token) {
      toast.error("Please login to checkout")
      setTimeout(() => {
        window.location.href = "/login"
      }, 3000);
    } else if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items to your cart before checking out.")
    } else{
      window.location.href = "/checkout"
    }
  }

  const removeCoupon = () => {
    setPromoApplied(false)
    setDiscountAmount(0)
    setPromoCode("")
    sessionStorage.removeItem("appliedCoupon")
  }

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return
    const updatedCart = cartItems.map((item) => (item.product === id ? { ...item, quantity: newQuantity } : item))
    setCartItems(updatedCart)
  }

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.product !== id)
    setCartItems(updatedCart)
  }

  const saveForLater = (item) => {
    setSavedItems([...savedItems, item])
    removeItem(item.product)
  }

  const moveToCart = (item) => {
    setCartItems([...cartItems, { ...item, quantity: 1 }])
    setSavedItems(savedItems.filter((saved) => saved.product !== item.product))
  }

  useEffect(() => {
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    sessionStorage.setItem("savedItems", JSON.stringify(savedItems))
  }, [savedItems])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft size={20} className="mr-2" />
                Continue Shopping
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <div className="flex items-center space-x-2 text-gray-600">
              <ShoppingBag size={20} />
              <span className="font-medium">{cartItems.length} Items</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          // Empty Cart
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link
              to={"/shop"}
              className="bg-[#0D1524] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#0d1524] transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Cart Items ({cartItems.length})</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.product} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.product_name}
                            className="w-24 h-24 object-fill rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 mb-1">{item.product_name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <span>Color: {item.color}</span>
                            <span>Size: {item.size}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => updateQuantity(item.product, item.quantity - 1)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product, item.quantity + 1)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-semibold text-gray-900">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-600">₹{item.price} each</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 mt-4">
                            <button
                              onClick={() => removeItem(item.product)}
                              className="flex items-center text-sm text-red-600 hover:text-red-700 transition-colors"
                            >
                              <Trash2 size={16} className="mr-1" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Saved Items */}
              {savedItems.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Saved for Later ({savedItems.length})</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {savedItems.map((item) => (
                      <div key={item.product} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.product_name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                            <p className="text-sm text-gray-600">
                              {item.color} • {item.size}
                            </p>
                            <p className="text-lg font-semibold text-gray-900 mt-1">₹{item.price}</p>
                          </div>
                          <button
                            onClick={() => moveToCart(item)}
                            className="bg-[#0D1524] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0d1524] transition-colors"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                  {promoApplied ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                      <div>
                        <p className="text-sm font-medium text-green-800">{promoCode}</p>
                        <p className="text-xs text-green-600">Coupon applied successfully!</p>
                      </div>
                      <button onClick={removeCoupon} className="text-red-600 hover:text-red-700">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={applyPromoCode}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  {couponError && <p className="text-sm text-red-600 mt-2">{couponError}</p>}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>₹{cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({promoCode})</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                      <span>Total</span>
                      <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Free Shipping Notice */}
                {shipping > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                    <p className="text-sm text-blue-800">
                      Add ₹{(100 - cartSubtotal).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}

                {/* Checkout Button */}
                <Link
                  // to="/checkout"
                  onClick={handleCheckout}
                  className="w-full bg-[#0D1524] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#0d1524] transition-colors mb-3 block text-center"
                >
                  Proceed to Checkout
                </Link>
                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Continue Shopping
                </button>

                {/* Security Notice */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">🔒 Secure checkout with SSL encryption</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage
