import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmergencyVet.css';

const EmergencyVet = () => {
  const [isPulsing, setIsPulsing] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCall = () => {
    window.location.href = 'tel:6969';
  };

  return (
    <div className="emergency-vet-container">
      <div className="emergency-content">
        <div className="title-container">
          <div className="paw-icon-container">
            <span className="paw-icon">🐾</span>
          </div>
          <h1 className={`emergency-title ${isPulsing ? 'pulse' : ''}`}>
            Emergency Veterinary Care
          </h1>
        </div>
        
        <div className="emergency-hotline">
          <h2>24/7 Emergency Hotline</h2>
          <button 
            className="hotline-button"
            onClick={handleCall}
          >
            <span className="phone-icon">📞</span>
            <span className="hotline-number">6969</span>
          </button>
        </div>

        <div className="emergency-info">
          <div className="info-card">
            <h3>🚨 Immediate Assistance</h3>
            <p>Our emergency team is available 24/7 to provide immediate care for your pet.</p>
          </div>
          
          <div className="info-card">
            <h3>🏥 Emergency Services</h3>
            <ul>
              <li>Critical Care</li>
              <li>Emergency Rescue</li>
              <li>Trauma Treatment</li>
              <li>Emergency Surgery</li>
              <li>Intensive Care</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>📍 Our Locations</h3>
            <ul>
              <li>Mirpur</li>
              <li>Dhanmondi</li>
              <li>Uttara</li>
              <li>Rampura</li>
              <li>Badda</li>
              <li>Gulshan</li>
            </ul>
          </div>
        </div>

        <div className="emergency-actions">
          <button 
            className="action-button"
            onClick={() => navigate('/book-appointment')}
          >
            Schedule Regular Appointment
          </button>
          <button 
            className="action-button"
            onClick={() => navigate('/')}
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyVet; 