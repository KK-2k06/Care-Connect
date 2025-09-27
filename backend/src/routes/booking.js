import express from 'express'
import { body, validationResult } from 'express-validator'
import Booking from '../models/Booking.js'
import Mentor from '../models/Mentor.js'
import { sendBookingEmails } from '../services/emailService.js'

const router = express.Router()

// Validation middleware
const bookingValidation = [
  body('studentName').trim().isLength({ min: 2 }).withMessage('Student name must be at least 2 characters'),
  body('studentEmail').isEmail().withMessage('Valid email is required'),
  body('studentPhone').trim().isLength({ min: 10 }).withMessage('Valid phone number is required'),
  body('mentorName').trim().isLength({ min: 2 }).withMessage('Mentor name is required'),
  body('mentorEmail').isEmail().withMessage('Valid mentor email is required'),
  body('meetingTime').trim().isLength({ min: 1 }).withMessage('Meeting time is required')
]

// Create new booking
router.post('/create', bookingValidation, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { studentName, studentEmail, studentPhone, mentorName, mentorEmail, meetingTime } = req.body

    // Debug logging
    console.log('=== BOOKING REQUEST DEBUG ===')
    console.log('Received mentorEmail:', mentorEmail)
    console.log('Lowercase mentorEmail:', mentorEmail?.toLowerCase())
    console.log('Full request body:', req.body)

    // Check if mentor exists and is active
    // Use original email format to preserve dots
    let mentor = await Mentor.findOne({ email: mentorEmail, isActive: true })

    // If not found with exact match, try case-insensitive search
    if (!mentor) {
      const emailRegex = new RegExp('^' + mentorEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i');
      mentor = await Mentor.findOne({ email: emailRegex, isActive: true })
    }

    // Third: fall back to name match if provided
    if (!mentor && mentorName) {
      mentor = await Mentor.findOne({ name: mentorName, isActive: true })
      if (mentor) {
        console.log('Matched mentor by name fallback')
      }
    }

    console.log('Found mentor:', mentor ? 'YES' : 'NO')
    if (mentor) {
      console.log('Mentor details:', {
        name: mentor.name,
        email: mentor.email,
        isActive: mentor.isActive
      })
    }

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found or inactive'
      })
    }

    // Check for existing booking at the same time
    const existingBooking = await Booking.findOne({
      mentorEmail, // Use original email format
      meetingTime,
      status: { $in: ['pending', 'confirmed'] }
    })

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: 'Time slot is already booked'
      })
    }

    // Generate unique booking ID
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 8)
    const bookingId = `BK-${timestamp}-${random}`.toUpperCase()

    // Create new booking
    const newBooking = new Booking({
      studentName,
      studentEmail, // Preserve original email format
      studentPhone,
      mentorName,
      mentorEmail, // Preserve original email format
      meetingTime,
      bookingId
    })

    const savedBooking = await newBooking.save()

    // Send confirmation emails
    const emailResult = await sendBookingEmails(savedBooking)

    // Update mentor's available slots (mark the selected slot as unavailable)
    const mentorSlots = mentor.availableSlots
    const updatedSlots = mentorSlots.map(slot => {
      if (slot.time === meetingTime.split(' - ')[1] && slot.date === meetingTime.split(' - ')[0]) {
        return { ...slot, available: false }
      }
      return slot
    })

    await Mentor.findByIdAndUpdate(mentor._id, {
      availableSlots: updatedSlots
    })

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        bookingId: savedBooking.bookingId,
        studentName: savedBooking.studentName,
        mentorName: savedBooking.mentorName,
        meetingTime: savedBooking.meetingTime,
        venue: savedBooking.venue,
        status: savedBooking.status,
        emailSent: emailResult.success
      }
    })

  } catch (error) {
    console.error('Error creating booking:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    })
  }
})

// Get all mentors
router.get('/mentors', async (req, res) => {
  try {
    const mentors = await Mentor.find({ isActive: true })
      .select('name email specialization experience availableSlots')
      .sort({ name: 1 })

    res.json({
      success: true,
      data: mentors
    })

  } catch (error) {
    console.error('Error fetching mentors:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    })
  }
})

// Get booking by ID
router.get('/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params

    const booking = await Booking.findOne({ bookingId })

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      })
    }

    res.json({
      success: true,
      data: booking
    })

  } catch (error) {
    console.error('Error fetching booking:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    })
  }
})

// Get all bookings (for admin purposes)
router.get('/', async (req, res) => {
  try {
    const { status, mentorEmail, studentEmail } = req.query
    let filter = {}

    if (status) filter.status = status
    if (mentorEmail) filter.mentorEmail = mentorEmail.toLowerCase()
    if (studentEmail) filter.studentEmail = studentEmail.toLowerCase()

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .select('-__v')

    res.json({
      success: true,
      data: bookings
    })

  } catch (error) {
    console.error('Error fetching bookings:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    })
  }
})

// Update booking status
router.patch('/:bookingId/status', async (req, res) => {
  try {
    const { bookingId } = req.params
    const { status } = req.body

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, confirmed, or cancelled'
      })
    }

    const booking = await Booking.findOneAndUpdate(
      { bookingId },
      { status },
      { new: true }
    )

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      })
    }

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    })

  } catch (error) {
    console.error('Error updating booking status:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    })
  }
})

export default router
