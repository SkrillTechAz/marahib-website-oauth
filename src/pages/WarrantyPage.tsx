import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Clock, CheckCircle, AlertTriangle, PenTool as Tool, HelpCircle, Mail, Phone } from 'lucide-react';

const WarrantyPage: React.FC = () => {
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
              Warranty Information
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We stand behind the quality of our products with comprehensive warranty coverage.
            </p>
            <div className="text-sm text-gray-500">
              Last Updated: July 1, 2025
            </div>
          </motion.div>
        </div>
      </section>

      {/* Warranty Overview */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl text-gray-900 mb-4">Warranty Overview</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our warranty protects you against defects in materials and workmanship, ensuring your furniture stands the test of time.
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
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-serif text-xl text-gray-900 mb-3 font-bold">Comprehensive Coverage</h3>
              <p className="text-gray-600 mb-4">
                Our warranty covers manufacturing defects in materials and workmanship under normal use.
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Structural integrity of frames</li>
                <li>Hardware and mechanical components</li>
                <li>Upholstery seams and stitching</li>
                <li>Finish and coating defects</li>
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
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-serif text-xl text-gray-900 mb-3 font-bold">Warranty Periods</h3>
              <p className="text-gray-600 mb-4">
                Different product categories have specific warranty periods:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Solid wood furniture: 5 years</li>
                <li>Upholstered furniture: 3 years</li>
                <li>Mattresses: 10 years</li>
                <li>Lighting and decor: 1 year</li>
                <li>Outdoor furniture: 2 years</li>
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
                <Tool className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-serif text-xl text-gray-900 mb-3 font-bold">Warranty Solutions</h3>
              <p className="text-gray-600 mb-4">
                If a product is found to be defective under warranty, we will:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Repair the item when possible</li>
                <li>Replace with an identical item</li>
                <li>Offer a similar item if original is unavailable</li>
                <li>Provide a refund if no solution is available</li>
                <li>Cover all shipping and service costs</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Warranty Coverage Details */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl text-gray-900 mb-4">Warranty Coverage Details</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Detailed information about what is covered and what is not covered under our warranty.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <h3 className="font-serif text-xl text-gray-900 mb-4 font-bold">What Is Covered</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Structural Defects</p>
                    <p className="text-sm text-gray-600">Frames, legs, supports, and other structural components</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Mechanical Failures</p>
                    <p className="text-sm text-gray-600">Drawers, hinges, slides, reclining mechanisms, and hardware</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Upholstery Defects</p>
                    <p className="text-sm text-gray-600">Seam separation, premature fabric wear, and cushion compression</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Finish Issues</p>
                    <p className="text-sm text-gray-600">Peeling, cracking, or bubbling of finishes under normal use</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Electrical Components</p>
                    <p className="text-sm text-gray-600">Wiring, switches, motors, and other electrical parts</p>
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
              <h3 className="font-serif text-xl text-gray-900 mb-4 font-bold">What Is Not Covered</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Normal Wear and Tear</p>
                    <p className="text-sm text-gray-600">Gradual deterioration from regular use over time</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Damage from Misuse</p>
                    <p className="text-sm text-gray-600">Damage resulting from improper use, accidents, or abuse</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Environmental Damage</p>
                    <p className="text-sm text-gray-600">Damage from exposure to extreme temperatures, humidity, or sunlight</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Improper Maintenance</p>
                    <p className="text-sm text-gray-600">Issues resulting from failure to follow care instructions</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Commercial Use</p>
                    <p className="text-sm text-gray-600">Damage resulting from use in commercial settings unless specifically sold for commercial use</p>
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
            className="mt-8 bg-gray-100 p-6 rounded-lg"
          >
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-gray-600 text-sm">
                <strong>Important:</strong> Warranty coverage begins on the date of delivery. Proof of purchase is required for all warranty claims. The warranty is non-transferable and applies only to the original purchaser.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product-Specific Warranties */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl text-gray-900 mb-4">Product-Specific Warranties</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Different product categories have specific warranty terms and coverage details.
            </p>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <h3 className="font-serif text-xl text-gray-900 mb-4 font-bold">Upholstered Furniture</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">3-Year Limited Warranty</h4>
                  <p className="text-gray-600 mb-4">
                    Our upholstered furniture warranty covers:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Frames and structural components</li>
                    <li>Springs and suspension systems</li>
                    <li>Cushion cores (against loss of resilience)</li>
                    <li>Seams, stitching, and upholstery attachment</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Fabric Coverage</h4>
                  <p className="text-gray-600 mb-4">
                    Fabric coverage details:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>1-year coverage for fabric defects</li>
                    <li>Pilling and fading from normal use not covered</li>
                    <li>Stains and soiling not covered</li>
                    <li>Extended fabric protection plans available</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <h3 className="font-serif text-xl text-gray-900 mb-4 font-bold">Solid Wood Furniture</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">5-Year Limited Warranty</h4>
                  <p className="text-gray-600 mb-4">
                    Our solid wood furniture warranty covers:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Structural integrity of frames and joints</li>
                    <li>Drawers and drawer glides</li>
                    <li>Hardware and mechanical components</li>
                    <li>Finish against peeling or cracking</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Wood Characteristics</h4>
                  <p className="text-gray-600 mb-4">
                    Natural wood characteristics not covered:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Variations in grain pattern and color</li>
                    <li>Natural expansion and contraction</li>
                    <li>Minor knots and mineral streaks</li>
                    <li>Changes in color due to aging or exposure to light</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <h3 className="font-serif text-xl text-gray-900 mb-4 font-bold">Outdoor Furniture</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">2-Year Limited Warranty</h4>
                  <p className="text-gray-600 mb-4">
                    Our outdoor furniture warranty covers:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Frames and structural components</li>
                    <li>Welds and mechanical fasteners</li>
                    <li>Finish against peeling, blistering, or cracking</li>
                    <li>Outdoor-specific hardware and mechanisms</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Outdoor Fabric Coverage</h4>
                  <p className="text-gray-600 mb-4">
                    Outdoor fabric coverage details:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>1-year coverage for fabric defects</li>
                    <li>Fading from UV exposure not covered</li>
                    <li>Mildew and weather damage not covered</li>
                    <li>Proper care and storage recommended</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How to File a Warranty Claim */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl text-gray-900 mb-4">How to File a Warranty Claim</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              If you believe your product has a defect covered by our warranty, follow these steps to file a claim.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="p-8">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Gather Information</h4>
                      <p className="text-gray-600">Collect your order number, proof of purchase, product details, and photos of the defect.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Contact Customer Service</h4>
                      <p className="text-gray-600">Reach out to our warranty department via email at warranty@marahb.com or call +971 (0) 4 123 4567.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Submit Documentation</h4>
                      <p className="text-gray-600">Send all required information and photos as requested by our warranty team.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                      <span className="text-white font-bold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Claim Review</h4>
                      <p className="text-gray-600">Our team will review your claim and may request additional information or schedule an inspection.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                      <span className="text-white font-bold text-sm">5</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Resolution</h4>
                      <p className="text-gray-600">Once approved, we'll arrange for repair, replacement, or other appropriate resolution.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600 text-sm">
                    <strong>Response Time:</strong> We strive to respond to all warranty claims within 2 business days and resolve approved claims as quickly as possible, typically within 2-3 weeks depending on the solution required.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Extended Warranty */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl text-gray-900 mb-4">Extended Warranty Protection</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              For additional peace of mind, we offer extended warranty plans that provide enhanced coverage.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <h3 className="font-serif text-xl text-gray-900 mb-4 font-bold">Premium Protection Plan</h3>
              <p className="text-gray-600 mb-4">
                Our Premium Protection Plan extends your coverage and adds additional benefits:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li>Extends manufacturer's warranty by 2-5 years</li>
                <li>Covers accidental damage</li>
                <li>Includes stain protection for upholstery</li>
                <li>Provides in-home service for repairs</li>
                <li>No deductibles or hidden fees</li>
              </ul>
              <p className="text-sm text-gray-500">
                Available for purchase at checkout. Pricing varies by product.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <h3 className="font-serif text-xl text-gray-900 mb-4 font-bold">Fabric & Leather Protection</h3>
              <p className="text-gray-600 mb-4">
                Specialized protection for upholstered furniture:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li>5-year coverage for fabric and leather upholstery</li>
                <li>Protection against food and beverage stains</li>
                <li>Coverage for ink, crayon, and makeup stains</li>
                <li>Professional cleaning service included</li>
                <li>One-time replacement if stain cannot be removed</li>
              </ul>
              <p className="text-sm text-gray-500">
                Available for upholstered items at checkout. Pricing based on furniture value.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-center"
          >
            <Link to="/extended-warranty" className="inline-flex items-center text-black font-medium hover:underline">
              Learn More About Extended Warranty Options
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Care & Maintenance */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl text-gray-900 mb-4">Care & Maintenance</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Proper care and maintenance are essential to keep your furniture in excellent condition and maintain warranty coverage.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <h3 className="font-serif text-lg text-gray-900 mb-3 font-bold">Wood Furniture Care</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Dust regularly with a soft, dry cloth</li>
                <li>Clean with a slightly damp cloth, then dry immediately</li>
                <li>Use coasters and pads to prevent heat and moisture damage</li>
                <li>Avoid direct sunlight and maintain consistent humidity</li>
                <li>Apply quality furniture polish sparingly (1-2 times per year)</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <h3 className="font-serif text-lg text-gray-900 mb-3 font-bold">Upholstery Care</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Vacuum regularly using a soft brush attachment</li>
                <li>Rotate and flip cushions regularly for even wear</li>
                <li>Blot spills immediately; do not rub</li>
                <li>Follow fabric-specific cleaning instructions</li>
                <li>Professional cleaning recommended annually</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <h3 className="font-serif text-lg text-gray-900 mb-3 font-bold">Outdoor Furniture Care</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Clean regularly with mild soap and water</li>
                <li>Use covers when furniture is not in use</li>
                <li>Store indoors during extreme weather or off-season</li>
                <li>Tighten hardware periodically</li>
                <li>Apply appropriate protectants for material type</li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <Link to="/product-care" className="inline-flex items-center text-black font-medium hover:underline">
              View Detailed Care Instructions
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
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
              Answers to common questions about our warranty coverage and claims process.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "How do I know if my issue is covered under warranty?",
                answer: "If your furniture has a defect in materials or workmanship that occurred during normal use within the warranty period, it's likely covered. Examples include broken frames, malfunctioning mechanisms, or premature fabric wear. If you're unsure, contact our warranty department with photos and a description of the issue for assessment."
              },
              {
                question: "What documentation do I need for a warranty claim?",
                answer: "You'll need your order number or proof of purchase, the product name or SKU, a detailed description of the issue, and clear photos showing the defect. For certain claims, we may also request a copy of your assembly instructions or care guidelines to verify proper use and maintenance."
              },
              {
                question: "Will I have to pay for shipping if my item needs repair?",
                answer: "No, if your item is covered under warranty, we'll cover all shipping costs associated with repair or replacement. For large items, we'll arrange for in-home service or pickup. For smaller items, we'll provide prepaid shipping labels or arrange courier pickup."
              },
              {
                question: "What happens if my product model has been discontinued?",
                answer: "If we can't repair your item and the exact model is no longer available, we'll offer a replacement with a similar item of equal or greater value. If you prefer not to accept the replacement option, we'll provide a prorated refund based on the age of the product and its original purchase price."
              },
              {
                question: "Can I purchase an extended warranty after buying my furniture?",
                answer: "Yes, extended warranty plans can be purchased within 30 days of your original purchase date. After 30 days, the furniture must be inspected by our service team before an extended warranty can be applied, and additional fees may apply for the inspection service."
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
                <h3 className="font-serif text-2xl text-gray-900 mb-3 font-bold">Warranty Support</h3>
                <p className="text-gray-600 mb-4">
                  Our dedicated warranty team is here to assist with any questions or claims.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="tel:+97141234567" className="inline-flex items-center bg-black text-white px-6 py-3 font-medium hover:bg-gray-900 transition-colors">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Warranty Team
                  </a>
                  <a href="mailto:warranty@marahb.com" className="inline-flex items-center border border-black text-black px-6 py-3 font-medium hover:bg-black hover:text-white transition-colors">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Warranty Team
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

export default WarrantyPage;