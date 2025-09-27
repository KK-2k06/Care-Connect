import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Mentor from '../models/Mentor.js'

dotenv.config()

const mentorsData = [
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@campus.edu',
    specialization: 'Mental Health Counselor',
    experience: '8 years',
    isActive: true,  // Add this line
    availableSlots: [
      { time: '9:00 AM', date: 'Today', available: true },
      { time: '11:00 AM', date: 'Today', available: true },
      { time: '2:00 PM', date: 'Today', available: false },
      { time: '4:00 PM', date: 'Today', available: true },
      { time: '10:00 AM', date: 'Tomorrow', available: true },
      { time: '1:00 PM', date: 'Tomorrow', available: true }
    ]
  },
  {
    name: 'Dr. Michael Chen',
    email: 'michael.chen@campus.edu',
    specialization: 'Academic Stress Counselor',
    experience: '6 years',
    isActive: true,  // Add this line
    availableSlots: [
      { time: '8:00 AM', date: 'Today', available: false },
      { time: '10:30 AM', date: 'Today', available: true },
      { time: '1:30 PM', date: 'Today', available: true },
      { time: '3:30 PM', date: 'Today', available: false },
      { time: '9:00 AM', date: 'Tomorrow', available: true },
      { time: '2:00 PM', date: 'Tomorrow', available: true }
    ]
  },
  {
    name: 'Dr. Emily Rodriguez',
    email: 'kumar.tech3005@gmail.com',
    specialization: 'Peer Support Specialist',
    experience: '5 years',
    isActive: true,  // Add this line
    availableSlots: [
      { time: '9:30 AM', date: 'Today', available: true },
      { time: '12:00 PM', date: 'Today', available: true },
      { time: '2:30 PM', date: 'Today', available: true },
      { time: '5:00 PM', date: 'Today', available: false },
      { time: '11:00 AM', date: 'Tomorrow', available: true },
      { time: '3:00 PM', date: 'Tomorrow', available: true }
    ]
  },
  {
    name: 'Dr. James Wilson',
    email: 'james.wilson@campus.edu',
    specialization: 'Crisis Intervention Specialist',
    experience: '10 years',
    isActive: true,  // Add this line
    availableSlots: [
      { time: '8:30 AM', date: 'Today', available: true },
      { time: '11:30 AM', date: 'Today', available: false },
      { time: '1:00 PM', date: 'Today', available: true },
      { time: '4:30 PM', date: 'Today', available: true },
      { time: '10:30 AM', date: 'Tomorrow', available: true },
      { time: '1:30 PM', date: 'Tomorrow', available: true }
    ]
  }
]

async function seedMentors() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set')
    }

    const mongoOptions = {}
    if (process.env.MONGO_TLS_INSECURE === '1') {
      mongoOptions.tlsAllowInvalidCertificates = true
    }

    await mongoose.connect(process.env.MONGODB_URI, mongoOptions)
    console.log('Connected to MongoDB')

    // Clear existing mentors
    await Mentor.deleteMany({})
    console.log('Cleared existing mentors')

    // Insert new mentors
    const mentors = await Mentor.insertMany(mentorsData)
    console.log(`Seeded ${mentors.length} mentors successfully`)

    // Display seeded mentors
    mentors.forEach(mentor => {
      console.log(`- ${mentor.name} (${mentor.email})`)
    })

    process.exit(0)
  } catch (error) {
    console.error('Error seeding mentors:', error)
    process.exit(1)
  }
}

seedMentors()
