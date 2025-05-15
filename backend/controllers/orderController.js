const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const PDFService = require('../services/pdfService');
const asyncHandler = require('../middleware/async');


exports.createOrder = asyncHandler(async (req, res) => {
  const { 
    shippingAddress, 
    contactNumber,
    paymentMethod, 
    transactionId,
    shippingFee = 0,
    discount = 0 
  } = req.body;

  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'No items in cart' 
    });
  }

  // Check product availability
  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);
    if (product.stock < item.quantity) {
      return res.status(400).json({ 
        success: false, 
        message: `Product ${product.name} is out of stock` 
      });
    }
  }

  // Create order items
  const orderItems = cart.items.map(item => ({
    product: item.product._id,
    name: item.product.name,
    quantity: item.quantity,
    price: item.priceAtAddition,
    image: item.product.images[0]
  }));

  // Calculate total price
  const totalPrice = cart.items.reduce(
    (sum, item) => sum + (item.quantity * item.priceAtAddition), 0
  );

  // Create order
  const order = new Order({
    user: req.user.id,
    items: orderItems,
    shippingAddress,
    contactNumber,
    paymentMethod,
    transactionId,
    shippingFee,
    discount,
    totalPrice
  });

  // Save order
  const createdOrder = await order.save();

  // Update product stock
  for (const item of cart.items) {
    await Product.updateOne(
      { _id: item.product._id },
      { $inc: { stock: -item.quantity } }
    );
  }

  // Clear cart
  await Cart.deleteOne({ _id: cart._id });

 
  await PDFService.generateOrderInvoice(createdOrder, req.user);

  res.status(201).json({ 
    success: true, 
    data: createdOrder,
    invoiceUrl: `/api/orders/${createdOrder._id}/invoice`
  });
});


exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return res.status(404).json({ 
      success: false, 
      message: 'Order not found' 
    });
  }

  if (order.user._id.toString() !== req.user.id.toString() && !req.user.isAdmin) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized' 
    });
  }

  res.json({ success: true, data: order });
});


exports.getOrderInvoice = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ 
      success: false, 
      message: 'Order not found' 
    });
  }

  if (order.user.toString() !== req.user.id.toString() && !req.user.isAdmin) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized' 
    });
  }

  const filePath = `./invoices/order_${order._id}.pdf`;
  
  res.download(filePath, `invoice_${order._id}.pdf`, (err) => {
    if (err) {
      res.status(500).json({ 
        success: false, 
        message: 'Error downloading invoice' 
      });
    }
  });
});


exports.getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id });
  res.json({ success: true, data: orders });
});
