const Product = require('../models/Product');
const Order = require('../models/Order'); // --- DATA SCIENCE ADDED: We need the Order model to analyze past purchases ---

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

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

const updateProduct = async (req, res) => {
    try {
        const { name, price, description, image, category, countInStock } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.image = image || product.image;
            product.category = category || product.category;
            product.countInStock = countInStock; 

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne(); 
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- DATA SCIENCE ADDED: Market Basket Analysis Algorithm ---
const getRecommendations = async (req, res) => {
    try {
        const currentProductId = req.params.id;

        // 1. Find all past orders containing this product
        const relatedOrders = await Order.find({
            'orderItems.product': currentProductId
        });

        const productCounts = {};

        // 2. Count what else was bought with it
        relatedOrders.forEach(order => {
            order.orderItems.forEach(item => {
                const itemId = item.product.toString();
                if (itemId !== currentProductId) {
                    productCounts[itemId] = (productCounts[itemId] || 0) + 1;
                }
            });
        });

        // 3. Sort by most frequent
        const sortedProductIds = Object.keys(productCounts).sort(
            (a, b) => productCounts[b] - productCounts[a]
        );

        // 4. Return top 4 recommendations
        const topRecommendations = await Product.find({
            _id: { $in: sortedProductIds.slice(0, 4) }
        });

        res.json(topRecommendations);
    } catch (error) {
        res.status(500).json({ message: 'Error generating recommendations' });
    }
};

module.exports = { 
    getProducts, 
    createProduct, 
    getProductById, 
    deleteProduct,
    updateProduct,
    getRecommendations // --- DATA SCIENCE ADDED: Exported here ---
};