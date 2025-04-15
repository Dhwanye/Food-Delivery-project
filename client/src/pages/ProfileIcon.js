import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiShoppingBag, FiLogOut, FiPhone, FiMapPin } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.js';
import './ProfileIcon.css';

const ProfileIcon = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get first letter of user name for avatar
  const getInitial = () => {
    if (user && user.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Format address for display
  const formatAddress = () => {
    if (!user || !user.address) return null;
    
    const { street, city, state, zipcode, country } = user.address;
    const addressParts = [];
    
    if (street) addressParts.push(street);
    if (city) addressParts.push(city);
    if (state) addressParts.push(state);
    
    return addressParts.length > 0 ? addressParts.join(', ') : null;
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  if (!user) return null;

  // Prepare user data for display
  const displayMobile = user.mobile || null;
  const displayAddress = formatAddress();

  return (
    <div className="profile-icon-container" ref={dropdownRef}>
      <button
        className="profile-icon-button"
        onClick={toggleDropdown}
      >
        <div className="profile-avatar">
          {user.photo ? (
            <img src={user.photo} alt={user.name} />
          ) : (
            <div className="profile-initial">{getInitial()}</div>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <div className="profile-info">
              <span className="profile-name">{user.name}</span>
              <span className="profile-email">{user.email}</span>
              {displayMobile && (
                <span className="profile-mobile">
                  <FiPhone className="info-icon" /> {displayMobile}
                </span>
              )}
              {displayAddress && (
                <span className="profile-address">
                  <FiMapPin className="info-icon" /> {displayAddress}
                </span>
              )}
            </div>
          </div>
          
          <div className="profile-menu">
            <Link to="/profile" className="profile-menu-item" onClick={() => setIsOpen(false)}>
              <FiUser className="menu-icon" />
              <span>My Profile</span>
            </Link>
            <Link to="/orders" className="profile-menu-item" onClick={() => setIsOpen(false)}>
              <FiShoppingBag className="menu-icon" />
              <span>My Orders</span>
            </Link>
            <button className="profile-menu-item logout-button" onClick={handleLogout}>
              <FiLogOut className="menu-icon" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;