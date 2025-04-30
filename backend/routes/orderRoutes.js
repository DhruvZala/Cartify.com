const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrder } = require('../controllers/orderController');

// Create a new order
router.post('/', createOrder);

// Get all orders for a user
router.get('/user/:userId', getUserOrders);

// Get a single order
router.get('/:orderId', getOrder);

module.exports = router; 