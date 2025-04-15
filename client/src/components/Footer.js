import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Food Delivery</h3>
          <p>Delicious food delivered to your doorstep</p>
          <div className="social-links">
            <a href="#" className="social-link"><i className="fab fa-facebook"></i></a>
            <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
            <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
            <a href="#" className="social-link"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/restaurants">Restaurants</Link></li>
            <li><Link to="/orders">My Orders</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Us</h4>
          <ul className="contact-info">
            <li><i className="fas fa-map-marker-alt"></i> 123 Food Street, City</li>
            <li><i className="fas fa-phone"></i> +1 234 567 890</li>
            <li><i className="fas fa-envelope"></i> support@fooddelivery.com</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Newsletter</h4>
          <p>Subscribe to our newsletter for updates</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Food Delivery. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 