import React, { useState } from 'react';
import axios from 'axios';

const ShelterProfilePage = ({ userData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.name || '',
    email: userData.email || '',
    shelterName: userData.shelterName || '',
    shelterLocation: userData.shelterLocation || '',
    phone: userData.phone || '',
    petTypes: userData.petTypes || []
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePetTypesChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      petTypes: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/update-shelter-profile/${userData._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
      console.error('Update profile error:', error);
    }
  };

  const petTypeOptions = [
    'Dogs', 'Cats', 'Birds', 'Small Animals', 'Reptiles', 'Others'
  ];

  return (
    <div className="profile-container">
      <h2>Shelter Profile</h2>
      {message && <div className="message">{message}</div>}
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Contact Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled
            />
          </div>
          <div className="form-group">
            <label>Shelter Name:</label>
            <input
              type="text"
              name="shelterName"
              value={formData.shelterName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Shelter Location:</label>
            <input
              type="text"
              name="shelterLocation"
              value={formData.shelterLocation}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Pet Types:</label>
            <select
              multiple
              name="petTypes"
              value={formData.petTypes}
              onChange={handlePetTypesChange}
              className="pet-types-select"
            >
              {petTypeOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <small>Hold Ctrl/Cmd to select multiple types</small>
          </div>
          <div className="button-group">
            <button type="submit" className="save-btn">Save Changes</button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-info">
          <p><strong>Contact Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Shelter Name:</strong> {userData.shelterName || 'Not provided'}</p>
          <p><strong>Location:</strong> {userData.shelterLocation || 'Not provided'}</p>
          <p><strong>Phone:</strong> {userData.phone || 'Not provided'}</p>
          <p><strong>Pet Types:</strong> {userData.petTypes?.join(', ') || 'None specified'}</p>
          <button 
            onClick={() => setIsEditing(true)}
            className="edit-btn"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ShelterProfilePage;
