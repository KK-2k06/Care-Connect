import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { createServer } from 'http'
import { Server } from 'socket.io'

import authRoutes from './src/routes/auth.js'
import bookingRoutes from './src/routes/booking.js'
import { requireAuth } from './src/middleware/auth.js'

dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

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

// Chat room functionality
const activeUsers = new Map()
const chatRooms = new Map()

// Generate anonymous names
const generateAnonymousName = () => {
  const adjectives = ['Silent', 'Mysterious', 'Quiet', 'Gentle', 'Wise', 'Kind', 'Calm', 'Peaceful', 'Serene', 'Thoughtful']
  const nouns = ['Listener', 'Friend', 'Helper', 'Supporter', 'Companion', 'Guide', 'Mentor', 'Counselor', 'Healer', 'Guardian']
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const number = Math.floor(Math.random() * 999) + 1
  return `${adj}${noun}${number}`
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)
  
  // Generate anonymous name for the user
  const anonymousName = generateAnonymousName()
  activeUsers.set(socket.id, {
    id: socket.id,
    name: anonymousName,
    room: 'general',
    joinedAt: new Date()
  })

  // Join the general room
  socket.join('general')
  
  // Update room count
  if (!chatRooms.has('general')) {
    chatRooms.set('general', new Set())
  }
  chatRooms.get('general').add(socket.id)

  // Send current active users count to all clients
  io.emit('userCount', activeUsers.size)
  
  // Send welcome message
  socket.emit('welcome', {
    message: `Welcome to the support chat! You are known as "${anonymousName}"`,
    yourName: anonymousName
  })

  // Notify others about new user
  socket.broadcast.emit('userJoined', {
    message: `${anonymousName} joined the chat`,
    userCount: activeUsers.size
  })

  // Handle chat messages
  socket.on('chatMessage', (data) => {
    const user = activeUsers.get(socket.id)
    if (user) {
      const messageData = {
        id: Date.now() + Math.random(),
        user: user.name,
        message: data.message,
        timestamp: new Date().toISOString()
      }
      
      // Broadcast to all users in the room
      io.to(user.room).emit('newMessage', messageData)
    }
  })

  // Handle room changes
  socket.on('joinRoom', (roomName) => {
    const user = activeUsers.get(socket.id)
    if (user) {
      // Leave current room
      socket.leave(user.room)
      if (chatRooms.has(user.room)) {
        chatRooms.get(user.room).delete(socket.id)
      }
      
      // Join new room
      socket.join(roomName)
      user.room = roomName
      
      if (!chatRooms.has(roomName)) {
        chatRooms.set(roomName, new Set())
      }
      chatRooms.get(roomName).add(socket.id)
      
      // Notify user about room change
      socket.emit('roomChanged', {
        room: roomName,
        message: `You joined ${roomName} room`
      })
      
      // Update user count for all clients
      io.emit('userCount', activeUsers.size)
    }
  })

  // Handle typing indicators
  socket.on('typing', (data) => {
    const user = activeUsers.get(socket.id)
    if (user) {
      socket.broadcast.to(user.room).emit('userTyping', {
        user: user.name,
        isTyping: data.isTyping
      })
    }
  })

  // Handle disconnect
  socket.on('disconnect', () => {
    const user = activeUsers.get(socket.id)
    if (user) {
      console.log('User disconnected:', user.name)
      
      // Remove from room
      if (chatRooms.has(user.room)) {
        chatRooms.get(user.room).delete(socket.id)
      }
      
      // Remove from active users
      activeUsers.delete(socket.id)
      
      // Notify others about user leaving
      socket.broadcast.emit('userLeft', {
        message: `${user.name} left the chat`,
        userCount: activeUsers.size
      })
      
      // Update user count
      io.emit('userCount', activeUsers.size)
    }
  })
})

const PORT = process.env.PORT || 5000

async function start(){
  try{
    // Set default environment variables if not provided
    if(!process.env.MONGODB_URI){
      process.env.MONGODB_URI = 'mongodb://localhost:27017/care-connect'
    }
    if(!process.env.JWT_SECRET){
      process.env.JWT_SECRET = 'your-secret-key-here'
    }
    
    // Try to connect to MongoDB, but don't fail if it's not available
    try {
      const mongoOptions = {}
      if(process.env.MONGO_TLS_INSECURE === '1'){
        mongoOptions.tlsAllowInvalidCertificates = true
      }
      await mongoose.connect(process.env.MONGODB_URI, mongoOptions)
      console.log('MongoDB connected')
    } catch (mongoError) {
      console.warn('MongoDB connection failed, but server will continue without database features:', mongoError.message)
      console.log('Chat functionality will work without database')
    }
    
    server.listen(PORT, () => {
      console.log(`Server running on ${PORT}`)
      console.log('Chat room is available at http://localhost:5000')
    })
  }catch(err){
    console.error('Startup error:', err.message)
    process.exit(1)
  }
}

start()


