const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    // Optional profile fields
    mobile: {
        type: String,
        trim: true,
        default: ''
    },
    rollNo: {
        type: String,
        trim: true,
        default: ''
    },
    branch: {
        type: String,
        trim: true,
        default: ''
    },
    semester: {
        type: Number,
        min: 1,
        max: 12,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
