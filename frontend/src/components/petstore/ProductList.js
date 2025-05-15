import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './petstore.css';
import { apiurl } from '../../config';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {};
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        
        if (category) params.category = category;
        if (search) params.search = search;

        const res = await axios.get(`${apiurl}/products`, { params });
        setProducts(res.data.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h1>Our Pet Products</h1>
        {searchParams.get('category') && (
          <h2>Category: {searchParams.get('category')}</h2>
        )}
      </div>

      <div className="product-grid">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product._id} className="product-card">
              <Link to={`/pet-store/products/${product._id}`}>
                <div className="product-image">
                  <img 
                    src={product.images?.[0] || '/placeholder-product.jpg'} 
                    alt={product.name}
                    onError={(e) => e.target.src = '/placeholder-product.jpg'}
                  />
                  {product.stock <= 0 && (
                    <div className="out-of-stock-label">Out of Stock</div>
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="category">{product.category}</p>
                  <p className="price">৳{product.price.toLocaleString()}</p>
                  {product.stock > 0 ? (
                    <button className="btn-view">View Details</button>
                  ) : (
                    <button className="btn-disabled" disabled>Out of Stock</button>
                  )}
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="no-products">
            <p>No products found matching your criteria</p>
            <Link to="/pet-store/products" className="btn-primary">
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;