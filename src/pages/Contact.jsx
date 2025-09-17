import { motion } from 'framer-motion';
import { FiShield, FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiMessageCircle, FiHeadphones } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

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

  const contactMethods = [
    {
      icon: FiMail,
      title: "Email Support",
      description: "Get help via email",
      contact: "support@investpro.com",
      color: "from-blue-500 to-blue-600",
      delay: 0.1
    },
    {
      icon: FiPhone,
      title: "Phone Support",
      description: "Call us directly",
      contact: "+1 (555) 123-4567",
      color: "from-green-500 to-green-600",
      delay: 0.2
    },
    {
      icon: FiMessageCircle,
      title: "Live Chat",
      description: "Chat with our team",
      contact: "Available 24/7",
      color: "from-purple-500 to-purple-600",
      delay: 0.3
    },
    {
      icon: FiHeadphones,
      title: "Help Center",
      description: "Browse our guides",
      contact: "help.investpro.com",
      color: "from-orange-500 to-orange-600",
      delay: 0.4
    }
  ];

  const offices = [
    {
      city: "New York",
      address: "123 Wall Street, Suite 100",
      phone: "+1 (555) 123-4567",
      hours: "Mon-Fri: 9AM-6PM EST"
    },
    {
      city: "London",
      address: "45 Canary Wharf, Level 20",
      phone: "+44 20 7123 4567",
      hours: "Mon-Fri: 9AM-6PM GMT"
    },
    {
      city: "Singapore",
      address: "88 Marina Bay, Tower 1",
      phone: "+65 6123 4567",
      hours: "Mon-Fri: 9AM-6PM SGT"
    }
  ];

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
              Contact Us
            </h1>
          </motion.div>

          <motion.p 
            className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            We're here to help you succeed. 
            <span className="text-white font-semibold"> Reach out anytime</span> for support, 
            questions, or partnership opportunities.
          </motion.p>
        </div>
      </motion.div>

      {/* Contact Methods */}
      <motion.section 
        className="relative z-10 py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
          >
            {contactMethods.map((method, index) => (
              <motion.div 
                key={method.title}
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
                    className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center mx-auto mb-4`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <method.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">{method.title}</h3>
                  <p className="text-gray-300 text-sm mb-3">{method.description}</p>
                  <p className="text-blue-400 font-semibold">{method.contact}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Form and Office Locations */}
      <motion.section 
        className="relative z-10 py-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div 
              className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              whileHover={{ 
                boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
                scale: 1.02
              }}
            >
              <motion.div 
                className="flex items-center space-x-3 mb-6"
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <motion.div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-xl"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <FiSend className="h-6 w-6 text-white" />
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Send us a Message</h2>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  <label className="block text-white font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white/20 transition-all duration-300"
                    placeholder="Your full name"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  <label className="block text-white font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white/20 transition-all duration-300"
                    placeholder="your.email@example.com"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  <label className="block text-white font-semibold mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white/20 transition-all duration-300"
                    placeholder="What can we help you with?"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                >
                  <label className="block text-white font-semibold mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white/20 transition-all duration-300 resize-none"
                    placeholder="Tell us more about your inquiry..."
                    required
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-2xl"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.4)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1, duration: 0.8 }}
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>

            {/* Office Locations */}
            <motion.div 
              className="space-y-8"
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <motion.div 
                className="flex items-center space-x-3 mb-6"
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <motion.div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <FiMapPin className="h-6 w-6 text-white" />
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Our Offices</h2>
              </motion.div>

              {offices.map((office, index) => (
                <motion.div 
                  key={office.city}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl"
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)"
                  }}
                >
                  <h3 className="text-xl font-bold text-white mb-3">{office.city}</h3>
                  <div className="space-y-2 text-gray-300">
                    <p className="flex items-center space-x-2">
                      <FiMapPin className="h-4 w-4" />
                      <span>{office.address}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <FiPhone className="h-4 w-4" />
                      <span>{office.phone}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <FiClock className="h-4 w-4" />
                      <span>{office.hours}</span>
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
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
              Quick answers to common questions about our platform and services
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              {
                question: "How do I get started with investing?",
                answer: "Simply sign up for an account, complete the verification process, and start with our recommended portfolios. Our AI will guide you through the entire process."
              },
              {
                question: "What are the minimum investment amounts?",
                answer: "You can start investing with as little as $100. We offer flexible investment options to suit all budgets and financial goals."
              },
              {
                question: "How secure is my money?",
                answer: "We use bank-level security with 256-bit encryption, multi-factor authentication, and are regulated by top financial authorities."
              },
              {
                question: "Can I withdraw my money anytime?",
                answer: "Yes, you can withdraw your funds at any time. Most withdrawals are processed within 1-3 business days."
              }
            ].map((faq, index) => (
              <motion.div 
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)"
                }}
              >
                <h3 className="text-lg font-bold text-white mb-3">{faq.question}</h3>
                <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <Footer />
    </motion.div>
  );
};

export default Contact;
