const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // <--- Make sure this is installed
const connectDB = require('./config/db');

// Route files
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();
connectDB();

const app = express();

// --- CORS CONFIGURATION (Fixes Network Error) ---
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'https://online-product-selling-web.vercel.app'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS')); 
        }
    },
    credentials: true // Allow cookies/headers if needed
}));
app.options('*', cors({ origin: allowedOrigins, credentials: true }));

app.use(express.json()); 

// Mount Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Root Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handling
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});