const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token (exclude password)
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Move to the next middleware/controller
        } catch (error) {
            console.error(error);
            // --- CRITICAL FIX: Add 'return' to stop execution here ---
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If no token was found in the header
    if (!token) {
        // --- CRITICAL FIX: Add 'return' here as well ---
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };