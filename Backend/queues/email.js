const Bull = require('bull');
const User = require('../models/User.model');
const OrderModel = require('../models/Order.model');
const sendEmail = require('../utils/sendMail');

// Initialize Bull queue
const EmailQueue = new Bull('Email_Sending', {
    redis: { host: '127.0.0.1', port: 6379 },
    defaultJobOptions: {
        attempts: 3,
        delay: 3000 // Retry delay: 3 seconds
    }
});

// Email templates for various notifications
const emailTemplates = {
    // User registration verification
    register: (user, otp) => `
        <html>
        <body>
            <h2>Welcome to Nypers!</h2>
            <p>Hi ${user.Name || 'User'},</p>
            <p>Your verification code is: <strong>${otp}</strong></p>
            <p>Thank you for joining our platform.</p>
        </body>
        </html>
    `,

    // Resend registration OTP
    resendRegisterOtp: (user, otp) => `
        <html>
        <body>
            <h2>Verification Code Resent</h2>
            <p>Hi ${user.Name || 'User'},</p>
            <p>Your new verification code is: <strong>${otp}</strong></p>
            <p>Please use this code to verify your account.</p>
        </body>
        </html>
    `,

    // Password reset OTP
    passwordOtp: (user, otp) => `
        <html>
        <body>
            <h2>Password Reset Request</h2>
            <p>Hi ${user.Name || 'User'},</p>
            <p>Your password reset code is: <strong>${otp}</strong></p>
            <p>Use this code to reset your password.</p>
        </body>
        </html>
    `,

    // Resend password reset OTP
    passwordResendOtp: (user, otp) => `
        <html>
        <body>
            <h2>Password Reset Code Resent</h2>
            <p>Hi ${user.Name || 'User'},</p>
            <p>Your new password reset code is: <strong>${otp}</strong></p>
            <p>Please use this code to reset your password.</p>
        </body>
        </html>
    `,

    // Order confirmation notification
    orderConfirmOtp: (order) => `
        <html>
        <body>
            <h2>Order Confirmation</h2>
            <p>Hi,</p>
            <p>Your order #${order._id} has been successfully placed.</p>
            <p>Thank you for shopping with Nypers!</p>
        </body>
        </html>
    `,

    // Fallback template
    default: () => `
        <html>
        <body>
            <h2>Email Notification</h2>
            <p>Hi,</p>
            <p>This is a notification from Nypers.</p>
        </body>
        </html>
    `
};

// Email processing logic
EmailQueue.process(async (job) => {
    try {
        const { user_id, mail_type, otp } = job.data;

        if (!user_id || !mail_type) {
            throw new Error('Invalid email job data.');
        }

        const user = await User.findById(user_id);
        if (!user) {
            throw new Error(`User not found for ID: ${user_id}`);
        }

        let emailContent;

        if (mail_type === 'orderConfirmOtp') {
            const order = await OrderModel.findOne({ userId: user_id });
            if (!order) {
                throw new Error(`Order not found for user ID: ${user_id}`);
            }
            emailContent = emailTemplates[mail_type](order);
        } else {
            if (!otp) {
                throw new Error('OTP is required for this email type.');
            }
            emailContent = emailTemplates[mail_type](user, otp);
        }

        const emailOptions = {
            from: 'Nypers <noreply@nypers.com>',
            email: user.Email,
            subject: mail_type,
            message: emailContent
        };

        const sent = await sendEmail(emailOptions);
        if (!sent) {
            throw new Error('Failed to send email.');
        }

        console.log(`Email sent to ${user.Email}`);
        job.progress(100);

    } catch (error) {
        console.error(`Error processing email job: ${error.message}`);
    }
});

// Event listeners
EmailQueue.on('completed', (job) => {
    console.log(`Email job ID ${job.id} completed successfully.`);
});

EmailQueue.on('failed', (job, err) => {
    console.error(`Email job failed for userId: ${job.data.user_id}`, err.message);
});

EmailQueue.on('error', (err) => {
    console.error('Email queue error:', err);
});

module.exports = EmailQueue;
