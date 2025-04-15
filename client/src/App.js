import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { CartProvider } from './context/CartContext.js';
import Navbar from './components/Navbar.js';
import Home from './pages/Home.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import RestaurantDetails from './pages/RestaurantDetails.js';
import Profile from './pages/Profile.js';
import Cart from './pages/Cart.js';
import Checkout from './pages/Checkout.js';
import OrderConfirmation from './pages/OrderConfirmation.js';
import Orders from './pages/Orders.js';
import DineOut from './pages/DineOut.js';
import OrderOnline from './pages/OrderOnline.js';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/restaurants" element={<Home />} />
                <Route path="/restaurants/dine-out" element={<DineOut />} />
                <Route path="/restaurants/order-online" element={<OrderOnline />} />
                <Route path="/restaurants/category/:categoryId" element={<Home />} />
                <Route path="/restaurant/:id" element={<RestaurantDetails />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/orders" element={<Orders />} />
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
