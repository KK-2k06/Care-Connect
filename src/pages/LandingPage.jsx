import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, Sun, Moon } from 'lucide-react';

// Import images (assuming paths are correct)
import aiImage from '../images/ai.png';
import bookingImage from '../images/booking.png';
import resourcesImage from '../images/resources.png';
import p2pImage from '../images/p2p.png';
import gamesImage from '../images/games.png';

// Data remains the same
const features = [
  { 
    title: 'AI', 
    desc: 'AI Bot: Your Mental Wellness Companion', 
    href: '/ai',
    image: aiImage,
  },
  { 
    title: 'Confidential Booking', 
    desc: 'Your Private Path to Professional Support', 
    href: '/booking',
    image: bookingImage,
  },
  { 
    title: 'Resources', 
    desc: 'Psychoeducational Hub for Knowledge', 
    href: '/resources',
    image: resourcesImage,
  },
  { 
    title: 'P2P Support', 
    desc: 'Connect, Share, and Grow Anonymously', 
    href: '/p2p',
    image: p2pImage,
  },
  { 
    title: 'Calming Games', 
    desc: 'Quick activities for a mental reset.', 
    href: '/game',
    image: gamesImage,
  },
];

const news = [
  { t: 'Gratitude journals improve student wellbeing', u: 'https://www.apa.org/monitor/2021/01/ce-corner-gratitude' },
  { t: 'Peer support reduces loneliness by 22%', u: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9472326/' },
  { t: 'Two‑minute breathing lowers exam stress', u: 'https://www.health.harvard.edu/mind-and-mood/relaxation-techniques-breath-control-helps-quell-errant-stress-response' },
  { t: 'Volunteering links to higher life satisfaction', u: 'https://www.ox.ac.uk/news/2019-08-23-volunteering-linked-better-health-and-wellbeing' },
];

// NEW: A dedicated FeatureCard component for the grid layout.
// It's much simpler and doesn't need long descriptions or complex animations.
function FeatureCard({ feature, index }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(feature.href)}
      className="group cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
      style={{ animationDelay: `${index * 100}ms` }} // Staggered animation delay
    >
      <div className="aspect-video w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
        <img 
          src={feature.image} 
          alt={`${feature.title} illustration`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h3 className="mt-4 font-bold text-xl text-blue-700 dark:text-blue-400">
        {feature.title}
      </h3>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        {feature.desc}
      </p>
    </div>
  );
}


export default function LandingPage() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  
  const tickerItems = useMemo(() => [...news, ...news], []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const onShare = async () => {
    const data = { title: 'Care Connect', text: 'Supportive chat, confidential booking, resources, and peer room.', url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(data.url); alert('Link copied to clipboard!'); }
    } catch (e) { console.warn(e); }
  };

  const onLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch {}
    navigate('/login');
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* The header remains the same, it's perfect as is. */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ease-out backdrop-blur-sm bg-white/60 dark:bg-slate-900/60
          ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-4">
            <div className="flex gap-2">
              <button onClick={onLogout} className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm text-sm font-medium">Logout</button>
              <button onClick={onShare} aria-label="Share" title="Share" className="h-10 w-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm flex items-center justify-center"><Share2 className="h-5 w-5 text-slate-700 dark:text-slate-200" /></button>
            </div>
            <h1 className="text-center font-extrabold text-[clamp(24px,3.2vw,34px)] tracking-tight">Care Connect</h1>
            <div className="flex justify-end">
              <button aria-label="Toggle theme" title="Toggle theme" onClick={() => setDark(v => !v)} className="h-10 w-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm flex items-center justify-center">
                {dark ? <Sun className="h-5 w-5 text-slate-700 dark:text-slate-200" /> : <Moon className="h-5 w-5 text-slate-700 dark:text-slate-200" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CHANGED: The main container. 
          - No longer uses scroll-snap.
          - Uses flexbox to center content vertically and horizontally within the viewport.
          - `min-h-screen` ensures it takes up at least the full screen height.
          - `pt-24` and `pb-8` add padding to avoid content being hidden by the fixed header and to give space at the bottom.
      */}
      <main className="min-h-screen flex flex-col items-center justify-center p-4 pt-24 pb-8">
        
        {/* NEW: Grid container for the feature cards.
            - `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` makes the layout responsive.
            - `gap-8` adds space between cards.
            - `max-w-6xl` constrains the width on large screens for better readability.
        */}
        <div className={`w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-700 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {features.map((f, index) => (
            <FeatureCard key={f.title} feature={f} index={index} />
          ))}
        </div>
        
        {/* CHANGED: Ticker and Footer are now at the bottom of the page, always visible. */}
        <div className={`w-full max-w-6xl mt-16 transition-opacity duration-700 delay-300 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <h2 className="text-xl font-bold text-center mb-4">Latest in Care Connect</h2>
            <div className="overflow-hidden border-y border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/40 py-3 group">
              <div className="flex gap-8 animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap">
                {tickerItems.map((i, idx) => (
                  <span key={idx} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 shadow-sm">
                    <a className="hover:underline text-sm" href={i.u} target="_blank" rel="noreferrer noopener">{i.t}</a>
                  </span>
                ))}
              </div>
            </div>
          
          <footer className="w-full pt-4">
            <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
              <div>© {new Date().getFullYear()} Campus Wellbeing. All rights reserved.</div>
              <div aria-hidden>Not a substitute for professional care.</div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}