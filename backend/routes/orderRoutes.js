const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// 1. Import all controller functions (including the new updateOrderToDelivered)
const { 
    addOrderItems, 
    getOrders, 
    getMyOrders,
    updateOrderToDelivered // <--- Import the new function
} = require('../controllers/orderController');

// Route for '/'
// POST: Place a new order
// GET: Get ALL orders (Admin)
router.route('/')
    .post(protect, addOrderItems)
    .get(protect, getOrders);

// Route for '/myorders'
// GET: Get ONLY the logged-in user's orders
router.route('/myorders').get(protect, getMyOrders);

// Route for '/:id/deliver'
// PUT: Mark an order as Delivered (Admin Action)
// --- THIS IS THE NEW ROUTE ---
router.route('/:id/deliver').put(protect, updateOrderToDelivered);

module.exports = router;