import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, lazy, Suspense } from 'react';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import Navbar from './components/common/Navbar';
import Footer from './components/Footer';

// Lazy load pages
// User pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const InvestmentForm = lazy(() => import('./pages/InvestmentForm'));
const InvestmentSuccess = lazy(() => import('./pages/InvestmentSuccess'));
const InvestmentHistory = lazy(() => import('./pages/InvestmentHistory'));
const Withdrawal = lazy(() => import('./pages/Withdrawal'));
const Profile = lazy(() => import('./pages/Profile'));
const Notifications = lazy(() => import('./pages/Notifications'));

// Footer pages
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Security = lazy(() => import('./pages/Security'));
const Features = lazy(() => import('./pages/Features'));
const Blog = lazy(() => import('./pages/Blog'));

// Admin pages
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'));
const UserManagement = lazy(() => import('./admin/pages/UserManagement'));
const InvestmentManagement = lazy(() => import('./admin/pages/InvestmentManagement'));
const DocumentVerification = lazy(() => import('./admin/pages/DocumentVerification'));
const AdminProfile = lazy(() => import('./admin/pages/AdminProfile'));
const ManageTrader = lazy(() => import('./admin/pages/ManageTrader'));
const AddTrader = lazy(() => import('./admin/pages/AddTrader'));
const CardManagement = lazy(() => import('./admin/pages/CardManagement'));
const AdminNotifications = lazy(() => import('./admin/pages/AdminNotifications'));
const AdminTransactionHistory = lazy(() => import('./admin/pages/AdminTransactionHistory'));
const TransactionRequestDetails = lazy(() => import('./admin/pages/TransactionRequestDetails'));
const PortfolioManagement = lazy(() => import('./admin/pages/PortfolioManagement'));
// const AdminSettings = lazy(() => import('./admin/pages/AdminSettings'));

function App() {
  const { loading } = useAuth();
  const location = useLocation();

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
      {!location.pathname.startsWith('/admin') &&
        location.pathname !== '/login' &&
        location.pathname !== '/signup' &&
        <Navbar />
      }

      {/* Suspense wrapper for lazy routes */}
      <Suspense fallback={<LoadingSpinner size="large" color="primary" text="Loading page..." />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Footer pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/security" element={<Security />} />
          <Route path="/features" element={<Features />} />
          <Route path="/blog" element={<Blog />} />

          {/* Protected user routes */}
          <Route path="/*" element={
            <ProtectedRoute>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/notifications" element={<Notifications />} />

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
                <Route path="/withdrawal" element={
                  <ProtectedRoute requireVerification={true}>
                    <Withdrawal />
                  </ProtectedRoute>
                } />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Admin routes */}
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
            <Route path="portfolio" element={<PortfolioManagement />} />
            <Route path="documents" element={<DocumentVerification />} />
            <Route path="manage-trader" element={<ManageTrader />} />
            <Route path="manage-trader/add-trader" element={<AddTrader />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="transactions" element={<AdminTransactionHistory />} />
            <Route path="transaction-request/:id" element={<TransactionRequestDetails />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="card" element={<CardManagement />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      {!location.pathname.startsWith('/admin') &&
        location.pathname !== '/login' &&
        location.pathname !== '/signup' &&
        <Footer />
      }

      <ToastContainer
        position="top-right"
        autoClose={5000}
        pauseOnHover
        draggable
        theme="light"
      />
    </div>
  );
}

export default App;
