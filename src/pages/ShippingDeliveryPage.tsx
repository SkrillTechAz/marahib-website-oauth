import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Truck, Clock, Globe, MapPin, Package, AlertTriangle, HelpCircle, Phone, Mail } from 'lucide-react';

const ShippingDeliveryPage: React.FC = () => {
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
              Shipping & Delivery
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Information about our shipping methods, delivery timeframes, and what to expect when your order arrives.
            </p>
            <div className="text-sm text-gray-500">
              Last Updated: July 1, 2025
            </div>
          </motion.div>
        </div>
      </section>

      {/* Shipping Methods */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl text-gray-900 mb-4">Shipping Methods</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer several shipping options to meet your needs, from standard delivery to white-glove service.
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
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-serif text-xl text-gray-900 mb-3 font-bold">Standard Delivery</h3>
              <p className="text-gray-600 mb-4">
                Our standard shipping service includes delivery to your door. The carrier will contact you to schedule a delivery date.
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Delivery to your door</li>
                <li>Available for most items</li>
                <li>Tracking information provided</li>
                <li>3-7 business days within UAE</li>
              </ul>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                Free for orders over <img src="/ed.png" className='w-[16px] inline-block' alt="" /> 500
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-serif text-xl text-gray-900 mb-3 font-bold">White Glove Service</h3>
              <p className="text-gray-600 mb-4">
                Our premium delivery service includes in-room delivery, assembly, and packaging removal.
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Delivery to your room of choice</li>
                <li>Professional assembly</li>
                <li>Packaging removal</li>
                <li>Scheduled delivery window</li>
              </ul>
              <p className="text-sm text-gray-500">
                Available for an additional fee
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-serif text-xl text-gray-900 mb-3 font-bold">International Shipping</h3>
              <p className="text-gray-600 mb-4">
                We ship to select countries in the GCC, Middle East, and beyond.
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Available for most items</li>
                <li>Customs duties may apply</li>
                <li>Delivery times vary by location</li>
                <li>Tracking information provided</li>
              </ul>
              <p className="text-sm text-gray-500">
                Shipping costs calculated at checkout
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Delivery Timeframes */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl text-gray-900 mb-4">Delivery Timeframes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Estimated delivery times vary based on product availability and your location.
            </p>
          </motion.div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">In-Stock Items</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Made-to-Order</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Custom Pieces</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Dubai</td>
                    <td className="px-6 py-4 text-sm text-gray-600">3-5 business days</td>
                    <td className="px-6 py-4 text-sm text-gray-600">2-4 weeks</td>
                    <td className="px-6 py-4 text-sm text-gray-600">6-10 weeks</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Other UAE Emirates</td>
                    <td className="px-6 py-4 text-sm text-gray-600">5-7 business days</td>
                    <td className="px-6 py-4 text-sm text-gray-600">2-4 weeks</td>
                    <td className="px-6 py-4 text-sm text-gray-600">6-10 weeks</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">GCC Countries</td>
                    <td className="px-6 py-4 text-sm text-gray-600">7-14 business days</td>
                    <td className="px-6 py-4 text-sm text-gray-600">3-5 weeks</td>
                    <td className="px-6 py-4 text-sm text-gray-600">8-12 weeks</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Other International</td>
                    <td className="px-6 py-4 text-sm text-gray-600">14-21 business days</td>
                    <td className="px-6 py-4 text-sm text-gray-600">4-6 weeks</td>
                    <td className="px-6 py-4 text-sm text-gray-600">10-14 weeks</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> These timeframes are estimates and may vary due to factors such as customs clearance, remote locations, or unforeseen circumstances. You will receive more specific delivery estimates during checkout and in your order confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Costs */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl text-gray-900 mb-4">Shipping Costs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Shipping costs are calculated based on your location, the size and weight of the items, and your chosen delivery method.
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
              <h3 className="font-serif text-xl text-gray-900 mb-4 font-bold">Standard Shipping</h3>
              <ul className="space-y-4">
                <li className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center gap-1">Orders under <img src="/ed.png" className='w-[18px] inline-block' alt="" /> 500</span>
                  <span className="font-medium text-gray-900 flex items-center gap-1"><img src="/ed.png" className='w-[18px] inline-block' alt="" /> 50</span>
                </li>
                <li className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center gap-1">Orders over <img src="/ed.png" className='w-[18px] inline-block' alt="" /> 500</span>
                  <span className="font-medium text-green-600">FREE</span>
                </li>
                <li className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Other UAE Emirates</span>
                  <span className="font-medium text-gray-900 flex items-center gap-1"><img src="/ed.png" className='w-[18px] inline-block' alt="" /> 75-150</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-600">GCC Countries</span>
                  <span className="font-medium text-gray-900 flex items-center gap-1">From <img src="/ed.png" className='w-[18px] inline-block' alt="" /> 200</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <h3 className="font-serif text-xl text-gray-900 mb-4 font-bold">Premium Services</h3>
              <ul className="space-y-4">
                <li className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">White Glove Delivery</span>
                  <span className="font-medium text-gray-900 flex items-center gap-1">From <img src="/ed.png" className='w-[18px] inline-block' alt="" /> 250</span>
                </li>
                <li className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Assembly Service</span>
                  <span className="font-medium text-gray-900 flex items-center gap-1">From <img src="/ed.png" className='w-[18px] inline-block' alt="" /> 150</span>
                </li>
                <li className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Express Delivery (Dubai)</span>
                  <span className="font-medium text-gray-900 flex items-center gap-1"><img src="/ed.png" className='w-[18px] inline-block' alt="" /> 100</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-600">Scheduled Delivery Window</span>
                  <span className="font-medium text-gray-900 flex items-center gap-1"><img src="/ed.png" className='w-[18px] inline-block' alt="" /> 75</span>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 bg-gray-50 p-6 rounded-lg"
          >
            <p className="text-gray-600 text-sm">
              <strong>Note:</strong> Exact shipping costs will be calculated at checkout based on your specific order and delivery location. For oversized or specialty items, additional shipping charges may apply.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Delivery Process */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl text-gray-900 mb-4">Delivery Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Understanding our delivery process helps ensure a smooth experience from purchase to setup.
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
              <h3 className="font-serif text-lg text-gray-900 mb-3 font-bold">Order Confirmation</h3>
              <p className="text-gray-600">
                You'll receive an email confirming your order details and estimated delivery timeframe.
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
              <h3 className="font-serif text-lg text-gray-900 mb-3 font-bold">Processing & Preparation</h3>
              <p className="text-gray-600">
                We prepare your order, conduct quality checks, and package it securely for shipping.
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
              <h3 className="font-serif text-lg text-gray-900 mb-3 font-bold">Shipping Notification</h3>
              <p className="text-gray-600">
                You'll receive a shipping confirmation with tracking information when your order ships.
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
              <h3 className="font-serif text-lg text-gray-900 mb-3 font-bold">Delivery</h3>
              <p className="text-gray-600">
                Our delivery team will contact you to schedule a delivery date and time that works for you.
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
            <h3 className="font-serif text-xl text-gray-900 mb-4 font-bold">What to Expect on Delivery Day</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Standard Delivery</h4>
                <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                  <li>The carrier will deliver to your door or building entrance</li>
                  <li>You'll need to sign for the delivery</li>
                  <li>Have identification ready to verify your identity</li>
                  <li>Inspect items for visible damage before signing</li>
                  <li>You're responsible for bringing items inside and any assembly</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">White Glove Delivery</h4>
                <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                  <li>Our team will call 30-60 minutes before arrival</li>
                  <li>They'll deliver to your room of choice</li>
                  <li>Professional assembly is included</li>
                  <li>All packaging materials will be removed</li>
                  <li>You'll have time to inspect items before the team leaves</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Important Information */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl text-gray-900 mb-4">Important Information</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Additional details to ensure a smooth delivery experience.
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
              <div className="flex items-start mb-6">
                <MapPin className="w-6 h-6 text-black mr-4 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl text-gray-900 mb-3 font-bold">Delivery Access</h3>
                  <p className="text-gray-600 mb-4">
                    Please ensure there is adequate access to your delivery location. This includes:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Sufficient space for large furniture items</li>
                    <li>Elevator access for apartments above ground floor</li>
                    <li>Parking availability for delivery vehicles</li>
                    <li>Notification to building management if required</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <div className="flex items-start mb-6">
                <Clock className="w-6 h-6 text-black mr-4 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl text-gray-900 mb-3 font-bold">Delivery Rescheduling</h3>
                  <p className="text-gray-600 mb-4">
                    If you need to reschedule your delivery:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Contact us at least 48 hours before your scheduled delivery</li>
                    <li>A rescheduling fee may apply for changes with less notice</li>
                    <li>We'll work with you to find a new delivery date</li>
                    <li>Multiple reschedules may result in additional fees</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <div className="flex items-start mb-6">
                <AlertTriangle className="w-6 h-6 text-black mr-4 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl text-gray-900 mb-3 font-bold">Inspection & Damages</h3>
                  <p className="text-gray-600 mb-4">
                    When receiving your delivery:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Inspect all items carefully before signing for delivery</li>
                    <li>Note any damage on the delivery receipt</li>
                    <li>Take photos of any damage for your records</li>
                    <li>Contact us within 48 hours to report any issues</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <div className="flex items-start mb-6">
                <Package className="w-6 h-6 text-black mr-4 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl text-gray-900 mb-3 font-bold">Special Orders & Backorders</h3>
                  <p className="text-gray-600 mb-4">
                    For special orders and backordered items:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>We'll provide estimated availability timeframes</li>
                    <li>You'll be updated regularly on the status</li>
                    <li>You may choose to receive partial shipments</li>
                    <li>Cancellation policies vary for special orders</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
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
              Answers to common questions about our shipping and delivery process.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "Can I change my delivery address after placing an order?",
                answer: "Yes, you can change your delivery address as long as your order hasn't entered the shipping process. Please contact our customer service team as soon as possible with your order number and new delivery details. Changes to international shipping addresses may incur additional fees."
              },
              {
                question: "What if I'm not available during my scheduled delivery time?",
                answer: "If you're unable to be present during your scheduled delivery, you can either authorize someone else to accept the delivery on your behalf or reschedule. Please notify us at least 48 hours in advance to avoid rescheduling fees."
              },
              {
                question: "Do you deliver to apartments and high-rise buildings?",
                answer: "Yes, we deliver to apartments and high-rise buildings. For standard delivery, items will be delivered to your building's main entrance or loading dock. With white glove service, we'll deliver to your specific apartment. Please ensure you've notified your building management and secured any necessary elevator reservations."
              },
              {
                question: "How will I know when my order will be delivered?",
                answer: "You'll receive an email with tracking information when your order ships. For scheduled deliveries, our team will contact you to arrange a specific delivery date and time window. You can also track your order status through your account on our website."
              },
              {
                question: "What happens if my item arrives damaged?",
                answer: "If your item arrives damaged, please note the damage on the delivery receipt and take photos. Contact our customer service team within 48 hours, and we'll arrange for a replacement or repair. Please keep all original packaging until the issue is resolved."
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
      <section className="py-16">
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
                <h3 className="font-serif text-2xl text-gray-900 mb-3 font-bold">Need Assistance?</h3>
                <p className="text-gray-600 mb-4">
                  If you have questions about shipping or delivery, our customer service team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="tel:+97141234567" className="inline-flex items-center bg-black text-white px-6 py-3 font-medium hover:bg-gray-900 transition-colors">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Us
                  </a>
                  <a href="mailto:shipping@marahb.com" className="inline-flex items-center border border-black text-black px-6 py-3 font-medium hover:bg-black hover:text-white transition-colors">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Us
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

export default ShippingDeliveryPage;