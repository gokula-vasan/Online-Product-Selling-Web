const express = require('express');
const router = express.Router();

// 1. Import all controller functions (including the new updateProduct)
const { 
    getProducts, 
    createProduct, 
    getProductById,
    deleteProduct,
    updateProduct // <--- Import the new function here
} = require('../controllers/productController');

// Route for "/" (e.g., /api/products)
// GET: List all products
// POST: Create a new product
router.route('/').get(getProducts).post(createProduct);

// Route for "/:id" (e.g., /api/products/123)
// GET: Get single product details
// DELETE: Remove product permanently
// PUT: Update product details (Stock, Price, Name, etc.)
router.route('/:id')
    .get(getProductById)
    .delete(deleteProduct)
    .put(updateProduct); // <--- Add this line to enable updates

module.exports = router;