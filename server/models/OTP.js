const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true,
        lowercase: true,
        trim: true
    },
    otp: {
        type: String, // Hashed OTP
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600 // 10 minutes - MongoDB will automatically delete this doc after 10 mins
    }
});

// Create model
const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
