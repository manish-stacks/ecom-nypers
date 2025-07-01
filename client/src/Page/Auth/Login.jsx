import React, { useEffect, useState } from 'react'
import { Mail, Lock, Eye, EyeOff, ShoppingBag, User, ArrowRight, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
    const [formData, setFormData] = useState({
        Email: '',
        Password: '',
        rememberMe: false
    })

    const [showPassword, setShowPassword] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await axios.post('http://localhost:4000/api/v1/login', formData)
            setIsLoading(false);
            toast.success('Successfully logged in')
            sessionStorage.setItem('token_login', response.data.token);
            window.location.href = '/'
        } catch (error) {
            console.log(error)
            const data = error?.response?.data?.data
            if (error.status === 403) {
                window.location.href = `/Verify-Otp?type=register&email=${data}`
                setIsLoading(false);
            } else {
                setIsLoading(false);
                toast.error(error?.response?.data?.message)
            }

        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, [])

    if (isLoggedIn) {
        return (
            <div
                className="min-h-screen relative flex items-center justify-center p-4"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome Back!</h2>
                    <p className="text-gray-600 mb-6">You've successfully logged into Nypers. Ready to find your perfect pair?</p>
                    <div className="space-y-3">
                        <Link
                            to={'/cart'}
                            onClick={() => setIsLoggedIn(false)}
                            className="w-full bg-gradient-to-r from-[#e10000] to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center justify-center"
                        >
                            Start Shopping <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                        <Link
                            to={'/profile'}
                            onClick={() => setIsLoggedIn(false)}
                            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                        >
                            View My Account
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div
            className="min-h-screen flex items-center relative justify-center p-4"
            style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div className="absolute inset-0 bg-black/50"></div>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#e10000] to-[#e6d32b] p-8 text-center">
                        <ShoppingBag className="w-16 h-16 text-white mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-orange-100">Sign in to your Nypers account</p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <div className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        name="Email"
                                        value={formData.Email}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#e10000] focus:border-transparent transition-all text-lg"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="Password"
                                        value={formData.Password}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-11 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#e10000] focus:border-transparent transition-all text-lg"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-[#e10000] focus:ring-[#e10000] border-gray-300 rounded"
                                    />
                                    <label className="ml-2 text-sm text-gray-700">Remember me</label>
                                </div>
                                <Link
                                    to="/forget"
                                    type="button"
                                    className="text-sm text-[#e10000] hover:text-orange-600 font-medium hover:underline transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Login Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading || !formData.Email || !formData.Password}
                                className="w-full bg-[#101828] text-white py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                        Signing In...
                                    </div>
                                ) : (
                                    <>
                                        Sign In <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </button>

                            {/* Divider */}
                            {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div> */}

                            {/* Social Login Buttons */}
                            {/* <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
              </div> */}

                            {/* Security Note */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start">
                                <Shield className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-blue-800 font-medium">Secure Login</p>
                                    <p className="text-xs text-blue-600 mt-1">Your data is protected with 256-bit SSL encryption</p>
                                </div>
                            </div>

                            {/* Sign Up Link */}
                            <div className="text-center pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <Link
                                        to={'/register'}
                                        type="button"
                                        className="text-[#e10000] hover:text-orange-600 font-semibold hover:underline transition-colors"
                                    >
                                        Create Account
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Links */}
                <div className="mt-6 text-center">
                    <div className="flex justify-center space-x-6 text-sm text-white/80">
                        <button className="hover:text-white transition-colors">Help Center</button>
                        <button className="hover:text-white transition-colors">Privacy Policy</button>
                        <button className="hover:text-white transition-colors">Terms of Service</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login