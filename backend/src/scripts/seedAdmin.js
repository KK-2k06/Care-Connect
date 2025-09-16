import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'

dotenv.config()

async function run(){
  try{
    const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env
    if(!MONGODB_URI) throw new Error('MONGODB_URI is required')
    if(!ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required')

    await mongoose.connect(MONGODB_URI)
    const existing = await User.findOne({ email: ADMIN_EMAIL })
    if(existing){
      if(existing.role !== 'admin'){
        existing.role = 'admin'
        await existing.save()
      }
      console.log('Admin user already exists:', ADMIN_EMAIL)
    }else{
      const passwordHash = await User.hashPassword(ADMIN_PASSWORD)
      await User.create({ email: ADMIN_EMAIL, passwordHash, role: 'admin' })
      console.log('Admin user created:', ADMIN_EMAIL)
    }
    process.exit(0)
  }catch(err){
    console.error('Seed error:', err.message)
    process.exit(1)
  }
}

run()


