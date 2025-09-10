import React from 'react';
import { motion } from 'framer-motion';
import { useCountdown } from '../../hooks/useCountdown';

interface CountdownTimerProps {
  targetDate: Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const timeLeft = useCountdown(targetDate);

  const timeUnits = [
    { 
      label: 'Days', 
      value: timeLeft.days
    },
    { 
      label: 'Hours', 
      value: timeLeft.hours
    },
    { 
      label: 'Minutes', 
      value: timeLeft.minutes
    },
    { 
      label: 'Seconds', 
      value: timeLeft.seconds
    },
  ];

  return (
    <div className="flex justify-center space-x-3 md:space-x-6">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.6, 
            delay: index * 0.15,
            type: "spring",
            stiffness: 100
          }}
          className="text-center group cursor-pointer"
        >
          <div className="
            bg-gradient-to-br from-white via-stone-50 to-stone-100
            backdrop-blur-sm rounded-2xl p-4 md:p-6 lg:p-8
            border-2 border-stone-200/60
            shadow-stone-200/30 shadow-xl
            group-hover:scale-110 group-hover:shadow-stone-300/60
            transition-all duration-500 ease-out
            relative overflow-hidden
            min-w-[80px] md:min-w-[100px] lg:min-w-[120px]
            hover:shadow-2xl
          ">
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            
            {/* Subtle inner glow */}
            <div className="absolute inset-1 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-stone-800 mb-2 font-mono tracking-tight drop-shadow-sm">
                {unit.value.toString().padStart(2, '0')}
              </div>
              <div className="text-xs md:text-sm lg:text-base text-stone-600 uppercase tracking-widest font-semibold">
                {unit.label}
              </div>
            </div>

            {/* Decorative corner elements */}
            <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-stone-300/60 rounded-tl-lg" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-stone-300/60 rounded-br-lg" />
            
            {/* Subtle inner border */}
            <div className="absolute inset-2 border border-stone-200/40 rounded-xl pointer-events-none" />
          </div>

          {/* Floating particles effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-stone-400/50 rounded-full animate-bounce opacity-0 group-hover:opacity-100"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${10 + i * 20}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CountdownTimer;