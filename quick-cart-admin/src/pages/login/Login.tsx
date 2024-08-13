/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import './login.scss';
import { authApiRequests } from '../../api/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Use the loginVendor function from apiRequests
      const response = await authApiRequests.loginAdmin(email, password);
      
      const user = response.data;
  
      // Check if the account is approved
      if (!user.isApproved) {
        toast.error("Account Pending Verification. Wait for Verification Email.");
         // Stop loading if the account is not approved
        setLoading(false);
        // Cancel login
        return;
      }
  
      if (user.role !== 'admin') {
        toast.error("Not authorized");
        setLoading(false);
        return;
      }
  
      localStorage.setItem('user', JSON.stringify(user));
  
      toast.success("Login Success!");
  
      // Call the login function from the AuthenticationContext
      login(user);
  
      // Navigate to the home page
      navigate("/");
  
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Sign in to Quick-Cart-Admin Panel</h2>
        <p>Manage Like a Pro</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="options">
            <div className="checkbox-group">
              <input type="checkbox" id="keep-logged-in" />
              <label htmlFor="keep-logged-in">Keep me logged in</label>
            </div>
            <a href="/forgot-password">Forgot Password?</a>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login to Your Account'}
          </button>
        </form>
      </div>
      <div className="image-section">
        <img src="/admin.png" alt="image with Admin text" />
      </div>
    </div>
  );
};

export default Login;
