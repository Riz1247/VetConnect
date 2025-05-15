import { useState, useEffect } from 'react';
import axios from 'axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`/api/orders/user/${localStorage.getItem('userId')}`, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          }
        });
        setOrders(res.data.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const downloadInvoice = async (orderId) => {
    window.open(`/api/orders/${orderId}/invoice`, '_blank');
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="order-history">
      {orders.map(order => (
        <div key={order._id} className="order-card">
          <div>Order #{order._id}</div>
          <div>Status: {order.status}</div>
          <div>Total: ৳{order.totalAmount}</div>
          <button onClick={() => downloadInvoice(order._id)}>
            Download Invoice
          </button>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
