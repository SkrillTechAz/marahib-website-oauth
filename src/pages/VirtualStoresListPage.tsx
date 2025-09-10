import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Bell, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { virtualStores } from '../data/virtualStores';

const VirtualStoresListPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background Content - Blurred */}
      <div className="absolute inset-0">
        <div className="py-12 bg-gray-50 filter blur-sm opacity-30">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h1 className="font-serif text-4xl md:text-5xl mb-4 text-gray-900">Explore Virtual Stores</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Experience our furniture collections in immersive 3D environments. Browse different 
                styles and visualize how our pieces work together in realistic settings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {virtualStores.map((store) => (
                <div key={store.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={store.image} 
                      alt={store.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-stone-600/90 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      360° Tour
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-medium text-xl mb-2 text-gray-900">{store.name}</h3>
                    <p className="text-gray-600 mb-4">{store.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="ml-1 font-medium">{store.rating}</span>
                        <span className="ml-1 text-gray-500 text-sm">({store.reviews} reviews)</span>
                      </div>
                      <span className="text-sm font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                        {store.style}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Overlay Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center"
          >
            {/* Floating Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-stone-600 to-stone-800 rounded-full mb-8 shadow-2xl"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-serif text-4xl md:text-6xl text-gray-900 mb-6"
            >
              Virtual Stores
              <br />
              <span className="bg-gradient-to-r from-stone-600 to-stone-800 bg-clip-text text-transparent">
                Coming Soon
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-600 mb-12 leading-relaxed max-w-xl mx-auto"
            >
              Experience luxury furniture in immersive 3D environments. 
              Walk through virtual showrooms and visualize pieces in your space.
            </motion.p>

            {/* Email Subscription Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-gray-200/50 max-w-md mx-auto"
            >
              {!isSubmitted ? (
                <div>
                  <div className="flex items-center justify-center mb-6">
                    <Bell className="w-6 h-6 text-stone-600 mr-3" />
                    <h3 className="font-medium text-gray-900 text-lg">Get Early Access</h3>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-all duration-300 bg-white/90 text-gray-900 placeholder-gray-500"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-stone-700 to-stone-800 hover:from-stone-800 hover:to-stone-900 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      <span>Notify Me When Available</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </form>

                  <p className="text-sm text-gray-500 mt-4">
                    Be the first to explore our virtual showrooms
                  </p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h3 className="font-medium text-gray-900 text-lg mb-2">Perfect!</h3>
                  <p className="text-gray-600">We'll notify you when virtual stores launch.</p>
                </motion.div>
              )}
            </motion.div>

            {/* Features Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              {[
                { icon: Eye, title: '360° Tours', desc: 'Immersive virtual experiences' },
                { icon: Sparkles, title: 'Interactive Design', desc: 'Touch and explore furniture' },
                { icon: Bell, title: 'Real-time Updates', desc: 'Latest collections first' }
              ].map((feature, index) => (
                <div key={feature.title} className="text-center">
                  <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <feature.icon className="w-6 h-6 text-stone-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VirtualStoresListPage;