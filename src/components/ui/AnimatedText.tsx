import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedTextProps {
  phrases?: string[];
  speed?: number;
  className?: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ 
  phrases = [
    'Luxury Furniture',
    'Smart Homes',
    'Sustainable Living',
    'Interior Design',
    'Digital Commerce',
    'Virtual Reality',
    'Artificial Intelligence',
    'Human Connection',
    'Creative Expression',
    'Mindful Living'
  ],
  speed = 3000,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, speed);

    return () => clearInterval(interval);
  }, [phrases.length, speed]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="block bg-gradient-to-r from-stone-600 via-stone-800 to-stone-600 bg-clip-text text-transparent"
        >
          {phrases[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedText;