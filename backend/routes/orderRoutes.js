const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');


const { 
    addOrderItems, 
    getOrders, 
    getMyOrders,
    updateOrderToDelivered 
} = require('../controllers/orderController');


router.route('/')
    .post(protect, addOrderItems)
    .get(protect, getOrders);


router.route('/myorders').get(protect, getMyOrders);


router.route('/:id/deliver').put(protect, updateOrderToDelivered);

module.exports = router;