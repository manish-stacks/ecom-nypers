import { Heart, ShoppingCart, Star, ChevronDown } from 'lucide-react'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const FeatureProduct = () => {
    const [favorites, setFavorites] = useState(new Set())
    const [featuredProducts, setFeaturedProducts] = useState([])
    const [selectedVariants, setSelectedVariants] = useState({}) // Track selected variants for each product

    const handleFetchProduct = async () => {
        try {
            const { data } = await axios.get('https://api.nypers.in/api/v1/get-product');
            const filteredProducts = data?.products?.filter(product => product?.isShowOnHomeScreen === true);
            setFeaturedProducts(filteredProducts)

            // Initialize selected variants with first variant for each product
            const initialVariants = {}
            filteredProducts?.forEach(product => {
                if (product.isVarient && product.Varient && product.Varient.length > 0) {
                    initialVariants[product._id] = product.Varient[0]._id
                }
            })
            setSelectedVariants(initialVariants)
        } catch (error) {
            console.log("Internal server error", error)
        }
    }

    const toggleFavorite = (productId) => {
        const newFavorites = new Set(favorites)
        if (newFavorites.has(productId)) {
            newFavorites.delete(productId)
        } else {
            newFavorites.add(productId)
        }
        setFavorites(newFavorites)
    }

    // Handle variant selection
    const handleVariantChange = (productId, variantId) => {
        setSelectedVariants(prev => ({
            ...prev,
            [productId]: variantId
        }))
    }

    // Get selected variant for a product
    const getSelectedVariant = (product) => {
        if (!product.isVarient || !product.Varient || product.Varient.length === 0) {
            return null
        }

        const selectedVariantId = selectedVariants[product._id]
        return product.Varient.find(variant => variant._id === selectedVariantId) || product.Varient[0]
    }

    // Helper function to get product price based on selected variant
    const getProductPrice = (product) => {
        const selectedVariant = getSelectedVariant(product)

        if (selectedVariant) {
            return {
                currentPrice: selectedVariant.price_after_discount || selectedVariant.price,
                originalPrice: selectedVariant.discount_percentage > 0 ? selectedVariant.price : null,
                discountPercentage: selectedVariant.discount_percentage
            }
        }

        // Fallback to direct product pricing
        if (product.price) {
            return {
                currentPrice: product.afterDiscountPrice || product.price,
                originalPrice: product.discount && product.afterDiscountPrice ? product.price : null,
                discountPercentage: product.discount
            }
        }

        return { currentPrice: 'N/A', originalPrice: null, discountPercentage: 0 }
    }

    // Helper function to get badge info
    const getBadgeInfo = (product) => {
        const { discountPercentage } = getProductPrice(product)

        if (discountPercentage && discountPercentage > 0) {
            return {
                badge: `${discountPercentage}% OFF`,
                badgeColor: 'bg-red-500'
            }
        }

        return {
            badge: 'New',
            badgeColor: 'bg-green-500'
        }
    }

    useEffect(() => {
        handleFetchProduct()
    }, [])

    return (
        <>
            {/* Featured Products */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">Featured Products</h2>
                        <p className="text-xl text-gray-600">Our most popular and trending shoes</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts && featuredProducts.slice(0, 4).map((product) => {
                            const { currentPrice, originalPrice, discountPercentage } = getProductPrice(product);
                            const { badge, badgeColor } = getBadgeInfo(product);
                            const selectedVariant = getSelectedVariant(product);

                            return (
                                <div key={product._id} className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={product.ProductMainImage?.url}
                                            alt={product.product_name}
                                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className={`${badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                                                {badge}
                                            </span>
                                        </div>
                                        {/* <button
                                            onClick={() => toggleFavorite(product._id)}
                                            className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${favorites.has(product._id)
                                                ? 'bg-red-500 text-white'
                                                : 'bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white'
                                                }`}
                                        >
                                            <Heart className="w-4 h-4" fill={favorites.has(product._id) ? 'currentColor' : 'none'} />
                                        </button> */}
                                    </div>
                                    <div className="p-6">
                                        <Link to={`/product-page/${product._id}`} className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                            {product.product_name}
                                        </Link>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < Math.floor(4.5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-600">
                                                ({product.reviews?.length || 0} reviews)
                                            </span>
                                        </div>

                                        {/* Variant Dropdown - Only show if product has variants */}
                                        {product.isVarient && product.Varient && product.Varient.length > 0 && (
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Size
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        value={selectedVariants[product._id] || ''}
                                                        onChange={(e) => handleVariantChange(product._id, e.target.value)}
                                                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm appearance-none cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        {product.Varient.map((variant) => (
                                                            <option key={variant._id} value={variant._id}>
                                                                Size {variant.quantity} - ₹{variant.price_after_discount || variant.price}
                                                                {variant.discount_percentage > 0 && ` (${variant.discount_percentage}% off)`}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                                </div>
                                                {selectedVariant && (
                                                    <div className="mt-2 text-xs text-gray-600">
                                                        Stock: {selectedVariant.stock_quantity} available
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl font-bold text-gray-900">
                                                    {typeof currentPrice === 'number' ? `₹${currentPrice}` : currentPrice}
                                                </span>
                                                {originalPrice && (
                                                    <span className="text-sm text-gray-500 line-through">₹{originalPrice}</span>
                                                )}
                                                {discountPercentage > 0 && (
                                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                                        Save {discountPercentage}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <Link to={`/product-page/${product._id}`} className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-2">
                                            <ShoppingCart className="w-4 h-4" />
                                            View Product
                                        </Link>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    {featuredProducts.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No featured products available at the moment.</p>
                        </div>
                    )}
                    <div className="text-center mt-12">
                        <Link to="/shop" className="bg-[#101828] text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition-all duration-300 hover:scale-105">
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}

export default FeatureProduct