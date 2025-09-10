import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    id: 'living-room',
    name: 'Living Room',
    description: 'Sofas, chairs, and tables for your perfect living space',
    image: 'https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    description: 'Create your dream bedroom sanctuary',
    image: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  },
  {
    id: 'dining',
    name: 'Dining',
    description: 'Elegant dining furniture for memorable meals',
    image: 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  },
  {
    id: 'office',
    name: 'Office',
    description: 'Productive and stylish workspace solutions',
    image: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  },
];

const CategoryHighlights: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl mb-4 text-gray-900">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our thoughtfully curated furniture collections designed for every room in your home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <Link 
              key={category.id}
              to={`/category/${category.id}`}
              className="relative group overflow-hidden bg-white hover:shadow-lg transition-all duration-300"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="aspect-[4/3]"
              >
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <h3 className="font-serif text-white text-2xl md:text-3xl mb-2 font-bold">{category.name}</h3>
                  <p className="text-white/90 mb-4 max-w-xs">{category.description}</p>
                  <div className="flex items-center text-white font-medium">
                    <span className="text-sm uppercase tracking-wide">Shop Now</span>
                    <ArrowRight size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryHighlights;