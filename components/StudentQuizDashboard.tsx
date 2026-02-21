import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  RefreshCw, 
  List, 
  Eye,
  ShieldAlert,
  Loader2,
  Award,
  LogOut,
  ArrowRight,
  ChevronDown,
  Flame,
  AlertTriangle,
  Lock,
  HelpCircle,
  Home,
  Tag,
  School,
  AlignLeft,
  MoveRight,
  RotateCcw,
  Crown,
  AlertOctagon,
  Star,
  MessageSquare,
  Send,
  PlayCircle,
  Layers,
  FileText,
  PenTool,
  Languages,
  Backpack,
  University,
  CalendarDays,
  PencilLine,
  Trophy,
  History,
  LayoutGrid
} from 'lucide-react';
import { Quiz, Question, AppView } from '../types';
import { db, auth } from '../firebase';
import { collection, onSnapshot, query, where, addDoc, serverTimestamp, doc, setDoc, increment, orderBy } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

interface StudentQuizDashboardProps {
  onBack: () => void;
  onNavigate: (view: AppView) => void;
}

type ViewState = 'SELECTION' | 'ACTIVE' | 'RESULT' | 'REVIEW';

const CATEGORIES: { id: string; label: string }[] = [
    { id: 'All', label: 'الكل (All)' },
    { id: 'General', label: 'اختبار عام (General Quiz)' },
    { id: 'Reading', label: 'Reading (القطعة)' },
    { id: 'Language', label: 'Language (القواعد)' },
    { id: 'Vocabulary', label: 'Vocabulary (المفردات)' },
    { id: 'Writing', label: 'Writing (الكتابة)' }
];

const CATEGORY_PRIORITY: Record<string, number> = {
    'General': 1,
    'Reading': 2,
    'Language': 3,
    'Vocabulary': 4,
    'Writing': 5
};

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
    <div className={`relative ${isOpen ? 'z-50' : 'z-0'}`} ref={containerRef}>
       <button 
         type="button"
         onClick={() => !disabled && setIsOpen(!isOpen)}
         className={`w-full px-5 py-4 rounded-2xl font-bold text-right border-2 flex justify-between items-center outline-none transition-all
            ${disabled 
               ? 'bg-gray-800 border-gray-700 text-gray-400 cursor-not-allowed' 
               : isOpen 
                 ? 'bg-gray-800 border-emerald-500 ring-4 ring-emerald-900/20 text-white shadow-lg' 
                 : 'bg-gray-800 border-transparent hover:border-emerald-700 text-white shadow-sm'
            }
         `}
       >
          <span className={`truncate ${!selectedOption ? 'text-gray-500' : ''}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`} />
       </button>

       {isOpen && (
         <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-2xl shadow-xl max-h-72 overflow-y-auto custom-scrollbar animate-fade-in p-2 z-50">
            {options.map((opt, idx) => {
               if(opt.isHeader) {
                 return <div key={idx} className="px-4 py-2 text-xs font-black text-gray-500 uppercase tracking-wider mt-2 first:mt-0 bg-gray-700/50 rounded-lg mb-1">{opt.label}</div>
               }
               const isSelected = opt.value === value;
               return (
                 <div 
                   key={idx}
                   onClick={() => {
                     onChange(opt.value);
                     setIsOpen(false);
                   }}
                   className={`px-4 py-3 rounded-xl font-bold text-sm cursor-pointer transition-colors flex justify-between items-center mb-1 group
                      ${isSelected 
                        ? 'bg-emerald-900/30 text-emerald-400' 
                        : 'text-gray-300 hover:bg-gray-700'
                      }
                   `}
                 >
                    {opt.label}
                    {isSelected && <CheckCircle className="w-4 h-4" />}
                 </div>
               );
            })}
            {options.length === 0 && (
                <div className="p-4 text-center text-gray-400 text-sm">لا توجد خيارات متاحة</div>
            )}
         </div>
       )}
    </div>
  );
}

const getCategoryTheme = (category: string = 'General') => {
    switch (category) {
        case 'Language': return { 
            label: 'قواعد', 
            bg: 'bg-indigo-500/10', 
            border: 'border-indigo-500/20', 
            text: 'text-indigo-400', 
            hoverBorder: 'group-hover:border-indigo-500/50',
            buttonHover: 'group-hover:bg-indigo-600 group-hover:border-indigo-500 group-hover:text-white',
            icon: Layers 
        };
        case 'Reading': return { 
            label: 'قطعة', 
            bg: 'bg-emerald-500/10', 
            border: 'border-emerald-500/20', 
            text: 'text-emerald-400', 
            hoverBorder: 'group-hover:border-emerald-500/50',
            buttonHover: 'group-hover:bg-emerald-600 group-hover:border-emerald-500 group-hover:text-white',
            icon: FileText 
        };
        case 'Writing': return { 
            label: 'كتابة', 
            bg: 'bg-orange-500/10', 
            border: 'border-orange-500/20', 
            text: 'text-orange-400', 
            hoverBorder: 'group-hover:border-orange-500/50',
            buttonHover: 'group-hover:bg-orange-600 group-hover:border-orange-500 group-hover:text-white',
            icon: PenTool 
        };
        case 'Vocabulary': return { 
            label: 'مفردات', 
            bg: 'bg-purple-500/10', 
            border: 'border-purple-500/20', 
            text: 'text-purple-400', 
            hoverBorder: 'group-hover:border-purple-500/50',
            buttonHover: 'group-hover:bg-purple-600 group-hover:border-purple-500 group-hover:text-white',
            icon: Languages 
        };
        case 'General':
        default: return { 
            label: 'عام', 
            bg: 'bg-gray-700/30', 
            border: 'border-gray-700', 
            text: 'text-gray-400', 
            hoverBorder: 'group-hover:border-gray-500',
            buttonHover: 'group-hover:bg-gray-700 group-hover:border-gray-500 group-hover:text-white',
            icon: BookOpen 
        };
    }
};

