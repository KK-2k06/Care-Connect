import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import SimplePage from './pages/SimplePage.jsx'
import ChatRoomPage from './pages/ChatRoomPage.jsx'
import ChatbotPage from './pages/ChatbotPage.jsx'
import BookingPage from './pages/BookingPage.jsx'
import ResourcesPage from './pages/ResourcesPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import TermsPage from './pages/TermsPage.jsx'
import SignupPage from './pages/SignupPage.jsx'

export default function App(){
  const RequireAuth = ({ children }) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if(!token){
      return <Navigate to="/login" replace />
    }
    return children
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RequireAuth><LandingPage /></RequireAuth>} />
        <Route path="/ai" element={<ChatbotPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/p2p" element={<ChatRoomPage />} />
        <Route path="/game" element={<SimplePage title="Game" />} />
        <Route path="/admin" element={<SimplePage title="Admin" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
