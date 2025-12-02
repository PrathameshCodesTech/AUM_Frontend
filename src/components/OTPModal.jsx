import React, { useState, useRef, useEffect } from 'react';
import '../styles/OTPModal.css';

const OTPModal = ({ isOpen, onClose, phoneNumber, onVerify, onResend }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen, timer]);

  useEffect(() => {
    if (isOpen) {
      inputRefs.current[0]?.focus();
      setTimer(60);
    }
  }, [isOpen]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('');
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);
    
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) return;

    setLoading(true);
    try {
      await onVerify(otpValue);
      // Reset on success
      setOtp(['', '', '', '', '', '']);
    } catch (error) {
      // Error handled by parent
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setTimer(60);
    setOtp(['', '', '', '', '', '']);
    await onResend();
  };

  if (!isOpen) return null;

  return (
    <div className="otp-modal-overlay" onClick={onClose}>
      <div className="otp-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="otp-modal-close" onClick={onClose}>
          ×
        </button>
        
        <h2 className="otp-modal-title">Verify OTP</h2>
        <p className="otp-modal-subtitle">
          Enter the 6-digit code sent to<br />
          <strong>+91 {phoneNumber}</strong>
        </p>

        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="otp-input"
            />
          ))}
        </div>

        <button
          className="otp-verify-button"
          onClick={handleSubmit}
          disabled={otp.join('').length !== 6 || loading}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        <div className="otp-resend-section">
          {timer > 0 ? (
            <p className="otp-timer">Resend OTP in {timer}s</p>
          ) : (
            <button className="otp-resend-button" onClick={handleResend}>
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPModal;