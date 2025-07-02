import { Award, RotateCcw, Shield, Truck } from 'lucide-react'
import React from 'react'

const Features = () => {
  return (
    <>
      {/* Features Section */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                                <Truck className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Free Shipping</h3>
                            <p className="text-gray-600">Free shipping on all orders over ₹500</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                                <RotateCcw className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Easy Returns</h3>
                            <p className="text-gray-600">5-day hassle-free return policy</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                                <Shield className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Payment</h3>
                            <p className="text-gray-600">Your payment information is safe</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                                <Award className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Premium Quality</h3>
                            <p className="text-gray-600">Only the finest materials and craftsmanship</p>
                        </div>
                    </div>
                </div>
            </section>
    </>
  )
}

export default Features
