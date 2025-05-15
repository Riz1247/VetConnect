import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AppointmentForm.css';

const AppointmentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    phoneNumber: '',
    email: '',
    petName: '',
    petType: '',
    veterinaryType: '',
    appointmentDate: null,
    clinicPlace: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);

  const petTypes = ['Cat', 'Dog', 'Bird', 'Rabbit'];
  const veterinaryTypes = ['Expert', 'Regular checkup', 'Regular Vaccination', 'Spray'];
  const clinicPlaces = ['Mirpur', 'Banani', 'Gulshan', 'Dhanmondi', 'Badda', 'Rampura', 'Uttara'];

  const validateForm = () => {
    const newErrors = {};
    const phoneRegex = /^01[3-9]\d{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.userName) newErrors.userName = 'User name is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    else if (!phoneRegex.test(formData.phoneNumber)) newErrors.phoneNumber = 'Please enter a valid Bangladeshi phone number';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.petName) newErrors.petName = 'Pet name is required';
    if (!formData.petType) newErrors.petType = 'Pet type is required';
    if (!formData.veterinaryType) newErrors.veterinaryType = 'Veterinary type is required';
    if (!formData.appointmentDate) newErrors.appointmentDate = 'Appointment date is required';
    else if (formData.appointmentDate < new Date()) newErrors.appointmentDate = 'Appointment date must be in the future';
    if (!formData.clinicPlace) newErrors.clinicPlace = 'Clinic place is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setIsSubmitting(true);

    if (validateForm()) {
      try {
        // Create a copy of formData and format the date
        const formattedData = {
          ...formData,
          appointmentDate: formData.appointmentDate.toISOString()
        };

        const response = await axios.post('http://localhost:5000/api/appointments', formattedData);
        setSuccessMessage('Appointment booked successfully!');
        setAppointmentId(response.data.data._id);
        navigate(`/medical-appointment/${response.data.data._id}`);
      } catch (error) {
        console.error('Error details:', error.response?.data);
        setErrorMessage(error.response?.data?.message || 'Failed to book appointment. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    if (appointmentId) {
      window.open(`http://localhost:5000/api/appointments/${appointmentId}/pdf`, '_blank');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="appointment-page">
      <div className="appointment-card">
        <div className="appointment-header">
          <div className="paw-icon">🐾</div>
          <h1>Pet Medical Appointment</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>
                <span className="icon">👤</span>
                User Name
              </label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Enter your name"
              />
              {errors.userName && <p className="error">{errors.userName}</p>}
            </div>

            <div className="form-group">
              <label>
                <span className="icon">📞</span>
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
              />
              {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
            </div>

            <div className="form-group">
              <label>
                <span className="icon">📧</span>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label>
                <span className="icon">🐾</span>
                Pet Name
              </label>
              <input
                type="text"
                name="petName"
                value={formData.petName}
                onChange={handleChange}
                placeholder="Enter pet name"
              />
              {errors.petName && <p className="error">{errors.petName}</p>}
            </div>

            <div className="form-group">
              <label>
                <span className="icon">🐶</span>
                Pet Type
              </label>
              <select
                name="petType"
                value={formData.petType}
                onChange={handleChange}
              >
                <option value="">Select pet type</option>
                {petTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.petType && <p className="error">{errors.petType}</p>}
            </div>

            <div className="form-group">
              <label>
                <span className="icon">👨‍⚕️</span>
                Veterinary Type
              </label>
              <select
                name="veterinaryType"
                value={formData.veterinaryType}
                onChange={handleChange}
              >
                <option value="">Select veterinary type</option>
                {veterinaryTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.veterinaryType && <p className="error">{errors.veterinaryType}</p>}
            </div>

            <div className="form-group">
              <label>
                <span className="icon">📅</span>
                Appointment Date
              </label>
              <DatePicker
                selected={formData.appointmentDate}
                onChange={(date) => setFormData(prev => ({ ...prev, appointmentDate: date }))}
                minDate={new Date()}
                dateFormat="MMMM d, yyyy"
                placeholderText="Select appointment date"
                className="date-picker"
              />
              {errors.appointmentDate && <p className="error">{errors.appointmentDate}</p>}
            </div>

            <div className="form-group">
              <label>
                <span className="icon">📍</span>
                Clinic Place
              </label>
              <select
                name="clinicPlace"
                value={formData.clinicPlace}
                onChange={handleChange}
              >
                <option value="">Select clinic place</option>
                {clinicPlaces.map(place => (
                  <option key={place} value={place}>{place}</option>
                ))}
              </select>
              {errors.clinicPlace && <p className="error">{errors.clinicPlace}</p>}
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Book Appointment'}
          </button>

          {successMessage && (
            <div className="success-message">
              <p>{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="error-message">
              <p>{errorMessage}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm; 