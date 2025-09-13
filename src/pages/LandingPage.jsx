import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, Sun, Moon } from 'lucide-react';

// Import images
import aiImage from '../images/ai.png';
import bookingImage from '../images/booking.png';
import resourcesImage from '../images/resources.png';
import p2pImage from '../images/p2p.png';
import gamesImage from '../images/games.png';

const features = [
  { 
    title: 'AI', 
    desc: 'AI Bot: Your Mental Wellness Companion', 
    href: '/ai',
    image: aiImage,
    longDesc: 'Our AI Bot is your ever-present, confidential mental wellness companion, offering instant, empathetic support 24/7. It\'s expertly trained to detect severe distress, immediately connecting you with critical, pre-vetted emergency resources through 100% safe, pre-written responses. For non-emergency situations like stress or anxiety, it engages in personalized, AI-driven conversations, providing tailored advice, practical coping mechanisms, and skill-building exercises. Your interactions are completely private, allowing you to use the bot for proactive check-ins, seamlessly integrating with other features and continuously improving to offer the most effective guidance for your mental health journey.'
  },
  { 
    title: 'Confidential Booking', 
    desc: 'Confidential Booking: Your Private Path to Support', 
    href: '/booking',
    image: bookingImage,
    longDesc: 'Experience unparalleled privacy and ease with our Confidential Booking system, designed to empower your mental health journey. With secure login and robust data protection, you can effortlessly view real-time availability of college counselors and book appointments in just a few clicks, without ever having to disclose your reasons. This intuitive platform allows you to flexibly select slots that fit your schedule, provides instant confirmation and reminders, and offers easy management of your bookings. It removes all barriers, connecting you directly with qualified professionals and giving you complete control over seeking professional support, all while ensuring absolute discretion.'
  },
  { 
    title: 'Resources', 
    desc: 'Psychoeducational Resource Hub: Knowledge for Your Mind', 
    href: '/resources',
    image: resourcesImage,
    longDesc: 'Empower yourself with understanding through our Psychoeducational Resource Hub, a vast and curated library designed for your mental well-being. Explore a rich collection of accurate and reliable videos, articles, and guides on diverse topics like stress management, mindfulness, and healthy relationships, all available in multiple regional languages for accessible, culturally relevant learning. This hub offers interactive, self-paced learning experiences with practical tools and exercises you can implement immediately, boosting your mental literacy and fostering proactive well-being. It\'s continuously updated with new content, ensuring you always have current and engaging materials to support your personal growth.'
  },
  { 
    title: 'P2P Support', 
    desc: 'Peer-to-Peer: Connect, Share, and Grow (Anonymously)', 
    href: '/p2p',
    image: p2pImage,
    longDesc: 'Our Peer-to-Peer platform invites you to connect, share, and grow within a supportive community, all while ensuring complete anonymity. You can join various topic-specific rooms using anonymous names, allowing you to freely express your thoughts, feelings, and challenges without fear of judgment. This moderated, inclusive space fosters real-time thought sharing, enables you to both receive and offer mutual support, and combats feelings of isolation by building a strong sense of belonging. It\'s designed for accessible self-expression, helping you learn from diverse perspectives, develop greater empathy, and realize you are never alone in your experiences.'
  },
  { 
    title: 'Calming Games', 
    desc: 'Quick activities for a mental reset.', 
    href: '/game',
    image: gamesImage,
    longDesc: 'Engage with your mental health in a fun and interactive way through Mindful Challenges, our unique well-being game. Designed to make personal growth enjoyable, this feature presents a series of guided exercises and playful tasks aimed at boosting mindfulness, improving mood, and building resilience. Progress through various levels by completing daily self-care activities, mood tracking, or thought-reframing challenges, earning points and unlocking new content as you go. It\'s a low-pressure, engaging tool that subtly integrates positive psychology principles into your routine, helping you develop healthier habits and celebrate your journey towards a more balanced and mindful self.'
  },
];

const mainFeatures = features.slice(0, -1);
const lastFeature = features[features.length - 1];

const news = [
  { t: 'Gratitude journals improve student wellbeing', u: 'https://www.apa.org/monitor/2021/01/ce-corner-gratitude' },
  { t: 'Peer support reduces loneliness by 22%', u: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9472326/' },
  { t: 'Two‑minute breathing lowers exam stress', u: 'https://www.health.harvard.edu/mind-and-mood/relaxation-techniques-breath-control-helps-quell-errant-stress-response' },
  { t: 'Volunteering links to higher life satisfaction', u: 'https://www.ox.ac.uk/news/2019-08-23-volunteering-linked-better-health-and-wellbeing' },
];

const useInView = (options) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);
    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isInView];
};

function FeatureItem({ feature }) {
  const [ref, isInView] = useInView({ threshold: 0.5 });
  const navigate = useNavigate();

  return (
    <section
      ref={ref}
      onClick={() => navigate(feature.href)}
      className="h-screen w-full snap-start flex flex-col md:flex-row items-center justify-center p-8 gap-8 cursor-pointer"
    >
      <div
        className={`w-full md:w-1/2 flex justify-center items-center transition-all duration-1000 ease-out 
          ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}
      >
        <div className="shrink-0 h-[200px] w-[200px] md:h-[400px] md:w-[400px] rounded-3xl overflow-hidden bg-blue-600/10 dark:bg-blue-400/10 border border-blue-200 dark:border-blue-800 shadow-lg">
          <img 
            src={feature.image} 
            alt={`${feature.title} illustration`}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = `<div class="h-full w-full flex items-center justify-center text-4xl text-blue-600 dark:text-blue-400">${feature.title.charAt(0)}</div>`;
            }}
          />
        </div>
      </div>
      <div
        className={`w-full md:w-1/2 flex justify-center items-center transition-all duration-1000 ease-out delay-200 
          ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}
      >
        <div className="max-w-90 text-center md:text-left">
            <h3 className="font-bold text-4xl md:text-5xl text-blue-700 dark:text-blue-400">
              {feature.title}
            </h3>
            <p className="mt-2 text-lg md:text-xl text-slate-800 dark:text-slate-200">
              {feature.desc}
            </p>
            <p className="mt-4 text-base md:text-lg text-slate-600 dark:text-slate-400">
              {feature.longDesc}
            </p>
        </div>
      </div>
    </section>
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
  
  // MODIFIED: Added a separate instance of the useInView hook for the final section
  const [finalSectionRef, isFinalSectionInView] = useInView({ threshold: 0.3 });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  const tickerItems = useMemo(() => [...news, ...news], []);

  const onShare = async () => {
    const data = { title: 'Care Connect', text: 'Supportive chat, confidential booking, resources, and peer room.', url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(data.url); alert('Link copied to clipboard!'); }
    } catch (e) { console.warn(e); }
  };

  return (
    <div className="text-slate-900 dark:text-slate-100">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ease-out backdrop-blur-sm bg-white/60 dark:bg-slate-900/60
          ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}
      >
        <div className="max-w-[1100px] mx-auto px-4">
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
        </div>
      </header>

      <main className="h-screen overflow-y-scroll snap-y snap-mandatory">
        {mainFeatures.map((f) => (
          <FeatureItem key={f.title} feature={f} />
        ))}

        {/* MODIFIED: Attached the ref for the animation */}
        <section ref={finalSectionRef} className="h-screen w-full snap-start flex flex-col">
            <div 
                onClick={() => navigate(lastFeature.href)}
                className="flex-grow w-full flex flex-col md:flex-row items-center justify-center p-8 gap-8 cursor-pointer"
            >
                {/* MODIFIED: Added animation classes based on isFinalSectionInView */}
                <div className={`w-full md:w-1/2 flex justify-center items-center transition-all duration-1000 ease-out ${isFinalSectionInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
                    <div className="shrink-0 h-[200px] w-[200px] md:h-[350px] md:w-[350px] rounded-3xl overflow-hidden bg-blue-600/10 dark:bg-blue-400/10 border border-blue-200 dark:border-blue-800 shadow-lg">
                        <img 
                            src={lastFeature.image} 
                            alt={`${lastFeature.title} illustration`}
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
                <div className={`w-full md:w-1/2 flex justify-center items-center transition-all duration-1000 ease-out delay-200 ${isFinalSectionInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
                    <div className="max-w-90 text-center md:text-left">
                        <h3 className="font-bold text-4xl md:text-5xl text-blue-700 dark:text-blue-400">
                            {lastFeature.title}
                        </h3>
                        <p className="mt-2 text-lg md:text-xl text-slate-800 dark:text-slate-200">
                            {lastFeature.desc}
                        </p>
                        <p className="mt-4 text-base md:text-lg text-slate-600 dark:text-slate-400">
                            {lastFeature.longDesc}
                        </p>
                    </div>
                </div>
            </div>

            {/* MODIFIED: Restructured this block to allow the ticker bar to be full-width */}
            <div className="w-full flex-shrink-0 pb-4">
              <div className="max-w-4xl mx-auto px-8">
                <h2 className="text-2xl font-bold text-center mb-8">Latest in Wellbeing</h2>
              </div>
              
              <div className="overflow-hidden border-y border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 py-3 group">
                <div className="flex gap-8 animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap">
                  {tickerItems.map((i, idx) => (
                    <span key={idx} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 shadow-sm">
                      <a className="hover:underline" href={i.u} target="_blank" rel="noreferrer noopener">{i.t}</a>
                    </span>
                  ))}
                </div>
              </div>
              
              <footer className="max-w-4xl mx-auto pt-1">
                <div className="flex justify-between items-center  text-sm text-slate-600 dark:text-slate-400">
                  <div>© {new Date().getFullYear()} Campus Wellbeing. All rights reserved.</div>
                  <div aria-hidden>Not a substitute for professional care.</div>
                </div>
              </footer>
            </div>
        </section>
      </main>
    </div>
  );
}