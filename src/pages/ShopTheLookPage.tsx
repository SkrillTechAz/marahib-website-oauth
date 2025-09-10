import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ShopTheLookPage: React.FC = () => {
  const looks = [
    {
      id: 'look_1',
      title: 'Modern Minimalist Living Room',
      description: 'Clean lines and neutral tones create a serene living space',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      products: 6,
    },
    {
      id: 'look_2',
      title: 'Scandinavian Bedroom Retreat',
      description: 'Light woods and soft textiles for a cozy bedroom setting',
      image: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg',
      products: 4,
    },
    {
      id: 'look_3',
      title: 'Contemporary Dining Space',
      description: 'Sophisticated dining arrangement with statement pieces',
      image: 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg',
      products: 5,
    },
  ];

  return (
    <div className="py-12 bg-primary-50">
      <div className="container-custom">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-hatton text-4xl md:text-5xl mb-4">Shop the Look</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover curated room designs and shop complete collections to recreate these 
            stunning spaces in your home.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {looks.map((look, index) => (
            <motion.div
              key={look.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Link to={`/shop-the-look/${look.id}`} className="block">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300 z-10" />
                  <img 
                    src={look.image} 
                    alt={look.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium z-20">
                    {look.products} Products
                  </div>
                </div>
                <h3 className="font-medium text-xl mb-2">{look.title}</h3>
                <p className="text-gray-600 mb-4">{look.description}</p>
                <div className="flex items-center text-primary-500 font-medium group-hover:text-primary-600 transition-colors">
                  <span>View Collection</span>
                  <ArrowRight size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopTheLookPage;