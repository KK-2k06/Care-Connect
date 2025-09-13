import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Share2, Sun, Moon } from 'lucide-react'

const features = [
  { title: 'AI', desc: 'Detector routes crisis to safe script; non‑crisis enables supportive chat.', href: '/ai' },
  { title: 'Confidential Booking', desc: 'View availability and book — no reason required.', href: '/booking' },
  { title: 'Resources', desc: 'Curated videos and guides across regional languages.', href: '/resources' },
  { title: 'P2P', desc: 'Join an anonymous room to share and listen respectfully.', href: '/p2p' },
  { title: 'Game', desc: 'Short, calming activities for quick resets.', href: '/game' },
  { title: 'Admin', desc: 'View trends, bookings, and flagged messages.', href: '/admin' },
]

const news = [
  { t: 'Gratitude journals improve student wellbeing', u: 'https://www.apa.org/monitor/2021/01/ce-corner-gratitude' },
  { t: 'Peer support reduces loneliness by 22%', u: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9472326/' },
  { t: 'Two‑minute breathing lowers exam stress', u: 'https://www.health.harvard.edu/mind-and-mood/relaxation-techniques-breath-control-helps-quell-errant-stress-response' },
  { t: 'Volunteering links to higher life satisfaction', u: 'https://www.ox.ac.uk/news/2019-08-23-volunteering-linked-better-health-and-wellbeing' },
]

export default function LandingPage(){
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const tickerItems = useMemo(() => [...news, ...news], [])

  const onShare = async () => {
    const data = { title: 'Care Connect', text: 'Supportive chat, confidential booking, resources, and peer room.', url: window.location.href }
    try {
      if (navigator.share) await navigator.share(data)
      else { await navigator.clipboard.writeText(data.url); alert('Link copied to clipboard!') }
    } catch (e) { console.warn(e) }
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 text-slate-900 dark:text-slate-100">
      {/* Top bar */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-4">
        <div className="flex gap-2">
          <button onClick={onShare} aria-label="Share" title="Share" className="h-10 w-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm flex items-center justify-center"><Share2 className="h-5 w-5 text-slate-700 dark:text-slate-200" /></button>
        </div>
        <h1 className="text-center font-extrabold text-[clamp(24px,3.2vw,34px)] tracking-tight">Care Connect</h1>
        <div className="flex justify-end">
          <button aria-label="Toggle theme" title="Toggle theme" onClick={() => setDark(v => !v)} className="h-10 w-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm flex items-center justify-center">
            {dark ? <Sun className="h-5 w-5 text-slate-700 dark:text-slate-200" /> : <Moon className="h-5 w-5 text-slate-700 dark:text-slate-200" />}
          </button>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid gap-5 my-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(f => (
          <Link key={f.title} to={f.href} className="relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 hover:-translate-y-1 transition shadow-sm hover:shadow-md group min-h-[140px] p-5 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <div className="flex items-center gap-3">
              <span className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
                {/* Icon container; simple emoji placeholders for now */}
                <span aria-hidden>{f.title === 'AI' ? '🤖' : f.title === 'Confidential Booking' ? '🗓️' : f.title === 'Resources' ? '📚' : f.title === 'P2P' ? '👥' : f.title === 'Game' ? '🎮' : '⚙️'}</span>
              </span>
              <div className="font-semibold text-lg transform transition group-hover:-translate-y-1 group-focus:-translate-y-1 text-blue-700 dark:text-blue-400">{f.title}</div>
            </div>
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300 opacity-0 translate-y-2 transition group-hover:opacity-100 group-hover:translate-y-0 group-focus:opacity-100 group-focus:translate-y-0 max-w-prose">{f.desc}</div>
            <div className="absolute right-4 bottom-4 text-sm text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 group-focus:opacity-100">Open →</div>
          </Link>
        ))}
      </div>

      {/* Ticker */}
      <div className="border-y border-slate-200 dark:border-slate-800 mt-8 bg-slate-50/60 dark:bg-slate-900/40">
        <div className="flex gap-8 py-3 whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
          {tickerItems.map((i, idx) => (
            <span key={idx} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 shadow-sm">
              <a className="hover:underline" href={i.u} target="_blank" rel="noreferrer noopener">{i.t}</a>
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="flex justify-between items-center gap-3 text-sm text-slate-600 dark:text-slate-400 py-5">
        <div>© {new Date().getFullYear()} Campus Wellbeing. All rights reserved.</div>
        <div aria-hidden>Not a substitute for professional care.</div>
      </footer>
    </div>
  )
}
