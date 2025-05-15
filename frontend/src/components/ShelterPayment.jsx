import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import './ShelterPayment.css';

const ShelterPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [paymentStep, setPaymentStep] = useState('confirm'); // confirm, payment, complete
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [transactionError, setTransactionError] = useState('');
  const [transactionDetails, setTransactionDetails] = useState(null);

  useEffect(() => {
    if (!location.state?.bookingData) {
      navigate('/shelters');
      return;
    }
    const data = location.state.bookingData;
    data.advancePayment = Math.ceil(data.totalCharge * 0.5);
    data.duePayment = data.totalCharge - data.advancePayment;
    setBookingData(data);
  }, [location.state, navigate]);

  const validateTransactionId = (id) => {
    const isValid = /^\d{10}$/.test(id); // Checks if exactly 10 digits
    setTransactionError(isValid ? '' : 'Transaction ID must be exactly 10 digits');
    return isValid;
  };

  const handleTransactionIdChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 10) {
      setTransactionId(value);
      if (value.length === 10) {
        validateTransactionId(value);
      } else {
        setTransactionError('');
      }
    }
  };

  const createBooking = async (bookingData) => {
    try {
      const formData = new FormData();
      
      // Calculate payments
      const advancePayment = Math.floor(bookingData.totalCharge * 0.5);
      const duePayment = Math.ceil(bookingData.totalCharge * 0.5);

      // Get userId from localStorage
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not logged in');
      }

      // Prepare booking data
      const processedData = {
        userId: userId,
        userName: bookingData.userName || 'Guest User',
        petName: bookingData.petName,
        breed: bookingData.breed,
        isVaccinated: bookingData.isVaccinated || 'No', // Convert to required field
        days: bookingData.days,
        shelterId: bookingData.shelterId,
        shelterName: bookingData.shelterName,
        shelterLocation: bookingData.shelterLocation,
        shelterImage: bookingData.shelterImage,
        totalCharge: bookingData.totalCharge,
        advancePayment,
        duePayment,
        paymentMethod,
        transactionId
      };

      // Convert processedData to JSON strings for each field
      Object.keys(processedData).forEach(key => {
        formData.append(key, JSON.stringify(processedData[key]));
      });

      // Append payment-specific fields directly (not as JSON)
      formData.set('paymentMethod', paymentMethod);
      formData.set('transactionId', transactionId);

      // Append pet image if exists
      if (bookingData.petImage instanceof File) {
        formData.append('petImage', bookingData.petImage);
      }

      console.log('Sending booking data:', processedData); // Debug log

      const response = await fetch('http://localhost:5000/api/shelter-bookings', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      console.log('Server response:', result); // Debug log
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Booking creation failed');
      }

      return result;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    // For mobile payments, validate transaction ID
    if (['bkash', 'nagad', 'rocket'].includes(paymentMethod)) {
      if (!validateTransactionId(transactionId)) {
        return;
      }
    }

    // For card payments, validate card details
    if (paymentMethod === 'card') {
      if (!cardNumber || !expiryDate || !cvv) {
        alert('Please fill in all card details');
        return;
      }
    }

    setPaymentStep('processing');

    try {
      // Create the booking in the database
      const result = await createBooking(bookingData);

      if (result.success) {
        setPaymentStep('complete');
        setTransactionDetails({
          id: transactionId || result.booking.transactionId,
          date: new Date().toLocaleString(),
          amount: bookingData.totalCharge,
          method: paymentMethod
        });
      } else {
        throw new Error(result.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(error.message || 'Payment failed. Please try again.');
      setPaymentStep('form');
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    let y = 20;

    // Add header background
    doc.setFillColor(33, 150, 243); // Blue background
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Add logo text in header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('VetConnect', pageWidth / 2, 25, { align: 'center' });

    // Add subtitle
    doc.setFontSize(12);
    doc.text('Your Trusted Pet Care Partner', pageWidth / 2, 35, { align: 'center' });

    // Reset text color and move y position
    doc.setTextColor(0, 0, 0);
    y = 50;

    // Add decorative element
    doc.setDrawColor(33, 150, 243);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Payment Invoice title
    doc.setFontSize(20);
    doc.setTextColor(33, 150, 243);
    doc.text('Payment Invoice', pageWidth / 2, y, { align: 'center' });
    y += 20;

    // Helper function to add lines with alternating backgrounds
    let isEven = false;
    const addLine = (label, value) => {
      if (isEven) {
        doc.setFillColor(240, 247, 255);
        doc.rect(margin - 5, y - 5, pageWidth - 2 * (margin - 5), 12, 'F');
      }
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text(label + ':', margin, y);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(value, 100, y);
      y += 12;
      isEven = !isEven;
    };

    // Add booking details
    doc.setTextColor(0, 0, 0);
    addLine('Booking ID', transactionDetails?._id || '');
    addLine('Transaction ID', transactionId);
    addLine('Date', new Date().toLocaleDateString());
    addLine('Pet Name', bookingData.petName);
    addLine('Breed', bookingData.breed);
    addLine('Shelter Name', bookingData.shelterName);
    addLine('Duration', `${bookingData.days} days`);
    addLine('Total Charge', `৳${bookingData.totalCharge}`);
    addLine('Advance Payment', `৳${bookingData.advancePayment}`);
    addLine('Due Amount', `৳${bookingData.duePayment}`);
    addLine('Payment Method', paymentMethod.toUpperCase());

    // Add pet safety mottos in a box
    y += 10;
    doc.setFillColor(76, 175, 80, 0.1); // Light green background
    doc.rect(margin - 5, y, pageWidth - 2 * (margin - 5), 50, 'F');
    
    doc.setTextColor(76, 175, 80);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Pet Safety Tips:', margin, y + 15);
    
    doc.setTextColor(102, 102, 102);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('🐾 A safe pet is a happy pet - ensure regular vaccinations', margin + 5, y + 25);
    doc.text('🏠 Provide a comfortable and secure shelter environment', margin + 5, y + 35);
    doc.text('💕 Show your pet love and care every day', margin + 5, y + 45);

    // Add footer with gradient
    const footerY = pageHeight - 20;
    doc.setFillColor(33, 150, 243, 0.1);
    doc.rect(0, footerY - 10, pageWidth, 20, 'F');

    doc.setTextColor(33, 150, 243);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Thank you for choosing VetConnect!', pageWidth / 2, footerY, { align: 'center' });

    // Save the PDF
    doc.save(`VetConnect_Payment_Invoice_${transactionId}.pdf`);
    addLine('Transaction ID', bookingData.transactionId);
    addLine('Booking Date', new Date(bookingData.bookingDate).toLocaleDateString());

    // Add footer
    doc.setFontSize(10);
    doc.text('Thank you for choosing our service!', pageWidth/2, 250, { align: 'center' });
    doc.text('Please bring this slip when dropping off your pet.', pageWidth/2, 260, { align: 'center' });

    // Save PDF
    doc.save('booking-confirmation.pdf');
  };

  if (!bookingData) return null;

  return (
    <div className="payment-container">
      <div className="payment-wrapper">
        {paymentStep === 'confirm' && (
          <>
            <h2 className="payment-title">
              <span className="paw-icon">🐾</span>
              Booking Summary
              <span className="paw-icon">🐾</span>
            </h2>
            <div className="booking-summary">
              <div className="summary-images">
                <div className="shelter-image">
                  <img src={bookingData.shelterImage} alt={bookingData.shelterName} />
                </div>
                {bookingData.petImage && (
                  <div className="pet-image">
                    <img src={URL.createObjectURL(bookingData.petImage)} alt={bookingData.petName} />
                  </div>
                )}
              </div>
              <div className="summary-details">
                <h3>{bookingData.shelterName}</h3>
                <p className="location">📍 {bookingData.shelterLocation}</p>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Pet Name:</label>
                    <span>{bookingData.petName}</span>
                  </div>
                  <div className="detail-item">
                    <label>Breed:</label>
                    <span>{bookingData.breed}</span>
                  </div>
                  <div className="detail-item">
                    <label>Days:</label>
                    <span>{bookingData.days}</span>
                  </div>
                  <div className="detail-item">
                    <label>Vaccinated:</label>
                    <span>{bookingData.isVaccinated}</span>
                  </div>
                </div>
                <div className="price-summary">
                  <div className="price-item">
                    <label>Total Charge:</label>
                    <span>৳{bookingData.totalCharge}</span>
                  </div>
                  <div className="price-item highlight">
                    <label>Advance Payment (50%):</label>
                    <span>৳{bookingData.advancePayment}</span>
                  </div>
                  <div className="price-item">
                    <label>Due Payment:</label>
                    <span>৳{bookingData.duePayment}</span>
                  </div>
                </div>
              </div>
            </div>
            <button 
              className="proceed-button"
              onClick={() => setPaymentStep('payment')}
            >
              Proceed to Payment
              <span className="paw-print">🐾</span>
            </button>
          </>
        )}

        {paymentStep === 'payment' && (
          <>
            <h2 className="payment-title">
              <span className="paw-icon">🐾</span>
              Payment Details
              <span className="paw-icon">🐾</span>
            </h2>
            <form onSubmit={handlePaymentSubmit} className="payment-form">
              <div className="form-group">
                <label>Payment Method</label>
                <select 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  <option value="">Select Payment Method</option>
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="rocket">Rocket</option>
                  <option value="card">Credit/Debit Card</option>
                </select>
              </div>

              {paymentMethod === 'card' && (
                <>
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div className="card-details">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {(paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') && (
                <div className="mobile-payment-info">
                  <p>Please send ৳{bookingData.advancePayment} to:</p>
                  <h3>01712345678</h3>
                  <p>After sending money, enter your transaction ID below:</p>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Enter 10-digit Transaction ID"
                      value={transactionId}
                      onChange={handleTransactionIdChange}
                      maxLength="10"
                      required
                    />
                    {transactionError && (
                      <div className="error-message">{transactionError}</div>
                    )}
                  </div>
                </div>
              )}

              <button type="submit" className="pay-button">
                Pay ৳{bookingData.advancePayment}
                <span className="paw-print">🐾</span>
              </button>
            </form>
          </>
        )}

        {paymentStep === 'processing' && (
          <div className="processing-payment">
            <div className="spinner"></div>
            <h2>Processing Payment...</h2>
            <p>Please do not close this window</p>
          </div>
        )}

        {paymentStep === 'complete' && (
          <div className="payment-complete">
            <div className="success-animation">✓</div>
            <h2>Payment Successful!</h2>
            <div className="payment-slip">
              <h3>Payment Slip</h3>
              <div className="slip-details">
                <div className="detail-row">
                  <span>Booking ID:</span>
                  <span>{transactionDetails?._id}</span>
                </div>
                <div className="detail-row">
                  <span>Transaction ID:</span>
                  <span>{transactionId}</span>
                </div>
                <div className="detail-row">
                  <span>Pet Name:</span>
                  <span>{bookingData.petName}</span>
                </div>
                <div className="detail-row">
                  <span>Breed:</span>
                  <span>{bookingData.breed}</span>
                </div>
                <div className="detail-row">
                  <span>Shelter Name:</span>
                  <span>{bookingData.shelterName}</span>
                </div>
                <div className="detail-row">
                  <span>Duration:</span>
                  <span>{bookingData.days} days</span>
                </div>
                <div className="detail-row">
                  <span>Total Charge:</span>
                  <span>৳{bookingData.totalCharge}</span>
                </div>
                <div className="detail-row">
                  <span>Advance Payment:</span>
                  <span>৳{bookingData.advancePayment}</span>
                </div>
                <div className="detail-row">
                  <span>Due Amount:</span>
                  <span>৳{bookingData.duePayment}</span>
                </div>
                <div className="detail-row">
                  <span>Payment Method:</span>
                  <span>{paymentMethod.toUpperCase()}</span>
                </div>
              </div>
            </div>
            <div className="action-buttons">
              <button onClick={generatePDF} className="download-button">
                Download Payment Invoice
                <span>📄</span>
              </button>
              <button onClick={() => navigate('/')} className="home-button">
                Back to Home
                <span>🏠</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShelterPayment;
