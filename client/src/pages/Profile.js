import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { FiUser, FiMail, FiPhone, FiHome, FiMapPin, FiCalendar, FiEdit, FiArrowLeft } from 'react-icons/fi';
import './Profile.css';
import API_BASE_URL from '../config/api.js';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ✅ Fetch updated user data from /auth/me
  const fetchUserData = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/auth/me', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch user data');
      const data = await res.json();
      updateUser(data);
      return data;
    } catch (err) {
      console.error('Failed to fetch latest user data:', err);
    }
  };
  
  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading">Please log in to view your profile</div>
      </div>
    );
  }

  // Format address for display
  const formatAddress = () => {
    if (!user) return 'No address provided';
  
    const { street, city, state, zipcode, country } = user;
    const addressParts = [];
  
    if (street) addressParts.push(street);
    if (city) addressParts.push(city);
    if (state) addressParts.push(state);
    if (zipcode) addressParts.push(zipcode);
    if (country) addressParts.push(country);
  
    return addressParts.join(', ') || 'No address provided';
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError('');
  //   setSuccess('');

  //   try {
  //     // Use the updateUser function from AuthContext
  //     const updatedData = {
  //       name: formData.name,
  //       phone: formData.phone,
  //       street: formData.street,
  //       city:formData.city,
  //       zipcode: formData.zipcode,
  //       country: formData.country,
  //       email: formData.email,
  //       state:formData.state
  //     };
      
  //     // Update user in AuthContext (which updates localStorage and state)
  //     const updatedUser = updateUser(updatedData);
      
  //     setSuccess('Profile updated successfully!');
  //     setIsEditMode(false);
  //   } catch (err) {
  //     setError('Failed to update profile. Please try again.');
  //     console.error('Profile update error:', err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
  
    try {
      if (activeTab === 'personal') {
        const profileData = {
          name: formData.name,
          phone: formData.phone
        };
  
        const res = await fetch('http://localhost:5001/api/auth/update-profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify(profileData)
        });
  
        if (!res.ok) throw new Error('Failed to update profile');
  
        const data = await res.json();
        updateUser(data);
      }
  
      if (activeTab === 'address') {
        const addressData = {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipcode: formData.zipcode,
          country: formData.country
        };
  
        const res = await fetch('http://localhost:5001/api/auth/update-address', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify(addressData)
        });
  
        if (!res.ok) throw new Error('Failed to update address');
  
        const data = await res.json();
        updateUser(data);
      }
  
      const latestUser = await fetchUserData(); // ✅ get latest user after update
  
      if (latestUser) {
        setFormData({
          name: latestUser.name || '',
          email: latestUser.email || '',
          phone: latestUser.phone || '',
          street: latestUser.address?.street || '',
          city: latestUser.address?.city || '',
          state: latestUser.address?.state || '',
          zipcode: latestUser.address?.zipcode || '',
          country: latestUser.address?.country || ''
        });
      }
  
      setSuccess('Profile updated successfully!');
      setIsEditMode(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your account information and preferences</p>
      </div>
      
      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-avatar-container">
            <div className="profile-avatar-large">
              {user.photo ? (
                <img src={user.photo} alt={user.name} />
              ) : (
                <div className="profile-initial-large">{user.name.charAt(0).toUpperCase()}</div>
              )}
            </div>
            <button className="edit-avatar-btn">
              <FiEdit />
            </button>
          </div>
          
          <div className="profile-name-card">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            {user.phone && <p><FiPhone /> {user.phone}</p>}
          </div>
          
          <div className="profile-tabs">
            <button 
              className={`profile-tab ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              <FiUser className="tab-icon" />
              <span>Personal Info</span>
            </button>
            <button 
              className={`profile-tab ${activeTab === 'address' ? 'active' : ''}`}
              onClick={() => setActiveTab('address')}
            >
              <FiMapPin className="tab-icon" />
              <span>Address</span>
            </button>
          </div>
        </div>
        
        <div className="profile-main">
          {isEditMode ? (
            <div className="edit-profile-form">
              <div className="edit-header">
                <h2>Edit {activeTab === 'personal' ? 'Profile' : 'Address'}</h2>
                <button 
                  className="back-button" 
                  onClick={() => setIsEditMode(false)}
                >
                  <FiArrowLeft /> Back
                </button>
              </div>
              
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}
              
              <form onSubmit={handleSubmit}>
                {activeTab === 'personal' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled
                      />
                      <small>Email cannot be changed</small>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="mobile">Mobile Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your mobile number"
                      />
                    </div>
                  </>
                )}
                
                {activeTab === 'address' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="street">Street Address</label>
                      <input
                        type="text"
                        id="street"
                        name="street"
                        value={formData.street}
                        onChange={handleAddressChange}
                        placeholder="Enter street address"
                      />
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleAddressChange}
                          placeholder="Enter city"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="state">State</label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleAddressChange}
                          placeholder="Enter state"
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="zipcode">ZIP Code</label>
                        <input
                          type="text"
                          id="zipcode"
                          name="zipcode"
                          value={formData.zipcode}
                          onChange={handleAddressChange}
                          placeholder="Enter ZIP code"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="country">Country</label>
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleAddressChange}
                          placeholder="Enter country"
                        />
                      </div>
                    </div>
                  </>
                )}
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setIsEditMode(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="save-profile-btn"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {activeTab === 'personal' && (
                <div className="profile-section">
                  <div className="section-header">
                    <h2>Personal Information</h2>
                    <button 
                      className="edit-button" 
                      onClick={() => setIsEditMode(true)}
                    >
                      <FiEdit /> Edit
                    </button>
                  </div>
                  
                  {success && <div className="success-message">{success}</div>}
                  
                  <div className="info-card">
                    <div className="info-row">
                      <div className="info-group">
                        <div className="info-label">
                          <FiUser className="info-icon" />
                          <span>Full Name</span>
                        </div>
                        <div className="info-value">{user.name}</div>
                      </div>
                      
                      <div className="info-group">
                        <div className="info-label">
                          <FiMail className="info-icon" />
                          <span>Email</span>
                        </div>
                        <div className="info-value">{user.email}</div>
                      </div>
                    </div>
                    
                    <div className="info-row">
                      <div className="info-group">
                        <div className="info-label">
                          <FiPhone className="info-icon" />
                          <span>Mobile</span>
                        </div>
                        <div className="info-value">{user.phone || 'Not provided'}</div>
                      </div>
                      
                      <div className="info-group">
                        <div className="info-label">
                          <FiCalendar className="info-icon" />
                          <span>Member Since</span>
                        </div>
                        <div className="info-value">
                          {new Date().toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'address' && (
                <div className="profile-section">
                  <div className="section-header">
                    <h2>Delivery Address</h2>
                    <button 
                      className="edit-button" 
                      onClick={() => setIsEditMode(true)}
                    >
                      <FiEdit /> Edit
                    </button>
                  </div>
                  
                  {success && <div className="success-message">{success}</div>}
                  
                  <div className="info-card">
                    <div className="address-card">
                      <div className="address-icon">
                        <FiHome />
                      </div>
                      <div className="address-details">
                        <h3>Primary Address</h3>
                        <p className="address-text">{formatAddress()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      <div className="profile-footer">
        <p>Need help? Contact our support team at support@fooddelivery.com</p>
      </div>
    </div>
  );
};

export default Profile;