import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShelterList.css';

const shelters = [
  {
    id: 1,
    name: 'Mirpur Pet Shelter',
    location: 'Mirpur',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    description: 'A comfortable and caring environment for your pets in Mirpur',
    capacity: '20 pets',
    rating: 4.5
  },
  {
    id: 2,
    name: 'Dhanmondi Pet Care',
    location: 'Dhanmondi',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    description: 'Premium pet care services in the heart of Dhanmondi',
    capacity: '25 pets',
    rating: 4.8
  },
  {
    id: 3,
    name: 'Uttara Pet Haven',
    location: 'Uttara',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80',
    description: 'Modern facilities with experienced staff in Uttara',
    capacity: '30 pets',
    rating: 4.6
  },
  {
    id: 4,
    name: 'Rampura Pet Lodge',
    location: 'Rampura',
    image: 'https://images.unsplash.com/photo-1593634804965-0394d1324bc4?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    description: 'Your pets second home in Rampura area',
    capacity: '15 pets',
    rating: 4.3
  },
  {
    id: 5,
    name: 'Badda Pet Resort',
    location: 'Badda',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    description: 'Spacious and friendly environment in Badda',
    capacity: '20 pets',
    rating: 4.4
  },
  {
    id: 6,
    name: 'Gulshan Pet Paradise',
    location: 'Gulshan',
    image: 'https://images.unsplash.com/photo-1587764379873-97837921fd44?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    description: 'Luxury pet care services in Gulshan',
    capacity: '35 pets',
    rating: 4.9
  }
];

const ShelterList = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleShelterClick = (shelterId) => {
    navigate(`/shelter-booking/${shelterId}`);
  };

  if (!isAuthenticated) {
    return null; // Don't render anything while checking authentication
  }

  return (
    <div className="shelter-container">
      <h1 className="shelter-title">
        <span className="paw-icon">🐾</span>
        Pet Shelters
        <span className="paw-icon">🐾</span>
      </h1>
      <div className="shelter-grid">
        {shelters.map((shelter) => (
          <div 
            key={shelter.id} 
            className="shelter-card"
            onClick={() => handleShelterClick(shelter.id)}
          >
            <div className="shelter-image">
              <img src={shelter.image} alt={shelter.name} />
              <div className="shelter-rating">
                ⭐ {shelter.rating}
              </div>
            </div>
            <div className="shelter-content">
              <h2>{shelter.name}</h2>
              <p className="shelter-location">📍 {shelter.location}</p>
              <p className="shelter-description">{shelter.description}</p>
              <div className="shelter-details">
                <span className="shelter-capacity">🏠 {shelter.capacity}</span>
                <button className="book-button">Book Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShelterList;
