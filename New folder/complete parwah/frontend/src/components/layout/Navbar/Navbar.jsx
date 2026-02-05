import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../ui';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const isActive = (path) => location.pathname === path;

  // const handleLogout = () => {
  //   localStorage.removeItem('user');
  //   setUser(null);
  //   navigate('/login');
  // };
  const handleLogout = () => {
  if (window.confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  }
};

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate('/')}>
          <span className="brand-icon">🏛️</span>
          <span className="brand-name">PARWAH</span>
        </div>

        <div className="navbar-menu">
          <button 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            Complaints
          </button>
          <button 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`}
            onClick={() => navigate('/leaderboard')}
          >
            Leaderboard
          </button>
          {user && (
            <button
              className={`nav-link ${isActive('/user') ? 'active' : ''}`}
              onClick={() => navigate('/user')}
            >
              User Panel
            </button>
          )}
          {user?.role === 'admin' && (
            <button 
              className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
              onClick={() => navigate('/admin')}
            >
              Admin
            </button>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <Button variant="primary" onClick={() => navigate('/submit')}>
                + Report Issue
              </Button>
              <div className="user-menu">
                <span className="user-name">{user.name}</span>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="primary" onClick={() => navigate('/register')}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
