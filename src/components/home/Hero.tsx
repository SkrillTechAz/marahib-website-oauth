import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Star, Heart, ShoppingCart, User, Package, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { featuredProducts } from '../../data/products';
import { designerRoomStyles } from '../../data/roomStyles';
import StyleQuiz from '../quiz/StyleQuiz';

const Hero: React.FC = () => {
  const [showQuiz, setShowQuiz] = useState(false);

  // Premium furniture brands with harmonized black and white styling
  const trustBrands = [
    { 
      name: 'West Elm', 
      logo: 'WE',
      color: '#000000',
      bgColor: '#FFFFFF'
    },
    { 
      name: 'CB2', 
      logo: 'CB2',
      color: '#000000',
      bgColor: '#FFFFFF'
    },
    { 
      name: 'Article', 
      logo: 'ART',
      color: '#FFFFFF',
      bgColor: '#000000'
    },
    { 
      name: 'Floyd', 
      logo: 'FLD',
      color: '#000000',
      bgColor: '#FFFFFF'
    },
    { 
      name: 'Herman Miller', 
      logo: 'HM',
      color: '#000000',
      bgColor: '#FFFFFF'
    },
    { 
      name: 'Schoolhouse', 
      logo: 'SH',
      color: '#000000',
      bgColor: '#F5F5DC'
    },
    { 
      name: 'Restoration Hardware', 
      logo: 'RH',
      color: '#000000',
      bgColor: '#F5F5DC'
    },
    { 
      name: 'Design Within Reach', 
      logo: 'DWR',
      color: '#000000',
      bgColor: '#FFFFFF'
    }
  ];

  return (
    <section className="relative bg-white">
      <div className="min-h-[600px] md:min-h-[700px] relative">
        <div className="container-custom h-full flex items-center relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left Content */}
            <div className="max-w-xl">
              <motion.div
                className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-gray-700 font-medium text-sm tracking-wide uppercase">Curated Living</span>
              </motion.div>

              <motion.h1 
                className="font-didot text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 text-gray-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Discover the Art
                <br />
                of Refined Living
              </motion.h1>

              <motion.p 
                className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
               Luxury furniture and home accents, handpicked to reflect your personal style and Gulf heritage.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <button 
                  onClick={() => setShowQuiz(true)} 
                  className="btn-primary"
                >
                  <Sparkles size={18} className="mr-2" />
                  Take Style Quiz
                </button>

                <Link 
                  to="/category/all"
                  className="btn-secondary"
                >
                  Explore Collections
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </motion.div>

              <motion.div
                className="flex items-center space-x-8 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="text-gray-600 text-sm">
                  <span className="text-black font-semibold text-lg">10,000+</span>
                  <br />
                  Happy Customers
                </div>
                <div className="text-gray-600 text-sm">
                  <span className="text-black font-semibold text-lg">500+</span>
                  <br />
                  Design Partners
                </div>
              </motion.div>
            </div>

            {/* Right Content - Hero Image */}
            <motion.div 
              className="hidden lg:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg" 
                  alt="Luxury living room" 
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute bottom-6 left-6 bg-white p-4 shadow-lg">
                  <p className="text-sm font-medium text-gray-900 mb-1">Featured Collection</p>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Modern Minimalist</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Premium Brands Section - Harmonized Black & White */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="w-full bg-gray-50 border-t border-gray-200 py-12"
      >
        <div className="container-custom">
          <div className="text-center mb-8">
            <p className="text-xs text-gray-500 mb-6 uppercase tracking-[0.2em] font-medium">
              Featuring Premium Brands
            </p>
          </div>
          
          <div className="relative overflow-hidden">
            <motion.div 
              className="grid grid-cols-4 md:grid-cols-8 gap-6 items-center justify-items-center max-w-6xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {trustBrands.map((brand, index) => (
                <motion.div
                  key={brand.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  className="flex flex-col items-center group cursor-pointer w-full"
                >
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg border border-gray-200"
                    style={{ 
                      backgroundColor: brand.bgColor,
                      color: brand.color
                    }}
                  >
                    {brand.logo}
                  </div>
                  
                  <span className="text-xs text-gray-600 font-medium mt-3 group-hover:text-gray-900 transition-colors text-center leading-tight truncate w-full px-1">
                    {brand.name}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div> */}

      {/* Style Quiz Modal - Reduced Size */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
          >
            <StyleQuiz onClose={() => setShowQuiz(false)} />
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default Hero;