import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { FaUser, FaQuoteLeft } from 'react-icons/fa';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isAnimating, setIsAnimating] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: "Person One",
      image: "/api/placeholder/80/80",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aut cupiditate recusandae voluptatum eum fugiat aliquid explicabo quas eius! Adipisci vero fugiat aliquid explicabo.",
      role: "CEO"
    },
    {
      id: 2,
      name: "Person Two",
      image: "/api/placeholder/80/80",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aut cupiditate recusandae quam amet enim voluptates alias accusantium sapiente! Adipisci vero fugiat aliquid explicabo quas eius!",
      role: "CTO"
    },
    {
      id: 3,
      name: "Person Three",
      image: "/api/placeholder/80/80",
      text: "Id amet, consectetur adipiscing ullamcorper quam amet enim voluptates alias accusantium sapiente id explicabo quas eius!",
      role: "Manager"
    },
    {
      id: 4,
      name: "Person Four",
      image: "/api/placeholder/80/80",
      text: "Consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation.",
      role: "Director"
    },
    {
      id: 5,
      name: "Person Five",
      image: "/api/placeholder/80/80",
      text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa quae.",
      role: "Designer"
    },
    {
      id: 6,
      name: "Person Six",
      image: "/api/placeholder/80/80",
      text: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores.",
      role: "Developer"
    }
  ];

  const handleCardClick = (index) => {
    if (isAnimating || index === activeIndex) return;
    
    setIsAnimating(true);
    setActiveIndex(index);
    
    // Reset animation state after transition completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 1200);
  };

  // Create infinite loop array by duplicating testimonials
  const getVisibleTestimonials = () => {
    const totalItems = testimonials.length;
    const visibleItems = [];
    
    // We need to show 5 cards (2 left, 1 center, 2 right)
    for (let i = -2; i <= 2; i++) {
      let index = (activeIndex + i + totalItems) % totalItems;
      visibleItems.push({
        ...testimonials[index],
        originalIndex: index,
        position: i
      });
    }
    
    return visibleItems;
  };

  const getCardVariants = (position, originalIndex) => {
    const isMovingToCenter = originalIndex === activeIndex && position !== 0;
    const isCurrentlyCenter = position === 0;
    
    const variants = {
      '-2': {
        x: -400,
        scale: isMovingToCenter ? 1.1 : 0.7,
        zIndex: isMovingToCenter ? 15 : 1,
        opacity: isMovingToCenter ? 1 : 0.4,
        rotateY: isMovingToCenter ? 0 : 25,
        filter: isMovingToCenter ? 'blur(0px)' : 'blur(1px)',
        y: isMovingToCenter ? -20 : 0,
        transition: {
          duration: isMovingToCenter ? 1.2 : 0.8,
          ease: isMovingToCenter ? [0.25, 0.1, 0.25, 1] : [0.25, 0.46, 0.45, 0.94],
          type: "spring",
          damping: isMovingToCenter ? 15 : 25,
          stiffness: isMovingToCenter ? 80 : 120
        }
      },
      '-1': {
        x: -200,
        scale: isMovingToCenter ? 1.1 : 0.85,
        zIndex: isMovingToCenter ? 15 : 2,
        opacity: isMovingToCenter ? 1 : 0.7,
        rotateY: isMovingToCenter ? 0 : 15,
        filter: 'blur(0px)',
        y: isMovingToCenter ? -20 : 0,
        transition: {
          duration: isMovingToCenter ? 1.2 : 0.8,
          ease: isMovingToCenter ? [0.25, 0.1, 0.25, 1] : [0.25, 0.46, 0.45, 0.94],
          type: "spring",
          damping: isMovingToCenter ? 15 : 25,
          stiffness: isMovingToCenter ? 80 : 120
        }
      },
      '0': {
        x: 0,
        scale: 1,
        zIndex: 5,
        opacity: 1,
        rotateY: 0,
        filter: 'blur(0px)',
        y: 0,
        transition: {
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94],
          type: "spring",
          damping: 25,
          stiffness: 120
        }
      },
      '1': {
        x: 200,
        scale: isMovingToCenter ? 1.1 : 0.85,
        zIndex: isMovingToCenter ? 15 : 2,
        opacity: isMovingToCenter ? 1 : 0.7,
        rotateY: isMovingToCenter ? 0 : -15,
        filter: 'blur(0px)',
        y: isMovingToCenter ? -20 : 0,
        transition: {
          duration: isMovingToCenter ? 1.2 : 0.8,
          ease: isMovingToCenter ? [0.25, 0.1, 0.25, 1] : [0.25, 0.46, 0.45, 0.94],
          type: "spring",
          damping: isMovingToCenter ? 15 : 25,
          stiffness: isMovingToCenter ? 80 : 120
        }
      },
      '2': {
        x: 400,
        scale: isMovingToCenter ? 1.1 : 0.7,
        zIndex: isMovingToCenter ? 15 : 1,
        opacity: isMovingToCenter ? 1 : 0.4,
        rotateY: isMovingToCenter ? 0 : -25,
        filter: isMovingToCenter ? 'blur(0px)' : 'blur(1px)',
        y: isMovingToCenter ? -20 : 0,
        transition: {
          duration: isMovingToCenter ? 1.2 : 0.8,
          ease: isMovingToCenter ? [0.25, 0.1, 0.25, 1] : [0.25, 0.46, 0.45, 0.94],
          type: "spring",
          damping: isMovingToCenter ? 15 : 25,
          stiffness: isMovingToCenter ? 80 : 120
        }
      }
    };
    return variants[position.toString()];
  };

  const visibleTestimonials = getVisibleTestimonials();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-8">
      <div className="w-full max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            What Our Clients Say
          </h2>
          <p className="text-blue-200 text-lg">Hear from our satisfied customers around the world</p>
        </div>

        <div className="relative h-[500px] flex items-center justify-center overflow-hidden">
          <div className="relative w-full flex items-center justify-center">
            {visibleTestimonials.map((testimonial, index) => {
              const position = testimonial.position;
              
              return (
                <motion.div
                  key={`${testimonial.id}-${activeIndex}`}
                  className={`absolute cursor-pointer ${isAnimating ? 'pointer-events-none' : ''}`}
                  initial={false}
                  animate={getCardVariants(position, testimonial.originalIndex)}
                  onClick={() => handleCardClick(testimonial.originalIndex)}
                  whileHover={
                    !isAnimating && position !== 0 
                      ? { 
                          scale: position === -1 || position === 1 ? 0.9 : 0.75,
                          transition: { duration: 0.3, ease: "easeOut" }
                        } 
                      : !isAnimating && { 
                          scale: 1.05,
                          transition: { duration: 0.3, ease: "easeOut" }
                        }
                  }
                  whileTap={{ 
                    scale: position === 0 ? 0.95 : 0.7,
                    transition: { duration: 0.1 }
                  }}
                  style={{ perspective: '1000px' }}
                >
                  <motion.div 
                    className={`
                      w-80 bg-white rounded-3xl shadow-2xl overflow-hidden
                      ${position === 0 
                        ? 'shadow-blue-500/30 ring-2 ring-blue-400/20' 
                        : 'shadow-slate-900/40'
                      }
                    `}
                    whileHover={{
                      boxShadow: position === 0 
                        ? "0 25px 50px -12px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.2)"
                        : "0 20px 40px -12px rgba(0, 0, 0, 0.3)",
                      transition: { duration: 0.3 }
                    }}
                  >
                    {/* Top curved section with gradient */}
                    <div className="relative">
                      {/* Main blue curved section */}
                      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 h-24 relative">
                        {/* Custom curved bottom using SVG path */}
                        <svg 
                          className="absolute bottom-0 left-0 w-full h-8" 
                          viewBox="0 0 320 32" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path 
                            d="M0 0 Q160 32 320 0 L320 32 L0 32 Z" 
                            fill="url(#gradient)"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#2563eb" />
                              <stop offset="50%" stopColor="#1d4ed8" />
                              <stop offset="100%" stopColor="#1e40af" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      
                      {/* Profile image positioned over the curve */}
                      <motion.div 
                        className="absolute -bottom-12 left-1/2 transform -translate-x-1/2"
                        whileHover={{ 
                          scale: 1.1,
                          rotate: 5,
                          transition: { duration: 0.3, ease: "easeOut" }
                        }}
                      >
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-gray-100 to-gray-200">
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                            <FaUser className="text-slate-600 text-2xl" />
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Content section */}
                    <div className="pt-16 pb-8 px-8 text-center">
                      <h3 className="text-2xl font-bold text-gray-800 mb-1">
                        {testimonial.name}
                      </h3>
                      
                      <div className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-6">
                        {testimonial.role}
                      </div>
                      
                      <div className="mb-6">
                        <FaQuoteLeft className="text-blue-500 text-3xl mx-auto opacity-20" />
                      </div>
                      
                      <p className="text-gray-600 text-base leading-relaxed">
                        {testimonial.text}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Dots Navigation */}
        <div className="flex justify-center mt-16 space-x-4">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => handleCardClick(index)}
              className={`relative transition-all duration-300 ${
                index === activeIndex
                  ? 'w-12 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full'
                  : 'w-3 h-3 bg-blue-300/50 hover:bg-blue-400/70 rounded-full'
              }`}
              whileHover={{ 
                scale: 1.2,
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.9,
                transition: { duration: 0.1 }
              }}
            >
              {index === activeIndex && (
                <motion.div
                  layoutId="activeDot"
                  className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                  transition={{ 
                    type: "spring", 
                    bounce: 0.2, 
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Navigation Instructions */}
       
      </div>
    </div>
  );
};

export default Testimonials;