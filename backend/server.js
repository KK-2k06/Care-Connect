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
    origin: "http://localhost:5173",
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
app.get('/api/protected', requireAuth, (req, res) => {
  res.json({ ok: true, userId: req.user.id, role: req.user.role })
})

// WebSocket connection handling
const connectedUsers = new Map()
const communityRoom = 'community-chat'

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  // Handle user joining the community chat
  socket.on('join-community', (userData) => {
    const { username, userId } = userData
    connectedUsers.set(socket.id, { username, userId, socketId: socket.id })
    
    socket.join(communityRoom)
    
    // Notify all users in the room about the new user
    io.to(communityRoom).emit('user-joined', {
      username,
      userId,
      activeUsers: Array.from(connectedUsers.values())
    })
    
    console.log(`${username} joined the community chat`)
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
      
      // Broadcast message to all users in the community room
      io.to(communityRoom).emit('new-message', message)
    }
  })

  // Handle user disconnection
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id)
    if (user) {
      connectedUsers.delete(socket.id)
      
      // Notify remaining users about the user leaving
      io.to(communityRoom).emit('user-left', {
        username: user.username,
        userId: user.userId,
        activeUsers: Array.from(connectedUsers.values())
      })
      
      console.log(`${user.username} left the community chat`)
    }
  })
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
    server.listen(PORT, () => console.log(`Server running on ${PORT}`))
  }catch(err){
    console.error('Startup error:', err.message)
    process.exit(1)
  }
}

start()


