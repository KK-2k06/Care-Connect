import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, Mail, Phone, User, Sun, Moon, ArrowLeft } from 'lucide-react'

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

  const mentors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@campus.edu',
      specialization: 'Mental Health Counselor',
      experience: '8 years',
      photo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIyNCIgcj0iMTIiIGZpbGw9IiM2MzY2RjEiLz4KPHJlY3QgeD0iMTYiIHk9IjM4IiB3aWR0aD0iMzIiIGhlaWdodD0iMjQiIHJ4PSIxMiIgZmlsbD0iIzYzNjZGMiIvPgo8L3N2Zz4K',
      availableSlots: [
        { time: '9:00 AM', date: 'Today', available: true },
        { time: '11:00 AM', date: 'Today', available: true },
        { time: '2:00 PM', date: 'Today', available: false },
        { time: '4:00 PM', date: 'Today', available: true },
        { time: '10:00 AM', date: 'Tomorrow', available: true },
        { time: '1:00 PM', date: 'Tomorrow', available: true }
      ]
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      email: 'michael.chen@campus.edu',
      specialization: 'Academic Stress Counselor',
      experience: '6 years',
      photo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIyNCIgcj0iMTIiIGZpbGw9IiM2MzY2RjEiLz4KPHJlY3QgeD0iMTYiIHk9IjM4IiB3aWR0aD0iMzIiIGhlaWdodD0iMjQiIHJ4PSIxMiIgZmlsbD0iIzYzNjZGMiIvPgo8L3N2Zz4K',
      availableSlots: [
        { time: '8:00 AM', date: 'Today', available: false },
        { time: '10:30 AM', date: 'Today', available: true },
        { time: '1:30 PM', date: 'Today', available: true },
        { time: '3:30 PM', date: 'Today', available: false },
        { time: '9:00 AM', date: 'Tomorrow', available: true },
        { time: '2:00 PM', date: 'Tomorrow', available: true }
      ]
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@campus.edu',
      specialization: 'Peer Support Specialist',
      experience: '5 years',
      photo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIyNCIgcj0iMTIiIGZpbGw9IiM2MzY2RjEiLz4KPHJlY3QgeD0iMTYiIHk9IjM4IiB3aWR0aD0iMzIiIGhlaWdodD0iMjQiIHJ4PSIxMiIgZmlsbD0iIzYzNjZGMiIvPgo8L3N2Zz4K',
      availableSlots: [
        { time: '9:30 AM', date: 'Today', available: true },
        { time: '12:00 PM', date: 'Today', available: true },
        { time: '2:30 PM', date: 'Today', available: true },
        { time: '5:00 PM', date: 'Today', available: false },
        { time: '11:00 AM', date: 'Tomorrow', available: true },
        { time: '3:00 PM', date: 'Tomorrow', available: true }
      ]
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      email: 'james.wilson@campus.edu',
      specialization: 'Crisis Intervention Specialist',
      experience: '10 years',
      photo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIyNCIgcj0iMTIiIGZpbGw9IiM2MzY2RjEiLz4KPHJlY3QgeD0iMTYiIHk9IjM4IiB3aWR0aD0iMzIiIGhlaWdodD0iMjQiIHJ4PSIxMiIgZmlsbD0iIzYzNjZGMiIvPgo8L3N2Zz4K',
      availableSlots: [
        { time: '8:30 AM', date: 'Today', available: true },
        { time: '11:30 AM', date: 'Today', available: false },
        { time: '1:00 PM', date: 'Today', available: true },
        { time: '4:30 PM', date: 'Today', available: true },
        { time: '10:30 AM', date: 'Tomorrow', available: true },
        { time: '1:30 PM', date: 'Tomorrow', available: true }
      ]
    }
  ]

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

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
    setFormData(prev => ({
      ...prev,
      time: `${timeSlot.date} - ${timeSlot.time}`
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Booking submitted:', formData)
    alert('Booking request submitted successfully! You will receive a confirmation email shortly.')
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      mentorName: '',
      time: ''
    })
    setSelectedMentor(null)
  }

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-lg font-semibold">Care Connect</span>
            </Link>
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

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
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
                disabled={!formData.name || !formData.email || !formData.phone || !formData.mentorName || !formData.time}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="h-5 w-5" />
                Book Session
              </button>
            </form>
          </div>
        </div>

        {/* Right Side - Mentor Details */}
        <div className="w-1/2 bg-slate-50 dark:bg-slate-900 p-6 overflow-y-auto">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
            Available Mentors
          </h3>
          
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
                      className="w-22 h-22 rounded-full object-cover"
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
                        {mentor.availableSlots.map((slot, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (slot.available) {
                                handleTimeSelect(slot)
                              }
                            }}
                            disabled={!slot.available}
                            className={`text-xs px-2 py-1 rounded border transition-colors ${
                              slot.available
                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-800'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-600 cursor-not-allowed'
                            }`}
                          >
                            {slot.date} - {slot.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
