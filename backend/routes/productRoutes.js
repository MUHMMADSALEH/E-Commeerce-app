const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const productController = require('../controllers/productController');

// Initial products data
const initialProducts = [
  // Electronics Category
  {
    _id: '65f1c1d86d65f3c8e815d1a1',
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality.',
    price: 299.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format',
    stock: 50,
    rating: 4.5
  },
  {
    _id: '65f1c1d86d65f3c8e815d1a2',
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracker with heart rate monitoring, GPS, and sleep tracking capabilities.',
    price: 199.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format',
    stock: 75,
    rating: 4.3
  },
  {
    _id: '65f1c1d86d65f3c8e815d1a5',
    name: 'Professional DSLR Camera',
    description: '24.1MP digital camera with 4K video capability, Wi-Fi connectivity, and advanced autofocus.',
    price: 899.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format',
    stock: 15,
    rating: 4.8
  },
  {
    _id: '65f1c1d86d65f3c8e815d1a7',
    name: 'Smart LED TV - 55"',
    description: '4K Ultra HD Smart TV with HDR, built-in streaming apps, and voice control.',
    price: 699.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&auto=format',
    stock: 20,
    rating: 4.6
  },
  {
    _id: '65f1c1d86d65f3c8e815d1a9',
    name: 'Gaming Laptop',
    description: '15.6" gaming laptop with RTX 3060, 16GB RAM, 512GB SSD, and high refresh rate display.',
    price: 1299.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format',
    stock: 10,
    rating: 4.7
  },

  // Home & Kitchen Category
  {
    _id: '65f1c1d86d65f3c8e815d1a3',
    name: 'Premium Coffee Maker',
    description: 'Programmable coffee maker with built-in grinder and thermal carafe. Makes up to 12 cups.',
    price: 149.99,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1520970014086-2208d157c9e2?w=500&auto=format',
    stock: 30,
    rating: 4.7
  },
  {
    _id: '65f1c1d86d65f3c8e815d1a6',
    name: 'Stainless Steel Cookware Set',
    description: '10-piece cookware set including pots, pans, and lids. Dishwasher safe and induction compatible.',
    price: 199.99,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1584990347449-b7abea3e5a5f?w=500&auto=format',
    stock: 40,
    rating: 4.4
  },
  {
    _id: '65f1c1d86d65f3c8e815d1a8',
    name: 'Robot Vacuum Cleaner',
    description: 'Smart robot vacuum with mapping technology, app control, and automatic charging.',
    price: 299.99,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1589006833659-fd23b3210877?w=500&auto=format',
    stock: 35,
    rating: 4.2
  },
  {
    _id: '65f1c1d86d65f3c8e815d1aa',
    name: 'Air Purifier',
    description: 'HEPA air purifier with UV-C light, perfect for rooms up to 500 sq ft. Removes 99.9% of airborne particles.',
    price: 179.99,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1605794485736-ea0d0bd1e147?w=500&auto=format',
    stock: 45,
    rating: 4.5
  },
  {
    _id: '65f1c1d86d65f3c8e815d1ab',
    name: 'Stand Mixer',
    description: 'Professional-grade stand mixer with 5-quart capacity and multiple attachments.',
    price: 349.99,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=500&auto=format',
    stock: 25,
    rating: 4.8
  },

  // Furniture Category
  {
    _id: '65f1c1d86d65f3c8e815d1a4',
    name: 'Ergonomic Office Chair',
    description: 'Adjustable office chair with lumbar support, breathable mesh back, and premium cushioning.',
    price: 249.99,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&auto=format',
    stock: 25,
    rating: 4.6
  },
  {
    _id: '65f1c1d86d65f3c8e815d1ac',
    name: 'Modern Sofa',
    description: 'Contemporary 3-seater sofa with premium fabric upholstery and solid wood legs.',
    price: 899.99,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format',
    stock: 10,
    rating: 4.7
  },
  {
    _id: '65f1c1d86d65f3c8e815d1ad',
    name: 'Queen Size Bed Frame',
    description: 'Modern platform bed frame with headboard and under-bed storage.',
    price: 599.99,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=500&auto=format',
    stock: 15,
    rating: 4.5
  },
  {
    _id: '65f1c1d86d65f3c8e815d1ae',
    name: 'Dining Table Set',
    description: '6-piece dining set including table and chairs, perfect for family gatherings.',
    price: 799.99,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1617104678098-de229db51175?w=500&auto=format',
    stock: 20,
    rating: 4.6
  },
  {
    _id: '65f1c1d86d65f3c8e815d1af',
    name: 'Bookshelf',
    description: '5-tier modern bookshelf with adjustable shelves and metal frame.',
    price: 199.99,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=500&auto=format',
    stock: 30,
    rating: 4.4
  }
];

// Initialize products if none exist
const initializeProducts = async () => {
  try {
    // Check if products already exist
    const count = await Product.countDocuments();
    
    if (count === 0) {
      // Insert initial products only if no products exist
      await Product.insertMany(initialProducts);
      console.log('Initial products added to database');
      
      // Verify products were added
      const newCount = await Product.countDocuments();
      console.log(`Verified ${newCount} products in database`);
    } else {
      console.log(`Found ${count} existing products, skipping initialization`);
    }
  } catch (error) {
    console.error('Error initializing products:', error);
  }
};

// Call initialization on startup
initializeProducts();

// Routes
router.get('/', auth, productController.getProducts);
router.get('/categories', auth, productController.getCategories);
router.get('/:id', auth, productController.getProduct);

// Protected routes (require authentication)
router.post('/', auth, isAdmin, productController.createProduct);
router.put('/:id', auth, isAdmin, productController.updateProduct);
router.delete('/:id', auth, isAdmin, productController.deleteProduct);

module.exports = router; 