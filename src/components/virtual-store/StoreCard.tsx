import React from 'react';
import { Link } from 'react-router-dom';
import { Eye as Eye360, Star } from 'lucide-react';
import { VirtualStore } from '../../types';

interface StoreCardProps {
  store: VirtualStore;
}

const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
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
    </div>
  );
};

export default StoreCard;