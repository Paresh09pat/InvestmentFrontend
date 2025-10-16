// AdminLayout component
import { useState, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';


const AdminLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setMobileSidebarOpen(false);
      }
    };

    const handleCloseMobileSidebar = () => {
      setMobileSidebarOpen(false);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    window.addEventListener('closeMobileSidebar', handleCloseMobileSidebar);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
      window.removeEventListener('closeMobileSidebar', handleCloseMobileSidebar);
    };
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    }
    // No collapse functionality for desktop/tablet
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  // Force re-render when location changes
  useEffect(() => {
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Sidebar Container */}
        <div className={`
          ${isMobile ? 'fixed inset-0 z-50' : 'fixed z-10'}
          ${isMobile ? (mobileSidebarOpen ? 'block' : 'hidden') : 'block'}
        `}>
          <AdminSidebar 
            isCollapsed={false}
            onToggle={toggleSidebar}
          />
        </div>
        
        {/* Main Content Area */}
        <div className={`
          transition-all duration-300 ease-in-out
          ${!isMobile ? 'ml-64' : 'ml-0'}
        `}>
          {/* Mobile Header - Always visible on mobile */}
          {isMobile && (
            <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img src="/trdexalogo.jpg" alt="Trdexa Logo" className="w-8 h-8 rounded-lg" />
                  <span className="text-lg font-bold text-gray-900">Trdexa</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  {/* Mobile Menu Indicator */}
                  <div className="text-sm text-gray-500">
                    Admin Panel
                  </div>
                  
                  {/* Hamburger Menu Button - Now on the right */}
                  <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                    aria-label="Toggle sidebar"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <main className=" sm:p-6 lg:p-8">
            <div 
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
              onClick={closeMobileSidebar}
            >
              {/* Use Outlet for proper nested routing */}
              <div key={location.pathname}>
                <Outlet />
              </div>
            </div>
          </main>
        </div>

        {/* Mobile Overlay - Only show when mobile sidebar is open */}
        {isMobile && mobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeMobileSidebar}
          />
        )}

        {/* Session Manager for admin pages */}
        
      </div>
  );
};

export default AdminLayout;
