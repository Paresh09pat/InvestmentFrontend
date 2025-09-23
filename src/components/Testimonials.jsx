import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Testimonials = () => {
  const [[activeIndex, direction], setActiveIndex] = useState([2, 0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      image: "/api/placeholder/80/80",
      text: "This platform has completely transformed how we handle our business operations. The intuitive interface and powerful features have increased our productivity by 300%.",
      role: "CEO",
      company: "TechFlow Inc"
    },
    {
      id: 2,
      name: "Michael Chen",
      image: "/api/placeholder/80/80",
      text: "Outstanding service and incredible attention to detail. The team went above and beyond to ensure our project was delivered perfectly on time.",
      role: "CTO",
      company: "DataVision"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      image: "/api/placeholder/80/80",
      text: "Simply amazing! The results exceeded our expectations and the customer support is second to none. Highly recommend to anyone looking for quality.",
      role: "Manager",
      company: "Creative Solutions"
    },
    {
      id: 4,
      name: "David Thompson",
      image: "/api/placeholder/80/80",
      text: "Exceptional quality and innovative approach. This solution has streamlined our workflow and improved our team's collaboration significantly.",
      role: "Director",
      company: "Innovation Labs"
    },
    {
      id: 5,
      name: "Lisa Park",
      image: "/api/placeholder/80/80",
      text: "The best investment we've made for our company. User-friendly, reliable, and the ROI has been incredible. Couldn't be happier with the results.",
      role: "Designer",
      company: "PixelCraft"
    },
    {
      id: 6,
      name: "James Wilson",
      image: "/api/placeholder/80/80",
      text: "Fantastic experience from start to finish. The platform is intuitive, powerful, and has helped us scale our operations efficiently.",
      role: "Developer",
      company: "CodeBase"
    }
  ];

  // we want the scope to be always to be in the scope of the array so that the carousel is endless
  const indexInArrayScope =
    ((activeIndex % testimonials.length) + testimonials.length) % testimonials.length;

  // so that the carousel is endless, we need to repeat the items twice
  // then, we slice the the array so that we only have 5 items visible at the same time
  const visibleTestimonials = [...testimonials, ...testimonials].slice(
    indexInArrayScope,
    indexInArrayScope + 5
  );

  const handleClick = (newDirection) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prevIndex) => [prevIndex[0] + newDirection, newDirection]);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  const handleCardClick = (itemIndex) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex([itemIndex, 0]);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  const nextSlide = () => {
    handleClick(1);
  };

  const prevSlide = () => {
    handleClick(-1);
  };

  const getTestimonialIndex = (testimonial) => {
    switch (testimonial) {
      case visibleTestimonials[0]:
        return "left";
      case visibleTestimonials[1]:
        return "leftCenter";
      case visibleTestimonials[2]:
        return "center";
      case visibleTestimonials[3]:
        return "rightCenter";
      case visibleTestimonials[4]:
        return "right";
      default:
        return "right";
    }
  };

  const getClassName = (testimonial) => {
    return `${getTestimonialIndex(testimonial)}`;
  };

  // Add auto-play effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      handleClick(1);
    }, 4000);
    return () => {
      clearInterval(intervalId);
    };
  }, [isAnimating]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-hidden">
      <div className="w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl">
        {/* Header */}
        <motion.div 
          className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-white via-blue-200 to-indigo-300 bg-clip-text text-transparent px-4">
            What Our Clients Say
          </h2>
          <p className="text-blue-200/80 text-sm sm:text-base md:text-lg lg:text-xl px-4">Experience the transformation through their words</p>
        </motion.div>

        {/* Sliding Carousel Container */}
        <div className="relative h-[400px] sm:h-[500px] md:h-[550px] lg:h-[600px] flex items-center justify-center">
          {/* Navigation Arrows */}
          <motion.button
            onClick={prevSlide}
            className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full p-2 sm:p-3 md:p-4 transition-all duration-300"
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            disabled={isAnimating}
          >
            <FaChevronLeft className="text-white text-sm sm:text-base md:text-lg lg:text-xl" />
          </motion.button>

          <motion.button
            onClick={nextSlide}
            className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full p-2 sm:p-3 md:p-4 transition-all duration-300"
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            disabled={isAnimating}
          >
            <FaChevronRight className="text-white text-sm sm:text-base md:text-lg lg:text-xl" />
          </motion.button>

          {/* Cards Container */}
          <div className="relative w-full h-full flex items-center justify-center">
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleTestimonials.map((testimonial, itemIndex) => {
                const slidePosition = getTestimonialIndex(testimonial);
                const isCenter = slidePosition === "center";
              
              return (
                <motion.div
                    key={testimonial.id}
                  className={`absolute cursor-pointer ${isAnimating ? 'pointer-events-none' : ''}`}
                    layout
                    custom={{
                      slidePosition,
                      direction,
                      position: () => getTestimonialIndex(testimonial)
                    }}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 1 }}
                    onClick={() => handleCardClick(itemIndex)}
                  whileHover={
                    !isAnimating && !isCenter 
                      ? { 
                            scale: slidePosition === "leftCenter" || slidePosition === "rightCenter" ? 0.75 : 0.55,
                          y: -5,
                          transition: { duration: 0.3, ease: "easeOut" }
                        } 
                      : !isAnimating && { 
                          scale: 1.05,
                          y: -15,
                          transition: { duration: 0.3, ease: "easeOut" }
                        }
                  }
                >
                    <div 
                      className={`
                        w-64 sm:w-72 md:w-80 lg:w-80 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl overflow-hidden
                        ${isCenter 
                          ? 'shadow-2xl shadow-indigo-500/30 ring-2 ring-indigo-400/30' 
                          : 'shadow-xl shadow-slate-900/50'
                        }
                      `}
                    >
                      {/* Enhanced Top Section */}
                      <div className="relative">
                        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 h-24 sm:h-28 md:h-32 relative overflow-hidden">
                          {/* Animated background pattern */}
                          <motion.div
                            className="absolute inset-0 opacity-20"
                            animate={{
                              backgroundPosition: ["0% 0%", "100% 100%"],
                            }}
                            transition={{
                              duration: 20,
                              ease: "linear",
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                            style={{
                              backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)",
                              backgroundSize: "20px 20px"
                            }}
                          />
                          
                          {/* Enhanced curve */}
                          <svg 
                            className="absolute bottom-0 left-0 w-full h-12" 
                            viewBox="0 0 320 48" 
                            fill="none"
                          >
                            <motion.path 
                              d="M0 0 Q80 48 160 24 Q240 0 320 24 L320 48 L0 48 Z" 
                              fill="url(#enhancedGradient)"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 2, ease: "easeInOut" }}
                            />
                            <defs>
                              <linearGradient id="enhancedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#4f46e5" />
                                <stop offset="50%" stopColor="#7c3aed" />
                                <stop offset="100%" stopColor="#2563eb" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                        
                        {/* Enhanced Profile Image */}
                        <div className="absolute -bottom-12 sm:-bottom-14 md:-bottom-16 left-1/2 transform -translate-x-1/2">
                          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-3 sm:border-4 border-white shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                              <FaUser className="text-slate-600 text-xl sm:text-2xl md:text-3xl" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Content */}
                      <div className="pt-16 sm:pt-18 md:pt-20 pb-6 sm:pb-8 px-4 sm:px-6 md:px-8 text-center">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1">
                          {testimonial.name}
                        </h3>
                        
                        <div className="text-indigo-600 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2">
                          {testimonial.role}
                        </div>
                        
                        <div className="text-gray-500 text-xs mb-4 sm:mb-6">
                          {testimonial.company}
                        </div>
                        
                        <div className="mb-4 sm:mb-6">
                          <FaQuoteLeft className="text-indigo-400 text-2xl sm:text-3xl md:text-4xl mx-auto opacity-30" />
                        </div>
                        
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                          {testimonial.text}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Enhanced Navigation Dots */}
        <motion.div 
          className="flex justify-center mt-8 sm:mt-12 md:mt-16 lg:mt-20 space-x-2 sm:space-x-3"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => handleCardClick(index)}
              className="relative group"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            >
              <motion.div
                className={`transition-all duration-500 rounded-full ${
                  index === indexInArrayScope
                    ? 'w-8 h-3 sm:w-10 sm:h-3 md:w-12 md:h-4 bg-gradient-to-r from-indigo-400 via-purple-500 to-blue-500'
                    : 'w-3 h-3 sm:w-4 sm:h-4 bg-white/30 hover:bg-white/50'
                }`}
                layoutId={index === indexInArrayScope ? "activeDot" : undefined}
              >
                {index === indexInArrayScope && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-500 to-blue-500 rounded-full"
                    animate={{
                      opacity: [0.7, 1, 0.7],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.div>
            </motion.button>
          ))}
        </motion.div>

     
      </div>
    </div>
  );
};

