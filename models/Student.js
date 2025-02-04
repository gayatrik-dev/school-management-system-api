const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    phoneNumber: {
        type: String,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',  // Reference to the school the student is enrolled in
        required: true,
    },
    enrolledAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['enrolled', 'transferred', 'graduated', 'droppedOut'],
        default: 'enrolled',
    },
    transferredTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School', // Reference to the new school if transferred
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // The school admin who added the student
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;