const StudentQuizDashboard: React.FC<StudentQuizDashboardProps> = ({ onBack, onNavigate }) => {
  const { user } = useAuth();
  const [view, setView] = useState<ViewState>('SELECTION');

  const [selectedSubject, setSelectedSubject] = useState<string>(''); 
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<'First' | 'Second'>('First');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{[key: number]: any}>({}); 
  const [timeLeft, setTimeLeft] = useState(30 * 60); 
  const [questionTimeLeft, setQuestionTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [reorderShuffles, setReorderShuffles] = useState<{[key: number]: number[]}>({});

  const [showStartConfirm, setShowStartConfirm] = useState(false);
  const [quizToStart, setQuizToStart] = useState<Quiz | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSecurityWarning, setShowSecurityWarning] = useState(false);
  const [isExpelled, setIsExpelled] = useState(false); 
  const [violationCount, setViolationCount] = useState(0);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showResultConfirm, setShowResultConfirm] = useState(false);
  const [pendingResultAction, setPendingResultAction] = useState<'REVIEW' | 'RETAKE' | 'LIST' | 'HOME' | null>(null);

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (!selectedGrade) {
        setQuizzes([]);
        return;
    }

    setIsLoading(true);
    const q = query(
      collection(db, "quizzes"),
      where("grade", "==", selectedGrade)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const quizList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Quiz));
        
        quizList.sort((a, b) => {
            const timeA = a.createdAt?.seconds || 0;
            const timeB = b.createdAt?.seconds || 0;
            return timeB - timeA;
        });

        setQuizzes(quizList);
        setIsLoading(false);
    }, (error) => {
        console.error("Error listening to quizzes:", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [selectedGrade]);

  const isUserActiveSubscriber = () => {
      if (!user?.isSubscriber) return false;
      if (!user.subscriptionExpiry) return false;
      const expiryTime = user.subscriptionExpiry.seconds 
          ? user.subscriptionExpiry.seconds * 1000 
          : new Date(user.subscriptionExpiry).getTime();
      return Date.now() < expiryTime;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  useEffect(() => {
    let timer: any; 
    if (view === 'ACTIVE' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [view, timeLeft]);

  useEffect(() => {
    let qTimer: any;
    if (view === 'ACTIVE' && activeQuiz?.questionDuration && questionTimeLeft !== null) {
        if (questionTimeLeft > 0) {
            qTimer = setInterval(() => {
                setQuestionTimeLeft(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
            }, 1000);
        } else if (questionTimeLeft === 0) {
            handleNextQuestion();
        }
    }
    return () => clearInterval(qTimer);
  }, [view, activeQuiz, questionTimeLeft]);

  useEffect(() => {
      if (activeQuiz?.questionDuration) {
          setQuestionTimeLeft(activeQuiz.questionDuration);
      } else {
          setQuestionTimeLeft(null);
      }
  }, [currentQuestionIndex, activeQuiz]);

  useEffect(() => {
    if (view !== 'ACTIVE') return;
    const handleViolation = () => {
        setViolationCount(prev => {
            const newCount = prev + 1;
            if (newCount === 1) setShowSecurityWarning(true);
            else if (newCount >= 2) {
                setShowSecurityWarning(false);
                setIsExpelled(true);
            }
            return newCount;
        });
    };
    const handleVisibilityChange = () => { if (document.hidden) handleViolation(); };
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'PrintScreen' || (e.ctrlKey && e.key === 'p') || (e.metaKey && e.shiftKey)) {
            e.preventDefault();
            handleViolation();
        }
    };
    const preventDefault = (e: Event) => e.preventDefault();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', preventDefault);
    document.addEventListener('copy', preventDefault);
    document.addEventListener('paste', preventDefault);
    document.addEventListener('cut', preventDefault);
    document.addEventListener('selectstart', preventDefault);
    return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('contextmenu', preventDefault);
        document.removeEventListener('copy', preventDefault);
        document.removeEventListener('paste', preventDefault);
        document.removeEventListener('cut', preventDefault);
        document.removeEventListener('selectstart', preventDefault);
    };
  }, [view]);

  const availableSubjects: string[] = Array.from(new Set(quizzes.map(q => q.subject)));

  const displayedQuizzes = quizzes.filter(q => {
      const matchSubject = selectedSubject ? q.subject === selectedSubject : true;
      const matchCategory = selectedCategory && selectedCategory !== 'All' ? q.category === selectedCategory : true;
      const quizSemester = q.semester || 'First';
      const matchSemester = quizSemester === selectedSemester;
      return matchSubject && matchCategory && matchSemester;
  });

  const handleStartClick = (quiz: Quiz) => {
      const isSubscribed = isUserActiveSubscriber();
      if (quiz.isPremium && !isSubscribed) {
          setShowPremiumModal(true);
          return;
      }
      setQuizToStart(quiz);
      setShowStartConfirm(true);
  };

  const startQuizSession = (targetQuiz: Quiz) => {
    if (!targetQuiz.questions || targetQuiz.questions.length === 0) {
        alert("عذراً، لا يوجد أسئلة في هذا الاختبار");
        return;
    }
    let processedQuestions = [...targetQuiz.questions];
    if (!targetQuiz.keepOrder) processedQuestions.sort(() => Math.random() - 0.5);
    processedQuestions = processedQuestions.map(q => {
        if (q.type === 'MCQ' || q.type === 'TF' || q.type === 'READING') {
            const optionsWithIndex = q.options.map((opt, i) => ({ opt, originalIndex: i }));
            optionsWithIndex.sort(() => Math.random() - 0.5);
            const newOptions = optionsWithIndex.map(item => item.opt);
            const newCorrectIndex = optionsWithIndex.findIndex(item => item.originalIndex === q.correctAnswer);
            return { ...q, options: newOptions, correctAnswer: newCorrectIndex };
        }
        return q; 
    });
    const quizWithShuffledContent = { ...targetQuiz, questions: processedQuestions };
    const shuffles: {[key: number]: number[]} = {};
    processedQuestions.forEach((q, idx) => {
        if (q.type === 'REORDER') {
            const indices = q.options.map((_, i) => i);
            for (let i = indices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [indices[i], indices[j]] = [indices[j], indices[i]];
            }
            shuffles[idx] = indices;
        }
    });
    setReorderShuffles(shuffles);
    setActiveQuiz(quizWithShuffledContent);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTimeLeft(targetQuiz.duration ? targetQuiz.duration * 60 : 30 * 60);
    setEarnedXP(0);
    setViolationCount(0); 
    setIsExpelled(false); 
    setShowStartConfirm(false);
    setQuizToStart(null);
    setView('ACTIVE');
  };

  const confirmStartQuiz = () => quizToStart && startQuizSession(quizToStart);

  const handleAnswerSelect = (value: any) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: value }));
  };

  const handleNextQuestion = () => {
    if (!activeQuiz) return;
    setQuestionTimeLeft(null);
    if (currentQuestionIndex < activeQuiz.questions.length - 1) setCurrentQuestionIndex(prev => prev + 1);
    else handleSubmitQuiz();
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz || !user) { setView('RESULT'); return; }
    setIsSubmitting(true);
    const score = calculateScore();
    const percentage = Math.round((score / activeQuiz.questions.length) * 100);
    let finalXP = score * 30;
    setEarnedXP(finalXP);
    try {
      if (user.role === 'teacher' || user.role === 'guest') { 
        setView('RESULT'); 
        setIsSubmitting(false); 
        return; 
      }
      const currentUid = auth.currentUser?.uid || user.uid;
      await addDoc(collection(db, "quiz_results"), {
        userId: currentUid,
        userName: user.displayName,
        quizId: activeQuiz.id || 'unknown',
        quizTitle: activeQuiz.title,
        subject: activeQuiz.subject,
        score: score,
        totalQuestions: activeQuiz.questions.length,
        percentage: percentage,
        passed: percentage >= 50,
        earnedXP: finalXP,
        createdAt: serverTimestamp()
      });
      const userRef = doc(db, "users", currentUid);
      await setDoc(userRef, {
        totalXP: increment(finalXP),
        quizzesCompleted: increment(1),
        lastQuizDate: serverTimestamp()
      }, { merge: true });
      localStorage.removeItem(`etqan_quiz_history_${currentUid}`);
    } catch (error) { console.error(error); } 
    finally { setIsSubmitting(false); setView('RESULT'); }
  };

  const handleSubmitReview = async () => {
      if (reviewRating === 0 || !activeQuiz || !user) return;
      setIsSubmittingReview(true);
      try {
          await addDoc(collection(db, "reviews"), {
              type: 'quiz',
              targetId: activeQuiz.id || 'unknown',
              targetTitle: activeQuiz.title,
              teacherId: activeQuiz.createdBy || 'teacher', 
              teacherName: activeQuiz.teacherName || 'المعلم',
              rating: reviewRating,
              comment: reviewComment,
              studentId: user.uid,
              studentName: user.displayName,
              createdAt: serverTimestamp()
          });
          setReviewSubmitted(true);
      } catch (error) { console.error(error); } 
      finally { setIsSubmittingReview(false); }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const calculateScore = () => {
    if (!activeQuiz) return 0;
    let correct = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (q.type === 'REORDER') {
          const userAns = userAnswers[idx] as number[];
          if (userAns && userAns.length === q.options.length) {
              if (userAns.every((v, i) => v === i)) correct++;
          }
      } else if (q.type === 'REWRITE') {
          const userAns = userAnswers[idx] as string;
          if (userAns?.trim() === (q.correctAnswerText || '').trim()) correct++;
      } else {
          if (userAnswers[idx] === q.correctAnswer) correct++;
      }
    });
    return correct;
  };

  const handleExitRequest = () => setShowExitConfirm(true);
  const confirmExit = () => { setShowExitConfirm(false); setView('SELECTION'); };
  const handleExpulsionConfirm = () => { setIsExpelled(false); setView('SELECTION'); };
  const initiateResultAction = (action: 'REVIEW' | 'RETAKE' | 'LIST' | 'HOME') => {
    setPendingResultAction(action);
    setShowResultConfirm(true);
  };
  const executeResultAction = () => {
    setShowResultConfirm(false);
    if (pendingResultAction === 'REVIEW') setView('REVIEW');
    else if (pendingResultAction === 'RETAKE') {
        const originalQuiz = quizzes.find(q => q.id === activeQuiz?.id);
        if (originalQuiz) startQuizSession(originalQuiz);
        else setView('SELECTION');
    } else if (pendingResultAction === 'LIST') setView('SELECTION');
    else if (pendingResultAction === 'HOME') onBack();
    setPendingResultAction(null);
  };

  const handleReorderWordClick = (wordIndex: number, fromBank: boolean) => {
    const currentAnswer = (userAnswers[currentQuestionIndex] as number[]) || [];
    if (fromBank) handleAnswerSelect([...currentAnswer, wordIndex]);
    else handleAnswerSelect(currentAnswer.filter(idx => idx !== wordIndex));
  };

  const ConfirmationModal = ({ title, message, onConfirm, onCancel, icon: Icon = HelpCircle, confirmText = "نعم", cancelText = "إلغاء", confirmColor = "emerald", isStatic = true }: any) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={cancelText ? onCancel : undefined}></div>
      <div className={`bg-gray-900 rounded-[2.5rem] p-8 md:p-12 w-full max-w-sm md:w-[450px] aspect-square relative z-10 text-center border-2 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col justify-center`}>
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border-2 border-gray-800 shrink-0 ${confirmColor === 'red' ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
              <Icon className={`w-10 h-10 ${confirmColor === 'red' ? 'text-red-500' : 'text-emerald-500'}`} />
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">{title}</h3>
          <p className="text-gray-400 mb-8 text-sm md:text-base font-medium leading-relaxed">{message}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={onConfirm} className={`flex-1 py-4 rounded-2xl font-black text-white transition-all shadow-lg text-lg ${confirmColor === 'red' ? 'bg-red-600' : 'bg-emerald-600 shadow-emerald-900/20'}`}>{confirmText}</button>
              {cancelText && <button onClick={onCancel} className="flex-1 bg-gray-800 text-gray-300 py-4 rounded-2xl font-bold hover:bg-gray-700 border border-gray-700 text-lg transition-colors">{cancelText}</button>}
          </div>
      </div>
    </div>
  );

  const renderSelection = () => {
    const gradeOptions = [
        { label: 'المرحلة المدرسية', value: 'school_header', isHeader: true },
        ...[5, 6, 7, 8, 9, 10, 11, 12].map(g => ({ label: `الصف ${g}`, value: g.toString() }))
    ];

    const subjectOptions = [ { label: 'عرض جميع المواد', value: '' }, ...availableSubjects.map((subj) => ({ label: String(subj), value: String(subj) })) ];

    const processedQuizzes = [...displayedQuizzes].sort((a, b) => {
        const catA = a.category || 'General'; const catB = b.category || 'General';
        const priorityA = CATEGORY_PRIORITY[catA] || 99; const priorityB = CATEGORY_PRIORITY[catB] || 99;
        if (priorityA !== priorityB) return priorityA - priorityB;
        const matchA = a.title.match(/(\d+)/); const matchB = b.title.match(/(\d+)/);
        if (matchA && matchB) return parseInt(matchA[0]) - parseInt(matchB[0]);
        return a.title.localeCompare(b.title, 'ar');
    });

    let currentCategory = "";
    return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in relative z-10">
      <div className="mb-8 flex items-center justify-between">
         <div><h2 className="text-2xl md:text-3xl font-black text-white mb-2">الاختبارات الإلكترونية</h2><p className="text-gray-400 text-sm md:text-base">جميع الاختبارات يتم تحديثها بالوقت الفعلي</p></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-7 bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-700 relative z-30"><label className="block text-base font-bold text-gray-200 mb-4 flex items-center gap-2"><div className={`p-2 rounded-lg bg-emerald-900/30`}><GraduationCap className="w-5 h-5 text-emerald-400" /></div>الصف الدراسي</label><CustomSelect options={gradeOptions} value={selectedGrade} onChange={(val) => { setSelectedGrade(val); setSelectedSubject(''); setSelectedCategory('All'); }} placeholder={"-- حدد المرحلة الدراسية --"} /></div>
        <div className="lg:col-span-5 bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-700 relative z-20"><label className="block text-base font-bold text-gray-200 mb-4 flex items-center gap-2"><div className="p-2 bg-emerald-900/30 rounded-lg"><BookOpen className="w-5 h-5 text-emerald-400" /></div>المادة الدراسية</label><CustomSelect options={subjectOptions} value={selectedSubject} onChange={setSelectedSubject} placeholder={!selectedGrade ? "يرجى اختيار المرحلة أولاً" : "اختر المادة"} disabled={!selectedGrade} /></div>
      </div>
      {selectedGrade && (
        <div className="mb-10 animate-fade-in relative z-10"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-700"><label className="block text-base font-bold text-gray-200 mb-4 flex items-center gap-2"><div className="p-2 bg-emerald-900/30 rounded-lg"><Tag className="w-5 h-5 text-emerald-400" /></div>نوع الاختبار</label><CustomSelect options={CATEGORIES.map(cat => ({ label: cat.label, value: cat.id }))} value={selectedCategory} onChange={setSelectedCategory} placeholder="اختر نوع الاختبار" /></div><div className="bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-700"><label className="block text-base font-bold text-gray-200 mb-4 flex items-center gap-2"><div className="p-2 bg-emerald-900/30 rounded-lg"><CalendarDays className="w-5 h-5 text-emerald-400" /></div>الفصل الدراسي</label><div className="flex bg-gray-800 p-1.5 rounded-2xl border border-gray-700"><button onClick={() => setSelectedSemester('First')} className={`flex-1 py-3 rounded-xl font-bold transition-all text-sm ${selectedSemester === 'First' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>الفصل الأول</button><button onClick={() => setSelectedSemester('Second')} className={`flex-1 py-3 rounded-xl font-bold transition-all text-sm ${selectedSemester === 'Second' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>الفصل الثاني</button></div></div></div></div>
      )}
      {selectedGrade && (
        <div className="space-y-8 animate-fade-in-up relative z-0">
          <h3 className="text-lg font-bold text-gray-100 border-r-4 border-emerald-500 pr-3 flex items-center gap-2"><List className="w-5 h-5" />الاختبارات الحية - {selectedSemester === 'First' ? 'الفصل الأول' : 'الفصل الثاني'}</h3>
          {isLoading ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-emerald-400" /></div> : processedQuizzes.length === 0 ? <div className="bg-gray-900 p-8 rounded-2xl shadow-sm text-center border border-dashed border-gray-700"><div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4"><Search className="w-8 h-8 text-gray-500" /></div><p className="text-gray-400 font-medium">لا توجد اختبارات مضافة حالياً</p></div> : (
            <div className="flex flex-col gap-10">
              {processedQuizzes.map((quiz) => {
                const isSubscribed = isUserActiveSubscriber(); const isLocked = quiz.isPremium && !isSubscribed; const theme = getCategoryTheme(quiz.category);
                const showHeader = quiz.category !== currentCategory; if (showHeader) currentCategory = quiz.category || "General";
                return (
                <React.Fragment key={quiz.id}>
                   {showHeader && <div className="w-full flex items-center gap-4 animate-fade-in"><div className={`p-2 rounded-xl ${theme.bg} ${theme.text}`}><theme.icon className="w-5 h-5" /></div><h4 className={`text-lg font-black ${theme.text}`}>{theme.label}</h4><div className={`flex-1 h-px bg-gradient-to-l from-transparent via-gray-700 to-gray-800`}></div></div>}
                   <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6"><div className={`bg-gray-900 rounded-2xl md:rounded-3xl p-3 md:p-5 border md:border-2 transition-all duration-300 group relative overflow-hidden flex flex-col gap-2 md:gap-4 ${isLocked ? 'border-gray-800 opacity-90' : `${theme.border} ${theme.hoverBorder} hover:-translate-y-1 hover:shadow-xl`}`}>{quiz.isPremium && <div className="absolute top-0 left-0 bg-amber-500 text-gray-900 text-[8px] md:text-[10px] font-black px-2 md:px-3 py-0.5 md:py-1 rounded-br-lg md:rounded-br-xl z-20 flex items-center gap-1"><Crown className="w-2.5 h-2.5 md:w-3 md:h-3 fill-gray-900" />PREMIUM</div>}<div className="flex justify-between items-start"><div className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full ${theme.bg} ${theme.text}`}><theme.icon className="w-3 h-3 md:w-4 md:h-4" /><span className="text-[10px] md:text-xs font-bold">{theme.label}</span></div><div className="flex items-center gap-1.5 text-gray-500 text-[9px] md:text-xs bg-gray-950 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg border border-gray-800"><Clock className="w-3 h-3" /><span>{quiz.duration || 30} د</span></div></div><div className="flex-1 flex flex-col justify-center"><h3 className={`text-sm md:text-lg font-black text-white leading-tight mb-1 md:mb-2 line-clamp-2 ${isLocked ? 'text-gray-400' : ''}`}>{quiz.title}</h3><div className="flex flex-wrap gap-2 md:gap-3 text-[9px] md:text-xs text-gray-400 font-medium"><div className="flex items-center gap-0.5 md:gap-1"><School className="w-3.5 h-3.5" /><span>{`الصف ${quiz.grade}`}</span></div><div className="flex items-center gap-0.5 md:gap-1"><HelpCircle className="w-3.5 h-3.5" /><span>{quiz.questions.length} س</span></div></div></div><button onClick={() => handleStartClick(quiz)} className={`w-full py-2 md:py-3 rounded-lg md:rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-1 md:gap-2 transition-all ${isLocked ? 'bg-gray-800 text-gray-500 border border-gray-700' : `bg-gray-800 text-white border border-gray-700 ${theme.buttonHover}`}`}>{isLocked ? <><Lock className="w-3 h-3" />محتوى مقفل</> : <>بدء الاختبار<ArrowRight className="w-3 h-3" /></>}</button></div></div>
                </React.Fragment>
              )})}
            </div>
          )}
        </div>
      )}
      {showStartConfirm && <ConfirmationModal title="جاهز للتحدي؟" message={`هل أنت مستعد لبدء اختبار ${quizToStart?.title}؟`} onConfirm={confirmStartQuiz} onCancel={() => setShowStartConfirm(false)} confirmText="نعم، ابدأ الآن" cancelText="ليس الآن" icon={HelpCircle} isStatic={true} />}
      {showPremiumModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4"><div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowPremiumModal(false)}></div><div className="bg-gray-900 rounded-[2.5rem] p-8 max-sm w-full relative z-10 text-center border border-amber-500/30 shadow-2xl shadow-amber-900/20 animate-fade-in-up"><div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-gray-800 bg-amber-500/20"><Crown className="w-10 h-10 text-amber-500 fill-amber-400" /></div><h3 className="text-2xl font-black text-white mb-3">محتوى حصري</h3><p className="text-gray-400 mb-8 text-base font-medium leading-relaxed">هذا الاختبار متاح فقط للمشتركين في الباقة المدفوعة. اشترك الآن للوصول الكامل.</p><button onClick={() => { setShowPremiumModal(false); onNavigate('SERVICES'); }} className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg bg-gradient-to-r from-amber-500 to-orange-500 border border-amber-500">اشترك الآن</button></div></div>
      )}
    </div>
    );
  };

  const renderActiveQuiz = () => {
    if (!activeQuiz || !activeQuiz.questions[currentQuestionIndex]) return null;
    const currentQ = activeQuiz.questions[currentQuestionIndex];
    const isReorder = currentQ.type === 'REORDER'; const isRewrite = currentQ.type === 'REWRITE';
    let isAnswered = isReorder ? (userAnswers[currentQuestionIndex] as number[])?.length === currentQ.options.length : isRewrite ? (userAnswers[currentQuestionIndex] as string)?.trim().length > 0 : userAnswers[currentQuestionIndex] !== undefined;
    const isLastQuestion = currentQuestionIndex === activeQuiz.questions.length - 1;
    const isEnglish = activeQuiz.subject.toLowerCase().includes('english'); const dir = isEnglish ? 'ltr' : 'rtl';
    const textAlignClass = isEnglish ? 'text-left' : 'text-right';
    const fontSizeClass = { 'sm': 'text-sm', 'md': 'text-base', 'lg': 'text-xl', 'xl': 'text-2xl' }[currentQ.passageFontSize || 'md'];
    return (
      <div className="fixed inset-0 z-[9999] bg-gray-950 overflow-y-auto select-none" onContextMenu={(e) => e.preventDefault()}>
        {isExpelled && <ConfirmationModal title="تم طردك من الامتحان" message="محاولة الغش ممنوعة. تم إلغاء امتحانك." onConfirm={handleExpulsionConfirm} cancelText={null} confirmText="موافق" icon={ShieldAlert} confirmColor="red" isStatic={true} />}
        {showSecurityWarning && !isExpelled && <ConfirmationModal title="تحذير أمني!" message="محاولة تصوير الشاشة أو الخروج ممنوعة." onConfirm={() => setShowSecurityWarning(false)} cancelText={null} confirmText="فهمت" icon={AlertTriangle} confirmColor="red" isStatic={true} />}
        {showExitConfirm && <ConfirmationModal title="مغادرة الامتحان؟" message="هل أنت متأكد؟ سيتم فقدان الإجابات." onConfirm={confirmExit} onCancel={() => setShowExitConfirm(false)} confirmText="نعم، خروج" cancelText="تراجع" icon={LogOut} confirmColor="red" isStatic={true} />}
        <div className="bg-gray-950/80 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50"><div className="max-w-4xl mx-auto px-3 h-16 flex justify-between items-center"><button onClick={handleExitRequest} className="text-red-500 px-3 py-1.5 rounded-lg font-bold text-sm">خروج</button><div className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-mono font-bold ${timeLeft < 300 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>{formatTime(timeLeft)}</div><div className="text-xs font-bold text-gray-400">{currentQuestionIndex + 1} / {activeQuiz.questions.length}</div></div><div className="w-full bg-gray-700 h-1"><div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` }}></div></div></div>
        {questionTimeLeft !== null && <div className="max-w-3xl mx-auto px-4 mt-4"><div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden"><div className={`h-full transition-all duration-1000 linear ${questionTimeLeft < 10 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${(questionTimeLeft / activeQuiz.questionDuration!) * 100}%` }} /></div></div>}
        <div className="max-w-3xl mx-auto px-4 py-8"><div className="bg-gray-900 rounded-3xl shadow-sm border border-gray-700 overflow-hidden" dir={dir}><div className="bg-gray-800/50 border-b border-gray-700 p-4 flex items-center justify-between"><h2 className="font-bold text-gray-200 text-sm">{activeQuiz.title}</h2></div><div className="p-6 md:p-8">{currentQ.passageContent && <div className={`ruled-paper-box bg-blue-900/10 p-6 md:p-10 rounded-2xl border border-blue-800/50 mb-6 ${fontSizeClass} shadow-inner overflow-hidden w-full`} dangerouslySetInnerHTML={{ __html: currentQ.passageContent }}></div>}<h3 className={`text-lg md:text-2xl font-black text-white leading-relaxed mb-8 ${textAlignClass}`}>{currentQ.question}</h3>
        {isReorder ? <div className="space-y-6" dir="ltr"><div className="min-h-[120px] p-4 bg-gray-950/50 rounded-2xl border-2 border-dashed border-gray-600 flex flex-wrap gap-2">{(userAnswers[currentQuestionIndex] as number[] || []).map((wordIdx, i) => <button key={i} onClick={() => handleReorderWordClick(wordIdx, false)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold">{currentQ.options[wordIdx]}</button>)}</div><div className="flex flex-wrap gap-3 justify-center bg-gray-900 p-4 rounded-2xl border border-gray-700">{(reorderShuffles[currentQuestionIndex] || []).filter(idx => !(userAnswers[currentQuestionIndex] as number[] || []).includes(idx)).map((wordIdx, i) => <button key={i} onClick={() => handleReorderWordClick(wordIdx, true)} className="bg-gray-800 border-2 border-gray-700 text-gray-200 px-4 py-2 rounded-xl font-bold">{currentQ.options[wordIdx]}</button>)}</div></div> : isRewrite ? <textarea dir="ltr" value={userAnswers[currentQuestionIndex] || ''} onChange={(e) => handleAnswerSelect(e.target.value)} className="w-full h-32 p-5 rounded-2xl bg-gray-950 border-2 border-gray-700 focus:border-blue-500 text-white font-medium text-lg outline-none" placeholder="Type answer here..." /> : <div className="space-y-3">{currentQ.options.map((opt, idx) => <button key={idx} onClick={() => handleAnswerSelect(idx)} className={`w-full ${textAlignClass} p-4 rounded-xl border-2 transition-all flex items-center justify-between ${userAnswers[currentQuestionIndex] === idx ? 'border-emerald-500 bg-emerald-900/30' : 'border-gray-700 bg-gray-900 hover:border-gray-600'}`}><span className={`font-bold ${userAnswers[currentQuestionIndex] === idx ? 'text-emerald-300' : 'text-gray-300'}`}>{opt}</span><div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${userAnswers[currentQuestionIndex] === idx ? 'bg-emerald-600' : 'border-gray-600'}`}>{userAnswers[currentQuestionIndex] === idx && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}</div></button>)}</div>}</div></div>
        <div className="mt-8 flex justify-end"><button onClick={handleNextQuestion} disabled={!isAnswered || isSubmitting} className={`w-full sm:w-auto px-10 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 ${!isAnswered || isSubmitting ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl'}`}>{isSubmitting ? <>جاري الحفظ <Loader2 className="w-5 h-5 animate-spin" /></> : <>{isLastQuestion ? 'إنهاء الاختبار' : 'السؤال التالي'}<ArrowLeft className="w-5 h-5" /></>}</button></div></div></div>
    );
  };

  const renderResult = () => {
    const score = calculateScore(); 
    const total = activeQuiz!.questions.length; 
    const percentage = Math.round((score / total) * 100);
    
    let colorClass = percentage >= 50 ? 'text-emerald-500' : 'text-red-500'; 
    let statusText = percentage >= 90 ? 'مذهل!' : percentage >= 50 ? 'أحسنت!' : 'حظاً أوفر';
    
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 py-12 animate-fade-in custom-scrollbar">
        
        {/* Main Result Card */}
        <div className="w-full max-w-sm bg-gray-900 rounded-[2.5rem] border-2 border-gray-800 p-8 text-center shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden mb-6">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500"></div>
            
            <div className="mb-6 flex flex-col items-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${percentage >= 50 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {percentage >= 50 ? <Trophy className="w-10 h-10" /> : <AlertOctagon className="w-10 h-10" />}
                </div>
                <h2 className="text-3xl font-black text-white mb-1">{statusText}</h2>
                <p className="text-gray-400 text-sm font-medium">{activeQuiz!.title}</p>
            </div>

            <div className="bg-gray-800/40 rounded-[2rem] p-8 mb-8 border border-gray-800 relative shadow-inner">
                <div className={`text-7xl font-black ${colorClass} tracking-tight drop-shadow-sm`}>
                    {percentage}%
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 text-gray-300 font-bold bg-gray-950/50 py-2 px-4 rounded-full border border-gray-800 w-fit mx-auto">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    صحيح: {score} / {total}
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <button 
                  onClick={() => initiateResultAction('REVIEW')} 
                  className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl shadow-lg shadow-orange-900/20 transition-all flex items-center justify-center gap-2 group"
                >
                  <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  مراجعة الإجابات
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => initiateResultAction('RETAKE')} 
                      className="py-3.5 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-2xl border border-gray-700 transition-all flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      إعادة
                    </button>
                    <button 
                      onClick={() => initiateResultAction('LIST')} 
                      className="py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2"
                    >
                      <LayoutGrid className="w-4 h-4" />
                      قائمة الاختبارات
                    </button>
                </div>
                
                <button 
                  onClick={() => initiateResultAction('HOME')} 
                  className="mt-2 text-gray-500 hover:text-white font-bold text-sm flex items-center justify-center gap-1 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  العودة للرئيسية
                </button>
            </div>
        </div>

        {/* Rating Card - Square with Soft Edges */}
        {!reviewSubmitted ? (
            <div className="w-full max-w-sm bg-gray-900 rounded-[2.5rem] border-2 border-gray-800 p-8 text-center shadow-xl animate-fade-in-up">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    <h3 className="text-white font-black text-xl">قيم هذا الاختبار</h3>
                </div>
                <p className="text-gray-400 text-xs mb-6">رأيك يساعدنا في تحسين المحتوى</p>
                
                {/* 1-10 Rating Grid */}
                <div className="grid grid-cols-5 gap-2 mb-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                        <button 
                            key={n} 
                            onClick={() => setReviewRating(n)} 
                            className={`aspect-square rounded-xl font-black text-sm transition-all border-2 ${
                                reviewRating === n 
                                ? 'bg-yellow-500 border-yellow-400 text-black shadow-lg scale-110' 
                                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-yellow-500/50'
                            }`}
                        >
                            {n}
                        </button>
                    ))}
                </div>

                {/* Comment Area */}
                <div className="mb-6">
                    <textarea 
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="أضف تعليقاً أو ملاحظة للمعلم (اختياري)..."
                        className="w-full h-24 bg-gray-950 border-2 border-gray-800 rounded-2xl p-4 text-sm text-white outline-none focus:border-yellow-500/50 transition-all resize-none placeholder-gray-600 font-medium"
                    />
                </div>

                <button 
                    onClick={handleSubmitReview} 
                    disabled={isSubmittingReview || reviewRating === 0}
                    className={`w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all shadow-lg ${
                        reviewRating === 0 
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' 
                        : 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-yellow-900/20 active:scale-95'
                    }`}
                >
                    {isSubmittingReview ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    إرسال التقييم
                </button>
            </div>
        ) : (
            <div className="w-full max-w-sm bg-emerald-900/20 border-2 border-emerald-500/30 rounded-[2.5rem] p-8 text-center animate-fade-in">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-500/30">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-white font-black text-lg">شكراً لتقييمك!</h3>
                <p className="text-emerald-300/70 text-sm mt-1">تم إرسال ملاحظاتك بنجاح للمعلم.</p>
            </div>
        )}
      </div>
    );
  };

  const renderReview = () => (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in"><div className="flex justify-between mb-6"><h2 className="text-xl font-bold text-white flex items-center gap-2"><Eye className="w-5 h-5 text-emerald-400" />مراجعة الإجابات</h2><button onClick={() => setView('RESULT')} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2">عودة للنتيجة</button></div><div className="space-y-6">{activeQuiz?.questions.map((q, idx) => {
        const isReorder = q.type === 'REORDER'; const isRewrite = q.type === 'REWRITE';
        let isCorrect = isReorder ? (userAnswers[idx] as number[])?.every((v, i) => v === i) : isRewrite ? userAnswers[idx]?.trim() === q.correctAnswerText?.trim() : userAnswers[idx] === q.correctAnswer;
        return (<div key={idx} className={`bg-gray-900 rounded-2xl border p-5 ${isCorrect ? 'border-emerald-900/50' : 'border-red-900/50'}`}><div className="flex gap-3 mb-4"><span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isCorrect ? 'bg-emerald-900 text-emerald-400' : 'bg-red-900 text-red-400'}`}>{idx + 1}</span><h3 className="text-white font-bold">{q.question}</h3></div><div className={`p-3 rounded-xl text-sm ${isCorrect ? 'bg-emerald-900/20 text-emerald-400' : 'bg-red-900/20 text-red-400'}`}>إجابتك: {isReorder ? (userAnswers[idx] as number[])?.map(i => q.options[i]).join(' ') : isRewrite ? userAnswers[idx] : q.options[userAnswers[idx]]}</div>{!isCorrect && <div className="mt-2 text-emerald-400 text-sm">الصحيح: {isReorder ? q.options.join(' ') : isRewrite ? q.correctAnswerText : q.options[q.correctAnswer]}</div>}{q.explanation && <div className="mt-3 p-3 bg-yellow-900/10 text-yellow-500 rounded-xl text-sm">💡 {q.explanation}</div>}</div>);
    })}</div></div>
  );

  return (
    <div className="min-h-screen bg-gray-950 pb-20 text-gray-100">
      {view === 'SELECTION' && renderSelection()}
      {view === 'ACTIVE' && renderActiveQuiz()}
      {view === 'RESULT' && renderResult()}
      {view === 'REVIEW' && renderReview()}
      {showResultConfirm && <ConfirmationModal title="تنبيه" message="هل تريد الاستمرار؟" onConfirm={executeResultAction} onCancel={() => setShowResultConfirm(false)} icon={AlertOctagon} isStatic={true} />}
    </div>
  );
};

export default StudentQuizDashboard;