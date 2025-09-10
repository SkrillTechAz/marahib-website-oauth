import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Search, Mail, Phone } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleItem = (question: string) => {
    setExpandedItems(prev => 
      prev.includes(question) 
        ? prev.filter(item => item !== question) 
        : [...prev, question]
    );
  };

  const faqCategories = [
    { id: 'all', name: 'All Questions' },
    { id: 'orders', name: 'Orders & Shipping' },
    { id: 'products', name: 'Products & Materials' },
    { id: 'returns', name: 'Returns & Refunds' },
    { id: 'account', name: 'Account & Payment' },
    { id: 'care', name: 'Product Care' },
  ];

  const faqItems: FAQItem[] = [
    // Orders & Shipping
    {
      question: "How long will it take to receive my order?",
      answer: "Delivery times vary depending on the product and your location. Standard delivery within Dubai typically takes 3-5 business days. For other Emirates and international shipping, delivery can take 7-14 business days. Custom and made-to-order pieces may require 4-8 weeks. You'll receive a more accurate delivery estimate at checkout.",
      category: "orders"
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we offer international shipping to select countries in the GCC, Middle East, and beyond. Shipping costs and delivery times vary by destination. Please note that additional customs duties and taxes may apply for international orders, which are the responsibility of the recipient.",
      category: "orders"
    },
    {
      question: "Can I track my order?",
      answer: "Yes, once your order ships, you'll receive a confirmation email with tracking information. You can also track your order by logging into your account on our website and viewing your order history.",
      category: "orders"
    },
    {
      question: "Do you offer assembly services?",
      answer: "Yes, we offer professional assembly services for most furniture items. This service can be added during checkout for an additional fee. Our skilled technicians will ensure your furniture is properly assembled and positioned according to your preferences.",
      category: "orders"
    },
    
    // Products & Materials
    {
      question: "Are your products authentic designer pieces?",
      answer: "Absolutely. All products sold on Marahb are 100% authentic designer pieces sourced directly from the original manufacturers or authorized distributors. We provide certificates of authenticity for all designer furniture.",
      category: "products"
    },
    {
      question: "Can I request fabric or material samples?",
      answer: "Yes, we offer fabric and material samples for most upholstered furniture. You can request samples through our customer service team. There may be a small fee for sample shipping, which will be credited toward your purchase if you order the item.",
      category: "products"
    },
    {
      question: "Do you offer custom furniture options?",
      answer: "Yes, many of our furniture pieces can be customized with different fabrics, finishes, and dimensions. Look for the 'Customizable' label on product pages. For bespoke furniture needs, please contact our design consultants who can assist with special orders.",
      category: "products"
    },
    {
      question: "What materials are used in your furniture?",
      answer: "We offer furniture crafted from a variety of premium materials including solid woods (oak, walnut, teak), high-grade metals, genuine leather, premium fabrics, marble, glass, and more. Each product page provides detailed information about the specific materials used.",
      category: "products"
    },
    
    // Returns & Refunds
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items in their original condition. Custom, made-to-order, and clearance items are final sale. To initiate a return, please contact our customer service team. Return shipping costs may apply unless the item is defective or was shipped incorrectly.",
      category: "returns"
    },
    {
      question: "How do I return an item?",
      answer: "To return an item, please contact our customer service team within 30 days of delivery. They will guide you through the return process and provide a return authorization number. For large furniture items, we can arrange pickup. Please keep all original packaging for returns.",
      category: "returns"
    },
    {
      question: "When will I receive my refund?",
      answer: "Once we receive and inspect your return, we'll process your refund within 5-7 business days. Refunds will be issued to the original payment method. Please note that shipping charges are non-refundable unless the return is due to our error.",
      category: "returns"
    },
    {
      question: "Can I exchange an item instead of returning it?",
      answer: "Yes, we're happy to process exchanges for items of equal or greater value (you'll be charged the difference). Please contact our customer service team to arrange an exchange. The same 30-day timeframe applies to exchanges as to returns.",
      category: "returns"
    },
    
    // Account & Payment
    {
      question: "What payment methods do you accept?",
      answer: "We accept major credit cards (Visa, Mastercard, American Express), debit cards, bank transfers, and PayPal. For orders over AED 10,000, we also offer payment plans through select banking partners.",
      category: "account"
    },
    {
      question: "Is my payment information secure?",
      answer: "Yes, we use industry-standard encryption and security protocols to protect your payment information. We are PCI DSS compliant and never store your full credit card details on our servers.",
      category: "account"
    },
    {
      question: "How do I create an account?",
      answer: "You can create an account by clicking the 'Sign Up' button in the top right corner of our website. You'll need to provide your email address and create a password. You can also create an account during the checkout process.",
      category: "account"
    },
    {
      question: "Can I place an order without creating an account?",
      answer: "Yes, we offer guest checkout for your convenience. However, creating an account allows you to track orders, save favorite items, and enjoy a faster checkout experience for future purchases.",
      category: "account"
    },
    
    // Product Care
    {
      question: "How should I care for leather furniture?",
      answer: "For leather furniture, dust regularly with a clean, dry cloth. Clean spills immediately with a slightly damp cloth, then dry thoroughly. Use a leather conditioner every 6-12 months to maintain suppleness. Keep leather furniture away from direct sunlight and heat sources to prevent drying and cracking.",
      category: "care"
    },
    {
      question: "How do I clean upholstered furniture?",
      answer: "For regular maintenance, vacuum upholstery weekly using a soft brush attachment. For spills, blot (don't rub) immediately with a clean, dry white cloth. For deeper cleaning, we recommend professional upholstery cleaning services. Always check the care label for specific instructions.",
      category: "care"
    },
    {
      question: "How should I care for wooden furniture?",
      answer: "Dust wooden furniture regularly with a soft, dry cloth. Clean with a slightly damp cloth followed by a dry cloth. Use furniture polish or wax sparingly, no more than twice a year. Protect from direct sunlight and use coasters for drinks to prevent water rings and heat damage.",
      category: "care"
    },
    {
      question: "Do you offer professional cleaning services?",
      answer: "Yes, we partner with professional furniture cleaning services in select areas. These services can be booked through our customer service team. Regular professional cleaning can extend the life of your furniture and maintain its appearance.",
      category: "care"
    }
  ];

  const filteredFAQs = faqItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

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
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Find answers to common questions about our products, ordering process, shipping, returns, and more.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                <h3 className="font-serif text-xl text-gray-900 mb-4 font-bold">Categories</h3>
                <nav className="space-y-2">
                  {faqCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        activeCategory === category.id
                          ? 'bg-black text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>

            {/* FAQ Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="space-y-6">
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(faq.question)}
                        className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="font-medium text-lg text-gray-900">{faq.question}</h3>
                        {expandedItems.includes(faq.question) ? (
                          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      
                      {expandedItems.includes(faq.question) && (
                        <div className="p-6 bg-gray-50 border-t border-gray-200">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600 mb-4">
                      We couldn't find any FAQs matching your search. Please try different keywords or browse by category.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('all');
                      }}
                      className="text-black font-medium hover:underline"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl text-gray-900 mb-4">Still Have Questions?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our customer service team is here to help. Reach out to us through any of the following channels.
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
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-serif text-xl text-gray-900 mb-3 font-bold">Email Us</h3>
              <p className="text-gray-600 mb-4">
                Send us an email and we'll get back to you within 24 hours.
              </p>
              <a href="mailto:info@marahb.com" className="text-black font-medium hover:underline">
                info@marahb.com
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-lg shadow-sm text-center"
            >
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-serif text-xl text-gray-900 mb-3 font-bold">Call Us</h3>
              <p className="text-gray-600 mb-4">
                Speak with our customer service team directly.
              </p>
              <a href="tel:+97141234567" className="text-black font-medium hover:underline">
                +971 (0) 4 123 4567
              </a>
              <p className="text-sm text-gray-500 mt-2">
                Mon-Fri: 9AM-6PM GST
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
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-gray-900 mb-3 font-bold">Live Chat</h3>
              <p className="text-gray-600 mb-4">
                Chat with our team in real-time for immediate assistance.
              </p>
              <button className="text-black font-medium hover:underline">
                Start Chat
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Available 24/7
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;