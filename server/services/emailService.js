const { Resend } = require("resend");
console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends OTP email for registration
 */
const sendOTPEmail = async (to, otp) => {
    try {
        const response = await resend.emails.send({
            from: "onboarding@resend.dev", // change after domain verify
            to,
            subject: "Verify Your Email - Nexus",
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #2563eb;">Nexus</h1>
                    </div>

                    <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.08);">
                        <h2>Email Verification</h2>
                        <p>Your One-Time Password (OTP) is:</p>

                        <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f1f5f9; border-radius: 12px;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 10px;">
                                ${otp}
                            </span>
                        </div>

                        <p style="color: #64748b;">This OTP is valid for a limited time.</p>
                    </div>
                </div>
            `
        });

        return response;
    } catch (error) {
        console.error("Resend OTP Email Error:", error);
        throw error;
    }
};

/**
 * Sends password reset OTP email
 */
const sendResetEmail = async (to, otp) => {
    try {
        const response = await resend.emails.send({
            from: "Nexus Security <onboarding@resend.dev>",
            to,
            subject: "Reset Your Password - Nexus",
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 8px;">
                        <h2>Password Reset</h2>
                        <p>Use the OTP below to reset your password:</p>

                        <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #fef2f2; border-radius: 12px;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #b91c1c;">
                                ${otp}
                            </span>
                        </div>
                    </div>
                </div>
            `
        });

        return response;
    } catch (error) {
        console.error("Resend Reset Email Error:", error);
        throw error;
    }
};

module.exports = { sendOTPEmail, sendResetEmail };
