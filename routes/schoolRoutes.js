const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
    createSchool,
    getAllSchools,
    getSchoolById,
    updateSchool,
    deleteSchool,
} = require('../controllers/schoolController');

const router = express.Router();

// CRUD routes for School
router.post('/create', protect, authorize(['superAdmin']), createSchool);  // Only superAdmin can create a school
router.get('/', protect, authorize(['superAdmin']), getAllSchools);  // Only superAdmin can see all schools
router.get('/:schoolId', protect, getSchoolById);  // Anyone can see a school by ID
router.put('/:schoolId', protect, authorize(['superAdmin']), updateSchool);  // Only superAdmin can update a school
router.delete('/:schoolId', protect, authorize(['superAdmin']), deleteSchool);  // Only superAdmin can delete a school

module.exports = router;