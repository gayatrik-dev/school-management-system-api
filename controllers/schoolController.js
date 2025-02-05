const School = require('../models/School');
const User = require('../models/User');

// Create a new school (only superAdmin can do this)
const createSchool = async (req, res) => {
    const { name, address, phoneNumber, email, website } = req.body;

    try {
        // Check if the school already exists by email
        const existingSchool = await School.findOne({ email });
        if (existingSchool) {
            return res.status(400).json({ message: 'School with this email already exists.' });
        }

        // Create new school
        const school = new School({
            name,
            address,
            phoneNumber,
            email,
            website,
            createdBy: req.user.id, // superAdmin creating the school
        });

        await school.save();
        res.status(201).json({
            message: 'School created successfully',
            school,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all schools (only accessible by superAdmin)
const getAllSchools = async (req, res) => {
    try {
        const schools = await School.find();
        res.status(200).json(schools);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a single school by ID
const getSchoolById = async (req, res) => {
    const { schoolId } = req.params;

    try {
        const school = await School.findById(schoolId);
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }
        res.status(200).json(school);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a school (only superAdmin can update)
const updateSchool = async (req, res) => {
    const { schoolId } = req.params;
    const { name, address, phoneNumber, email, website } = req.body;

    try {
        const school = await School.findById(schoolId);
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        // Check if the email is already used by another school
        if (email && email !== school.email) {
            const existingSchool = await School.findOne({ email });
            if (existingSchool) {
                return res.status(400).json({ message: 'School with this email already exists' });
            }
        }

        // Update the school information
        school.name = name || school.name;
        school.address = address || school.address;
        school.phoneNumber = phoneNumber || school.phoneNumber;
        school.email = email || school.email;
        school.website = website || school.website;
        school.updatedAt = new Date(Date.now());

        await school.save();
        res.status(200).json({
            message: 'School updated successfully',
            school,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a school (only superAdmin can delete)
const deleteSchool = async (req, res) => {
    const { schoolId } = req.params;

    try {
        const school = await School.findById(schoolId);
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        await school.deleteOne({ _id: schoolId });
        res.status(200).json({ message: 'School deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createSchool,
    getAllSchools,
    getSchoolById,
    updateSchool,
    deleteSchool,
};