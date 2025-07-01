import React from 'react';

const Term = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-8 py-12 text-white">
          <h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-xl opacity-90">Agreement for using Nypers services</p>
          <p className="text-sm opacity-75 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="px-8 py-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to Nypers! These Terms and Conditions ("Terms") govern your use of our website, mobile application, 
              and services, operated by Nypers ("we," "us," or "our"). By accessing or using our services, you agree to 
              be bound by these Terms. If you disagree with any part of these terms, then you may not access our services.
            </p>
          </section>

          {/* Acceptance */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Acceptance of Terms</h2>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
              <p className="text-gray-700 leading-relaxed">
                By creating an account, making a purchase, or using any part of our service, you acknowledge that you 
                have read, understood, and agree to be bound by these Terms. You must be at least 18 years old to use 
                our services or have parental consent if you are a minor.
              </p>
            </div>
          </section>

          {/* Products and Services */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Products and Services</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Product Information</h3>
                <p className="text-gray-600 leading-relaxed">
                  We strive to provide accurate descriptions, images, and specifications for all our shoes. However, 
                  we do not guarantee that product descriptions, colors, or other content is accurate, complete, 
                  reliable, current, or error-free.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Availability</h3>
                <p className="text-gray-600 leading-relaxed">
                  All products are subject to availability. We reserve the right to discontinue any product at any time. 
                  Prices and availability of products are subject to change without notice.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Sizing Information</h3>
                <p className="text-gray-600 leading-relaxed">
                  We provide sizing charts and guidelines to help you select the correct shoe size. However, fit may 
                  vary between different brands and styles. We encourage customers to refer to our sizing guide and 
                  return policy for exchanges if needed.
                </p>
              </div>
            </div>
          </section>

          {/* Orders and Payment */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Orders and Payment</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Order Acceptance</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    We reserve the right to refuse or cancel any order for any reason, including availability, 
                    errors in product information, or suspected fraudulent activity.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Payment Terms</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    Payment is due at the time of purchase. We accept major credit cards, debit cards, and 
                    other approved payment methods.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Pricing</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    All prices are listed in USD and are subject to change without notice. Taxes and shipping 
                    costs will be calculated and added at checkout.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Order Confirmation</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    You will receive an order confirmation email after successful payment processing. This 
                    confirms your order has been received and is being processed.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Shipping and Delivery */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Shipping and Delivery</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Shipping times are estimates and may vary based on location and product availability
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  We are not responsible for delays caused by shipping carriers or customs processing
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Risk of loss and title for products pass to you upon delivery to the shipping carrier
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  International orders may be subject to customs duties and taxes (customer responsibility)
                </li>
              </ul>
            </div>
          </section>

          {/* Returns and Exchanges */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Returns and Exchanges</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Return Policy</h3>
                <p className="text-gray-600 leading-relaxed text-sm mb-3">
                  You may return unworn shoes in original packaging within 30 days of delivery for a full refund 
                  or exchange. Custom or personalized items are not eligible for return unless defective.
                </p>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-green-800 text-sm font-medium">
                    Return shipping is free for defective items. Customer pays return shipping for size exchanges or changes of mind.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. User Accounts</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              When you create an account with us, you must provide accurate, complete, and current information. 
              You are responsible for safeguarding your password and all activities under your account.
            </p>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <p className="text-red-800 font-medium text-sm">
                You agree to immediately notify us of any unauthorized use of your account or any other breach of security.
              </p>
            </div>
          </section>

          {/* Prohibited Uses */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Prohibited Uses</h2>
            <p className="text-gray-600 leading-relaxed mb-4">You may not use our service:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-4 h-4 text-red-500 mr-2">✗</span>
                  For any unlawful purpose or activity
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-4 h-4 text-red-500 mr-2">✗</span>
                  To violate any international, federal, provincial, or state regulations or laws
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-4 h-4 text-red-500 mr-2">✗</span>
                  To transmit or procure any harmful code or malware
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-4 h-4 text-red-500 mr-2">✗</span>
                  To infringe upon intellectual property rights
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-4 h-4 text-red-500 mr-2">✗</span>
                  To harass, abuse, or harm others
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-4 h-4 text-red-500 mr-2">✗</span>
                  To submit false or misleading information
                </div>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Intellectual Property Rights</h2>
            <p className="text-gray-600 leading-relaxed">
              The service and its original content, features, and functionality are and will remain the exclusive 
              property of Nypers and its licensors. The service is protected by copyright, trademark, and other laws. 
              Our trademarks and trade dress may not be used without our prior written consent.
            </p>
          </section>

          {/* Disclaimer */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Disclaimer</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed text-sm">
                <strong>THE INFORMATION ON THIS WEBSITE IS PROVIDED ON AN "AS IS" BASIS.</strong> To the fullest extent 
                permitted by law, Nypers excludes all representations, warranties, conditions, and terms whether express, 
                implied, statutory, or otherwise, including but not limited to warranties of merchantability, fitness for 
                a particular purpose, and non-infringement.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              In no event shall Nypers, its directors, employees, partners, agents, suppliers, or affiliates be liable 
              for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, 
              use, goodwill, or other intangible losses, resulting from your use of the service.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms shall be interpreted and governed by the laws of [Your State/Country], without regard to its 
              conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be 
              considered a waiver of those rights.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">13. Changes to Terms</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will 
                try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material 
                change will be determined at our sole discretion.
              </p>
            </div>
          </section>

          {/* Severability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">14. Severability</h2>
            <p className="text-gray-600 leading-relaxed">
              If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed 
              and interpreted to accomplish the objectives of such provision to the greatest extent possible under 
              applicable law and the remaining provisions will continue in full force and effect.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">15. Contact Information</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Nypers Legal Department</strong></p>
              <p>Email: hk9620141@gmail.com</p>
              <p>Phone: 9102989121</p>
              <p>Address: Swarn park, mundka, Delhi-110041</p>
            </div>
            <div className="mt-6 p-4 bg-white rounded border">
              <p className="text-sm text-gray-600">
                <strong>Effective Date:</strong> These terms are effective as of {new Date().toLocaleDateString()} and 
                will remain in effect except with respect to any changes in its provisions in the future, which will be 
                in effect immediately after being posted on this page.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Term;