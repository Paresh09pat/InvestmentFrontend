import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';

// User Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import InvestmentForm from './pages/InvestmentForm';
import InvestmentSuccess from './pages/InvestmentSuccess';
import InvestmentHistory from './pages/InvestmentHistory';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';

// Footer Pages
import About from './pages/About';
import Contact from './pages/Contact';
import HelpCenter from './pages/HelpCenter';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Security from './pages/Security';
import Features from './pages/Features';
import Blog from './pages/Blog';

// Admin Pages
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import UserManagement from './admin/pages/UserManagement';
import InvestmentManagement from './admin/pages/InvestmentManagement';
import DocumentVerification from './admin/pages/DocumentVerification';
import AdminProfile from './admin/pages/AdminProfile';
import ManageTrader from './admin/pages/ManageTrader';
import AddTrader from './admin/pages/AddTrader';
import CardManagement from './admin/pages/CardManagement';
// import AdminSettings from './admin/pages/AdminSettings';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import Footer from './components/Footer';
import Navbar from './components/common/Navbar';

function App() {
  const { loading } = useAuth();
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 font-semibold">Loading application...</p>
        </div>
      </div>
    );
  } 

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navbar - Show on all pages except admin */}
      {!location.pathname.startsWith('/admin') && <Navbar />}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Footer Pages - Public Access */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/security" element={<Security />} />
        <Route path="/features" element={<Features />} />
        <Route path="/blog" element={<Blog />} />

        {/* Protected User Routes */}
        <Route path="/*" element={
          <ProtectedRoute>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
              
              {/* Investment Routes (require verification) */}
              <Route path="/invest" element={
                <ProtectedRoute requireVerification={true}>
                  <InvestmentForm />
                </ProtectedRoute>
              } />
              <Route path="/investment-success" element={
                <ProtectedRoute requireVerification={true}>
                  <InvestmentSuccess />
                </ProtectedRoute>
              } />
              <Route path="/investment-history" element={
                <ProtectedRoute requireVerification={true}>
                  <InvestmentHistory />
                </ProtectedRoute>
              } />
            </Routes>
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="investments" element={<InvestmentManagement />} />
          <Route path="documents" element={<DocumentVerification />} />
          <Route path="manage-trader/add-trader" element={<AddTrader />} />
          <Route path="manage-trader" element={<ManageTrader />} />
          <Route path="profile" element={<AdminProfile />} />
          {/* <Route path="settings" element={<AdminSettings />} /> */}
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Footer - Show on all pages except admin */}
      {!location.pathname.startsWith('/admin') && <Footer />}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
