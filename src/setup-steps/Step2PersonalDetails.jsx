import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import authService from '../services/authService';

const Step2PersonalDetails = ({ onNext, onPrevious }) => {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    date_of_birth: '',
    is_indian_citizen: null,
  });

  useEffect(() => {
    // Fetch current user data
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setCurrentUser(userData);
      
      // Pre-fill form with existing data
      setFormData({
        username: userData.username || '',
        email: userData.email || '',
        date_of_birth: userData.date_of_birth || '',
        is_indian_citizen: userData.is_indian, 
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (
    !formData.username ||
    !formData.email ||
    !formData.date_of_birth ||
    formData.is_indian_citizen === null
  ) {
    toast.error('Please fill all required fields');
    return;
  }

  const payload = {
    username: formData.username,
    email: formData.email,
    date_of_birth: formData.date_of_birth,
    is_indian: formData.is_indian_citizen,
  };

  setLoading(true);
  try {
    const response = await authService.completeProfile(payload);
    
    if (response.success) {
      toast.success('Profile updated successfully!');
      
      // 👇 Store the updated user data in localStorage or context
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      onNext();
    }
  } catch (error) {
    console.error("complete-profile error:", error);
    toast.error(error.message || 'Failed to update profile');
  } finally {
    setLoading(false);
  }
};   
     

  return (
    <div className="step-form">
      <h3>Enter Personal Information</h3>
      <p className="form-subtitle">Please provide your basic details</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>How would you like to be called? *</label>
          <input
            type="text"
            name="username"
            placeholder="Enter your name"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Date Of Birth *</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Are you an Indian Citizen? *</label>
          <div className="radio-group">
            <button
              type="button"
              className={`radio-btn ${formData.is_indian_citizen === true ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, is_indian_citizen: true })}
            >
              YES
            </button>
            <button
              type="button"
              className={`radio-btn ${formData.is_indian_citizen === false ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, is_indian_citizen: false })}
            >
              NO
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onPrevious} disabled={loading}>
            Previous
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step2PersonalDetails;