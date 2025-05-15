import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ShelterBookingForm.css';

const ShelterBookingForm = () => {
  const { shelterId } = useParams();
  const navigate = useNavigate();
  const [shelter, setShelter] = useState(null);
  const [formData, setFormData] = useState({
    userName: '',
    petName: '',
    breed: '',
    isVaccinated: 'no',
    days: '',
  });
  const [petImage, setPetImage] = useState(null);
  const [petImagePreview, setPetImagePreview] = useState(null);
  const [totalCharge, setTotalCharge] = useState(0);

  useEffect(() => {
    // Check authentication
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }

    // Find shelter details from the list (in a real app, this would be an API call)
    const shelterData = shelters.find(s => s.id === parseInt(shelterId));
    if (shelterData) {
      setShelter(shelterData);
    }
  }, [shelterId, navigate]);

  const calculateCharge = (days) => {
    if (!days) return 0;
    const daysNum = parseInt(days);
    if (daysNum <= 15) {
      return 2000;
    } else if (daysNum <= 30) {
      return 3000;
    }
    return 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPetImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPetImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'days') {
      setTotalCharge(calculateCharge(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.days || parseInt(formData.days) < 1 || parseInt(formData.days) > 30) {
      alert('Please enter a valid number of days (1-30)');
      return;
    }

    try {
      // Get shelter details
      const shelterData = shelters.find(s => s.id === parseInt(shelterId));
      if (!shelterData) {
        throw new Error('Shelter not found');
      }
      
      // Prepare booking data
      const bookingData = {
        userName: formData.userName || 'Guest User',
        petName: formData.petName,
        breed: formData.breed,
        isVaccinated: formData.isVaccinated,
        days: parseInt(formData.days),
        shelterId: shelterId.toString(),
        shelterName: shelterData.name,
        shelterLocation: shelterData.location,
        shelterImage: shelterData.image,
        totalCharge: parseInt(totalCharge),
        petImage: petImage
      };

      // Validate required fields
      const requiredFields = ['petName', 'breed', 'isVaccinated', 'days'];
      const missingFields = requiredFields.filter(field => !bookingData[field]);
      
      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }

      // Navigate to payment page with booking data
      navigate('/shelter-payment', { 
        state: { bookingData }
      });
    } catch (error) {
      alert('Error processing booking: ' + error.message);
      console.error('Booking error:', error);
    }
  };

  if (!shelter) {
    return null;
  }

  return (
    <div className="shelter-booking-container">
      <div className="booking-form-wrapper">
        <h2 className="booking-title">
          <span className="paw-icon">🐾</span>
          Book Your Pet's Stay
          <span className="paw-icon">🐾</span>
        </h2>
        
        <div className="shelter-info">
          <img src={shelter.image} alt={shelter.name} className="shelter-image" />
          <h3>{shelter.name}</h3>
          <p className="shelter-location">📍 {shelter.location}</p>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label>Pet Name</label>
            <input
              type="text"
              name="petName"
              value={formData.petName}
              onChange={handleChange}
              required
              placeholder="Enter pet's name"
            />
          </div>

          <div className="form-group pet-image-upload">
            <label>Pet Image</label>
            <div className="image-upload-container">
              {petImagePreview ? (
                <div className="image-preview">
                  <img src={petImagePreview} alt="Pet preview" />
                  <button 
                    type="button" 
                    className="remove-image"
                    onClick={() => {
                      setPetImage(null);
                      setPetImagePreview(null);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <span className="upload-icon">📸</span>
                  <span>Click to upload pet photo</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="image-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Breed</label>
            <input
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              required
              placeholder="Enter pet's breed"
            />
          </div>

          <div className="form-group">
            <label>Vaccinated?</label>
            <select
              name="isVaccinated"
              value={formData.isVaccinated}
              onChange={handleChange}
              required
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          <div className="form-group">
            <label>Number of Days (1-30)</label>
            <input
              type="number"
              name="days"
              value={formData.days}
              onChange={handleChange}
              required
              min="1"
              max="30"
              placeholder="Enter number of days"
            />
            <p className="days-info">
              1-15 days: 2000/= per stay<br />
              15-30 days: 3000/= per stay
            </p>
          </div>

          <div className="charge-display">
            Total Charge: <span>৳{totalCharge}</span>
          </div>

          <button type="submit" className="submit-button">
            Submit and Payment
            <span className="paw-print">🐾</span>
          </button>
        </form>
      </div>
    </div>
  );
};

// Shelter data (in a real app, this would come from an API)
const shelters = [
  {
    id: 1,
    name: 'Mirpur Pet Shelter',
    location: 'Mirpur',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: 2,
    name: 'Dhanmondi Pet Care',
    location: 'Dhanmondi',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: 3,
    name: 'Uttara Pet Haven',
    location: 'Uttara',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80',
  },
  {
    id: 4,
    name: 'Rampura Pet Lodge',
    location: 'Rampura',
    image: 'https://images.unsplash.com/photo-1593634804965-0394d1324bc4?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: 5,
    name: 'Badda Pet Resort',
    location: 'Badda',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: 6,
    name: 'Gulshan Pet Paradise',
    location: 'Gulshan',
    image: 'https://images.unsplash.com/photo-1587764379873-97837921fd44?ixlib=rb-4.0.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  }
];

export default ShelterBookingForm;
