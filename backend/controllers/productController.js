const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a product
// @route   POST /api/products
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image, countInStock } = req.body;
        const product = new Product({
            name, description, price, category, image, countInStock
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: 'Product creation failed' });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// --- NEW FUNCTION TO ENABLE EDITING ---
const updateProduct = async (req, res) => {
    try {
        const { name, price, description, image, category, countInStock } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            // Update fields if they exist in the request, otherwise keep old value
            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.image = image || product.image;
            product.category = category || product.category;
            product.countInStock = countInStock; // Directly update stock

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne(); // This permanently removes it from MongoDB
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Export all functions including the new updateProduct
module.exports = { 
    getProducts, 
    createProduct, 
    getProductById, 
    deleteProduct,
    updateProduct // <--- Don't forget to export this!
};