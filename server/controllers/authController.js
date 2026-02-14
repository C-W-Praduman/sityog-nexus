const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendOTPEmail, sendResetEmail } = require('../services/emailService');

// -- HELPER: Generate 6-digit OTP --
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// -- REGISTER: Step 1 (Save Pending & Send OTP) --
exports.register = async (req, res) => {
    try {
        const {name, email, password } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        // 1. Check if email already exists
        const existingEmailUser = await User.findOne({ email: normalizedEmail });
        if (existingEmailUser && existingEmailUser.isVerified) {
            return res.status(409).json({ 
                error: 'Email already exists and is verified. Please login.', 
                redirectLogin: true 
            });
        }

        
       

        // 3. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Upsert User
        await User.findOneAndUpdate(
            { email: normalizedEmail },
            { name, email: normalizedEmail, password: hashedPassword, isVerified: false },
            { upsert: true, new: true }
        );

        // 4. Generate and Hash OTP
        const otpCode = generateOTP();
        const hashedOTP = await bcrypt.hash(otpCode, salt);

        // 5. Store OTP (overwrite if exists)
        await OTP.findOneAndUpdate(
            { email },
            { otp: hashedOTP, createdAt: Date.now() },
            { upsert: true }
        );

        // 6. Send OTP Email
        try {
            await sendOTPEmail(email, otpCode);
        } catch (mailErr) {
            console.error('Registration Email Error:', mailErr);
            return res.status(500).json({ 
                error: 'Could not send verification email. Please check if your email service is configured correctly.',
                details: mailErr.message 
            });
        }

        res.status(200).json({ message: 'OTP sent to email. Please verify.' });

    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

// -- VERIFY OTP: Step 2 (Activate User) --
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const normalizedEmail = email.toLowerCase().trim();
        // 1. Find OTP record
        const otpRecord = await OTP.findOne({ email: normalizedEmail });
        if (!otpRecord) {
            return res.status(400).json({ error: 'OTP expired or not requested' });
        }

        // 2. Validate OTP
        const isValid = await bcrypt.compare(otp, otpRecord.otp);
        if (!isValid) {
            return res.status(400).json({ error: 'Invalid OTP code' });
        }

        // 3. Activate User
        await User.findOneAndUpdate({ email: normalizedEmail }, { isVerified: true });

        // 4. Delete used OTP
        await OTP.deleteOne({ email: normalizedEmail });

        res.status(200).json({ message: 'Email verified successfully! You can now login.' });

    } catch (err) {
        console.error('Verification Error:', err);
        res.status(500).json({ error: 'Internal server error during verification' });
    }
};

// -- LOGIN --
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        // 1. Find User
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' }); // generic message for security
        }

        // 2. Check if verified
        if (!user.isVerified) {
            return res.status(403).json({ 
                error: 'Please verify your email before logging in',
                needsVerification: true 
            });
        }

        // 3. Compare Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // 4. Create JWT
        const token = jwt.sign(
            { id: user._id, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
};

// -- FORGOT PASSWORD: Request Reset --
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            // Logically we shouldn't reveal if user exists, but typically in non-critical apps 
            // we give feedback. For production security: "If email exists, reset code sent."
            return res.status(200).json({ message: 'If this email is registered, a reset code has been sent.' });
        }

        const otpCode = generateOTP();
        const salt = await bcrypt.genSalt(10);
        const hashedOTP = await bcrypt.hash(otpCode, salt);

        await OTP.findOneAndUpdate(
            { email },
            { otp: hashedOTP, createdAt: Date.now() },
            { upsert: true }
        );

        try {
            await sendResetEmail(email, otpCode);
        } catch (mailErr) {
            console.error('Reset Email Error:', mailErr);
            // We still return 200/Success to not leak user existence, or we can be honest if it's a server error.
            // For now, let's be honest about the mail service failure.
            return res.status(500).json({ 
                error: 'Could not send reset code. Please try again later.',
                details: mailErr.message
            });
        }

        res.status(200).json({ message: 'Reset code sent to your email.' });

    } catch (err) {
        console.error('Forgot PW Error:', err);
        res.status(500).json({ error: 'Failed to process request' });
    }
};

// -- RESET PASSWORD: Apply New Password --
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        const otpRecord = await OTP.findOne({ email: normalizedEmail });
        if (!otpRecord) {
            return res.status(400).json({ error: 'Reset code expired or invalid' });
        }

        const isValid = await bcrypt.compare(otp, otpRecord.otp);
        if (!isValid) {
            return res.status(400).json({ error: 'Invalid reset code' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await User.findOneAndUpdate({ email }, { password: hashedPassword });
        await OTP.deleteOne({ email });

        res.status(200).json({ message: 'Password reset successful! You can now login.' });

    } catch (err) {
        console.error('Reset PW Error:', err);
        res.status(500).json({ error: 'Failed to reset password' });
    }
};

// -- GET PROFILE --
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ user });
    } catch (err) {
        console.error('Get Profile Error:', err);
        res.status(500).json({ error: 'Failed to load profile' });
    }
};

// -- UPDATE PROFILE --
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        // Only allow specific fields to be updated
        const { name, mobile, rollNo, branch, semester } = req.body;

        const update = {};
        if (name) update.name = name;
        if (mobile !== undefined) update.mobile = mobile;
        if (rollNo !== undefined) update.rollNo = rollNo;
        if (branch !== undefined) update.branch = branch;
        if (semester !== undefined) update.semester = semester;

        const updated = await User.findByIdAndUpdate(userId, update, { new: true }).select('-password');
        if (!updated) return res.status(404).json({ error: 'User not found' });

        res.status(200).json({ user: updated });
    } catch (err) {
        console.error('Update Profile Error:', err);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};
