import React, { useEffect } from 'react'
import {
  Award,
  Users,
  Globe,
  Heart,
  Target,
  Zap,
  Shield,
  Star,
  TrendingUp,
  Truck,
  RefreshCw,
  CheckCircle,
  Quote
} from 'lucide-react'
import { Link } from 'react-router-dom'

const About = () => {
  const stats = [
    { number: '500K+', label: 'Happy Customers', icon: Users },
    { number: '50+', label: 'Countries Served', icon: Globe },
    { number: '1000+', label: 'Shoe Styles', icon: Award },
    { number: '99.5%', label: 'Customer Satisfaction', icon: Star }
  ]

  const values = [
    {
      icon: Heart,
      title: 'Passion for Style',
      description: 'We believe every step should be stylish. Our curated collection reflects the latest trends and timeless classics.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Quality First',
      description: 'Every pair goes through rigorous quality checks. We partner only with trusted manufacturers and premium materials.',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'From cutting-edge designs to seamless shopping experiences, we continuously push boundaries in footwear retail.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Target,
      title: 'Customer Focus',
      description: 'Your satisfaction drives everything we do. From personalized recommendations to hassle-free returns.',
      color: 'from-green-500 to-emerald-500'
    }
  ]

  const team = [
    {
      name: 'Sarah Chen',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      bio: 'Former Nike designer with 15+ years in footwear industry'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Head of Design',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      bio: 'Award-winning designer specializing in sustainable fashion'
    },
    {
      name: 'Emma Thompson',
      role: 'Customer Experience Director',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      bio: 'Customer service expert with passion for creating memorable experiences'
    }
  ]

  const milestones = [
    { year: '2019', title: 'Nypers Founded', description: 'Started as a small online boutique with 50 premium shoe styles' },
    { year: '2020', title: 'Global Expansion', description: 'Launched international shipping to 25 countries' },
    { year: '2021', title: 'Sustainability Initiative', description: 'Introduced eco-friendly packaging and carbon-neutral shipping' },
    { year: '2022', title: '500K Milestone', description: 'Celebrated serving our 500,000th customer' },
    { year: '2023', title: 'AI-Powered Fit', description: 'Launched revolutionary size recommendation technology' },
    { year: '2024', title: 'Premium Partnerships', description: 'Exclusive collaborations with top designers and brands' }
  ]

  const features = [
    { icon: Truck, title: 'Free Shipping', description: 'On orders over ₹1500' },
    { icon: RefreshCw, title: '30-Day Returns', description: 'Hassle-free returns and exchanges' },
    { icon: CheckCircle, title: 'Authenticity Guaranteed', description: '100% authentic products only' },
    { icon: Star, title: '24/7 Support', description: 'Always here to help you' }
  ]

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  },[])

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            About <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Nypers</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Born from a passion for exceptional footwear, Nypers has revolutionized how the world shops for shoes.
            We're not just a retailer – we're curators of style, champions of quality, and believers in the power of the perfect pair.
          </p>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      {/* Story Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Our Story
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Nypers began in 2019 with a simple yet ambitious vision: to create the world's most
                  trusted destination for premium footwear. Founded by Sarah Chen, a former Nike designer,
                  our journey started in a small warehouse in Portland with just 50 carefully selected shoe styles.
                </p>
                <p>
                  What set us apart wasn't just our products – it was our obsession with the customer experience.
                  We believed that buying shoes online should be as confident and enjoyable as shopping in person.
                  This led us to develop innovative sizing technology, offer generous return policies, and build
                  a customer service team that truly cares.
                </p>
                <p>
                  Today, Nypers serves over 1,000 customers across India, but our core values remain unchanged:
                  quality, authenticity, and an unwavering commitment to helping you find your perfect pair.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-[#e1000021] rounded-3xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <Quote className="w-16 h-16 text-[#e10000] mx-auto mb-6" />
                  <blockquote className="text-2xl font-semibold text-gray-800 mb-4">
                    "Every step should tell your story. We're here to help you write it."
                  </blockquote>
                  <cite className="text-[#e10000] font-medium">- Harsh, Founder</cite>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide every decision we make, from the shoes we select to the experiences we create.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
                <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From a small startup to a global footwear destination – here's how we've grown together.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-purple-500 to-blue-500"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <div className="text-3xl font-bold text-purple-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-center w-2/12">
                    <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full border-4 border-white shadow-lg"></div>
                  </div>

                  <div className="w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind Nypers, dedicated to bringing you the best in footwear.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative inline-block mb-6">
                  <div className="w-48 h-48 mx-auto rounded-3xl overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-3 shadow-lg border border-gray-100">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-purple-600 font-semibold mb-3">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose Nypers?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We go beyond just selling shoes – we deliver experiences that exceed expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <TrendingUp className="w-16 h-16 text-purple-600 mx-auto mb-8" />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Step Up Your Style?
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Join the Nypers family and discover why hundreds of thousands of customers trust us
            with their footwear needs. Your perfect pair is waiting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-xl">
              Shop Now
            </Link>
            <Link to={"/contact"} className="border-2 border-gray-300 text-gray-700 font-bold py-4 px-8 rounded-2xl hover:border-purple-600 hover:text-purple-600 transition-all duration-300">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About