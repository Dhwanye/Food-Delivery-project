import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { FiPackage, FiClock, FiCalendar, FiMapPin, FiTruck, FiCheck, FiAlertCircle } from 'react-icons/fi';
import './Orders.css';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // Mock order data for development
  const MOCK_ORDERS = [
    {
      _id: 'ord-' + Math.random().toString(36).substr(2, 6),
      status: 'Delivered',
      items: [
        { _id: 'item1', name: 'Butter Chicken', quantity: 1, price: 299 },
        { _id: 'item2', name: 'Garlic Naan', quantity: 2, price: 49 }
      ],
      restaurant: {
        name: 'Punjabi Tadka',
        address: '123 Main St, Delhi, India'
      },
      total: 397,
      deliveryAddress: '456 Park Avenue, Mumbai, India',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      deliveryTime: '30-40 min',
      trackingSteps: [
        { name: 'Order Placed', time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 0 * 60 * 1000).toISOString(), completed: true },
        { name: 'Order Confirmed', time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString(), completed: true },
        { name: 'Preparation Started', time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000).toISOString(), completed: true },
        { name: 'Out for Delivery', time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(), completed: true },
        { name: 'Delivered', time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 75 * 60 * 1000).toISOString(), completed: true }
      ],
      paymentMethod: 'Credit Card',
      paymentId: 'pay_' + Math.random().toString(36).substr(2, 8),
      deliveryInstructions: 'Please leave at the door',
      deliveryPartner: 'Rahul S.'
    },
    {
      _id: 'ord-' + Math.random().toString(36).substr(2, 6),
      status: 'Processing',
      items: [
        { _id: 'item3', name: 'Masala Dosa', quantity: 1, price: 149 },
        { _id: 'item4', name: 'Filter Coffee', quantity: 2, price: 79 }
      ],
      restaurant: {
        name: 'South Indian Delights',
        address: '789 MG Road, Bangalore, India'
      },
      total: 307,
      deliveryAddress: '456 Park Avenue, Mumbai, India',
      createdAt: new Date().toISOString(),
      deliveryTime: '45-55 min',
      trackingSteps: [
        { name: 'Order Placed', time: new Date(Date.now() - 30 * 60 * 1000).toISOString(), completed: true },
        { name: 'Order Confirmed', time: new Date(Date.now() - 20 * 60 * 1000).toISOString(), completed: true },
        { name: 'Preparation Started', time: new Date(Date.now() - 10 * 60 * 1000).toISOString(), completed: true },
        { name: 'Out for Delivery', time: null, completed: false },
        { name: 'Delivered', time: null, completed: false }
      ],
      paymentMethod: 'UPI',
      paymentId: 'pay_' + Math.random().toString(36).substr(2, 8),
      deliveryInstructions: 'Call when you arrive',
      deliveryPartner: null
    },
    {
      _id: 'ord-' + Math.random().toString(36).substr(2, 6),
      status: 'Cancelled',
      items: [
        { _id: 'item5', name: 'Cheese Pizza', quantity: 1, price: 249 },
        { _id: 'item6', name: 'Garlic Bread', quantity: 1, price: 99 }
      ],
      restaurant: {
        name: 'Pizza Haven',
        address: '567 Pizza Street, Mumbai, India'
      },
      total: 348,
      deliveryAddress: '456 Park Avenue, Mumbai, India',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      deliveryTime: 'Cancelled',
      trackingSteps: [
        { name: 'Order Placed', time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 0 * 60 * 1000).toISOString(), completed: true },
        { name: 'Order Confirmed', time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(), completed: true },
        { name: 'Cancelled', time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(), completed: true, isCancelled: true },
      ],
      paymentMethod: 'Cash on Delivery',
      paymentId: null,
      deliveryInstructions: '',
      deliveryPartner: null,
      cancellationReason: 'Restaurant was unable to prepare the order due to high demand'
    }
  ];

  useEffect(() => {
    // Simulate API call with mock data
    const fetchOrders = async () => {
      try {
        // In a real app, we would fetch from an API
        // const response = await axios.get(`/api/orders/user/${user.id}`);
        
        // For development, use mock data
        setTimeout(() => {
          setOrders(MOCK_ORDERS);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to fetch orders');
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
      setError('Please log in to view your orders');
    }
  }, [user]);

  const getFilteredOrders = () => {
    if (activeTab === 'all') return orders;
    return orders.filter(order => {
      if (activeTab === 'processing') return order.status === 'Processing';
      if (activeTab === 'delivered') return order.status === 'Delivered';
      if (activeTab === 'cancelled') return order.status === 'Cancelled';
      return true;
    });
  };

  const toggleOrderExpansion = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return 'Pending';
    
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading your orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  const filteredOrders = getFilteredOrders();

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>View and track your orders</p>
      </div>
      
      <div className="orders-tabs">
        <button 
          className={`order-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Orders
        </button>
        <button 
          className={`order-tab ${activeTab === 'processing' ? 'active' : ''}`}
          onClick={() => setActiveTab('processing')}
        >
          Processing
        </button>
        <button 
          className={`order-tab ${activeTab === 'delivered' ? 'active' : ''}`}
          onClick={() => setActiveTab('delivered')}
        >
          Delivered
        </button>
        <button 
          className={`order-tab ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled
        </button>
      </div>
      
      {filteredOrders.length === 0 ? (
        <div className="no-orders">
          <div className="no-orders-icon">
            <FiPackage />
          </div>
          <h2>No orders found</h2>
          <p>{activeTab === 'all' ? 
            "You haven't placed any orders yet. Hungry? Order some delicious food!" : 
            `You don't have any ${activeTab} orders.`}
          </p>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-id">
                  <h3>Order #{order._id.slice(-6)}</h3>
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-date">
                  <FiCalendar className="order-icon" />
                  {formatDate(order.createdAt)}
                </div>
              </div>
              
              <div className="order-summary">
                <div className="restaurant-info">
                  <h4>{order.restaurant.name}</h4>
                  <p>
                    <FiMapPin className="order-icon" />
                    {order.restaurant.address}
                  </p>
                </div>
                
                <div className="order-brief">
                  <div className="order-items-preview">
                    {order.items.slice(0, 2).map((item, index) => (
                      <span key={item._id}>
                        {item.quantity}x {item.name}
                        {index < Math.min(order.items.length, 2) - 1 ? ', ' : ''}
                      </span>
                    ))}
                    {order.items.length > 2 && (
                      <span> +{order.items.length - 2} more</span>
                    )}
                  </div>
                  <div className="order-total-brief">
                    <span>Total:</span>
                    <span className="total-amount">₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {order.status === 'Processing' && (
                <div className="live-tracking">
                  <h5>Live Order Tracking</h5>
                  <div className="tracking-steps">
                    {order.trackingSteps.map((step, index) => (
                      <div key={index} className={`tracking-step ${step.completed ? 'completed' : ''} ${step.isCancelled ? 'cancelled' : ''}`}>
                        <div className="step-indicator">
                          {step.completed ? (
                            step.isCancelled ? (
                              <FiAlertCircle className="step-icon cancelled" />
                            ) : (
                              <FiCheck className="step-icon" />
                            )
                          ) : (
                            <div className="step-number">{index + 1}</div>
                          )}
                          {index < order.trackingSteps.length - 1 && <div className="step-line"></div>}
                        </div>
                        <div className="step-content">
                          <div className="step-name">{step.name}</div>
                          <div className="step-time">{formatTime(step.time)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {order.deliveryPartner && (
                    <div className="delivery-partner">
                      <div className="partner-label">Delivery Partner:</div>
                      <div className="partner-name">{order.deliveryPartner}</div>
                    </div>
                  )}
                  
                  <div className="expected-delivery">
                    <FiTruck className="order-icon" />
                    <span>Expected delivery in {order.deliveryTime}</span>
                  </div>
                </div>
              )}
              
              <div className="order-actions">
                <button 
                  className="order-details-btn" 
                  onClick={() => toggleOrderExpansion(order._id)}
                >
                  {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                </button>
                
                {order.status === 'Delivered' && (
                  <button className="reorder-btn">Reorder</button>
                )}
                
                {order.status === 'Processing' && (
                  <button className="help-btn">Get Help</button>
                )}
              </div>
              
              {expandedOrder === order._id && (
                <div className="order-details-expanded">
                  <div className="details-section">
                    <h5>Order Items</h5>
                    <table className="items-table">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Qty</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map(item => (
                          <tr key={item._id} className="order-item">
                            <td className="item-name">{item.name}</td>
                            <td className="item-quantity">{item.quantity}</td>
                            <td className="item-price">₹{item.price.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="order-total">
                          <td colSpan="2">Total</td>
                          <td>₹{order.total.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  
                  <div className="details-section">
                    <h5>Delivery Information</h5>
                    <div className="info-grid">
                      <div className="info-item">
                        <div className="info-label">Address</div>
                        <div className="info-value">{order.deliveryAddress}</div>
                      </div>
                      
                      <div className="info-item">
                        <div className="info-label">Payment Method</div>
                        <div className="info-value">{order.paymentMethod}</div>
                      </div>
                      
                      {order.paymentId && (
                        <div className="info-item">
                          <div className="info-label">Payment ID</div>
                          <div className="info-value">{order.paymentId}</div>
                        </div>
                      )}
                      
                      {order.deliveryInstructions && (
                        <div className="info-item">
                          <div className="info-label">Instructions</div>
                          <div className="info-value">{order.deliveryInstructions}</div>
                        </div>
                      )}
                      
                      {order.cancellationReason && (
                        <div className="info-item">
                          <div className="info-label">Cancellation Reason</div>
                          <div className="info-value error-text">{order.cancellationReason}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="details-section">
                    <h5>Order Timeline</h5>
                    <div className="timeline">
                      {order.trackingSteps.map((step, index) => (
                        step.completed && (
                          <div key={index} className={`timeline-item ${step.isCancelled ? 'cancelled' : ''}`}>
                            <div className="timeline-time">
                              {formatTime(step.time)}
                            </div>
                            <div className="timeline-content">
                              <div className="timeline-dot"></div>
                              <div className="timeline-text">
                                {step.name}
                              </div>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders; 