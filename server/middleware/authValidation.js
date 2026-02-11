const Joi = require('joi');

// Schema for User Registration
const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
        'string.min': 'Name must be at least 2 characters long',
        'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address'
    }),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required().messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must include uppercase, lowercase, number and special character'
    })
});

// Schema for User Login
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

// Schema for OTP Verification
const verifyOTPSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required()
});

// Schema for Forgot Password
const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required()
});

// Schema for Reset Password
const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
    newPassword: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required()
});

// Generic validator wrapper
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = {
    validateRegister: validate(registerSchema),
    validateLogin: validate(loginSchema),
    validateVerifyOTP: validate(verifyOTPSchema),
    validateForgotPassword: validate(forgotPasswordSchema),
    validateResetPassword: validate(resetPasswordSchema)
};
