import React, { useState, useEffect, useRef } from 'react';
import { FiMapPin, FiNavigation, FiX, FiSearch, FiHeart, FiClock } from 'react-icons/fi';
import './LocationSelector.css';

const LocationSelector = ({ onSelectLocation }) => {
  const [currentAddress, setCurrentAddress] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([
    { id: 1, type: 'home', address: '42, Gopal Krishna Society, Athwa, Surat', label: 'Home' },
    { id: 2, type: 'work', address: 'B-203, Nandanvan Complex, Katargam, Surat', label: 'Work' }
  ]);
  const [recentLocations, setRecentLocations] = useState([
    { id: 1, address: '42, Gopal Krishna Society, Athwa, Surat' },
    { id: 2, address: 'Jalaram Locho & Khaman, Gotalawadi, Katargam' },
    { id: 3, address: 'G Dada, Adajan Gam, Surat' }
  ]);
  const modalRef = useRef(null);
  const searchInputRef = useRef(null);

  // Mock search results
  const mockAddresses = [
    { id: 1, address: 'Adajan Gam, Surat, Gujarat' },
    { id: 2, address: 'Adajan Patiya, Surat, Gujarat' },
    { id: 3, address: 'Adajan Cross Road, Surat, Gujarat' },
    { id: 4, address: 'Athwa, Surat, Gujarat' },
    { id: 5, address: 'Athwa Gate, Surat, Gujarat' },
    { id: 6, address: 'Thaltej, Ahmedabad, Gujarat' },
    { id: 7, address: 'Thaltej Road, Ahmedabad, Gujarat' }
  ];

  useEffect(() => {
    // Load saved location from localStorage if available
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setCurrentAddress(savedLocation);
    }
  }, []);

  useEffect(() => {
    // Filter locations based on search term
    if (searchTerm.trim() === '') {
      setSearchResults([]);
    } else {
      const filtered = mockAddresses.filter(addr => 
        addr.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [searchTerm]);

  useEffect(() => {
    // Close modal when clicked outside
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowLocationModal(false);
      }
    };

    if (showLocationModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLocationModal]);

  useEffect(() => {
    // Focus search input when modal opens
    if (showLocationModal && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showLocationModal]);

  const detectCurrentLocation = () => {
    setIsLocating(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // In a real app, you would use a reverse geocoding API
          // For demo purposes using a mock geocoding API call
          // This simulates a more precise location detection
          fetchReverseGeocode(latitude, longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsLocating(false);
          alert('Unable to retrieve your location. Please check your browser settings and permissions.');
        },
        // Adding high accuracy options
        { 
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setIsLocating(false);
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Simulated reverse geocoding API
  const fetchReverseGeocode = (latitude, longitude) => {
    // In a real app, you would call an actual API like Google Maps, Mapbox, etc.
    // Simulating API call with timeout
    console.log(`Fetching location data for coordinates: ${latitude}, ${longitude}`);
    
    // Simulate different results based on coordinates to make it seem realistic
    setTimeout(() => {
      // Generate a slightly different location based on decimal values
      const locations = [
        'Adajan Gam, Surat, Gujarat',
        'Piplod, Surat, Gujarat',
        'City Light, Surat, Gujarat',
        'Vesu, Surat, Gujarat'
      ];
      
      // Use the decimal part of coordinates to pick a "random" but deterministic location
      const locationIndex = Math.floor((latitude + longitude) % locations.length);
      const detectedAddress = locations[locationIndex];
      
      setCurrentAddress(detectedAddress);
      setIsLocating(false);
      
      if (onSelectLocation) {
        onSelectLocation({
          address: detectedAddress,
          coordinates: { lat: latitude, lng: longitude },
          accuracy: 'high'
        });
      }
      
      // Add to recent locations
      if (!recentLocations.some(loc => loc.address === detectedAddress)) {
        setRecentLocations(prev => [{ id: Date.now(), address: detectedAddress }, ...prev].slice(0, 3));
      }
      
      setShowLocationModal(false);
      localStorage.setItem('userLocation', detectedAddress);
    }, 1500);
  };

  const handleSelectLocation = (address) => {
    setCurrentAddress(address);
    if (onSelectLocation) {
      onSelectLocation({ address });
    }
    setShowLocationModal(false);
    
    // Add to recent locations if not already there
    if (!recentLocations.some(loc => loc.address === address)) {
      setRecentLocations(prev => [{ id: Date.now(), address }, ...prev].slice(0, 3));
    }
    localStorage.setItem('userLocation', address);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className="location-selector">
      <button 
        className="location-button" 
        onClick={() => setShowLocationModal(true)}
      >
        <FiMapPin className="location-icon" />
        <span className="location-text">{currentAddress || 'Select location'}</span>
      </button>

      {showLocationModal && (
        <div className="location-modal-overlay">
          <div className="location-modal" ref={modalRef}>
            <div className="modal-header">
              <h3>Select delivery location</h3>
              <button 
                className="close-button"
                onClick={() => setShowLocationModal(false)}
              >
                <FiX />
              </button>
            </div>

            <div className="search-container">
              <FiSearch className="search-icon" />
              <input
                ref={searchInputRef}
                className="search-input"
                type="text"
                placeholder="Search for area, street name..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <button className="clear-search" onClick={clearSearch}>
                  <FiX />
                </button>
              )}
            </div>
            
            <button 
              className="detect-location-btn"
              onClick={detectCurrentLocation}
              disabled={isLocating}
            >
              <FiNavigation />
              {isLocating ? 'Detecting...' : 'Detect my location'}
            </button>

            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((result) => (
                  <div 
                    key={result.id} 
                    className="location-item" 
                    onClick={() => handleSelectLocation(result.address)}
                  >
                    <FiMapPin />
                    <span>{result.address}</span>
                  </div>
                ))}
              </div>
            )}

            {savedAddresses.length > 0 && searchResults.length === 0 && (
              <div className="saved-addresses">
                <h3>Saved Addresses</h3>
                <ul>
                  {savedAddresses.map((address) => (
                    <li key={address.id} onClick={() => handleSelectLocation(address.address)}>
                      {address.type === 'home' ? <FiHeart className="address-icon" /> : <FiClock className="address-icon" />}
                      <div className="address-details">
                        <span className="address-label">{address.label}</span>
                        <span className="address-text">{address.address}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {recentLocations.length > 0 && searchResults.length === 0 && (
              <div className="recent-locations">
                <h3>Recent Locations</h3>
                <ul>
                  {recentLocations.map((location) => (
                    <li key={location.id} onClick={() => handleSelectLocation(location.address)}>
                      <FiClock className="address-icon" />
                      <span>{location.address}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector; 