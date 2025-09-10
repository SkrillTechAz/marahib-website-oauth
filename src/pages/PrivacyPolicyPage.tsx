import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.
            </p>
            <div className="text-sm text-gray-500">
              Last Updated: July 1, 2025
            </div>
          </motion.div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                <h3 className="font-serif text-xl text-gray-900 mb-4 font-bold">Contents</h3>
                <nav className="space-y-2">
                  {[
                    { id: "introduction", name: "Introduction" },
                    { id: "information-collection", name: "Information We Collect" },
                    { id: "information-use", name: "How We Use Your Information" },
                    { id: "information-sharing", name: "Information Sharing" },
                    { id: "cookies", name: "Cookies & Tracking" },
                    { id: "data-security", name: "Data Security" },
                    { id: "your-rights", name: "Your Rights" },
                    { id: "children", name: "Children's Privacy" },
                    { id: "changes", name: "Changes to This Policy" },
                    { id: "contact", name: "Contact Us" }
                  ].map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {section.name}
                    </a>
                  ))}
                </nav>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="prose prose-lg max-w-none">
                <section id="introduction" className="mb-12">
                  <h2 className="font-serif text-2xl text-gray-900 mb-4 font-bold">1. Introduction</h2>
                  <p className="text-gray-600 mb-4">
                    Marahb ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our mobile application, or make a purchase from our store.
                  </p>
                  <p className="text-gray-600">
                    Please read this Privacy Policy carefully. By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy. If you do not agree with our policies and practices, please do not use our services.
                  </p>
                </section>

                <section id="information-collection" className="mb-12">
                  <h2 className="font-serif text-2xl text-gray-900 mb-4 font-bold">2. Information We Collect</h2>
                  <p className="text-gray-600 mb-4">
                    We collect several types of information from and about users of our services, including:
                  </p>
                  <h3 className="font-medium text-gray-900 mb-2">Personal Information</h3>
                  <p className="text-gray-600 mb-4">
                    When you create an account, place an order, or engage with our services, we may collect personal information such as:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-gray-600">
                    <li>Name, email address, postal address, and phone number</li>
                    <li>Payment information (credit card numbers, billing address)</li>
                    <li>Account login credentials</li>
                    <li>Demographic information (such as your age, gender, and preferences)</li>
                  </ul>

                  <h3 className="font-medium text-gray-900 mb-2">Usage Information</h3>
                  <p className="text-gray-600 mb-4">
                    We automatically collect certain information about how you access and use our services, including:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-gray-600">
                    <li>IP address and device information</li>
                    <li>Browser type and operating system</li>
                    <li>Pages you view and links you click</li>
                    <li>Time spent on our services and referring websites</li>
                  </ul>
                </section>

                <section id="information-use" className="mb-12">
                  <h2 className="font-serif text-2xl text-gray-900 mb-4 font-bold">3. How We Use Your Information</h2>
                  <p className="text-gray-600 mb-4">
                    We use the information we collect for various purposes, including to:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-gray-600">
                    <li>Process and fulfill your orders</li>
                    <li>Create and manage your account</li>
                    <li>Provide customer service and respond to inquiries</li>
                    <li>Send transactional emails and order confirmations</li>
                    <li>Send marketing communications (with your consent)</li>
                    <li>Improve our website, products, and services</li>
                    <li>Analyze usage patterns and trends</li>
                    <li>Protect against fraudulent transactions and security risks</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </section>

                <section id="information-sharing" className="mb-12">
                  <h2 className="font-serif text-2xl text-gray-900 mb-4 font-bold">4. Information Sharing</h2>
                  <p className="text-gray-600 mb-4">
                    We may share your information with:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-gray-600">
                    <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf, such as payment processing, shipping, and customer service.</li>
                    <li><strong>Business Partners:</strong> Manufacturers, designers, and other partners with whom we collaborate to provide products and services.</li>
                    <li><strong>Legal Requirements:</strong> When required by law or to protect our rights, property, or safety, or the rights, property, or safety of others.</li>
                    <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, your information may be transferred as a business asset.</li>
                  </ul>
                  <p className="text-gray-600">
                    We do not sell your personal information to third parties for their marketing purposes without your explicit consent.
                  </p>
                </section>

                <section id="cookies" className="mb-12">
                  <h2 className="font-serif text-2xl text-gray-900 mb-4 font-bold">5. Cookies & Tracking</h2>
                  <p className="text-gray-600 mb-4">
                    We use cookies and similar tracking technologies to collect information about your browsing activities and to remember your preferences. These technologies help us understand how users interact with our services, personalize content, and improve your experience.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Types of cookies we use:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-gray-600">
                    <li><strong>Essential Cookies:</strong> Required for the operation of our website and services.</li>
                    <li><strong>Analytical/Performance Cookies:</strong> Allow us to recognize and count visitors and analyze how users navigate our website.</li>
                    <li><strong>Functionality Cookies:</strong> Enable us to remember your preferences and settings.</li>
                    <li><strong>Targeting Cookies:</strong> Record your visit to our website, the pages you visit, and the links you follow to deliver more relevant advertisements.</li>
                  </ul>
                  <p className="text-gray-600">
                    You can control cookies through your browser settings. However, disabling certain cookies may limit your ability to use some features of our services.
                  </p>
                </section>

                <section id="data-security" className="mb-12">
                  <h2 className="font-serif text-2xl text-gray-900 mb-4 font-bold">6. Data Security</h2>
                  <p className="text-gray-600 mb-4">
                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-gray-600">
                    <li>Encryption of sensitive data</li>
                    <li>Secure networks and servers</li>
                    <li>Regular security assessments</li>
                    <li>Access controls and authentication procedures</li>
                  </ul>
                  <p className="text-gray-600">
                    While we strive to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security of your data.
                  </p>
                </section>

                <section id="your-rights" className="mb-12">
                  <h2 className="font-serif text-2xl text-gray-900 mb-4 font-bold">7. Your Rights</h2>
                  <p className="text-gray-600 mb-4">
                    Depending on your location, you may have certain rights regarding your personal information, including:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-gray-600">
                    <li>The right to access and receive a copy of your personal information</li>
                    <li>The right to rectify or update inaccurate or incomplete information</li>
                    <li>The right to request deletion of your personal information</li>
                    <li>The right to restrict or object to processing of your personal information</li>
                    <li>The right to data portability</li>
                    <li>The right to withdraw consent at any time</li>
                  </ul>
                  <p className="text-gray-600">
                    To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
                  </p>
                </section>

                <section id="children" className="mb-12">
                  <h2 className="font-serif text-2xl text-gray-900 mb-4 font-bold">8. Children's Privacy</h2>
                  <p className="text-gray-600">
                    Our services are not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will delete such information from our records.
                  </p>
                </section>

                <section id="changes" className="mb-12">
                  <h2 className="font-serif text-2xl text-gray-900 mb-4 font-bold">9. Changes to This Policy</h2>
                  <p className="text-gray-600">
                    We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.
                  </p>
                </section>

                <section id="contact" className="mb-12">
                  <h2 className="font-serif text-2xl text-gray-900 mb-4 font-bold">10. Contact Us</h2>
                  <p className="text-gray-600 mb-4">
                    If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at:
                  </p>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-gray-900 font-medium mb-2">Marahb Luxury Furniture</p>
                    <p className="text-gray-600 mb-1">Email: privacy@marahb.com</p>
                    <p className="text-gray-600 mb-1">Phone: +971 (0) 4 123 4567</p>
                    <p className="text-gray-600">
                      Address: Al Wasl Road, Villa 123<br />
                      Dubai, United Arab Emirates
                    </p>
                  </div>
                </section>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Privacy Commitment */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl text-gray-900 mb-4">Our Privacy Commitment</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              At Marahb, we are committed to maintaining the trust and confidence of our visitors and customers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-8 rounded-lg shadow-sm text-center"
            >
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-serif text-xl text-gray-900 mb-3 font-bold">Data Protection</h3>
              <p className="text-gray-600">
                We implement robust security measures to protect your personal information from unauthorized access and disclosure.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-lg shadow-sm text-center"
            >
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-serif text-xl text-gray-900 mb-3 font-bold">Secure Transactions</h3>
              <p className="text-gray-600">
                All payment transactions are encrypted using industry-standard SSL technology to ensure your financial information remains secure.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-8 rounded-lg shadow-sm text-center"
            >
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-serif text-xl text-gray-900 mb-3 font-bold">Transparency</h3>
              <p className="text-gray-600">
                We are transparent about what data we collect, how we use it, and with whom we share it. You always maintain control over your information.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Policies */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl text-gray-900 mb-4">Related Policies</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Review our other policies to understand all aspects of your relationship with Marahb.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gray-50 p-6 rounded-lg"
            >
              <FileText className="w-8 h-8 text-black mb-4" />
              <h3 className="font-serif text-xl text-gray-900 mb-3 font-bold">Terms & Conditions</h3>
              <p className="text-gray-600 mb-4">
                Our terms of service governing the use of our website and services.
              </p>
              <Link to="/terms-and-conditions" className="text-black font-medium hover:underline">
                Read Terms & Conditions
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-50 p-6 rounded-lg"
            >
              <FileText className="w-8 h-8 text-black mb-4" />
              <h3 className="font-serif text-xl text-gray-900 mb-3 font-bold">Shipping Policy</h3>
              <p className="text-gray-600 mb-4">
                Details about our shipping methods, timeframes, and costs.
              </p>
              <Link to="/shipping-delivery" className="text-black font-medium hover:underline">
                Read Shipping Policy
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gray-50 p-6 rounded-lg"
            >
              <FileText className="w-8 h-8 text-black mb-4" />
              <h3 className="font-serif text-xl text-gray-900 mb-3 font-bold">Returns & Refunds</h3>
              <p className="text-gray-600 mb-4">
                Information about our return process and refund policies.
              </p>
              <Link to="/returns-exchanges" className="text-black font-medium hover:underline">
                Read Returns Policy
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;