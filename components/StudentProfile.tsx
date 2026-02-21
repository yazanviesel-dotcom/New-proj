
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, BookOpen, Save, Loader2, CheckCircle2, Edit3, X, Palette, TrendingUp, FileCheck, Trophy, Flame, Award, Search, Zap, Crown, Flag, Lock, GraduationCap, PlusCircle, Layers, Monitor, UploadCloud, Medal, BarChart3, Percent, ChevronDown, CheckCircle, FilePlus, Send, Mail, School, Star, Megaphone, MessageSquare, Calendar, Target, Sparkles, Rocket, ShieldCheck, Fingerprint, CreditCard, Copy, Download, Scroll, MousePointerClick, HelpCircle, History, XCircle, RefreshCw } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc, increment, getDoc, addDoc, serverTimestamp, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { AppView, UserProfile } from '../types';

const RANKS = [
    { minLevel: 1, title: 'مبتدئ طموح', color: 'bg-gray-100 text-gray-600 border-gray-200', icon: Flag },
    { minLevel: 5, title: 'طالب مجتهد', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: BookOpen },
    { minLevel: 10, title: 'مستكشف المعرفة', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Search },
    { minLevel: 15, title: 'قائد أكاديمي', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: Award },
    { minLevel: 20, title: 'عبقري المستقبل', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Zap },
    { minLevel: 30, title: 'أسطورة إتقان', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Crown },
];

