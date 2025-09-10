import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../types';
import AddToCartButton from '../cart/AddToCartButton';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface FeaturedProductsProps {
  products: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  const parsePrice = (price: string | number): number => {
    if (price === null || price === undefined || price === '') return 0;
    if (typeof price === "number") return price;
    if (typeof price === "string") {
      const parsed = parseFloat(price.replace(/,/g, ""));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const formatPrice = (price: number): string => {
    if (isNaN(price) || price === 0) return "0";
    return price.toLocaleString("en-US");
  };

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl mb-2 text-gray-900">Featured Products</h2>
            <p className="text-gray-600">
              Discover our most popular pieces
            </p>
          </div>
          <Link to="/category/all" className="text-black hover:text-gray-700 flex items-center text-sm font-medium uppercase tracking-wide">
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="relative">
          {/* Custom Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 z-10">
            <button className="swiper-button-prev-custom group bg-white hover:bg-gray-50 shadow-lg border border-gray-200 w-12 h-12 flex items-center justify-center transition-all duration-300">
              <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-black" />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-4 z-10">
            <button className="swiper-button-next-custom group bg-white hover:bg-gray-50 shadow-lg border border-gray-200 w-12 h-12 flex items-center justify-center transition-all duration-300">
              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-black" />
            </button>
          </div>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              prevEl: '.swiper-button-prev-custom',
              nextEl: '.swiper-button-next-custom',
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            className="featured-products-slider !pb-12"
          >
            {products.map((product) => {
              const currentPrice = parsePrice(product.price);
              const originalPrice = product.originalPrice ? parsePrice(product.originalPrice) : null;
              
              return (
                <SwiperSlide key={product.id}>
                  <div className="product-card group bg-white">
                    <Link to={`/product/${product.id}`} className="block">
                      <div className="aspect-square overflow-hidden bg-gray-50 relative">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Wishlist Button */}
                        <button className="absolute top-4 right-4 p-2 bg-white shadow-md hover:bg-gray-50 transition-all duration-300 opacity-0 group-hover:opacity-100">
                          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
                        </button>

                        {/* Sale Badge */}
                        {originalPrice && (
                          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-sm font-medium">
                            Sale
                          </div>
                        )}

                        {/* Luxury Stock Indicator - Subtle and elegant */}
                        {product.stock < 10 && (
                          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-1 text-xs font-medium border border-gray-200/50 shadow-sm">
                            Limited availability
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="font-medium ml-1 text-sm">{product.rating}</span>
                          </div>
                          <span className="text-gray-500 text-sm ml-2">
                            ({product.reviews})
                          </span>
                        </div>

                        <p className="text-sm text-gray-500 mb-1">{product.designer}</p>
                        <h3 className="font-medium text-base mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors">
                          {product.name}
                        </h3>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-lg text-black flex items-center gap-1">
                              <img src="/ed.png" className='w-[20px] inline-block' alt="" /> {formatPrice(currentPrice)}
                            </p>
                            {originalPrice && (
                              <p className="text-gray-500 line-through text-sm flex items-center gap-1">
                                <img src="/ed.png" className='w-[16px] inline-block' alt="" /> {formatPrice(originalPrice)}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">Price incl. VAT</p>
                          </div>

                          {/* Color Options */}
                          <div className="flex space-x-1">
                            {product.colors.slice(0, 3).map((color) => (
                              <div 
                                key={color.name}
                                className="w-4 h-4 border border-gray-200"
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                              />
                            ))}
                            {product.colors.length > 3 && (
                              <div className="w-4 h-4 bg-gray-200 flex items-center justify-center">
                                <span className="text-xs text-gray-600">+{product.colors.length - 3}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Quick Add Button - Now functional */}
                    <div className="px-4 pb-4">
                      <AddToCartButton 
                        product={product}
                        selectedColor={product.colors[0]}
                        quantity={1}
                        variant="primary"
                        size="sm"
                        className="w-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                      />
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;