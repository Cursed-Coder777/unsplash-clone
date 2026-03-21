import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Send OTP email
export const sendOTPEmail = async (email: string, otp: string, name: string) => {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
                .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .logo { text-align: center; margin-bottom: 20px; font-size: 24px; font-weight: bold; color: #333; }
                .otp-code { font-size: 36px; font-weight: bold; text-align: center; letter-spacing: 5px; background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 20px 0; color: #2c3e50; }
                .expiry { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
                .button { display: inline-block; background: #3498db; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin-top: 20px; }
                .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="logo">📸 Unsplash Clone</div>
                <h2>Hello ${name}!</h2>
                <p>Thank you for registering. Please verify your email address by entering the code below:</p>
                <div class="otp-code">${otp}</div>
                <p>This code will expire in <strong>10 minutes</strong>.</p>
                <div class="expiry">If you didn't request this, please ignore this email.</div>
                <div class="footer">
                    <p>© 2024 Unsplash Clone. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    await transporter.sendMail({
        from: `"Unsplash Clone" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email Address',
        html,
    });
};