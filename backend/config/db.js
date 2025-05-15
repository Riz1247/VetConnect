const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        
        // Use default local MongoDB if MONGO_URI is not set
        const mongoURI = process.env.MONGO_URI || 'mongodb+srv://abdurrahmanarafat:arafat123@petcluster0.wj7ch7x.mongodb.net/?retryWrites=true&w=majority&appName=PetCluster0';
        console.log('Using MongoDB URI:', mongoURI);

        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4 // Use IPv4, skip trying IPv6
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        console.error('Full error:', error);
        process.exit(1);
    }
};

module.exports = connectDB; 