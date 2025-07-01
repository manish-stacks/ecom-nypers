import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChangeRequest = async () => {
    setError('');
    setMessage('');
    try {
      const { data } = await axios.post('https://api.nypers.in/api/v1/Password-Change-Request', {
        Email: email,
        newPassword,
      });

      if (data.success) {
        setMessage(data.msg);
        setStep(2); // Show OTP input
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong.');
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setMessage('');
    try {
      const { data } = await axios.post('https://api.nypers.in/api/v1/resend-otp', {
        email,
        type: 'password_reset',
      });
      if (data.success) {
        setMessage(data.msg);
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to resend OTP.');
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    setMessage('');
    try {
      const { data } = await axios.post('https://api.nypers.in/api/v1/verify-otp', {
        email,
        otp,
        type: 'password_reset',
      });

      if (data.success) {
        setMessage(data.message || 'Password changed successfully!');
        setStep(3); // Done
      } else {
        setError(data.message || 'OTP verification failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP or server error.');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
          />
          <button
            onClick={handlePasswordChangeRequest}
            className="w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900"
          >
            Send OTP
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <p className="text-sm text-gray-600">Enter the OTP sent to your email to confirm password change.</p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
          />
          <button
            onClick={handleVerifyOtp}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Verify OTP & Change Password
          </button>
          <button
            onClick={handleResendOtp}
            className="mt-2 text-blue-600 text-sm hover:underline"
          >
            Resend OTP
          </button>
        </>
      )}

      {step === 3 && (
        <div className="text-green-600 text-center font-medium">
          ✅ Password changed successfully! You can now log in.
        </div>
      )}

      {message && <div className="text-green-600 text-sm">{message}</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </div>
  );
};

export default ChangePassword;
