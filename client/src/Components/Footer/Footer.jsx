import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Phone, Mail } from 'lucide-react'; // Make sure these are installed
import logo from './logo.png'
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

const Footer = () => {
    const [setting, setSetting] = useState({})

    const handleFetchSetting = async () => {
        try {
            const { data } = await axios.get('https://www.api.nypers.in/api/v1/admin/settings')
            setSetting(data.data)
        } catch (error) {
            console.log("Internal server error", error)
        }
    }

    useEffect(() => {
        handleFetchSetting();
    })

    return (
        <div>
            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                        {/* Company Info */}
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                {/* <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-black text-xl">S</span>
                                </div>
                                <span className="text-2xl font-black">Nypers</span> */}
                                <img src={logo} className='w-20 rounded-xl' alt="Nypers" />
                            </div>
                            <p className="text-gray-400 mb-6">
                                Your premium destination for the finest footwear. Step into style, comfort, and quality.
                            </p>
                            <div className="flex gap-4">
                                {setting?.socialMediaLinks?.facebook && (
                                    <a href={setting?.socialMediaLinks?.facebook} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                )}
                                {setting?.socialMediaLinks?.instagram && (
                                    <a href={setting?.socialMediaLinks?.instagram} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                )}
                                {setting?.socialMediaLinks?.twitter && (
                                    <a href={setting?.socialMediaLinks?.twitter} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                )}
                                {setting?.socialMediaLinks?.youtube && (
                                    <a href={setting?.socialMediaLinks?.youtube} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                                        <Youtube className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
                            <ul className="space-y-3">
                                <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                                <li><a href="/shop" className="text-gray-400 hover:text-white transition-colors">Shop</a></li>
                                <li><a href="/track-your-order" className="text-gray-400 hover:text-white transition-colors">Track Your Order</a></li>
                                {/* <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Returns</a></li> */}
                            </ul>
                        </div>

                        {/* Categories */}
                        <div>
                            <h3 className="text-lg font-bold mb-6">Legal</h3>
                            <ul className="space-y-3">
                                <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Term & Condition</a></li>
                                {/* <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Casual Wear</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Formal Shoes</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Boots</a></li> */}
                            </ul>
                        </div>

                        {/* Customer Service */}
                        <div>
                            <h3 className="text-lg font-bold mb-6">Customer Service</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2 text-gray-400">
                                    <Phone className="w-4 h-4" />
                                    <span>{setting?.contactNumber}</span>
                                </li>
                                <li className="flex items-center gap-2 text-gray-400">
                                    <Mail className="w-4 h-4" />
                                    <span>{setting?.supportEmail}</span>
                                </li>
                                {/* <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Track Order</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Live Chat</a></li> */}
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-gray-400">© 2025 Nypers. All rights reserved.</p>
                            <div className="flex gap-6">
                                <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                                <a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;
