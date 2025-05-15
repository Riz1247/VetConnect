import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AppointmentSlip.css';

const AppointmentSlip = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/appointments/${id}`);
        setAppointment(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch appointment details');
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!appointment) {
    return <div>Appointment not found</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="appointment-slip">
      <div className="slip-container">
        <div className="header-buttons">
          <button onClick={() => navigate('/')} className="back-home-button">
            Back to Home
          </button>
          <button onClick={handlePrint} className="download-button">
            Download PDF
          </button>
        </div>
        <h1 className="title">Pet Medical Appointment</h1>
        
        <div className="appointment-header">
          <div className="appointment-id">
            <span>Appointment ID: {appointment._id}</span>
            <span>Generated on: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="status">Status: Scheduled</div>
        </div>

        <div className="appointment-date-section">
          <h2>Appointment Date</h2>
          <div className="date">
            {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        </div>

        <div className="info-section">
          <h2>User Information</h2>
          <div className="info-grid">
            <div className="info-row">
              <span className="info-label">Name:</span>
              <span className="info-value">{appointment.userName}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Phone:</span>
              <span className="info-value">{appointment.phoneNumber}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{appointment.email}</span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h2>Pet Information</h2>
          <div className="info-grid">
            <div className="info-row">
              <span className="info-label">Pet Name:</span>
              <span className="info-value">{appointment.petName}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Pet Type:</span>
              <span className="info-value">{appointment.petType}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Veterinary Type:</span>
              <span className="info-value">{appointment.veterinaryType}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Clinic Location:</span>
              <span className="info-value">{appointment.clinicPlace}</span>
            </div>
          </div>
        </div>

        <div className="important-info">
          <h2>Important Information</h2>
          <ul>
            <li>Please arrive 15 minutes before your scheduled appointment time</li>
            <li>Bring any previous medical records of your pet</li>
            <li>For any changes or cancellations, please contact the clinic directly</li>
            <li>Keep this appointment slip for your records</li>
          </ul>
        </div>

        <div className="footer">
          <p>This is an official appointment slip. Please keep it for your records.</p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSlip;