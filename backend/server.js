import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import authRoutes from './src/routes/auth.js'
import bookingRoutes from './src/routes/booking.js'
import { requireAuth } from './src/middleware/auth.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRoutes)
app.use('/api/booking', bookingRoutes)
app.get('/api/protected', requireAuth, (req, res) => {
  res.json({ ok: true, userId: req.user.id, role: req.user.role })
})

const PORT = process.env.PORT || 5000

async function start(){
  try{
    if(!process.env.MONGODB_URI){
      throw new Error('MONGODB_URI is not set')
    }
    if(!process.env.JWT_SECRET){
      throw new Error('JWT_SECRET is not set')
    }
    const mongoOptions = {}
    if(process.env.MONGO_TLS_INSECURE === '1'){
      mongoOptions.tlsAllowInvalidCertificates = true
    }
    await mongoose.connect(process.env.MONGODB_URI, mongoOptions)
    console.log('MongoDB connected')
    app.listen(PORT, () => console.log(`Server running on ${PORT}`))
  }catch(err){
    console.error('Startup error:', err.message)
    process.exit(1)
  }
}

start()


