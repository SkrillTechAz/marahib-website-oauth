import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Eye as Eye360, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { virtualStores } from '../data/virtualStores';
import { featuredProducts } from '../data/products';
import ProductCard from '../components/product/ProductCard';

const VirtualStorePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const store = virtualStores.find(s => s.id === id);
  
  // Filter products to show in this virtual store
  // In a real app, this would be based on products actually in this store
  const storeProducts = featuredProducts.slice(0, 4);
  
  if (!store) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="font-hatton text-3xl mb-4">Store Not Found</h2>
        <p className="mb-8">The virtual store you're looking for doesn't exist or has been removed.</p>
        <Link to="/virtual-stores" className="btn-primary">
          Browse All Stores
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-primary-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-6">
          <Link to="/virtual-stores" className="inline-flex items-center text-gray-600 hover:text-primary-500 transition-colors">
            <ArrowLeft size={18} className="mr-2" />
            Back to All Stores
          </Link>
        </div>
      </div>

      {/* Store Info */}
      <div className="relative">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <div 
          className="h-[400px] bg-cover bg-center"
          style={{ backgroundImage: `url(${store.image})` }}
        ></div>
        <div className="container-custom relative z-20 -mt-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="font-hatton text-3xl md:text-4xl mb-2">{store.name}</h1>
                <p className="text-gray-600 mb-4">{store.description}</p>
                <div className="flex items-center">
                  <div className="flex items-center">
                    <Star size={18} className="text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 font-medium">{store.rating}</span>
                    <span className="ml-1 text-gray-500">({store.reviews} reviews)</span>
                  </div>
                  <span className="ml-4 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    {store.style}
                  </span>
                  {store.isLuxury && (
                    <span className="ml-2 px-3 py-1 bg-black text-white rounded-full text-sm font-medium">
                      Luxury
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                {store.has360Tour && (
                  <button className="btn-primary">
                    <Eye360 size={20} className="mr-2" />
                    Start 3D Tour
                  </button>
                )}
                <button className="btn-secondary">
                  <ExternalLink size={20} className="mr-2" />
                  Share
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 3D Experience Preview */}
      <div className="container-custom py-12">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="aspect-[16/9] bg-gray-900 rounded-lg overflow-hidden relative mb-12"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="bg-primary-500/90 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-primary-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
              <h3 className="font-hatton text-xl mb-2">Experience in 3D</h3>
              <p className="text-white/80 max-w-md mx-auto">
                Click to start exploring our virtual showroom with interactive product displays
              </p>
            </div>
          </div>
          <img 
            src={store.image} 
            alt={store.name} 
            className="w-full h-full object-cover opacity-50"
          />
        </motion.div>

        {/* Products in this store */}
        <div>
          <h2 className="font-hatton text-2xl md:text-3xl mb-8">Featured in This Store</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {storeProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualStorePage;