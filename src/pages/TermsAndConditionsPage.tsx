import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, AlertCircle, HelpCircle } from 'lucide-react';

const TermsAndConditionsPage: React.FC = () => {
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
              Terms and Conditions
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Please read these terms carefully before using our website or making a purchase.
            </p>
            <div className="text-sm text-gray-500">
              Last Updated: July 1, 2025
            </div>
          </motion.div>
        </div>
      </section>

      {/* Terms Content */}
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
                    { id: "definitions", name: "Definitions" },
                    { id: "account", name: "Account Registration" },
                    { id: "orders", name: "Orders & Purchases" },
                    { id: "payment", name: "Payment Terms" },
                    { id: "shipping", name: "Shipping & Delivery" },
                    { id: "returns", name: "Returns & Refunds" },
                    { id: "intellectual-property", name: "Intellectual Property" },
                    { id: "user-content", name: "User Content" },
                    { id: "prohibited-uses", name: "Prohibited Uses" },
                    { id: "disclaimer", name: "Disclaimer of Warranties" },
                    { id: "limitation", name: "Limitation of Liability" },
                    { id: "indemnification", name: "Indemnification" },
                    { id: "termination", name: "Termination" },
                    { id: "governing-law", name: "Governing Law" },
                    { id: "changes", name: "Changes to Terms" },
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
                    Welcome to Marahb. These Terms and Conditions ("Terms") govern your access to and use of the Marahb website, mobile application, and services (collectively, the "Services").
                  </p>
                  <p className="text-gray-600">
                    By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Services.
                  </p>
                </section>

                <section id="definitions" className="mb-12">
                  <h2 className="font-serif text-2xl text-gray-900 mb-4 font-bold">2. Definitions</h2>
                  <p className="text-gray-600 mb-4">
                    Throughout these Terms, the following definitions apply:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-gray-600">
                    <li><strong>"Marahb," "we," "us," or "our"</strong> refers to Marahb Luxury Furniture LLC, a company registered in the United Arab Emirates.</li>
                    <li><strong>"You" or "your"</strong> refers to the individual or entity accessing or using our Services.</li>
                    <li><strong>"Content"</strong> refers to all text, images, videos, audio, and other materials that appear on or are available through our Services.</li>
                    <li><strong>"User Content"</strong> refers to any content that you submit, post, or display on or through our Services.</li>
                    <li><strong>"Products"</strong> refers to the furniture and home goods available for purchase through our Services.</li>
                  </ul>
                </section>

                <section id="account" className="mb-12">
                  <h2 className="font-serif text-2xl text-gray-900 mb-4 font-bold">3. Account Registration</h2>
                  <p className="text-gray-600 mb-4">
                    To access certain features of our Services, you may need to create an account. When you create an account, you agree to:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-gray-600">
                    <li>Provide accurate, current, and complete information</li>
                    <li>Maintain and promptly update your account information</li>
                    <li>Keep your password confidential and secure</li>
                    <li>Be responsible for all activities that occur under your account</li>
                    <li>Notify us immediately of any unauthorized use of your account</li>
                  </ul>
                  <p className="text-gray-600">
                    We reserve the right to suspend or terminate your account if any information provided is inaccurate, false, or no longer current, or if we believe you have violated these Terms.
                  </p>
                </section>

                <section id="orders" className="mb-12">
                  <h2 className="font-serif text-2xl text-gray-900 mb-4 font-bold">4. Orders & Purchases</h2>
                  <p className="text-gray-600 mb-4">
                    When you place an order through our Services, you are making an offer to purchase the Products. We reserve the right to accept or decline your order at our sole discretion.
                  </p>
                  <p className="text-gray-600 mb-4">
                    An order is not accepted until we send you a confirmation email. We may refuse or cancel an order for any reason, including:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-gray-600">
                    <li>Product unavailability</li>
                    <li>Errors in product descriptions or pricing</li>
                    <li>Errors in your order</li>
                    <li>Suspected fraudulent activity</li>
                  </ul>
                  <p className="text-gray-600">
                    Product colors may vary slightly from those shown on our website due to differences in display settings and lighting conditions during photography.
                  </p>
                </section>

                <section id="payment" className="mb-12">
                  <h2 className="font-serif text-2xl text-gray-900 mb-4 font-bold">5. Payment Terms</h2>
                  <p className="text-gray-600 mb-4">
                    All prices are listed in <img src="/ed.png" className='w-[16px] inline-block' alt="" /> (United Arab Emirates Dirham) and include VAT where applicable. We accept various payment methods as indicated on our checkout page.
                  </p>
                  <p className="text-gray-600 mb-4">
                    For certain large orders or custom pieces, we may require a deposit or staged payment. These terms will be clearly communicated before you complete your purchase.
                  </p>
                  <p className="text-gray-600">
                    By providing payment information, you represent and warrant that you have the legal right to use the payment method provided and that the information you supply is true and correct.
                  </p>
                </section>

                <section id="shipping" className="mb-12">
                  <h2 className="font-serif text-2xl text-gray-900 mb-4 font-bold">6. Shipping & Delivery</h2>
                  <p className="text-gray-600 mb-4">
                    Delivery times and shipping costs vary depending on the Products ordered and your location. Estimated delivery times will be provided at checkout.
                  </p>
                  <p className="text-gray-600 mb-4">
                    You are responsible for providing accurate shipping information. We are not liable for delivery delays or failures resulting from incorrect or incomplete shipping information.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Risk of loss and title for Products pass to you upon delivery to the shipping carrier. For large furniture items requiring in-home delivery, risk of loss passes when the Products are delivered to your specified location.
                  </p>
                  <p className="text-gray-600">
                    For more details, please refer to our <Link to="/shipping-delivery" className="text-black font-medium hover:underline">Shipping & Delivery Policy</Link>.
                  </p>
                </section>

                <section id="returns" className="mb-12">
                  <h2 className="font-serif text-2xl text-gray-900 mb-4 font-bold">7. Returns & Refunds</h2>
                  <p className="text-gray-600 mb-4">
                    We accept returns of most Products within 30 days of delivery, subject to our return conditions. Custom-made, personalized, or clearance items are generally not eligible for return unless defective.
                  </p>
                  <p className="text-gray-600 mb-4">
                    To be eligible for a return, Products must be:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-gray-600">
                    <li>In their original condition</li>
                    <li>Unused and unassembled</li>
                    <li>In their original packaging</li>
                    <li>Accompanied by the original receipt or proof of purchase</li>
                  </ul>
                  <p className="text-gray-600">
                    For more details, please refer to our <Link to="/returns-exchanges" className="text-black font-medium hover:underline">Returns & Exchanges Policy</Link>.
                  </p>
                </section>

                <section id="intellectual-property" className="mb-12">
                  <h2 className="font-serif text-2xl text-gray-900 mb-4 font-bold">8. Intellectual Property</h2>
                  <p className="text-gray-600 mb-4">
                    All Content on our Services, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, and software, is the property of Marahb or its content suppliers and is protected by international copyright, trademark, and other intellectual property laws.
                  </p>
                  <p className="text-gray-600 mb-4">
                    You may not use, reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any Content without our express written permission.
                  </p>
                  <p className="text-gray-600">
                    The trademarks, service marks, and logos displayed on our Services are registered and unregistered trademarks of Marahb and others. Nothing contained on our Services should be construed as granting any license or right to use any trademark without our prior written permission.
                  </p>
                </section>

                <section id="user-content" className="mb-12">
                  <h2 className="font-serif text-2xl text-gray-900 mb-4 font-bold">9. User Content</h2>
                  <p className="text-gray-600 mb-4">
                    By submitting User Content to our Services (such as product reviews, comments, or photos), you grant Marahb a non-exclusive, royalty-free, perpetual, irrevocable, and fully sublicensable right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such User Content throughout the world in any media.
                  </p>
                  <p className="text-gray-600 mb-4">
                    You represent and warrant that:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-gray-600">
                    <li>You own or control all rights to the User Content you post</li>
                    <li>The User Content is accurate and not misleading</li>
                    <li>The User Content does not violate these Terms, applicable law, or the rights of any third party</li>
                    <li>The User Content is not harmful, offensive, illegal, or otherwise objectionable</li>
                  </ul>
                  <p className="text-gray-600">
                    We reserve the right to remove any User Content at our sole discretion.
                  </p>
                </section>

                <section id="prohibited-uses" className="mb-12">
                  <h2 className="font-serif text-2xl text-gray-900 mb-4 font-bold">10. Prohibited Uses</h2>
                  <p className="text-gray-600 mb-4">
                    You agree not to use our Services:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-gray-600">
                    <li>In any way that violates any applicable law or regulation</li>
                    <li>To transmit any material that is defamatory, obscene, or offensive</li>
                    <li>To impersonate or attempt to impersonate Marahb, a Marahb employee, or any other person</li>
                    <li>To engage in any conduct that restricts or inhibits anyone's use or enjoyment of our Services</li>
                    <li>To attempt to gain unauthorized access to our Services, user accounts, or computer systems</li>
                    <li>To introduce viruses, trojans, worms, or other harmful material</li>
                    <li>To collect or track personal information of others</li>
                  </ul>
                </section>

                <section id="disclaimer" className="mb-12">
                  <h2 className="font-serif text-2xl text-gray-900 mb-4 font-bold">11. Disclaimer of Warranties</h2>
                  <p className="text-gray-600 mb-4">
                    OUR SERVICES AND PRODUCTS ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                  </p>
                  <p className="text-gray-600 mb-4">
                    WE DO NOT WARRANT THAT OUR SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT OUR SERVICES OR THE SERVER THAT MAKES IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
                  </p>
                  <p className="text-gray-600">
                    WHILE WE STRIVE TO PROVIDE ACCURATE PRODUCT DESCRIPTIONS AND INFORMATION, WE DO NOT WARRANT THAT PRODUCT DESCRIPTIONS, COLORS, OR OTHER CONTENT ON OUR SERVICES ARE ACCURATE, COMPLETE, RELIABLE, CURRENT, OR ERROR-FREE.
                  </p>
                </section>

                <section id="limitation" className="mb-12">
                  <h2 className="font-serif text-2xl text-gray-900 mb-4 font-bold">12. Limitation of Liability</h2>
                  <p className="text-gray-600 mb-4">
                    TO THE FULLEST EXTENT PERMITTED BY LAW, MARAHB SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO, DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-gray-600">
                    <li>YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE OUR SERVICES</li>
                    <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON OUR SERVICES</li>
                    <li>ANY CONTENT OBTAINED FROM OUR SERVICES</li>
                    <li>UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT</li>
                  </ul>
                  <p className="text-gray-600">
                    IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS EXCEED THE AMOUNT PAID BY YOU TO MARAHB DURING THE TWELVE (12) MONTH PERIOD PRIOR TO THE DATE THE CLAIM AROSE.
                  </p>
                </section>

                <section id="indemnification" className="mb-12">
                  <h2 className="font-serif text-2xl text-gray-900 mb-4 font-bold">13. Indemnification</h2>
                  <p className="text-gray-600">
                    You agree to indemnify, defend, and hold harmless Marahb, its affiliates, officers, directors, employees, agents, and licensors from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of our Services.
                  </p>
                </section>

                <section id="termination" className="mb-12">
                  <h2 className="font-serif text-2xl text-gray-900 mb-4 font-bold">14. Termination</h2>
                  <p className="text-gray-600 mb-4">
                    We may terminate or suspend your account and access to our Services immediately, without prior notice or liability, for any reason, including, without limitation, if you breach these Terms.
                  </p>
                  <p className="text-gray-600">
                    Upon termination, your right to use our Services will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                  </p>
                </section>

                <section id="governing-law" className="mb-12">
                  <h2 className="font-serif text-2xl text-gray-900 mb-4 font-bold">15. Governing Law</h2>
                  <p className="text-gray-600 mb-4">
                    These Terms shall be governed by and construed in accordance with the laws of the United Arab Emirates, without regard to its conflict of law provisions.
                  </p>
                  <p className="text-gray-600">
                    Any dispute arising from or relating to these Terms or your use of our Services shall be subject to the exclusive jurisdiction of the courts of Dubai, United Arab Emirates.
                  </p>
                </section>

                <section id="changes" className="mb-12">
                  <h2 className="font-serif text-2xl text-gray-900 mb-4 font-bold">16. Changes to Terms</h2>
                  <p className="text-gray-600">
                    We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the updated Terms on this page and updating the "Last Updated" date. Your continued use of our Services after any such changes constitutes your acceptance of the new Terms. If you do not agree to the revised Terms, please stop using our Services.
                  </p>
                </section>

                <section id="contact" className="mb-12">
                  <h2 className="font-serif text-2xl text-gray-900 mb-4 font-bold">17. Contact Us</h2>
                  <p className="text-gray-600 mb-4">
                    If you have any questions about these Terms, please contact us at:
                  </p>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-gray-900 font-medium mb-2">Marahb Luxury Furniture</p>
                    <p className="text-gray-600 mb-1">Email: legal@marahb.com</p>
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

      {/* Need Help */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row items-center gap-8"
            >
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-gray-900 mb-3 font-bold">Need Clarification?</h3>
                <p className="text-gray-600 mb-4">
                  If you have any questions about our Terms and Conditions or need further clarification, our customer service team is here to help.
                </p>
                <Link to="/contact" className="inline-flex items-center bg-black text-white px-6 py-3 font-medium hover:bg-gray-900 transition-colors">
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsAndConditionsPage;