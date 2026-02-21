
import React, { useState, useEffect } from 'react';
import { Megaphone, BookOpen, FileText, Monitor, Calendar, Bell, User } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface Announcement {
  id: string;
  type: 'quiz' | 'file' | 'explanation' | 'general';
  title: string;
  teacherName: string;
  date: any;
}

const AnnouncementsTicker: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const CACHE_KEY = 'etqan_ticker_cache_v1';
      const CACHE_DURATION = 60 * 60 * 1000; // 1 Hour Cache

      // 1. Try Cache
      const cached = localStorage.getItem(CACHE_KEY);
      const now = Date.now();

      if (cached) {
        try {
            const { data, timestamp } = JSON.parse(cached);
            if (now - timestamp < CACHE_DURATION) {
                setAnnouncements(data);
                setLoading(false);
                return;
            }
        } catch (e) {
            console.error("Error parsing ticker cache", e);
        }
      }

      // 2. Fetch from Network if cache expired/missing
      try {
        const quizzesQuery = query(collection(db, "quizzes"), orderBy("createdAt", "desc"), limit(3));
        const filesQuery = query(collection(db, "study_materials"), orderBy("createdAt", "desc"), limit(3));
        const explanationsQuery = query(collection(db, "explanations"), orderBy("createdAt", "desc"), limit(3));
        const generalQuery = query(collection(db, "announcements"), orderBy("createdAt", "desc"), limit(3));

        const [quizzesSnap, filesSnap, explanationsSnap, generalSnap] = await Promise.all([
          getDocs(quizzesQuery),
          getDocs(filesQuery),
          getDocs(explanationsQuery),
          getDocs(generalQuery)
        ]);

        const items: Announcement[] = [];

        // Helper to safely extract seconds for JSON serialization
        const getDateObj = (createdAt: any) => {
            return createdAt ? { seconds: createdAt.seconds } : null;
        };

        generalSnap.forEach(doc => {
            const data = doc.data();
            items.push({
                id: doc.id,
                type: 'general',
                title: data.title,
                teacherName: data.teacherName || 'الإدارة',
                date: getDateObj(data.createdAt)
            });
        });

        quizzesSnap.forEach(doc => {
          const data = doc.data();
          items.push({
            id: doc.id,
            type: 'quiz',
            title: data.title,
            teacherName: data.teacherName || 'المعلم',
            date: getDateObj(data.createdAt)
          });
        });

        filesSnap.forEach(doc => {
          const data = doc.data();
          items.push({
            id: doc.id,
            type: 'file',
            title: data.title,
            teacherName: data.teacherName || 'المعلم',
            date: getDateObj(data.createdAt)
          });
        });

        explanationsSnap.forEach(doc => {
          const data = doc.data();
          items.push({
            id: doc.id,
            type: 'explanation',
            title: data.title,
            teacherName: data.teacherName || 'المعلم',
            date: getDateObj(data.createdAt)
          });
        });

        items.sort((a, b) => {
            const timeA = a.date?.seconds || 0;
            const timeB = b.date?.seconds || 0;
            return timeB - timeA;
        });

        const finalItems = items.slice(0, 10);
        setAnnouncements(finalItems);

        // Save to Cache
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: finalItems,
            timestamp: now
        }));

      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mobile Cycle Effect
  useEffect(() => {
      if (announcements.length <= 1) return;
      const timer = setInterval(() => {
          setCurrentMobileIndex(prev => (prev + 1) % announcements.length);
      }, 4000);
      return () => clearInterval(timer);
  }, [announcements.length]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    // Handle both Firestore Timestamp (toDate) and serialized JSON object ({seconds: ...})
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-GB', { month: '2-digit', day: '2-digit' });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'quiz': return <BookOpen className="w-3 h-3 text-yellow-400" />;
      case 'file': return <FileText className="w-3 h-3 text-blue-400" />;
      case 'explanation': return <Monitor className="w-3 h-3 text-purple-400" />;
      case 'general': return <Bell className="w-3 h-3 text-red-400" />;
      default: return <Megaphone className="w-3 h-3 text-emerald-400" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
        case 'quiz': return 'امتحان';
        case 'file': return 'ملف';
        case 'explanation': return 'شرح';
        case 'general': return 'إعلان';
        default: return 'تحديث';
    }
  };

  if (loading || announcements.length === 0) return null;

  const currentItem = announcements[currentMobileIndex];

  // Duplicate for seamless loop on desktop
  const loopItems = [...announcements, ...announcements, ...announcements];

  return (
    <div className="w-full bg-gray-900 border-t border-b border-emerald-900/30 relative overflow-hidden py-2" dir="rtl">
        
        {/* Mobile View: Single Item Slider */}
        <div className="md:hidden flex items-center gap-2 px-4 h-10 w-full">
             <div className="flex items-center gap-1.5 bg-emerald-900/20 text-emerald-400 px-2 py-1 rounded-lg text-[10px] font-bold border border-emerald-500/20 shrink-0">
                <Megaphone className="w-3 h-3" />
                <span>تحديثات</span>
            </div>

            <div className="flex-1 min-w-0 overflow-hidden relative h-full flex items-center">
                 <div key={currentItem.id} className="flex items-center gap-2 animate-fade-in w-full min-w-0">
                    <div className="shrink-0">
                        {getIcon(currentItem.type)}
                    </div>
                    <span className="text-[11px] font-bold text-gray-300 truncate flex-1">
                        {currentItem.title}
                    </span>
                    <span className="text-[9px] text-gray-500 whitespace-nowrap flex items-center gap-1 bg-black/20 px-1.5 py-0.5 rounded shrink-0">
                        <User className="w-2 h-2" /> 
                        {/* Ensure full name shows if possible, or handle truncation via CSS */}
                        <span className="max-w-[60px] truncate">{currentItem.teacherName}</span>
                    </span>
                 </div>
            </div>
        </div>

        {/* Desktop View: Scrolling Ticker */}
        <div className="hidden md:flex items-center relative z-10 h-10">
            {/* Badge */}
            <div className="absolute right-0 z-20 h-full flex items-center pr-4 pl-6 bg-gradient-to-l from-gray-900 via-gray-900 to-transparent">
                <div className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                    <Megaphone className="w-4 h-4" />
                    <span>آخر التحديثات</span>
                </div>
            </div>

            {/* Ticker Content */}
            <div className="flex-1 overflow-hidden relative h-full flex items-center">
                <div className="whitespace-nowrap flex items-center animate-ticker pr-32 will-change-transform">
                    {loopItems.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="inline-flex items-center bg-gray-800 border border-gray-700 rounded-full pl-4 pr-2 py-1 gap-3 mx-3 hover:bg-gray-750 transition-colors cursor-default">
                            <div className="bg-gray-700 rounded-full px-2 py-0.5 flex items-center gap-1.5">
                                {getIcon(item.type)}
                                <span className="text-[10px] font-bold text-emerald-400">{getTypeLabel(item.type)}</span>
                            </div>
                            <span className="text-xs text-gray-200 font-bold">{item.title}</span>
                            <div className="flex items-center gap-2 border-r border-gray-600 pr-2 mr-1">
                                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                    <User className="w-3 h-3" /> {item.teacherName}
                                </span>
                                <span className="text-[10px] text-gray-500 font-mono">
                                    {formatDate(item.date)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <style>{`
            .animate-ticker {
                animation: ticker 80s linear infinite;
            }
            @keyframes ticker {
                0% { transform: translateX(0); }
                100% { transform: translateX(50%); } 
            }
            .animate-ticker:hover {
                animation-play-state: paused;
            }
        `}</style>
    </div>
  );
};

export default AnnouncementsTicker;
