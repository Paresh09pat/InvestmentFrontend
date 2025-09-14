import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { FaArrowRight, FaCheckCircle, FaChartLine, FaWallet, FaShieldAlt, FaUsers } from 'react-icons/fa';

const HowItWorks = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const [activeStep, setActiveStep] = useState(0);

  // Steps data
  const steps = [
    {
      id: 0,
      title: "Sign Up & Verify",
      description: "Create your account in minutes with our streamlined registration process. Complete identity verification for secure trading.",
      details: [
        "Quick registration with email",
        "Identity verification process",
        "Secure account setup",
        "Access to trading dashboard"
      ],
      icon: <FaUsers className="text-4xl text-blue-400" />,
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop&crop=center",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 1,
      title: "Fund Your Account",
      description: "Deposit funds securely using multiple payment methods. Choose from bank transfers, credit cards, or cryptocurrency deposits.",
      details: [
        "Multiple payment options",
        "Instant deposit processing",
        "Secure transaction handling",
        "Real-time balance updates"
      ],
      icon: <FaWallet className="text-4xl text-green-400" />,
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop&crop=center",
      color: "from-green-500 to-green-600"
    },
    {
      id: 2,
      title: "Choose Investment Strategy",
      description: "Select from our expert-curated investment strategies. From conservative to aggressive, find the perfect fit for your goals.",
      details: [
        "Expert-curated strategies",
        "Risk assessment tools",
        "Customizable portfolios",
        "Real-time performance tracking"
      ],
      icon: <FaChartLine className="text-4xl text-purple-400" />,
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop&crop=center",
      color: "from-purple-500 to-purple-600"
    },
    {
      id: 3,
      title: "Start Trading",
      description: "Begin your investment journey with automated trading or manual control. Our AI-powered system optimizes your returns.",
      details: [
        "Automated trading options",
        "Manual trading control",
        "AI-powered optimization",
        "24/7 market monitoring"
      ],
      icon: <FaShieldAlt className="text-4xl text-orange-400" />,
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=400&fit=crop&crop=center",
      color: "from-orange-500 to-orange-600"
    }
  ];

  // Update active step based on scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const stepProgress = Math.floor(latest * steps.length);
      const clampedStep = Math.min(Math.max(stepProgress, 0), steps.length - 1);
      setActiveStep(clampedStep);
    });
    
    return unsubscribe;
  }, [scrollYProgress, steps.length]);

  // Transform scroll progress for animations
  const imageOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 1, 0.8]);

  return (
    <div 
      ref={containerRef}
      className="min-h-[500vh] bg-gradient-to-b from-indigo-900 via-purple-900 to-blue-900 relative"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-purple-900/10"></div>
      
      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 border-2 border-blue-400/20 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-40 right-20 w-16 h-16 border-2 border-purple-400/20 rounded-lg"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-40 left-20 w-12 h-12 border-2 border-cyan-400/20 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      {/* Sticky content container with proper spacing */}
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <div className="container mx-auto px-6 py-20 w-full max-w-7xl">
          {/* Section Header - Fixed */}
          <div className="text-center mt-20 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              How It <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Start your investment journey in just a few simple steps. Our platform makes trading accessible to everyone.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Image Display */}
            <div className="relative h-[600px] rounded-2xl overflow-hidden">
              {/* Step indicators */}
              <div className="absolute top-6 left-6 z-10 flex space-x-2">
                {steps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeStep 
                        ? 'bg-white scale-125' 
                        : 'bg-white/40'
                    }`}
                    animate={{
                      scale: index === activeStep ? 1.25 : 1,
                      opacity: index === activeStep ? 1 : 0.4
                    }}
                  />
                ))}
              </div>

              {/* Main image */}
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full h-full relative"
              >
                <img
                  src={steps[activeStep].image}
                  alt={steps[activeStep].title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${steps[activeStep].color} opacity-20`}></div>
              </motion.div>

              {/* Floating step number */}
              <motion.div
                key={`step-${activeStep}`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`absolute bottom-6 right-6 w-16 h-16 bg-gradient-to-br ${steps[activeStep].color} rounded-full flex items-center justify-center shadow-2xl`}
              >
                <span className="text-white font-bold text-xl">{activeStep + 1}</span>
              </motion.div>
            </div>

            {/* Right Side - Content */}
            <div className="space-y-8">
              {/* Current step content */}
              <motion.div
                key={`content-${activeStep}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Step icon and title */}
                <div className="flex items-center space-x-4 mb-6">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {steps[activeStep].icon}
                  </motion.div>
                  <h3 className="text-3xl font-bold text-white">
                    {steps[activeStep].title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                  {steps[activeStep].description}
                </p>

                {/* Feature list */}
                <div className="space-y-4">
                  {steps[activeStep].details.map((detail, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <FaCheckCircle className="text-green-400 text-lg flex-shrink-0" />
                      <span className="text-gray-300">{detail}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-8"
                >
                  <button className={`bg-gradient-to-r ${steps[activeStep].color} hover:opacity-90 text-white px-8 py-4 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg`}>
                    <span>Get Started</span>
                    <FaArrowRight className="text-sm" />
                  </button>
                </motion.div>
              </motion.div>

              {/* Progress bar */}
              <div className="mt-12">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Step {activeStep + 1} of {steps.length}</span>
                  <span>{Math.round(((activeStep + 1) / steps.length) * 100)}% Complete</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full bg-gradient-to-r ${steps[activeStep].color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </div>

     
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
