import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Star, Heart, ShoppingCart, Eye, Award, Sparkles, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { featuredProducts } from '../data/products';
import { virtualStores } from '../data/virtualStores';
import AddToCartButton from '../components/cart/AddToCartButton';
import Hero from '../components/home/Hero';
import LuxuryProductGrid from '../components/home/LuxuryProductGrid';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HomePage: React.FC = () => {
  // Newsletter form state
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  // Updated categories to match room types from navbar and CategoryPage
  const roomTypes = [
    {
      id: 'living-room',
      name: 'Living Room',
      image: '/home/living room.jpeg',
      description: 'Premium living room collections'
    },
    {
      id: 'bedroom',
      name: 'Bedroom',
      image: '/home/bedroom.jpeg',
      description: 'Create your dream bedroom sanctuary'
    },
    {
      id: 'dining-room',
      name: 'Dining Room',
      image: '/home/dining room.jpeg',
      description: 'Sophisticated dining furniture'
    },
    {
      id: 'office',
      name: 'Office',
      image: '/home/office.webp',
      description: 'Executive office furniture'
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      image: '/home/kitchen.webp',
      description: 'Modern kitchen essentials'
    },
    {
      id: 'entryway',
      name: 'Entryway',
      image: '/home/entryway.jpeg',
      description: 'Welcome guests in style'
    },
    {
      id: 'outdoor',
      name: 'Outdoor',
      image: '/home/outdoor.jpeg',
      description: 'Outdoor furniture & accessories'
    }
  ];

  const seasonalCollections = [
    {
      id: 'lounge-leisure',
      name: 'Lounge & Leisure',
      image: '/home/living room.jpeg',
      description: 'Comfort meets style'
    },
    {
      id: 'easy-finds',
      name: 'Easy Finds',
      image: '/home/easy-finds.jpeg',
      description: 'Quick style solutions'
    },
    {
      id: 'refresh',
      name: 'Refresh',
      image: '/home/refresh.webp',
      description: 'Revitalize your space'
    }
  ];

  const bestSellers = featuredProducts.filter(p => p.featured).slice(0, 6);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''; 

  // Newsletter form handler
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setNewsletterStatus('error');
      setNewsletterMessage('Please enter a valid email address');
      return;
    }

    setNewsletterStatus('loading');
    
    try {
      const cleanEmail = email.toLowerCase().trim();
      const userName = cleanEmail.split('@')[0];
      
      const response = await fetch(`${API_BASE_URL}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toEmail: cleanEmail,
          toName: userName,
          type: 'newsletter',
          templateParams: { 
            PRENOM: userName
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setNewsletterStatus('success');
        setNewsletterMessage(data.message || 'Successfully subscribed! Check your email for a welcome message.');
        setEmail('');
        
        // Track successful subscription (optional analytics)
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'sign_up', {
            method: 'newsletter'
          });
        }
      } else {
        throw new Error(data.error || 'Subscription failed');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setNewsletterStatus('error');
      setNewsletterMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  };

  const resetNewsletterStatus = () => {
    if (newsletterStatus === 'error' || newsletterStatus === 'success') {
      setNewsletterStatus('idle');
      setNewsletterMessage('');
    }
  };

  return (
    <div className="bg-white">
      {/* Original Hero Section with Quiz */}
      <Hero />

      {/* Room Types Categories - Horizontal Slider */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated collections designed for every space in your home
            </p>
          </motion.div>

          {/* Desktop Horizontal Swiper */}
          <div className="hidden md:block">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={24}
              slidesPerView="auto"
              navigation={true}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              className="room-types-swiper"
              style={{
                paddingBottom: '16px',
                '--swiper-navigation-color': '#000',
                '--swiper-navigation-size': '20px',
              } as any}
            >
              {roomTypes.map((roomType, index) => (
                <SwiperSlide key={roomType.id} style={{ width: '320px' }}>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group cursor-pointer"
                  >
                    <Link to={`/category/${roomType.id}`}>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
                        <img 
                          src={roomType.image} 
                          alt={roomType.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="font-serif text-xl mb-1 text-white font-bold">{roomType.name}</h3>
                          <p className="text-sm text-white/80">{roomType.description}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Mobile Swiper */}
          <div className="md:hidden">
            <Swiper
              modules={[Pagination]}
              spaceBetween={16}
              slidesPerView={1.1}
              pagination={{ clickable: true }}
              className="room-types-mobile-swiper"
              style={{
                paddingBottom: '40px',
                '--swiper-pagination-color': '#000',
                '--swiper-pagination-bullet-inactive-color': '#999',
              } as any}
            >
              {roomTypes.map((roomType, index) => (
                <SwiperSlide key={roomType.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group cursor-pointer"
                  >
                    <Link to={`/category/${roomType.id}`}>
                      <div className="relative aspect-[16/9] overflow-hidden rounded-lg mb-4">
                        <img 
                          src={roomType.image} 
                          alt={roomType.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="font-serif text-xl mb-1 text-white">{roomType.name}</h3>
                          <p className="text-sm text-white/80">{roomType.description}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      

      {/* Best Sellers */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <h2 className="font-serif text-3xl md:text-4xl mb-2">Best Sellers</h2>
              <p className="text-gray-600">Our most coveted pieces</p>
            </div>
            <Link 
              to="/category/all" 
              className="hidden md:flex items-center text-gray-600 hover:text-black transition-colors font-medium"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </motion.div>

          {/* Grille de produits style Louis Vuitton */}
          <LuxuryProductGrid />
        </div>
      </section>

      {/* Majlis Feature */}
      <section className="relative py-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080)' }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 container-custom text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="font-serif text-4xl md:text-5xl mb-6">
              Create the Perfect
              <br />
              <span style={{ color: '#EED8C1' }}>Gathering Space</span>
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Transform your home into a sanctuary of hospitality with our exclusive Majlis collection. 
              Where tradition meets contemporary luxury.
            </p>
            <Link 
              to="/category/majlis"
              style={{ backgroundColor: '#EED8C1' }}
              className="inline-flex items-center hover:opacity-90 text-gray-800 px-8 py-4 font-medium transition-all duration-300 uppercase tracking-wide"
            >
              Shop Majlis Collection
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Seasonal Collection Grid */}
      <section className="py-16" style={{ backgroundColor: '#FAF6E7' }}>
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl md:text-4xl mb-4 text-gray-800">Seasonal Collections</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Discover our carefully curated seasonal selections designed to refresh and inspire your living spaces
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {seasonalCollections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <Link to={`/category/${collection.id}`}>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-4">
                    <img 
                      src={collection.image} 
                      alt={collection.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="font-serif text-2xl mb-2 text-white font-bold">{collection.name}</h3>
                      <p className="text-white/80 mb-4">{collection.description}</p>
                      <div className="flex items-center text-sm font-medium">
                        <span>Explore Collection</span>
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual Showrooms */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Virtual Showrooms</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience our furniture in immersive 3D environments. Step into luxury from anywhere.
            </p>
          </motion.div>

          
            <iframe src="https://360-test-rho.vercel.app/1/" width="100%" height="500"></iframe>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="mb-8">
              <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h2 className="font-serif text-3xl md:text-4xl mb-4">Stay Inspired</h2>
              <p className="text-gray-600 text-lg">
                Be the first to discover new collections, exclusive offers, and design inspiration from marahb.
              </p>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    resetNewsletterStatus();
                  }}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-black text-gray-900"
                  required
                  disabled={newsletterStatus === 'loading'}
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
                  className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-900 
                           transition-colors uppercase tracking-wide disabled:opacity-50 
                           disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {newsletterStatus === 'loading' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {newsletterStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>

              {/* Status Messages */}
              {newsletterMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                    newsletterStatus === 'success' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {newsletterStatus === 'success' ? (
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span>{newsletterMessage}</span>
                </motion.div>
              )}
            </form>

            <p className="text-sm text-gray-500 mt-4">
              Join over 50,000 design enthusiasts. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;