import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, Mail, Phone, User, Sun, Moon, ArrowLeft, Loader2, List, Menu, X } from 'lucide-react'

// Helper function for status styles
function getStatusStyles(status) {
  return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-800';
}

// Helper function to get current IST time
function getCurrentIST() {
  const now = new Date();
  // IST is UTC+5:30
  const istOffset = 5.5 * 60; // 5 hours 30 minutes in minutes
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (istOffset * 60000));
}

// Helper function to parse date strings like "today", "tomorrow", or actual dates
function parseDateString(dateString) {
  const currentIST = getCurrentIST();
  
  if (dateString.toLowerCase() === 'today') {
    return new Date(currentIST.getFullYear(), currentIST.getMonth(), currentIST.getDate());
  } else if (dateString.toLowerCase() === 'tomorrow') {
    const tomorrow = new Date(currentIST);
    tomorrow.setDate(currentIST.getDate() + 1);
    return new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
  } else {
    // Try to parse as regular date
    const parsed = new Date(dateString);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
    return null;
  }
}

// Helper function to parse time string and combine with date
function parseDateTime(dateString, timeString) {
  const date = parseDateString(dateString);
  if (!date) return null;
  
  // Parse time string (assuming format like "10:00 AM" or "14:30")
  const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i;
  const match = timeString.match(timeRegex);
  
  if (!match) return null;
  
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const isPM = match[3]?.toLowerCase() === 'pm';
  
  // Convert to 24-hour format if needed
  if (match[3]) { // If AM/PM is specified
    if (isPM && hours !== 12) {
      hours += 12;
    } else if (!isPM && hours === 12) {
      hours = 0;
    }
  }
  
  // Create datetime object
  const datetime = new Date(date);
  datetime.setHours(hours, minutes, 0, 0);
  
  return datetime;
}

// Helper function to check if a time slot is in the past
function isTimeSlotInPast(dateString, timeString) {
  if (!dateString || !timeString) return true;
  
  const slotDateTime = parseDateTime(dateString, timeString);
  if (!slotDateTime) return true;
  
  const currentIST = getCurrentIST();
  
  // Debug logging
  console.log('Checking time slot:', dateString, timeString);
  console.log('Parsed slot datetime:', slotDateTime);
  console.log('Current IST:', currentIST);
  console.log('Is past:', slotDateTime < currentIST);
  
  return slotDateTime < currentIST;
}

// Helper function to check if a time slot is available (not in past and not already booked)
function isTimeSlotAvailable(slot) {
  if (!slot.available) return false;
  
  // Check if slot is in the past
  if (isTimeSlotInPast(slot.date, slot.time)) {
    return false;
  }
  
  return true;
}

