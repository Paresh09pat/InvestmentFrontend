import { motion } from 'framer-motion';
import { FiShield, FiHelpCircle, FiSearch, FiBookOpen, FiVideo, FiMessageCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useState } from 'react';
  

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
      description: "Learn the basics of investing with Trdexa",
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
      answer: "Creating an account is simple! Click the 'Sign Up' button, enter your name, email address, phone number, and create a secure password. After registration, you'll need to complete your profile verification by uploading required documents to start investing.",
      category: "Getting Started"
    },
    {
      question: "What documents do I need for verification?",
      answer: "You need to upload two documents: Aadhaar Card and PAN Card. Both documents must be clear, readable, and not expired. Upload them through your Profile page, and our admin team will verify them within 24-48 hours.",
      category: "Account Security"
    },
    {
      question: "How do I make my first investment?",
      answer: "After completing verification, go to the 'Invest' section. Choose a membership tier (Silver, Gold, or Platinum), select a trader, enter your investment amount, and make payment using the provided QR code. Upload your payment screenshot and transaction ID to complete the process.",
      category: "Getting Started"
    },
    {
      question: "What are the fees?",
      answer: "We have transparent pricing with no hidden fees. Each membership tier has different minimum investment amounts and return rates. There are no management fees, trading commissions, or account maintenance charges. You only pay the investment amount you choose.",
      category: "Trading Support"
    },
    {
      question: "How do I withdraw my money?",
      answer: "To withdraw funds, go to your dashboard and click 'Withdraw'. Select the investment plan you want to withdraw returns from, enter the amount, provide your wallet address, and submit the request. Withdrawals are processed within 1-3 business days after admin approval.",
      category: "Trading Support"
    },
    {
      question: "Is my money safe?",
      answer: "Yes! We use bank-level security with 256-bit SSL encryption and secure authentication. Your personal information and documents are protected with advanced security measures. All transactions are monitored and verified by our admin team.",
      category: "Account Security"
    },
    {
      question: "Can I change my investment strategy?",
      answer: "You can make new investments anytime by selecting different membership tiers and traders. Each investment is independent, so you can diversify across multiple plans and traders to optimize your returns based on your risk preference.",
      category: "Trading Support"
    },
    {
      question: "What if I need help?",
      answer: "We provide comprehensive support through our help center, contact forms, and admin assistance. You can also check your investment status, transaction history, and account details anytime through your dashboard.",
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

  


      {/* FAQ Section */}
      <motion.section 
        className="relative z-10 py-22"
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



    </motion.div>
  );
};

export default HelpCenter;
