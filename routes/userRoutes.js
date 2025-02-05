const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
    registerSelf,
    registerUser,
    loginUser,
    updateProfile,
    updatePassword,
    getSuperAdmins,
    getSchoolAdmins,
    getCurrentUserProfile,
} = require('../controllers/userController');

const router = express.Router();

// Register a new user (only superAdmin can create schoolAdmin)
router.post('/register', protect, authorize(['superAdmin']), registerUser);

// Register self (only superAdmin api)
router.post('/register/self', registerSelf);

// Login user and return JWT
router.post('/login', loginUser);

// Update user profile (can be done by superAdmin or the user themselves)
router.put('/updateProfile', protect, updateProfile);

// Update user password (can be done by superAdmin or the user themselves)
router.put('/updatePassword', protect, updatePassword);

// Get all superAdmins (only accessible by superAdmin)
router.get('/superAdmins', protect, authorize(['superAdmin']), getSuperAdmins);

// Get all schoolAdmins (only accessible by superAdmin)
router.get('/schoolAdmins', protect, authorize(['superAdmin']), getSchoolAdmins);

// Get current user's profile (accessible by the user themselves)
router.get('/profile', protect, getCurrentUserProfile);

module.exports = router;