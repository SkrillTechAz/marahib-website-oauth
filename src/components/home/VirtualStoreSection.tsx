import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye as Eye360, Star, ArrowRight } from 'lucide-react';
import { VirtualStore } from '../../types';

interface VirtualStoreSectionProps {
  stores: VirtualStore[];
}

const VirtualStoreSection: React.FC<VirtualStoreSectionProps> = ({ stores }) => {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="font-hatton text-3xl md:text-4xl mb-4">Explore Virtual Stores</h2>
            <p className="text-gray-600 max-w-2xl">
              Experience our showrooms in immersive 3D. Browse different styles and visualize how 
              our furniture pieces work together in realistic settings.
            </p>
          </div>
          <Link 
            to="/virtual-stores" 
            className="inline-flex items-center mt-4 md:mt-0 text-primary-500 hover:text-primary-600 font-medium transition-colors"
          >
            <span>View All Stores</span>
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stores.map((store, index) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Link to={`/virtual-stores/${store.id}`} className="block">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={store.image} 
                    alt={store.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {store.has360Tour && (
                    <div className="absolute top-4 left-4 bg-primary-500/90 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <Eye360 size={16} className="mr-1" />
                      <span>360° Tour</span>
                    </div>
                  )}
                  {store.isLuxury && (
                    <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Luxury
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-medium text-xl mb-2">{store.name}</h3>
                  <p className="text-gray-600 mb-4">{store.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Star size={18} className="text-yellow-500 fill-yellow-500" />
                      <span className="ml-1 font-medium">{store.rating}</span>
                      <span className="ml-1 text-gray-500 text-sm">({store.reviews} reviews)</span>
                    </div>
                    <span className="text-sm font-medium px-3 py-1 bg-primary-100 text-primary-700 rounded-full">
                      {store.style}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VirtualStoreSection;