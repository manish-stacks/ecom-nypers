import React, { useState } from 'react'
import { Mail, CheckCircle } from 'lucide-react'
import bg from './bg.jpg'
import axios from 'axios'
import { toast } from 'react-toastify'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async(e) => {
    e.preventDefault()
    try {
      const response = await axios.post('https://api.nypers.in/v1/create-newsletter', { email })
      setIsSubscribed(true)
      setEmail('')
      toast.success(response.data.message)
    } catch (error) {
      console.log("Internal server error",error)
    }
  }

  return (
    <div 
      className=" flex items-center justify-center p-10 relative"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0000003f]"></div>
      
      <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20">
        {isSubscribed ? (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Thanks!</h2>
            <p className="text-gray-200">You're now subscribed to our newsletter.</p>
          </div>
        ) : (
          <div className="text-center">
            <Mail className="w-12 h-12 text-white mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Stay Updated</h1>
            <p className="text-gray-200 mb-6">Get our latest news delivered to your inbox.</p>
            
            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
              />
              <button
                onClick={handleSubmit}
                className="w-full py-3 cursor-pointer bg-[#101828] hover:bg-[#11151d] text-white font-semibold rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Newsletter