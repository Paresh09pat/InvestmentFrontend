// Home page
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiAward,
  FiShield,
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiZap
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { motion, useInView, useAnimation, useMotionValue, useSpring } from 'framer-motion';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';
import CallToAction from '../components/CallToAction';

const Home = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Refs for Framer Motion animations
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);

  // Enhanced smooth scrolling with momentum
  useEffect(() => {
    // Add smooth scrolling to the document
    document.documentElement.style.scrollBehavior = 'smooth';

    // Track scroll position for scroll-to-top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Framer Motion animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const heroVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-20, 20, -20],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const features = [
    {
      icon: FiShield,
      title: 'Bank-Level Security',
      description: 'Your investments are protected with military-grade encryption and multi-layer security protocols.',
      color: 'from-blue-500 to-cyan-500',
      delay: 0.1
    },
    {
      icon: FiTrendingUp,
      title: 'Premium Returns',
      description: 'Earn up to 18% annual returns with our AI-powered investment strategies and expert analysis.',
      color: 'from-green-500 to-emerald-500',
      delay: 0.2
    },
    {
      icon: FiUsers,
      title: 'Expert Management',
      description: 'Our team of certified financial advisors manages your portfolio with precision and care.',
      color: 'from-purple-500 to-pink-500',
      delay: 0.3
    },
    {
      icon: FiZap,
      title: 'Lightning Fast',
      description: 'Execute trades in milliseconds with our cutting-edge technology and real-time processing.',
      color: 'from-orange-500 to-red-500',
      delay: 0.4
    },
    {
      icon: FiTarget,
      title: 'Smart Analytics',
      description: 'Advanced AI algorithms analyze market trends to maximize your investment potential.',
      color: 'from-indigo-500 to-blue-500',
      delay: 0.5
    },
    {
      icon: FiAward,
      title: 'Award Winning',
      description: 'Recognized as the best investment platform by leading financial institutions worldwide.',
      color: 'from-yellow-500 to-orange-500',
      delay: 0.6
    }
  ];


  return (
    <motion.div
      className="min-h-screen overflow-clip"
      style={{
        scrollBehavior: 'smooth'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >

      {/* Floating Navigation Dots - Desktop Only */}


      {/* Scroll to Top Button */}
      <motion.button
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg z-40 flex items-center justify-center text-white"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: showScrollTop ? 1 : 0,
          opacity: showScrollTop ? 1 : 0
        }}
        whileHover={{
          scale: 1.1,
          rotate: 360,
          transition: { type: "spring", stiffness: 300 }
        }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ↑
        </motion.div>
      </motion.button>

      {/* Hero Section */}
      <Hero />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Testimonials */}
      <Testimonials />

      {/* Call to Action */}
      <CallToAction />
    </motion.div>
  );
};

export default Home;