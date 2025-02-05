const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
    createClassroom,
    getAllClassrooms,
    getClassroomById,
    updateClassroom,
    deleteClassroom,
} = require('../controllers/classroomController');

const router = express.Router();

// CRUD routes for Classroom
router.post('/create', protect, authorize(['schoolAdmin']), createClassroom);  // Only schoolAdmin can create a classroom
router.get('/:schoolId', protect, authorize(['schoolAdmin', 'superAdmin']), getAllClassrooms);  // Anyone can get all classrooms for a school
router.get('/classroom/:classroomId', protect, getClassroomById);  // Anyone can get a classroom by ID
router.put('/:classroomId', protect, authorize(['schoolAdmin']), updateClassroom);  // Only schoolAdmin can update a classroom
router.delete('/:classroomId', protect, authorize(['schoolAdmin']), deleteClassroom);  // Only schoolAdmin can delete a classroom

module.exports = router;