const BADGES = [
    { id: 'first_step', title: 'البداية القوية', desc: 'إكمال أول اختبار بنجاح', icon: Flag, color: 'text-emerald-500', bg: 'bg-emerald-500/10', condition: (stats: any) => stats.quizzesCompleted >= 1 },
    { id: 'perfect_score', title: 'العلامة الكاملة', desc: 'الحصول على 100% في اختبار واحد', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10', condition: (stats: any) => stats.hasPerfectScore },
    { id: 'dedicated', title: 'طالب مثابر', desc: 'إكمال 5 اختبارات مختلفة', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10', condition: (stats: any) => stats.quizzesCompleted >= 5 },
    { id: 'high_level', title: 'مستوى متقدم', desc: 'الوصول للمستوى 5', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10', condition: (stats: any) => stats.level >= 5 },
    { id: 'expert', title: 'خبير الامتحانات', desc: 'إكمال 10 اختبارات', icon: Trophy, color: 'text-purple-500', bg: 'bg-purple-500/10', condition: (stats: any) => stats.quizzesCompleted >= 10 },
    { id: 'scholar', title: 'باحث علمي', desc: 'جمع 1000 نقطة خبرة (XP)', icon: Search, color: 'text-cyan-500', bg: 'bg-cyan-500/10', condition: (stats: any) => stats.totalXP >= 1000 },
    { id: 'sharpshooter', title: 'القناص', desc: 'الحصول على العلامة الكاملة 3 مرات', icon: Target, color: 'text-red-500', bg: 'bg-red-500/10', condition: (stats: any) => stats.perfectScoresCount >= 3 },
    { id: 'veteran', title: 'المخضرم', desc: 'إكمال 20 اختبار', icon: ShieldCheck, color: 'text-indigo-500', bg: 'bg-indigo-500/10', condition: (stats: any) => stats.quizzesCompleted >= 20 },
    { id: 'rocket', title: 'المنطلق', desc: 'الوصول للمستوى 15', icon: Rocket, color: 'text-pink-500', bg: 'bg-pink-500/10', condition: (stats: any) => stats.level >= 15 },
    { id: 'master', title: 'الأسطورة', desc: 'الوصول للمستوى 30', icon: Crown, color: 'text-amber-500', bg: 'bg-amber-500/10', condition: (stats: any) => stats.level >= 30 },
];

const ALL_AVATARS = [
    { url: "https://lh3.googleusercontent.com/d/1ufUwP7M3wdxWBW60s2xdpZC6W7jfpXv4", minLevel: 1 },
    { url: "https://lh3.googleusercontent.com/d/1AqS4xhkK53MwCO-LFRdmtYBQsYSH6vz1", minLevel: 1 }, 
    { url: "https://lh3.googleusercontent.com/d/198SBde0OI07puyVx53mi9MpZ7F-iKltI", minLevel: 1 }, 
    { url: "https://lh3.googleusercontent.com/d/1E--pczIn4ZCSWpWYhKZutLX8lfhtmCrp", minLevel: 5 }, 
    { url: "https://lh3.googleusercontent.com/d/1ep_ggXFs0rCkGJ212WkY5DuRbLNkyLyr", minLevel: 10 }, 
    { url: "https://lh3.googleusercontent.com/d/1siamCZMGjbXH6L9bop_dN1UPSSwfyIwc", minLevel: 15 }, 
    { url: "https://lh3.googleusercontent.com/d/1seg3JDYcNsDBtTY4gU9N5empajSAT_-E", minLevel: 1 }, 
    { url: "https://lh3.googleusercontent.com/d/1QnacjkYXRr-N4yhmt44LubRxbRnzNgqH", minLevel: 1 }, 
    { url: "https://lh3.googleusercontent.com/d/1h5uzg3mZaeaozqEkzwItA14xqDq7kbMb", minLevel: 10 }, 
    { url: "https://lh3.googleusercontent.com/d/1qKn7YfQr7VaDPXB8EjUvlCW-qt3v5E0u", minLevel: 15 }, 
];

const BACKGROUND_OPTIONS = [
    { id: 'nature_1', url: 'https://lh3.googleusercontent.com/d/16IHotAb2_MEMsfpUxEIx8CBx94kLVYCs', name: 'بداية الرحلة', minLevel: 1 },
    { id: 'nature_2', url: 'https://lh3.googleusercontent.com/d/1tBjHedpcXQiEjXro--zG3iWDokgrDbgZ', name: 'الطريق الأخضر', minLevel: 5 },
    { id: 'nature_3', url: 'https://lh3.googleusercontent.com/d/1Chp7z63_XfLlt4ZC0MRmKwNsSTlCWwOa', name: 'الوادي السحري', minLevel: 10 },
    { id: 'nature_4', url: 'https://lh3.googleusercontent.com/d/12RHK_FCMJt8D24AB3UV7nHxbD50EF4MX', name: 'قمة الجبل', minLevel: 15 },
    { id: 'nature_5', url: 'https://lh3.googleusercontent.com/d/1We4c8009ObQB9ZDrpQ8ssUuos4V_4b9w', name: 'السماء الذهبية', minLevel: 20 },
];

interface Option {
  label: string;
  value: string;
  isHeader?: boolean;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, placeholder, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectedOption = options.find(o => o.value === value && !o.isHeader);
  
  return (
    <div className={`relative ${isOpen ? 'z-[9999]' : 'z-20'}`} ref={containerRef}>
       <button 
         type="button"
         onClick={() => !disabled && setIsOpen(!isOpen)}
         className={`w-full px-4 py-3 rounded-xl border flex justify-between items-center outline-none transition-all font-bold text-sm
            ${disabled 
               ? 'bg-gray-950 border-gray-800 text-gray-600 cursor-not-allowed' 
               : isOpen 
                 ? 'bg-gray-950 border-blue-500 ring-2 ring-blue-900 text-white shadow-lg' 
                 : 'bg-gray-950 border-gray-800 hover:border-blue-900 text-white shadow-inner'
            }
         `}
       >
          <span className={`truncate ${!selectedOption ? 'text-gray-600' : ''}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
       </button>

       {isOpen && (
         <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-xl max-h-52 overflow-y-auto custom-scrollbar animate-fade-in p-2 z-[9999]">
            {options.map((opt, idx) => {
               if(opt.isHeader) {
                 return <div key={idx} className="px-4 py-2 text-[10px] font-black text-gray-500 uppercase tracking-wider mt-2 first:mt-0 bg-gray-800/50 rounded-lg mb-1">{opt.label}</div>
               }
               const isSelected = opt.value === value;
               return (
                 <div 
                   key={idx}
                   onClick={() => {
                     onChange(opt.value);
                     setIsOpen(false);
                   }}
                   className={`px-4 py-2.5 rounded-lg font-bold text-xs cursor-pointer transition-colors flex justify-between items-center mb-1 group
                      ${isSelected 
                        ? 'bg-blue-900/30 text-blue-400' 
                        : 'text-gray-300 hover:bg-gray-800'
                      }
                   `}
                 >
                    {opt.label}
                    {isSelected && <CheckCircle className="w-3 h-3" />}
                 </div>
               );
            })}
         </div>
       )}
    </div>
  );
}

interface QuizResult {
  id: string;
  quizTitle: string;
  subject: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  createdAt: any;
}

interface StudentProfileProps {
    onNavigate?: (view: AppView) => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ onNavigate }) => {
  const { user, updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);
  
  const [showIdCopied, setShowIdCopied] = useState(false);
  
  // Badge Interaction State
  const [selectedBadgeInfo, setSelectedBadgeInfo] = useState<any>(null);

  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "");
  const [selectedBackground, setSelectedBackground] = useState(user?.profileBackground || BACKGROUND_OPTIONS[0].url);

  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentRank, setCurrentRank] = useState(RANKS[0]);
  const [userStats, setUserStats] = useState({ quizzesCompleted: 0, hasPerfectScore: false, level: 1, totalXP: 0, perfectScoresCount: 0 });

  // Teacher States
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [xpAmount, setXpAmount] = useState<string>('50');
  const [xpSuccess, setXpSuccess] = useState<string | null>(null);

  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [isSavingAnnouncement, setIsSavingAnnouncement] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    age: user?.age || '',
    grade: user?.grade || '',
    phone: user?.phone || '',
    address: user?.address || '',
    school: user?.school || '',
    gender: user?.gender || 'male',
    universityName: ''
  });
  
  useEffect(() => {
    if (user) {
        setFormData(prev => ({
            ...prev,
            firstName: user.firstName || prev.firstName,
            lastName: user.lastName || prev.lastName,
            gender: user.gender || prev.gender,
            grade: user.grade || prev.grade,
            school: user.school || prev.school
        }));
        if (user.avatar) setSelectedAvatar(user.avatar);
        if (user.profileBackground) setSelectedBackground(user.profileBackground);
    }
  }, [user]);

  // Separate function to fetch student specific quiz data
  const fetchStudentQuizData = async (forceRefresh = false) => {
      if (!user || user.role === 'teacher') return;

      const CACHE_KEY_HISTORY = `etqan_quiz_history_${user.uid}`;
      const CACHE_TTL = 365 * 24 * 60 * 60 * 1000; // 1 Year Cache
      const now = Date.now();

      // Try LocalStorage first unless forcing refresh
      if (!forceRefresh) {
          const cachedHistory = localStorage.getItem(CACHE_KEY_HISTORY);
          if (cachedHistory) {
              try {
                  const { history, totalXP, rankLevel, stats, timestamp } = JSON.parse(cachedHistory);
                  if (now - timestamp < CACHE_TTL) {
                      setQuizHistory(history);
                      setTotalXP(totalXP);
                      setLevel(rankLevel);
                      setCurrentRank(RANKS.find(r => rankLevel >= r.minLevel) || RANKS[0]);
                      setUserStats(stats);
                      setStatsLoading(false);
                      return;
                  }
              } catch(e) { console.error(e); }
          }
      } else {
          // If forcing refresh, clear cache first
          localStorage.removeItem(CACHE_KEY_HISTORY);
      }

      setStatsLoading(true);
      try {
        // Fetch all results for user
        const q = query(
            collection(db, "quiz_results"), 
            where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const history: QuizResult[] = [];
        let calculatedXP = 0;
        let hasPerfect = false;
        let perfectCount = 0;

        snapshot.forEach(doc => {
          const data = doc.data() as QuizResult;
          history.push({ 
              id: doc.id, 
              ...doc.data(),
              createdAt: doc.data().createdAt ? { seconds: doc.data().createdAt.seconds } : null
          });
          let quizXP = 10 + (data.percentage * 2);
          if (data.passed) quizXP += 50;
          if (data.percentage === 100) { quizXP += 100; hasPerfect = true; perfectCount++; }
          calculatedXP += Math.round(quizXP);
        });

        // Client-side Sort & Limit to 10
        history.sort((a, b) => {
            const tA = a.createdAt ? a.createdAt.seconds : 0;
            const tB = b.createdAt ? b.createdAt.seconds : 0;
            return tB - tA;
        });
        
        const recentHistory = history.slice(0, 10);

        // Calculate XP/Level
        let finalXP = calculatedXP;
        // Fallback to user profile XP if higher/different logic
        if (user.totalXP !== undefined && user.totalXP > finalXP) {
             finalXP = user.totalXP;
        }

        const currentLevel = Math.floor(finalXP / 500) + 1;
        
        // Update State
        setQuizHistory(recentHistory);
        setTotalXP(finalXP);
        setLevel(currentLevel);
        const activeRank = [...RANKS].reverse().find(r => currentLevel >= r.minLevel) || RANKS[0];
        setCurrentRank(activeRank);
        
        const finalStats = { 
            quizzesCompleted: history.length, 
            hasPerfectScore: hasPerfect, 
            level: currentLevel,
            totalXP: finalXP,
            perfectScoresCount: perfectCount
        };
        setUserStats(finalStats);

        // Save to Cache
        localStorage.setItem(CACHE_KEY_HISTORY, JSON.stringify({
            history: recentHistory,
            totalXP: finalXP,
            rankLevel: currentLevel,
            stats: finalStats,
            timestamp: now
        }));

      } catch (error) { 
          console.error(error); 
      } finally { 
          setStatsLoading(false); 
      }
  };

  // Main Effect
  useEffect(() => {
    if (!user) return;

    if (user.role === 'teacher') {
        // Teacher Logic (Fetch Students List)
        const fetchStudents = async () => {
            setLoadingStudents(true);
            const CACHE_KEY_STUDENTS = `etqan_all_students_teacher_v2`; 
            const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 Hours
            
            const cachedStudents = localStorage.getItem(CACHE_KEY_STUDENTS);
            const now = Date.now();
            
            if (cachedStudents) {
                try {
                    const { data, timestamp } = JSON.parse(cachedStudents);
                    if (now - timestamp < CACHE_TTL) {
                        setAllStudents(data);
                        setLoadingStudents(false);
                        return;
                    }
                } catch(e) { console.error(e); }
            }

            try {
                const q = query(collection(db, "users"), where("role", "==", "student"));
                const querySnapshot = await getDocs(q);
                const students = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return { 
                        id: doc.id, 
                        ...data,
                        // Sanitize all possible timestamps
                        createdAt: data.createdAt ? { seconds: data.createdAt.seconds } : null,
                        lastQuizDate: data.lastQuizDate ? { seconds: data.lastQuizDate.seconds } : null,
                        subscriptionExpiry: data.subscriptionExpiry ? { seconds: data.subscriptionExpiry.seconds } : null
                    };
                });
                setAllStudents(students);
                localStorage.setItem(CACHE_KEY_STUDENTS, JSON.stringify({ data: students, timestamp: now }));
            } catch (error) { console.error(error); } 
            finally { setLoadingStudents(false); }
        };
        fetchStudents();
    } else {
        // Student Logic
        fetchStudentQuizData();
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg(null);
    try {
      let updateData: any = { ...formData };
      if (formData.grade === 'university' && formData.universityName) {
          updateData.school = formData.universityName; 
      }
      delete updateData.universityName; 

      await updateUserProfile(updateData);
      setSuccessMsg("تم تحديث البيانات بنجاح!");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (error) { console.error(error); alert("حدث خطأ أثناء التحديث"); } finally { setIsLoading(false); }
  };
  const handleSaveAvatar = async () => {
    setIsLoading(true);
    try { await updateUserProfile({ avatar: selectedAvatar }); setShowAvatarModal(false); } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };
  const handleSaveBackground = async () => {
    setIsLoading(true);
    try { await updateUserProfile({ profileBackground: selectedBackground }); setShowBackgroundModal(false); } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  const handleGiveXP = async (studentId: string, studentName: string) => {
      if (!studentId) return;
      const amount = parseInt(xpAmount);
      if (isNaN(amount) || amount <= 0) {
          alert("الرجاء إدخال قيمة صحيحة للنقاط");
          return;
      }

      if (!window.confirm(`هل أنت متأكد من منح ${amount} XP للطالب ${studentName}؟`)) return;

      setIsLoading(true);
      setXpSuccess(null);
      try {
          const userRef = doc(db, "users", studentId);
          await updateDoc(userRef, { totalXP: increment(amount) });
          
          // Update Local State for Teacher
          const updatedStudents = allStudents.map(s => s.id === studentId ? { ...s, totalXP: (s.totalXP || 0) + amount } : s);
          setAllStudents(updatedStudents);
          
          // Update Cache immediately
          const CACHE_KEY_STUDENTS = `etqan_all_students_teacher_v2`;
          localStorage.setItem(CACHE_KEY_STUDENTS, JSON.stringify({
              data: updatedStudents,
              timestamp: Date.now()
          }));
          
          setXpSuccess(`تم إضافة ${amount} XP للطالب ${studentName} بنجاح!`);
          setTimeout(() => setXpSuccess(null), 3000);
      } catch(e) { 
          console.error(e); 
          alert("حدث خطأ أثناء إضافة النقاط"); 
      } finally { 
          setIsLoading(false); 
      }
  };

  const handleSaveAnnouncement = async () => {
      if (!announcementTitle.trim()) {
          alert("الرجاء إدخال عنوان التحديث");
          return;
      }
      
      setIsSavingAnnouncement(true);
      try {
          await addDoc(collection(db, "announcements"), {
              title: announcementTitle,
              teacherName: user?.displayName || 'المعلم',
              teacherId: user?.uid,
              createdAt: serverTimestamp()
          });
          
          await addDoc(collection(db, "notifications"), {
              recipientId: 'all',
              title: "تحديث عام جديد",
              message: announcementTitle,
              type: 'info',
              createdAt: serverTimestamp(),
              read: false
          });

          alert("تم نشر التحديث بنجاح");
          setAnnouncementTitle('');
          setShowAnnouncementModal(false);
      } catch (error) {
          console.error(error);
          alert("حدث خطأ أثناء النشر");
      } finally {
          setIsSavingAnnouncement(false);
      }
  };

  const formatResultDate = (timestamp: any) => {
      if (!timestamp) return '';
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString('ar-EG');
  };

  const filteredStudents = allStudents.filter(s => {
      const name = (s.displayName || '').toLowerCase();
      const email = (s.email || '').toLowerCase();
      const search = studentSearch.toLowerCase();
      return name.includes(search) || email.includes(search);
  });

  const getBackgroundStyle = (bgValue?: string) => {
    if (!bgValue) return { backgroundImage: `url(${BACKGROUND_OPTIONS[0].url})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    if (bgValue.startsWith('http')) { return { backgroundImage: `url(${bgValue})`, backgroundSize: 'cover', backgroundPosition: 'center' }; }
    return {};
  };
  const getBackgroundClass = (bgValue?: string) => {
    if (!bgValue || bgValue.startsWith('http')) return "bg-no-repeat bg-center";
    return bgValue; 
  };

  const getLevelTextStyle = (lvl: number) => {
      if (lvl <= 3) return "text-gray-400";
      if (lvl <= 6) return "text-emerald-400 font-bold";
      if (lvl <= 9) return "text-blue-400 font-bold";
      if (lvl <= 12) return "text-cyan-400 font-black";
      if (lvl <= 15) return "text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-black";
      if (lvl <= 20) return "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-black drop-shadow-sm";
      if (lvl <= 25) return "text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500 font-black drop-shadow-md";
      return "text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 font-black animate-pulse drop-shadow-lg";
  };

  const getAvatarBorderClass = (lvl: number) => {
      if (lvl >= 30) return 'border-red-600 ring-2 ring-red-600/50 shadow-[0_0_20px_rgba(220,38,38,0.5)]'; // Legendary
      if (lvl >= 20) return 'border-orange-700 ring-2 ring-orange-700/30'; // Dark Orange
      if (lvl >= 15) return 'border-yellow-400 ring-2 ring-yellow-400/30'; // Yellow
      if (lvl >= 10) return 'border-blue-800 ring-2 ring-blue-800/30'; // Dark Blue
      if (lvl >= 5) return 'border-emerald-500 ring-2 ring-emerald-500/30'; // Green
      return 'border-gray-500'; // Gray (Default)
  };

  const chartData = quizHistory.slice(0, 10).map(q => q.percentage);
  const avgScore = chartData.length > 0 ? Math.round(chartData.reduce((a,b)=>a+b,0)/chartData.length) : 0;
  const progressToNextLevel = Math.min(100, Math.max(0, ((totalXP - ((level - 1) * 500)) / 500) * 100));

  const inputClasses = "w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-900 outline-none font-bold text-white transition-all placeholder-gray-600 shadow-inner text-sm";

  const gradeOptions: Option[] = [
    { label: 'المرحلة المدرسية', value: 'school_header', isHeader: true },
    ...[5, 6, 7, 8, 9, 10, 11, 12].map(g => ({ label: `الصف ${g}`, value: g.toString() })),
    { label: 'المرحلة الجامعية', value: 'uni_header', isHeader: true },
    { label: 'جامعة القدس المفتوحة', value: 'English Major - QOU' },
    { label: 'طالب جامعي', value: 'university' }
  ];

  const genderOptions: Option[] = [
      { label: 'ذكر', value: 'male' },
      { label: 'أنثى', value: 'female' }
  ];

  const getPerformanceInfo = (avg: number) => {
      if (avg >= 85) return { label: 'ممتاز 🔥', color: 'text-emerald-400', bg: 'bg-emerald-900/20', border: 'border-emerald-500/20' };
      if (avg >= 75) return { label: 'جيد جداً ✨', color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-500/20' };
      if (avg >= 65) return { label: 'جيد 👍', color: 'text-indigo-400', bg: 'bg-indigo-900/20', border: 'border-indigo-500/20' };
      if (avg >= 50) return { label: 'مقبول', color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-500/20' };
      return { label: 'راسب', color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-500/20' };
  };

  const perf = getPerformanceInfo(avgScore);

  if (user?.role === 'teacher') {
      return (
        <>
            <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 animate-fade-in-up pb-32">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-12 p-2">
                    <div className="relative group">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-800 shadow-2xl bg-gray-700">
                            {user.avatar ? (
                                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-full h-full p-4 text-gray-400" />
                            )}
                        </div>
                        <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-gray-900 shadow-sm">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </div>
                    
                    <div className="text-center md:text-right space-y-2">
                        <h1 className="text-3xl md:text-4xl font-black text-white">
                            مرحباً، {user.displayName}
                        </h1>
                        <p className="text-gray-400 font-medium text-lg flex items-center justify-center md:justify-start gap-2">
                            <Mail className="w-4 h-4 text-blue-500" />
                            {user.email}
                        </p>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/30 text-blue-300 text-xs font-bold border border-blue-800">
                            <GraduationCap className="w-3.5 h-3.5" />
                            حساب معلم
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-12">
                    <button onClick={() => onNavigate && onNavigate('TEACHER_DASHBOARD')} className="group bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-700 hover:border-blue-500 transition-all hover:-translate-y-1 flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-900/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors"><FilePlus className="w-6 h-6" /></div>
                        <span className="font-bold text-gray-200 text-sm">إنشاء اختبار</span>
                    </button>
                    <button onClick={() => onNavigate && onNavigate('QUESTION_BANK')} className="group bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-700 hover:border-purple-500 transition-all hover:-translate-y-1 flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-purple-900/20 text-purple-400 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors"><Layers className="w-6 h-6" /></div>
                        <span className="font-bold text-gray-200 text-sm">بنك الأسئلة</span>
                    </button>
                    <button onClick={() => onNavigate && onNavigate('TEACHER_UPLOAD_FILES')} className="group bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-700 hover:border-emerald-500 transition-all hover:-translate-y-1 flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-900/20 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors"><UploadCloud className="w-6 h-6" /></div>
                        <span className="font-bold text-gray-200 text-sm">إضافة ملفات</span>
                    </button>
                    <button onClick={() => onNavigate && onNavigate('TEACHER_EXPLANATIONS')} className="group bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-700 hover:border-orange-500 transition-all hover:-translate-y-1 flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-orange-900/20 text-orange-400 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors"><Monitor className="w-6 h-6" /></div>
                        <span className="font-bold text-gray-200 text-sm">إضافة شرح</span>
                    </button>
                    <button onClick={() => setShowAnnouncementModal(true)} className="group bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-700 hover:border-red-500 transition-all hover:-translate-y-1 flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-red-900/20 text-red-400 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors"><Megaphone className="w-6 h-6" /></div>
                        <span className="font-bold text-gray-200 text-sm">آخر التحديثات</span>
                    </button>
                    <button onClick={() => onNavigate && onNavigate('TEACHER_REVIEWS')} className="group bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-700 hover:border-yellow-500 transition-all hover:-translate-y-1 flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-yellow-900/20 text-yellow-400 flex items-center justify-center group-hover:bg-yellow-600 group-hover:text-white transition-colors"><MessageSquare className="w-6 h-6" /></div>
                        <span className="font-bold text-gray-200 text-sm">التعليقات</span>
                    </button>
                    <button onClick={() => onNavigate && onNavigate('TEACHER_CORRESPONDENCE')} className="group bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-700 hover:border-cyan-500 transition-all hover:-translate-y-1 flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-900/20 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors"><Send className="w-6 h-6" /></div>
                        <span className="font-bold text-gray-200 text-sm">المراسلات</span>
                    </button>
                    <button onClick={() => onNavigate && onNavigate('SUBSCRIPTION_MANAGEMENT')} className="group bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-700 hover:border-amber-500 transition-all hover:-translate-y-1 flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-900/20 text-amber-400 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors"><CreditCard className="w-6 h-6" /></div>
                        <span className="font-bold text-gray-200 text-sm">متابعة الاشتراكات</span>
                    </button>
                </div>

                <div className="bg-gray-900 rounded-[2.5rem] shadow-sm border border-gray-700 overflow-hidden">
                    <div className="p-8 border-b border-gray-700 bg-gray-800/50 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-black text-white flex items-center gap-2"><Trophy className="w-6 h-6 text-yellow-500" /> مكافآت الطلاب (XP)</h2>
                            <p className="text-sm text-gray-400 mt-1">ابحث عن الطالب وامنحه نقاط خبرة لتشجيعه</p>
                        </div>
                        {xpSuccess && <div className="bg-green-900/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-xl text-sm font-bold animate-fade-in flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {xpSuccess}</div>}
                    </div>
                    <div className="p-8">
                        <div className="relative mb-6">
                            <Search className="absolute top-3.5 right-4 w-5 h-5 text-gray-400" />
                            <input type="text" placeholder="ابحث عن اسم الطالب..." value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} className="w-full px-12 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-white transition-all" />
                        </div>
                        <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar p-1">
                            {loadingStudents ? <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div> : studentSearch === '' ? <div className="text-center py-8 text-gray-400 text-sm">ابدأ الكتابة للبحث عن الطلاب...</div> : filteredStudents.length === 0 ? <div className="text-center py-8 text-gray-400 text-sm">لا يوجد طلاب بهذا الاسم</div> : filteredStudents.map(student => (
                                    <div key={student.id} className="flex items-center justify-between bg-gray-900/50 p-4 rounded-2xl border border-gray-700 hover:border-blue-700 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">{student.avatar ? <img src={student.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-gray-400" />}</div>
                                            <div>
                                                <h4 className="font-bold text-white text-sm">{student.displayName}</h4>
                                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                                    <span className="bg-yellow-500/10 text-yellow-400 px-1.5 rounded font-bold flex items-center gap-0.5"><Flame className="w-3 h-3" /> {student.totalXP || 0}</span>
                                                    <span>• {student.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <select className="bg-gray-800 border border-gray-700 text-gray-300 text-xs font-bold rounded-lg px-2 py-2 outline-none" value={xpAmount} onChange={(e) => setXpAmount(e.target.value)}>
                                                <option value="10">+10 XP</option>
                                                <option value="50">+50 XP</option>
                                                <option value="100">+100 XP</option>
                                                <option value="200">+200 XP</option>
                                                <option value="500">+500 XP</option>
                                            </select>
                                            <button onClick={() => handleGiveXP(student.id, student.displayName)} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors shadow-lg shadow-blue-500/30" title="إرسال النقاط"><Send className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>

            {showAnnouncementModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-gray-900 rounded-3xl w-full max-w-md shadow-2xl animate-fade-in-up overflow-hidden border border-gray-700">
                        <div className="bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="bg-orange-900/30 p-2 rounded-xl">
                                    <Megaphone className="w-6 h-6 text-orange-400" />
                                </div>
                                <h2 className="text-xl font-black text-white">إضافة تحديث عام</h2>
                            </div>
                            <button onClick={() => setShowAnnouncementModal(false)} className="p-2 hover:bg-gray-700 rounded-full text-gray-400"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6">
                            <label className="block text-sm font-bold text-gray-300 mb-2">عنوان التحديث</label>
                            <input 
                                type="text" 
                                value={announcementTitle}
                                onChange={(e) => setAnnouncementTitle(e.target.value)}
                                placeholder="مثال: تم إضافة اختبارات جديدة للصف العاشر"
                                className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800 text-white focus:border-orange-500 outline-none mb-6"
                            />
                            <button 
                                onClick={handleSaveAnnouncement}
                                disabled={isSavingAnnouncement}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                            >
                                {isSavingAnnouncement ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                نشر التحديث وإرسال إشعار
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
      );
  }

  return (
    <>
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 animate-fade-in-up relative z-20 pb-40">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 lg:order-1 space-y-8">
                    <div className="bg-gray-900 rounded-[3rem] shadow-xl border border-gray-700 relative group z-20">
                        <div 
                            className={`relative w-full h-48 md:h-64 transition-all duration-500 rounded-t-[3rem] overflow-hidden ${getBackgroundClass(user?.profileBackground)}`} 
                            style={getBackgroundStyle(user?.profileBackground)}
                        >
                            <button onClick={() => setShowBackgroundModal(true)} className="absolute top-4 left-4 bg-black/30 hover:bg-black/50 text-white backdrop-blur-md px-4 py-2 rounded-full text-xs md:text-sm font-bold flex items-center gap-2 transition-all border border-white/20 z-20"><Palette className="w-4 h-4" /> تغيير الخلفية</button>
                            <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-2 backdrop-blur-md shadow-lg border-2 z-10 ${currentRank.color}`}><currentRank.icon className="w-4 h-4" /> {currentRank.title}</div>
                        </div>
                        
                        <div className="absolute top-28 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:top-40 md:right-12 z-20">
                            <div className="relative group cursor-pointer" onClick={() => setShowAvatarModal(true)}>
                                <div className={`w-32 h-32 md:w-44 md:h-44 rounded-full border-[4px] md:border-[6px] overflow-hidden bg-gray-700 relative z-10 flex items-center justify-center transition-all duration-300 shadow-xl ${getAvatarBorderClass(level)}`}>
                                    {user?.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" /> : <User className="w-16 h-16 text-gray-500" />}
                                </div>
                                <div className="absolute bottom-2 right-2 bg-emerald-500 text-white p-2 rounded-full border-4 border-gray-800 shadow-sm z-20 hover:bg-emerald-600 transition-colors"><Edit3 className="w-4 h-4" /></div>
                            </div>
                        </div>

                        <div className="pt-20 md:pt-24 px-5 md:px-8 pb-8">
                            <div className="flex flex-col items-center md:items-start text-center md:text-right">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-1 w-full">
                                    <h2 className="text-3xl font-black text-white">
                                        {user?.displayName}
                                    </h2>
                                    {user?.isSubscriber && (
                                        <Crown className="w-6 h-6 text-amber-400 fill-amber-400 animate-pulse" />
                                    )}
                                </div>
                                
                                <div 
                                    className="flex items-center gap-2 mb-4 bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700/50 hover:bg-gray-800 transition-colors group cursor-pointer w-fit mx-auto md:mx-0" 
                                    title="نسخ المعرف" 
                                    onClick={() => {
                                        navigator.clipboard.writeText(user?.uid || '');
                                        setShowIdCopied(true);
                                        setTimeout(() => setShowIdCopied(false), 2000);
                                    }}
                                >
                                    <Copy className="w-3.5 h-3.5 text-gray-500 group-hover:text-emerald-400 transition-colors" />
                                    <span className="text-[10px] font-mono text-gray-500 group-hover:text-gray-300 transition-colors tracking-wider">ID: {user?.uid.substring(0, 8).toUpperCase()}...</span>
                                </div>

                                <div className="flex items-center justify-center md:justify-start gap-2 text-sm font-medium mb-6 w-full">
                                    <span className="text-gray-400">{user?.email}</span>
                                    <span className="text-gray-300">•</span>
                                    <span className={`flex items-center gap-1 ${getLevelTextStyle(level)}`}>
                                        <Trophy className="w-3 h-3" /> المستوى {level}
                                    </span>
                                </div>
                            </div>

                            <form onSubmit={handleSaveProfile} className="space-y-6 border-t border-gray-700 pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2"><h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4"><User className="w-5 h-5 text-blue-500" /> البيانات الشخصية</h3></div>
                                    
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">الاسم الأول</label>
                                        <input type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className={inputClasses} />
                                    </div>
                                    
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">اسم العائلة</label>
                                        <input type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className={inputClasses} />
                                    </div>
                                    
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">الجنس</label>
                                        <CustomSelect 
                                            options={genderOptions}
                                            value={formData.gender}
                                            onChange={(val) => !user?.genderChanged && setFormData({...formData, gender: val as 'male' | 'female'})}
                                            placeholder="اختر الجنس"
                                            disabled={user?.genderChanged}
                                        />
                                        {user?.genderChanged && <p className="text-[10px] text-red-400 mt-1 mr-1 flex items-center gap-1"><Lock className="w-3 h-3" /> تم تثبيت الجنس ولا يمكن تغييره مرة أخرى</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">رقم الهاتف</label>
                                        <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={inputClasses} />
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">المدينة</label>
                                        <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className={inputClasses} />
                                    </div>
                                    
                                    <div className="md:col-span-2 mt-2"><h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4"><GraduationCap className="w-5 h-5 text-emerald-500" /> البيانات الأكاديمية</h3></div>
                                    
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">المدرسة</label>
                                        <input type="text" value={formData.school} onChange={(e) => setFormData({...formData, school: e.target.value})} className={inputClasses} />
                                    </div>
                                    
                                    <div className="relative">
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">الصف الدراسي</label>
                                        <CustomSelect 
                                            options={gradeOptions}
                                            value={formData.grade}
                                            onChange={(val) => setFormData({...formData, grade: val})}
                                            placeholder="اختر الصف"
                                        />
                                    </div>

                                    {formData.grade === 'university' && (
                                        <div className="md:col-span-2 animate-fade-in">
                                            <label className="text-xs font-bold text-blue-400 mb-1 block">اسم الجامعة / التخصص</label>
                                            <input 
                                                type="text" 
                                                value={formData.universityName || formData.school} 
                                                onChange={(e) => setFormData({...formData, universityName: e.target.value})} 
                                                placeholder="اكتب اسم الجامعة والتخصص..."
                                                className={`${inputClasses} border-blue-500 bg-blue-900/10`} 
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center justify-end pt-4 gap-4">
                                     {successMsg && <span className="text-green-600 font-bold text-sm animate-fade-in flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> {successMsg}</span>}
                                     <button type="submit" disabled={isLoading} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/20 flex items-center gap-2">{isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} حفظ التعديلات</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                
                <div className="lg:col-span-5 lg:order-2 space-y-6 mt-8 lg:mt-0">
                    <div className={`bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-700 rounded-3xl md:rounded-[2.5rem] shadow-2xl p-3 md:p-6 text-white relative overflow-hidden border-2 md:border-4 border-gray-800 ring-2 md:ring-4 ring-gray-900`}>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500 opacity-20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
                        <div className="flex items-center justify-between mb-2 md:mb-6 relative z-10">
                           <div className="flex items-center gap-3 md:gap-4">
                              <div className="relative">
                                 <div className="absolute inset-0 bg-yellow-400 blur-md opacity-50 rounded-full"></div>
                                 <div className="p-2 md:p-3 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-2xl shadow-lg relative border border-white/30"><currentRank.icon className="w-6 h-6 md:w-8 md:h-8 text-white" /></div>
                              </div>
                              <div>
                                 <h3 className="text-lg md:text-3xl font-black tracking-tight">المستوى {level}</h3>
                                 <p className="text-indigo-100 text-[10px] md:text-xs font-bold flex items-center gap-1.5 mt-1 bg-black/20 px-3 py-0.5 rounded-full w-fit"><Flame className="w-3 h-3 text-orange-400 fill-orange-400" /> {totalXP} XP</p>
                              </div>
                           </div>
                        </div>
                        <div className="relative mb-6 md:mb-8">
                            <div className="flex justify-between text-[10px] md:text-xs font-bold text-indigo-200 mb-1 px-1"><span>{currentRank.title}</span><span>المستوى التالي {level + 1}</span></div>
                            <div className="w-full bg-black/30 h-3 md:h-3.5 rounded-full relative overflow-hidden backdrop-blur-sm border border-white/10"><div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 h-full rounded-full transition-all duration-1000 ease-out relative shadow-[0_0_10px_rgba(251,191,36,0.5)]" style={{ width: `${progressToNextLevel}%` }}><div className="absolute inset-0 bg-white/30 w-full h-full animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div></div></div>
                        </div>
                        <div className="bg-black/20 rounded-2xl p-3 md:p-5 backdrop-blur-md border border-white/10">
                            <h4 className="text-xs md:text-sm font-bold text-indigo-100 mb-2 flex items-center gap-2"><Crown className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" /> اللقب الحالي</h4>
                            <div className="text-base md:text-xl font-black text-white tracking-wide mb-1">{currentRank.title}</div>
                            <div className="text-[10px] md:text-xs text-indigo-200">واصل التقدم لفتح ألقاب ومظاهر جديدة!</div>
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-3xl shadow-sm border border-gray-700 p-4 md:p-5">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-gray-700 pb-3"><div className="p-2 bg-yellow-900/30 rounded-lg"><Medal className="w-5 h-5 text-yellow-400" /></div> الأوسمة</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                            {BADGES.map((badge, idx) => {
                                const isUnlocked = badge.condition(userStats);
                                return (
                                    <button 
                                        key={idx} 
                                        onClick={() => setSelectedBadgeInfo({ badge, isUnlocked })}
                                        className={`relative p-2 rounded-xl border flex flex-col items-center text-center transition-all hover:scale-105 active:scale-95 ${isUnlocked ? 'bg-gray-700/50 border-gray-600 shadow-sm hover:shadow-md cursor-pointer' : 'bg-gray-800/50 border-gray-700 opacity-60 grayscale hover:opacity-100 cursor-pointer'}`}
                                    >
                                        <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center mb-1 ${isUnlocked ? badge.bg : 'bg-gray-700'}`}><badge.icon className={`w-4 h-4 md:w-5 md:h-5 ${isUnlocked ? badge.color : 'text-gray-400'}`} /></div>
                                        <h4 className="font-bold text-[9px] text-gray-300 leading-tight line-clamp-1">{badge.title}</h4>
                                        {!isUnlocked && <div className="absolute top-1 right-1"><Lock className="w-2.5 h-2.5 text-gray-500" /></div>}
                                    </button>
                                );
                            })}
                        </div>

                        {selectedBadgeInfo && (
                            <div className="mt-4 bg-gray-800/80 rounded-2xl p-4 border border-gray-700 animate-fade-in flex items-start gap-4 relative">
                                <button 
                                    onClick={() => setSelectedBadgeInfo(null)} 
                                    className="absolute top-3 left-3 text-gray-500 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${selectedBadgeInfo.isUnlocked ? selectedBadgeInfo.badge.bg : 'bg-gray-700'}`}>
                                    <selectedBadgeInfo.badge.icon className={`w-6 h-6 ${selectedBadgeInfo.isUnlocked ? selectedBadgeInfo.badge.color : 'text-gray-400'}`} />
                                </div>
                                
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-white mb-1">{selectedBadgeInfo.badge.title}</h4>
                                    
                                    <div className="text-xs mb-1">
                                        <span className={`font-bold ${selectedBadgeInfo.isUnlocked ? 'text-emerald-400' : 'text-gray-400'}`}>
                                            {selectedBadgeInfo.isUnlocked ? 'طريقة الحصول: ' : 'المتطلبات: '}
                                        </span>
                                        <span className="text-gray-300">{selectedBadgeInfo.badge.desc}</span>
                                    </div>
                                    
                                    {!selectedBadgeInfo.isUnlocked && (
                                        <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-500">
                                            <Lock className="w-3 h-3" />
                                            <span>واصل التقدم لفتح هذا الوسام</span>
                                        </div>
                                    )}
                                     {selectedBadgeInfo.isUnlocked && (
                                        <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-500">
                                            <CheckCircle2 className="w-3 h-3" />
                                            <span>وسام مكتسب</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-900 rounded-3xl shadow-sm border border-gray-700 p-4 hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><div className="p-2 bg-emerald-900/30 rounded-lg"><TrendingUp className="w-5 h-5 text-emerald-400" /></div> أداء آخر الاختبارات</h3>
                        {statsLoading ? <div className="h-16 flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-emerald-500" /></div> : (
                            <div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-gray-800/50 p-2 rounded-2xl border border-gray-700 flex flex-col items-center justify-center h-16">
                                        <span className="text-gray-400 text-[9px] font-bold mb-1">المعدل التراكمي</span>
                                        <span className={`text-xl md:text-2xl font-black ${avgScore >= 85 ? 'text-emerald-400' : 'text-white'}`}>{avgScore}%</span>
                                    </div>
                                    <div className={`p-2 rounded-2xl border ${perf.bg} ${perf.border} flex flex-col items-center justify-center h-16`}>
                                        <span className="text-gray-400 text-[9px] font-bold mb-1">المستوى العام</span>
                                        <span className={`text-base md:text-lg font-black ${perf.color}`}>{perf.label}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-900 rounded-3xl shadow-sm border border-gray-700 p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <div className="p-2 bg-blue-900/30 rounded-lg">
                                    <History className="w-5 h-5 text-blue-400" />
                                </div>
                                سجل آخر الاختبارات
                            </h3>
                        </div>
                        
                        {quizHistory.length === 0 ? (
                            <div className="text-center py-6 text-gray-500 text-sm">
                                <FileCheck className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p>لم تقم بأي اختبارات بعد</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                                {quizHistory.map((quiz, idx) => {
                                    const date = quiz.createdAt ? (quiz.createdAt.seconds ? new Date(quiz.createdAt.seconds * 1000) : new Date(quiz.createdAt)) : new Date();
                                    const formattedDate = date.toLocaleDateString('ar-EG');
                                    
                                    return (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-800/50 border border-gray-700 hover:bg-gray-800 transition-colors">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-l-4 ${quiz.passed ? 'bg-emerald-900/20 text-emerald-400 border-emerald-500' : 'bg-red-900/20 text-red-400 border-red-500'}`}>
                                                    {quiz.passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-bold text-white text-xs truncate mb-0.5">{quiz.quizTitle}</h4>
                                                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                                        <span className="bg-gray-700 px-1.5 py-0.5 rounded text-[9px]">{quiz.subject}</span>
                                                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                                        <span className="dir-ltr font-mono">{formattedDate}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`font-black text-sm ${quiz.percentage >= 80 ? 'text-emerald-400' : quiz.percentage >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                {quiz.percentage}%
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>

        {showIdCopied && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up-fade">
                <div className="bg-gray-800/90 backdrop-blur-md border border-gray-700 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
                    <div className="bg-emerald-500/20 p-1 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="font-bold text-sm">تم نسخ معرف الطالب بنجاح</span>
                </div>
            </div>
        )}

        {showAvatarModal && (
            <div className="fixed inset-0 z-[200] flex items-start justify-center p-4 pt-10 md:pt-16 bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="bg-gray-900 rounded-3xl w-full max-w-sm max-h-[85vh] flex flex-col shadow-2xl border border-gray-700 overflow-hidden relative">
                    <div className="p-4 border-b border-gray-800 flex justify-between items-center shrink-0">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2"><User className="w-5 h-5 text-purple-500" /> اختر شخصيتك</h3>
                        <button onClick={() => setShowAvatarModal(false)} className="p-1.5 hover:bg-gray-800 rounded-full transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        <div className="grid grid-cols-3 gap-3">
                            {ALL_AVATARS.map((avatar, idx) => {
                                const isLocked = level < avatar.minLevel;
                                return (
                                    <button key={idx} onClick={() => !isLocked && setSelectedAvatar(avatar.url)} disabled={isLocked} className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all bg-gray-800 ${selectedAvatar === avatar.url ? 'border-emerald-500 shadow-md ring-2 ring-emerald-900/30' : 'border-transparent hover:border-gray-600'} ${isLocked ? 'opacity-60 grayscale' : 'hover:scale-105 active:scale-95'}`}>
                                        <img src={avatar.url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                                        {isLocked && <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white backdrop-blur-[1px]"><Lock className="w-4 h-4 mb-0.5" /><span className="text-[10px] font-bold">مستوى {avatar.minLevel}</span></div>}
                                        {!isLocked && selectedAvatar === avatar.url && <div className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm"><CheckCircle2 className="w-3 h-3" /></div>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="p-4 border-t border-gray-800 shrink-0">
                        <button onClick={handleSaveAvatar} disabled={isLoading} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 dark:shadow-none flex items-center justify-center gap-2">{isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} حفظ الشخصية</button>
                    </div>
                </div>
            </div>
        )}
        
        {showBackgroundModal && (
            <div className="fixed inset-0 z-[200] flex items-start justify-center p-4 pt-10 md:pt-16 bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="bg-gray-900 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl border border-gray-700 overflow-hidden relative">
                    <div className="p-5 border-b border-gray-800 flex justify-between items-center shrink-0">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2"><Palette className="w-6 h-6 text-emerald-500" /> تغيير الخلفية</h3>
                        <button onClick={() => setShowBackgroundModal(false)} className="p-2 hover:bg-gray-800 rounded-full transition-colors"><X className="w-6 h-6 text-gray-500" /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {BACKGROUND_OPTIONS.map((bg, idx) => {
                                const isLocked = level < bg.minLevel;
                                const isActive = selectedBackground === bg.url;
                                return (
                                    <button key={idx} onClick={() => !isLocked && setSelectedBackground(bg.url)} disabled={isLocked} className={`relative h-28 rounded-2xl overflow-hidden border-4 transition-all duration-300 group ${isActive ? 'border-emerald-500 scale-[1.02] shadow-md' : 'border-transparent'} ${isLocked ? 'opacity-60 cursor-not-allowed grayscale' : 'hover:scale-[1.02] cursor-pointer'}`}>
                                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bg.url})` }}></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            {isLocked ? <div className="bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-sm flex items-center gap-1.5"><Lock className="w-4 h-4 text-white" /><span className="text-xs text-white font-bold">مستوى {bg.minLevel}</span></div> : isActive && <CheckCircle2 className="w-8 h-8 text-white drop-shadow-md" />}
                                        </div>
                                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-2 text-center"><span className="text-xs font-bold text-white drop-shadow-md">{bg.name}</span></div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="p-5 border-t border-gray-800 shrink-0 flex justify-end gap-3">
                        <button onClick={() => setShowBackgroundModal(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-800 transition-colors">إلغاء</button>
                        <button onClick={handleSaveBackground} disabled={isLoading} className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 dark:shadow-none flex items-center justify-center gap-2">{isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "حفظ الخلفية"}</button>
                    </div>
                </div>
            </div>
        )}
    </>
  );
};

export default StudentProfile;
