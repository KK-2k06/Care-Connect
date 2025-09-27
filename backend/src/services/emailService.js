import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Create transporter for email service
const createTransporter = () => {
  // For development, using Gmail SMTP
  // In production, you should use a proper email service like SendGrid, AWS SES, etc.
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ADMIN_EMAIL, // Admin email from environment variables
      pass: process.env.ADMIN_EMAIL_PASSWORD // App password for Gmail
    }
  })
}

// Email templates
const getStudentConfirmationEmail = (bookingData) => {
  return {
    subject: `Booking Confirmation - ${bookingData.bookingId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
          Booking Confirmation
        </h2>
        
        <p>Dear ${bookingData.studentName},</p>
        
        <p>Your counseling session has been successfully booked. Here are the details:</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Session Details</h3>
          <p><strong>Booking ID:</strong> ${bookingData.bookingId}</p>
          <p><strong>Mentor:</strong> ${bookingData.mentorName}</p>
          <p><strong>Time:</strong> ${bookingData.meetingTime}</p>
          <p><strong>Venue:</strong> ${bookingData.venue}</p>
          <p><strong>Your Email:</strong> ${bookingData.studentEmail}</p>
          <p><strong>Your Phone:</strong> ${bookingData.studentPhone}</p>
        </div>
        
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #92400e; margin-top: 0;">Important Notes:</h4>
          <ul style="color: #92400e;">
            <li>Please arrive 10 minutes before your scheduled time</li>
            <li>Bring a valid ID for verification</li>
            <li>If you need to reschedule, please contact us at least 24 hours in advance</li>
          </ul>
        </div>
        
        <p>If you have any questions or concerns, please don't hesitate to contact us.</p>
        
        <p>Best regards,<br>
        Care Connect Team</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 12px; color: #6b7280;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `
  }
}

const getMentorNotificationEmail = (bookingData) => {
  return {
    subject: `New Booking Request - ${bookingData.bookingId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
          New Booking Request
        </h2>
        
        <p>Dear ${bookingData.mentorName},</p>
        
        <p>You have a new counseling session booking. Here are the details:</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Session Details</h3>
          <p><strong>Booking ID:</strong> ${bookingData.bookingId}</p>
          <p><strong>Student Name:</strong> ${bookingData.studentName}</p>
          <p><strong>Student Email:</strong> ${bookingData.studentEmail}</p>
          <p><strong>Student Phone:</strong> ${bookingData.studentPhone}</p>
          <p><strong>Time:</strong> ${bookingData.meetingTime}</p>
          <p><strong>Venue:</strong> ${bookingData.venue}</p>
        </div>
        
        <div style="background-color: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #065f46; margin-top: 0;">Next Steps:</h4>
          <ul style="color: #065f46;">
            <li>Please confirm your availability for the scheduled time</li>
            <li>Prepare for the session based on the student's needs</li>
            <li>Arrive at the venue 5 minutes before the scheduled time</li>
          </ul>
        </div>
        
        <p>Please let us know if you have any concerns or need to reschedule.</p>
        
        <p>Best regards,<br>
        Care Connect Team</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 12px; color: #6b7280;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `
  }
}

// Send email function
export const sendBookingEmails = async (bookingData) => {
  try {
    const transporter = createTransporter()
    
    // Send confirmation email to student
    const studentEmail = getStudentConfirmationEmail(bookingData)
    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: bookingData.studentEmail,
      ...studentEmail
    })
    
    // Send notification email to mentor
    const mentorEmail = getMentorNotificationEmail(bookingData)
    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: bookingData.mentorEmail,
      ...mentorEmail
    })
    
    console.log('Booking emails sent successfully')
    return { success: true, message: 'Emails sent successfully' }
    
  } catch (error) {
    console.error('Error sending booking emails:', error)
    return { success: false, message: 'Failed to send emails', error: error.message }
  }
}

// Test email configuration
export const testEmailConfiguration = async () => {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    console.log('Email configuration is valid')
    return { success: true, message: 'Email configuration is valid' }
  } catch (error) {
    console.error('Email configuration error:', error)
    return { success: false, message: 'Email configuration failed', error: error.message }
  }
}
