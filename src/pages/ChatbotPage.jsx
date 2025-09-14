import React, { useState, useEffect, useRef } from 'react';
// Note: 'Link' from 'react-router-dom' was replaced with a standard 'a' tag 
// to allow this component to run as a standalone file without a router.
import { Menu, X, Send, Moon, Sun, MessageSquare, Clock, Settings, ArrowLeft } from 'lucide-react';

// Renamed to 'App' for standard single-file React app structure
export default function App() {
  const [dark, setDark] = useState(() => {
    // Check for saved theme preference in localStorage
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    // Otherwise, check for user's OS preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showSOS, setShowSOS] = useState(false); // State to control SOS visibility
  // Mock chat history data
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: "Today's Chat", preview: "Hello! I'm here to listen...", timestamp: new Date() },
    { id: 2, title: "Yesterday's Session", preview: "Thank you for sharing that with me...", timestamp: new Date(Date.now() - 86400000) },
    { id: 3, title: "Weekend Check-in", preview: "How was your weekend? I hope...", timestamp: new Date(Date.now() - 172800000) }
  ]);
  const messagesEndRef = useRef(null);

  // Effect to toggle dark mode class on the root element and save preference
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  // Effect to scroll to the latest message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to smoothly scroll the chat area to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to handle sending a new message
  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const userMessageText = inputMessage.trim().toLowerCase();
      const newMessage = {
        id: messages.length + 1,
        text: inputMessage,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      setInputMessage('');

      // --- Emergency Detection Logic ---
      const emergencyKeywords = ['kill myself', 'suicide', 'want to die', 'end my life', 'can\'t go on'];
      const isEmergency = emergencyKeywords.some(keyword => userMessageText.includes(keyword));

      if (isEmergency) {
        // If an emergency keyword is detected, show the SOS modal
        setShowSOS(true);
        // And send a supportive but direct message
        setTimeout(() => {
          const aiResponse = {
            id: messages.length + 2,
            text: "It sounds like you're going through a difficult time. Please know that help is available. I've displayed some emergency resources for you.",
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiResponse]);
        }, 500);
      } else {
        // Simulate a normal AI response after a short delay
        setTimeout(() => {
          const aiResponse = {
            id: messages.length + 2,
            text: "I understand. Thank you for sharing that with me. How can I help you feel better?",
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiResponse]);
        }, 1000);
      }
    }
  };

  // Function to handle Enter key press for sending messages
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Utility function to format timestamp into a readable time string
  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      {/* Header Section */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <a href="/" className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-lg font-semibold">Care Connect</span>
            </a>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for Chat History */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-transform duration-300 ease-in-out`}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Chat History
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Close sidebar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat History List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {chatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-sm">
                        {chat.title}
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0">
                        <Clock className="h-3 w-3" />
                        {formatTime(chat.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                      {chat.preview}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
                <Settings className="h-4 w-4" />
                Settings
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col relative">
          {/* --- SOS Emergency Modal --- */}
          {showSOS && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center border-4 border-red-500">
                <div className="flex justify-center mb-4">
                  <div className="bg-red-100 dark:bg-red-900/50 rounded-full p-3">
                    {/* Alert Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400 mb-2">SOS Emergency</h2>
                <p className="text-slate-700 dark:text-slate-300 mb-6">
                    You are in immediate danger, please use the number below to get help.
                </p>
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg mb-6">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">National Crisis and Suicide Lifeline</p>
                    <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-widest">988</p>
                </div>
                <div className="flex flex-col gap-4">
                     <a href="tel:988" className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white text-lg font-bold rounded-lg transition-colors">
                        Call Now
                    </a>
                    <button
                        onClick={() => setShowSOS(false)}
                        className="w-full px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg transition-colors"
                    >
                        Dismiss
                    </button>
                </div>
              </div>
            </div>
          )}

          {/* Messages Display Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {messages.length === 0 ? (
              /* Welcome Screen when no messages are present */
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">
                    Hear and Heal
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md">
                    I'm here to listen and help. Start a conversation by typing a message below.
                  </p>
                </div>
              </div>
            ) : (
              /* Chat Messages */
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-end gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className={`text-xs mt-1 text-right ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Message Input Section */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-800">
            <div className="flex items-end gap-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 resize-none rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={1}
                style={{ minHeight: '40px', maxHeight: '120px' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center h-10 w-10 shrink-0"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

