import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiurl } from '../../config';

const Checkout = ({ cartItems }) => {
  const [formData, setFormData] = useState({
    shippingAddress: '',
    phone: '',
    paymentMethod: 'bkash',
    transactionId: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const orderData = {
        ...formData,
        items: cartItems.map(item => ({
          product: item.productId || (item.product && item.product._id),
          quantity: item.quantity
        }))
        // Removed userId to rely on JWT auth in backend
      };

      const res = await axios.post(`${apiurl}/orders`, orderData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      });

      navigate(`/order-confirmation/${res.data.data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Minimal form UI for critical fields */}
      <label>
        Shipping Address:
        <textarea 
          name="shippingAddress" 
          value={formData.shippingAddress} 
          onChange={handleChange} 
          required 
        />
      </label>

      <label>
        Phone Number:
        <input 
          type="tel" 
          name="phone" 
          value={formData.phone} 
          onChange={handleChange} 
          required 
        />
      </label>

      <label>
        Payment Method:
        <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
          <option value="bkash">Bkash</option>
          <option value="cash">Cash on Delivery</option>
          <option value="card">Credit Card</option>
        </select>
      </label>

      {formData.paymentMethod === 'bkash' && (
        <label>
          Transaction ID:
          <input 
            type="text" 
            name="transactionId" 
            value={formData.transactionId} 
            onChange={handleChange} 
            required 
          />
        </label>
      )}

      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
};

export default Checkout;
