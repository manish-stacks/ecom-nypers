import React, { useState, useEffect, useRef } from 'react'
import { ShoppingBag, ArrowLeft, Shield, Clock, RefreshCw } from 'lucide-react'

const VerifyOtp = ({ onVerificationSuccess }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [timeLeft, setTimeLeft] = useState(60) // 1 minutes in seconds
    const [canResend, setCanResend] = useState(false)
    const [isVerifying, setIsVerifying] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [isVerified, setIsVerified] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const inputRefs = useRef([])

    // Get data from URL parameters
    const location = new URLSearchParams(window.location.search)
    const email = location.get('email')
    const type = location.get('type') || 'register'
    const number = location.get('number')
    const reverify = location.get('reverify')

    // Use email from URL or fallback
    const userEmail = email || "user@example.com"

    // Timer effect
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
            return () => clearTimeout(timer)
        } else {
            setCanResend(true)
        }
    }, [timeLeft])

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, [])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return // Only allow digits

        const newOtp = [...otp]
        newOtp[index] = value

        setOtp(newOtp)
        setError('')

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
        const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''))
        setOtp(newOtp)
        
        // Focus the next empty input or the last input
        const nextIndex = Math.min(pastedData.length, 5)
        inputRefs.current[nextIndex]?.focus()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const otpString = otp.join('')
        
        if (otpString.length !== 6) {
            setError('Please enter all 6 digits')
            return
        }

        setIsVerifying(true)
        setError('')

        try {
            // Using the same API endpoint as the Otp component
            const response = await fetch('https://www.api.nypers.in/api/v1/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userEmail,
                    otp: otp, // Send as array like in the original Otp component
                    type: type
                }),
            })

            const data = await response.json()

            if (response.ok && data.token) {
                setSuccessMessage(data.message || 'Verification successful!')
                setIsVerified(true)
                
                // Store token like in the original Otp component
                sessionStorage.setItem('token_login', data.token)
                
                // Call success callback if provided
                if (onVerificationSuccess) {
                    onVerificationSuccess(data)
                } else {
                    // Default redirect behavior
                    setTimeout(() => {
                        window.location.href = '/'
                    }, 2000)
                }
            } else {
                setError(data.message || 'Verification failed. Please try again.')
            }
        } catch (error) {
            console.error('OTP verification error:', error)
            setError('Network error. Please check your connection and try again.')
        } finally {
            setIsVerifying(false)
        }
    }

    const handleResendOtp = async () => {
        setIsResending(true)
        setError('')

        try {
            // Using the same API endpoint as the Otp component
            const response = await fetch('https://www.api.nypers.in/api/v1/resend-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userEmail,
                    type: type
                }),
            })

            const data = await response.json()

            if (response.ok) {
                setTimeLeft(300)
                setCanResend(false)
                setOtp(['', '', '', '', '', ''])
                setSuccessMessage(data.msg || 'OTP has been resent to your email')
                inputRefs.current[0]?.focus()
                
                // Clear success message after 3 seconds
                setTimeout(() => setSuccessMessage(''), 3000)
            } else {
                setError(data.msg || 'Failed to resend OTP. Please try again.')
            }
        } catch (error) {
            console.error('Resend OTP error:', error)
            setError('Network error. Please check your connection and try again.')
        } finally {
            setIsResending(false)
        }
    }

    if (isVerified) {
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
                        <Shield className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        {type === 'register' ? 'Account Verified!' : 'Password Reset Complete!'}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {successMessage || (type === 'register' 
                            ? 'Your account has been verified successfully. Welcome to Nypers!' 
                            : 'Your password has been reset successfully. You can now log in with your new password.'
                        )}
                    </p>
                    <button
                        onClick={() => {
                            setIsVerified(false)
                            // Navigate based on type
                            if (type === 'register') {
                                // Redirect to dashboard or home
                                window.location.href = '/'
                            } else {
                                // Redirect to login for password reset
                                window.location.href = '/login'
                            }
                        }}
                        className="inline-block w-full bg-gradient-to-r from-[#e10000] to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105"
                    >
                        {type === 'register' ? 'Continue Shopping' : 'Go to Login'}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div
            className="min-h-screen py-12 px-4 relative"
            style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div className="absolute inset-0 bg-black/50"></div>

            <div className="relative z-10 max-w-lg mx-auto">
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#e10000] to-[#e6d32b] p-8 text-center">
                        <Shield className="w-16 h-16 text-white mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {type === 'register' ? 'Verify Your Account' : 'Reset Your Password'}
                        </h1>
                        <p className="text-orange-100">
                            {type === 'register' 
                                ? 'We\'ve sent a 6-digit code to your email' 
                                : 'Enter the code sent to your email to reset your password'
                            }
                        </p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        {/* Back Button */}
                        <button 
                            onClick={() => window.history.back()}
                            className="inline-flex items-center text-[#e10000] hover:text-orange-600 mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to {type === 'register' ? 'Registration' : 'Login'}
                        </button>

                        <div className="space-y-6">
                            {/* Email Display */}
                            <div className="text-center mb-6">
                                <p className="text-gray-600">
                                    {type === 'register' 
                                        ? 'Enter the verification code sent to' 
                                        : 'Enter the password reset code sent to'
                                    }
                                </p>
                                <p className="text-lg font-semibold text-gray-800 break-all">{userEmail}</p>
                                {number && (
                                    <p className="text-sm text-gray-500 mt-1">Phone: {number}</p>
                                )}
                                {reverify && (
                                    <p className="text-sm text-orange-600 mt-2 font-medium">
                                        Re-verification required
                                    </p>
                                )}
                            </div>

                            {/* OTP Input */}
                            <div className="space-y-4">
                                <label className="block text-lg font-semibold text-gray-800 text-center">
                                    Enter 6-Digit Code
                                </label>
                                
                                <div className="flex justify-center space-x-3">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={el => inputRefs.current[index] = el}
                                            type="text"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            onPaste={handlePaste}
                                            className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#e10000] focus:border-[#e10000] transition-all"
                                            placeholder="0"
                                        />
                                    ))}
                                </div>

                                {error && (
                                    <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
                                        {error}
                                    </div>
                                )}

                                {successMessage && (
                                    <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg border border-green-200">
                                        {successMessage}
                                    </div>
                                )}
                            </div>

                            {/* Timer and Resend */}
                            <div className="text-center space-y-3">
                                <div className="flex items-center justify-center text-gray-600">
                                    <Clock className="w-4 h-4 mr-2" />
                                    <span>Code expires in {formatTime(timeLeft)}</span>
                                </div>

                                {canResend ? (
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={isResending}
                                        className="inline-flex items-center text-[#e10000] hover:text-orange-600 font-semibold transition-colors disabled:opacity-50"
                                    >
                                        <RefreshCw className={`w-4 h-4 mr-2 ${isResending ? 'animate-spin' : ''}`} />
                                        {isResending ? 'Sending...' : 'Resend Code'}
                                    </button>
                                ) : (
                                    <p className="text-gray-500">Didn't receive the code? Wait for the timer to resend</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={otp.join('').length !== 6 || isVerifying}
                                className="w-full bg-[#101828] text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg flex items-center justify-center"
                            >
                                {isVerifying ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Verifying...
                                    </>
                                ) : (
                                    type === 'register' ? 'Verify & Continue' : 'Reset Password'
                                )}
                            </button>
                        </div>

                        {/* Help Text */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Having trouble? <span className="text-[#e10000] hover:underline font-semibold cursor-pointer">Contact Support</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VerifyOtp