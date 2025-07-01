import React, { useState, useEffect } from 'react'
import { Search, Filter, Grid, List, Heart, Star, ShoppingCart, Eye, ChevronDown } from 'lucide-react'

const Collection = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [favorites, setFavorites] = useState(new Set())

  // Mock product data
  const mockProducts = [
    {
      id: 1,
      name: "Nike Air Max 270",
      brand: "Nike",
      price: 150,
      originalPrice: 200,
      rating: 4.8,
      reviews: 324,
      category: "Running",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      colors: ["#000", "#fff", "#ff0000"],
      sizes: [7, 8, 9, 10, 11, 12],
      isNew: true,
      discount: 25
    },
    {
      id: 2,
      name: "Adidas Ultraboost 22",
      brand: "Adidas",
      price: 180,
      originalPrice: 220,
      rating: 4.7,
      reviews: 256,
      category: "Running",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
      colors: ["#000", "#fff", "#0066cc"],
      sizes: [7, 8, 9, 10, 11],
      isNew: false,
      discount: 18
    },
    {
      id: 3,
      name: "Jordan Retro 1",
      brand: "Jordan",
      price: 170,
      originalPrice: 210,
      rating: 4.9,
      reviews: 445,
      category: "Basketball",
      image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop",
      colors: ["#ff0000", "#000", "#fff"],
      sizes: [8, 9, 10, 11, 12],
      isNew: false,
      discount: 19
    },
    {
      id: 4,
      name: "Converse Chuck Taylor",
      brand: "Converse",
      price: 65,
      originalPrice: 80,
      rating: 4.5,
      reviews: 189,
      category: "Casual",
      image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&h=400&fit=crop",
      colors: ["#000", "#fff", "#ff0000"],
      sizes: [6, 7, 8, 9, 10, 11],
      isNew: false,
      discount: 19
    },
    {
      id: 5,
      name: "Vans Old Skool",
      brand: "Vans",
      price: 60,
      originalPrice: 75,
      rating: 4.6,
      reviews: 278,
      category: "Skate",
      image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop",
      colors: ["#000", "#fff"],
      sizes: [7, 8, 9, 10, 11, 12],
      isNew: false,
      discount: 20
    },
    {
      id: 6,
      name: "New Balance 990v5",
      brand: "New Balance",
      price: 185,
      originalPrice: 220,
      rating: 4.8,
      reviews: 167,
      category: "Running",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
      colors: ["#808080", "#000", "#fff"],
      sizes: [7, 8, 9, 10, 11],
      isNew: true,
      discount: 16
    },
    {
      id: 7,
      name: "Puma Suede Classic",
      brand: "Puma",
      price: 70,
      originalPrice: 90,
      rating: 4.4,
      reviews: 203,
      category: "Casual",
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop",
      colors: ["#0066cc", "#000", "#ff0000"],
      sizes: [7, 8, 9, 10, 11, 12],
      isNew: false,
      discount: 22
    },
    {
      id: 8,
      name: "Reebok Classic Leather",
      brand: "Reebok",
      price: 75,
      originalPrice: 95,
      rating: 4.3,
      reviews: 156,
      category: "Casual",
      image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop",
      colors: ["#fff", "#000"],
      sizes: [7, 8, 9, 10, 11],
      isNew: false,
      discount: 21
    }
  ]

  const categories = ['All', 'Running', 'Basketball', 'Casual', 'Skate']
  const brands = ['All', 'Nike', 'Adidas', 'Jordan', 'Converse', 'Vans', 'New Balance', 'Puma', 'Reebok']

  useEffect(() => {
    setProducts(mockProducts)
    setFilteredProducts(mockProducts)
  }, [])

  useEffect(() => {
    let filtered = products

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by price range
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number)
      filtered = filtered.filter(product => {
        if (max) {
          return product.price >= min && product.price <= max
        } else {
          return product.price >= min
        }
      })
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        filtered.sort((a, b) => b.isNew - a.isNew)
        break
      default:
        // Keep original order for 'featured'
        break
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, searchTerm, priceRange, sortBy])

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId)
    } else {
      newFavorites.add(productId)
    }
    setFavorites(newFavorites)
  }

  const ProductCard = ({ product }) => (
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
          {product.discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => toggleFavorite(product.id)}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
              favorites.has(product.id) 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" fill={favorites.has(product.id) ? 'currentColor' : 'none'} />
          </button>
          <button className="p-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300">
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Color Options */}
        <div className="absolute bottom-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {product.colors.slice(0, 3).map((color, index) => (
            <div 
              key={index}
              className="w-6 h-6 rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-500 font-medium">{product.brand}</p>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
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

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">${product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-105">
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Our Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the perfect pair from our curated selection of premium footwear
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search shoes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="all">All Prices</option>
                  <option value="0-75">Under $75</option>
                  <option value="75-150">$75 - $150</option>
                  <option value="150-250">$150 - $250</option>
                  <option value="250">$250+</option>
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
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
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
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your filters or search term</p>
          </div>
        )}

        {/* Load More Button */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 hover:scale-105">
              Load More Products
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Collection