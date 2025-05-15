const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth'); // ✅ Added

const Order = require('../models/Order');
const Product = require('../models/Product');

router.post('/', protect, async (req, res) => { // ✅ Protected
  try {
    const { items, shippingAddress, phone, paymentMethod } = req.body;
    const userId = req.user._id; // ✅ Use authenticated user's ID
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Items array is required and cannot be empty' 
      });
    }

    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Only ${product.stock} ${product.name} available` });
      }

      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        image: product.images?.[0]
      });

      Product.findByIdAndUpdate(
        product._id,
        { $inc: { stock: -item.quantity } },
        { new: true }
      ).exec(); // ⚠ Async fire-and-forget, OK for small scale
    }

    const order = new Order({
      user: userId,
      items: orderItems,
      shippingAddress,
      phone,
      paymentMethod,
      totalAmount,
      shippingFee: totalAmount > 1000 ? 0 : 60,
      status: 'processing'
    });

    const savedOrder = await order.save();

    res.status(201).json({ 
      success: true,
      data: savedOrder,
      invoiceUrl: `/api/orders/${savedOrder._id}/invoice`
    });

  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ success: false, message: 'Order processing failed' });
  }
});

router.get('/user/:userId', protect, async (req, res) => { // ✅ Protected
  try {
    const { page = 1, limit = 10 } = req.query;
    const orders = await Order.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('items.product', 'name price images');
      
    const count = await Order.countDocuments({ user: req.params.userId });

    res.json({ 
      success: true,
      data: orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    console.error('Fetch orders error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

router.get('/:orderId', protect, async (req, res) => { // ✅ Protected
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('items.product', 'name price images');
      
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({ success: true, data: order });
  } catch (err) {
    console.error('Order fetch error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
});

router.get('/admin/all', protect, async (req, res) => { // ✅ Protected
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('items.product', 'name price');
      
    res.json({ success: true, data: orders });
  } catch (err) {
    console.error('Admin orders error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

router.put('/:id/status', protect, async (req, res) => { // ✅ Protected
  try {
    const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(req.body.status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({ success: true, data: order });
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

module.exports = router;
