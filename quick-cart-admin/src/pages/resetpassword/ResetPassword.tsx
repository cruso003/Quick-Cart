/* eslint-disable @typescript-eslint/no-explicit-any */
//ResetPassword.tsx

import React, { useState } from 'react';
import './resetpassword.scss';
import { userApiRequest } from '../../api/api';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPassword: React.FC = () => {
  const [securityCode, setSecurityCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault();
    setLoading(true);
  
    try {
      // Validate if passwords match
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
  
      // Call API to reset password
      await userApiRequest.verifyOtpAndResetPassword( email, securityCode, newPassword );
      
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error("Email address is missing.");
      return;
    }

    setResendLoading(true);

    try {
      await userApiRequest.resendSecurityCode(email);
      toast.success("Security code resent successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resend security code.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h2>Enter Security Code</h2>
        <p>Enter the security code sent to your email, along with your new password.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="security-code">Security Code</label>
            <input
              type="text"
              id="security-code"
              value={securityCode}
              onChange={(e) => setSecurityCode(e.target.value)}
              placeholder="Enter the security code"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="new-password">New Password</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              required
            />
          </div>
          <div className="button-group">
            <button type="submit" disabled={loading}>
              {loading ? "Resetting password..." : "Reset Password"}
            </button>
            <button type="button" onClick={handleResendCode} disabled={resendLoading}>
              {resendLoading ? "Resending code..." : "Resend Security Code"}
            </button>
          </div>
        </form>
        <p>Remember your password? <a href="/login">Login</a></p>
      </div>
    </div>
  );
};

export default ResetPassword;
