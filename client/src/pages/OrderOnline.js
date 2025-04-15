import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiFilter, FiSearch, FiX, FiChevronDown } from 'react-icons/fi';
import { useCart } from '../context/CartContext.js';
import './OrderOnline.css';

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
    { label: 'Delivery Time', value: 'delivery_time' }
  ];

  useEffect(() => {
    // In a real app, this would fetch from your API
    const fetchFoodItems = async () => {
      try {
        // Simulating API call with sample data
        const sampleFoodItems = [
          // Original items
          {
            _id: "1",
            name: "Classic Margherita Pizza",
            description: "Fresh tomatoes, mozzarella, basil, and olive oil",
            price: 399,
            category: "Fast Food",
            image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&auto=format",
            isVeg: true,
            rating: 4.5,
            restaurant: "Pizza Haven",
            restaurantId: "1",
            preparation_time: "20 mins",
            calories: 650,
            offer: "50% OFF UPTO ₹100"
          },
          {
            _id: "2",
            name: "Chicken Alfredo Pasta",
            description: "Creamy alfredo sauce with grilled chicken and parmesan",
            price: 449,
            category: "Main Course",
            image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMGFsZnJlZG8lMjBwYXN0YXxlbnwwfHwwfHx8MA%3D%3D",
            isVeg: false,
            rating: 4.3,
            restaurant: "Pasta Paradise",
            restaurantId: "2",
            preparation_time: "25 mins",
            calories: 850
          },
          {
            _id: "3",
            name: "Caesar Salad",
            description: "Crisp romaine lettuce, croutons, and caesar dressing",
            price: 249,
            category: "Appetizers",
            image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&auto=format",
            isVeg: true,
            rating: 4.0,
            restaurant: "Fresh Greens",
            restaurantId: "3",
            preparation_time: "10 mins",
            calories: 320
          },
          {
            _id: "4",
            name: "Chocolate Lava Cake",
            description: "Warm chocolate cake with a molten center",
            price: 199,
            category: "Desserts",
            image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&auto=format",
            isVeg: true,
            rating: 4.8,
            restaurant: "Sweet Delights",
            restaurantId: "4",
            preparation_time: "15 mins",
            calories: 410
          },
          {
            _id: "5",
            name: "Mango Smoothie",
            description: "Fresh mango blended with yogurt and honey",
            price: 149,
            category: "Beverages",
            image: "https://images.unsplash.co/photo-1623065422902-30a2d299bbe4?w=605&auto=format",
            isVeg: true,
            rating: 4.6,
            restaurant: "Juice Junction",
            restaurantId: "5",
            preparation_time: "5 mins",
            calories: 220
          },
          {
            _id: "6",
            name: "BBQ Burger",
            description: "Angus beef patty with BBQ sauce and crispy onions",
            price: 349,
            category: "Fast Food",
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format",
            isVeg: false,
            rating: 4.4,
            restaurant: "Burger Barn",
            restaurantId: "6",
            preparation_time: "18 mins",
            calories: 780
          },
          {
            _id: "7",
            name: "Garlic Bread",
            description: "Toasted bread with garlic butter and herbs",
            price: 129,
            category: "Appetizers",
            image: "https://plus.unsplash.com/premium_photo-1711752902321-ef7b72b28b26?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z2FybGljJTIwYnJlYWR8ZW58MHx8MHx8fDA%3D",
            isVeg: true,
            rating: 4.1,
            restaurant: "Italian Corner",
            restaurantId: "7",
            preparation_time: "8 mins",
            calories: 280
          },
          {
            _id: "8",
            name: "Tiramisu",
            description: "Italian coffee-flavored dessert",
            price: 229,
            category: "Desserts",
            image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format",
            isVeg: true,
            rating: 4.7,
            restaurant: "Dolce Vita",
            restaurantId: "8",
            preparation_time: "30 mins",
            calories: 380
          },
          
          // New Indian Food Items
          {
            _id: "9",
            name: "Khaman Dhokla",
            description: "Steamed savory cake made from gram flour, served with green chutney",
            price: 249,
            category: "Gujarati",
            image: "https://media.istockphoto.com/id/1257018928/photo/gujarati-khaman-dhokla-or-steamed-gram-flour-puffy-snack-cake.webp?a=1&b=1&s=612x612&w=0&k=20&c=YQTu_3O4g7MJ7iRqXrl634_J_SajzmaF-E9W51YdAOs=",
            isVeg: true,
            rating: 4.4,
            restaurant: "Jalaram Locho & Khaman",
            restaurantId: "9",
            preparation_time: "20-25 mins",
            calories: 180,
            offer: "₹125 OFF ABOVE ₹249"
          },
          {
            _id: "10",
            name: "Locho",
            description: "Steamed snack made with gram flour, served with chutney and sev",
            price: 199,
            category: "Gujarati",
            image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format",
            isVeg: true,
            rating: 4.5,
            restaurant: "Jani Locho",
            restaurantId: "10",
            preparation_time: "20-25 mins",
            calories: 220,
            offer: "50% OFF UPTO ₹100"
          },
          {
            _id: "11",
            name: "Medu Vada",
            description: "South Indian savory donut made with urad dal, served with chutney and sambar",
            price: 149,
            category: "South Indian",
            image: "https://media.istockphoto.com/id/1205482272/photo/medu-wada-with-sambar-and-chutney-south-indian-breakfast-or-snack-dish-on-banana-leaf.webp?a=1&b=1&s=612x612&w=0&k=20&c=feVBcc7h6S0-uRmLWtlPmc8ItsedwNOlf9LsCVPG8-Y=",
            isVeg: true,
            rating: 4.5,
            restaurant: "Shree Tirupati Balaji Idli",
            restaurantId: "11",
            preparation_time: "30-35 mins",
            calories: 250,
            offer: "₹125 OFF ABOVE ₹349"
          },
          {
            _id: "12",
            name: "Khandvi",
            description: "Soft, layered gram flour rolls, tempered with mustard seeds and curry leaves",
            price: 179,
            category: "Gujarati",
            image: "https://images.unsplash.com/photo-1588076186114-a3898e30530d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8S2hhbmR2aXxlbnwwfHwwfHx8MA%3D%3D",
            isVeg: true,
            rating: 4.4,
            restaurant: "G Dada",
            restaurantId: "12",
            preparation_time: "20-25 mins",
            calories: 180,
            offer: "ITEMS AT ₹135"
          },
          {
            _id: "13",
            name: "Masala Dosa",
            description: "Crispy rice crepe filled with spiced potato mixture, served with chutney and sambar",
            price: 199,
            category: "South Indian",
            image: "https://media.istockphoto.com/id/942682776/photo/masala-dosa-indian-breakfast-crepes-with-spicy-potato-filling.webp?a=1&b=1&s=612x612&w=0&k=20&c=LM5nGfClVFYZDlyqqvUCahI6CJ1vN4DuggMIsbcYlBo=",
            isVeg: true,
            rating: 4.6,
            restaurant: "Shree Tirupati Balaji Idli",
            restaurantId: "11",
            preparation_time: "20 mins",
            calories: 330
          },
          {
            _id: "14",
            name: "Samosa",
            description: "Fried pastry with spiced potato filling, served with mint and tamarind chutney",
            price: 129,
            category: "Indian",
            image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format",
            isVeg: true,
            rating: 4.3,
            restaurant: "Jalaram Locho & Khaman",
            restaurantId: "9",
            preparation_time: "15 mins",
            calories: 290
          },
          {
            _id: "15",
            name: "Paneer Tikka",
            description: "Marinated and grilled cottage cheese cubes with bell peppers and onions",
            price: 299,
            category: "Indian",
            image: "https://media.istockphoto.com/id/693943610/photo/paneer-tikka-kabab-tandoori-indian-cheese-skewers-or-barbecue-paneer-selective-focus.webp?a=1&b=1&s=612x612&w=0&k=20&c=gdcKhPzHq9ksdPaTUQUVF6w95JncmD_crfOpB_7Tg2Q=",
            isVeg: true,
            rating: 4.7,
            restaurant: "Royal Indian",
            restaurantId: "13",
            preparation_time: "25 mins",
            calories: 380
          },
          {
            _id: "16",
            name: "Chole Bhature",
            description: "Spiced chickpea curry served with deep-fried bread",
            price: 249,
            category: "Indian",
            image: "https://media.istockphoto.com/id/979914742/photo/chole-bhature-or-chick-pea-curry-and-fried-puri-served-in-terracotta-crockery-over-white.webp?a=1&b=1&s=612x612&w=0&k=20&c=8pmBVIcNb-GIFnsBT0sYqfy-YtzNq7pOqc6lQZgFOPo=",
            isVeg: true,
            rating: 4.6,
            restaurant: "Punjabi Tadka",
            restaurantId: "14",
            preparation_time: "25 mins",
            calories: 620
          },
          {
            _id: "17",
            name: "Fafda",
            description: "Crispy fried strips made from gram flour, served with papaya chutney",
            price: 159,
            category: "Gujarati",
            image: "https://media.istockphoto.com/id/1980429824/photo/fafda-namkeen.webp?a=1&b=1&s=612x612&w=0&k=20&c=nqK1zGyqR0s_t2Wcgkd-0Vhzyp9dCas7dSV9ptuolno=",
            isVeg: true,
            rating: 4.2,
            restaurant: "G Dada",
            restaurantId: "12",
            preparation_time: "15 mins",
            calories: 280
          },
          {
            _id: "18",
            name: "Pav Bhaji",
            description: "Spicy vegetable mash served with buttered bread rolls",
            price: 199,
            category: "Fast Food",
            image: "https://images.unsplash.com/photo-1606491956391-70868b5d0f47?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            isVeg: true,
            rating: 4.5,
            restaurant: "Mumbai Street Food",
            restaurantId: "15",
            preparation_time: "20 mins",
            calories: 450,
            offer: "50% OFF UPTO ₹100"
          },
          {
            _id: "19",
            name: "Idli Sambar",
            description: "Steamed rice cakes served with lentil soup and coconut chutney",
            price: 179,
            category: "South Indian",
            image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format",
            isVeg: true,
            rating: 4.3,
            restaurant: "Shree Tirupati Balaji Idli",
            restaurantId: "11",
            preparation_time: "20 mins",
            calories: 220
          },
          {
            _id: "20",
            name: "Thepla",
            description: "Spiced flatbread made with fenugreek leaves and gram flour",
            price: 169,
            category: "Gujarati",
            image: "https://images.unsplash.co/photo-1565557623262-b51c2513a641?w=600&auto=format",
            isVeg: true,
            rating: 4.1,
            restaurant: "G Dada",
            restaurantId: "12",
            preparation_time: "15 mins",
            calories: 200
          }
        ];

        setFoodItems(sampleFoodItems);
        setFilteredItems(sampleFoodItems);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch food items');
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

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
        filtered = filtered.filter(item => item.offer);
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
          case 'delivery_time':
            // This is a simplification since we don't have actual delivery time data
            filtered.sort((a, b) => {
              const timeA = parseInt(a.preparation_time.split('-')[0] || a.preparation_time);
              const timeB = parseInt(b.preparation_time.split('-')[0] || b.preparation_time);
              return timeA - timeB;
            });
            break;
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
                {item.offer && <div className="offer-badge">{item.offer}</div>}
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
                  <span className="food-calories">{item.calories} cal</span>
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