export default Testimonials;

// Animation variants for the sliding carousel
const variants = {
  enter: ({ direction }) => {
    return { scale: 0.2, x: direction < 1 ? 50 : -50, opacity: 0 };
  },
  center: ({ slidePosition }) => {
    return {
      ...getCenterXPosition(slidePosition)
    };
  },
  exit: ({ direction }) => {
    return { scale: 0.5, x: 0, opacity: 0 };
  }
};

const getCenterXPosition = (slidePosition) => {
  // Responsive positioning based on screen size
  const isMobile = window.innerWidth < 640;
  const isTablet = window.innerWidth < 1024;
  
  // Adjust distances based on screen size
  const leftRightDistance = isMobile ? 300 : isTablet ? 500 : 800;
  const leftRightCenterDistance = isMobile ? 200 : isTablet ? 350 : 550;
  
  switch (slidePosition) {
    case "left":
      return {
        x: leftRightDistance,
        zIndex: 1,
        scale: isMobile ? 0.4 : 0.5,
        opacity: 0.7
      };
    case "right":
      return {
        x: -leftRightDistance,
        zIndex: 1,
        scale: isMobile ? 0.4 : 0.5,
        opacity: 0.7
      };
    case "leftCenter":
      return {
        x: leftRightCenterDistance,
        zIndex: 2,
        scale: isMobile ? 0.6 : 0.7,
        opacity: 0.8
      };
    case "rightCenter":
      return {
        x: -leftRightCenterDistance,
        zIndex: 2,
        scale: isMobile ? 0.6 : 0.7,
        opacity: 0.8
      };
    case "center":
      return {
        x: 0,
        zIndex: 3,
        scale: 1,
        opacity: 1
      };
    default:
      return {
        x: 0,
        zIndex: 3
      };
  }
};