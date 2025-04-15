import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { useCart } from '../context/CartContext.js';
import { FiHome, FiShoppingBag, FiUser, FiShoppingCart, FiMenu, FiCoffee, FiPackage } from 'react-icons/fi';
import LocationSelector from './LocationSelector.js';
import ProfileIcon from './ProfileIcon.js';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { getCartItemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            FoodDelivery
          </Link>
          <LocationSelector />
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            <FiMenu />
          </button>
        </div>

        <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link">
            <FiHome className="nav-icon" /> Home
          </Link>
          
          <Link to="/restaurants/order-online" className="nav-link">
            <FiPackage className="nav-icon" /> Order Online
          </Link>
          
          <Link to="/restaurants/dine-out" className="nav-link">
            <FiCoffee className="nav-icon" /> Dine Out
          </Link>
          
          <Link to="/cart" className="cart-link nav-link">
            <FiShoppingCart className="nav-icon" />
            <span>Cart</span>
            {getCartItemCount() > 0 && (
              <span className="cart-count">{getCartItemCount()}</span>
            )}
          </Link>

          {user ? (
            <ProfileIcon />
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/register" className="register-btn">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
