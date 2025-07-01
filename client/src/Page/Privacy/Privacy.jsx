import React from 'react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-8 py-12 text-white">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl opacity-90">Your privacy matters to us at Nypers</p>
          <p className="text-sm opacity-75 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="px-8 py-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              At Nypers, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our 
              website, make a purchase, or interact with our services. By using our services, you agree to the collection 
              and use of information in accordance with this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Information We Collect</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Personal Information</h3>
                <p className="text-gray-600 leading-relaxed">
                  When you make a purchase or create an account with Nypers, we may collect personal information including 
                  your name, email address, phone number, billing and shipping addresses, and payment information.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Usage Information</h3>
                <p className="text-gray-600 leading-relaxed">
                  We automatically collect information about how you interact with our website, including your IP address, 
                  browser type, device information, pages visited, and time spent on our site.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Cookies and Tracking Technologies</h3>
                <p className="text-gray-600 leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, 
                  and personalize content and advertisements.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">How We Use Your Information</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Process and fulfill your shoe orders and handle returns or exchanges
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Communicate with you about your orders, account, and customer service inquiries
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Send you promotional emails about new shoe collections and special offers (with your consent)
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Improve our website functionality and customer experience
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Analyze shopping patterns to better understand customer preferences
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Comply with legal obligations and prevent fraudulent activities
                </li>
              </ul>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Information Sharing and Disclosure</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
            </p>
            <div className="space-y-3 text-gray-600">
              <p><strong>Service Providers:</strong> We work with trusted third-party companies that help us operate our business, such as payment processors, shipping companies, and marketing services.</p>
              <p><strong>Legal Requirements:</strong> We may disclose your information if required by law or to protect our rights, property, or safety.</p>
              <p><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.</p>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Data Security</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. This includes encryption of sensitive data, 
                secure servers, and regular security assessments. However, no method of transmission over the internet or 
                electronic storage is 100% secure.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Privacy Rights</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-semibold text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Access your personal information</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-semibold text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Update or correct your information</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-semibold text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Request deletion of your data</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-semibold text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Opt-out of marketing communications</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-semibold text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Restrict processing of your data</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-semibold text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Data portability</span>
                </div>
              </div>
            </div>
          </section>

          {/* Cookies Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cookies Policy</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our website uses cookies to improve your shopping experience. Cookies help us remember your preferences, 
              keep items in your shopping cart, and provide personalized recommendations for shoes that match your style.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You can control cookies through your browser settings, but disabling cookies may affect some website functionality.
            </p>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Third-Party Links</h2>
            <p className="text-gray-600 leading-relaxed">
              Our website may contain links to third-party websites or services. We are not responsible for the privacy 
              practices or content of these external sites. We encourage you to review the privacy policies of any 
              third-party sites you visit.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Children's Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal 
              information from children under 13. If you are a parent or guardian and believe your child has provided 
              us with personal information, please contact us immediately.
            </p>
          </section>

          {/* Updates to Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Updates to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
              We will notify you of any material changes by posting the updated policy on our website and updating the 
              "Last Updated" date at the top of this page.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Nypers Customer Privacy Team</strong></p>
              <p>Email: hk9620141@gmail.com</p>
              <p>Phone: 9102989121</p>
              <p>Address: Swarn park, mundka, Delhi-110041</p>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              We are committed to resolving any privacy concerns within 30 days of receiving your inquiry.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;