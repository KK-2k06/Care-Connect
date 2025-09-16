import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, ArrowLeft, Play, Globe, BookOpen } from 'lucide-react';

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
];

const videoResources = {
    English: [
        { id: 1, title: 'Reduce Stress through Progressive Muscle Relaxation', 
            description: 'A guided exercise to help reduce stress and muscle tension by tensing and relaxing different muscle groups.', 
            thumbnail: 'https://i.ytimg.com/vi/ClqPtWzozXs/sddefault.jpg', url: 'https://youtu.be/ClqPtWzozXs', duration: '05:54', category: 'Mental Health' },
        { id: 2, title: 'How To Stop Overthinking', description: 'Dr. Tracey Marks discusses the difference between overthinking and problem-solving and offers practical strategies.', thumbnail: 'https://i.ytimg.com/vi/TGUouL4ZAN4/maxresdefault.jpg', url: 'https://youtu.be/TGUouL4ZAN4', duration: '10:24', category: 'Mental Wellness' },
        { id: 3, title: 'How to Improve Your Mental Health', description: 'Four valuable tips to help improve mental health, including prioritizing self-care, creating positive thoughts, and expressing feelings.', thumbnail: 'https://i.ytimg.com/vi/yJNJpDEGne4/maxresdefault.jpg', url: 'https://youtu.be/yJNJpDEGne4', duration: '07:05', category: 'Self-Care' },
        { id: 4, title: 'Coping with Exam Pressure', description: 'Practical tips to manage exam anxiety and perform your best under pressure.', thumbnail: 'https://i.ytimg.com/vi/Ni3VEgbvuhU/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=Ni3VEgbvuhU', duration: '2:15', category: 'Mental Health' }
    ],
    Hindi: [
        { id: 1, title: 'How to deal with Depression and Anxiety? By Sandeep Maheshwari I Hindi', 
            description: 'Sandeep Maheshwari discusses powerful methods to overcome depression and negative thoughts.', 
            thumbnail: 'https://i.ytimg.com/vi/eAK14VoY7C0/sddefault.jpg', 
            url: 'https://www.youtube.com/watch?v=eAK14VoY7C0', 
            duration: '19:20', 
            category: 'मानसिक स्वास्थ्य' },

        { id: 2, title: 'How to overcome Anxiety and Stress during exam time?', 
            description: 'how to overcome anxiety,how to overcome loneliness,how to overcome social anxiety,how to overcome fear and anxiety,how to overcome fear,how to overcome depression,how to overcome overthinking,how to overcome stress', 
            thumbnail: 'https://i.ytimg.com/vi/zriiq1lWhC4/maxresdefault.jpg', 
            url: 'https://www.youtube.com/watch?v=zriiq1lWhC4', duration: '15:15', category: 'परीक्षा का तनाव' },

        { id: 3, title: 'बिना दवाओं के डिप्रेशन का इलाज कैसे करें?', 
            description: 'Dr Praveen Tripathi is a renowned psychiatrist who practices in Delhi-NCR. He did his MBBS from University College of Medical Sciences (UCMS, Delhi) and MD (Psychiatry) from the prestigious Institute of Human Behavior and Allied Sciences (IHBAS, Delhi).', 
            thumbnail: 'https://i.ytimg.com/vi/RDxMxOKpoQQ/maxresdefault.jpg', 
            url: 'https://www.youtube.com/watch?v=RDxMxOKpoQQ', duration: '04:42', category: 'अवसाद' }
    ],
    Tamil: [
        { id: 1, title: 'How to Overcome Depression (Tamil)', description: 'Discusses ways to overcome depression and highlights 13 things that mentally strong people avoid doing.', thumbnail: 'https://i.ytimg.com/vi/AjEvBCkYyPM/maxresdefault.jpg', url: 'https://youtu.be/AjEvBCkYyPM', duration: '08:37', category: 'மன ஆரோக்கியம்' },
        
        { id: 2, title: 'Stop Your Fear & Anxiety - Be Powerful! Dr V S Jithendra', 
            description: 'Convert your Fear and Anxiety into a powerful force that drives you to become successful. Know the art of balancing anxiety to win easily.', 
            thumbnail: 'https://i.ytimg.com/vi/6eoT1Gw8SQ0/maxresdefault.jpg', 
            url: 'https://www.youtube.com/watch?v=6eoT1Gw8SQ0', duration: '5:49', category: 'பயம் மற்றும் கவலையா' },
        { id: 3, title: '7 Ways To Beat Exam Stress And Take On Exams Without Anxiety', 
            description: 'மன அழுத்தம், பயம், தயக்கம் - மாணவர்களின் மிக பெரிய பிரச்சனையாக உருவாகி உள்ளது. அதற்கான தீர்வே இந்த வீடியோ.', 
            thumbnail: 'https://i.ytimg.com/vi/mTV4_LtduiI/maxresdefault.jpg', 
            url: 'https://www.youtube.com/watch?v=mTV4_LtduiI', duration: '06:28', category: 'பயம் மற்றும் கவலையா' }
    ],
    Telugu: [
        { id: 1, title: 'Importance of Mental Health ', description: 'Importance of Mental Health | Psychiatric Problems in Telugu - Dr. Madhu Vamshi | Telugu Podcast ', 
            thumbnail: 'https://i.ytimg.com/vi/UxMHHPpvLQc/sddefault.jpg', 
            url: 'https://www.youtube.com/watch?v=UxMHHPpvLQc', duration: '32:36', category: 'మానసిక ఆరోగ్యం' },
        { id: 2, title: 'డిప్రెషన్ లక్షణాలు| Symptoms of Depression', 
            description: 'Wellness Hospital is one of the best multi-specialty hospitals in Hyderabad. The hospital is NABH accredited hospital and provides a wide spectrum of medical services as well as advanced surgical techniques. over the years it has emerged as the prime provider of high-quality professional medical care.', 
            thumbnail: 'https://i.ytimg.com/vi/N6NlJgSf7r0/sddefault.jpg', 
            url: 'https://www.youtube.com/watch?v=N6NlJgSf7r0', duration: '08:29', category: 'స్వీయ సంరక్షణ' }
    ],
    Bengali: [
        { id: 1, title: 'মানসিক চাপ কমানোর উপায় |', 
            description: 'এংজাইটি ডিসঅর্ডার কি , এংজাইটি ডিসঅর্ডার এর লক্ষণ এবং এর থেকে মুক্তির উপায় - জানাচ্ছেন বিশিষ্ট নিউরো সাইকিয়াট্রিস্ট ডাঃ পূবালী চৌধুরী', 
            thumbnail: 'https://i.ytimg.com/vi/x_BXMKdLot8/sddefault.jpg', 
            url: 'https://www.youtube.com/watch?v=x_BXMKdLot8', duration: '13:34', category: 'ঔদ্ধত্য আক্রান্ত সমস্যা' },
        { id: 2, title: 'মানসিক চাপ কমানোর উপায় | Depression Treatment', 
            description: 'Dr. Subrata Saha, a neuropsychiatrist, sharing practical tips to reduce mental stress and manage anxiety effectively.', 
            thumbnail: 'https://i.ytimg.com/vi/LGLwOV__2ug/maxresdefault.jpg', 
            url: 'https://www.youtube.com/watch?v=LGLwOV__2ug', duration: '04:23', category: 'স্ট্রেস ম্যানেজমেন্ট' }
    ],
    Marathi: [
        { id: 1, title: 'मानसिक आजारा - कारणे, प्रतिबंध आणि उपचार | Mental Health in Marathi | Dr Dnyanda Deshpande',
            description: 'स्वास्थ्य प्लस नेटवर्क वैद्यकीय सल्ला देत नाही. स्वास्थ्य प्लसवर असलेली माहिती फक्त माहितीच्या उद्देशांनी दिली आहे व ही माहिती डॉक्टरांच्या सल्ल्याला पर्यायी ठरत नाही. तुमच्या आरेग्याच्या समस्यांसाठी एका पात्र वैद्याचा सल्ला घ्यावा.', 
            thumbnail: 'https://i.ytimg.com/vi/Jk4WpJpjq7k/maxresdefault.jpg', 
            url: 'https://www.youtube.com/watch?v=Jk4WpJpjq7k', duration: '10:51', category: 'मानसिक ' },

        { id: 2, title: 'स्ट्रेस म्हणजे काय? | How to Manage Stress? in Marathi', 
            description: 'Dr. Vinaya Gore explaining what stress is, its symptoms, and how to manage it effectively.', 
            thumbnail: 'https://i.ytimg.com/vi/iT91-cCv65s/maxresdefault.jpg', 
            url: 'https://www.youtube.com/watch?v=iT91-cCv65s', duration: '18:08', category: 'स्ट्रेस' },

        { id: 3, title: 'ध्यान | Simple Meditation ', 
            description: 'how to meditate, what is meditation in Marathi, how to meditate in Marathi, Meditation, How to Meditate, How to learn Meditation, Benefits of Meditation.', 
            thumbnail: 'https://i.ytimg.com/vi/ggH2PrEJzi8/maxresdefault.jpg', 
            url: 'https://www.youtube.com/watch?v=ggH2PrEJzi8', duration: '18:08', category: 'ध्यान' }
    ],
    Gujarati: [
        { id: 1, title: 'ડિપ્રેશન અને તણાવ માંથી બહાર આવવાનો સરળ ઉપાય', description: 'Gyanvatsal Swami provides guidance in Gujarati on simple ways to overcome depression and stress.', thumbnail: 'https://i.ytimg.com/vi/x_15sI4c688/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=x_15sI4c688', duration: '10:01', category: 'માનસિક સ્વાસ્થ્ય' },
        { id: 2, title: 'How to Control Anger? | ગુસ્સા પર કાબુ કેમ રાખવો?', description: 'An insightful talk on understanding and controlling anger to improve relationships and personal peace.', thumbnail: 'https://i.ytimg.com/vi/lTeu3wL-8jA/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=lTeu3wL-8jA', duration: '04:55', category: 'સ્વયં સહાય' }
    ],
    Kannada: [
        { id: 1, title: 'ಆತಂಕದಿಂದ ಹೊರಬರಲು ಒಂದು ಸರಳ ಸಾಧನ', 
            description: 'Sadhguru explains techniques for managing your mind and thoughts for a more focused life, in Kannada', 
            thumbnail: 'https://i.ytimg.com/vi/9V3AH0EwIgs/sddefault.jpg',
            url: 'https://www.youtube.com/watch?v=9V3AH0EwIgs', 
            duration: '11:04', category: 'ಚಿಂತೆಯನ್ನು ಜಯಿಸು' },
        { id: 2, title: 'Control Your Mind | Anxiety - Understanding and Managing', 
            description: 'This informative video in Kannada educates about Anxiety, a mental health condition marked by excessive worry and fear, often accompanied by physical symptoms like a racing heart. Learn how therapy and lifestyle changes can help manage anxiety effectively.', 
            thumbnail: 'https://i.ytimg.com/vi/eMPT-e0azJ8/sddefault.jpg',
            url: 'https://www.youtube.com/watch?v=eMPT-e0azJ8', duration: '2:01', category: 'ಚಿಂತೆಯನ್ನು ಜಯಿಸು' },
        { id: 3, title: 'ಆರೋಗ್ಯಯುತ ಜೀವನ ಅಂದ್ರೆ ಏನು?  | Mental Health Tips In Kannada | Vistara Health', 
            description: 'This informative video in Kannada educates about Anxiety, a mental health condition marked by excessive worry and fear, often accompanied by physical symptoms like a racing heart. Learn how therapy and lifestyle changes can help manage anxiety effectively.', 
            thumbnail: 'https://i.ytimg.com/vi/YEXlLmovpDg/sddefault.jpg',
            url: 'https://www.youtube.com/watch?v=YEXlLmovpDg', duration: '12:13', category: 'ಮಾನಸಿಕ ಆರೋಗ್ಯ' },

        { id: 4, title: 'ಹೀಗೆ ಮಾಡಿದರೆ ಮೆಡಿಸಿನ್ ಇಲ್ಲಿದೆ ಈ ರೋಗಗಳು ಮಾಯವಾಗುತ್ತೆ! | Mental Health Tips In Kannada', 
            description: 'mental health tips in Kannada, emphasizing that a positive mindset and self-awareness can help prevent or reduce many common ailments. It encourages adopting healthy lifestyle habits to support both mental and physical well-being', 
            thumbnail: 'https://i.ytimg.com/vi/Ir6BiH5Mvpg/sddefault.jpg',
            url: 'https://www.youtube.com/watch?v=Ir6BiH5Mvpg', duration: '8:47', category: 'ಮಾನಸಿಕ ಆರೋಗ್ಯ' } 
    ],

    /*Malayalam: [
        { id: 1, title: 'How to control tension and anxiety?', description: 'A detailed talk in Malayalam on the reasons behind tension and scientific methods to control it.', thumbnail: 'https://i.ytimg.com/vi/i78pE_m4wAo/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=i78pE_m4wAo', duration: '19:40', category: 'മാനസികാരോഗ്യം' },
        { id: 2, title: 'How to Overcome Laziness?', description: 'Psychological tips and practical methods to overcome laziness and improve productivity, in Malayalam.', thumbnail: 'https://i.ytimg.com/vi/XgEaT26o6R8/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=XgEaT26o6R8', duration: '11:15', category: 'പ്രചോദനം' }
    ],
    Punjabi: [
        { id: 1, title: 'How to Avoid Overthinking? | Punjabi', description: 'This video provides practical advice in Punjabi on how to stop the cycle of overthinking.', thumbnail: 'https://i.ytimg.com/vi/5b7f2x4T6vA/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=5b7f2x4T6vA', duration: '08:12', category: 'ਮਾਨਸਿਕ ਸਿਹਤ' },
        { id: 2, title: 'How To Be Happy Alone | Punjabi', description: 'Learn how to find happiness and contentment within yourself, explained with motivational insights in Punjabi.', thumbnail: 'https://i.ytimg.com/vi/yRII73nBAnc/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=yRII73nBAnc', duration: '07:29', category: 'ਪ੍ਰੇਰਣਾ' }
    ]
    */
};

