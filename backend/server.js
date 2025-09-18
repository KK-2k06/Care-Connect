import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { createServer } from 'http'
import { Server } from 'socket.io'

import authRoutes from './src/routes/auth.js'
import { requireAuth } from './src/middleware/auth.js'

dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173", 
      "http://127.0.0.1:5173",
      /^http:\/\/192\.168\.\d+\.\d+:5173$/,
      /^http:\/\/10\.\d+\.\d+\.\d+:5173$/,
      /^http:\/\/172\.\d+\.\d+\.\d+:5173$/
    ],
    methods: ["GET", "POST"],
    credentials: true
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
app.get('/api/protected', requireAuth, (req, res) => {
  res.json({ ok: true, userId: req.user.id, role: req.user.role })
})

// WebSocket connection handling
const connectedUsers = new Map()
const communityRoom = 'community-chat'

io.on('connection', (socket) => {
  console.log('🔗 User connected:', socket.id)
  console.log('📊 Total connected users:', connectedUsers.size + 1)

  // Handle user joining the community chat
  socket.on('join-community', (userData) => {
    const { username, userId } = userData
    connectedUsers.set(socket.id, { username, userId, socketId: socket.id })
    
    socket.join(communityRoom)
    
    console.log(`👤 ${username} joined the community chat`)
    console.log('📊 Active users in room:', connectedUsers.size)
    
    // Notify all users in the room about the new user
    io.to(communityRoom).emit('user-joined', {
      username,
      userId,
      activeUsers: Array.from(connectedUsers.values())
    })
  })

  // Handle incoming messages
  socket.on('send-message', (messageData) => {
    const user = connectedUsers.get(socket.id)
    if (user) {
      const message = {
        id: Date.now(),
        username: user.username,
        userId: user.userId,
        text: messageData.text,
        timestamp: new Date().toISOString()
      }
      
      console.log(`Broadcasting message from ${user.username}: ${messageData.text}`)
      
      // Broadcast message to all users in the community room
      io.to(communityRoom).emit('new-message', message)
    }
  })

  // Handle user disconnection
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id)
    if (user) {
      connectedUsers.delete(socket.id)
      
      console.log(`👋 ${user.username} left the community chat`)
      console.log('📊 Remaining users:', connectedUsers.size)
      
      // Notify remaining users about the user leaving
      io.to(communityRoom).emit('user-left', {
        username: user.username,
        userId: user.userId,
        activeUsers: Array.from(connectedUsers.values())
      })
    } else {
      console.log('🔌 User disconnected without joining:', socket.id)
    }
  })
})

const PORT = process.env.PORT || 5000

async function start(){
  try{
    // For testing, make MongoDB optional
    if(process.env.MONGODB_URI){
      const mongoOptions = {}
      if(process.env.MONGO_TLS_INSECURE === '1'){
        mongoOptions.tlsAllowInvalidCertificates = true
      }
      await mongoose.connect(process.env.MONGODB_URI, mongoOptions)
      console.log('MongoDB connected')
    } else {
      console.log('⚠️  MongoDB not configured - running in test mode')
    }
    
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
  }catch(err){
    console.error('Startup error:', err.message)
    process.exit(1)
  }
}

console.log('🚀 Starting server...')
console.log('📋 Environment check:')
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set')
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set')
console.log('- PORT:', process.env.PORT || 5000)
start()


