const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Get all orders (Admin only)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name price image');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name price image');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name price image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is admin or order belongs to user
    if (!req.user.isAdmin && order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
});

// Create new order
router.post('/', auth, async (req, res) => {
  try {
    const { items, totalPrice, shippingAddress, paymentMethod } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode || 
        !shippingAddress.phone || !shippingAddress.email) {
      return res.status(400).json({ message: 'All shipping address fields are required' });
    }

    if (!paymentMethod || !['Credit Card', 'PayPal'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Valid payment method is required' });
    }

    // Validate and format order items
    const orderItems = [];
    let calculatedTotal = 0;

    for (const item of items) {
      if (!item.product || !item.product._id) {
        return res.status(400).json({ message: 'Invalid product data' });
      }

      const product = await Product.findById(item.product._id);
      if (!product) {
        return res.status(400).json({ message: `Product not found: ${item.product._id}` });
      }

      const quantity = Math.max(1, parseInt(item.quantity) || 1);
      const itemTotal = product.price * quantity;
      calculatedTotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: quantity,
        price: itemTotal,
        image: product.image
      });
    }

    // Verify total price with a small tolerance for floating-point arithmetic
    if (Math.abs(calculatedTotal - totalPrice) > 0.01) {
      return res.status(400).json({ 
        message: 'Total price mismatch', 
        expected: calculatedTotal.toFixed(2), 
        received: totalPrice.toFixed(2)
      });
    }

    // Create order
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      totalPrice: calculatedTotal,
      shippingAddress,
      paymentMethod,
      status: 'Processing'
    });

    await order.save();

    // Populate product details for response
    await order.populate('items.product', 'name price image');

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ message: error.message || 'Error creating order' });
  }
});

// Update order status (Admin only)
router.put('/:id/status', auth, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.product', 'name price image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(400).json({ message: 'Error updating order status' });
  }
});

module.exports = router; 