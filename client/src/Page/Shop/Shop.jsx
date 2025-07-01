import React, { useState, useEffect } from 'react'
import { Search, Filter, Grid, List, Heart, Star, ShoppingCart, Eye, ChevronDown } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Shop = () => {
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [sortBy, setSortBy] = useState('featured')
    const [viewMode, setViewMode] = useState('grid')
    const [searchTerm, setSearchTerm] = useState('')
    const [priceRange, setPriceRange] = useState('all')
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [favorites, setFavorites] = useState(new Set())
    const [categories, setCategories] = useState(['All'])
    const [selectedVariants, setSelectedVariants] = useState({})
    const [loading, setLoading] = useState(false)
    const [totalProducts, setTotalProducts] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [isInitialized, setIsInitialized] = useState(false)

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, [])

    // Initialize search term from URL parameters first
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchQuery = urlParams.get('search')
        
        // Set search term and mark as initialized
        if (searchQuery) {
            setSearchTerm(searchQuery)
        } else {
            setSearchTerm('')
        }
        
        // Mark as initialized after setting search term
        setIsInitialized(true)
    }, [location.search])

    // Transform API data to match component structure
    const transformProduct = (apiProduct) => {
        const getLowestPrice = () => {
            if (apiProduct.isVarient && apiProduct.Varient && apiProduct.Varient.length > 0) {
                return Math.min(...apiProduct.Varient.map(v => v.price_after_discount || v.price))
            }
            return apiProduct.afterDiscountPrice || apiProduct.price || 0
        }

        const getOriginalPrice = () => {
            if (apiProduct.isVarient && apiProduct.Varient && apiProduct.Varient.length > 0) {
                return Math.max(...apiProduct.Varient.map(v => v.price))
            }
            return apiProduct.price || 0
        }

        const getDiscount = () => {
            if (apiProduct.isVarient && apiProduct.Varient && apiProduct.Varient.length > 0) {
                return apiProduct.Varient[0].discount_percentage || 0
            }
            return apiProduct.discount || 0
        }

        const isInStock = () => {
            if (apiProduct.isVarient && apiProduct.Varient && apiProduct.Varient.length > 0) {
                return apiProduct.Varient.some(v => v.stock_quantity > 0)
            }
            return apiProduct.stock > 0
        }

        return {
            id: apiProduct._id,
            name: apiProduct.product_name,
            brand: apiProduct.category?.name || 'Unknown',
            price: getLowestPrice(),
            originalPrice: getOriginalPrice(),
            discount: getDiscount(),
            image: apiProduct.ProductMainImage?.url || '',
            images: [
                apiProduct.ProductMainImage?.url,
                apiProduct.SecondImage?.url,
                apiProduct.ThirdImage?.url,
                apiProduct.FourthImage?.url,
                apiProduct.FifthImage?.url
            ].filter(Boolean),
            category: apiProduct.category?.name || 'Uncategorized',
            description: apiProduct.product_description,
            extra_description: apiProduct.extra_description,
            rating: apiProduct.reviews?.length > 0 
                ? apiProduct.reviews.reduce((acc, review) => acc + (review.rating || 0), 0) / apiProduct.reviews.length 
                : 4.5,
            reviews: apiProduct.reviews?.length || 0,
            isNew: new Date(apiProduct.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            colors: ['#000000', '#FFFFFF', '#FF0000'],
            inStock: isInStock(),
            variants: apiProduct.Varient || [],
            isVarient: apiProduct.isVarient,
            tag: apiProduct.tag,
            isShowOnHomeScreen: apiProduct.isShowOnHomeScreen
        }
    }

    // Search and filter products using API
    const handleSearchAndFilter = async (query = '', page = 1) => {
        try {
            setLoading(true)
            
            // Use search API if there's a query, otherwise use the original API
            let url = 'https://api.nypers.in/v1/'
            if (query && query.trim()) {
                url += `search_product_and_filter?query=${encodeURIComponent(query.trim())}&page=${page}`
            } else {
                url += `get-product?page=${page}`
            }

            console.log('Fetching from URL:', url) // Debug log

            const response = await fetch(url)
            const data = await response.json()
            
            console.log('API Response:', data) // Debug log
            
            if (data.success) {
                const transformedProducts = (data.products || data.data || []).map(transformProduct)
                setProducts(transformedProducts)
                setFilteredProducts(transformedProducts)
                setTotalProducts(data.totalProducts || transformedProducts.length)
                setTotalPages(data.totalPages || 1)
                setCurrentPage(data.currentPage || page)
                
                // Extract unique categories
                const uniqueCategories = ['All', ...new Set(transformedProducts.map(p => p.category))]
                setCategories(uniqueCategories)

                // Initialize selected variants
                const initialVariants = {}
                transformedProducts.forEach(product => {
                    if (product.isVarient && product.variants.length > 0) {
                        initialVariants[product.id] = product.variants[0]
                    }
                })
                setSelectedVariants(initialVariants)
                
                console.log('Transformed products:', transformedProducts.length) // Debug log
            } else {
                console.error('API Error:', data.message || 'Failed to fetch products')
                setProducts([])
                setFilteredProducts([])
            }
        } catch (error) {
            console.error("Error fetching products:", error)
            setProducts([])
            setFilteredProducts([])
        } finally {
            setLoading(false)
        }
    }

    // Fetch products only after initialization is complete
    useEffect(() => {
        if (isInitialized) {
            console.log('Fetching products with search term:', searchTerm) // Debug log
            handleSearchAndFilter(searchTerm, 1)
        }
    }, [searchTerm, isInitialized])

    // Apply local filters (category, price, sort) to the fetched products
    useEffect(() => {
        let filtered = [...products]

        // Filter by category
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(product => product.category === selectedCategory)
        }

        // Filter by price range
        if (priceRange !== 'all') {
            const [min, max] = priceRange.split('-').map(Number)
            filtered = filtered.filter(product => {
                const currentPrice = selectedVariants[product.id] 
                    ? (selectedVariants[product.id].price_after_discount || selectedVariants[product.id].price)
                    : product.price
                
                if (max) {
                    return currentPrice >= min && currentPrice <= max
                } else {
                    return currentPrice >= min
                }
            })
        }

        // Sort products
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => {
                    const priceA = selectedVariants[a.id] 
                        ? (selectedVariants[a.id].price_after_discount || selectedVariants[a.id].price)
                        : a.price
                    const priceB = selectedVariants[b.id] 
                        ? (selectedVariants[b.id].price_after_discount || selectedVariants[b.id].price)
                        : b.price
                    return priceA - priceB
                })
                break
            case 'price-high':
                filtered.sort((a, b) => {
                    const priceA = selectedVariants[a.id] 
                        ? (selectedVariants[a.id].price_after_discount || selectedVariants[a.id].price)
                        : a.price
                    const priceB = selectedVariants[b.id] 
                        ? (selectedVariants[b.id].price_after_discount || selectedVariants[b.id].price)
                        : b.price
                    return priceB - priceA
                })
                break
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating)
                break
            case 'newest':
                filtered.sort((a, b) => b.isNew - a.isNew)
                break
            default:
                break
        }

        setFilteredProducts(filtered)
    }, [products, selectedCategory, priceRange, sortBy, selectedVariants])

    // Handle search form submission
    const handleSearchSubmit = (e) => {
        e.preventDefault()
        // Update URL and trigger search
        const newUrl = searchTerm ? `/shop?search=${encodeURIComponent(searchTerm)}` : '/shop'
        navigate(newUrl)
    }

    // Clear search and show all products
    const clearSearch = () => {
        setSearchTerm('')
        navigate('/shop')
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

    const handleVariantChange = (productId, variant) => {
        setSelectedVariants(prev => ({
            ...prev,
            [productId]: variant
        }))
    }

    const getCurrentPrice = (product) => {
        const selectedVariant = selectedVariants[product.id]
        if (selectedVariant) {
            return selectedVariant.price_after_discount || selectedVariant.price
        }
        return product.price
    }

    const getCurrentOriginalPrice = (product) => {
        const selectedVariant = selectedVariants[product.id]
        if (selectedVariant) {
            return selectedVariant.price
        }
        return product.originalPrice
    }

    const getCurrentDiscount = (product) => {
        const selectedVariant = selectedVariants[product.id]
        if (selectedVariant) {
            return selectedVariant.discount_percentage || 0
        }
        return product.discount
    }

    const isCurrentVariantInStock = (product) => {
        const selectedVariant = selectedVariants[product.id]
        if (selectedVariant) {
            return selectedVariant.stock_quantity > 0
        }
        return product.inStock
    }

    const ProductCard = ({ product }) => {
        const currentPrice = getCurrentPrice(product)
        const currentOriginalPrice = getCurrentOriginalPrice(product)
        const currentDiscount = getCurrentDiscount(product)
        const inStock = isCurrentVariantInStock(product)

        return (
            <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200">
                {/* Product Image */}
                <div className="relative overflow-hidden bg-gray-50 rounded-t-2xl">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.isNew && (
                            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                NEW
                            </span>
                        )}
                        {currentDiscount > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                -{currentDiscount}%
                            </span>
                        )}
                        {!inStock && (
                            <span className="bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                OUT OF STOCK
                            </span>
                        )}
                    </div>

                    {/* Quick Actions */}
                    {/* <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                            onClick={() => toggleFavorite(product.id)}
                            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${favorites.has(product.id)
                                ? 'bg-red-500 text-white'
                                : 'bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white'
                                }`}
                        >
                            <Heart className="w-4 h-4" fill={favorites.has(product.id) ? 'currentColor' : 'none'} />
                        </button>
                        <button className="p-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full hover:bg-[#010101] hover:text-white transition-all duration-300">
                            <Eye className="w-4 h-4" />
                        </button>
                    </div> */}
                </div>

                {/* Product Info */}
                <div className="p-6 space-y-4">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">{product.brand}</p>
                        <Link to={`/product-page/${product.id}`} className="text-lg font-bold text-gray-900 group-hover:text-[#0d1524] transition-colors">
                            {product.name}
                        </Link>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-600">({product.reviews})</span>
                    </div>

                    {/* Variant Selection */}
                    {product.isVarient && product.variants.length > 0 && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Size:</label>
                            <select
                                value={selectedVariants[product.id]?.quantity || ''}
                                onChange={(e) => {
                                    const variant = product.variants.find(v => v.quantity === e.target.value)
                                    if (variant) {
                                        handleVariantChange(product.id, variant)
                                    }
                                }}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#010101] focus:border-transparent outline-none"
                            >
                                {product.variants.map((variant, index) => (
                                    <option key={index} value={variant.quantity}>
                                        Size - {variant.quantity} {variant.stock_quantity > 0 ? `(₹${variant.price_after_discount || variant.price})` : '(Out of Stock)'}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900">₹{currentPrice}</span>
                            {currentOriginalPrice > currentPrice && (
                                <span className="text-lg text-gray-500 line-through">₹{currentOriginalPrice}</span>
                            )}
                        </div>
                    </div>

                    {/* Stock Info for Selected Variant */}
                    {product.isVarient && selectedVariants[product.id] && (
                        <div className="text-sm text-gray-600">
                            Stock: {selectedVariants[product.id].stock_quantity} available
                        </div>
                    )}

                    {/* Add to Cart Button */}
                    <Link
                        to={`/product-page/${product.id}`} 
                        className={`w-full py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-105 ${
                            inStock 
                                ? 'bg-gray-900 text-white hover:bg-[#0d1524]' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!inStock}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        {inStock ? 'View Product' : 'Out of Stock'}
                    </Link>
                </div>
            </div>
        )
    }

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen py-12">
                <div className="container mx-auto px-6">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0d1524] mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading products...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
                        Our Shop
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Discover the perfect pair from our curated selection of premium footwear
                    </p>
                </div>

                {/* Search Results Info */}
                {searchTerm && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-800 font-medium">
                                    Search results for: "<span className="font-bold">{searchTerm}</span>"
                                </p>
                                <p className="text-[#0d1524] text-sm">
                                    Found {filteredProducts.length} products
                                </p>
                            </div>
                            <button
                                onClick={clearSearch}
                                className="text-[#0d1524] hover:text-blue-800 font-medium text-sm underline"
                            >
                                Clear search
                            </button>
                        </div>
                    </div>
                )}

                {/* Filters and Search */}
                <div className="mb-8 space-y-6">
                    {/* Search Bar */}
                    {/* <div className="relative max-w-md mx-auto">
                        <form onSubmit={handleSearchSubmit}>
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search shoes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#010101] focus:border-transparent outline-none transition-all"
                            />
                        </form>
                    </div> */}

                    {/* Filter Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {/* Category Filter */}
                            <div className="relative">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 focus:ring-2 focus:ring-[#010101] focus:border-transparent outline-none"
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Price Filter */}
                            <div className="relative">
                                <select
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(e.target.value)}
                                    className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 focus:ring-2 focus:ring-[#010101] focus:border-transparent outline-none"
                                >
                                    <option value="all">All Prices</option>
                                    <option value="0-500">Under ₹500</option>
                                    <option value="500-1000">₹500 - ₹1000</option>
                                    <option value="1000-2000">₹1000 - ₹2000</option>
                                    <option value="2000">₹2000+</option>
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Sort */}
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 focus:ring-2 focus:ring-[#010101] focus:border-transparent outline-none"
                                >
                                    <option value="featured">Featured</option>
                                    <option value="newest">Newest</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Highest Rated</option>
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>

                            {/* View Mode */}
                            <div className="flex bg-white border border-gray-200 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#010101] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#010101] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-gray-600">
                        Showing {filteredProducts.length} of {products.length} products
                    </p>
                </div>

                {/* Products Grid */}
                <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 && !loading && (
                    <div className="text-center py-16">
                        <div className="text-gray-400 mb-4">
                            <Search className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-600">
                            {searchTerm ? `No products found for "${searchTerm}"` : 'Try adjusting your filters or search term'}
                        </p>
                        {searchTerm && (
                            <button
                                onClick={clearSearch}
                                className="mt-4 px-6 py-2 bg-[#010101] text-white rounded-lg hover:bg-[#0d1524] transition-colors"
                            >
                                Show All Products
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Shop