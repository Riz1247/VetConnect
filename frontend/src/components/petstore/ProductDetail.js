import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './product-details.css';
import { apiurl } from '../../config';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${apiurl}/products/${id}`);
        setProduct(res.data.data);
        setLoading(false);
      } catch (err) {
        setError('Product not found');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.productId === id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId: id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: quantity
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    navigate('/pet-store/cart');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <div className="product-detail">
      <div className="product-images">
        <div className="main-image">
          <img 
            src={product.images[selectedImage] || '/placeholder-product.jpg'} 
            alt={product.name}
            onError={(e) => e.target.src = '/placeholder-product.jpg'}
          />
        </div>
        {product.images.length > 1 && (
          <div className="thumbnails">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} thumbnail ${index + 1}`}
                className={selectedImage === index ? 'active' : ''}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="category">{product.category}</p>
        <p className="price">৳{product.price.toLocaleString()}</p>
        
        <div className="stock-status">
          {product.stock > 0 ? (
            <span className="in-stock">In Stock ({product.stock} available)</span>
          ) : (
            <span className="out-of-stock">Out of Stock</span>
          )}
        </div>

        {product.stock > 0 && (
          <div className="quantity-selector">
            <button 
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span>{quantity}</span>
            <button 
              onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
              disabled={quantity >= product.stock}
            >
              +
            </button>
          </div>
        )}

        <button 
          className="add-to-cart-btn"
          onClick={addToCart}
          disabled={product.stock <= 0}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>

        <div className="product-description">
          <h3>Description</h3>
          <p>{product.description || 'No description available.'}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;