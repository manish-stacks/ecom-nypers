import React, { useState, useEffect } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight, Verified } from 'lucide-react'
import male from './male.jpg'
import female from './female.jpeg'

const Testimonial = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const testimonials = [
    {
      id: 1,
      name: "Rohan Patel",
      location: "New Delhi, India",
      rating: 5,
      image: male,
      review: "Absolutely love my new sneakers from Nypers! The quality is outstanding and they're incredibly comfortable. I've been wearing them daily for months and they still look brand new. Customer service was also exceptional.",
      product: "Air Max Revolution Pro",
      verified: true,
      date: "2 weeks ago"
    },
    {
      id: 2,
      name: "Ankit Sharma",
      location: "Gurgaon, India",
      rating: 5,
      image: male,
      review: "I'm a fitness enthusiast and these shoes have been a game-changer for my workouts. The support and cushioning are perfect for both running and weightlifting. Nypers really knows what athletes need!",
      product: "Sport Elite Runner",
      verified: true,
      date: "1 month ago"
    },
    {
      id: 3,
      name: "Shivani Kumari",
      location: "Hyderabad, India",
      rating: 5,
      image: female,
      review: "Fast shipping, beautiful packaging, and the shoes exceeded my expectations! The style is exactly what I was looking for and they fit perfectly. Nypers has definitely earned a loyal customer.",
      product: "Urban Classic White",
      verified: true,
      date: "3 weeks ago"
    },
    {
      id: 4,
      name: "Mohan Singh",
      location: "Mumbai, India",
      rating: 5,
      image: male,
      review: "I've ordered from Nypers multiple times now and they never disappoint. The quality-to-price ratio is unbeatable, and I love how they always have the latest trends. Highly recommended!",
      product: "Street Style Black",
      verified: true,
      date: "1 week ago"
    },
    {
      id: 5,
      name: "Sneha Patel",
      location: "Ahmedabad, India",
      rating: 5,
      image: female,
      review: "The comfort level is incredible! I work long hours on my feet and these shoes provide all-day support without any discomfort. Plus, they look great with both casual and business casual outfits.",
      product: "Comfort Pro Series",
      verified: true,
      date: "2 months ago"
    }
  ]

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "4.9", label: "Average Rating" },
    { number: "99%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Customer Support" }
  ]

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isAutoPlaying, testimonials.length])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToTestimonial = (index) => {
    setCurrentTestimonial(index)
    setIsAutoPlaying(false)
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#e1000021] text-[#e10000] px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Star className="w-4 h-4 fill-current" />
            Customer Reviews
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our <span className="text-[#e10000]">Nypers</span> Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our customers have to say about their Nypers experience.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl md:text-4xl font-bold text-[#e10000] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Testimonial Carousel */}
        <div className="relative mb-12">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              
              {/* Testimonial Content */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="mb-6">
                  <Quote className="w-12 h-12 text-[#1a2431] mb-4" />
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < testimonials[currentTestimonial].rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                    "{testimonials[currentTestimonial].review}"
                  </blockquote>
                  <div className="bg-[#1a233130] rounded-2xl p-4 mb-6">
                    <p className="text-sm text-[#000000] font-semibold">
                      Purchased: {testimonials[currentTestimonial].product}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900">
                          {testimonials[currentTestimonial].name}
                        </h4>
                        {testimonials[currentTestimonial].verified && (
                          <Verified className="w-5 h-5 text-blue-500 fill-current" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {testimonials[currentTestimonial].location}
                      </p>
                      <p className="text-xs text-gray-400">
                        {testimonials[currentTestimonial].date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Image */}
              <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-8">
                <div className="absolute inset-0 bg-black/10"></div>
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="relative w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-8 border-white shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-sm font-semibold text-gray-800">Verified Customer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Testimonial Dots */}
        <div className="flex justify-center gap-3 mb-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentTestimonial
                  ? 'bg-[#e10000] w-8'
                  : 'bg-gray-300 hover:bg-[#e1000021]'
              }`}
            />
          ))}
        </div>

        {/* All Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => goToTestimonial(index)}
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <h5 className="font-semibold text-gray-900">{testimonial.name}</h5>
                    {testimonial.verified && <Verified className="w-4 h-4 text-blue-500 fill-current" />}
                  </div>
                  <p className="text-xs text-gray-500">{testimonial.location}</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">
                "{testimonial.review.substring(0, 120)}..."
              </p>
              <p className="text-xs text-[#e10000] font-semibold mt-3">
                {testimonial.product}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Join the Nypers Family?
            </h3>
            <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
              Experience the comfort, style, and quality that thousands of customers rave about. 
              Shop now and see why Nypers is the preferred choice for shoe lovers everywhere.
            </p>
            <button className="bg-white text-[#000000] font-bold py-4 px-8 rounded-2xl hover:bg-gray-100 transition-colors transform hover:scale-105">
              Shop Now & Join 50K+ Happy Customers
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Testimonial