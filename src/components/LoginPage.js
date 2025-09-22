import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Simple authentication - in production, this would connect to your auth service
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple hardcoded credentials for demo - replace with real auth
    if (credentials.username === 'admin' && credentials.password === 'wingshack2024') {
      onLogin(true);
    } else {
      setError('Invalid username or password');
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <Shield className="logo-icon" />
            <h1>Wing Shack Co</h1>
          </div>
          <p className="login-subtitle">Sales Dashboard Access</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading || !credentials.username || !credentials.password}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p className="demo-credentials">
            <strong>Demo Credentials:</strong><br />
            Username: <code>admin</code><br />
            Password: <code>wingshack2024</code>
          </p>
          <p className="powered-by">
            Powered by <span className="hungry-tum-brand">Hungry Tum</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
