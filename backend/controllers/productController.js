const Product = require('../models/Product');

const productController = {
  createProduct: async (req, res) => {
    try {
      const { name, description, price, category, image } = req.body;
      
      const product = new Product({
        name,
        description,
        price,
        category,
        image
      });

      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error creating product' });
    }
  },

  getProducts: async (req, res) => {
    try {
      const { category, page = 1, limit = 10 } = req.query;
      const query = category ? { category } : {};
      
      // Get total count for pagination
      const total = await Product.countDocuments(query);
      const totalPages = Math.ceil(total / limit);
      
      // Get products with pagination
      const products = await Product.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      res.json({
        products,
        totalPages,
        currentPage: page,
        total
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Error fetching products' });
    }
  },

  getProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching product' });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error updating product' });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting product' });
    }
  },

  getCategories: async (req, res) => {
    try {
      const categories = await Product.distinct('category');
      res.json(categories);
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({ message: 'Error fetching categories' });
    }
  }
};

module.exports = productController; 