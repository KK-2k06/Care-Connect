# Care Connect - Setup Instructions

## Backend Setup

### 1. Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/care-connect

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (Gmail SMTP)
ADMIN_EMAIL=your-admin-email@gmail.com
ADMIN_EMAIL_PASSWORD=your-app-password-here

# Server Configuration
PORT=5000

# MongoDB TLS Configuration (optional)
# MONGO_TLS_INSECURE=1
```

### 2. Email Setup (Gmail)
To send emails, you need to:

1. Use a Gmail account for the admin email
2. Enable 2-factor authentication on your Gmail account
3. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password as `ADMIN_EMAIL_PASSWORD`

### 3. Database Setup
1. Make sure MongoDB is running
2. Seed the database with mentors:
   ```bash
   npm run seed:mentors
   ```

### 4. Start the Backend Server
```bash
npm run server
```

## Frontend Setup

### 1. Start the Frontend Development Server
```bash
npm run dev
```

## Features Implemented

### Confidential Booking System
- ✅ Student can fill booking form with personal details
- ✅ Mentor selection from available counselors
- ✅ Time slot selection from mentor availability
- ✅ Backend API stores booking in MongoDB
- ✅ Email notifications sent to both student and mentor
- ✅ Real-time availability updates
- ✅ Booking confirmation with unique booking ID
- ✅ Form validation and error handling
- ✅ Loading states and user feedback

### Email Notifications
- ✅ Professional HTML email templates
- ✅ Student confirmation email with booking details
- ✅ Mentor notification email with student information
- ✅ Admin email as sender
- ✅ Automatic email sending on successful booking

### Database Models
- ✅ Booking model with all required fields
- ✅ Mentor model with availability slots
- ✅ User model for authentication
- ✅ Unique booking ID generation
- ✅ Timestamps and status tracking

## API Endpoints

### Booking Routes (`/api/booking`)
- `POST /create` - Create new booking
- `GET /mentors` - Get all available mentors
- `GET /:bookingId` - Get booking by ID
- `GET /` - Get all bookings (with filters)
- `PATCH /:bookingId/status` - Update booking status

## Testing the System

1. Start both backend and frontend servers
2. Navigate to the booking page
3. Fill out the booking form
4. Select a mentor and time slot
5. Submit the booking
6. Check email inboxes for confirmation emails
7. Verify booking is stored in database

## Troubleshooting

### Email Issues
- Ensure Gmail app password is correct
- Check that 2FA is enabled on Gmail account
- Verify admin email credentials in .env file

### Database Issues
- Ensure MongoDB is running
- Check MONGODB_URI connection string
- Run seed scripts to populate initial data

### Frontend Issues
- Ensure backend server is running on port 5000
- Check browser console for API errors
- Verify CORS configuration if needed
