// AdminLogin page
import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { FiShield, FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/forms/Input';


const AdminLogin = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in as admin
  if (!loading && isAdmin) {
    return <Navigate to="/admin/dashboard" />;
  }

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { adminLogin } = useAuth();

  const handleChange = (e) => {

    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value

    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await adminLogin(formData.email, formData.password);
      
      toast.success('Admin login successful! Welcome back.', {
        position: "top-right",
        autoClose: 3000,
      });
      
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Admin login error:', error);
      
      let errorMessage = 'Invalid admin credentials. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
      
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };  

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
              <FiShield className="h-8 w-8 text-white" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-bold text-white">
                InvestPro
              </span>
              <div className="text-sm text-gray-300">Admin Panel</div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Login
          </h1>
          <p className="text-gray-300">
            Access the administrative dashboard
          </p>
        </div>

        <Card className="animate-fade-in glass border-gray-700">


          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

            <Input
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter admin email"
              icon={<FiUser />}
              error={errors.email}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter admin password"
                icon={<FiLock />}
                error={errors.password}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

            <Button
              type="submit"
              fullWidth
              loading={isSubmitting}
              size="large" 
            >
              Login to Admin Panel
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              This is a secure admin area. Unauthorized access is prohibited.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
