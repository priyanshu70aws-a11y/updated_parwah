import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Toast } from '../components/ui';
import { api } from '../services/api';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };



  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await api.login(formData);
    
    if (response.success) {
      // Save token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setToast({ message: 'Login successful!', type: 'success' });
      setTimeout(() => {
        window.location.href = '/'; // Force reload to update navbar
      }, 1500);
    } else {
      setToast({ message: response.message || 'Login failed', type: 'error' });
    }
  } catch (error) {
    console.error('Login error:', error);
    setToast({ message: 'Login failed. Please try again.', type: 'error' });
  } finally {
    setLoading(false);
  }
};
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     // Mock login - will connect to API later
  //     console.log('Login:', formData);
      
  //     setTimeout(() => {
  //       localStorage.setItem('user', JSON.stringify({ 
  //         email: formData.email, 
  //         name: 'User',
  //         role: 'citizen'
  //       }));
  //       setToast({ message: 'Login successful!', type: 'success' });
  //       setTimeout(() => navigate('/'), 1500);
  //     }, 1000);
  //   } catch (error) {
  //     setToast({ message: 'Login failed', type: 'error' });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      <div className="auth-page">
        <Card className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">🏛️</div>
            <h1>Welcome Back</h1>
            <p>Sign in to your PARWAH account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Button 
              type="submit" 
              variant="primary" 
              fullWidth
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account?</p>
            <button 
              className="link-button"
              onClick={() => navigate('/register')}
            >
              Create Account
            </button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Login;