import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './cart.css';
import { apiurl } from '../../config';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);
    
    if (cart.length > 0) {
      const fetchProducts = async () => {
        try {
          const res = await axios.post(`${apiurl}/products/cart-items`, {
            productIds: cart.map(item => item.productId)
          });
          setProducts(res.data.data);
        } catch (err) {
          console.error('Error fetching cart products:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, []);

  const updateQuantity = (productId, newQuantity) => {
    const updatedCart = cartItems.map(item => 
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setProducts(products.filter(p => p._id !== productId));
  };

  const applyCoupon = () => {
    if (coupon === 'PETLOVE10') {
      setDiscount(0.1);
      alert('10% discount applied!');
    } else {
      alert('Invalid coupon code');
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products.find(p => p._id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 1000 ? 0 : 60;
    return subtotal + shipping - (subtotal * discount);
  };

  if (loading) return <div className="loading">Loading cart...</div>;

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/pet-store/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => {
              const product = products.find(p => p._id === item.productId);
              if (!product) return null;
              
              return (
                <div key={item.productId} className="cart-item">
                  <div className="item-image">
                    <img 
                      src={product.images[0] || '/placeholder-product.jpg'} 
                      alt={product.name}
                      onError={(e) => e.target.src = '/placeholder-product.jpg'}
                    />
                  </div>
                  <div className="item-details">
                    <h3>
                      <Link to={`/pet-store/products/${product._id}`}>
                        {product.name}
                      </Link>
                    </h3>
                    <p className="price">৳{product.price.toLocaleString()}</p>
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= product.stock}
                      >
                        +
                      </button>
                    </div>
                    <p className="subtotal">
                      ৳{(product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => removeItem(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
          
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>৳{calculateSubtotal().toLocaleString()}</span>
            </div>
            
            <div className="coupon-section">
              <input 
                type="text" 
                placeholder="Coupon Code" 
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button onClick={applyCoupon}>Apply</button>
            </div>
            
            {discount > 0 && (
              <div className="summary-row">
                <span>Discount ({discount * 100}%)</span>
                <span>-৳{(calculateSubtotal() * discount).toLocaleString()}</span>
              </div>
            )}
            
            <div className="summary-row">
              <span>Shipping</span>
              <span>{calculateSubtotal() > 1000 ? 'FREE' : '৳60'}</span>
            </div>
            
            <div className="summary-row total">
              <span>Total</span>
              <span>৳{calculateTotal().toLocaleString()}</span>
            </div>
            
            <button 
              className="checkout-btn"
              onClick={() => navigate('/pet-store/checkout')}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;