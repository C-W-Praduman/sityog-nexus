const nodemailer = require('nodemailer');

// Configure the email transporter
// You should provide these details in your .env file
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or your preferred email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS  // Use an App Password for Gmail
    }
});

/**
 * Sends a beautiful HTML email with an OTP.
 * @param {string} to - Recipient email address
 * @param {string} otp - The 6-digit OTP code
 */
const sendOTPEmail = async (to, otp) => {
    const mailOptions = {
        from: `"Nexus Study Portal" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: 'Verify Your Email - Nexus',
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #2563eb; margin: 0;">Nexus</h1>
                    <p style="color: #64748b; font-size: 14px;">Bridge to Excellence</p>
                </div>
                <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <h2 style="color: #1e293b; margin-top: 0;">Email Verification</h2>
                    <p style="color: #475569; line-height: 1.6;">Hello,</p>
                    <p style="color: #475569; line-height: 1.6;">Thank you for joining Nexus. Please use the following One-Time Password (OTP) to verify your account. This code is valid for 10 minutes.</p>
                    
                    <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f1f5f9; border-radius: 12px;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 12px; color: #1e40af;">${otp}</span>
                    </div>
                    
                    <p style="color: #475569; line-height: 1.6;">If you didn't request this, you can safely ignore this email.</p>
                </div>
                <div style="text-align: center; margin-top: 20px; color: #94a3b8; font-size: 12px;">
                    © ${new Date().getFullYear()} Nexus Study Portal. All rights reserved.
                </div>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};

/**
 * Sends a password reset email.
 * @param {string} to - Recipient email address
 * @param {string} otp - The reset OTP code
 */
const sendResetEmail = async (to, otp) => {
    const mailOptions = {
        from: `"Nexus Study Portal" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: 'Reset Your Password - Nexus',
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #fff4f4;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #dc2626; margin: 0;">Nexus Security</h1>
                </div>
                <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <h2 style="color: #1e293b; margin-top: 0;">Password Reset Request</h2>
                    <p style="color: #475569; line-height: 1.6;">We received a request to reset your password. Use the code below to proceed:</p>
                    
                    <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #fef2f2; border-radius: 12px; border: 1px dashed #f87171;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #b91c1c;">${otp}</span>
                    </div>
                    
                    <p style="color: #475569; line-height: 1.6;">If you didn't request this, please change your password immediately or contact support.</p>
                </div>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail, sendResetEmail };
