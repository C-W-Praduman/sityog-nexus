const nodemailer = require('nodemailer');

// Configure the email transporter using Port 587 (most compatible)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
        user: (process.env.EMAIL_USER || "").trim(),
        pass: (process.env.EMAIL_PASS || "").trim()
    },
    // timeouts to prevent hangs
    connectionTimeout: 15000, 
    greetingTimeout: 15000,
    socketTimeout: 20000
});

// Verify transporter on startup
transporter.verify((error, success) => {
    if (error) {
        console.error('✗ Email Transporter Error:', error.message);
    } else {
        console.log('✓ Email Transporter is ready');
    }
});

/**
 * Sends a beautiful HTML email with an OTP.
 */
const sendOTPEmail = async (to, otp) => {
    try {
        const mailOptions = {
            from: `"Nexus" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: 'Verify Your Email - Nexus',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #2563eb; margin: 0;">Nexus</h1>
                    </div>
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <h2 style="color: #1e293b; margin-top: 0;">Email Verification</h2>
                        <p style="color: #475569; line-height: 1.6;">Your One-Time Password (OTP) is:</p>
                        <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f1f5f9; border-radius: 12px;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 12px; color: #1e40af;">${otp}</span>
                        </div>
                    </div>
                </div>
            `
        };
        return await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Email Send Error (OTP):', error);
        throw error;
    }
};

/**
 * Sends a password reset email.
 */
const sendResetEmail = async (to, otp) => {
    try {
        const mailOptions = {
            from: `"Nexus Security" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: 'Reset Your Password - Nexus',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #fff4f4;">
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 8px;">
                        <h2 style="color: #1e293b;">Password Reset Request</h2>
                        <p>Use the code below to proceed:</p>
                        <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #fef2f2; border-radius: 12px;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #b91c1c;">${otp}</span>
                        </div>
                    </div>
                </div>
            `
        };
        return await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Email Send Error (Reset):', error);
        throw error;
    }
};

module.exports = { sendOTPEmail, sendResetEmail };
