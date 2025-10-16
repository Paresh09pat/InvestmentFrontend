import { motion } from 'framer-motion';
import { FiShield, FiFileText, FiCalendar, FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
          

const Terms = () => {
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
      title: "1. Acceptance of Terms",
      content: "By accessing and using Trdexa services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
    },
    {
      title: "2. Description of Service",
      content: "Trdexa provides investment management services, portfolio management, and financial advisory services through our digital platform. We offer access to various investment instruments including stocks, bonds, ETFs, and other securities."
    },
    {
      title: "3. User Responsibilities",
      content: "Users are responsible for providing accurate information during registration, maintaining the security of their account credentials, and complying with all applicable laws and regulations. Users must be at least 18 years old and have the legal capacity to enter into investment agreements."
    },
    {
      title: "4. Investment Risks",
      content: "All investments carry risk, including the potential loss of principal. Past performance does not guarantee future results. Users acknowledge that they understand the risks associated with investing and that Trdexa does not guarantee any specific returns or outcomes."
    },
    {
      title: "5. Fees and Charges",
      content: "Trdexa charges a management fee of 0.5% annually on assets under management. Additional fees may apply for certain services. All fees are clearly disclosed before execution. Users agree to pay all applicable fees as outlined in our fee schedule."
    },
    {
      title: "6. Account Security",
      content: "Users are responsible for maintaining the confidentiality of their account information and passwords. Trdexa implements security measures but cannot guarantee absolute security. Users must notify us immediately of any unauthorized access or security breaches."
    },
    {
      title: "7. Privacy and Data Protection",
      content: "We collect and process personal data in accordance with our Privacy Policy and applicable data protection laws. Users consent to the collection, use, and sharing of their information as described in our Privacy Policy."
    },
    {
      title: "8. Prohibited Activities",
      content: "Users may not use our services for illegal activities, money laundering, fraud, or any activities that violate securities laws. Prohibited activities include market manipulation, insider trading, and unauthorized access to our systems."
    },
    {
      title: "9. Limitation of Liability",
      content: "Trdexa's liability is limited to the extent permitted by law. We are not liable for indirect, incidental, or consequential damages. Our total liability shall not exceed the fees paid by the user in the 12 months preceding the claim."
    },
    {
      title: "10. Termination",
      content: "Either party may terminate this agreement at any time. Upon termination, users may withdraw their funds subject to applicable fees and processing times. Trdexa reserves the right to suspend or terminate accounts for violations of these terms."
    },
    {
      title: "11. Governing Law",
      content: "These terms are governed by the laws of the jurisdiction where Trdexa is incorporated. Any disputes shall be resolved through binding arbitration in accordance with the rules of the relevant arbitration association."
    },
    {
      title: "12. Changes to Terms",
      content: "Trdexa reserves the right to modify these terms at any time. Users will be notified of significant changes via email or through our platform. Continued use of our services constitutes acceptance of the modified terms."
    }
  ];

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
              Terms of Service
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
            Please read these terms carefully before using our services. 
            <span className="text-white font-semibold"> By using Trdexa</span>, you agree to be bound by these terms.
          </motion.p>
        </div>
      </motion.div>

      {/* Important Notice */}
      <motion.section 
        className="relative z-10 py-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-2xl p-6 border border-yellow-500/30 shadow-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-start space-x-4">
              <motion.div 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl flex-shrink-0"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <FiAlertCircle className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Important Notice</h3>
                <p className="text-gray-300 leading-relaxed">
                  These terms constitute a legally binding agreement. If you do not agree with any part of these terms, 
                  you must not use our services. We recommend consulting with a legal advisor if you have any questions 
                  about these terms.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Terms Sections */}
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
                    <FiFileText className="h-6 w-6 text-white" />
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



    
    </motion.div>
  );
};

export default Terms;
