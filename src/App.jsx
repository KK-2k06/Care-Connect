import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import SimplePage from './pages/SimplePage.jsx'
import ChatbotPage from './pages/ChatbotPage.jsx'
import BookingPage from './pages/BookingPage.jsx'
import ResourcesPage from './pages/ResourcesPage.jsx'

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ai" element={<ChatbotPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/p2p" element={<SimplePage title="P2P" />} />
        <Route path="/game" element={<SimplePage title="Game" />} />
        <Route path="/admin" element={<SimplePage title="Admin" />} />
      </Routes>
    </BrowserRouter>
  )
}
