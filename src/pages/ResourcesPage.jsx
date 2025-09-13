import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Sun, Moon, ArrowLeft, Play, Globe, BookOpen } from 'lucide-react'

export default function ResourcesPage() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('English')

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', flag: '🇮🇳' }
  ]

  const videoResources = {
    English: [
      {
        id: 1,
        title: 'Understanding Anxiety and Stress',
        description: 'Learn about the causes of anxiety and effective stress management techniques for students.',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '12:34',
        category: 'Mental Health'
      },
      {
        id: 2,
        title: 'Building Healthy Relationships',
        description: 'Guidance on developing meaningful connections and maintaining healthy friendships.',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '15:22',
        category: 'Social Skills'
      },
      {
        id: 3,
        title: 'Academic Success Strategies',
        description: 'Proven study techniques and time management skills for better academic performance.',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '18:45',
        category: 'Academic Support'
      },
      {
        id: 4,
        title: 'Coping with Exam Pressure',
        description: 'Practical tips to manage exam anxiety and perform your best under pressure.',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '14:12',
        category: 'Mental Health'
      },
      {
        id: 5,
        title: 'Digital Wellness and Screen Time',
        description: 'Balancing technology use and maintaining healthy digital habits for students.',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '16:30',
        category: 'Wellness'
      },
      {
        id: 6,
        title: 'Financial Literacy for Students',
        description: 'Essential money management skills and budgeting tips for college students.',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '20:15',
        category: 'Life Skills'
      }
    ],
    Hindi: [
      {
        id: 1,
        title: 'चिंता और तनाव को समझना',
        description: 'चिंता के कारणों और छात्रों के लिए प्रभावी तनाव प्रबंधन तकनीकों के बारे में जानें।',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '12:34',
        category: 'मानसिक स्वास्थ्य'
      },
      {
        id: 2,
        title: 'स्वस्थ रिश्ते बनाना',
        description: 'सार्थक संबंध विकसित करने और स्वस्थ मित्रता बनाए रखने के लिए मार्गदर्शन।',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '15:22',
        category: 'सामाजिक कौशल'
      },
      {
        id: 3,
        title: 'शैक्षणिक सफलता की रणनीतियाँ',
        description: 'बेहतर शैक्षणिक प्रदर्शन के लिए सिद्ध अध्ययन तकनीक और समय प्रबंधन कौशल।',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '18:45',
        category: 'शैक्षणिक सहायता'
      }
    ],
    Tamil: [
      {
        id: 1,
        title: 'கவலை மற்றும் மன அழுத்தத்தை புரிந்துகொள்ளுதல்',
        description: 'கவலையின் காரணங்கள் மற்றும் மாணவர்களுக்கான பயனுள்ள மன அழுத்த மேலாண்மை நுட்பங்களைப் பற்றி அறிக.',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '12:34',
        category: 'மன ஆரோக்கியம்'
      },
      {
        id: 2,
        title: 'ஆரோக்கியமான உறவுகளை உருவாக்குதல்',
        description: 'அர்த்தமுள்ள இணைப்புகளை வளர்ப்பதற்கும் ஆரோக்கியமான நட்பை பராமரிப்பதற்கும் வழிகாட்டுதல்.',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '15:22',
        category: 'சமூக திறன்கள்'
      },
      {
        id: 3,
        title: 'கல்வி வெற்றி உத்திகள்',
        description: 'சிறந்த கல்வி செயல்திறனுக்கான நிரூபிக்கப்பட்ட படிப்பு நுட்பங்கள் மற்றும் நேர மேலாண்மை திறன்கள்.',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '18:45',
        category: 'கல்வி ஆதரவு'
      }
    ]
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const handleVideoClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language)
    setSidebarOpen(false)
  }

  const currentVideos = videoResources[selectedLanguage] || videoResources.English

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link to="/" className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-lg font-semibold">Care Connect</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">Resources</h1>
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

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Language Selection */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-transform duration-300 ease-in-out`}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Languages
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Language List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageSelect(language.name)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      selectedLanguage === language.name
                        ? 'bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200'
                        : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600'
                    }`}
                  >
                    <span className="text-2xl">{language.flag}</span>
                    <span className="font-medium">{language.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 text-center">
                Currently viewing: <span className="font-medium">{selectedLanguage}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for all screen sizes */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Content Header */}
          <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <BookOpen className="h-6 w-6" />
                  Educational Resources
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Curated videos and guides in {selectedLanguage}
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  {selectedLanguage}
                </span>
              </div>
            </div>
          </div>

          {/* Video Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => handleVideoClick(video.url)}
                >
                  {/* Video Thumbnail */}
                  <div className="relative aspect-video bg-slate-200 dark:bg-slate-700">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <div className="bg-white bg-opacity-90 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Play className="h-6 w-6 text-slate-800" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      {video.category}
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-lg mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                      {video.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {currentVideos.length === 0 && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <BookOpen className="h-16 w-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
                    No videos available
                  </h3>
                  <p className="text-slate-500 dark:text-slate-500">
                    Videos in {selectedLanguage} are coming soon!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
