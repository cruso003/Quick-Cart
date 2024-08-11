import React, { useState } from 'react';
import './signup.scss';
import { authApiRequests } from '../../api/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation for empty fields
    if (!name || !email || !password || !confirmPassword || !businessName || !phoneNumber || !address || !city || !state) {
      toast.error("All fields are required!");
      return;
    }

    // Password length validation
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      // Use the createSeller function from apiRequests
      await authApiRequests.createVendor({
        name,
        email,
        password,
        businessName,
        phoneNumber,
        address,
        city,
        state,
      });
      toast.success("Signup Success!");

      // Navigate to the login page after successful signup
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create an Account</h2>
        <p>Sell With Ease</p>
        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="businessName">Business Name</label>
              <input
                type="text"
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Enter your business name"
                required
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address"
                required
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Enter your state"
                required
              />
            </div>
          </div>

          <div className="input-row">
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
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
      <div className="image-section">
        <img src="/vendor.png" alt="Vendor" />
      </div>
    </div>
  );
};

export default Signup;
