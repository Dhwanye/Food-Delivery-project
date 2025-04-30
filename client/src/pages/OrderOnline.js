import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiFilter, FiSearch, FiX, FiChevronDown } from 'react-icons/fi';
import { useCart } from '../context/CartContext.js';
import './OrderOnline.css';
import axios from 'axios';
const OrderOnline = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const { addToCart } = useCart();
  //const [menuItems, setMenuItems] = useState([]); 


  // Categories for food items
  const categories = ['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Indian', 'Fast Food', 'Gujarati', 'South Indian'];

  // Filter options
  const filterOptions = [
    { id: 'offers', label: 'Offers', value: 'offers' },
    { id: 'veg', label: 'Pure Veg', value: 'veg' },
    { id: 'rating4plus', label: 'Ratings 4.0+', value: 'rating4plus' },
    { id: 'less300', label: 'Less than ₹300', value: 'less300' },
    { id: '300to600', label: '₹300-₹600', value: '300to600' }
  ];

  // Sort options
  const sortOptions = [
    { label: 'Relevance', value: 'relevance' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Rating', value: 'rating' },
    //{ label: 'Delivery Time', value: 'delivery_time' }
  ];

  // 
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);  // Optionally set loading state to true
  
        // Make API calls to fetch menu items and featured items
        const [menuItemsRes, featuredItemsRes] = await Promise.all([
          axios.get('https://food-delivery-project-7os6.onrender.com/api/menu-items'),
          //axios.get('http://localhost:5001/api/menu-items/featured')
        ]);
  
        // Assuming your API returns data in 'data' property
        setFoodItems(menuItemsRes
          .data);  // Set the full list of menu items
        setFilteredItems(menuItemsRes.data);  // Set the filtered list (if applicable)
       // setFeaturedItems(featuredItemsRes.data);  // Set featured items
  
        setError(null);  // Reset error state
        setLoading(false);  // Set loading to false when data is fetched successfully
      } catch (err) {
       
          console.error("Fetch Error:", err?.response?.data || err.message || err);
          setError("Error in fetching data");
          setLoading(false);
        
        // Handle errors
        //setLoading(false);  // Stop loading on error
      }
    };
  
    fetchData();  // Call the fetch function when component mounts
  
  }, []);  // Empty dependency array means it will run once when the component is mounted
  


  useEffect(() => {
    // Apply filters and sorting
    const applyFiltersAndSort = () => {
      let filtered = [...foodItems];
      
      // Filter by category
      if (activeCategory !== 'All') {
        filtered = filtered.filter(item => item.category === activeCategory);
      }
      
      // Apply additional filters
     if (activeFilters.includes('offers')) {
     filtered = filtered.filter(item => item.discount);
    }

      
      if (activeFilters.includes('veg')) {
        filtered = filtered.filter(item => item.isVeg);
      }
      
      if (activeFilters.includes('rating4plus')) {
        filtered = filtered.filter(item => item.rating >= 4.0);
      }
      
      if (activeFilters.includes('less300')) {
        filtered = filtered.filter(item => item.price < 300);
      }
      
      if (activeFilters.includes('300to600')) {
        filtered = filtered.filter(item => item.price >= 300 && item.price <= 600);
      }
      
      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.restaurant.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply sorting
      if (sortBy) {
        switch (sortBy) {
          case 'price_asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
          case 'price_desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
          // case 'delivery_time':
          //   filtered.sort((a, b) => {
          //     const timeA = parseInt(a.preparation_time.split('-')[0] || a.preparation_time);
          //     const timeB = parseInt(b.preparation_time.split('-')[0] || b.preparation_time);
          //     return timeA - timeB;
          //  });
           // break;
          default:
            // default is relevance, no sorting needed
            break;
        }
      }
      
      setFilteredItems(filtered);
    };
    
    applyFiltersAndSort();
  }, [activeCategory, searchTerm, foodItems, activeFilters, sortBy]);
  
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const clearSearch = () => {
    setSearchTerm('');
  };
  
  const toggleFilter = (filter) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };
  
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  const handleAddToCart = (item) => {
    addToCart(item);
    setNotification({
      show: true,
      message: `${item.name} added to cart!`,
      type: 'success'
    });
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };
  
  if (loading) {
    return <div className="loading">Loading food items...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  

  return (
    <div className="order-online-container">
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      
      <div className="order-online-header">
        <h1>Order Online</h1>
        <p>Delicious food delivered to your doorstep</p>
      </div>

      <div className="search-filter-container">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input 
            type="text"
            placeholder="Search for dishes, restaurants, cuisine..." 
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button className="clear-search" onClick={clearSearch}>
              <FiX />
            </button>
          )}
        </div>
        <div className="filter-container">
          <button 
            className={`filter-button ${showFilters ? 'active' : ''}`} 
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter /> Filter {activeFilters.length > 0 && `(${activeFilters.length})`}
          </button>
          
          <div className="sort-container">
            <select 
              className="sort-select" 
              value={sortBy} 
              onChange={handleSortChange}
            >
              <option value="" disabled>Sort By</option>
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FiChevronDown className="sort-icon" />
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="filter-options">
          {filterOptions.map(filter => (
            <button
              key={filter.id}
              className={`filter-option ${activeFilters.includes(filter.value) ? 'active' : ''}`}
              onClick={() => toggleFilter(filter.value)}
            >
              {filter.label}
              {activeFilters.includes(filter.value) && (
                <span className="filter-checkmark">✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category}
            className={`category-tab ${activeCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="results-info">
        <p>{filteredItems.length} results found</p>
        {activeFilters.length > 0 && (
          <button className="clear-filters" onClick={() => setActiveFilters([])}>
            Clear all filters
          </button>
        )}
      </div>

      <div className="food-items-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item._id} className="food-item-card">
              <div className="food-item-image-container">
                <img src={item.image} alt={item.name} className="food-item-image" />
                <div className={`veg-indicator ${item.isVeg ? 'veg' : 'non-veg'}`}>
                  <div className="indicator-dot"></div>
                </div>
                {item.discount && <div className="offer-badge">{item.discount}</div>}
              </div>
              <div className="food-item-info">
                <div className="food-header">
                  <h3>{item.name}</h3>
                  <div className="rating">
                    <span>★ {item.rating}</span>
                  </div>
                </div>
                <p className="food-description">{item.description}</p>
                <div className="food-item-details">
                  <span className="food-prep-time">{item.preparation_time}</span>
                  
                </div>
                <div className="restaurant-name">{item.restaurant}</div>
                <div className="food-item-footer">
                  <span className="food-price">₹{item.price}</span>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(item)}
                  >
                    <FiShoppingCart /> Add
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-items">
            <p>No food items found matching your criteria.</p>
            <button className="reset-search" onClick={() => {
              setSearchTerm('');
              setActiveFilters([]);
              setActiveCategory('All');
            }}>
              Reset search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderOnline; 