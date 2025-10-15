import React from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { FaUser, FaSignInAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Hero = () => {
  const { scrollYProgress } = useScroll();
  const { isAuthenticated } = useAuth();

  // Transform scroll progress into various animation values
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const backgroundOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1, 0.8, 0.6]
  );
  const solarSystemScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1, 0.8, 0.6]
  );
  const solarSystemRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [1, 1, 0.8, 0]
  );

  // Ring rotation speeds - slower by default, faster when scrolling
  const outerRingSpeed = useTransform(scrollYProgress, [0, 1], [30, 8]);
  const middleRingSpeed = useTransform(scrollYProgress, [0, 1], [25, 6]);
  const innerRingSpeed = useTransform(scrollYProgress, [0, 1], [20, 5]);
  const innermostRingSpeed = useTransform(scrollYProgress, [0, 1], [15, 4]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background pattern with scroll animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"
        style={{ y: backgroundY, opacity: backgroundOpacity }}
      ></motion.div>

      {/* Left decorative SVG - Hidden on mobile, visible on larger screens */}
      <motion.svg
        className="absolute left-2 sm:left-4 md:left-8 top-[90%] w-32 h-48 sm:w-48 sm:h-72 md:w-64 md:h-96 -translate-y-1/2 z-0 rotate-90 hidden sm:block"
        viewBox="0 0 200 300"
        fill="none"
        animate={{
          y: [-20, 20, -20],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.path
          d="M20 50 Q80 100 40 150 Q100 200 60 250"
          stroke="url(#threadGradient)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          animate={{
            pathLength: [0, 1, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            pathLength: { duration: 3, repeat: Infinity },
            opacity: { duration: 2, repeat: Infinity },
          }}
        />
        <motion.circle
          cx="20"
          cy="50"
          r="4"
          fill="#3b82f6"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
        <defs>
          <linearGradient
            id="threadGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Additional curved thread on right - Hidden on mobile, visible on larger screens */}
      <motion.svg
        className="absolute right-2 sm:right-4 md:right-8 top-[10%] w-24 h-32 sm:w-36 sm:h-48 md:w-48 md:h-64 z-0 hidden sm:block"
        viewBox="0 0 150 200"
        fill="none"
        animate={{
          y: [15, -15, 15],
          x: [-10, 10, -10],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.path
          d="M130 30 Q70 80 110 130 Q50 180 90 220"
          stroke="url(#threadGradient2)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          animate={{
            pathLength: [1, 0, 1],
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            pathLength: { duration: 4, repeat: Infinity },
            opacity: { duration: 3, repeat: Infinity },
          }}
        />
        <defs>
          <linearGradient
            id="threadGradient2"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Floating particles with scroll animation */}

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 flex items-center min-h-screen mt-10 md:mt-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          {/* Left Content with scroll animation */}
          <motion.div
            className="text-white space-y-8"
            style={{ y: textY, opacity: textOpacity }}
          >
            {/* Header badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-2 sm:space-x-3 bg-blue-600/20 backdrop-blur-sm rounded-full px-3 py-2 sm:px-4 w-fit border border-blue-400/30"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">
                  X
                </span>
              </div>
              <span className="text-blue-300 text-xs sm:text-sm font-medium">
                One step solution for all investment
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className=""
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Your Gateway to{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  FOREX, CFD
                </span>
                <br />
                and{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  CRYPTOCURRENCY
                </span>
                <br />
                Mutual Index Funds!
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-gray-300 text-base sm:text-lg max-w-lg leading-relaxed"
            >
              A smart platform for diversified, expert-managed investments in
              Forex, CFDs, and cryptocurrencies.
            </motion.p>

            {/* CTA Buttons - Only show when user is not authenticated */}
            {!isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4"
              >
                <Link to="/login">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 sm:px-8 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 cursor-pointer">
                    <FaSignInAlt className="text-sm" />
                    <span>Sign In</span>
                  </button>
                </Link>

                <Link to="/signup">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 sm:px-8 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 cursor-pointer">
                    <FaUser className="text-sm" />
                    <span>Sign Up</span>
                  </button>
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Right Content - Animated Solar System */}
          <div className="relative flex justify-center items-center">
            {/* Stats Cards with scroll animation - Hidden on mobile, visible on larger screens */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 md:right-8 bg-blue-600/20 backdrop-blur-md rounded-lg p-2 sm:p-3 md:p-4 border border-blue-400/30 z-10 hidden sm:block"
              style={{
                y: useTransform(scrollYProgress, [0, 1], [0, -100]),
                opacity: useTransform(
                  scrollYProgress,
                  [0, 0.3, 0.7, 1],
                  [1, 1, 0.8, 0]
                ),
              }}
            >
              <div className="text-blue-300 text-xs sm:text-sm font-medium mb-1">
                Total Funds Traded
              </div>
              <div className="text-white text-sm sm:text-lg md:text-xl font-bold">
                $3,820,633,321
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute top-16 sm:top-24 md:top-32 left-2 sm:left-4 md:left-8 bg-blue-600/20 backdrop-blur-md rounded-lg p-2 sm:p-3 md:p-4 border border-blue-400/30 z-10 hidden sm:block"
              style={{
                y: useTransform(scrollYProgress, [0, 1], [0, -80]),
                opacity: useTransform(
                  scrollYProgress,
                  [0, 0.3, 0.7, 1],
                  [1, 1, 0.8, 0]
                ),
              }}
            >
              <div className="text-blue-300 text-xs sm:text-sm font-medium mb-1">
                Active Client
              </div>
              <div className="text-white text-sm sm:text-lg md:text-xl font-bold">
                4,236,308
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute bottom-16 sm:bottom-24 md:bottom-32 right-2 sm:right-4 md:right-8 bg-blue-600/20 backdrop-blur-md rounded-lg p-2 sm:p-3 md:p-4 border border-blue-400/30 z-10 hidden sm:block"
              style={{
                y: useTransform(scrollYProgress, [0, 1], [0, -60]),
                opacity: useTransform(
                  scrollYProgress,
                  [0, 0.3, 0.7, 1],
                  [1, 1, 0.8, 0]
                ),
              }}
            >
              <div className="text-blue-300 text-xs sm:text-sm font-medium mb-1">
                Partners Earned
              </div>
              <div className="text-white text-sm sm:text-lg md:text-xl font-bold">
                $2,125,616,729
              </div>
            </motion.div>

            {/* Solar System Animation with scroll effects */}
            <motion.div
              className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96"
              style={{
                scale: solarSystemScale,
                rotate: solarSystemRotate,
              }}
            >
              {/* Outer ring with orbiting circles */}
              <div className="absolute inset-0">
                <motion.div
                  className="w-full h-full border-2 border-blue-400/20 rounded-full relative"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {/* Circles on outer ring */}
                  {[0, 90, 180, 270].map((angle, i) => {
                    const circleSize = 16; // 4 * 4px (w-4 h-4)
                    const radius = 192 - circleSize / 2; // Adjust for circle center
                    const x = Math.cos((angle * Math.PI) / 180) * radius;
                    const y = Math.sin((angle * Math.PI) / 180) * radius;

                    return (
                      <motion.div
                        key={`outer-${i}`}
                        className="absolute w-4 h-4"
                        style={{
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                          transform: "translate(-50%, -50%)",
                        }}
                        animate={{
                          opacity: [0.3, 1, 0.3],
                          //   scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                          opacity: { duration: 2 + i * 0.5, repeat: Infinity },
                          //   scale: { duration: 3 + i * 0.3, repeat: Infinity },
                        }}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg" />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              {/* Middle ring with orbiting circles */}
              <div className="absolute inset-8">
                <motion.div
                  className="w-full h-full border-2 border-purple-400/30 rounded-full relative"
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {/* Circles on middle ring */}
                  {[45, 135, 225, 315].map((angle, i) => {
                    const circleSize = 12; // 3 * 4px (w-3 h-3)
                    const radius = 160 - circleSize / 2; // Adjust for circle center
                    const x = Math.cos((angle * Math.PI) / 180) * radius;
                    const y = Math.sin((angle * Math.PI) / 180) * radius;

                    return (
                      <motion.div
                        key={`middle-${i}`}
                        className="absolute w-3 h-3 z-10"
                        style={{
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                          transform: "translate(-50%, -50%)",
                        }}
                        animate={{
                          opacity: [0.4, 1, 0.4],
                          //   scale: [0.7, 1.3, 0.7],
                        }}
                        transition={{
                          opacity: {
                            duration: 1.8 + i * 0.4,
                            repeat: Infinity,
                          },
                          //   scale: { duration: 2.5 + i * 0.2, repeat: Infinity },
                        }}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 rounded-full shadow-lg" />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              {/* Inner ring with orbiting circles */}
              <div className="absolute inset-16">
                <motion.div
                  className="w-full h-full border-2 border-cyan-400/25 rounded-full relative"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {/* Circles on inner ring */}
                  {[0, 120, 240].map((angle, i) => {
                    const circleSize = 10; // 2.5 * 4px (w-2.5 h-2.5)
                    const radius = 128 - circleSize / 2; // Adjust for circle center
                    const x = Math.cos((angle * Math.PI) / 180) * radius;
                    const y = Math.sin((angle * Math.PI) / 180) * radius;

                    return (
                      <motion.div
                        key={`inner-${i}`}
                        className="absolute w-2.5 h-2.5"
                        style={{
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                          transform: "translate(-50%, -50%)",
                        }}
                        animate={{
                          opacity: [0.5, 1, 0.5],
                          //   scale: [0.6, 1.4, 0.6],
                        }}
                        transition={{
                          opacity: {
                            duration: 1.5 + i * 0.3,
                            repeat: Infinity,
                          },
                          //   scale: { duration: 2 + i * 0.1, repeat: Infinity },
                        }}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full shadow-lg" />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              {/* Innermost ring with small orbiting circles */}
              <div className="absolute inset-24">
                <motion.div
                  className="w-full h-full border border-yellow-400/20 rounded-full relative"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  {/* Circles on innermost ring */}
                  {[60, 180, 300].map((angle, i) => {
                    const circleSize = 8; // 2 * 4px (w-2 h-2)
                    const radius = 96 - circleSize / 2; // Adjust for circle center
                    const x = Math.cos((angle * Math.PI) / 180) * radius;
                    const y = Math.sin((angle * Math.PI) / 180) * radius;

                    return (
                      <motion.div
                        key={`innermost-${i}`}
                        className="absolute w-2 h-2"
                        style={{
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                          transform: "translate(-50%, -50%)",
                        }}
                        animate={{
                          opacity: [0.6, 1, 0.6],
                          //   scale: [0.5, 1.5, 0.5],
                        }}
                        transition={{
                          opacity: {
                            duration: 1.2 + i * 0.2,
                            repeat: Infinity,
                          },
                          //   scale: { duration: 1.8 + i * 0.1, repeat: Infinity },
                        }}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg" />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              {/* Central logo with scroll animation */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  scale: useTransform(
                    scrollYProgress,
                    [0, 0.5, 1],
                    [1, 1.1, 1.2]
                  ),
                  opacity: useTransform(
                    scrollYProgress,
                    [0, 0.7, 1],
                    [1, 0.9, 0.7]
                  ),
                }}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl border-2 sm:border-4 border-white/20 relative z-10">
                  <span className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                    X
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Partners section with scroll animation - Hidden on mobile, visible on larger screens */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 text-center hidden sm:block"
        style={{
          y: useTransform(scrollYProgress, [0, 1], [0, -200]),
          opacity: useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]),
        }}
      >
        <div className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-4">
          Our Trading Partners
        </div>
        <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-8 text-gray-500">
          <div className="font-semibold text-xs sm:text-sm">eToro</div>
          <div className="font-semibold text-xs sm:text-sm">Kraken</div>
          <div className="font-semibold text-xs sm:text-sm">3Commas</div>
          <div className="font-semibold text-xs sm:text-sm">FXCM</div>
          <div className="font-semibold text-xs sm:text-sm">Huobi</div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
