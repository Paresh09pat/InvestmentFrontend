import { motion } from 'framer-motion';
import { FiShield } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Footer = () => {
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

  return (
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
  );
};

export default Footer;
