
import { 
  ArrowRight, 
  BookOpen, 
  ChevronLeft, 
  GraduationCap, 
  Layers, 
  PenTool, 
  Languages, 
  Home, 
  Book,
  FileText,
  Loader2,
  Calendar,
  User,
  MessageSquare,
  Send,
  CheckCircle,
  Calculator,
  FlaskConical,
  Crown,
  Lock,
  Monitor,
  Backpack,
  University,
  RotateCcw,
  CalendarDays,
  Globe,
  ChevronRight,
  X
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy, addDoc, serverTimestamp, getDocsFromServer } from 'firebase/firestore';
import { Explanation, AppView } from '../types';
import { useAuth } from '../contexts/AuthContext';
import ExplanationViewer from './ExplanationViewer';

interface SubjectExplanationsProps {
  onBack: () => void;
  onNavigate: (view: AppView) => void;
}

const CATEGORIES = [
  { id: 'grammar', title: 'القواعد', sub: 'Grammar', icon: Layers, desc: 'شرح الأزمنة وتراكيب الجمل' },
  { id: 'reading', title: 'القطع', sub: 'Reading', icon: BookOpen, desc: 'شرح نصوص الكتاب والقطع الخارجية' },
  { id: 'vocabulary', title: 'المفردات', sub: 'Vocab', icon: Languages, desc: 'معاني الكلمات والمصطلحات الهامة' },
  { id: 'writing', title: 'الكتابة', sub: 'Writing', icon: PenTool, desc: 'كيفية كتابة المواضيع والرسائل' }
];

const SUBJECTS = [ 
    { 
        id: 'English', 
        title: 'English Language', 
        subtitle: 'اللغة الإنجليزية', 
        icon: Globe, 
        color: 'from-emerald-600 to-emerald-900',
        borderColor: 'border-emerald-500/30'
    } 
];

