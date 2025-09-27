import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Mentor from './src/models/Mentor.js'

dotenv.config()

async function debugMentors() {
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

    // Get all mentors
    const allMentors = await Mentor.find({})
    console.log(`\n=== ALL MENTORS IN DATABASE (${allMentors.length}) ===`)
    
    allMentors.forEach((mentor, index) => {
      console.log(`${index + 1}. Name: ${mentor.name}`)
      console.log(`   Email: ${mentor.email}`)
      console.log(`   Is Active: ${mentor.isActive}`)
      console.log(`   Specialization: ${mentor.specialization}`)
      console.log(`   ID: ${mentor._id}`)
      console.log('   ---')
    })

    // Get only active mentors (what the API returns)
    const activeMentors = await Mentor.find({ isActive: true })
    console.log(`\n=== ACTIVE MENTORS (${activeMentors.length}) ===`)
    
    activeMentors.forEach((mentor, index) => {
      console.log(`${index + 1}. Name: ${mentor.name}`)
      console.log(`   Email: ${mentor.email}`)
      console.log(`   Is Active: ${mentor.isActive}`)
      console.log('   ---')
    })

    // Test specific email lookup (like in booking validation)
    const testEmail = 'kumar.tech3005@gmail.com'
    console.log(`\n=== TESTING EMAIL LOOKUP: ${testEmail} ===`)
    
    const foundMentor = await Mentor.findOne({ 
      email: testEmail.toLowerCase(), 
      isActive: true 
    })
    
    if (foundMentor) {
      console.log('✅ FOUND MENTOR:')
      console.log(`   Name: ${foundMentor.name}`)
      console.log(`   Email: ${foundMentor.email}`)
      console.log(`   Is Active: ${foundMentor.isActive}`)
      console.log(`   ID: ${foundMentor._id}`)
    } else {
      console.log('❌ NO MENTOR FOUND with that email and isActive=true')
      
      // Try without isActive check
      const mentorWithoutActiveCheck = await Mentor.findOne({ 
        email: testEmail.toLowerCase()
      })
      
      if (mentorWithoutActiveCheck) {
        console.log('🔍 FOUND MENTOR WITHOUT isActive CHECK:')
        console.log(`   Name: ${mentorWithoutActiveCheck.name}`)
        console.log(`   Email: ${mentorWithoutActiveCheck.email}`)
        console.log(`   Is Active: ${mentorWithoutActiveCheck.isActive}`)
        console.log(`   ID: ${mentorWithoutActiveCheck._id}`)
      } else {
        console.log('❌ NO MENTOR FOUND AT ALL with that email')
      }
    }

    process.exit(0)
  } catch (error) {
    console.error('Error debugging mentors:', error)
    process.exit(1)
  }
}

debugMentors()


