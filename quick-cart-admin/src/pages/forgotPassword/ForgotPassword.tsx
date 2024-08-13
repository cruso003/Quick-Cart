/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import './forgotpassword.scss';
import { userApiRequest } from '../../api/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await userApiRequest.forgotPassword(email);
      toast.success("Security code sent to your email!");
      navigate("/reset-password", { state: { email } });
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>Reset Your Password</h2>
        <p>Enter your email address to receive a security code.</p>
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
          <button type="submit" disabled={loading}>
            {loading ? "Sending security code..." : "Send Security Code"}
          </button>
        </form>
        <p>Remember your password? <a href="/login">Login</a></p>
      </div>
      <div className="image-section">
        <img src="/confusedguy.jpeg" alt="Confusedguy" />
      </div>
    </div>
  );
};

export default ForgotPassword;
