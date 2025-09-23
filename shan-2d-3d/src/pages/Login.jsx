import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    user_name: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Form submitted with data:', formData);
    console.log('Remember me:', rememberMe);

    try {
      const result = await login(formData, rememberMe);
      console.log('Login result:', result);
      
      if (result.success) {
        console.log('Login successful, navigating to dashboard');
        navigate('/dashboard');
      } else {
        console.log('Login failed:', result);
        // Handle validation errors
        if (result.errors && result.errors.user_name) {
          setError(result.errors.user_name[0]);
        } else {
          setError(result.message);
        }
      }
    } catch (error) {
      console.error('Login error in component:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <div className="glass-effect rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white border-opacity-10 backdrop-blur-xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="/TemplateData/shan.jpg" 
            alt="GoldenMM Logo" 
            className="w-20 h-20 rounded-full border-4 border-gold mx-auto mb-4"
          />
          <h1 className="text-white text-2xl font-bold mb-2">GoldenMM</h1>
          <p className="text-gold text-sm">Premium Slot Game Experience</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
              <label htmlFor="user_name" className="block text-white text-sm font-medium mb-2">
                Username / Phone <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="user_name"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-600 border-opacity-50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:bg-gray-800 focus:bg-opacity-70 transition-all duration-300 text-base"
                placeholder="Enter username or phone"
              />
          </div>

          <div>
            <label htmlFor="password" className="block text-white text-sm font-medium mb-3">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-4 pr-12 bg-gray-800 bg-opacity-50 border border-gray-600 border-opacity-50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:bg-gray-800 focus:bg-opacity-70 transition-all duration-300 text-base"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-gold transition-colors duration-300 p-1"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 text-gold bg-white bg-opacity-5 border-2 border-white border-opacity-30 rounded-lg focus:ring-gold focus:ring-2 focus:ring-opacity-20 transition-all duration-300"
                />
                {rememberMe && (
                  <svg className="absolute top-0.5 left-0.5 w-4 h-4 text-gold pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <label htmlFor="rememberMe" className="ml-3 text-white text-sm font-medium cursor-pointer">
                Remember me
              </label>
            </div>
            <button
              type="button"
              className="text-gold text-sm font-medium hover:text-yellow-300 transition-colors duration-300"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gold-gradient text-white font-bold py-4 px-6 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-gold focus:ring-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                <span>Logging in...</span>
              </div>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
                Login
              </span>
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center mt-6">
          <p className="text-gray-300 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-gold hover:text-yellow-300 transition-colors duration-300 font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