const SubjectExplanations: React.FC<SubjectExplanationsProps> = ({ onBack, onNavigate }) => {
  const { user } = useAuth();
  const [viewState, setViewState] = useState<'INTRO' | 'SUBJECTS' | 'GRADES' | 'CATEGORIES' | 'TOPICS' | 'DETAILS'>('INTRO');
  
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[0] | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<'First' | 'Second'>('First');
  
  const [topics, setTopics] = useState<Explanation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedExplanation, setSelectedExplanation] = useState<Explanation | null>(null);

  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Semester Theme Colors
  const themeClass = selectedSemester === 'First' 
    ? { 
        text: 'text-emerald-400', 
        bg: 'bg-emerald-600', 
        bgLight: 'bg-emerald-900/20', 
        border: 'border-emerald-500/30',
        hover: 'hover:border-emerald-500/60'
      } 
    : { 
        text: 'text-blue-400', 
        bg: 'bg-blue-600', 
        bgLight: 'bg-blue-900/20', 
        border: 'border-blue-500/30',
        hover: 'hover:border-blue-500/60'
      };

  useEffect(() => {
    window.history.replaceState({ view: 'LESSONS_EXPLANATIONS', subView: 'INTRO' }, '', '');
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.subView) setViewState(event.state.subView);
      else viewState === 'INTRO' ? (onBack && onBack()) : setViewState('INTRO');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [viewState, onBack]); 

  const navigateTo = (newState: typeof viewState) => {
      window.history.pushState({ view: 'LESSONS_EXPLANATIONS', subView: newState }, '', '');
      setViewState(newState);
  };

  const goBack = () => {
    if (viewState === 'DETAILS') navigateTo('TOPICS');
    else if (viewState === 'TOPICS') navigateTo('CATEGORIES');
    else if (viewState === 'CATEGORIES') navigateTo('GRADES');
    else if (viewState === 'GRADES') navigateTo('SUBJECTS');
    else if (viewState === 'SUBJECTS') navigateTo('INTRO');
    else onBack();
  };

  const handleExit = () => {
      onBack();
  };

  const isUserActiveSubscriber = () => {
      if (!user?.isSubscriber || !user.subscriptionExpiry) return false;
      const expiryTime = user.subscriptionExpiry.seconds ? user.subscriptionExpiry.seconds * 1000 : new Date(user.subscriptionExpiry).getTime();
      return Date.now() < expiryTime;
  };

  const handleTopicSelect = (explanation: Explanation) => {
      if (explanation.isPremium && !isUserActiveSubscriber()) { setShowPremiumModal(true); return; }
      setSelectedExplanation(explanation);
      navigateTo('DETAILS');
  };

  useEffect(() => {
    if (viewState === 'TOPICS' && selectedGrade && selectedCategory && selectedSubject) fetchExplanations();
  }, [viewState, selectedGrade, selectedCategory, selectedSubject, selectedSemester]);

  const fetchExplanations = async () => {
      setLoading(true);
      try {
          const q = query(collection(db, "explanations"), where("subject", "==", selectedSubject), where("grade", "==", selectedGrade), where("category", "==", selectedCategory?.id));
          const snapshot = await getDocsFromServer(q);
          const fetchedTopics: Explanation[] = [];
          snapshot.forEach(docSnap => {
              const d = docSnap.data();
              // STRICT POJO Mapping to prevent circular reference errors
              fetchedTopics.push({ 
                  id: docSnap.id, 
                  title: String(d.title || ''),
                  content: String(d.content || ''),
                  category: String(d.category || ''),
                  grade: String(d.grade || ''),
                  subject: String(d.subject || ''),
                  semester: d.semester || 'First',
                  teacherName: String(d.teacherName || ''),
                  teacherId: String(d.teacherId || ''),
                  isPremium: Boolean(d.isPremium),
                  backgroundStyle: String(d.backgroundStyle || 'exp-bg-default'),
                  createdAt: d.createdAt ? { seconds: d.createdAt.seconds } : null
              } as Explanation);
          });
          const filtered = fetchedTopics.filter(t => (t.semester || 'First') === selectedSemester);
          filtered.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
          setTopics(filtered);
      } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const ExitButton = () => (
      <div className="fixed top-6 left-6 z-[100] animate-fade-in">
          <button 
            onClick={handleExit}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-2xl font-black text-sm shadow-2xl transition-all active:scale-95 border border-red-500/50"
            title="خروج من الشروحات"
          >
              <X className="w-4 h-4" />
              <span>خروج</span>
          </button>
      </div>
  );

  const renderIntro = () => (
    <div className="min-h-screen bg-gray-950 animate-fade-in flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 z-0">
            <video autoPlay loop muted playsInline preload="auto" className="w-full h-full object-cover">
                <source src="https://drive.google.com/uc?export=download&id=1wHw0wEWltdWfMqblwZLRgLKZ_ah3lCKm" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gray-950/70"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 text-center pt-10">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl">أتقن <span className="text-emerald-400">موادك الدراسية</span></h1>
            <p className="text-gray-200 text-lg md:text-2xl max-w-2xl mx-auto mb-12 font-medium">مكتبة شروحات شاملة ومبسطة للمرحلة المدرسية.</p>
            <button onClick={() => navigateTo('SUBJECTS')} className="bg-white text-gray-900 text-xl font-black px-12 py-5 rounded-2xl shadow-2xl flex items-center gap-3 active:scale-95 transition-transform">تصفح الشروحات <ArrowRight className="w-6 h-6" /></button>
        </div>
        <div className="p-6 text-center relative z-10">
            <button onClick={onBack} className="text-white/70 font-bold hover:text-white flex items-center gap-2 mx-auto transition-colors">
                <Home className="w-4 h-4" /> العودة للرئيسية
            </button>
        </div>
    </div>
  );

  const renderSubjects = () => (
    <div className="min-h-screen bg-gray-950 p-6 md:p-12 animate-fade-in relative flex flex-col">
        <ExitButton />
        <div className="max-w-4xl mx-auto flex-1 flex flex-col justify-center w-full">
            <div className="mb-12 flex flex-col items-center">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-4">اختر المادة الدراسية</h2>
                <p className="text-gray-500 font-bold">ابدأ رحلتك باختيار المادة التي ترغب في مراجعتها</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {SUBJECTS.map(s => (
                    <button 
                        key={s.id} 
                        onClick={() => {setSelectedSubject(s.id); navigateTo('GRADES');}} 
                        className={`group relative bg-gradient-to-br ${s.color} p-1 rounded-[2.5rem] shadow-2xl transition-all hover:-translate-y-2 active:scale-95`}
                    >
                        <div className="bg-gray-900/90 backdrop-blur-xl p-8 md:p-10 rounded-[2.4rem] h-full flex flex-col items-center gap-6 border border-white/5">
                            <div className="w-24 h-24 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-inner group-hover:scale-110 transition-transform">
                                <s.icon className="w-12 h-12" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-3xl font-black text-white mb-2 tracking-tight">{s.title}</h3>
                                <div className="inline-block bg-emerald-900/30 text-emerald-400 px-4 py-1 rounded-full text-sm font-bold border border-emerald-500/20">
                                    {s.subtitle}
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-gray-500 font-bold text-sm">
                                اضغط للبدء <ChevronLeft className="w-4 h-4" />
                            </div>
                        </div>
                    </button>
                ))}
            </div>
            
            <div className="mt-12 text-center">
                <button onClick={goBack} className="text-gray-500 font-bold hover:text-white transition-colors flex items-center gap-2 mx-auto w-fit"><ArrowRight className="w-4 h-4" /> عودة للسابقة</button>
            </div>
        </div>
    </div>
  );

  const renderGrades = () => (
    <div className="min-h-screen bg-gray-950 p-6 md:p-12 animate-fade-in flex flex-col items-center justify-center">
        <ExitButton />
        <div className="max-w-4xl mx-auto w-full">
            <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
                <div>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-2">أي صف تدرس؟</h2>
                    <p className="text-gray-500 font-bold">اختر صفك الدراسي لعرض الشروحات المخصصة لك</p>
                </div>
                <button onClick={goBack} className="bg-gray-900 border border-gray-800 text-gray-400 hover:text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 transition-all">
                    <ArrowRight className="w-5 h-5" /> عودة
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[5,6,7,8,9,10,11,12].map(g => (
                    <button 
                        key={g} 
                        onClick={() => {setSelectedGrade(g.toString()); navigateTo('CATEGORIES');}} 
                        className="group relative bg-gray-900 p-6 rounded-[1.8rem] border border-gray-800 hover:border-emerald-500 transition-all flex flex-col items-center justify-center gap-3 hover:bg-gray-800 shadow-lg active:scale-95"
                    >
                        <span className="text-4xl font-black text-white group-hover:text-emerald-400 transition-colors">{g}</span>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Grade</span>
                    </button>
                ))}
            </div>
        </div>
    </div>
  );

  const renderCategories = () => (
    <div className="min-h-screen bg-gray-950 p-6 md:p-12 animate-fade-in flex flex-col items-center justify-center">
        <ExitButton />
        <div className="max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between mb-10 text-center md:text-right">
                <div className="flex-1">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-2">ماذا تريد أن تتعلم؟</h2>
                    <p className="text-gray-500 text-sm font-bold">اختر القسم والدروس المناسبة لصفك</p>
                </div>
                <button onClick={goBack} className={`bg-gray-900 border ${themeClass.border} ${themeClass.text} hover:bg-gray-800 px-8 py-3 rounded-2xl font-black flex items-center gap-2 transition-all`}>
                    <ArrowRight className="w-5 h-5" /> عودة
                </button>
            </div>

            <div className="max-w-xs mx-auto mb-12 flex bg-gray-900/50 p-1.5 rounded-2xl border border-gray-800 shadow-inner">
                <button 
                    onClick={()=>setSelectedSemester('First')} 
                    className={`flex-1 py-3 rounded-xl font-black text-sm transition-all duration-300 ${selectedSemester === 'First' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    الفصل الأول
                </button>
                <button 
                    onClick={()=>setSelectedSemester('Second')} 
                    className={`flex-1 py-3 rounded-xl font-black text-sm transition-all duration-300 ${selectedSemester === 'Second' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    الفصل الثاني
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {CATEGORIES.map(c => (
                    <button 
                        key={c.id} 
                        onClick={() => {setSelectedCategory(c); navigateTo('TOPICS');}} 
                        className={`group bg-gray-900 p-5 md:p-6 rounded-[2rem] border transition-all flex flex-col items-center gap-3 text-center shadow-md active:scale-95 ${themeClass.border} ${themeClass.hover}`}
                    >
                        <div className={`p-3 rounded-2xl transition-colors ${themeClass.bgLight} ${themeClass.text} group-hover:scale-110 duration-300`}>
                            <c.icon className="w-8 h-8 md:w-10 md:h-10" />
                        </div>
                        <div>
                            <h3 className="text-lg md:text-xl font-black text-white mb-0.5">{c.title}</h3>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    </div>
  );

  const renderTopics = () => (
    <div className="min-h-screen bg-gray-950 p-6 md:p-12 animate-fade-in flex flex-col">
        <ExitButton />
        <div className="max-w-3xl mx-auto w-full flex-1">
            <div className="flex items-center justify-between mb-8 text-right">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${themeClass.bgLight} ${themeClass.text}`}>
                        {selectedCategory?.icon && <selectedCategory.icon className="w-6 h-6" />}
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-white">{selectedCategory?.title}</h2>
                        <p className="text-gray-500 text-sm font-bold">قائمة الدروس المتاحة</p>
                    </div>
                </div>
                <button onClick={goBack} className={`bg-gray-900 border ${themeClass.border} ${themeClass.text} px-8 py-3 rounded-2xl font-black flex items-center gap-2 transition-all hover:bg-gray-800`}>
                    <ArrowRight className="w-5 h-5" /> عودة
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className={`w-12 h-12 animate-spin ${themeClass.text}`} />
                    <p className="text-gray-500 font-bold">جاري تحميل الدروس...</p>
                </div>
            ) : topics.length === 0 ? (
                <div className="text-center py-20 bg-gray-900/50 rounded-[2.5rem] border border-dashed border-gray-800">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-700" />
                    <h3 className="text-xl font-bold text-gray-400">لا توجد دروس حالياً</h3>
                    <p className="text-gray-600 mt-2">سيتم إضافة شروحات جديدة في أقرب وقت</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {topics.map(t => (
                        <button 
                            key={t.id} 
                            onClick={() => handleTopicSelect(t)} 
                            className={`group bg-gray-900 p-6 rounded-[1.8rem] border transition-all flex justify-between items-center text-right shadow-sm ${themeClass.border} ${themeClass.hover} hover:-translate-x-2 relative overflow-hidden`}
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-gray-500 group-hover:bg-emerald-900/20 group-hover:text-emerald-400 transition-colors">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="font-black text-lg md:text-xl text-white mb-1">{t.title}</div>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 font-bold">
                                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {t.teacherName}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={`p-2 rounded-full ${themeClass.bgLight} ${themeClass.text}`}>
                                <ChevronLeft className="w-6 h-6" />
                            </div>
                            {t.isPremium && <Crown className="absolute top-2 left-2 w-4 h-4 text-amber-500 fill-amber-500" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-gray-950 flex flex-col items-center justify-center text-center p-6">
      <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-gray-950 to-gray-950"></div>
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      </div>
      
      <div className="relative z-10 max-w-md w-full">
          <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.2)] animate-pulse">
              <Clock className="w-12 h-12 text-emerald-400" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">شروحات المواد</h2>
          <div className="inline-block bg-emerald-500/10 text-emerald-400 px-6 py-2 rounded-full text-xl font-black mb-8 border border-emerald-500/20">
              قريباً جداً
          </div>
          
          <p className="text-gray-400 text-lg mb-12 leading-relaxed font-medium">
              نحن نعمل بجد لتجهيز أفضل الشروحات التعليمية المبسطة والمميزة لك. انتظرنا في التحديث القادم!
          </p>
          
          <button 
            onClick={onBack}
            className="w-full bg-white text-gray-900 py-4 rounded-2xl font-black text-lg shadow-2xl hover:bg-gray-100 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <ArrowRight className="w-6 h-6" />
            العودة للرئيسية
          </button>
      </div>
    </div>
  );
};

export default SubjectExplanations;
