const express = require('express');
const router = express.Router();

const { 
    getProducts, 
    createProduct, 
    getProductById,
    deleteProduct,
    updateProduct,
    getRecommendations // --- DATA SCIENCE ADDED: Import it here ---
} = require('../controllers/productController');

router.route('/').get(getProducts).post(createProduct);

// --- DATA SCIENCE ADDED: Route for recommendations (MUST go before /:id) ---
router.route('/:id/recommendations').get(getRecommendations); 

router.route('/:id')
    .get(getProductById)
    .delete(deleteProduct)
    .put(updateProduct); 

module.exports = router;