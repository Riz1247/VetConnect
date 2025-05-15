import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './petstore.css';
import { apiurl } from '../../config';

const PetStoreHome = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, categoriesRes] = await Promise.all([
          axios.get(`${apiurl}/products/featured`),
          axios.get(`${apiurl}/products/categories`)
        ]);
        
        setFeaturedProducts(featuredRes.data);
        setCategories(categoriesRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        setLoading(false);
        console.error('API Error:', err);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="petstore-home">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1>Premium Pet Supplies</h1>
          <p>Everything your pet needs at the best prices</p>
          <Link to="/pet-store/products" className="btn-primary">
            Shop Now
          </Link>
        </div>
      </div>

      {/* Categories Section */}
      <section className="categories-section">
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          {categories.map(category => (
            <Link 
              key={category} 
              to={`/pet-store/products?category=${category}`}
              className="category-card"
            >
              <div className="category-icon">
                {category === 'Cat' && '🐱'}
                {category === 'Dog' && '🐶'}
                {category === 'Rabbit' && '🐰'}
                {category === 'Bird' && '🦜'}
              </div>
              <h3>{category}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {featuredProducts.map(product => (
            <div key={product._id} className="product-card">
              <Link to={`/pet-store/products/${product._id}`}>
                <div className="product-image">
                  <img 
                    src={product.images[0] || '/placeholder-product.jpg'} 
                    alt={product.name} 
                    onError={(e) => e.target.src = '/placeholder-product.jpg'}
                  />
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="discount-badge">
                      {Math.round((1 - product.price/product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <div className="price">
                    {product.originalPrice && product.originalPrice > product.price ? (
                      <>
                        <span className="original-price">৳{product.originalPrice.toLocaleString()}</span>
                        <span className="current-price">৳{product.price.toLocaleString()}</span>
                      </>
                    ) : (
                      <span>৳{product.price.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <Link to="/pet-store/products" className="btn-secondary">
          View All Products
        </Link>
      </section>
    </div>
  );
};

export default PetStoreHome;