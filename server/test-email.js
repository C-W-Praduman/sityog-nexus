const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log('--- Email Configuration Test ---');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '******** (Hidden)' : 'MISSING');

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('✗ Error: EMAIL_USER or EMAIL_PASS environment variables are missing.');
        process.exit(1);
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        connectionTimeout: 10000
    });

    console.log('Verifying connection...');
    try {
        await transporter.verify();
        console.log('✓ Success: Connection to SMTP server is established.');
        
        console.log('Sending test email to', process.env.EMAIL_USER, '...');
        const info = await transporter.sendMail({
            from: `"Nexus Test" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: 'Nexus Email Test',
            text: 'If you received this, your email configuration is working correctly!'
        });
        console.log('✓ Success: Test email sent!', info.messageId);
    } catch (error) {
        console.error('✗ Failed: Email testing failed.');
        console.error('Error details:', error.message);
        console.log('\n--- Troubleshooting Tips ---');
        console.log('1. Ensure you are using a Gmail APP PASSWORD (16 characters), not your regular password.');
        console.log('2. Check if the EMAIL_USER matches your Gmail address.');
        console.log('3. Ensure your internet connection is stable.');
    }
}

testEmail();
