import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiShoppingCart, FiClock, FiStar, FiTrendingUp, FiDollarSign, FiTrendingDown } from 'react-icons/fi';
import { FaBitcoin, FaChartLine, FaUniversity } from 'react-icons/fa';
import { BsCalendarEvent } from 'react-icons/bs';
import { MdWorkOutline } from 'react-icons/md';
import { HiOutlineTicket } from 'react-icons/hi';

const WhyChooseUs = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 10,
    hours: 14,
    minutes: 54,
    seconds: 32
  });

  // Investment portfolio slides data
  const slides = [
    {
      id: 1,
      title: "Crypto Investment Portfolio",
      subtitle: "Diversified cryptocurrency investments",
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop",
      dateRange: "15.2%",
      testimonials: [
        { name: "Sarah Johnson", role: "Investor", rating: 5, avatar: "https://i.pravatar.cc/150?img=1" },
        { name: "Michael Chen", role: "Trader", rating: 5, avatar: "https://i.pravatar.cc/150?img=5" },
        { name: "Emma Davis", role: "Analyst", rating: 4, avatar: "https://i.pravatar.cc/150?img=3" }
      ]
    },
    {
      id: 2,
      title: "Forex Trading Strategy",
      subtitle: "Professional forex market management",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop",
      dateRange: "18.7%",
      testimonials: [
        { name: "David Wilson", role: "Investor", rating: 5, avatar: "https://i.pravatar.cc/150?img=8" },
        { name: "Lisa Park", role: "Manager", rating: 4, avatar: "https://i.pravatar.cc/150?img=9" },
        { name: "Tom Anderson", role: "Trader", rating: 5, avatar: "https://i.pravatar.cc/150?img=7" }
      ]
    },
    {
      id: 3,
      title: "Bond Investment Fund",
      subtitle: "Stable returns through government bonds",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=600&fit=crop",
      dateRange: "12.4%",
      testimonials: [
        { name: "Jennifer Liu", role: "Investor", rating: 5, avatar: "https://i.pravatar.cc/150?img=20" },
        { name: "Robert Kim", role: "Analyst", rating: 5, avatar: "https://i.pravatar.cc/150?img=11" },
        { name: "Alice Wong", role: "Manager", rating: 5, avatar: "https://i.pravatar.cc/150?img=21" }
      ]
    }
  ];

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const testimonialPositions = [
    { top: '5%', right: '5%', transform: 'translateY(-50%)' }, // Top left, inside/outside
    { bottom: '5%', right: '5%', transform: 'translateY(50%)' }, // Bottom right, inside/outside
  
    { top: '40%', right: '-15%', transform: 'translateX(50%)' }, // Top right, half outside
   
    { top: '70%', right: '-10%', transform: 'translateX(50%)' } // Bottom right, half outside
  ];

  const StarRating = ({ rating }) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={`w-3 h-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-16 px-4 md:px-8 overflow-visible">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Smart Investment <span className="text-yellow-400">Made Simple</span>
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Grow Your <span className="text-yellow-400">Wealth Today!</span>
              </h2>
              <p className="text-gray-300 mb-8">
                Join thousands of investors earning consistent returns through our expert-managed 
                investment platform. Our professional team invests your funds across diversified 
                portfolios including cryptocurrencies, bonds, and forex markets.
              </p>
            </div>

            {/* Investment Package Section */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FiTrendingUp className="text-2xl text-yellow-400" />
                <h3 className="text-xl font-semibold">Investment Packages</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Minimum Investment</p>
                  <p className="text-2xl font-bold">
                    <span className="text-cyan-400">$100</span> USD
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Expected Returns</p>
                  <p className="text-2xl font-bold">12-18% <span className="text-green-400">APY</span></p>
                </div>
              </div>

              {/* Investment Instruments */}
              <div className="space-y-3">
                <p className="text-sm text-gray-400">Investment Instruments</p>
                <div className="grid grid-cols-3 gap-2">
                  <motion.div 
                    className="bg-white/5 rounded-lg p-3 text-center hover:bg-white/10 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <FaBitcoin className="text-xl text-orange-400 mx-auto mb-1" />
                    </motion.div>
                    <p className="text-xs text-gray-400">Crypto</p>
                  </motion.div>
                  <motion.div 
                    className="bg-white/5 rounded-lg p-3 text-center hover:bg-white/10 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <FaChartLine className="text-xl text-blue-400 mx-auto mb-1" />
                    </motion.div>
                    <p className="text-xs text-gray-400">Forex</p>
                  </motion.div>
                  <motion.div 
                    className="bg-white/5 rounded-lg p-3 text-center hover:bg-white/10 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <FaUniversity className="text-xl text-green-400 mx-auto mb-1" />
                    </motion.div>
                    <p className="text-xs text-gray-400">Bonds</p>
                  </motion.div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-shadow"
                >
                  <FiShoppingCart />
                  Start Investing
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-white/10 backdrop-blur py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
                >
                  <FiDownload />
                  View Portfolio
                </motion.button>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="text-center bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 0.5 }}
                  className="inline-block mb-2"
                >
                  <FiTrendingUp className="text-2xl text-cyan-400" />
                </motion.div>
                <motion.h3 
                  className="text-3xl font-bold text-cyan-400 mb-2"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  15K+
                </motion.h3>
                <p className="text-sm text-gray-400">Active investors earning consistent returns</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="text-center bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <motion.div
                  whileHover={{ y: [0, -3, 0] }}
                  transition={{ duration: 0.5 }}
                  className="inline-block mb-2"
                >
                  <FiDollarSign className="text-2xl text-purple-400" />
                </motion.div>
                <motion.h3 
                  className="text-3xl font-bold text-purple-400 mb-2"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  $50M+
                </motion.h3>
                <p className="text-sm text-gray-400">Total assets under management</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="text-center bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotate: [0, 360] }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="inline-block mb-2"
                >
                  <FiTrendingUp className="text-2xl text-pink-400" />
                </motion.div>
                <motion.h3 
                  className="text-3xl font-bold text-pink-400 mb-2"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  16.5%
                </motion.h3>
                <p className="text-sm text-gray-400">Average annual return rate</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="text-center bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="inline-block mb-2"
                >
                  <FiStar className="text-2xl text-yellow-400" />
                </motion.div>
                <motion.h3 
                  className="text-3xl font-bold text-yellow-400 mb-2"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  5+
                </motion.h3>
                <p className="text-sm text-gray-400">Years of successful investment management</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Content - Conference Card */}
          <div className="relative h-[600px] overflow-visible">
            {/* Floating Testimonials - Positioned around the right section */}
            {slides[currentSlide].testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.15, type: "spring", stiffness: 200 }}
                style={testimonialPositions[index]}
                className="absolute bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-2xl min-w-[180px] border border-white/20 z-20"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full border-2 border-white shadow-lg"
                  />
                  <div>
                    <p className="text-gray-900 font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-gray-500 text-xs">{testimonial.role}</p>
                    <StarRating rating={testimonial.rating} />
                  </div>
                </div>
              </motion.div>
            ))}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-full"
              >
                <div className="relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl overflow-hidden h-full">
                  <img 
                    src={slides[currentSlide].image}
                    alt={slides[currentSlide].title}
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-2xl font-bold mb-2">{slides[currentSlide].title}</h3>
                    <p className="text-gray-300 mb-4">{slides[currentSlide].subtitle}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-4xl font-bold text-white/80">
                        {slides[currentSlide].dateRange}
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="flex-1 mx-8">
                        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 5, ease: "linear" }}
                            className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    index === currentSlide ? 'w-8 bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;