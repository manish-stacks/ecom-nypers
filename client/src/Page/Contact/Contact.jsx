import React, { useEffect, useState } from 'react'
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    MessageCircle,
    Send,
    CheckCircle,
    Instagram,
    Twitter,
    Facebook,
    Star,
    Package,
    Headphones,
    CreditCard,
    Store
} from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        Phone: '',
        message: ''
    })
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [setting, setSetting] = useState({})

    const handleFetchSetting = async () => {
        try {
            const { data } = await axios.get('http://localhost:4000/api/v1/admin/settings')
            setSetting(data.data)
        } catch (error) {
            console.log("Internal server error", error)
        }
    }

    useEffect(() => {
        handleFetchSetting();
    })

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await axios.post('http://localhost:4000/api/v1/support-request', formData)
            setIsLoading(false)
            setIsSubmitted(true)
            setFormData({
                name: '',
                email: '',
                subject: '',
                Phone: '',
                message: ''
            })
            toast.success(res.data.message)
        } catch (error) {
            console.log("Internal server error", error)
        } finally {
            setIsLoading(false)
        }
    }

    const contactMethods = [
        {
            icon: Phone,
            title: "Call Us",
            info: setting?.contactNumber,
            description: "Mon-Fri 9AM-8PM ",
            bgColor: "from-blue-500 to-blue-600"
        },
        {
            icon: Mail,
            title: "Email Support",
            info: setting?.supportEmail,
            description: "We reply within 24h",
            bgColor: "from-purple-500 to-purple-600"
        },
        {
            icon: Store,
            title: "Address",
            info: "Swarn park, mundka, delhi-110041",
            description: "Visit our store",
            bgColor: "from-green-500 to-green-600"
        },
        {
            icon: Package,
            title: "Order Status",
            info: "Track Your Order",
            description: "Real-time updates",
            bgColor: "from-orange-500 to-orange-600"
        }
    ]

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white py-20">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                        Get in <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Touch</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        We're here to help with your sneaker journey. From sizing questions to order support,
                        our team is ready to assist you every step of the way.
                    </p>
                </div>

                {/* Floating elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Contact Methods Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 -mt-8 relative z-10">
                    {contactMethods.map((method, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                            <div className={`w-14 h-14 bg-gradient-to-r ${method.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                                <method.icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{method.title}</h3>
                            <p className="text-lg font-semibold text-gray-700 mb-1">{method.info}</p>
                            <p className="text-sm text-gray-500">{method.description}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-gray-800 mb-4">Send us a Message</h2>
                                <p className="text-gray-600">
                                    Have a specific question? Fill out the form below and we'll get back to you within 24 hours.
                                </p>
                            </div>

                            {isSubmitted && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                    <p className="text-green-800 font-medium">Message sent successfully! We'll be in touch soon.</p>
                                </div>
                            )}

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone No.</label>
                                        <input
                                            type="text"
                                            name="Phone"
                                            value={formData.Phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                            placeholder="9898----"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                        >
                                            <option value="">Select a topic</option>
                                            <option value="order">Order & Shipping</option>
                                            <option value="returns">Returns & Refunds</option>
                                            <option value="product">Product Questions</option>
                                            <option value="technical">Technical Support</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="Tell us how we can help you..."
                                    ></textarea>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="w-full bg-[#101828] text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">

                        {/* Support Topics */}
                        {/* <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Help</h3>
                            <div className="space-y-4">
                                {supportTopics.map((topic, index) => (
                                    <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                                        <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <topic.icon className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-1">{topic.title}</h4>
                                            <p className="text-sm text-gray-600">{topic.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div> */}

                        {/* Business Hours */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">Business Hours</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Monday - Friday</span>
                                    <span className="font-semibold text-gray-800">9AM - 8PM EST</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Saturday</span>
                                    <span className="font-semibold text-gray-800">10AM - 6PM EST</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600">Sunday</span>
                                    <span className="font-semibold text-gray-800">12PM - 5PM EST</span>
                                </div>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Follow Us</h3>
                            <div className="flex gap-4">
                                {setting?.socialMediaLinks?.facebook && (
                                    <a href={setting?.socialMediaLinks?.facebook} className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center hover:scale-110 transition-transform">
                                        <Facebook className="w-6 h-6 text-white" />
                                    </a>
                                )}
                                {setting?.socialMediaLinks?.instagram && (
                                <a href={setting?.socialMediaLinks?.instagram} className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center hover:scale-110 transition-transform">
                                    <Instagram className="w-6 h-6 text-white" />
                                </a>
                                )}
                                {setting?.socialMediaLinks?.twitter && (
                                <a href={setting?.socialMediaLinks?.twitter} className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center hover:scale-110 transition-transform">
                                    <Twitter className="w-6 h-6 text-white" />
                                </a>
                                )}
                            </div>
                            <p className="text-gray-600 text-sm mt-4">
                                Stay updated with our latest drops and exclusive offers!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Store Locations */}
                <div className="mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Visit Our Stores</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Experience our full collection in person at one of our premium retail locations.
                        </p>
                    </div>

                    <div className='w-full h-[500px]'>
                        <iframe className='w-full h-full' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7000.724737895376!2d77.03287036203551!3d28.678804952151207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d05c13c1a1ab3%3A0x5b069b7dacb65e8e!2sSwaran%20Park%2C%20Mundka%2C%20Delhi%2C%20110041!5e0!3m2!1sen!2sin!4v1750315733405!5m2!1sen!2sin" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>

                    {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {storeLocations.map((store, index) => (
                            <div key={index} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">{store.name}</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <p className="text-gray-600">{store.address}</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                        <p className="text-gray-600 font-medium">{store.phone}</p>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <p className="text-gray-600">{store.hours}</p>
                                    </div>
                                </div>

                                <button className="w-full mt-6 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold py-3 px-4 rounded-xl hover:from-gray-900 hover:to-black transition-all duration-300">
                                    Get Directions
                                </button>
                            </div>
                        ))}
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Contact