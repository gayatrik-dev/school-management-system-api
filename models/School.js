const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    website: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the superAdmin who created the school
        required: true,
    },
    schoolAdmins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],  // Array of user IDs who are school admins
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const School = mongoose.model('School', schoolSchema);

module.exports = School;