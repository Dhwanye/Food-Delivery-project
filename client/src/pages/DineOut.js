import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiStar, FiFilter, FiClock, FiChevronDown } from 'react-icons/fi';
import './DineOut.css';

const DineOut = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    restaurantId: null,
    date: '',
    time: '',
    guests: 2
  });
  
  // Active filters
  const [filters, setFilters] = useState({
    all: true,
    rating4plus: false,
    within5km: false,
    pureVeg: false
  });

  // Mock data for dine-out restaurants
  const mockRestaurants = [
    {
      id: 1,
      name: 'Saladish',
      image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      cuisine: 'Healthy Food • Fast Food',
      location: 'Begampura, Surat',
      distance: 0.2,
      rating: 4.6,
      priceForTwo: '₹500 for two',
      discount: '15% off on walk-in',
      hasTableBooking: true,
      offerText: 'Up to 10% off with bank offers',
      isVeg: true
    },
    {
      id: 2,
      name: 'Classic Chicken Mamma',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      cuisine: 'North Indian • Mughlai',
      location: 'Zampa Bazar, Surat',
      distance: 0.4,
      rating: 3.4,
      priceForTwo: '₹500 for two',
      discount: '15% off on walk-in',
      hasTableBooking: true,
      offerText: 'Up to 10% off with bank offers',
      isVeg: false
    },
    {
      id: 3,
      name: 'Broast N Rolls',
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      cuisine: 'Fast Food',
      location: 'Begampura, Surat',
      distance: 1,
      rating: 4.5,
      priceForTwo: '₹500 for two',
      discount: '30% off on pre-booking',
      hasTableBooking: true,
      offerText: 'Up to 10% off with bank offers',
      isVeg: false
    },
    {
      id: 4,
      name: 'Spice Garden',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      cuisine: 'Indian • Chinese',
      location: 'City Light, Surat',
      distance: 2.5,
      rating: 4.2,
      priceForTwo: '₹700 for two',
      discount: '20% off on walk-in',
      hasTableBooking: true,
      offerText: 'Up to 15% off with HDFC cards',
      isVeg: false
    },
    {
      id: 5,
      name: 'La Pino\'z Pizza',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      cuisine: 'Italian • Pizza',
      location: 'Vesu, Surat',
      distance: 3.2,
      rating: 4.0,
      priceForTwo: '₹600 for two',
      discount: '10% off on dine-in',
      hasTableBooking: true,
      offerText: 'Buy 1 Get 1 on selected pizzas',
      isVeg: false
    },
    {
      id: 6,
      name: 'Seafood Paradise',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      cuisine: 'Seafood • Continental',
      location: 'Dumas, Surat',
      distance: 5,
      rating: 4.7,
      priceForTwo: '₹1200 for two',
      discount: '25% off on pre-booking',
      hasTableBooking: true,
      offerText: 'Complimentary dessert with dinner',
      isVeg: false
    },
    {
      id: 7,
      name: 'Green Valley',
      image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      cuisine: 'Pure Vegetarian • North Indian',
      location: 'Adajan, Surat',
      distance: 4.8,
      rating: 4.5,
      priceForTwo: '₹600 for two',
      discount: '10% off on weekdays',
      hasTableBooking: true,
      offerText: 'Complimentary dessert with dinner',
      isVeg: true
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRestaurants(mockRestaurants);
      setFilteredRestaurants(mockRestaurants);
      setLoading(false);
    }, 800);
  }, []);
  

  // useEffect(() => {
  //   const fetchRestaurants = async () => {
  //     try {
  //       const response = await fetch('http://localhost:5001/api/table-bookings'); // update this URL as per your backend
  //       const data = await response.json();
  //       setRestaurants(data);
  //       setFilteredRestaurants(data);
  //     } catch (error) {
  //       console.error('Error fetching restaurants:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  
  //   fetchRestaurants();
  // }, []);
  

  useEffect(() => {
    applyFilters();
  }, [filters, searchQuery, restaurants]);

  const applyFilters = () => {
    let result = [...restaurants];
    
    // Apply search filter
    if (searchQuery.trim()) {
      result = result.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply rating filter
    if (filters.rating4plus) {
      result = result.filter(restaurant => restaurant.rating >= 4);
    }
    
    // Apply distance filter
    if (filters.within5km) {
      result = result.filter(restaurant => restaurant.distance <= 5);
    }
    
    // Apply veg filter
    if (filters.pureVeg) {
      result = result.filter(restaurant => restaurant.isVeg);
    }
    
    setFilteredRestaurants(result);
  };

  const handleFilterChange = (filter) => {
    // If clicking "All", reset all other filters
    if (filter === 'all') {
      setFilters({
        all: true,
        rating4plus: false,
        within5km: false,
        pureVeg: false
      });
    } else {
      // Toggle the selected filter and set "all" to false
      setFilters({
        ...filters,
        [filter]: !filters[filter],
        all: false
      });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // The actual filtering is done in the useEffect/applyFilters
    console.log("Search applied for:", searchQuery);
  };

  const handleSort = (sortBy) => {
    let sortedRestaurants = [...filteredRestaurants];
    
    switch(sortBy) {
      case 'ratingHighToLow':
        sortedRestaurants.sort((a, b) => b.rating - a.rating);
        break;
      case 'ratingLowToHigh':
        sortedRestaurants.sort((a, b) => a.rating - b.rating);
        break;
      case 'distanceNearToFar':
        sortedRestaurants.sort((a, b) => a.distance - b.distance);
        break;
      default:
        // Default sort: no change
        break;
    }
    
    setFilteredRestaurants(sortedRestaurants);
    setShowSortDropdown(false);
  };
  
  const handleBookTableClick = (restaurantId) => {
    setBookingDetails({
      ...bookingDetails,
      restaurantId
    });
    setShowBookingForm(true);
  };
  
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const restaurant = restaurants.find(r => r.id === bookingDetails.restaurantId);
    alert(`Table booked at ${restaurant?.name} for ${bookingDetails.guests} guests on ${bookingDetails.date} at ${bookingDetails.time}`);
    setShowBookingForm(false);
  };
  
   




  // const handleBookingSubmit = async (e) => {
  //   e.preventDefault();
  
  //   try {
  //     const response = await fetch('http://localhost:5000/api/table-bookings', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(bookingDetails),
  //     });
  
  //     if (!response.ok) throw new Error('Failed to book table');
  
  //     const data = await response.json();
  //     const restaurant = restaurants.find(r => r.id === bookingDetails.restaurantId);
  //     alert(`Table booked at ${restaurant?.name} for ${bookingDetails.guests} guests on ${bookingDetails.date} at ${bookingDetails.time}`);
  //     setShowBookingForm(false);
  //   } catch (error) {
  //     alert('Booking failed. Please try again.');
  //     console.error('Booking error:', error);
  //   }
  // };
  

  return (
    <div className="dine-out-page">
      <div className="hero-banner">
        <div className="hero-overlay">
          <h1>Restaurants Near Me For Dining Out</h1>
        </div>
      </div>

      <div className="container">
        <div className="page-tabs">
          <button className="tab active">Dine Out</button>
        </div>

        <div className="filters-section">
          <div className="filter-pills">
            <button 
              className={`filter-pill ${filters.all ? 'active' : ''}`} 
              onClick={() => handleFilterChange('all')}
            >
              <FiFilter /> All
            </button>
            
            <div className="filter-dropdown">
              <button 
                className="filter-pill" 
                onClick={() => setShowSortDropdown(!showSortDropdown)}
              >
                Sort By <FiChevronDown />
              </button>
              {showSortDropdown && (
                <div className="dropdown-menu">
                  <button onClick={() => handleSort('ratingHighToLow')}>Rating: High to Low</button>
                  <button onClick={() => handleSort('ratingLowToHigh')}>Rating: Low to High</button>
                  <button onClick={() => handleSort('distanceNearToFar')}>Distance: Near to Far</button>
                </div>
              )}
            </div>
            
            <button 
              className={`filter-pill ${showBookingForm ? 'active' : ''}`}
              onClick={() => setShowBookingForm(!showBookingForm)}
            >
              Book a table
            </button>
            
            <button 
              className={`filter-pill ${filters.within5km ? 'active' : ''}`}
              onClick={() => handleFilterChange('within5km')}
            >
              Within 5km
            </button>
            
            <button 
              className={`filter-pill ${filters.rating4plus ? 'active' : ''}`} 
              onClick={() => handleFilterChange('rating4plus')}
            >
              Rating 4+
            </button>
            
            <button 
              className={`filter-pill ${filters.pureVeg ? 'active' : ''}`} 
              onClick={() => handleFilterChange('pureVeg')}
            >
              Pure Veg
            </button>
          </div>

          <form className="search-form" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search for restaurants" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>
        
        {showBookingForm && (
          <div className="booking-form-container">
            <form onSubmit={handleBookingSubmit} className="booking-form">
              <h3>Book a Table</h3>
              
              <div className="form-group">
                <label>Select Restaurant</label>
                <select 
                  value={bookingDetails.restaurantId || ''} 
                  onChange={(e) => setBookingDetails({...bookingDetails, restaurantId: parseInt(e.target.value)})}
                  required
                >
                  <option value="">Select a restaurant</option>
                  {restaurants.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  value={bookingDetails.date}
                  onChange={(e) => setBookingDetails({...bookingDetails, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Time</label>
                <input 
                  type="time" 
                  value={bookingDetails.time}
                  onChange={(e) => setBookingDetails({...bookingDetails, time: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Number of Guests</label>
                <input 
                  type="number" 
                  min="1" 
                  max="20"
                  value={bookingDetails.guests}
                  onChange={(e) => setBookingDetails({...bookingDetails, guests: parseInt(e.target.value)})}
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => setShowBookingForm(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Book Now
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Finding great places to dine...</p>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="no-results">
            <h3>No restaurants found</h3>
            <p>Try changing your filters or search query</p>
          </div>
        ) : (
          <div className="restaurants-grid">
            {filteredRestaurants.map(restaurant => (
              <div key={restaurant.id} className="restaurant-card">
                <div className="restaurant-image-container">
                  <img src={restaurant.image} alt={restaurant.name} className="restaurant-image" />
                  {restaurant.discount && (
                    <div className="restaurant-badge">{restaurant.discount}</div>
                  )}
                </div>
                <div className="restaurant-details">
                  <h3 className="restaurant-name">{restaurant.name}</h3>
                  <div className="restaurant-rating">
                    <span className={`rating-badge ${restaurant.rating >= 4 ? 'high' : restaurant.rating >= 3 ? 'medium' : 'low'}`}>
                      <FiStar /> {restaurant.rating}
                    </span>
                  </div>
                  <p className="restaurant-cuisine">{restaurant.cuisine}</p>
                  <div className="restaurant-location">
                    <FiMapPin /> {restaurant.location} • {restaurant.distance} km
                  </div>
                  <div className="restaurant-price">{restaurant.priceForTwo}</div>
                  
                  <div className="restaurant-features">
                    {restaurant.isVeg && (
                      <div className="veg-badge">
                        <div className="veg-icon"></div> Pure Vegetarian
                      </div>
                    )}
                    
                    {restaurant.hasTableBooking && (
                      <button 
                        className="book-table-btn"
                        onClick={() => handleBookTableClick(restaurant.id)}
                      >
                        <span className="icon">🍽️</span> Book a table
                      </button>
                    )}
                    <div className="offer-text">{restaurant.offerText}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DineOut; 