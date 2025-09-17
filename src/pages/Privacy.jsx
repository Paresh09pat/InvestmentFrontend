import { motion } from 'framer-motion';
import { FiShield, FiLock, FiEye, FiDatabase, FiUserCheck, FiCalendar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
  

const Privacy = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const sections = [
    {
      title: "1. Information We Collect",
      content: "We collect personal information you provide directly to us, such as when you create an account, make investments, or contact us. This includes your name, email address, phone number, financial information, and government-issued identification documents.",
      icon: FiDatabase
    },
    {
      title: "2. How We Use Your Information",
      content: "We use your information to provide our services, process transactions, verify your identity, comply with legal obligations, improve our services, and communicate with you about your account and our services.",
      icon: FiUserCheck
    },
    {
      title: "3. Information Sharing",
      content: "We do not sell your personal information. We may share your information with service providers who assist us in operating our platform, with regulatory authorities as required by law, and in connection with business transfers or legal proceedings.",
      icon: FiShield
    },
    {
      title: "4. Data Security",
      content: "We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and access controls. However, no method of transmission over the internet is 100% secure.",
      icon: FiLock
    },
    {
      title: "5. Your Rights",
      content: "You have the right to access, update, or delete your personal information. You can also opt out of certain communications and request data portability. Contact us to exercise these rights.",
      icon: FiEye
    },
    {
      title: "6. Cookies and Tracking",
      content: "We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie settings through your browser preferences.",
      icon: FiDatabase
    },
    {
      title: "7. Data Retention",
      content: "We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Financial records are typically retained for 7 years.",
      icon: FiCalendar
    },
    {
      title: "8. International Transfers",
      content: "Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information during such transfers.",
      icon: FiShield
    },
    {
      title: "9. Children's Privacy",
      content: "Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware of such collection, we will delete the information promptly.",
      icon: FiUserCheck
    },
    {
      title: "10. Changes to This Policy",
      content: "We may update this Privacy Policy from time to time. We will notify you of any material changes via email or through our platform. Your continued use of our services constitutes acceptance of the updated policy.",
      icon: FiCalendar
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

      {/* Header */}
      <motion.div 
        className="relative z-10 pt-20 pb-16"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">


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
              Privacy Policy
            </h1>
          </motion.div>

          <motion.div 
            className="flex items-center justify-center space-x-4 mb-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <FiCalendar className="h-6 w-6 text-gray-400" />
            <p className="text-lg text-gray-300">Last updated: December 2024</p>
          </motion.div>

          <motion.p 
            className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Your privacy is important to us. This policy explains how we collect, 
            <span className="text-white font-semibold"> use, and protect</span> your personal information.
          </motion.p>
        </div>
      </motion.div>

      {/* Privacy Commitment */}
      <motion.section 
        className="relative z-10 py-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-md rounded-2xl p-6 border border-green-500/30 shadow-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-start space-x-4">
              <motion.div 
                className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-xl flex-shrink-0"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <FiLock className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Our Privacy Commitment</h3>
                <p className="text-gray-300 leading-relaxed">
                  We are committed to protecting your privacy and personal information. We use industry-standard 
                  security measures and follow best practices to ensure your data is safe and secure. We never 
                  sell your personal information to third parties.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Privacy Sections */}
      <motion.section 
        className="relative z-10 py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="space-y-8"
            variants={containerVariants}
          >
            {sections.map((section, index) => (
              <motion.div 
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)"
                }}
              >
                <motion.div 
                  className="flex items-start space-x-4"
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                >
                  <motion.div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl flex-shrink-0"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <section.icon className="h-6 w-6 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                      {section.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                      {section.content}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Data Rights */}
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
              Your Data Rights
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              You have control over your personal information
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              {
                title: "Access Your Data",
                description: "Request a copy of all personal information we have about you",
                icon: FiEye,
                color: "from-blue-500 to-blue-600"
              },
              {
                title: "Update Information",
                description: "Correct or update your personal information at any time",
                icon: FiUserCheck,
                color: "from-green-500 to-green-600"
              },
              {
                title: "Delete Account",
                description: "Request deletion of your account and associated data",
                icon: FiDatabase,
                color: "from-red-500 to-red-600"
              },
              {
                title: "Data Portability",
                description: "Export your data in a machine-readable format",
                icon: FiShield,
                color: "from-purple-500 to-purple-600"
              },
              {
                title: "Opt Out",
                description: "Unsubscribe from marketing communications",
                icon: FiLock,
                color: "from-orange-500 to-orange-600"
              },
              {
                title: "Restrict Processing",
                description: "Limit how we process your personal information",
                icon: FiEye,
                color: "from-pink-500 to-pink-600"
              }
            ].map((right, index) => (
              <motion.div 
                key={right.title}
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
                    className={`w-16 h-16 bg-gradient-to-r ${right.color} rounded-xl flex items-center justify-center mx-auto mb-4`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <right.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-3">{right.title}</h3>
                  <p className="text-gray-300 text-sm">{right.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Information */}
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
              <FiShield className="h-8 w-8 text-blue-400" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Privacy Questions?
              </h2>
            </motion.div>
            <motion.p 
              className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              If you have any questions about this Privacy Policy or want to exercise your rights, 
              please contact our privacy team.
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
                Contact Privacy Team
              </motion.button>
              <motion.button 
                className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors duration-300"
                whileHover={{ 
                  scale: 1.05,
                  borderColor: "rgba(59, 130, 246, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Download Policy
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>


    </motion.div>
  );
};

export default Privacy;
