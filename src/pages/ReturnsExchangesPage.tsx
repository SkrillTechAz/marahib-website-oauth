import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RotateCcw, Package, Clock, AlertCircle, CheckCircle, HelpCircle, Mail, Phone } from 'lucide-react';

const ReturnsExchangesPage: React.FC = () => {
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
              Returns & Exchanges
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Our hassle-free return and exchange policy ensures your complete satisfaction with every purchase.
            </p>
            <div className="text-sm text-gray-500">
              Last Updated: July 1, 2025
            </div>
          </motion.div>
        </div>
      </section>

      {/* Return Policy Overview */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl text-gray-900 mb-4">Return Policy Overview</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We want you to love your Marahb furniture. If you're not completely satisfied, we offer a simple return process.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-serif text-xl text-gray-900 mb-3 font-bold">30-Day Return Period</h3>
              <p className="text-gray-600 mb-4">
                Most items can be returned within 30 days of delivery for a full refund or exchange.
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Return period begins on delivery date</li>
                <li>Items must be in original condition</li>
                <li>Original packaging preferred</li>
                <li>Proof of purchase required</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                <RotateCcw className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-serif text-xl text-gray-900 mb-3 font-bold">Easy Exchange Process</h3>
              <p className="text-gray-600 mb-4">
                Prefer a different color, size, or style? We make exchanges simple.
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Same 30-day timeframe as returns</li>
                <li>Exchange for any item of equal or greater value</li>
                <li>Pay only the price difference if applicable</li>
                <li>One exchange per order</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-serif text-xl text-gray-900 mb-3 font-bold">Return Shipping</h3>
              <p className="text-gray-600 mb-4">
                We offer multiple options for returning your items.
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Free returns for defective items</li>
                <li>Return shipping fee may apply for other returns</li>
                <li>Pickup service available for large items</li>
                <li>Drop-off options for smaller items</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Return Process */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl text-gray-900 mb-4">Return Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Follow these simple steps to return or exchange your purchase.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm text-center"
            >
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="font-serif text-lg text-gray-900 mb-3 font-bold">Contact Us</h3>
              <p className="text-gray-600">
                Initiate your return by contacting our customer service team via phone, email, or your account dashboard.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-sm text-center"
            >
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="font-serif text-lg text-gray-900 mb-3 font-bold">Return Authorization</h3>
              <p className="text-gray-600">
                Receive a Return Authorization Number (RA#) and detailed return instructions via email.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-sm text-center"
            >
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="font-serif text-lg text-gray-900 mb-3 font-bold">Package & Ship</h3>
              <p className="text-gray-600">
                Securely package the item in its original packaging if possible, and ship or schedule pickup.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white p-6 rounded-lg shadow-sm text-center"
            >
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold">4</span>
              </div>
              <h3 className="font-serif text-lg text-gray-900 mb-3 font-bold">Refund Processing</h3>
              <p className="text-gray-600">
                Once we receive and inspect your return, we'll process your refund or exchange within 5-7 business days.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 bg-white p-8 rounded-lg shadow-sm"
          >
            <h3 className="font-serif text-xl text-gray-900 mb-4 font-bold">Return Shipping Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Small Items</h4>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Use our prepaid return label (fee may apply)</li>
                  <li>Drop off at any authorized shipping center</li>
                  <li>Schedule a pickup from your location</li>
                  <li>Return shipping fees deducted from refund</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Large Furniture</h4>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>We'll arrange pickup from your location</li>
                  <li className='flex items-center gap-1'>Pickup fee applies (<img src="/ed.png" className='w-[18px] inline-block' alt="" /> 150-350 depending on size)</li>
                  <li>Items must be in original condition</li>
                  <li>Disassembly may be required</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Return Conditions */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl text-gray-900 mb-4">Return Conditions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              To ensure a smooth return process, please note the following conditions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <h3 className="font-serif text-xl text-gray-900 mb-4 font-bold">Returnable Items</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">In-stock furniture</p>
                    <p className="text-sm text-gray-600">Standard furniture items from our regular inventory</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Accessories and decor</p>
                    <p className="text-sm text-gray-600">Lighting, rugs, and decorative items</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Unopened boxed items</p>
                    <p className="text-sm text-gray-600">Items with factory seals intact</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Defective products</p>
                    <p className="text-sm text-gray-600">Items with manufacturing defects or damage</p>
                  </div>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <h3 className="font-serif text-xl text-gray-900 mb-4 font-bold">Non-Returnable Items</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Custom-made furniture</p>
                    <p className="text-sm text-gray-600">Items made to your specifications</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Clearance and final sale items</p>
                    <p className="text-sm text-gray-600">Items marked as final sale or clearance</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Assembled furniture</p>
                    <p className="text-sm text-gray-600">Items that have been assembled (unless defective)</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Used or damaged items</p>
                    <p className="text-sm text-gray-600">Items showing signs of use or customer-caused damage</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 bg-gray-50 p-6 rounded-lg"
          >
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-gray-600 text-sm">
                <strong>Note:</strong> All returns are subject to inspection. Items must be in their original condition, unused, and with all original packaging and accessories. Returns that do not meet these conditions may be subject to a restocking fee or may be refused.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Refund Information */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl text-gray-900 mb-4">Refund Information</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Understanding our refund process and timeframes.
            </p>
          </motion.div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden max-w-3xl mx-auto">
            <div className="p-8">
              <h3 className="font-serif text-xl text-gray-900 mb-4 font-bold">Refund Processing</h3>
              <p className="text-gray-600 mb-6">
                Once we receive and inspect your return, we'll process your refund according to the following timeline:
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Inspection Period</h4>
                    <p className="text-gray-600">1-2 business days after receiving your return</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Refund Initiation</h4>
                    <p className="text-gray-600">1-3 business days after inspection approval</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Bank Processing</h4>
                    <p className="text-gray-600">3-10 business days for the refund to appear in your account (varies by payment method and financial institution)</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-serif text-xl text-gray-900 mb-4 font-bold">Refund Methods</h3>
                <ul className="space-y-4">
                  <li className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-600">Credit/Debit Card</span>
                    <span className="font-medium text-gray-900">Refunded to original card</span>
                  </li>
                  <li className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-600">Bank Transfer</span>
                    <span className="font-medium text-gray-900">Refunded to original account</span>
                  </li>
                  <li className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-600">Store Credit</span>
                    <span className="font-medium text-gray-900">Available immediately</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-600">Gift Card Purchases</span>
                    <span className="font-medium text-gray-900">Refunded as store credit</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-gray-600 text-sm">
                  <strong>Note:</strong> Original shipping charges are non-refundable unless the return is due to our error (such as sending the wrong item or a defective product). Return shipping costs are the customer's responsibility except for defective items.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exchange Process */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl text-gray-900 mb-4">Exchange Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              If you'd prefer to exchange your item rather than return it, we offer a simple exchange process.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="font-serif text-xl text-gray-900 mb-6 font-bold">How to Request an Exchange</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Contact Customer Service</h4>
                    <p className="text-gray-600">Reach out to our team within 30 days of delivery to initiate an exchange.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Provide Details</h4>
                    <p className="text-gray-600">Let us know your order number and which item(s) you'd like to exchange, along with your preferred replacement.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Return Original Item</h4>
                    <p className="text-gray-600">Follow the same return process to send back your original purchase.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Receive Your Exchange</h4>
                    <p className="text-gray-600">Once we receive your return, we'll process your exchange and ship the new item to you.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="font-serif text-xl text-gray-900 mb-6 font-bold">Exchange Policies</h3>
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price Differences</h4>
                <p className="text-gray-600 mb-4">
                  When exchanging for a different item:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>If the new item costs more, you'll be charged the difference</li>
                  <li>If the new item costs less, you'll receive a refund for the difference</li>
                  <li>Price adjustments will be processed using your original payment method</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Exchange Limitations</h4>
                <p className="text-gray-600 mb-4">
                  Please note the following limitations:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>One exchange per order</li>
                  <li>Exchanges subject to product availability</li>
                  <li>Custom items cannot be exchanged</li>
                  <li>Clearance and final sale items are not eligible for exchange</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-900 mb-3">Shipping for Exchanges</h4>
                <p className="text-gray-600 mb-4">
                  Shipping policies for exchanges:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Return shipping costs are the customer's responsibility</li>
                  <li>Shipping for the replacement item follows our standard shipping policies</li>
                  <li>Free shipping may apply for exchanges due to defects or errors</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Special Circumstances */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl text-gray-900 mb-4">Special Circumstances</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Information about returns and exchanges in specific situations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <h3 className="font-serif text-xl text-gray-900 mb-4 font-bold">Defective Items</h3>
              <p className="text-gray-600 mb-4">
                If you receive a defective item:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Contact us within 48 hours of delivery</li>
                <li>Provide photos of the defect</li>
                <li>We'll arrange for a replacement or repair</li>
                <li>Return shipping is free for defective items</li>
                <li>Extended 90-day return period for manufacturing defects</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <h3 className="font-serif text-xl text-gray-900 mb-4 font-bold">Damaged During Shipping</h3>
              <p className="text-gray-600 mb-4">
                If your item arrives damaged:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Note the damage on the delivery receipt</li>
                <li>Take photos of the damage and packaging</li>
                <li>Contact us within 48 hours of delivery</li>
                <li>We'll arrange for a replacement or refund</li>
                <li>You won't be responsible for return shipping</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <h3 className="font-serif text-xl text-gray-900 mb-4 font-bold">Wrong Item Received</h3>
              <p className="text-gray-600 mb-4">
                If you receive an incorrect item:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Contact us within 48 hours of delivery</li>
                <li>Provide your order number and photos of the item received</li>
                <li>We'll arrange for the correct item to be sent</li>
                <li>Return shipping for the wrong item is free</li>
                <li>You may keep the incorrect item until the replacement arrives</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <h3 className="font-serif text-xl text-gray-900 mb-4 font-bold">Gift Returns</h3>
              <p className="text-gray-600 mb-4">
                For returning gifts:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Contact us with the order number or gift receipt</li>
                <li>Returns processed without notifying the gift giver</li>
                <li>Refunds issued as store credit to the gift recipient</li>
                <li>Exchanges can be shipped to a different address</li>
                <li>Gift packaging service fees are non-refundable</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Answers to common questions about returns and exchanges.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "Can I return an item if I've assembled it?",
                answer: "Generally, assembled furniture cannot be returned unless it's defective. We recommend checking that you're satisfied with your purchase before assembly. If you discover a defect after assembly, please contact our customer service team with photos of the issue."
              },
              {
                question: "How long will it take to receive my refund?",
                answer: "After we receive and inspect your return, refunds typically take 1-3 business days to process on our end. Your bank or credit card company may then take an additional 3-10 business days to post the refund to your account, depending on their processing times."
              },
              {
                question: "Can I exchange for a different color or material?",
                answer: "Yes, you can exchange for a different color, material, or even a completely different item within the same product category. The exchange is subject to product availability and our standard 30-day return period. Price differences will be charged or refunded accordingly."
              },
              {
                question: "What if my item is on backorder when I want to exchange?",
                answer: "If your preferred exchange item is on backorder, we can either process a refund for your return or hold your return and ship the exchange when it becomes available. We'll discuss these options with you when you initiate the exchange."
              },
              {
                question: "Do I need the original packaging to return an item?",
                answer: "While original packaging is preferred to ensure the item is protected during return shipping, we understand it's not always possible to keep all packaging. Please package the item securely to prevent damage during transit. For large furniture items, we recommend keeping the original packaging until you're certain you want to keep the item."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <h3 className="font-medium text-lg text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link to="/faq" className="inline-flex items-center text-black font-medium hover:underline">
              View All FAQs
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
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
                <h3 className="font-serif text-2xl text-gray-900 mb-3 font-bold">Need Help with a Return?</h3>
                <p className="text-gray-600 mb-4">
                  Our customer service team is ready to assist you with returns and exchanges.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="tel:+97141234567" className="inline-flex items-center bg-black text-white px-6 py-3 font-medium hover:bg-gray-900 transition-colors">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Us
                  </a>
                  <a href="mailto:returns@marahb.com" className="inline-flex items-center border border-black text-black px-6 py-3 font-medium hover:bg-black hover:text-white transition-colors">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Returns Team
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReturnsExchangesPage;