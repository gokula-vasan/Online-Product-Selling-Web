const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // These options can help with network stability
            serverSelectionTimeoutMS: 5000, 
            family: 4 // Force IPv4 (Fixes some EREFUSED issues)
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Do not exit process immediately so nodemon can try again
        // process.exit(1); 
    }
};

module.exports = connectDB;