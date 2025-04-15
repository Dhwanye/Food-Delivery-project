import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.js';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, removeFromCart, updateQuantity, calculateTotal, clearCart, getCartItemCount } = useCart();
  const [deliveryFee] = useState(5.99);
  const [promoCode, setPromoCode] = useState('');
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const navigate = useNavigate();

  // Calculate the subtotal from cart items
  const subTotal = calculateTotal();
  // Calculate the total (subtotal + delivery fee)
  const total = subTotal + deliveryFee;
  // Get the total number of items in the cart
  const itemCount = getCartItemCount();

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    // Add promo code logic here
    alert('Promo code applied!');
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    // Here you would typically process the payment and create the order
    alert('Order placed successfully!');
    clearCart();
    navigate('/orders');
  };

  return (
    <div className="checkout-page">
      {/* Header */}
      <header className="site-header">
        <div className="header-content">
          <Link to="/" className="logo">Checkout</Link>
          
          <div className="header-actions">
            <button className="search-btn">
              <i className="fas fa-search"></i>
            </button>
            <Link to="/cart" className="cart-btn">
              <i className="fas fa-shopping-basket"></i>
            </Link>
          </div>
        </div>
      </header>
      

      <div className="checkout-container">
        {!showCheckoutForm ? (
          <>
            {/* Cart Table */}
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Items</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item._id}>
                    <td>
                      <img src={item.image || 'https://via.placeholder.com/60x60'} alt={item.name} className="item-image" />
                    </td>
                    <td>{item.name}</td>
                    <td>₹{item.price.toFixed(2)}</td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                        min="1"
                      />
                    </td>
                    <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button onClick={() => handleRemoveItem(item._id)} className="remove-btn">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="checkout-summary">
              {/* Cart Total */}
              <div className="cart-total">
                <h2>Cart Total</h2>
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>₹{subTotal.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="total-row final-total">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <button 
                  className="proceed-btn" 
                  onClick={() => setShowCheckoutForm(true)}
                  disabled={itemCount === 0}
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>

              {/* Promo Code */}
              <div className="promo-code">
                <h2>Promo Code</h2>
                <form onSubmit={handlePromoSubmit}>
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button type="submit">APPLY</button>
                </form>
              </div>
            </div>
          </>
        ) : (
          <div className="checkout-form">
            <h2>Delivery Information</h2>
            <form onSubmit={handleCheckout}>
              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={deliveryAddress.street}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={deliveryAddress.city}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={deliveryAddress.state}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={deliveryAddress.zipCode}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={deliveryAddress.phone}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
              </div>
              
              <h2>Payment Method</h2>
              <div className="payment-options">
                <div className="payment-option">
                  <input
                    type="radio"
                    id="card"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <label htmlFor="card">Credit/Debit Card</label>
                </div>
                <div className="payment-option">
                  <input
                    type="radio"
                    id="cash"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                  />
                  <label htmlFor="cash">Cash on Delivery</label>
                </div>
              </div>
              
              {paymentMethod === 'card' && (
                <>
                  <div className="form-group">
                    <label>Card Number</label>
                    <input type="text" placeholder="1234 5678 9012 3456" required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input type="text" placeholder="MM/YY" required />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input type="text" placeholder="123" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Name on Card</label>
                    <input type="text" required />
                  </div>
                </>
              )}
              
              <div className="order-summary">
                <h2>Order Summary</h2>
                <div className="summary-item">
                  <span>Items ({itemCount})</span>
                  <span>₹{subTotal.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="summary-item total">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="back-btn" onClick={() => setShowCheckoutForm(false)}>
                  Back to Cart
                </button>
                <button type="submit" className="place-order-btn">
                  Place Order
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout; 