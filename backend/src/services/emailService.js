const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Email templates
const emailTemplates = {
  emailVerification: (data) => ({
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
          <h1 style="color: #333; margin: 0;">Barber Booking App</h1>
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #333;">Hello ${data.name}!</h2>
          <p>Thank you for registering with Barber Booking App. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.verificationUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
          </div>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${data.verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666;">
          <p>&copy; 2024 Barber Booking App. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  passwordReset: (data) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
          <h1 style="color: #333; margin: 0;">Barber Booking App</h1>
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #333;">Hello ${data.name}!</h2>
          <p>You requested a password reset for your Barber Booking App account. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetUrl}" style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${data.resetUrl}</p>
          <p>This link will expire in 10 minutes.</p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666;">
          <p>&copy; 2024 Barber Booking App. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  appointmentConfirmation: (data) => ({
    subject: 'Appointment Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
          <h1 style="color: #333; margin: 0;">Barber Booking App</h1>
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #333;">Hello ${data.clientName}!</h2>
          <p>Your appointment has been confirmed. Here are the details:</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Barber:</strong> ${data.barberName}</p>
            <p><strong>Service:</strong> ${data.serviceName}</p>
            <p><strong>Date:</strong> ${data.appointmentDate}</p>
            <p><strong>Time:</strong> ${data.appointmentTime}</p>
            <p><strong>Duration:</strong> ${data.duration}</p>
            <p><strong>Total Amount:</strong> ${data.amount}</p>
          </div>
          <p>Please arrive 5 minutes before your scheduled time.</p>
          <p>If you need to cancel or reschedule, please do so at least 24 hours in advance.</p>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666;">
          <p>&copy; 2024 Barber Booking App. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  appointmentReminder: (data) => ({
    subject: 'Appointment Reminder',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
          <h1 style="color: #333; margin: 0;">Barber Booking App</h1>
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #333;">Hello ${data.clientName}!</h2>
          <p>This is a friendly reminder about your upcoming appointment:</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Barber:</strong> ${data.barberName}</p>
            <p><strong>Service:</strong> ${data.serviceName}</p>
            <p><strong>Date:</strong> ${data.appointmentDate}</p>
            <p><strong>Time:</strong> ${data.appointmentTime}</p>
            <p><strong>Duration:</strong> ${data.duration}</p>
          </div>
          <p>Please arrive 5 minutes before your scheduled time.</p>
          <p>If you need to cancel or reschedule, please contact us as soon as possible.</p>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666;">
          <p>&copy; 2024 Barber Booking App. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  appointmentCancellation: (data) => ({
    subject: 'Appointment Cancelled',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
          <h1 style="color: #333; margin: 0;">Barber Booking App</h1>
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #333;">Hello ${data.clientName}!</h2>
          <p>Your appointment has been cancelled. Here are the details:</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Barber:</strong> ${data.barberName}</p>
            <p><strong>Service:</strong> ${data.serviceName}</p>
            <p><strong>Date:</strong> ${data.appointmentDate}</p>
            <p><strong>Time:</strong> ${data.appointmentTime}</p>
            <p><strong>Reason:</strong> ${data.reason}</p>
          </div>
          <p>If you have any questions, please contact us.</p>
          <p>You can book a new appointment anytime through our website.</p>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666;">
          <p>&copy; 2024 Barber Booking App. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  welcomeEmail: (data) => ({
    subject: 'Welcome to Barber Booking App!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
          <h1 style="color: #333; margin: 0;">Barber Booking App</h1>
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #333;">Welcome ${data.name}!</h2>
          <p>Thank you for joining Barber Booking App! We're excited to help you find and book the perfect barber for your needs.</p>
          <p>Here's what you can do with your account:</p>
          <ul>
            <li>Browse barber profiles and services</li>
            <li>Book appointments online</li>
            <li>Manage your booking history</li>
            <li>Receive appointment reminders</li>
            <li>Rate and review your experience</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.appUrl}" style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Start Booking</a>
          </div>
          <p>If you have any questions, feel free to contact our support team.</p>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666;">
          <p>&copy; 2024 Barber Booking App. All rights reserved.</p>
        </div>
      </div>
    `
  })
};

// Send email function
const sendEmail = async ({ email, subject, html, template, data }) => {
  try {
    const transporter = createTransporter();
    
    let emailContent;
    
    if (template && emailTemplates[template]) {
      emailContent = emailTemplates[template](data);
    } else {
      emailContent = { subject, html };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

// Send bulk emails
const sendBulkEmails = async (emails, template, data) => {
  try {
    const transporter = createTransporter();
    const emailContent = emailTemplates[template](data);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: emails.join(', '),
      subject: emailContent.subject,
      html: emailContent.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Bulk email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Bulk email sending error:', error);
    throw error;
  }
};

// Verify email configuration
const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email configuration is valid');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
};

module.exports = {
  sendEmail,
  sendBulkEmails,
  verifyEmailConfig,
  emailTemplates
};