const useInView = (options) => {
    const [isInView, setIsInView] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
                observer.unobserve(element);
            }
        }, options);
        observer.observe(element);
        return () => observer.disconnect();
    }, [options]);

    return [ref, isInView];
};

function VideoCard({ video, onVideoClick, delay }) {
    const [ref, isInView] = useInView({ threshold: 0.1 });
    // MODIFIED: Added state to manage thumbnail source for fallback
    const [imageSrc, setImageSrc] = useState(video.thumbnail);

    // MODIFIED: Added an error handler to fall back to lower resolution thumbnails
    const handleImageError = () => {
        // If maxresdefault fails, try hqdefault. If that fails, sddefault will be tried next by re-triggering this function.
        if (imageSrc.includes('maxresdefault.jpg')) {
            setImageSrc(imageSrc.replace('maxresdefault.jpg', 'hqdefault.jpg'));
        } else if (imageSrc.includes('hqdefault.jpg')) {
            setImageSrc(imageSrc.replace('hqdefault.jpg', 'sddefault.jpg'));
        }
    };
    
    // Reset image src when the video prop changes (i.e., language changes)
    useEffect(() => {
        setImageSrc(video.thumbnail);
    }, [video.thumbnail]);

    return (
        <div
            ref={ref}
            key={video.id}
            onClick={() => onVideoClick(video.url)}
            className={`bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer group transition-all duration-500 ease-out 
              ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
              hover:shadow-xl hover:-translate-y-2`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="relative aspect-video bg-slate-200 dark:bg-slate-700">
                <img 
                    src={imageSrc} 
                    alt={video.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={handleImageError}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                    <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-full h-14 w-14 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                        <Play className="h-6 w-6 text-slate-800 dark:text-slate-200 ml-1" />
                    </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">{video.duration}</div>
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded font-semibold">{video.category}</div>
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-lg mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">{video.description}</p>
            </div>
        </div>
    );
}

export default function ResourcesPage() {
    // ... rest of the component remains unchanged
    const [dark, setDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        if (saved) return saved === 'dark';
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('English');

    useEffect(() => {
        document.documentElement.classList.toggle('dark', dark);
        localStorage.setItem('theme', dark ? 'dark' : 'light');
    }, [dark]);

    const handleVideoClick = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleLanguageSelect = (language) => {
        setSelectedLanguage(language);
        setSidebarOpen(false);
    };

    const currentVideos = videoResources[selectedLanguage] || [];

    return (
        <div className="h-screen bg-slate-50 dark:bg-slate-900 flex flex-col text-slate-800 dark:text-slate-200">
            <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 z-20 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            <Menu className="h-5 w-5" />
                        </button>
                        <Link to="/" className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                            <span className="text-lg font-semibold">Care Connect</span>
                        </Link>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold hidden sm:block">Resources</h1>
                        <button onClick={() => setDark(!dark)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title="Toggle theme">
                            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-transform duration-300 ease-in-out`}>
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold flex items-center gap-2"><Globe className="h-5 w-5" /> Languages</h2>
                                <button onClick={() => setSidebarOpen(false)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"><X className="h-4 w-4" /></button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="space-y-2">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleLanguageSelect(lang.name)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all duration-200 transform hover:scale-105 ${
                                            selectedLanguage === lang.name
                                                ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-400 dark:border-blue-700 text-blue-800 dark:text-blue-200 shadow-md'
                                                : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
                                        }`}
                                    >
                                        <span className="text-2xl">{lang.flag}</span>
                                        <span className="font-medium">{lang.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                            <div className="text-sm text-slate-600 dark:text-slate-400 text-center">Currently viewing: <span className="font-medium text-slate-800 dark:text-slate-200">{selectedLanguage}</span></div>
                        </div>
                    </div>
                </aside>
                
                {sidebarOpen && (<div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />)}

                <main className="flex-1 flex flex-col overflow-hidden">
                    <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold flex items-center gap-3"><BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" /> Educational Resources</h2>
                                <p className="text-slate-600 dark:text-slate-400 mt-1">Curated videos and guides in {selectedLanguage}</p>
                            </div>
                            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                                <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">{selectedLanguage}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 bg-slate-100 dark:bg-slate-950/50">
                        <div key={selectedLanguage} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {currentVideos.map((video, index) => (
                                <VideoCard key={video.id} video={video} onVideoClick={handleVideoClick} delay={index * 100} />
                            ))}
                        </div>

                        {currentVideos.length === 0 && (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                                    <BookOpen className="h-16 w-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">No Videos Available</h3>
                                    <p className="text-slate-500">Content for {selectedLanguage} is being prepared and will be available soon. Please check back later!</p>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}