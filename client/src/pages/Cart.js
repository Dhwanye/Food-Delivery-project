import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.js';
import './Cart.css';
import { Link } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, calculateTotal } = useCart();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <h2>Your Cart is Empty</h2>
          <p>Add items from restaurants to start your order</p>
          <Link to="/" className="continue-shopping-btn">
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = calculateTotal();
  const deliveryFee = 40; // Changed to ₹40
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + deliveryFee + tax;

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item._id} className="cart-item">
              <div className="item-image">
                <img 
                  src={item.image || 'https://via.placeholder.com/100x100'} 
                  alt={item.name}
                />
              </div>
              
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-price">₹{item.price}</p>
                
                <div className="item-controls">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              <div className="item-total">
                ₹{(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>₹{deliveryFee}</span>
          </div>

          <div className="summary-row">
            <span>Tax (5%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <button 
            onClick={handleCheckout}
            className="checkout-btn"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;