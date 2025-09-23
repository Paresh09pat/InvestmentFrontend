// Sidebar component
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiTrendingUp, 
  FiUser, 
  FiBell,
  FiChevronLeft,
  FiChevronRight,
  FiShield
} from 'react-icons/fi';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FiHome },
    { name: 'Invest', path: '/invest', icon: () => <span className="text-lg font-bold">$</span> },
    { name: 'Portfolio', path: '/portfolio', icon: FiTrendingUp },
    { name: 'Profile', path: '/profile', icon: FiUser },
    { name: 'Notifications', path: '/notifications', icon: FiBell },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`
      fixed left-0 top-0 h-full bg-white shadow-lg z-40 transition-all duration-300
      ${isCollapsed ? 'w-16' : 'w-64'}
    `}>
      <div className="p-4">
        {/* Logo */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <FiShield className="h-6 w-6 text-white" />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Trdexa
              </span>
            )}
          </div>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
          >
            {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`
                flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200
                ${isActive(item.path)
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title={isCollapsed ? item.name : ''}
            >
              <item.icon size={20} />
              {!isCollapsed && (
                <span className="font-medium">{item.name}</span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
