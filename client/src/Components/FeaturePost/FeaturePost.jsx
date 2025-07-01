import React from 'react'
import left from './left.jpg'
import right from './right.jpg'
import { Link } from 'react-router-dom'

const FeaturePost = () => {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">

          {/* Men's Classic Sneakers Card */}
          <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden group cursor-pointer">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `url(${left})`,
              }}
            >
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-[#0000008c] bg-opacity-40"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-center items-center text-center text-white p-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-wide">
                CLASSIC MEN’S SNEAKERS
              </h2>
              <p className="text-sm md:text-base mb-8 max-w-md leading-relaxed opacity-90">
                Discover timeless designs and unbeatable comfort with our exclusive collection of men’s classic sneakers. Perfect for every occasion.
              </p>
              <Link to={'/shop'} className="border-2 border-white text-white px-8 py-3 font-semibold tracking-wider hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105">
                SHOP NOW
              </Link>
            </div>
          </div>

          {/* Men's Sports Sneakers Card */}
          <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden group cursor-pointer">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `url(${right})`,
              }}
            >
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-[#0000008c] bg-opacity-40"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-center items-center text-center text-white p-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-wide">
                15% OFF MEN’S SPORT SNEAKERS
              </h2>
              <p className="text-sm md:text-base mb-8 max-w-md leading-relaxed opacity-90">
                Upgrade your performance with our lightweight men’s sport sneakers. Engineered for speed, built for style—now at 15% off.
              </p>
              <Link to="/shop" className="border-2 border-white text-white px-8 py-3 font-semibold tracking-wider hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105">
                SHOP NOW
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default FeaturePost
