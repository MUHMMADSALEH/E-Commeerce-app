const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const { userController } = require('../controllers/userController');

// Register new user
router.post('/register', userController.register);

// Login user
router.post('/login', userController.login);

// Logout user
router.post('/logout', userController.logout);

// Get current user
router.get('/me', auth, userController.getProfile);

// Get all users (Admin only)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get user by ID (Admin only)
router.get('/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role (Admin only)
router.put('/:id/role', auth, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent self-demotion
    if (req.user.id === user.id && role !== 'admin') {
      return res.status(400).json({ message: 'Cannot demote yourself from admin role' });
    }

    user.role = role;
    await user.save();

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error updating user role' });
  }
});

// Delete user (Admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent self-deletion
    if (req.user.id === user.id) {
      return res.status(400).json({ message: 'Cannot delete your own admin account' });
    }

    await User.deleteOne({ _id: user.id });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
});

module.exports = router; 