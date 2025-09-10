import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Star, Users, Award, Gift, Clock, Shield, Crown, Zap, Heart } from 'lucide-react';
import CountdownTimer from '../components/ui/CountdownTimer';
import EmailForm from '../components/ui/EmailForm';
import AnimatedText from '../components/ui/AnimatedText';

const LaunchPage: React.FC = () => {
  const launchDate = new Date('2025-07-16T00:00:00');

  const features = [
    {
      icon: Star,
      title: 'Curated Collections',
      description: 'Handpicked luxury furniture from world-renowned designers',
      gradient: 'from-stone-600 to-stone-800',
    },
    {
      icon: Users,
      title: 'Virtual Showrooms',
      description: 'Experience our furniture in immersive 3D environments',
      gradient: 'from-stone-500 to-stone-700',
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Only the finest materials and craftsmanship',
      gradient: 'from-stone-700 to-stone-900',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Al-Mansouri',
      role: 'Interior Designer, Dubai',
      quote: 'Finally, a platform that understands luxury furniture. The virtual showrooms are revolutionary.',
      avatar: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
    },
    {
      name: 'Ahmed Hassan',
      role: 'Architect, Abu Dhabi',
      quote: 'The quality and curation is unmatched. This will change how we source furniture for our projects.',
      avatar: 'https://images.pexels.com/photos/3184466/pexels-photo-3184466.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
    },
    {
      name: 'Layla Khalil',
      role: 'Luxury Home Owner',
      quote: 'I\'ve been waiting for something like this. The designer pieces are absolutely stunning.',
      avatar: 'https://images.pexels.com/photos/3184467/pexels-photo-3184467.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
    },
  ];

  const animatedPhrases = [
    'Luxury Furniture',
    'Smart Homes',
    'Sustainable Living',
    'Interior Design',
    'Digital Commerce',
    'Virtual Reality',
    'Artificial Intelligence',
    'Human Connection',
    'Creative Expression',
    'Mindful Living',
    'Eco-Friendly Design',
    'Personalized Spaces'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-stone-50 to-stone-100 relative overflow-hidden">
      {/* Minimalist Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/6 left-1/4 w-96 h-96 bg-gradient-to-r from-stone-100/30 to-stone-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-stone-50/30 to-stone-100/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-stone-100/20 to-stone-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-1 h-1 bg-stone-400/50 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-40 right-32 w-2 h-2 bg-stone-300/60 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-32 left-1/3 w-1 h-1 bg-stone-500/40 rounded-full animate-bounce" style={{ animationDelay: '2.5s' }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="py-8">
          <div className="container-custom">
            <div className="flex justify-between items-center">
              <Link 
                to="/" 
                className="hover:opacity-90 transition-all duration-300 cursor-pointer"
              >
                <img 
                  src="/Design sans titre.png" 
                  alt="Marahb" 
                  className="h-12 md:h-16 w-auto object-contain"
                />
              </Link>
              <div className="flex items-center space-x-6">
                <div className="hidden md:flex items-center beige-accent backdrop-blur-sm rounded-full px-6 py-3 border border-stone-200/50">
                  <Clock className="w-4 h-4 text-stone-600 mr-3" />
                  <span className="text-stone-700 text-sm font-medium tracking-wide">Limited Early Access</span>
                </div>
                <div className="text-stone-600 text-sm font-medium tracking-wide">
                  July 16, 2025
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container-custom py-8 md:py-12">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-8 py-4 beige-accent backdrop-blur-sm rounded-full text-stone-800 text-sm font-medium mb-8 border border-stone-200/50 shadow-lg"
            >
              <Sparkles className="w-5 h-5 mr-3 text-stone-600 animate-pulse" />
              <span className="beige-text font-semibold tracking-[0.1em] uppercase">luxury furniture marketplace</span>
              <span className="ml-3 px-3 py-1 bg-gradient-to-r from-stone-200/60 to-stone-300/60 rounded-full text-xs font-bold text-stone-800 shadow-inner tracking-wide uppercase">exclusive</span>
            </motion.div>

            {/* Main Headline with Animated Text */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-didot text-4xl md:text-6xl lg:text-7xl leading-tight mb-6"
            >
              <span className="bg-gradient-to-r from-stone-700 via-stone-800 to-stone-700 bg-clip-text text-transparent tracking-wide">
                The Future of
              </span>
              <br />
              <AnimatedText 
                phrases={animatedPhrases}
                speed={2500}
                className="min-h-[1.2em] flex items-center justify-center"
              />
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-stone-600 mb-8 max-w-4xl mx-auto leading-relaxed font-medium"
            >
              Discover exceptional furniture pieces from world-renowned designers. 
              Experience luxury shopping like never before with our 
              <span className="bg-gradient-to-r from-stone-700 to-stone-800 bg-clip-text text-transparent font-semibold"> immersive virtual showrooms</span>.
            </motion.p>

            {/* Email Form - Moved Higher */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-2xl mx-auto mb-12"
            >
              <div className="bg-gradient-to-br from-white/80 via-stone-50/80 to-stone-100/80 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-stone-200/50 shadow-2xl relative overflow-hidden">
                {/* Animated border */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-stone-100/30 via-stone-200/30 to-stone-100/30 rounded-t-3xl blur-sm animate-pulse" />
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-red-500 mr-3 animate-pulse" />
                    <span className="text-stone-600 text-base font-medium tracking-wide">Join 2,847+ furniture enthusiasts</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-didot beige-text mb-4 tracking-wide">
                    Be the First to Know
                  </h3>
                  <p className="text-stone-600 mb-8 text-lg leading-relaxed">
                    Get exclusive early access and special launch offers worth over 
                    <span className="font-bold beige-text flex items-center gap-1"> <img src="/ed.png" className='w-[20px] inline-block' alt="" /> 50,000</span>
                  </p>
                  <EmailForm />
                  <p className="text-stone-500 text-sm mt-4 tracking-wide">
                    🚀 Early access on launch • 🔒 No spam • ✨ Exclusive deals only
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-12">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-r from-stone-100/60 to-stone-200/60 border-2 border-stone-200/50 backdrop-blur-sm" />
                    ))}
                  </div>
                  <span className="ml-4 text-stone-600 text-base font-medium tracking-wide">2,847+ designers waiting</span>
                </div>
                <div className="flex items-center">
                  <div className="flex text-stone-500">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-5 h-5 fill-current animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                  <span className="ml-3 text-stone-600 text-base font-medium tracking-wide">Rated by industry experts</span>
                </div>
              </div>
            </motion.div>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-16"
            >
              <h2 className="text-2xl md:text-3xl font-didot beige-text mb-4 tracking-wide">
                Launching In
              </h2>
              <p className="text-stone-600 mb-8 text-lg">
                <span className="font-semibold beige-text tracking-wide">Only 500 early access spots available</span> - Secure yours now
              </p>
              <CountdownTimer targetDate={launchDate} />
            </motion.div>

            {/* Testimonials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-16"
            >
              <h3 className="text-2xl md:text-3xl font-didot beige-text mb-8 tracking-wide">
                What Industry Leaders Are Saying
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                    className="bg-gradient-to-br from-white/70 to-stone-50/70 backdrop-blur-sm rounded-xl p-6 border border-stone-200/50 hover:border-stone-300/70 transition-all duration-300 hover:transform hover:scale-105 shadow-lg"
                  >
                    <div className="flex items-center mb-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-stone-200/50"
                      />
                      <div className="text-left">
                        <h4 className="text-stone-800 font-medium text-base">{testimonial.name}</h4>
                        <p className="text-stone-600 text-sm tracking-wide">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-stone-600 text-sm italic leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex text-stone-500 mt-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                  className="bg-gradient-to-br from-white/70 to-stone-50/70 backdrop-blur-sm rounded-xl p-8 border border-stone-200/50 hover:border-stone-300/70 transition-all duration-300 hover:transform hover:scale-105 group shadow-lg"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-medium text-stone-800 mb-3 tracking-wide">
                    {feature.title}
                  </h4>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Final CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="beige-accent backdrop-blur-md rounded-2xl p-8 border border-stone-200/50 relative overflow-hidden shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-stone-100/20 via-stone-200/20 to-stone-100/20 animate-pulse" />
              <div className="relative z-10">
                <h3 className="text-2xl font-didot beige-text mb-4 tracking-wide">
                  Don't Miss Out on Luxury
                </h3>
                <p className="text-stone-600 mb-6 text-lg">
                  Early access spots are filling up fast. Secure your exclusive benefits today.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-stone-600 text-sm">
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse" />
                    20% Launch Discount
                  </span>
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-stone-500 rounded-full mr-2 animate-pulse" />
                    VIP Access
                  </span>
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse" />
                    Free Delivery
                  </span>
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-stone-600 rounded-full mr-2 animate-pulse" />
                    Lifetime Warranty
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-8 border-t border-stone-200/50">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-center text-stone-600 text-sm">
              <div className="tracking-wide">
                © 2025 marahb. all rights reserved. All prices include VAT.
              </div>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="/privacy-policy" className="hover:text-stone-800 transition-colors tracking-wide">
                  Privacy Policy
                </a>
                <a href="/terms" className="hover:text-stone-800 transition-colors tracking-wide">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LaunchPage;