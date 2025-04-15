import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { useCart } from '../context/CartContext.js';
import axios from 'axios';
import './RestaurantDetails.css';
import Notification from '../components/Notification.js';

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    cart, 
    addToCart, 
    updateQuantity, 
    getCartTotal, 
    getCartItemCount,
    cartItems,
    removeFromCart,
    calculateTotal
  } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [itemsToShow, setItemsToShow] = useState(20);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const [restaurantRes, menuRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/restaurants/${id}`),
          axios.get(`http://localhost:5000/api/restaurants/${id}/menu`)
        ]);
        setRestaurant(restaurantRes.data);
        setMenuItems(menuRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch restaurant details');
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [id]);

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: `/restaurants/${id}` } });
      return;
    }
    navigate('/checkout');
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    setNotification({
      show: true,
      message: `${item.name} added to cart!`,
      type: 'success'
    });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Group menu items by category
  const menuByCategory = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!restaurant) {
    return <div className="error">Restaurant not found</div>;
  }

  const totalItems = getCartItemCount();
  const subtotal = getCartTotal();

  return (
    <div className="restaurant-details">
      {notification.show && (
        <Notification 
          message={notification.message} 
          type={notification.type}
          onClose={() => setNotification({ show: false, message: '', type: '' })}
        />
      )}
      
      <div className="restaurant-header">
        <img 
          src={restaurant.image || 'https://via.placeholder.com/800x400'} 
          alt={restaurant.name}
          className="restaurant-image"
        />
        <div className="restaurant-info">
          <h1>{restaurant.name}</h1>
          <p className="cuisine">{restaurant.cuisine}</p>
          <div className="restaurant-meta">
            <span>⭐ {restaurant.rating || '4.5'}</span>
            <span>⏱️ {restaurant.deliveryTime || '30-45 min'}</span>
            <span>💰 {restaurant.minOrder || '$10'} min order</span>
          </div>
          <p className="description">{restaurant.description}</p>
        </div>
      </div>

      <div className="restaurant-content">
        <div className="menu-section">
          {Object.entries(menuByCategory).map(([category, items]) => (
            <div key={category} className="category-section">
              <h2>{category}</h2>
              <div className="menu-items">
                {(expandedCategories[category] ? items : items.slice(0, itemsToShow)).map(item => (
                  <div key={item._id} className="menu-item">
                    <img 
                      src={item.image || 'https://via.placeholder.com/300x200'} 
                      alt={item.name}
                      className="item-image"
                    />
                    <div className="item-info">
                      <h3>{item.name}</h3>
                      <p className="item-description">{item.description}</p>
                      <p className="item-price">${item.price.toFixed(2)}</p>
                      <button 
                        onClick={() => handleAddToCart(item)}
                        className="add-to-cart-btn"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {items.length > itemsToShow && (
                <button 
                  onClick={() => toggleCategory(category)}
                  className="view-more-btn"
                >
                  {expandedCategories[category] ? 
                    'Show Less' : 
                    `View All ${category} (${items.length - itemsToShow} more items)`
                  }
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="cart-sidebar">
          <h2>Your Order {cartItems.length > 0 && `(${cartItems.length} items)`}</h2>
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <img 
                src="https://via.placeholder.com/150" 
                alt="Empty cart"
                className="empty-cart-image"
              />
              <p>Your cart is empty</p>
              <p className="empty-cart-subtitle">Add items from the menu to start your order</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item._id} className="cart-item">
                    <img 
                      src={item.image || 'https://via.placeholder.com/60x60'} 
                      alt={item.name}
                      className="cart-item-image"
                    />
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <div className="quantity-controls">
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="quantity-btn"
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="item-price">
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                      <button 
                        onClick={() => removeFromCart(item._id)}
                        className="remove-item"
                        title="Remove item"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <div className="subtotal">
                  <span>Subtotal</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="delivery-fee">
                  <span>Delivery Fee</span>
                  <span>$2.99</span>
                </div>
                <div className="total">
                  <span>Total</span>
                  <span>${(calculateTotal() + 2.99).toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="checkout-btn"
                >
                  Proceed to Checkout (${(calculateTotal() + 2.99).toFixed(2)})
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails; 