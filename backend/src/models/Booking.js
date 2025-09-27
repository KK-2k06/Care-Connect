import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema(
  {
    studentName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    studentEmail: { 
      type: String, 
      required: true, 
      trim: true 
    },
    studentPhone: { 
      type: String, 
      required: true, 
      trim: true 
    },
    mentorName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    mentorEmail: { 
      type: String, 
      required: true, 
      trim: true 
    },
    meetingTime: { 
      type: String, 
      required: true, 
      trim: true 
    },
    venue: { 
      type: String, 
      default: 'Campus Counseling Center - Room 201' 
    },
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'cancelled'], 
      default: 'pending' 
    },
    bookingId: {
      type: String,
      unique: true,
      required: true
    }
  },
  { timestamps: true }
)

// Generate unique booking ID before saving
bookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 8)
    this.bookingId = `BK-${timestamp}-${random}`.toUpperCase()
  }
  next()
})

const Booking = mongoose.model('Booking', bookingSchema)
export default Booking
