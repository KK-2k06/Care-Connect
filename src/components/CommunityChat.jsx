import React, { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { Send, Users, MessageCircle } from 'lucide-react'

const CommunityChat = () => {
  const [socket, setSocket] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [activeUsers, setActiveUsers] = useState([])
  const [username, setUsername] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [showUsernameModal, setShowUsernameModal] = useState(true)
  const [connectionAttempts, setConnectionAttempts] = useState(0)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize socket connection with better configuration
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    })
    setSocket(newSocket)

    // Handle connection events
    newSocket.on('connect', () => {
      setIsConnected(true)
      console.log('✅ Connected to server with ID:', newSocket.id)
    })

    newSocket.on('disconnect', (reason) => {
      setIsConnected(false)
      console.log('❌ Disconnected from server:', reason)
    })

    newSocket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error)
      setIsConnected(false)
      setConnectionAttempts(prev => prev + 1)
      
      // Retry connection after 3 seconds
      if (connectionAttempts < 3) {
        setTimeout(() => {
          console.log('🔄 Retrying connection...')
          newSocket.connect()
        }, 3000)
      }
    })

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnected after', attemptNumber, 'attempts')
      setIsConnected(true)
    })

    newSocket.on('reconnect_error', (error) => {
      console.error('❌ Reconnection error:', error)
    })

    // Handle incoming messages
    newSocket.on('new-message', (message) => {
      setMessages(prev => [...prev, message])
    })

    // Handle user join/leave events
    newSocket.on('user-joined', (data) => {
      setActiveUsers(data.activeUsers)
      setMessages(prev => [...prev, {
        id: `system-${Date.now()}`,
        type: 'system',
        text: `${data.username} joined the chat`,
        timestamp: new Date().toISOString()
      }])
    })

    newSocket.on('user-left', (data) => {
      setActiveUsers(data.activeUsers)
      setMessages(prev => [...prev, {
        id: `system-${Date.now()}`,
        type: 'system',
        text: `${data.username} left the chat`,
        timestamp: new Date().toISOString()
      }])
    })

    return () => {
      newSocket.close()
    }
  }, [])

  const handleJoinChat = () => {
    if (username.trim() && socket) {
      console.log('🚀 Attempting to join community with username:', username.trim())
      socket.emit('join-community', {
        username: username.trim(),
        userId: Date.now() // Simple user ID for demo
      })
      setShowUsernameModal(false)
    } else {
      console.error('❌ Cannot join: socket not connected or username empty')
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim() && socket) {
      console.log('Sending message:', newMessage.trim())
      socket.emit('send-message', {
        text: newMessage.trim()
      })
      setNewMessage('')
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Username Modal */}
      {showUsernameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Join Community Chat
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Enter a username to join the community support chat. You can use any name you're comfortable with.
            </p>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleJoinChat()}
            />
            <button
              onClick={handleJoinChat}
              disabled={!username.trim()}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Join Chat
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Community Support Chat
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Connect with others in a supportive environment
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Active Users Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  Active Users ({activeUsers.length})
                </h3>
              </div>
              <div className="space-y-2">
                {activeUsers.map((user, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {user.username}
                    </span>
                  </div>
                ))}
                {activeUsers.length === 0 && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                    No active users
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg flex flex-col h-[600px]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'system' ? 'justify-center' : 'justify-start'}`}>
                    {message.type === 'system' ? (
                      <div className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full text-sm">
                        {message.text}
                      </div>
                    ) : (
                      <div className="max-w-xs lg:max-w-md">
                        <div className="bg-blue-100 dark:bg-blue-900 text-slate-900 dark:text-slate-100 p-3 rounded-lg">
                          <div className="font-medium text-sm text-blue-600 dark:text-blue-400 mb-1">
                            {message.username}
                          </div>
                          <div className="text-sm">{message.text}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t border-slate-200 dark:border-slate-700 p-4">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!isConnected}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || !isConnected}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white p-3 rounded-lg transition-colors"
                  >
                    <Send className="h-5 w-5" />
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

export default CommunityChat
