import React, { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

export default function ChatRoomPage() {
  const [socket, setSocket] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [activeUsers, setActiveUsers] = useState(0)
  const [userName, setUserName] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [typingUsers, setTypingUsers] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [currentRoom, setCurrentRoom] = useState('general')
  
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  const socketRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
      autoConnect: true
    })
    
    socketRef.current = newSocket
    setSocket(newSocket)

    // Connection events
    newSocket.on('connect', () => {
      console.log('Connected to server')
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server')
      setIsConnected(false)
    })

    // Chat events
    newSocket.on('welcome', (data) => {
      setUserName(data.yourName)
      setMessages(prev => [...prev, {
        id: 'welcome',
        user: 'System',
        message: data.message,
        timestamp: new Date().toISOString(),
        isSystem: true
      }])
    })

    newSocket.on('userJoined', (data) => {
      setMessages(prev => [...prev, {
        id: Date.now() + Math.random(),
        user: 'System',
        message: data.message,
        timestamp: new Date().toISOString(),
        isSystem: true
      }])
    })

    newSocket.on('userLeft', (data) => {
      setMessages(prev => [...prev, {
        id: Date.now() + Math.random(),
        user: 'System',
        message: data.message,
        timestamp: new Date().toISOString(),
        isSystem: true
      }])
    })

    newSocket.on('newMessage', (messageData) => {
      setMessages(prev => [...prev, {
        ...messageData,
        isSystem: false
      }])
    })

    newSocket.on('userCount', (count) => {
      setActiveUsers(count)
    })

    newSocket.on('userTyping', (data) => {
      if (data.user !== userName) {
        setTypingUsers(prev => {
          if (data.isTyping) {
            return [...prev.filter(user => user !== data.user), data.user]
          } else {
            return prev.filter(user => user !== data.user)
          }
        })
      }
    })

    newSocket.on('roomChanged', (data) => {
      setCurrentRoom(data.room)
      setMessages(prev => [...prev, {
        id: Date.now() + Math.random(),
        user: 'System',
        message: data.message,
        timestamp: new Date().toISOString(),
        isSystem: true
      }])
    })

    return () => {
      newSocket.close()
    }
  }, [])

  const sendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim() && socket) {
      socket.emit('chatMessage', { message: newMessage.trim() })
      setNewMessage('')
      
      // Stop typing indicator
      if (isTyping) {
        socket.emit('typing', { isTyping: false })
        setIsTyping(false)
      }
    }
  }

  const handleTyping = (e) => {
    setNewMessage(e.target.value)
    
    if (!isTyping) {
      setIsTyping(true)
      socket.emit('typing', { isTyping: true })
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        socket.emit('typing', { isTyping: false })
        setIsTyping(false)
      }
    }, 1000)
  }

  const joinRoom = (roomName) => {
    if (socket && roomName !== currentRoom) {
      socket.emit('joinRoom', roomName)
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                P2P Support Chat
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-2">
                Anonymous peer-to-peer support community
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
                {activeUsers} {activeUsers === 1 ? 'user' : 'users'} online
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Chat Rooms
              </h3>
              <div className="space-y-2">
                {['general', 'anxiety', 'depression', 'relationships', 'work', 'family'].map(room => (
                  <button
                    key={room}
                    onClick={() => joinRoom(room)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      currentRoom === room
                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    #{room}
                  </button>
                ))}
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  Your Identity
                </h4>
                <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3">
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    Anonymous Name:
                  </div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    {userName || 'Connecting...'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg flex flex-col h-[600px]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.user === userName ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isSystem
                          ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-center mx-auto'
                          : message.user === userName
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                      }`}
                    >
                      {!message.isSystem && message.user !== userName && (
                        <div className="text-xs font-medium mb-1 opacity-75">
                          {message.user}
                        </div>
                      )}
                      <div className="text-sm">{message.message}</div>
                      <div className="text-xs opacity-75 mt-1">
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing indicators */}
                {typingUsers.length > 0 && (
                  <div className="flex justify-start">
                    <div className="bg-slate-200 dark:bg-slate-700 px-4 py-2 rounded-lg">
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t border-slate-200 dark:border-slate-700 p-4">
                <form onSubmit={sendMessage} className="flex space-x-4">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleTyping}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
                    disabled={!isConnected}
                  />
                  <button
                    type="submit"
                    disabled={!isConnected || !newMessage.trim()}
                    className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
