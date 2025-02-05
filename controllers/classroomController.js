const Classroom = require('../models/Classroom');
const School = require('../models/School');

// Create a new classroom (only schoolAdmin can do this)
const createClassroom = async (req, res) => {
    const { name, capacity, resources, schoolId } = req.body;

    try {
        // Ensure the user is a schoolAdmin and belongs to the school
        const school = await School.findById(schoolId);
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        // Ensure the logged-in user is a schoolAdmin for the specified school
        if (!school.schoolAdmins || !school.schoolAdmins.includes(req.user.id)) {
            return res.status(403).json({ message: 'You are not authorized to create classrooms in this school' });
        }

        // Create the classroom
        const classroom = new Classroom({
            name,
            capacity,
            resources,
            school: schoolId,
            createdBy: req.user.id, // schoolAdmin who is creating the classroom
        });

        await classroom.save();
        res.status(201).json({
            message: 'Classroom created successfully',
            classroom,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all classrooms for a school (only accessible by schoolAdmin of that school)
const getAllClassrooms = async (req, res) => {
    const { schoolId } = req.params;

    try {
        const school = await School.findById(schoolId);
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        // Ensure the logged-in user is a schoolAdmin for the specified school
        if (!school.schoolAdmins || (!school.schoolAdmins.includes(req.user.id) && req.user.role !== 'superAdmin')) {
            return res.status(403).json({ message: 'You are not authorized to view classrooms in this school' });
        }

        const classrooms = await Classroom.find({ school: schoolId });
        res.status(200).json(classrooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a specific classroom by ID
const getClassroomById = async (req, res) => {
    const { classroomId } = req.params;

    try {
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }
        res.status(200).json(classroom);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a classroom (only schoolAdmin can update a classroom for their school)
const updateClassroom = async (req, res) => {
    const { classroomId } = req.params;
    const { name, capacity, resources } = req.body;

    try {
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        const school = await School.findById(classroom.school);
        // Ensure the logged-in user is a schoolAdmin for the specified school
        if (!school.schoolAdmins || !school.schoolAdmins.includes(req.user.id)) {
            return res.status(403).json({ message: 'You are not authorized to update classrooms in this school' });
        }

        classroom.name = name || classroom.name;
        classroom.capacity = capacity || classroom.capacity;
        classroom.resources = resources || classroom.resources;
        classroom.updatedAt = new Date(Date.now());

        await classroom.save();
        res.status(200).json({
            message: 'Classroom updated successfully',
            classroom,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a classroom (only schoolAdmin can delete a classroom)
const deleteClassroom = async (req, res) => {
    const { classroomId } = req.params;

    try {
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        const school = await School.findById(classroom.school);

        // Ensure the logged-in user is a schoolAdmin for the specified school
        if (!school.schoolAdmins || !school.schoolAdmins.includes(req.user.id)) {
            return res.status(403).json({ message: 'You are not authorized to delete classrooms in this school' });
        }

        await classroom.deleteOne({ _id: classroomId });
        res.status(200).json({ message: 'Classroom deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createClassroom,
    getAllClassrooms,
    getClassroomById,
    updateClassroom,
    deleteClassroom,
};