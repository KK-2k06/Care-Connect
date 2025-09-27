import mongoose from 'mongoose'

const mentorSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true 
    },
    specialization: { 
      type: String, 
      required: true, 
      trim: true 
    },
    experience: { 
      type: String, 
      required: true, 
      trim: true 
    },
    availableSlots: [{
      time: { type: String, required: true },
      date: { type: String, required: true },
      available: { type: Boolean, default: true }
    }],
    isActive: { 
      type: Boolean, 
      default: true 
    }
  },
  { timestamps: true }
)

const Mentor = mongoose.model('Mentor', mentorSchema)
export default Mentor
