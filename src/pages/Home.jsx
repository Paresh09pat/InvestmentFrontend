// Home page
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiShield, 
  FiTrendingUp, 
  FiUsers,
  FiStar,
  FiArrowRight,
  FiCheck,
  FiPlay,
  FiZap,
  FiTarget,
  FiAward,
  FiChevronDown,
  FiGlobe,
  FiLock,
  FiClock
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { motion, useInView, useAnimation, useMotionValue, useSpring } from 'framer-motion';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    investments: 0,
    returns: 0
  });
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Refs for Framer Motion animations
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);
  
  // Framer Motion hooks
  
  // Mouse position for interactive effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { damping: 15 });

  // Animate numbers on load
  useEffect(() => {
    const targets = { users: 10000, investments: 50000000, returns: 15 };
    const duration = 2000;
    const intervals = [];

    Object.keys(targets).forEach(key => {
      const target = targets[key];
      const increment = target / (duration / 50);
      let current = 0;

      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        setAnimatedStats(prev => ({
          ...prev,
          [key]: Math.floor(current)
        }));
      }, 50);

      intervals.push(interval);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

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

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Business Owner',
      content: 'InvestPro helped me grow my savings significantly. The returns are excellent and the platform is very user-friendly.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Software Engineer',
      content: 'I love the transparency and regular updates. My investments have grown by 15% in just 6 months.',
      rating: 5
    },
    {
      name: 'Emma Davis',
      role: 'Teacher',
      content: 'The customer support is amazing and the investment process is so simple. Highly recommended!',
      rating: 5
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
    
      <Navbar />
      
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
      <motion.section 
        ref={testimonialsRef} 
        className="py-32 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-10"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div 
            className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full blur-3xl opacity-10"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12 sm:mb-16 lg:mb-20"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-4 sm:mb-6 px-4"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            >
              What Our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Investors</span> Say
            </motion.h2>
            <motion.p 
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto px-4"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Join thousands of satisfied investors who have transformed their financial future with us.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index} 
                variants={itemVariants}
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 300 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                hover 
                  className="relative overflow-hidden border-0 shadow-2xl bg-white/10 backdrop-blur-lg h-full"
              >
                {/* Gradient Border */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-[1px]"
                    whileHover={{ 
                      background: "linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3))"
                    }}
                  >
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl h-full w-full" />
                  </motion.div>
                
                <div className="relative z-10 p-6 sm:p-8">
                    <motion.div 
                      className="flex items-center mb-4 sm:mb-6"
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                    {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: -180 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          viewport={{ once: true }}
                          transition={{ 
                            delay: index * 0.1 + 0.3 + i * 0.1,
                            type: "spring",
                            stiffness: 200
                          }}
                        >
                          <FiStar className="text-yellow-400 fill-current" size={20} />
                        </motion.div>
                      ))}
                    </motion.div>
                    
                    <motion.p 
                      className="text-gray-200 mb-6 sm:mb-8 italic text-base sm:text-lg leading-relaxed"
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                    >
                  "{testimonial.content}"
                    </motion.p>
                    
                    <motion.div 
                      className="flex items-center"
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      <motion.div 
                        className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3 sm:mr-4 shadow-lg"
                        whileHover={{ 
                          scale: 1.1,
                          rotate: 5,
                          transition: { type: "spring", stiffness: 300 }
                        }}
                      >
                      <span className="text-white font-bold text-lg sm:text-xl">
                      {testimonial.name.charAt(0)}
                    </span>
                      </motion.div>
                  <div>
                      <div className="font-bold text-white text-lg sm:text-xl">{testimonial.name}</div>
                      <div className="text-gray-300 text-sm sm:text-base">{testimonial.role}</div>
                    </div>
                    </motion.div>
                </div>
              </Card>
              </motion.div>
            ))}
          </motion.div>
          </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        ref={ctaRef} 
        className="py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 relative"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div 
            className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-6 sm:mb-8 px-4"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Ready to Transform Your <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Financial Future?</span>
          </motion.h2>
          
          <motion.p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Join the elite community of smart investors who trust InvestPro for 
            <span className="font-semibold text-white"> secure, profitable, and innovative</span> investment solutions.
          </motion.p>
          
          {!user && (
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
              <Button 
                size="xl" 
                variant="secondary"
                onClick={() => navigate('/signup')}
                icon={<FiArrowRight />}
                  className="transform transition-all duration-300 shadow-2xl bg-white text-purple-600 hover:bg-gray-100"
              >
                Start Your Journey Today
              </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
              <Button 
                size="xl" 
                variant="outline"
                  className="text-white border-2 border-white hover:bg-white hover:text-purple-600 transform transition-all duration-300"
                onClick={() => navigate('/login')}
              >
                Access Your Account
              </Button>
              </motion.div>
            </motion.div>
          )}
          
          {/* Trust Indicators */}
          <motion.div 
            className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto px-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              { value: "99.9%", label: "Uptime" },
              { value: "256-bit", label: "Encryption" },
              { value: "24/7", label: "Support" },
              { value: "$0", label: "Hidden Fees" }
            ].map((indicator, index) => (
              <motion.div 
                key={index}
                className="text-center"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.1,
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                <motion.div 
                  className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  {indicator.value}
                </motion.div>
                <div className="text-blue-200 text-xs sm:text-sm lg:text-base">{indicator.label}</div>
              </motion.div>
            ))}
          </motion.div>
            </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="bg-gradient-to-br from-gray-900 to-black text-white py-16 relative"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Background Pattern */}
        <motion.div 
          className="absolute inset-0 opacity-20" 
          style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23374151' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div 
              className="col-span-1 sm:col-span-2 lg:col-span-2"
              variants={itemVariants}
            >
              <motion.div 
                className="flex items-center space-x-3 mb-4 sm:mb-6"
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <motion.div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 sm:p-3 rounded-xl shadow-lg"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                >
                  <FiShield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </motion.div>
                <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">InvestPro</span>
              </motion.div>
              
              <motion.p 
                className="text-gray-400 mb-4 sm:mb-6 max-w-lg text-sm sm:text-base lg:text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Your trusted partner in building wealth through smart investments. 
                <span className="text-white font-semibold">Secure, reliable, and profitable.</span>
              </motion.p>
              
              {/* Social Links */}
              <motion.div 
                className="flex space-x-3 sm:space-x-4"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                {['f', 't', 'in'].map((social, index) => (
                  <motion.div 
                    key={social}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center cursor-pointer"
                    whileHover={{ 
                      scale: 1.2,
                      rotate: 360,
                      transition: { type: "spring", stiffness: 300 }
                    }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: 0.6 + index * 0.1,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    <span className="text-white font-bold text-sm sm:text-base">{social}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <motion.h3 
                className="font-bold text-lg sm:text-xl mb-4 sm:mb-6 text-white"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Quick Links
              </motion.h3>
              <div className="space-y-2 sm:space-y-3">
                {[
                  { to: "/about", text: "About Us" },
                  { to: "/features", text: "Features" },
                  { to: "/contact", text: "Contact" },
                  { to: "/blog", text: "Blog" }
                ].map((link, index) => (
                  <motion.div
                    key={link.text}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.8 }}
                  >
                    <Link 
                      to={link.to} 
                      className="text-gray-400 hover:text-white block transition-colors duration-300 text-sm sm:text-base"
                    >
                      <motion.span
                        whileHover={{ x: 8 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {link.text}
                      </motion.span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <motion.h3 
                className="font-bold text-lg sm:text-xl mb-4 sm:mb-6 text-white"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Support
              </motion.h3>
              <div className="space-y-2 sm:space-y-3">
                {[
                  { to: "/help", text: "Help Center" },
                  { to: "/terms", text: "Terms of Service" },
                  { to: "/privacy", text: "Privacy Policy" },
                  { to: "/security", text: "Security" }
                ].map((link, index) => (
                  <motion.div
                    key={link.text}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.8 }}
                  >
                    <Link 
                      to={link.to} 
                      className="text-gray-400 hover:text-white block transition-colors duration-300 text-sm sm:text-base"
                    >
                      <motion.span
                        whileHover={{ x: 8 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {link.text}
                      </motion.span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <motion.p 
                className="text-gray-400 text-center md:text-left text-sm sm:text-base"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
              © 2024 InvestPro. All rights reserved. Built with ❤️ for smart investors.
              </motion.p>
              <motion.div 
                className="flex items-center space-x-2"
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <span className="text-gray-400 text-sm sm:text-base">Secured by</span>
                <motion.div 
                  className="flex items-center space-x-1"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FiShield className="text-green-500" size={14} />
                  <span className="text-green-500 font-semibold text-sm sm:text-base">SSL</span>
                </motion.div>
              </motion.div>
                </div>
          </motion.div>
              </div>
      </motion.footer>
    </motion.div>
  );
};

export default Home;