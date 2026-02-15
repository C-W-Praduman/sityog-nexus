const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log('--- Nodemailer Configuration Test ---');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Detecting pass...' : 'MISSING');

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: (process.env.EMAIL_USER || "").trim(),
            pass: (process.env.EMAIL_PASS || "").trim()
        },
        connectionTimeout: 15000
    });

    try {
        console.log('Verifying connection...');
        await transporter.verify();
        console.log('✓ Success: Connection to SMTP server is established.');
        
        console.log('Sending test email...');
        const info = await transporter.sendMail({
            from: `"Nexus Test" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: 'Nexus Rollback Test',
            text: 'Nodemailer rollback is successful!'
        });
        console.log('✓ Success: Test email sent!', info.messageId);
    } catch (error) {
        console.error('✗ Failed:', error.message);
    }
}

testEmail();
