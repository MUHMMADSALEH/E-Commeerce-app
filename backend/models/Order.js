const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    image: {
      type: String,
      required: true
    }
  }],
  shippingAddress: {
    fullName: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Credit Card', 'PayPal']
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to validate total price
orderSchema.pre('save', function(next) {
  if (this.isModified('items') || this.isModified('totalPrice')) {
    const calculatedTotal = this.items.reduce((total, item) => total + item.price, 0);
    if (Math.abs(calculatedTotal - this.totalPrice) > 0.01) {
      next(new Error('Total price mismatch'));
    }
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 