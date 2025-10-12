

import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowDown, FaArrowUp, FaBitcoin, FaDollarSign, FaEthereum, FaEuroSign, FaPoundSign, FaYenSign } from 'react-icons/fa';
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { USER_VERIFICATION_STATUS } from '../utils/constants';

const HowItWorks = () => {
  const [mounted, setMounted] = useState(false);
  const [activeTimeframe, setActiveTimeframe] = useState('1 Year');
  const [dataKey, setDataKey] = useState(0); // Key to force re-render of chart data
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isMobile, setIsMobile] = useState(false);  

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Regenerate chart data every 3 seconds for real-time trading feel
  useEffect(() => {
    const interval = setInterval(() => {
      setDataKey(prev => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Regenerate data when timeframe changes
  useEffect(() => {
    setDataKey(prev => prev + 1);
  }, [activeTimeframe]);

  // Generate highly volatile portfolio data like real trading graphs
  const generateVolatileData = (timeframe) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    let data = [];
    let currentValue = 35000;
    let currentStocks = 24500;
    let currentCrypto = 10500;
    
    // Much higher volatility for trading-like movements
    const getRandomVolatility = () => {
      const base = (Math.random() - 0.5) * 0.4; // ±20% base volatility
      const spike = Math.random() < 0.1 ? (Math.random() - 0.5) * 0.3 : 0; // 10% chance of big spike
      return base + spike;
    };
    
    const getTrendMultiplier = () => {
      const trend = Math.random() < 0.6 ? 1.02 : 0.98; // 60% chance up, 40% chance down
      return trend + (Math.random() - 0.5) * 0.04; // Add some randomness
    };
    
    const getMarketShock = () => Math.random() < 0.05 ? (Math.random() - 0.5) * 0.5 : 0; // 5% chance of market shock
    
    // Trading-like momentum and mean reversion
    let momentum = 0;
    const getMomentumEffect = () => {
      momentum = momentum * 0.7 + (Math.random() - 0.5) * 0.3; // Momentum decays but adds new random component
      return momentum * 0.2;
    };
    
    const getMeanReversion = (currentVal, baseVal) => {
      const deviation = (currentVal - baseVal) / baseVal;
      return -deviation * 0.1; // Pull back towards base value
    };
    
    if (timeframe === '1 Year') {
      const baseValue = currentValue;
      for (let i = 0; i < 12; i++) {
        const volatility = getRandomVolatility();
        const trend = getTrendMultiplier();
        const marketShock = getMarketShock();
        const momentum = getMomentumEffect();
        const meanReversion = getMeanReversion(currentValue, baseValue * (1 + i * 0.02));
        
        // Apply all trading effects
        const totalChange = volatility * 0.6 + (trend - 1) * 0.8 + marketShock * 0.4 + momentum + meanReversion;
        currentValue *= (1 + totalChange);
        currentStocks *= (1 + totalChange * 0.7); // Stocks less volatile than crypto
        currentCrypto *= (1 + totalChange * 1.3); // Crypto much more volatile
        
        data.push({
          month: months[i],
          value: Math.round(currentValue),
          stocks: Math.round(currentStocks),
          crypto: Math.round(currentCrypto)
        });
      }
    } else if (timeframe === '6 Month') {
      for (let i = 6; i < 12; i++) {
        const volatility = getRandomVolatility();
        const trend = getTrendMultiplier();
        const marketShock = getMarketShock();
        
        const totalChange = volatility * 0.6 + (trend - 1) * 0.8 + marketShock * 0.4;
        currentValue *= (1 + totalChange);
        currentStocks *= (1 + totalChange * 0.7);
        currentCrypto *= (1 + totalChange * 1.3);
        
        data.push({
          month: months[i],
          value: Math.round(currentValue),
          stocks: Math.round(currentStocks),
          crypto: Math.round(currentCrypto)
        });
      }
    } else if (timeframe === '3 Month') {
      for (let i = 9; i < 12; i++) {
        const volatility = getRandomVolatility();
        const trend = getTrendMultiplier();
        const marketShock = getMarketShock();
        
        const totalChange = volatility * 0.6 + (trend - 1) * 0.8 + marketShock * 0.4;
        currentValue *= (1 + totalChange);
        currentStocks *= (1 + totalChange * 0.7);
        currentCrypto *= (1 + totalChange * 1.3);
        
        data.push({
          month: months[i],
          value: Math.round(currentValue),
          stocks: Math.round(currentStocks),
          crypto: Math.round(currentCrypto)
        });
      }
    } else if (timeframe === 'Weekly') {
      const baseValue = currentValue;
      for (let i = 0; i < 7; i++) {
        const volatility = getRandomVolatility() * 0.8; // Still high volatility for daily trading
        const trend = getTrendMultiplier();
        const marketShock = getMarketShock() * 0.5; // Smaller shocks for daily
        const momentum = getMomentumEffect();
        const meanReversion = getMeanReversion(currentValue, baseValue * (1 + i * 0.01));
        
        // Add intraday patterns (higher volatility on weekdays)
        const isWeekend = i >= 5; // Saturday, Sunday
        const intradayVolatility = isWeekend ? 0.5 : 1.2;
        
        const totalChange = (volatility * 0.4 + (trend - 1) * 0.6 + marketShock * 0.3 + momentum + meanReversion) * intradayVolatility;
        currentValue *= (1 + totalChange);
        currentStocks *= (1 + totalChange * 0.6);
        currentCrypto *= (1 + totalChange * 1.1);
        
        data.push({
          day: days[i],
          value: Math.round(currentValue),
          stocks: Math.round(currentStocks),
          crypto: Math.round(currentCrypto)
        });
      }
    }
    
    return data;
  };

  const getPortfolioData = (timeframe) => {
    return generateVolatileData(timeframe);
  };

  const portfolioData = getPortfolioData(activeTimeframe);
  
  // Add dataKey to force re-render when data changes
  const chartData = portfolioData.map((item, index) => ({
    ...item,
    key: `${dataKey}-${index}`
  }));

  const pieData = [
    { name: 'Stocks', value: 35, color: '#3B82F6', amount: 15594 }, // Blue from Hero
    { name: 'Crypto', value: 25, color: '#8B5CF6', amount: 11138 }, // Purple from Hero
    { name: 'Forex', value: 20, color: '#06B6D4', amount: 8911 }, // Cyan from Hero
    { name: 'Bonds', value: 15, color: '#F59E0B', amount: 6683 }, // Amber
    { name: 'Commodities', value: 5, color: '#EF4444', amount: 2228 } // Red
  ];

  // Currency icons data for floating animation - positioned only in hero section
  const currencyIcons = [
    { icon: FaDollarSign, color: '#10B981', size: 28, delay: 0, position: { left: '65%', top: '20%' } },
    { icon: FaEuroSign, color: '#3B82F6', size: 26, delay: 0.5, position: { left: '75%', top: '35%' } },
    { icon: FaPoundSign, color: '#8B5CF6', size: 24, delay: 1, position: { left: '85%', top: '25%' } },
    { icon: FaYenSign, color: '#F59E0B', size: 30, delay: 1.5, position: { left: '70%', top: '50%' } },
    { icon: FaBitcoin, color: '#F97316', size: 32, delay: 2, position: { left: '80%', top: '15%' } },
    { icon: FaEthereum, color: '#06B6D4', size: 28, delay: 2.5, position: { left: '90%', top: '40%' } },
    { icon: FaDollarSign, color: '#EF4444', size: 26, delay: 3, position: { left: '60%', top: '45%' } },
    { icon: FaEuroSign, color: '#84CC16', size: 24, delay: 3.5, position: { left: '95%', top: '30%' } },
  ];

  const timeframes = ['1 Year', '6 Month', '3 Month', 'Weekly'];

  const handleInvestNow = () => {
    if (!isAuthenticated) {
      // User not logged in - navigate to signup
      navigate('/signup');
    } else if (user?.verificationStatus !== USER_VERIFICATION_STATUS.VERIFIED) {
      // User logged in but not verified - navigate to profile
      navigate('/profile');
    } else {
      // User logged in and verified - navigate to investment page
      navigate('/invest');
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Subtle Grid Pattern - Fading from right to left */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Floating Currency Icons with Circular Bubbles - Hidden on mobile, visible on larger screens */}
      {currencyIcons.map((currency, index) => {
        const IconComponent = currency.icon;
        return (
          <motion.div
            key={index}
            className="absolute z-5 hidden sm:block"
            style={{
              left: currency.position.left,
              top: currency.position.top,
            }}
            animate={{
              y: [-15, 15, -15],
              x: [-8, 8, -8],
              rotate: [-8, 8, -8],
            }}
            transition={{
              duration: 5 + index * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: currency.delay,
            }}
          >
            <div 
              className="flex items-center justify-center rounded-full backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-300"
              style={{
                width: `${currency.size + 24}px`,
                height: `${currency.size + 24}px`,
                backgroundColor: `${currency.color}20`,
                boxShadow: `0 0 30px ${currency.color}40, 0 0 60px ${currency.color}30, 0 0 90px ${currency.color}20`,
              }}
            >
              <IconComponent 
                size={currency.size} 
                className="opacity-90 hover:opacity-100 transition-opacity duration-300"
                style={{ color: currency.color }}
              />
            </div>
          </motion.div>
        );
      })}

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section - Title and Content */}
        <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 h-full">
            {/* Left Section - Hero Text and CTA */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8">
              {/* Hero Text */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4"
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-light text-white leading-tight">
                  Invest With{' '}Confidence, Grow With Purpose.
                 
                </h1>
               
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4"
              >
                <button 
                  onClick={handleInvestNow}
                  className="bg-white cursor-pointer text-black px-6 py-3 sm:px-8 sm:py-4 rounded-full font-medium hover:bg-gray-100 transition-colors flex items-center justify-center space-x-3"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-600 rounded-full"></div>
                  </div>
                  <span className="text-base sm:text-lg">Invest Now</span>
                </button>

              </motion.div>
            </div>

            {/* Right Section - Empty space */}
            <div className="lg:col-span-6"></div>
          </div>
        </div>

        {/* Charts Section - Next Row */}
        <div className="px-4 sm:px-6 pb-6 sm:pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* Left Column - Assets Holding */}
            <div className="lg:col-span-3">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50 h-full">
                <h4 className="text-gray-400 text-sm mb-3 sm:mb-4">Assets Holding</h4>
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {pieData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-white text-xs sm:text-sm">{item.name} {item.value}%</span>
                      </div>
                      <span className="text-white font-semibold text-xs sm:text-sm">${item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Enhanced Pie Chart with Rounded Edges - Responsive Size */}
                <div className="flex justify-center">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={isMobile ? 90 : 100}
                          dataKey="value"
                          startAngle={90}
                          endAngle={450}
                          paddingAngle={3}
                          cornerRadius={12}
                          strokeWidth={0}
                        >
                          {pieData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color}
                              stroke={entry.color}
                              strokeWidth={0}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-gray-400 text-xs sm:text-sm">Portfolio Amount</div>
                        <div className="text-white text-lg sm:text-xl md:text-2xl font-semibold">
                          ${portfolioData[portfolioData.length - 1]?.value.toLocaleString() || '51,000'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Column - Portfolio Chart */}
            <div className="lg:col-span-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50 h-full">
                <div className="text-white mb-3 sm:mb-4">
                  <div className="text-gray-400 text-xs sm:text-sm mb-1">Portfolio Amount</div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-light">
                    ${portfolioData[portfolioData.length - 1]?.value.toLocaleString() || '51,000'}
                  </div>
                </div>

                {/* Timeframe Selectors */}
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                  {timeframes.map((timeframe) => (
                    <button
                      key={timeframe}
                      onClick={() => setActiveTimeframe(timeframe)}
                      className={`px-2 py-1 sm:px-3 rounded text-xs transition-colors ${
                        activeTimeframe === timeframe
                          ? 'bg-gray-700 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {timeframe}
                    </button>
                  ))}
                </div>

                {/* Chart Legend */}
                <div className="flex flex-wrap gap-2 sm:gap-4 text-xs mb-3 sm:mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-white">Stocks Portfolio</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-400">Crypto Portfolio</span>
                  </div>
                </div>

                {/* Enhanced Area Chart - Matching Image Style */}
                <div className="h-48 sm:h-56 md:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorStocks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                          <stop offset="50%" stopColor="#3B82F6" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorCrypto" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                          <stop offset="50%" stopColor="#10B981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey={activeTimeframe === 'Weekly' ? 'day' : 'month'} 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9CA3AF', fontSize: 10 }}
                        interval="preserveStartEnd"
                      />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F9FAFB',
                          fontSize: '12px'
                        }}
                        labelStyle={{ color: '#9CA3AF' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="stocks"
                        stackId="1"
                        stroke="#3B82F6"
                        fill="url(#colorStocks)"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 4, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }}
                        animationDuration={1500}
                        animationEasing="ease-in-out"
                      />
                      <Area
                        type="monotone"
                        dataKey="crypto"
                        stackId="1"
                        stroke="#10B981"
                        fill="url(#colorCrypto)"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 4, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }}
                        animationDuration={1500}
                        animationEasing="ease-in-out"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Price Points */}
                <div className="space-y-1 sm:space-y-2 mt-3 sm:mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium text-sm sm:text-base">
                      ${portfolioData[portfolioData.length - 1]?.stocks.toLocaleString() || '36,050'}
                    </span>
                    <span className="text-green-400 flex items-center space-x-1">
                      <FaArrowUp size={10} />
                      <span className="text-xs sm:text-sm">
                        +${((portfolioData[portfolioData.length - 1]?.stocks || 36050) - (portfolioData[0]?.stocks || 24500)).toLocaleString()} 
                        {((((portfolioData[portfolioData.length - 1]?.stocks || 36050) - (portfolioData[0]?.stocks || 24500)) / (portfolioData[0]?.stocks || 24500)) * 100).toFixed(1)}%
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium text-sm sm:text-base">
                      ${portfolioData[portfolioData.length - 1]?.crypto.toLocaleString() || '15,450'}
                    </span>
                    <span className="text-green-400 flex items-center space-x-1">
                      <FaArrowUp size={10} />
                      <span className="text-xs sm:text-sm">
                        +${((portfolioData[portfolioData.length - 1]?.crypto || 15450) - (portfolioData[0]?.crypto || 10500)).toLocaleString()} 
                        {((((portfolioData[portfolioData.length - 1]?.crypto || 15450) - (portfolioData[0]?.crypto || 10500)) / (portfolioData[0]?.crypto || 10500)) * 100).toFixed(1)}%
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - P&L */}
            <div className="lg:col-span-3 space-y-3 sm:space-y-4">
              {/* Unrealized P&L Card */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50">
                <div className="mb-3 sm:mb-4">
                  <div className="text-gray-400 text-xs sm:text-sm">Unrealized P&L</div>
                  <div className="text-green-400 text-lg sm:text-xl font-semibold">+$40,230.24</div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs sm:text-sm">Asset Gain/Loss</span>
                    <span className="text-green-400 font-medium text-xs sm:text-sm">+$5,352.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs sm:text-sm">Forex Gain/Loss</span>
                    <span className="text-green-400 font-medium text-xs sm:text-sm">+$2,334.31</span>
                  </div>
                </div>
              </div>

              {/* Realized P&L Card */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50">
                <div className="mb-3 sm:mb-4">
                  <div className="text-gray-400 text-xs sm:text-sm">Realized P&L</div>
                  <div className="text-green-400 text-lg sm:text-xl font-semibold">+$12,435.12</div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs sm:text-sm">Asset Gain/Loss</span>
                    <span className="text-green-400 font-medium text-xs sm:text-sm">+$5,352.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs sm:text-sm">Forex Gain/Loss</span>
                    <span className="text-red-400 font-medium text-xs sm:text-sm">-$2,334.31</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs sm:text-sm">Dividends Received</span>
                    <span className="text-green-400 font-medium text-xs sm:text-sm">+$2,334.31</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs sm:text-sm">Rewards Received</span>
                    <span className="text-green-400 font-medium text-xs sm:text-sm">+$1,123.31</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;