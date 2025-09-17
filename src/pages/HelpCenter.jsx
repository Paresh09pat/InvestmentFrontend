import { motion } from 'framer-motion';
import { FiShield, FiHelpCircle, FiSearch, FiBookOpen, FiVideo, FiMessageCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const HelpCenter = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const helpCategories = [
    {
      icon: FiBookOpen,
      title: "Getting Started",
      description: "Learn the basics of investing with InvestPro",
      articles: 12,
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: FiShield,
      title: "Account Security",
      description: "Keep your account safe and secure",
      articles: 8,
      color: "from-green-500 to-green-600"
    },
    {
      icon: FiVideo,
      title: "Video Tutorials",
      description: "Watch step-by-step guides",
      articles: 15,
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: FiMessageCircle,
      title: "Trading Support",
      description: "Get help with your investments",
      articles: 20,
      color: "from-orange-500 to-orange-600"
    }
  ];

  const faqs = [
    {
      question: "How do I create an account?",
      answer: "Creating an account is simple! Click the 'Sign Up' button, enter your email address, create a secure password, and verify your email. You'll then be guided through the identity verification process to complete your account setup.",
      category: "Getting Started"
    },
    {
      question: "What documents do I need for verification?",
      answer: "You'll need a government-issued photo ID (driver's license, passport, or national ID) and proof of address (utility bill, bank statement, or official mail). All documents must be clear, readable, and not expired.",
      category: "Account Security"
    },
    {
      question: "How do I make my first investment?",
      answer: "After completing verification, navigate to the 'Invest' section. Choose from our recommended portfolios or create a custom one. Enter your investment amount and confirm your selection. Your investment will be processed within 1-2 business days.",
      category: "Getting Started"
    },
    {
      question: "What are the fees?",
      answer: "We charge a transparent 0.5% annual management fee on your portfolio value. There are no hidden fees, no trading commissions, and no account maintenance fees. You only pay when you make money.",
      category: "Trading Support"
    },
    {
      question: "How do I withdraw my money?",
      answer: "To withdraw funds, go to your dashboard, click 'Withdraw', enter the amount, and select your withdrawal method. Most withdrawals are processed within 1-3 business days. There are no withdrawal fees.",
      category: "Trading Support"
    },
    {
      question: "Is my money safe?",
      answer: "Yes! We use bank-level security with 256-bit SSL encryption, multi-factor authentication, and are regulated by top financial authorities. Your funds are held in segregated accounts and are insured up to $250,000.",
      category: "Account Security"
    },
    {
      question: "Can I change my investment strategy?",
      answer: "Absolutely! You can modify your portfolio allocation at any time through your dashboard. Changes take effect within 1-2 business days. You can also switch between different risk levels or investment themes.",
      category: "Trading Support"
    },
    {
      question: "What if I need help?",
      answer: "We offer 24/7 customer support via live chat, email, and phone. You can also browse our comprehensive help center, watch video tutorials, or schedule a call with our investment specialists.",
      category: "Getting Started"
    }
  ];

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Navbar />
      
      {/* Background Elements */}
      <motion.div 
        className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute top-40 right-20 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
          x: [0, -40, 0],
          y: [0, 40, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute bottom-20 left-1/3 w-36 h-36 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, -180, -360],
          x: [0, 60, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      {/* Header */}
      <motion.div 
        className="relative z-10 pt-20 pb-16"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Back Button */}
          <motion.div 
            className="mb-8"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Link 
              to="/"
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300"
            >
              <motion.div
                whileHover={{ x: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                ← Back to Home
              </motion.div>
            </Link>
          </motion.div>

          {/* Logo and Title */}
          <motion.div 
            className="flex items-center justify-center space-x-4 mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 200 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-2xl"
              whileHover={{ 
                scale: 1.1,
                rotate: 5,
                transition: { type: "spring", stiffness: 300 }
              }}
            >
              <FiShield className="h-12 w-12 text-white" />
            </motion.div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Help Center
            </h1>
          </motion.div>

          <motion.p 
            className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Find answers, tutorials, and support to help you 
            <span className="text-white font-semibold"> succeed with InvestPro</span>.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            className="max-w-2xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for help articles, FAQs, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white/20 transition-all duration-300"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Help Categories */}
      <motion.section 
        className="relative z-10 py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Browse by Category
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Find the help you need organized by topic
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
          >
            {helpCategories.map((category, index) => (
              <motion.div 
                key={category.title}
                className="text-center"
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl h-full"
                  whileHover={{ 
                    boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
                    borderColor: "rgba(59, 130, 246, 0.5)"
                  }}
                >
                  <motion.div 
                    className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mx-auto mb-4`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <category.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">{category.title}</h3>
                  <p className="text-gray-300 text-sm mb-3">{category.description}</p>
                  <p className="text-blue-400 font-semibold">{category.articles} articles</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        className="relative z-10 py-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ y: -30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Quick answers to the most common questions
            </p>
          </motion.div>

          <motion.div 
            className="max-w-4xl mx-auto space-y-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {filteredFAQs.map((faq, index) => (
              <motion.div 
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
                variants={itemVariants}
                whileHover={{ 
                  boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)"
                }}
              >
                <motion.button
                  className="w-full p-6 text-left flex justify-between items-center"
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                >
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{faq.question}</h3>
                    <p className="text-sm text-blue-400">{faq.category}</p>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedFAQ === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiChevronDown className="h-5 w-5 text-gray-400" />
                  </motion.div>
                </motion.button>
                
                <motion.div
                  initial={false}
                  animate={{ 
                    height: expandedFAQ === index ? "auto" : 0,
                    opacity: expandedFAQ === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Support Section */}
      <motion.section 
        className="relative z-10 py-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-white/20 shadow-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div 
              className="flex items-center justify-center space-x-3 mb-6"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            >
              <FiHelpCircle className="h-8 w-8 text-blue-400" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Still Need Help?
              </h2>
            </motion.div>
            <motion.p 
              className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Can't find what you're looking for? Our support team is here to help you 24/7.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Support
              </motion.button>
              <motion.button 
                className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors duration-300"
                whileHover={{ 
                  scale: 1.05,
                  borderColor: "rgba(59, 130, 246, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule a Call
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <Footer />
    </motion.div>
  );
};

export default HelpCenter;
