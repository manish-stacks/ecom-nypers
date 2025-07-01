import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ChevronLeft, ChevronRight, Star, Zap, Shield, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [shoes, setShoes] = useState([])

  useEffect(() => {
    const handleFetchProduct = async () => {
      console.log("Fetching products...")
      try {
        const { data } = await axios.get('https://api.nypers.in/api/v1/get-product');
        const filteredProducts = data.products.filter(product => product.isShowOnHomeScreen === true);
        setShoes(filteredProducts);
      } catch (error) {
        console.log("Internal server error", error)
      }
    }
    handleFetchProduct()
  }, [])

  useEffect(() => {
    setIsVisible(true)
    if (shoes.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % shoes.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [shoes])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % shoes.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + shoes.length) % shoes.length)
  }

  const currentShoe = shoes[currentSlide]

  // Helper to get shoe color classes (map your colors to CSS classes)
  const getColorClass = (colors) => {
    if (!colors || colors.length === 0) return 'bg-gray-500';
    // example mapping: you might want to customize this based on your Tailwind config
    if (colors.includes('red')) return 'bg-red-500'
    if (colors.includes('blue')) return 'bg-blue-500'
    return 'bg-gray-500'
  }

  if (!currentShoe) return <div className="text-center text-white p-20">Loading products...</div>

  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-spin"
          style={{ animationDuration: '20s' }}
        ></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[85vh]">
          {/* Left content */}
          <div className={`space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-500/30">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">New Collection 2025</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-purple-300 leading-tight">
                Step Into
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  The Future
                </span>
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                Discover premium footwear that combines cutting-edge technology with timeless style. Elevate your every step.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-gray-300">Premium Quality</p>
              </div>
              <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <Truck className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-gray-300">Free Shipping</p>
              </div>
              <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-sm text-gray-300">5-Star Rated</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={`/shop/${currentShoe._id}`} className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
                <span className="relative z-10">Shop Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              {/* <button className="px-8 py-4 border-2 border-white/20 text-white font-bold rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300">
                View Collection
              </button> */}
            </div>
          </div>

          {/* Right content - Shoe showcase */}
          <div className={`relative transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
            <div className="relative">
              {/* Background gradient for current shoe */}
              <div className={`absolute inset-0 ${getColorClass(currentShoe.color)} rounded-3xl blur-3xl opacity-30 animate-pulse`}></div>

              {/* Shoe carousel */}
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 overflow-hidden">
                <div className="relative h-96 flex items-center justify-center">
                  <img
                    src={currentShoe.ProductMainImage?.url}
                    alt={currentShoe.product_name}
                    className="w-full h-full object-cover rounded-2xl transform hover:scale-105 transition-transform duration-500"
                  />

                  {/* Shoe info overlay */}
                  <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-xl p-4">
                    <h3 className="text-xl font-bold text-white mb-2">{currentShoe.product_name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-white">
                          ₹{currentShoe.Varient?.[0]?.price_after_discount ?? 'N/A'}
                        </span>
                        {currentShoe.Varient?.[0]?.price && (
                          <span className="text-lg text-gray-400 line-through">
                            ₹{currentShoe.Varient[0].price}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Slide indicators */}
              <div className="flex justify-center space-x-2 mt-6">
                {shoes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                      ? 'bg-blue-500 scale-125'
                      : 'bg-white/30 hover:bg-white/50'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
