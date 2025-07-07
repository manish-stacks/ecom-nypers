"use client"

import React,{ useEffect } from "react"
import { useParams } from "react-router-dom"
import { Heart, ShoppingCart, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import {
  fetchProduct,
  setSelectedImage,
  setSelectedVariant,
  setSelectedColor,
  incrementQuantity,
  decrementQuantity,
  toggleWishlist,
  resetProductState,
} from "../store/slices/productSlice"
import { addToCart } from "../store/slices/cartSlice"
import { fetchUserDetails } from "../store/slices/userSlice"

const ProductDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.user)
  const { product, loading, selectedImage, selectedVariant, selectedColor, quantity, isWishlisted } = useSelector(
    (state) => state.product,
  )

  useEffect(() => {
    const token = sessionStorage.getItem("token_login")
    if (token) {
      dispatch(fetchUserDetails())
    }
  }, [dispatch])

  useEffect(() => {
    dispatch(resetProductState())
    dispatch(fetchProduct(id))
  }, [dispatch, id])

  // Get all product images
  const getProductImages = () => {
    if (!product) return []
    const images = []
    if (product.ProductMainImage?.url) images.push(product.ProductMainImage.url)
    if (product.SecondImage?.url) images.push(product.SecondImage.url)
    if (product.ThirdImage?.url) images.push(product.ThirdImage.url)
    if (product.FourthImage?.url) images.push(product.FourthImage.url)
    if (product.FifthImage?.url) images.push(product.FifthImage.url)
    return images
  }

  // Color display mapping
  const getColorDisplay = (color) => {
    const colorMap = {
      red: { bg: "bg-red-500", name: "Red" },
      blue: { bg: "bg-blue-500", name: "Blue" },
      green: { bg: "bg-green-500", name: "Green" },
      yellow: { bg: "bg-yellow-500", name: "Yellow" },
      purple: { bg: "bg-purple-500", name: "Purple" },
      pink: { bg: "bg-pink-500", name: "Pink" },
      orange: { bg: "bg-orange-500", name: "Orange" },
      gray: { bg: "bg-gray-500", name: "Gray" },
      black: { bg: "bg-black", name: "Black" },
      white: { bg: "bg-white border-2 border-gray-300", name: "White" },
      brown: { bg: "bg-amber-800", name: "Brown" },
      indigo: { bg: "bg-indigo-500", name: "Indigo" },
      teal: { bg: "bg-teal-500", name: "Teal" },
      cyan: { bg: "bg-cyan-500", name: "Cyan" },
      lime: { bg: "bg-lime-500", name: "Lime" },
      emerald: { bg: "bg-emerald-500", name: "Emerald" },
      sky: { bg: "bg-sky-500", name: "Sky" },
      violet: { bg: "bg-violet-500", name: "Violet" },
      fuchsia: { bg: "bg-fuchsia-500", name: "Fuchsia" },
      rose: { bg: "bg-rose-500", name: "Rose" },
    }
    return colorMap[color.toLowerCase()] || { bg: "bg-gray-400", name: color.charAt(0).toUpperCase() + color.slice(1) }
  }

  const images = getProductImages()
  const currentVariant = product.Varient?.[selectedVariant]

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      dispatch(incrementQuantity())
    } else if (type === "decrement") {
      dispatch(decrementQuantity())
    }
  }

  const handleColorSelect = (color) => {
    dispatch(setSelectedColor(color))
  }

  const handleAddToCart = () => {
    // Validation
    if (!selectedColor) {
      alert("Please select a color")
      return
    }
    if (!currentVariant) {
      alert("Please select a size")
      return
    }

    const cartData = {
      product: product._id,
      product_name: product.product_name,
      image: product.ProductMainImage?.url || "",
      size: currentVariant.quantity,
      color: selectedColor,
      price: currentVariant.price_after_discount,
      quantity: quantity,
      variantId: currentVariant._id,
    }

    dispatch(addToCart(cartData))
    alert("Item added to cart successfully!")
  }

  const handleImageNavigation = (direction) => {
    if (direction === "prev") {
      dispatch(setSelectedImage(selectedImage > 0 ? selectedImage - 1 : images.length - 1))
    } else {
      dispatch(setSelectedImage(selectedImage < images.length - 1 ? selectedImage + 1 : 0))
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D1524]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                {images.length > 0 && (
                  <img
                    src={images[selectedImage] || "/placeholder.svg"}
                    alt={product.product_name}
                    className="w-full h-full object-contain"
                  />
                )}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => handleImageNavigation("prev")}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleImageNavigation("next")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => dispatch(setSelectedImage(index))}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-[#0D1524] ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Category and Name */}
              <div>
                {product.category?.name && (
                  <p className="text-[#0D1524] font-medium text-sm uppercase tracking-wide">{product.category.name}</p>
                )}
                <h1 className="text-3xl font-bold text-gray-900 mt-1">{product.product_name}</h1>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3">
                {currentVariant ? (
                  <>
                    <span className="text-3xl font-bold text-gray-900">₹{currentVariant.price_after_discount}</span>
                    {currentVariant.price > currentVariant.price_after_discount && (
                      <>
                        <span className="text-xl text-gray-500 line-through">₹{currentVariant.price}</span>
                        <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                          {currentVariant.discount_percentage}% OFF
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <span className="text-gray-500">Price not available</span>
                )}
              </div>

              {/* Color Selection */}
              {product.color && product.color.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.color.map((color, index) => {
                      const colorInfo = getColorDisplay(color)
                      return (
                        <button
                          key={index}
                          onClick={() => handleColorSelect(color)}
                          className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-all ${
                            selectedColor === color
                              ? "border-[#0D1524] bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          title={colorInfo.name}
                        >
                          <div className={`w-6 h-6 rounded-full ${colorInfo.bg} flex-shrink-0`}></div>
                          <span className="text-sm font-medium text-gray-700">{colorInfo.name}</span>
                          {selectedColor === color && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#0D1524] rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                  {selectedColor && (
                    <p className="text-sm text-gray-600 mt-2">
                      Selected: <span className="font-medium">{getColorDisplay(selectedColor).name}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Variants */}
              {product.isVarient && product.Varient && product.Varient.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.Varient.map((variant, index) => (
                      <button
                        key={variant._id}
                        onClick={() => dispatch(setSelectedVariant(index))}
                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                          selectedVariant === index
                            ? "border-[#0D1524] bg-blue-50 text-[#0D1524]"
                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                        }`}
                      >
                        {variant.quantity}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange("decrement")}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-semibold min-w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("increment")}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#0D1524] hover:bg-[#0d1524] text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={!selectedColor || !currentVariant}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={() => dispatch(toggleWishlist())}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    isWishlisted
                      ? "border-red-500 bg-red-50 text-red-500"
                      : "border-gray-300 hover:border-gray-400 text-gray-600"
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isWishlisted ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Validation Messages */}
              {(!selectedColor || !currentVariant) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-800 text-sm">
                    {!selectedColor && !currentVariant && "Please select a color and size to add to cart"}
                    {!selectedColor && currentVariant && "Please select a color to add to cart"}
                    {selectedColor && !currentVariant && "Please select a size to add to cart"}
                  </p>
                </div>
              )}

              {/* Stock Status */}
              {currentVariant && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 font-medium">✓ In Stock ({currentVariant.stock_quantity} available)</p>
                </div>
              )}

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-200">
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto text-[#0D1524] mb-2" />
                  <p className="text-sm text-gray-600">Free Shipping</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 mx-auto text-[#0D1524] mb-2" />
                  <p className="text-sm text-gray-600">Easy Returns</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto text-[#0D1524] mb-2" />
                  <p className="text-sm text-gray-600">Warranty</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="border-t border-gray-200 p-6 lg:p-8">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h2>
              <div className="space-y-4">
                {product.product_description && (
                  <p className="text-gray-700 leading-relaxed">{product.product_description}</p>
                )}
                {product.extra_description && (
                  <p className="text-gray-700 leading-relaxed">{product.extra_description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
