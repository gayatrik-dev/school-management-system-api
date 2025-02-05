const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const classroomRoutes = require('./routes/classroomRoutes');
const studentRoutes = require('./routes/studentRoutes');
const { rateLimit } = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');

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

// Basic welcome message and routes
app.get('/', (req, res) => {
    const routes = [
        { method: 'GET', path: '/api/users/superAdmins', description: 'Get all superAdmins' },
        { method: 'POST', path: '/api/users/register', description: 'Register a new user' },
        { method: 'POST', path: '/api/users/login', description: 'Login a user' },
        { method: 'GET', path: '/api/schools', description: 'Get all schools' },
        { method: 'POST', path: '/api/schools/create', description: 'Create a new school' },
        { method: 'GET', path: '/api/classrooms/:schoolId', description: 'Get all classrooms' },
        { method: 'POST', path: '/api/classrooms/create', description: 'Create a new classroom' },
        { method: 'GET', path: '/api/students/:schoolId', description: 'Get all students' },
        { method: 'POST', path: '/api/students/enroll', description: 'Create a new student' },
        // Add other routes here...
    ];

    const response = {
        message: 'Welcome to the School Management System API!. Your basic routes are as follows:',
        routes: routes
    };

    res.status(200).json(response);
});

app.use('/api/users', userRoutes); // Routes for user management (register, login, update profile, password)
app.use('/api/schools', schoolRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/students', studentRoutes);

module.exports = app;