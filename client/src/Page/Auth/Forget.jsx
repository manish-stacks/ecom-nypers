import React, { useEffect, useState } from 'react'
import { Mail, ArrowLeft, Send, CheckCircle, ShoppingBag, Shield, Clock, RefreshCw, Lock, Eye, EyeOff } from 'lucide-react'
// import { Link } from 'react-router-dom' // Commented out for demo

const Forget = () => {
    const [formData, setFormData] = useState({
        Email: '',
        newPassword: ''
    })
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [canResend, setCanResend] = useState(false)
    const [countdown, setCountdown] = useState(60)
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
        // Clear messages when user starts typing
        setErrorMessage('')
        setSuccessMessage('')
    }

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible)
    }

    const handleSubmit = async (e) => {
        // console.log("I am hit")
        e.preventDefault()
        if (!formData.Email || !formData.newPassword) return

        setIsLoading(true)
        setErrorMessage('')
        setSuccessMessage('')

        try {
            const response = await fetch('https://api.nypers.in/api/v1/Password-Change-Request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()
            
            if (response.ok) {
                console.log('API Response:', data)
                setSuccessMessage(data.msg || 'Password reset request sent successfully!')
                setIsSubmitted(true)
                startCountdown()
                
                // Redirect after success
                setTimeout(() => {
                    window.location.href = `/Verify-Otp?type=password_reset&email=${formData.Email}&changepassword=true`
                }, 1400)
            } else {
                setErrorMessage(data.message || 'Failed to send password change request. Please try again.')
            }
        } catch (error) {
            console.error('API Error:', error)
            setErrorMessage('Failed to send password change request. Please check your connection and try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const startCountdown = () => {
        setCanResend(false)
        setCountdown(60)

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer)
                    setCanResend(true)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }

    const handleResend = async () => {
        if (!formData.Email || !formData.newPassword) return
        
        setIsLoading(true)
        setErrorMessage('')
        setSuccessMessage('')

        try {
            const response = await fetch('https://api.nypers.in/api/v1/Password-Change-Request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()
            
            if (response.ok) {
                setSuccessMessage('Reset link sent again!')
                startCountdown()
            } else {
                setErrorMessage(data.message || 'Failed to resend. Please try again.')
            }
        } catch (error) {
            console.error('Resend Error:', error)
            setErrorMessage('Failed to resend. Please check your connection.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleBackToLogin = () => {
        setIsSubmitted(false)
        setFormData({ Email: '', newPassword: '' })
        setCanResend(false)
        setCountdown(60)
        setErrorMessage('')
        setSuccessMessage('')
        setPasswordVisible(false)
    }

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, [])

    return (
        <div
            className="min-h-screen relative flex items-center justify-center p-4"
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
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {isSubmitted ? 'Request Sent!' : 'Reset Password'}
                        </h1>
                        <p className="text-orange-100">
                            {isSubmitted
                                ? 'Check your email for verification'
                                : 'Enter your details to reset password'
                            }
                        </p>
                    </div>

                    {/* Form Content */}
                    <div className="p-8">
                        {isSubmitted ? (
                            // Success State
                            <div className="text-center space-y-6">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-gray-800">Request Sent!</h2>
                                    <div className="space-y-2">
                                        <p className="text-gray-600">
                                            We've sent a verification request to:
                                        </p>
                                        <p className="text-orange-600 font-semibold break-all">
                                            {formData.Email}
                                        </p>
                                    </div>

                                    {successMessage && (
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                            <p className="text-green-700 text-sm">{successMessage}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <div className="flex items-start">
                                        <Clock className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <div className="text-left">
                                            <p className="text-sm text-blue-800 font-medium">Redirecting Soon</p>
                                            <p className="text-xs text-blue-600 mt-1">
                                                You'll be redirected to verify your email shortly
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-sm text-gray-600">
                                        Didn't receive the email? Check your spam folder or
                                    </p>

                                    {canResend ? (
                                        <button
                                            onClick={handleResend}
                                            disabled={isLoading}
                                            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center justify-center"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin mr-2"></div>
                                                    Resending...
                                                </>
                                            ) : (
                                                <>
                                                    <RefreshCw className="w-4 h-4 mr-2" />
                                                    Resend Request
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                                            <p className="text-sm text-gray-600">
                                                Resend available in <span className="font-semibold text-orange-600">{countdown}s</span>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleBackToLogin}
                                    className="w-full bg-gradient-to-r from-[#e10000] to-pink-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
                                >
                                    <ArrowLeft className="w-5 h-5 mr-2" />
                                    Back to Login
                                </button>
                            </div>
                        ) : (
                            // Reset Form
                            <div className="space-y-6">
                                {/* Back to Login */}
                                <button
                                    onClick={handleBackToLogin}
                                    className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Login
                                </button>

                                {/* Instructions */}
                                <div className="text-center space-y-3">
                                    <h2 className="text-2xl font-bold text-gray-800">Reset Your Password</h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        Enter your email address and new password to reset your account.
                                    </p>
                                </div>

                                {/* Error and Success Messages */}
                                {errorMessage && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                        <p className="text-red-700 text-sm">{errorMessage}</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Email Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="email"
                                                name="Email"
                                                value={formData.Email}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#e10000] focus:border-transparent transition-all text-lg"
                                                placeholder="Enter your email address"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* New Password Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type={passwordVisible ? "text" : "password"}
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#e10000] focus:border-transparent transition-all text-lg"
                                                placeholder="Enter your new password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={togglePasswordVisibility}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {passwordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading || !formData.Email || !formData.newPassword}
                                        className="w-full bg-[#101828] text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg flex items-center justify-center"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center">
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                                Sending Request...
                                            </div>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5 mr-2" />
                                                Reset Password
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* Security Note */}
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start">
                                    <Shield className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-blue-800 font-medium">Secure Reset Process</p>
                                        <p className="text-xs text-blue-600 mt-1">
                                            Your password will be updated securely after email verification
                                        </p>
                                    </div>
                                </div>

                                {/* Alternative Options */}
                                <div className="text-center pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600 mb-3">
                                        Remember your password?
                                    </p>
                                    <a
                                        href="/login"
                                        className="text-[#e10000] hover:text-orange-600 font-semibold hover:underline transition-colors"
                                    >
                                        Sign In Instead
                                    </a>
                                </div>

                                {/* Help Section */}
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                                    <p className="text-sm text-gray-600 mb-2">
                                        Still having trouble?
                                    </p>
                                    <button className="text-[#e10000] hover:text-orange-600 font-medium text-sm hover:underline transition-colors">
                                        Contact Support
                                    </button>
                                </div>
                            </div>
                        )}
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

export default Forget