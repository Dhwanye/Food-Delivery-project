import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiPhone, FiAlertCircle, FiMapPin, FiHome, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.js';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, error: authError, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipcode: '',
      country: ''
    }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const formRef = useRef(null);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from);
    }
  }, [isAuthenticated, navigate, location]);

  // Update local error state when auth context error changes
  useEffect(() => {
    if (authError) {
      // If we get an email exists error, don't show it at the top level
      // but instead highlight the email field
      if (authError.includes('Email address is already registered')) {
        setValidationErrors(prev => ({
          ...prev,
          email: 'Email address is already registered'
        }));
        setFormData(prev => ({
          ...prev,
          password: '',
          confirmPassword: ''
        }));
      } else if (!authError.includes('Username already taken')) {
        // Don't display "Username already taken" error at all
        setError(authError);
      }
    }
  }, [authError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear any validation errors for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
    
    if (name.includes('.')) {
      // Handle nested address fields
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
      
      // Clear any validation errors for nested fields
      if (validationErrors[`${parent}.${child}`]) {
        setValidationErrors(prev => {
          const newErrors = {...prev};
          delete newErrors[`${parent}.${child}`];
          return newErrors;
        });
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear any errors when typing
    setError('');
  };

  const validateForm = () => {
    const errors = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Name validation
    if (!formData.name) {
      errors.name = 'Full name is required';
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    // Mobile number validation (if provided)
    if (formData.phone) {
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(formData.phone)) {
        errors.phone = 'Please enter a valid 10-digit phone number';
      }
    }
    
    // Address validation
    if (!formData.address.street) {
      errors['address.street'] = 'Street address is required';
    }
    
    if (!formData.address.city) {
      errors['address.city'] = 'City is required';
    }
    
    if (!formData.address.state) {
      errors['address.state'] = 'State is required';
    }
    
    if (!formData.address.zipcode) {
      errors['address.zipcode'] = 'ZIP code is required';
    } else {
      const zipcodeRegex = /^[0-9]{5,6}$/;
      if (!zipcodeRegex.test(formData.address.zipcode)) {
        errors['address.zipcode'] = 'Please enter a valid zipcode (5-6 digits)';
      }
    }
    
    if (!formData.address.country) {
      errors['address.country'] = 'Country is required';
    }
    
    return errors;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: ''
      }
    });
    setError('');
    setValidationErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any existing errors
    setError('');
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setValidationErrors(formErrors);
      
      // Scroll to the first error field
      const firstErrorField = Object.keys(formErrors)[0];
      const element = document.getElementById(firstErrorField.includes('.') 
        ? firstErrorField.split('.')[1] 
        : firstErrorField);
      
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      
      return;
    }
    
    setLoading(true);
    setRegisterSuccess(false);

    try {
      // Call the register function from AuthContext
      // await register({
      //   name: formData.name,
      //   email: formData.email,
      //   mobile: formData.mobile,
      //   password: formData.password,
      //   address: formData.address
      // });
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        street: formData.address.street,
        city: formData.address.city,
        state: formData.address.state,
        zipcode: formData.address.zipcode,
        country: formData.address.country
      });
      
      
      // Set success state
      setRegisterSuccess(true);
      
      // Clear form on success
      resetForm();
      
      // Navigation is handled by the useEffect hook watching isAuthenticated
    } catch (error) {
      console.error('Registration error:', error);
      
      // Check if the error is related to email already existing
      if (error.message && error.message.includes('Email address is already registered')) {
        setValidationErrors(prev => ({
          ...prev,
          email: 'Email address is already registered'
        }));
        
        // Scroll to email field
        const emailField = document.getElementById('email');
        if (emailField) {
          emailField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          emailField.focus();
        }
      } else if (error.message && !error.message.includes('Username already taken')) {
        // Filter out "Username already taken" error
        setError(error.message || 'Registration failed. Please try again.');
      } else {
        // Set a generic error if it was the username error
        setError('Registration failed. Please check your information and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };
  
  const clearError = () => {
    setError('');
  };

  const getInputClassName = (fieldName) => {
    return validationErrors[fieldName] ? 'input-group error' : 'input-group';
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Join us for a delicious food journey</p>
          </div>

          {registerSuccess && (
            <div className="success-message">
              Account created successfully! Redirecting...
            </div>
          )}

          {error && (
            <div className="error-message">
              <FiAlertCircle className="error-icon" />
              {error}
              <button className="clear-error-btn" onClick={clearError}>×</button>
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="auth-form">
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className={getInputClassName('name')}>
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    disabled={loading}
                  />
                </div>
                {validationErrors.name && (
                  <div className="field-error">{validationErrors.name}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className={getInputClassName('email')}>
                  <FiMail className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    disabled={loading}
                  />
                </div>
                {validationErrors.email && (
                  <div className="field-error">{validationErrors.email}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <div className={getInputClassName('phone')}>
                  <FiPhone className="input-icon" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your Phone number"
                    disabled={loading}
                  />
                </div>
                {validationErrors.phone && (
                  <div className="field-error">{validationErrors.phone}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className={getInputClassName('password')}>
                  <FiLock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    disabled={loading}
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('password')}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {validationErrors.password && (
                  <div className="field-error">{validationErrors.password}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className={getInputClassName('confirmPassword')}>
                  <FiLock className="input-icon" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    disabled={loading}
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <div className="field-error">{validationErrors.confirmPassword}</div>
                )}
              </div>
            </div>
            
            <div className="form-section">
              <h3>Delivery Address (Required)</h3>
              <div className="form-group">
                <label htmlFor="street">Street Address</label>
                <div className={getInputClassName('address.street')}>
                  <FiHome className="input-icon" />
                  <input
                    type="text"
                    id="street"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    placeholder="Enter your street address"
                    disabled={loading}
                  />
                </div>
                {validationErrors['address.street'] && (
                  <div className="field-error">{validationErrors['address.street']}</div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <div className={getInputClassName('address.city')}>
                    <FiMapPin className="input-icon" />
                    <input
                      type="text"
                      id="city"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                      disabled={loading}
                    />
                  </div>
                  {validationErrors['address.city'] && (
                    <div className="field-error">{validationErrors['address.city']}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <div className={getInputClassName('address.state')}>
                    <FiMapPin className="input-icon" />
                    <input
                      type="text"
                      id="state"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      placeholder="Enter your state"
                      disabled={loading}
                    />
                  </div>
                  {validationErrors['address.state'] && (
                    <div className="field-error">{validationErrors['address.state']}</div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="zipcode">ZIP Code</label>
                  <div className={getInputClassName('address.zipcode')}>
                    <FiMapPin className="input-icon" />
                    <input
                      type="text"
                      id="zipcode"
                      name="address.zipcode"
                      value={formData.address.zipcode}
                      onChange={handleChange}
                      placeholder="Enter ZIP code"
                      disabled={loading}
                    />
                  </div>
                  {validationErrors['address.zipcode'] && (
                    <div className="field-error">{validationErrors['address.zipcode']}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <div className={getInputClassName('address.country')}>
                    <FiMapPin className="input-icon" />
                    <input
                      type="text"
                      id="country"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleChange}
                      placeholder="Enter your country"
                      disabled={loading}
                    />
                  </div>
                  {validationErrors['address.country'] && (
                    <div className="field-error">{validationErrors['address.country']}</div>
                  )}
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="auth-button primary-button"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" className="auth-link">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 