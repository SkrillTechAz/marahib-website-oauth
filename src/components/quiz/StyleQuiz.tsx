import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, CheckCircle, User, Palette, Home, Target, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuizQuestion {
  id: string;
  title: string;
  subtitle: string;
  options: {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
}

interface QuizAnswers {
  style: string;
  room: string;
  palette: string;
  focal: string;
  goal: string;
}

interface StyleProfile {
  name: string;
  description: string;
  characteristics: string[];
  recommendedProducts: string[];
  colorPalette: string[];
  designTips: string[];
}

const StyleQuiz: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    style: '',
    room: '',
    palette: '',
    focal: '',
    goal: ''
  });
  const [showResults, setShowResults] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const questions: QuizQuestion[] = [
    {
      id: 'style',
      title: 'Which design style resonates most with your vision?',
      subtitle: 'Your aesthetic foundation',
      options: [
        {
          id: 'contemporary',
          title: 'Contemporary Minimal',
          description: 'Clean lines, uncluttered spaces, modern elegance',
          icon: <div className="w-6 h-6 bg-gray-200 rounded-sm" />
        },
        {
          id: 'classic',
          title: 'Classic Chic',
          description: 'Timeless sophistication with refined details',
          icon: <div className="w-6 h-6 bg-amber-100 rounded-full border-2 border-amber-300" />
        },
        {
          id: 'nordic',
          title: 'Nordic Harmony',
          description: 'Light, natural elements with functional beauty',
          icon: <div className="w-6 h-6 bg-blue-100 rounded-lg" />
        },
        {
          id: 'urban',
          title: 'Urban Loft',
          description: 'Raw materials, industrial touches, sophisticated edge',
          icon: <div className="w-6 h-6 bg-stone-400 rounded-none" />
        }
      ]
    },
    {
      id: 'room',
      title: 'Which space are you primarily looking to transform?',
      subtitle: 'Your design focus',
      options: [
        {
          id: 'living',
          title: 'Living Room',
          description: 'Your main gathering and relaxation space',
          icon: <Home className="w-6 h-6 text-blue-600" />
        },
        {
          id: 'bedroom',
          title: 'Bedroom',
          description: 'Your personal sanctuary',
          icon: <div className="w-6 h-6 bg-purple-200 rounded-full" />
        },
        {
          id: 'dining',
          title: 'Dining Area',
          description: 'Your entertaining and dining space',
          icon: <div className="w-6 h-6 bg-green-200 rounded-lg" />
        },
        {
          id: 'office',
          title: 'Home Office',
          description: 'Your productive workspace',
          icon: <div className="w-6 h-6 bg-orange-200 rounded-sm" />
        }
      ]
    },
    {
      id: 'palette',
      title: 'Which color palette speaks to your aesthetic?',
      subtitle: 'Your color story',
      options: [
        {
          id: 'warm',
          title: 'Warm Neutrals',
          description: 'Sophisticated beige, sand, and ivory tones',
          icon: <Palette className="w-6 h-6 text-amber-600" />
        },
        {
          id: 'cool',
          title: 'Cool Greys',
          description: 'Modern slate, charcoal, and silver hues',
          icon: <Palette className="w-6 h-6 text-slate-600" />
        },
        {
          id: 'earth',
          title: 'Rich Earth Tones',
          description: 'Organic terracotta, olive, and deep brown shades',
          icon: <Palette className="w-6 h-6 text-amber-800" />
        },
        {
          id: 'contrast',
          title: 'Dramatic Contrast',
          description: 'Bold black and white with striking accent colors',
          icon: <Palette className="w-6 h-6 text-gray-900" />
        }
      ]
    },
    {
      id: 'focal',
      title: 'Which signature piece would you love as your room\'s focal point?',
      subtitle: 'Your statement element',
      options: [
        {
          id: 'armchair',
          title: 'Statement Armchair',
          description: 'An artistic seating masterpiece',
          icon: <div className="w-6 h-6 bg-blue-300 rounded-lg" />
        },
        {
          id: 'art',
          title: 'Gallery-Worth Art',
          description: 'A commanding wall piece or calligraphy',
          icon: <div className="w-6 h-6 bg-purple-300 rounded-sm" />
        },
        {
          id: 'table',
          title: 'Designer Coffee Table',
          description: 'A conversation-starting centerpiece',
          icon: <div className="w-6 h-6 bg-green-300 rounded-full" />
        },
        {
          id: 'lighting',
          title: 'Luxury Lighting',
          description: 'An architectural lighting statement',
          icon: <Sparkles className="w-6 h-6 text-yellow-600" />
        }
      ]
    },
    {
      id: 'goal',
      title: 'What\'s your primary goal for your space?',
      subtitle: 'Your design intention',
      options: [
        {
          id: 'simplicity',
          title: 'Serene Simplicity',
          description: 'Creating a calm, organized environment',
          icon: <div className="w-6 h-6 bg-blue-100 rounded-full" />
        },
        {
          id: 'cultural',
          title: 'Cultural Expression',
          description: 'Incorporating heritage with modern comfort',
          icon: <div className="w-6 h-6 bg-amber-200 rounded-lg" />
        },
        {
          id: 'smart',
          title: 'Smart Sophistication',
          description: 'Balancing beauty with functionality',
          icon: <Target className="w-6 h-6 text-green-600" />
        },
        {
          id: 'distinctive',
          title: 'Distinctive Design',
          description: 'Achieving a unique, luxurious atmosphere',
          icon: <Sparkles className="w-6 h-6 text-purple-600" />
        }
      ]
    }
  ];

  const styleProfiles: Record<string, StyleProfile> = {
    'contemporary-living-warm': {
      name: 'Modern Sanctuary',
      description: 'Your style blends contemporary minimalism with warm, inviting tones perfect for sophisticated living.',
      characteristics: ['Clean architectural lines', 'Warm neutral palette', 'Functional luxury', 'Uncluttered elegance'],
      recommendedProducts: ['Modern Sectional Sofa', 'Designer Coffee Table', 'Statement Lighting'],
      colorPalette: ['Warm White', 'Sand Beige', 'Soft Taupe', 'Cream'],
      designTips: ['Layer textures in neutral tones', 'Choose furniture with clean silhouettes', 'Add warmth with natural materials']
    },
    'classic-bedroom-warm': {
      name: 'Timeless Elegance',
      description: 'Classic sophistication meets personal comfort in your refined bedroom sanctuary.',
      characteristics: ['Refined traditional elements', 'Luxurious materials', 'Sophisticated color harmony', 'Timeless appeal'],
      recommendedProducts: ['Platform Bed', 'Elegant Nightstands', 'Classic Table Lamp'],
      colorPalette: ['Ivory', 'Champagne', 'Soft Gold', 'Warm Cream'],
      designTips: ['Invest in quality fabrics', 'Mix antique and modern pieces', 'Create layers of ambient lighting']
    },
    'nordic-living-cool': {
      name: 'Scandinavian Serenity',
      description: 'Light, functional design with natural elements creates your perfect Nordic-inspired space.',
      characteristics: ['Natural light emphasis', 'Functional beauty', 'Organic materials', 'Minimalist comfort'],
      recommendedProducts: ['Light Wood Furniture', 'Cozy Textiles', 'Natural Lighting'],
      colorPalette: ['Pure White', 'Light Grey', 'Natural Wood', 'Soft Blue'],
      designTips: ['Maximize natural light', 'Use light woods and whites', 'Add cozy textiles for warmth']
    },
    'urban-office-contrast': {
      name: 'Industrial Sophistication',
      description: 'Raw materials meet refined design in your sophisticated urban workspace.',
      characteristics: ['Industrial materials', 'Bold contrasts', 'Functional design', 'Urban sophistication'],
      recommendedProducts: ['Executive Desk', 'Industrial Lighting', 'Modern Storage'],
      colorPalette: ['Charcoal Black', 'Steel Grey', 'Pure White', 'Copper Accent'],
      designTips: ['Mix raw and refined materials', 'Use dramatic lighting', 'Create strong visual contrasts']
    }
  };

  const getStyleProfile = (): StyleProfile => {
    const key = `${answers.style}-${answers.room}-${answers.palette}`;
    return styleProfiles[key] || styleProfiles['contemporary-living-warm'];
  };

  const handleAnswer = (questionId: string, answerId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerId }));
    
    if (currentQuestion < questions.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      setIsAnimating(true);
      setTimeout(() => {
        setShowResults(true);
        setIsAnimating(false);
      }, 300);
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestion(prev => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({ style: '', room: '', palette: '', focal: '', goal: '' });
    setShowResults(false);
  };

  if (showResults) {
    const profile = getStyleProfile();
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-16 h-16 bg-gradient-to-r from-stone-600 to-stone-800 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-didot text-2xl text-gray-900 mb-2"
          >
            Your Signature Style
          </motion.h2>
          
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-didot text-xl text-stone-600 mb-3"
          >
            {profile.name}
          </motion.h3>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600"
          >
            {profile.description}
          </motion.p>
        </div>

        {/* Results Grid - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Style Characteristics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-50 p-4 rounded-lg"
          >
            <h4 className="font-didot text-lg text-gray-900 mb-3">Your Style DNA</h4>
            <ul className="space-y-2">
              {profile.characteristics.slice(0, 3).map((char, index) => (
                <li key={index} className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{char}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Color Palette */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-50 p-4 rounded-lg"
          >
            <h4 className="font-didot text-lg text-gray-900 mb-3">Your Colors</h4>
            <div className="grid grid-cols-2 gap-2">
              {profile.colorPalette.slice(0, 4).map((color, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-stone-200 to-stone-400 mr-2" />
                  <span className="text-gray-700">{color}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recommended Products */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gray-50 p-4 rounded-lg"
          >
            <h4 className="font-didot text-lg text-gray-900 mb-3">Perfect For You</h4>
            <ul className="space-y-2">
              {profile.recommendedProducts.map((product, index) => (
                <li key={index} className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-stone-600 rounded-full mr-2" />
                  <span className="text-gray-700">{product}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Design Tips */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gray-50 p-4 rounded-lg"
          >
            <h4 className="font-didot text-lg text-gray-900 mb-3">Expert Tips</h4>
            <ul className="space-y-2">
              {profile.designTips.map((tip, index) => (
                <li key={index} className="flex items-start text-sm">
                  <Sparkles className="w-3 h-3 text-stone-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Call to Action - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-gradient-to-r from-stone-50 to-stone-100 p-6 rounded-lg text-center"
        >
          <h4 className="font-didot text-xl text-gray-900 mb-3">Ready to Transform Your Space?</h4>
          <p className="text-gray-600 mb-4 text-sm">
            Explore our curated collections that match your {profile.name} style.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/furniture"
              className="bg-black text-white px-6 py-2 font-medium hover:bg-gray-900 transition-colors uppercase tracking-wide text-sm"
            >
              Shop Your Style
            </Link>
            <Link
              to="/designers"
              className="border border-black text-black px-6 py-2 font-medium hover:bg-black hover:text-white transition-colors uppercase tracking-wide text-sm"
            >
              Book Consultation
            </Link>
          </div>
          
          <button
            onClick={resetQuiz}
            className="mt-3 text-stone-600 hover:text-stone-800 transition-colors text-sm font-medium"
          >
            Retake Quiz
          </button>
        </motion.div>
      </motion.div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="p-6">
      {/* Header - Compact */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-didot text-2xl text-gray-900">Style Quiz</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-4 text-sm">
          Discover your signature space through 5 simple questions
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <motion.div
            className="bg-gradient-to-r from-stone-600 to-stone-800 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="text-sm text-gray-500">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      {/* Question - Compact */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: isAnimating ? 0 : 1, x: isAnimating ? -20 : 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="text-center mb-6">
            <h3 className="font-didot text-xl text-gray-900 mb-1">
              {currentQ.title}
            </h3>
            <p className="text-stone-600 italic text-sm">{currentQ.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {currentQ.options.map((option) => (
              <motion.button
                key={option.id}
                onClick={() => handleAnswer(currentQ.id, option.id)}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-stone-400 hover:bg-stone-50 transition-all duration-300 text-left group"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {option.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1 group-hover:text-stone-800 text-sm">
                      {option.title}
                    </h4>
                    <p className="text-xs text-gray-600 group-hover:text-gray-700">
                      {option.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation - Compact */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={goBack}
          disabled={currentQuestion === 0}
          className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>

        <div className="text-sm text-gray-500">
          {currentQuestion + 1} / {questions.length}
        </div>

        <div className="w-16" /> {/* Spacer for alignment */}
      </div>
    </div>
  );
};

export default StyleQuiz;