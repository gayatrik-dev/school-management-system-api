const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
    enrollStudent,
    getAllStudents,
    getStudentById,
    updateStudentProfile,
    transferStudent,
    deleteStudent,
} = require('../controllers/studentController');

const router = express.Router();

// CRUD routes for Student
router.post('/enroll', protect, authorize(['schoolAdmin']), enrollStudent);  // Only schoolAdmin can enroll a student
router.get('/:schoolId', protect, authorize(['schoolAdmin', 'superAdmin']), getAllStudents);  // Anyone can get students for a school
router.get('/student/:studentId', protect, getStudentById);  // Anyone can get a student by ID
router.put('/:studentId', protect, authorize(['schoolAdmin']), updateStudentProfile);  // Only schoolAdmin can update a student's profile
router.post('/transfer', protect, authorize(['schoolAdmin']), transferStudent);  // Only schoolAdmin can transfer a student
router.delete('/:studentId', protect, authorize(['schoolAdmin']), deleteStudent);  // Only schoolAdmin can delete a student

module.exports = router;