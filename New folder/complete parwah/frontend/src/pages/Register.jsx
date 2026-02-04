import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Toast } from '../components/ui';
import { api } from '../services/api';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
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

  if (formData.password !== formData.confirmPassword) {
    setToast({ message: 'Passwords do not match', type: 'error' });
    return;
  }

  setLoading(true);

  try {
    const { confirmPassword, ...userData } = formData;
    console.log('=== REGISTRATION DEBUG ===');
    console.log('1. Form data:', formData);
    console.log('2. Sending to API:', userData);
    console.log('3. API URL:', 'http://localhost:5000/api/auth/register');
    
    const response = await api.register(userData);
    
    console.log('4. Response received:', response);
    console.log('5. Response success:', response.success);
    console.log('=== END DEBUG ===');
    
    if (response.success) {
      setToast({ message: 'Account created successfully!', type: 'success' });
      setTimeout(() => navigate('/login'), 1500);
    } else {
      setToast({ message: response.message || 'Registration failed', type: 'error' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    setToast({ message: 'Registration failed. Please try again.', type: 'error' });
  } finally {
    setLoading(false);
  }
};
  
  









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
            <h1>Create Account</h1>
            <p>Join PARWAH to make a difference</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />

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
              label="Phone Number"
              type="tel"
              name="phone"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <Button 
              type="submit" 
              variant="primary" 
              fullWidth
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="auth-footer">
            <p>Already have an account?</p>
            <button 
              className="link-button"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Register;