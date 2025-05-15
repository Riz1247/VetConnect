import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaHome } from 'react-icons/fa';
import './Forum.css';

const Forum = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, reviewText: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      console.log('Fetching reviews...');
      const response = await axios.get('http://localhost:5000/api/reviews');
      console.log('Reviews response:', response.data);
      setReviews(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Please login to submit a review');
      return;
    }

    try {
      console.log('Submitting review...');
      const response = await axios.post(
        'http://localhost:5000/api/reviews',
        newReview,
        {
          headers: { 'x-auth-token': token }
        }
      );
      console.log('Review submitted:', response.data);

      setReviews([response.data, ...reviews]);
      setNewReview({ rating: 5, reviewText: '' });
      alert('Review submitted successfully!');
    } catch (err) {
      console.error('Error details:', err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert('Error submitting review. Please make sure you are logged in.');
      }
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={index < rating ? 'star filled' : 'star empty'}
      />
    ));
  };

  if (loading) {
    return (
      <div className="forum-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="forum-container">
      <button className="home-button" onClick={() => navigate('/')}>
        <FaHome /> Back to Home
      </button>

      <h1 className="forum-title">VetConnect Reviews</h1>

      {/* Review Form */}
      <div className="review-form-container">
        <h2>Share Your Experience</h2>
        <form onSubmit={handleSubmitReview} className="review-form">
          <div className="rating-input">
            <label>Rating:</label>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={star <= newReview.rating ? 'star filled' : 'star empty'}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                />
              ))}
            </div>
          </div>
          <div className="review-input">
            <label>Your Review:</label>
            <textarea
              value={newReview.reviewText}
              onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
              placeholder="Share your experience with VetConnect..."
              required
              maxLength="500"
            />
          </div>
          <button type="submit" className="submit-button">
            Submit Review
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="reviews-container">
        <h2>All Reviews</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <span className="user-name">{review.userName}</span>
                <span className="user-type">{review.userType}</span>
              </div>
              <div className="rating">
                {renderStars(review.rating)}
              </div>
              <p className="review-text">{review.reviewText}</p>
              <div className="review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forum;
