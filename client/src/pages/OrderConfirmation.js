import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.js';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderId = location.state?.orderId;
        if (!orderId) {
          navigate('/');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setOrder(response.data);
      } catch (err) {
        setError('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="pt-16">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-16">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center">Order not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-8">
            Your order has been placed successfully. We'll notify you when it's on
            the way.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Order ID</span>
              <span className="font-semibold">{order._id.slice(-6)}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Status</span>
              <span className="text-green-500 font-semibold">{order.status}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Estimated Delivery</span>
              <span className="font-semibold">30-40 minutes</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center mb-2"
              >
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
            <p className="text-gray-600">
              {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/"
              className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 text-center"
            >
              Continue Shopping
            </Link>
            <Link
              to="/orders"
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 text-center"
            >
              View Order History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation; 