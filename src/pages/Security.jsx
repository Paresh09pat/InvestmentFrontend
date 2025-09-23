import { motion } from 'framer-motion';
import { FiShield, FiLock, FiEye, FiKey, FiServer, FiCheckCircle, FiAlertTriangle, FiGlobe } from 'react-icons/fi';
import { Link } from 'react-router-dom';
  

const Security = () => {
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

  const securityFeatures = [
    {
      icon: FiLock,
      title: "256-bit SSL Encryption",
      description: "All data transmission is protected with military-grade encryption",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: FiKey,
      title: "Multi-Factor Authentication",
      description: "Additional security layer with SMS, email, and authenticator app support",
      color: "from-green-500 to-green-600"
    },
    {
      icon: FiServer,
      title: "Secure Infrastructure",
      description: "Bank-level security with redundant systems and 99.9% uptime",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: FiEye,
      title: "Real-time Monitoring",
      description: "24/7 security monitoring and threat detection systems",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const complianceStandards = [
    {
      name: "SOC 2 Type II",
      description: "Audited security controls and processes",
      status: "Certified",
      icon: FiCheckCircle
    },
    {
      name: "ISO 27001",
      description: "International information security management standard",
      status: "Certified",
      icon: FiCheckCircle
    },
    {
      name: "PCI DSS",
      description: "Payment card industry data security standards",
      status: "Compliant",
      icon: FiCheckCircle
    },
    {
      name: "GDPR",
      description: "General data protection regulation compliance",
      status: "Compliant",
      icon: FiCheckCircle
    }
  ];  

  const securityTips = [
    {
      title: "Use Strong Passwords",
      description: "Create unique passwords with at least 12 characters, including numbers, symbols, and mixed case letters.",
      icon: FiKey
    },
    {
      title: "Enable 2FA",
      description: "Always enable two-factor authentication for an extra layer of security on your account.",
      icon: FiShield
    },
    {
      title: "Keep Software Updated",
      description: "Regularly update your browser, operating system, and security software to patch vulnerabilities.",
      icon: FiCheckCircle
    },
    {
      title: "Be Wary of Phishing",
      description: "Never click suspicious links or provide personal information to unverified sources.",
      icon: FiAlertTriangle
    },
    {
      title: "Monitor Your Account",
      description: "Regularly review your account activity and report any suspicious transactions immediately.",
      icon: FiEye
    },
    {
      title: "Use Secure Networks",
      description: "Avoid accessing your account from public Wi-Fi networks. Use VPN when necessary.",
      icon: FiGlobe
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
              Security
            </h1>
          </motion.div>

          <motion.p 
            className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Your security is our top priority. We use 
            <span className="text-white font-semibold"> bank-level protection</span> to keep your investments safe.
          </motion.p>
        </div>
      </motion.div>

      {/* Security Features */}
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
              Security Features
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Multi-layered security to protect your investments and personal information
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
          >
            {securityFeatures.map((feature, index) => (
              <motion.div 
                key={feature.title}
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
                    className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-4`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Compliance Standards */}
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
              Compliance & Certifications
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              We meet the highest industry standards for security and compliance
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {complianceStandards.map((standard, index) => (
              <motion.div 
                key={standard.name}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)"
                }}
              >
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-xl"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <standard.icon className="h-6 w-6 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">{standard.name}</h3>
                      <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                        {standard.status}
                      </span>
                    </div>
                    <p className="text-gray-300">{standard.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Security Tips */}
      <motion.section 
        className="relative z-10 py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Security Best Practices
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Help us keep your account secure by following these recommendations
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {securityTips.map((tip, index) => (
              <motion.div 
                key={tip.title}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl"
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
                    <tip.icon className="h-6 w-6 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">{tip.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{tip.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Security Incident Response */}
      <motion.section 
        className="relative z-10 py-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-md rounded-3xl p-8 border border-red-500/30 shadow-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div 
              className="flex items-start space-x-4 mb-6"
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <motion.div 
                className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-xl flex-shrink-0"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <FiAlertTriangle className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Security Incident Response
                </h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  If you suspect unauthorized access to your account or notice any suspicious activity, 
                  please contact our security team immediately. We have a dedicated 24/7 security response 
                  team ready to help protect your account.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button 
                    className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-2xl"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 25px 50px -12px rgba(239, 68, 68, 0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Report Security Issue
                  </motion.button>
                  <motion.button 
                    className="border-2 border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors duration-300"
                    whileHover={{ 
                      scale: 1.05,
                      borderColor: "rgba(59, 130, 246, 0.5)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Emergency Contact
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

     
    </motion.div>
  );
};

export default Security;
