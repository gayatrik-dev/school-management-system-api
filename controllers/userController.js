const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const School = require('../models/School');

// Register a superAdmin (self-registration)
const registerSelf = async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        // Check if the superAdmin already exists (although unlikely, let's keep it safe)
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create the superAdmin user
        const user = await User.create({
            username,
            email,
            password,
            role: 'superAdmin', // Automatically assign the superAdmin role
        });

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(201).json({
            message: 'SuperAdmin registered successfully',
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Register a new user (only superAdmin can create schoolAdmin)
const registerUser = async (req, res) => {
    const { username, email, password, role, schoolId } = req.body;

    // Validate input
    if (!username || !email || !password || !role || !schoolId) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        // Check if the user already exists (although unlikely, let's keep it safe)
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create the user
        const user = await User.create({
            username,
            email,
            password,
            role,
        });

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        const school = await School.findById(schoolId);
        if (!school) {
            throw new Error('School not found');
        }

        // Add the userId to the schoolAdmins array
        if (!school.schoolAdmins.includes(user._id)) {
            school.schoolAdmins.push(user._id);
            await school.save();
        }

        res.status(201).json({
            message: 'SchoolAdmin registered successfully',
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login user and return JWT
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // @ts-ignore
    if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
};

// Update user profile (can be done by superAdmin or the user themselves)
const updateProfile = async (req, res) => {
    const { username, email } = req.body;

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username) user.username = username;
        if (email) user.email = email;

        await user.save();

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user password (can be done by superAdmin or the user themselves)
const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.id);

        // @ts-ignore
        if (!user || !(await user.matchPassword(oldPassword))) {
            return res.status(400).json({ message: 'Invalid old password' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all superAdmins
const getSuperAdmins = async (req, res) => {
    try {
        const superAdmins = await User.find({ role: 'superAdmin' }).select('-password');
        res.json(superAdmins);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all schoolAdmins
const getSchoolAdmins = async (req, res) => {
    try {
        const schoolAdmins = await User.find({ role: 'schoolAdmin' }).select('-password');
        res.json(schoolAdmins);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get current user's profile (for schoolAdmin or any authenticated user)
const getCurrentUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerSelf,
    registerUser,
    loginUser,
    updateProfile,
    updatePassword,
    getSuperAdmins,
    getSchoolAdmins,
    getCurrentUserProfile,
};