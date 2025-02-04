const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
        min: 1,
    },
    resources: {
        type: [String], // List of resources like 'projector', 'whiteboard', 'computer', etc.
        default: [],
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',  // Reference to the school the classroom belongs to
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the school admin who created the classroom
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const Classroom = mongoose.model('Classroom', classroomSchema);

module.exports = Classroom;