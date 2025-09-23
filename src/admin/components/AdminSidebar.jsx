// AdminSidebar component
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiTrendingUp, 
  FiFileText,
  FiSettings,
  FiLogOut,
  FiShield,
  FiUser,
  FiUserCheck,
  FiAward,
  FiStar,
  FiZap
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const AdminSidebar = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isMobile = window.innerWidth < 768;

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FiHome },
    { name: 'User Management', path: '/admin/users', icon: FiUsers },
    { name: 'Investments', path: '/admin/investments', icon: FiTrendingUp },
    { name: 'Documents', path: '/admin/documents', icon: FiFileText },
    { name: 'Manage Trader', path: '/admin/manage-trader', icon: FiUserCheck },
    { name: 'Manage Silver', path: '/admin/manage-silver', icon: FiAward },
    { name: 'Manage Gold', path: '/admin/manage-gold', icon: FiStar },
    { name: 'Manage Platinum', path: '/admin/manage-platinum', icon: FiZap },
    { name: 'Profile', path: '/admin/profile', icon: FiUser },
    // { name: 'Settings', path: '/admin/settings', icon: FiSettings },
  ];

  const isActive = (path) => {
    // For manage-trader, also check if we're on the add-trader sub-route
    if (path === '/admin/manage-trader') {
      return location.pathname === path || location.pathname.startsWith('/admin/manage-trader/');
    }
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavClick = () => {

    if (isMobile) {
      // Use setTimeout to ensure navigation happens first
      setTimeout(() => {
          window.dispatchEvent(new CustomEvent('closeMobileSidebar'));
      }, 100);
    }
  };

  return (
    <div className={`
      fixed top-0 left-0 h-screen bg-white shadow-lg z-40 transition-all duration-300 border-r border-gray-200
      ${isMobile ? 'w-full' : 'w-64'}
      md:z-auto
    `}>
      <div className="p-4 h-full flex flex-col">
        {/* Logo Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg flex-shrink-0">
              <FiShield className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Trdexa
              </span>
              <div className="text-xs text-gray-500">Admin Panel</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Mobile Close Button - Only show on mobile */}
            {isMobile && (
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('closeMobileSidebar'))}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex-shrink-0 cursor-pointer"
                title="Close Sidebar"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2 mb-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={handleNavClick}
              className={`
                flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group
                ${isActive(item.path)
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                }
              `}
            >
              <item.icon 
                size={20} 
                className="flex-shrink-0"
              />
              <span className="font-medium truncate">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="mt-auto">
          <Button
            variant="outline"
            fullWidth={true}
            onClick={handleLogout}
            icon={<FiLogOut />}
            className="text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
