import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiClock, FiShoppingCart, FiStar, FiMapPin, FiSearch } from 'react-icons/fi';
import Footer from '../components/Footer.js';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories] = useState(['All', 'Veg', 'Non-veg', 'Spicy', 'Healthy']);
  const [cartItems, setCartItems] = useState([]);


  // Mock data for restaurants
  const mockRestaurants = [
    {
      id: 1,
      name: 'Tasty Bites',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      cuisine: 'Indian',
      rating: 4.5,
      deliveryTime: '30-40 min',
      isOpen: true,
      discount: '20% OFF',
      location: 'Downtown'
    },
    {
      id: 2,
      name: 'Pizza Paradise',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      cuisine: 'Italian',
      rating: 4.8,
      deliveryTime: '25-35 min',
      isOpen: true,
      discount: '15% OFF',
      location: 'Midtown'
    },
    {
      id: 3,
      name: 'Sushi Master',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fHJlc3RhdXJhbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
      cuisine: 'Japanese',
      rating: 4.7,
      deliveryTime: '35-45 min',
      isOpen: false,
      location: 'Westside'
    },
    {
      id: 4,
      name: 'Green Garden',
      image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      cuisine: 'Vegetarian',
      rating: 4.3,
      deliveryTime: '20-30 min',
      isOpen: true,
      discount: '10% OFF',
      location: 'Eastside'
    },
    {
      id: 5,
      name: 'Burger Joint',
      image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHJlc3RhdXJhbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
      cuisine: 'American',
      rating: 4.6,
      deliveryTime: '15-25 min',
      isOpen: true,
      location: 'Downtown'
    },
    {
      id: 6,
      name: 'Taco House',
      image: 'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
      cuisine: 'Mexican',
      rating: 4.4,
      deliveryTime: '25-40 min',
      isOpen: true,
      discount: '15% OFF',
      location: 'Uptown'
    }
  ];

  // Mock data for featured items
  const mockFeaturedItems = [
    {
      id: 1,
      name: 'Butter Chicken',
      description: 'Tender chicken in rich tomato gravy with butter and fresh cream',
      price: 349,
      image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?ixlib=rb-4.0.3&auto=format&fit=crop&w=684&q=80',
      restaurant: 'Dev International',
      restaurantId: 1,
      rating: 4.5,
      tags: ['non-veg', 'spicy'],
      discount: '₹125 OFF ABOVE ₹349',
      isVeg: false
    },
    {
      id: 2,
      name: 'Paneer Butter Masala',
      description: 'Fresh cottage cheese cubes in rich tomato gravy with butter and cream',
      price: 299,
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      restaurant: 'Apni Rasoi Family Dhaba',
      restaurantId: 2,
      rating: 4.3,
      tags: ['veg', 'spicy'],
      discount: '₹50 OFF ABOVE ₹349',
      isVeg: true
    },
    {
      id: 3,
      name: 'Chicken Biryani',
      description: 'Fragrant basmati rice cooked with tender chicken and aromatic spices',
      price: 299,
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      restaurant: 'Champaran Handi Restaurant',
      restaurantId: 3,
      rating: 4.7,
      tags: ['non-veg', 'spicy'],
      discount: 'ITEMS AT ₹79',
      isVeg: false
    },
    {
      id: 4,
      name: 'Masala Dosa',
      description: 'Crispy rice crepe served with potato masala, sambar and chutneys',
      price: 149,
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      restaurant: 'Accord International',
      restaurantId: 4,
      rating: 4.4,
      tags: ['veg', 'south-indian'],
      isVeg: true
    },
    {
      id: 5,
      name: 'Tandoori Chicken',
      description: 'Marinated chicken grilled to perfection in tandoor',
      price: 399,
      image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      restaurant: 'Hotel Sai Nath & Sai Restaurant',
      restaurantId: 5,
      rating: 4.3,
      tags: ['non-veg', 'spicy'],
      discount: '30% off on pre-booking',
      isVeg: false
    },
    {
      id: 6,
      name: 'Black Forest Pastry',
      description: 'Classic chocolate cake with whipped cream and cherries',
      price: 89,
      image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      restaurant: 'Bakery World',
      restaurantId: 6,
      rating: 4.3,
      tags: ['veg', 'dessert'],
      isVeg: true
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        //setLoading(true);
        // Use mock data directly instead of making API calls
        //setRestaurants(mockRestaurants);
        //setFilteredRestaurants(mockRestaurants);
       // setFeaturedItems(mockFeaturedItems);
        //setError(null);
        //setLoading(false);
        
        // Uncomment this section when your backend is ready
        
        const [restaurantsRes, featuredItemsRes] = await Promise.all([
          axios.get('http://localhost:5001/api/restaurants/featured'),
          axios.get('http://localhost:5001/api/menu-items/featured')
        ]);
        
        setRestaurants(restaurantsRes.data);
        setFilteredRestaurants(restaurantsRes.data);
        setFeaturedItems(featuredItemsRes.data);
        setError(null);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        // Use mock data as fallback
        setRestaurants(mockRestaurants);
        setFilteredRestaurants(mockRestaurants);
        setFeaturedItems(mockFeaturedItems);
        setError('Using sample data for demonstration');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(storedCart);
  }, []);


  const handleSearch = (e) => {
    e.preventDefault();
    
    if (searchQuery.trim() === '') {
      // If search is empty, reset to all restaurants
      setFilteredRestaurants(restaurants);
      return;
    }
    
    // Filter restaurants by name, cuisine, or location
    const filtered = restaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.area.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (filtered.length === 0) {
      // No results found - show message
      setError(`No restaurants found matching "${searchQuery}"`);
    } else {
      setError(null);
    }
    
    setFilteredRestaurants(filtered);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category) {
      const filteredItems = featuredItems.filter(item =>
        item.tags.includes(category.toLowerCase())
      );
      
      setFeaturedItems(filteredItems);
    } else {
      setFeaturedItems(mockFeaturedItems);
    }
  };

  const handleAddToCart = (item) => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = storedCart.find(cartItem => cartItem._id === item._id); // Use _id instead of id if from MongoDB
  
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      storedCart.push({ ...item, quantity: 1 });
    }
  
    localStorage.setItem('cart', JSON.stringify(storedCart));
    setCartItems(storedCart); // ✅ Update state too
    alert('Item added to cart!');
  };
  
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Delicious Food Delivered To Your Doorstep</h1>
          <p>Order from your favorite restaurants with just a few clicks</p>
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for restaurants or cuisine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <FiSearch className="search-icon" /> Search
            </button>
          </form>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <div className="category-tabs">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`category-tab ${selectedCategory === category.toLowerCase() ? 'active' : ''}`}
                onClick={() => handleCategorySelect(category === 'All' ? null : category.toLowerCase())}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="featured-section">
       <div className="section-header">
       <h2 className="section-title">Featured Items</h2>
       <Link to="/menu" className="view-all">View All</Link>
    </div>
  
  {loading ? (
    <div className="loading-spinner">
      <div className="spinner"></div>
    </div>
  ) : error && !searchQuery ? (
    <div className="error-message">
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>Try Again</button>
    </div>
  ) : (
    <>
      {featuredItems.length === 0 && !loading && !error && (
        <p className="no-items-message">No items found for this category.</p>
      )}

      <div className="food-items-grid">
        {featuredItems.map((item) => (
          <div key={item.id} className="food-item-card">
            <div className="food-image-container">
              <img src={item.image} alt={`Dish: ${item.name}`} className="food-item-image" />
            </div>
            <div className="food-item-info">
              <div className="food-header">
                <div className="food-title">
                  <h3>{item.name}</h3>
                  <div className={`veg-badge ${item.isVeg ? 'veg' : 'non-veg'}`}>
                    <div className="veg-icon"></div>
                  </div>
                </div>
                <div className="rating">
                  <span><FiStar /> {item.rating}</span>
                </div>
              </div>
              <div className="food-tags">
                {item.tags.map((tag, index) => (
                  <span key={index} className={`tag ${tag}`}>{tag}</span>
                ))}
              </div>
              <p className="food-description">{item.description}</p>
              <div className="food-item-meta">
                <div className="restaurant-info">
                  <span className="restaurant-link">
                    <Link to={`/restaurant/${item.restaurantId}`}>
                      {item.restaurant}
                    </Link>
                  </span>
                </div>
                <span className="food-price">₹{item.price}</span>
              </div>
              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(item)}
                aria-label={`Add ${item.name} to cart`}
              >
                <FiShoppingCart /> Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )}
</section>


      {/* Restaurants Section */}
      <section className="restaurants-section">
  <div className="section-header">
    <h2 className="section-title">Popular Restaurants</h2>
    <Link to="/restaurants" className="view-all">View All</Link>
  </div>

  {loading ? (
    <div className="loading-spinner">
      <div className="spinner"></div>
    </div>
  ) : error && searchQuery ? (
    <div className="error-message">
      <p>{error}</p>
      <button onClick={() => {
        setSearchQuery('');
        setFilteredRestaurants(restaurants);
        setError(null);
      }}>Clear Search</button>
    </div>
  ) : (
    <div className="restaurants-grid">
      {filteredRestaurants.length === 0 ? (
        <div className="no-results">
          <h3>No restaurants found</h3>
          <p>Try changing your search query</p>
          <button className="reset-search" onClick={() => setSearchQuery('')}>
            Show All Restaurants
          </button>
        </div>
      ) : (
        filteredRestaurants.map((restaurant) => (
          <Link
            key={restaurant.id}
            to={`/restaurant/${restaurant.id}`}
            className="restaurant-card"
          >
            <div className="restaurant-image-container">
              <img
                src={restaurant.imageUrl}
                alt={restaurant.name}
                className="restaurant-image"
              />
              {restaurant.discount && (
                <div className="discount-badge">{restaurant.discount}%</div>
              )}
            </div>
            <div className="restaurant-info">
              <h3>{restaurant.name}</h3>
              <p className="cuisine">{restaurant.cuisine}</p>
              <div className="restaurant-meta">
                <span className="rating"><FiStar /> {restaurant.rating}</span>
                <span className="delivery-info">
                  <FiClock /> {restaurant.deliveryTime}
                </span>
                <span className="location">
                  <FiMapPin /> {restaurant.area}
                </span>
              </div>
              <div className="restaurant-status">
                <span className={`status ${restaurant.isOpen ? 'open' : 'closed'}`}>
                  {restaurant.isOpen ? 'Open Now' : 'Closed'}
                </span>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  )}
</section>

      <Footer />
    </div>
  );
};

export default Home; 