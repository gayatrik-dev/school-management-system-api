const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const classroomRoutes = require('./routes/classroomRoutes');
const studentRoutes = require('./routes/studentRoutes');
const { rateLimit } = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');

dotenv.config(); // Initialize environment variables from .env
connectDB(); // Connect to MongoDB

const app = express();

// Security Middleware
// @ts-ignore
app.use(helmet()); // Set security-related HTTP headers
app.use(xss()); // Sanitize user input to prevent XSS attacks
app.use(cors()); // Allow Cross-Origin Requests (adjust settings as needed)

// Rate Limiting Middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});

// Apply rate limiting to all routes
app.use(limiter);

// Middleware to parse JSON bodies
app.use(express.json());

// Define routes
app.use('/api/user', userRoutes); // Routes for user management (register, login, update profile, password)
app.use('/api/schools', schoolRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/students', studentRoutes);

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});