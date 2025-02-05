const Student = require('../models/Student');
const School = require('../models/School');

// Enroll a student in a school (only schoolAdmin can do this)
const enrollStudent = async (req, res) => {
    const { firstName, lastName, email, dateOfBirth, phoneNumber, schoolId } = req.body;

    try {
        // Check if the school exists
        const school = await School.findById(schoolId);
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        // Ensure the logged-in user is a schoolAdmin for the specified school
        if (!school.schoolAdmins || !school.schoolAdmins.includes(req.user.id)) {
            return res.status(403).json({ message: 'You are not authorized to enroll a student in this school' });
        }

        // Check if the student already exists
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student with this email is already enrolled' });
        }

        // Create the student
        const student = new Student({
            firstName,
            lastName,
            email,
            dateOfBirth,
            phoneNumber,
            school: schoolId,
            createdBy: req.user.id, // schoolAdmin who enrolls the student
        });

        await student.save();
        res.status(201).json({
            message: 'Student enrolled successfully',
            student,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all students in a school (only accessible by schoolAdmin of that school)
const getAllStudents = async (req, res) => {
    const { schoolId } = req.params;

    try {
        const school = await School.findById(schoolId);
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        // Ensure the logged-in user is a schoolAdmin for the specified school
        if (!school.schoolAdmins || (!school.schoolAdmins.includes(req.user.id) && req.user.role !== 'superAdmin')) {
            return res.status(403).json({ message: 'You are not authorized to view students in this school' });
        }

        const students = await Student.find({ school: schoolId });
        res.status(200).json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a student by ID
const getStudentById = async (req, res) => {
    const { studentId } = req.params;

    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a student's profile (only schoolAdmin can update a student's profile)
const updateStudentProfile = async (req, res) => {
    const { studentId } = req.params;
    const { firstName, lastName, email, dateOfBirth, phoneNumber } = req.body;

    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const school = await School.findById(student.school);

        // Ensure the logged-in user is a schoolAdmin for the specified school
        if (!school.schoolAdmins || !school.schoolAdmins.includes(req.user.id)) {
            return res.status(403).json({ message: 'You are not authorized to update students in this school' });
        }

        student.firstName = firstName || student.firstName;
        student.lastName = lastName || student.lastName;
        student.email = email || student.email;
        student.dateOfBirth = dateOfBirth || student.dateOfBirth;
        student.phoneNumber = phoneNumber || student.phoneNumber;
        student.updatedAt = new Date(Date.now());

        await student.save();
        res.status(200).json({
            message: 'Student profile updated successfully',
            student,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Transfer a student to another school (only schoolAdmin can transfer a student)
const transferStudent = async (req, res) => {
    const { studentId, newSchoolId } = req.body;

    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const currentSchool = await School.findById(student.school);
        if (!currentSchool) {
            return res.status(404).json({ message: 'Current school not found' });
        }

        // Ensure the logged-in user is a schoolAdmin for the specified school
        if (!currentSchool.schoolAdmins || !currentSchool.schoolAdmins.includes(req.user.id)) {
            return res.status(403).json({ message: 'You are not authorized to transfer students in this school' });
        }

        // Check if the new school exists
        const newSchool = await School.findById(newSchoolId);
        if (!newSchool) {
            return res.status(404).json({ message: 'New school not found' });
        }

        // Update the student's school and status
        student.school = newSchoolId;
        student.status = 'transferred';
        student.transferredTo = newSchoolId;
        student.updatedAt = new Date(Date.now());

        await student.save();
        res.status(200).json({
            message: 'Student transferred successfully',
            student,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a student (only schoolAdmin can delete a student)
const deleteStudent = async (req, res) => {
    const { studentId } = req.params;

    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const school = await School.findById(student.school);

        // Ensure the logged-in user is a schoolAdmin for the specified school
        if (!school.schoolAdmins || !school.schoolAdmins.includes(req.user.id)) {
            return res.status(403).json({ message: 'You are not authorized to delete students in this school' });
        }

        await student.deleteOne({ _id: studentId });
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    enrollStudent,
    getAllStudents,
    getStudentById,
    updateStudentProfile,
    transferStudent,
    deleteStudent,
};