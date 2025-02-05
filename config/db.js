const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
    try {
        const dbURL = process.env.NODE_ENV === 'test' ? 'mongodb://localhost:27017/test' : process.env.MONGO_URI;
        console.log(process.env.Node_ENV);
        await mongoose.connect(dbURL, {
            // @ts-ignore
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(dbURL);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;