// Helper function to validate and format date for display
function formatBookingDate(dateString) {
  if (!dateString) return 'No date specified';
  
  // Handle the combined format "date - time" that might be stored
  if (dateString.includes(' - ')) {
    const [datePart, timePart] = dateString.split(' - ');
    const datetime = parseDateTime(datePart, timePart);
    
    if (!datetime) return 'Invalid date format';
    
    const currentIST = getCurrentIST();
    if (datetime < currentIST) {
      return `Past session - ${datetime.toLocaleString('en-IN', { 
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    }
    
    return datetime.toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Try to parse as a regular date
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date format';
  }
  
  // Check if date is in the past (using IST)
  const nowIST = getCurrentIST();
  if (date < nowIST) {
    return `Past session - ${date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;
  }
  
  // Return formatted date for future sessions (in IST)
  return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

export default function BookingPage() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    mentorName: '',
    time: ''
  })

  const [selectedMentor, setSelectedMentor] = useState(null)
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' })
  
  // State for user bookings
  const [bookings, setBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  
  // State for sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  // Fetch mentors from backend
  useEffect(() => {
    fetchMentors()
  }, [])
  
  // Fetch user bookings when email changes
  useEffect(() => {
    if (formData.email) {
      fetchUserBookings(formData.email)
    }
  }, [formData.email])

  const fetchMentors = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/booking/mentors')
      const data = await response.json()
      
      if (data.success) {
        console.log('Fetched mentors from backend:', data.data)
        const mentorsWithPhotos = data.data.map((mentor, index) => ({
          ...mentor,
          id: mentor._id,
          photo: `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIyNCIgcj0iMTIiIGZpbGw9IiM2MzY2RjEiLz4KPHJlY3QgeD0iMTYiIHk9IjM4IiB3aWR0aD0iMzIiIGhlaWdodD0iMjQiIHJ4PSIxMiIgZmlsbD0iIzYzNjZGMSIvPgo8L3N2Zz4K`
        }))
        setMentors(mentorsWithPhotos)
      } else {
        showNotification('Failed to load mentors', 'error')
      }
    } catch (error) {
      console.error('Error fetching mentors:', error)
      showNotification('Failed to load mentors', 'error')
    } finally {
      setLoading(false)
    }
  }
  
  const fetchUserBookings = async (email) => {
    if (!email) return
    
    setLoadingBookings(true)
    try {
      const response = await fetch(`http://localhost:5000/api/booking?studentEmail=${encodeURIComponent(email)}`)
      const data = await response.json()
      
      if (data.success) {
        console.log('Fetched user bookings:', data.data)
        setBookings(data.data)
      } else {
        console.error('Failed to load bookings:', data.message)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoadingBookings(false)
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' })
    }, 5000)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleMentorSelect = (mentor) => {
    setSelectedMentor(mentor)
    setFormData(prev => ({
      ...prev,
      mentorName: mentor.name
    }))
  }

  const handleTimeSelect = (timeSlot) => {
    // Check if the time slot is available (not in past and not already booked)
    if (!isTimeSlotAvailable(timeSlot)) {
      if (isTimeSlotInPast(timeSlot.date, timeSlot.time)) {
        showNotification('Cannot book past time slots. Please select a future time.', 'error')
      } else {
        showNotification('This time slot is not available. Please select another time.', 'error')
      }
      return
    }
    
    setFormData(prev => ({
      ...prev,
      time: `${timeSlot.date} - ${timeSlot.time}`
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const bookingData = {
        studentName: formData.name,
        studentEmail: formData.email,
        studentPhone: formData.phone,
        mentorName: formData.mentorName,
        mentorEmail: selectedMentor.email,
        meetingTime: formData.time
      }

      const response = await fetch('http://localhost:5000/api/booking/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      })

      const data = await response.json()

      if (data.success) {
        showNotification(
          `Booking confirmed! Your booking ID is ${data.data.bookingId}. Confirmation emails have been sent to you and your mentor.`,
          'success'
        )
        
        // Fetch updated bookings after successful submission
        fetchUserBookings(formData.email)
        
        // Reset form but keep email and name for convenience
        setFormData({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          mentorName: '',
          time: ''
        })
        setSelectedMentor(null)
        
        // Refresh mentors to update availability
        fetchMentors()
      } else {
        showNotification(data.message || 'Failed to create booking', 'error')
      }
    } catch (error) {
      console.error('Error submitting booking:', error)
      showNotification('Network error. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredBookings = bookings;
  
  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-900 flex flex-col overflow-hidden">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
          notification.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700 dark:bg-green-900 dark:border-green-600 dark:text-green-200'
            : 'bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-600 dark:text-red-200'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle bookings menu"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link to="/" className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-lg font-semibold">Care Connect</span>
            </Link>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Total Bookings ({bookings.length})
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">Confidential Booking</h1>
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Toggle theme"
            >
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar for Bookings */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <List className="h-5 w-5" />
                Your Bookings
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

          {/* Bookings Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {formData.email ? (
              <>
                {loadingBookings ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
                    <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">Loading your bookings...</span>
                  </div>
                ) : filteredBookings.length > 0 ? (
                  <div className="space-y-3">
                    {filteredBookings.map((booking) => (
                      <div key={booking._id} className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-3 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{booking.mentorName}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusStyles()}`}>
                            Booked
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {formatBookingDate(booking.time)}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                          <Mail className="h-3 w-3 inline mr-1" />
                          {booking.mentorEmail}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          Booked on {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-600 dark:text-slate-400">No bookings found</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-400">Please enter your email in the booking form to view your bookings</p>
              </div>
            )}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          {/* Left Side - Booking Form */}
          <div className="w-1/2 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-6 overflow-y-auto">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                Book your session
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <User className="h-4 w-4 inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Selected Mentor */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Selected Mentor
                  </label>
                  <input
                    type="text"
                    value={formData.mentorName}
                    readOnly
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-600 text-slate-800 dark:text-slate-200"
                    placeholder="Select a mentor from the right panel"
                  />
                </div>

                {/* Selected Time */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <Clock className="h-4 w-4 inline mr-2" />
                    Selected Time Slot
                  </label>
                  <input
                    type="text"
                    value={formData.time}
                    readOnly
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-600 text-slate-800 dark:text-slate-200"
                    placeholder="Select a time slot from the mentor's availability"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!formData.name || !formData.email || !formData.phone || !formData.mentorName || !formData.time || submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <Calendar className="h-5 w-5" />
                      Book Session
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Side - Mentor Details */}
          <div className="w-1/2 bg-slate-50 dark:bg-slate-900 p-6 overflow-y-auto">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
              Available Mentors
            </h3>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-slate-600 dark:text-slate-400">Loading mentors...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {mentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className={`bg-white dark:bg-slate-800 rounded-lg border p-4 cursor-pointer transition-all ${
                    selectedMentor?.id === mentor.id
                      ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                      : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
                  onClick={() => handleMentorSelect(mentor)}
                >
                  <div className="flex gap-4">
                    {/* Mentor Photo */}
                    <div className="flex-shrink-0">
                      <img
                        src={mentor.photo}
                        alt={mentor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </div>

                    {/* Mentor Details */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-lg">
                        {mentor.name}
                      </h4>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                        {mentor.specialization}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        Experience: {mentor.experience}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        <Mail className="h-3 w-3 inline mr-1" />
                        {mentor.email}
                      </p>

                      {/* Available Time Slots */}
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Available Time Slots:
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {mentor.availableSlots.map((slot, index) => {
                            const isPast = isTimeSlotInPast(slot.date, slot.time)
                            const isAvailable = isTimeSlotAvailable(slot)
                            const isToday = slot.date.toLowerCase() === 'today'
                            const isTomorrow = slot.date.toLowerCase() === 'tomorrow'
                            
                            return (
                              <button
                                key={index}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (isAvailable) {
                                    handleTimeSelect(slot)
                                  }
                                }}
                                disabled={!isAvailable}
                                className={`text-xs px-2 py-1 rounded border transition-colors ${
                                  isAvailable
                                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-800'
                                    : isPast
                                    ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 cursor-not-allowed'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-600 cursor-not-allowed'
                                }`}
                                title={
                                  isPast 
                                    ? 'This time slot has passed' 
                                    : !slot.available 
                                    ? 'This time slot is not available' 
                                    : isToday 
                                    ? 'Today - Click to select'
                                    : isTomorrow
                                    ? 'Tomorrow - Click to select'
                                    : 'Click to select'
                                }
                              >
                                {slot.date} - {slot.time}
                                {isPast && ' (Past)'}
                                {isToday && !isPast && ' ✓'}
                                {isTomorrow && ' ✓'}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}