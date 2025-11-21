
import React, { useState, useEffect } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { Quiz } from '../types';
import { db } from '../firebase';
import { collection, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

interface StudentQuizDashboardProps {
  onBack: () => void;
}

type ViewState = 'SELECTION' | 'ACTIVE' | 'RESULT' | 'REVIEW';

const StudentQuizDashboard: React.FC<StudentQuizDashboardProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [view, setView] = useState<ViewState>('SELECTION');
  
  // Selection Filters
  const [selectedSubject, setSelectedSubject] = useState<string>(''); // Empty string means 'All'
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  
  // Quizzes Data
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{[key: number]: number}>({}); // questionIndex -> optionIndex
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Quizzes when GRADE changes
  useEffect(() => {
    if (selectedGrade) {
      fetchQuizzes();
    } else {
      setQuizzes([]);
    }
  }, [selectedGrade]);

  // Timer Logic
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

  // Anti-Cheat: Prevent Context Menu
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (view === 'ACTIVE') {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, [view]);

  const fetchQuizzes = async () => {
    setIsLoading(true);
    try {
      // Query ONLY by grade to get all available subjects
      const q = query(
        collection(db, "quizzes"),
        where("grade", "==", selectedGrade)
      );
      
      const querySnapshot = await getDocs(q);
      const quizList: Quiz[] = [];
      querySnapshot.forEach((doc) => {
        quizList.push({ id: doc.id, ...doc.data() } as Quiz);
      });
      setQuizzes(quizList);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get Unique Subjects from fetched quizzes to populate dropdown
  const availableSubjects = Array.from(new Set(quizzes.map(q => q.subject)));

  // Filter displayed quizzes based on selected subject
  const displayedQuizzes = selectedSubject 
    ? quizzes.filter(q => q.subject === selectedSubject)
    : quizzes;

  const startQuiz = (quiz: Quiz) => {
    if (!quiz.questions || quiz.questions.length === 0) {
        alert("عذراً، لا يوجد أسئلة في هذا الاختبار");
        return;
    }
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTimeLeft(30 * 60);
    setView('ACTIVE');
  };

  const handleAnswerSelect = (optionIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  const handleNextQuestion = () => {
    if (!activeQuiz) return;
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz || !user) {
      setView('RESULT');
      return;
    }

    setIsSubmitting(true);
    const score = calculateScore();
    const percentage = Math.round((score / activeQuiz.questions.length) * 100);

    try {
      // Save result to Firebase for statistics and history
      await addDoc(collection(db, "quiz_results"), {
        userId: user.uid,
        userName: user.displayName,
        quizId: activeQuiz.id || 'unknown',
        quizTitle: activeQuiz.title,
        subject: activeQuiz.subject,
        score: score,
        totalQuestions: activeQuiz.questions.length,
        percentage: percentage,
        passed: percentage >= 50,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error saving quiz result:", error);
    } finally {
      setIsSubmitting(false);
      setView('RESULT');
    }
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
      if (userAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  // ---------------- RENDER FUNCTIONS ---------------- //

  const renderSelection = () => (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-fade-in">
      <div className="mb-8 text-center">
         <h2 className="text-3xl font-black text-gray-900 mb-2">الاختبارات الإلكترونية</h2>
         <p className="text-gray-500 text-lg">اختر الصف والمادة للبدء في تقديم الاختبارات</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        
        {/* Grade Selection */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            الصف الدراسي
          </label>
          <select 
            value={selectedGrade}
            onChange={(e) => {
                setSelectedGrade(e.target.value);
                setSelectedSubject(''); // Reset subject when grade changes
            }}
            className="w-full px-4 py-3 rounded-xl bg-white text-black border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-lg font-bold shadow-sm appearance-none"
            style={{ color: 'black' }}
          >
            <option value="" className="text-gray-500">اختر الصف</option>
            {[5, 6, 7, 8, 9, 10, 11, 12].map(g => (
              <option key={g} value={g} className="text-black" style={{ color: 'black' }}>الصف {g}</option>
            ))}
          </select>
        </div>

        {/* Subject Selection */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            المادة الدراسية
          </label>
          <select 
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedGrade}
            className={`w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-lg font-bold shadow-sm appearance-none ${!selectedGrade ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ color: 'black' }}
          >
            <option value="" className="text-black" style={{ color: 'black' }}>جميع المواد</option>
            {availableSubjects.map((subj, idx) => (
                <option key={idx} value={subj} className="text-black" style={{ color: 'black' }}>{subj}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quizzes List */}
      {selectedGrade && (
        <div className="space-y-6 animate-fade-in-up">
          <h3 className="text-xl font-bold text-gray-900 border-r-4 border-emerald-500 pr-3 flex items-center gap-2">
             <List className="w-5 h-5" />
             الاختبارات المتاحة
          </h3>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : quizzes.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-dashed border-gray-300">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">لا توجد اختبارات مضافة لهذا الصف حالياً</p>
            </div>
          ) : displayedQuizzes.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-dashed border-gray-300">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">لا توجد اختبارات لهذه المادة المحددة</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedQuizzes.map(quiz => (
                <div key={quiz.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-emerald-300 transition-all group">
                   <div className="flex justify-between items-start mb-4">
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
                        {quiz.subject}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {quiz.questions.length} أسئلة
                      </span>
                   </div>
                   <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{quiz.title}</h4>
                   <p className="text-gray-500 text-sm mb-6">الصف {quiz.grade}</p>
                   
                   <button 
                     onClick={() => startQuiz(quiz)}
                     className="w-full bg-emerald-50 text-emerald-700 border border-emerald-200 py-3 rounded-xl font-bold group-hover:bg-emerald-600 group-hover:text-white transition-all flex items-center justify-center gap-2"
                   >
                     بدء الاختبار
                     <ArrowLeft className="w-4 h-4" />
                   </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderActiveQuiz = () => {
    if (!activeQuiz || !activeQuiz.questions || !activeQuiz.questions[currentQuestionIndex]) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
                <div className="text-red-500 font-bold text-xl">حدث خطأ في تحميل السؤال</div>
                <button onClick={() => setView('SELECTION')} className="text-blue-600 underline">العودة للقائمة</button>
            </div>
        );
    }

    const currentQ = activeQuiz.questions[currentQuestionIndex];
    const isAnswered = userAnswers[currentQuestionIndex] !== undefined;
    const isLastQuestion = currentQuestionIndex === activeQuiz.questions.length - 1;

    // Detect English subject to switch direction
    const isEnglish = activeQuiz.subject.toLowerCase().includes('english') || 
                      activeQuiz.subject.includes('انجليزي') || 
                      activeQuiz.subject.includes('إنجليزي');
    
    const dir = isEnglish ? 'ltr' : 'rtl';
    const textAlign = isEnglish ? 'text-left' : 'text-right';

    return (
      <div className="min-h-screen bg-gray-50 select-none" onContextMenu={(e) => e.preventDefault()}>
        
        {/* Sticky Header with Timer and Exit */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 h-20 flex justify-between items-center">
             <div className="flex items-center gap-4 md:gap-6">
                {/* Exit Button - Updated */}
                <button 
                    onClick={() => setView('SELECTION')}
                    className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors border border-red-100 hover:border-red-200 bg-white shadow-sm"
                    title="إنهاء وخروج"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-bold text-sm">إنهاء وخروج</span>
                </button>

                <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

                <div>
                    <h2 className="font-bold text-black text-lg truncate max-w-[200px] md:max-w-none">{activeQuiz.title}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>سؤال {currentQuestionIndex + 1} من {activeQuiz.questions.length}</span>
                    </div>
                </div>
             </div>

             <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold text-lg ${timeLeft < 300 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-emerald-100 text-emerald-700'}`}>
                <Clock className="w-5 h-5" />
                {formatTime(timeLeft)}
             </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 h-1.5">
             <div 
               className="bg-emerald-500 h-full transition-all duration-500 ease-out"
               style={{ width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` }}
             ></div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
           
           {/* Question Card */}
           <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10 animate-fade-in-up" dir={dir}>
              {/* Question Text - Forced Black Color */}
              <h3 
                className={`text-2xl md:text-3xl font-bold text-black leading-relaxed mb-8 ${textAlign}`}
                style={{ color: 'black' }} 
              >
                {currentQ.question}
              </h3>

              <div className="space-y-4">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    className={`w-full ${textAlign} p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                      userAnswers[currentQuestionIndex] === idx 
                      ? 'border-emerald-500 bg-emerald-50 shadow-md' 
                      : 'border-gray-100 bg-white hover:bg-gray-50 hover:border-emerald-200'
                    }`}
                  >
                    <span className={`text-lg font-medium ${userAnswers[currentQuestionIndex] === idx ? 'text-emerald-900' : 'text-black'}`}>
                      {opt}
                    </span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                       userAnswers[currentQuestionIndex] === idx ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300 group-hover:border-emerald-400'
                    }`}>
                       {userAnswers[currentQuestionIndex] === idx && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                    </div>
                  </button>
                ))}
              </div>
           </div>

           {/* Action Buttons */}
           <div className="mt-8 flex justify-end">
              <button 
                onClick={handleNextQuestion}
                disabled={!isAnswered || isSubmitting}
                className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 shadow-lg transition-all ${
                  !isAnswered || isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-200 transform hover:-translate-y-1'
                }`}
              >
                {isSubmitting ? (
                  <>جاري الحفظ <Loader2 className="w-5 h-5 animate-spin" /></>
                ) : (
                  <>
                     {isLastQuestion ? 'إنهاء الاختبار' : 'السؤال التالي'}
                     <ArrowLeft className="w-5 h-5" />
                  </>
                )}
              </button>
           </div>

           {/* Security Warning - Explicitly at the bottom */}
           <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-center gap-3 text-sm text-yellow-800 animate-fade-in">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <div>
                <span className="font-bold block mb-1">تنبيه أمني:</span>
                نظام الحماية مفعل: يمنع النسخ أو تصوير الشاشة. سيتم إنهاء الاختبار تلقائياً في حال المحاولة.
              </div>
           </div>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    if (!activeQuiz) return null;
    const score = calculateScore();
    const percentage = (score / activeQuiz.questions.length) * 100;
    
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in-up">
         <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-emerald-600 p-8 text-center text-white relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-20"></div>
               <div className="relative z-10">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <Award className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-black mb-2">نتيجة الاختبار</h2>
                  <p className="text-emerald-100 text-lg">{activeQuiz.title}</p>
               </div>
            </div>

            <div className="p-8 md:p-12 text-center">
               <div className="mb-8">
                  <span className={`text-6xl font-black ${percentage >= 50 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {score}
                  </span>
                  <span className="text-gray-400 text-4xl font-bold">/ {activeQuiz.questions.length}</span>
               </div>

               <p className="text-gray-600 text-lg mb-10">
                 {percentage >= 90 ? 'ممتاز! أداء رائع جداً.' :
                  percentage >= 75 ? 'جيد جداً! واصل التقدم.' :
                  percentage >= 50 ? 'جيد، ولكن يمكنك التحسن.' :
                  'للأسف، تحتاج لمزيد من الدراسة.'}
               </p>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => setView('REVIEW')}
                    className="py-4 px-6 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-5 h-5" />
                    مراجعة الإجابات
                  </button>
                  <button 
                    onClick={() => startQuiz(activeQuiz)}
                    className="py-4 px-6 bg-emerald-50 text-emerald-700 font-bold rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    إعادة الاختبار
                  </button>
                  <button 
                    onClick={() => setView('SELECTION')}
                    className="py-4 px-6 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <List className="w-5 h-5" />
                    قائمة الاختبارات
                  </button>
               </div>
            </div>
         </div>
      </div>
    );
  };

  const renderReview = () => {
    if (!activeQuiz) return null;

    // Detect English subject to switch direction
    const isEnglish = activeQuiz.subject.toLowerCase().includes('english') || 
                      activeQuiz.subject.includes('انجليزي') || 
                      activeQuiz.subject.includes('إنجليزي');
    
    const dir = isEnglish ? 'ltr' : 'rtl';
    const textAlign = isEnglish ? 'text-left' : 'text-right';

    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Eye className="w-6 h-6 text-emerald-600" />
              مراجعة الإجابات
           </h2>
           <button 
             onClick={() => setView('RESULT')}
             className="text-gray-500 hover:text-gray-900 font-medium flex items-center gap-1"
           >
             <ArrowRight className="w-4 h-4" />
             عودة للنتيجة
           </button>
        </div>

        <div className="space-y-8">
           {activeQuiz.questions.map((q, index) => {
             const userAnswer = userAnswers[index];
             const isCorrect = userAnswer === q.correctAnswer;

             return (
               <div key={q.id} className={`bg-white rounded-2xl shadow-sm border-2 p-6 md:p-8 ${isCorrect ? 'border-gray-100' : 'border-red-100'}`} dir={dir}>
                 <div className="flex items-start gap-4 mb-6">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {index + 1}
                    </span>
                    <h3 className={`text-xl font-bold text-gray-900 leading-relaxed ${textAlign}`}>{q.question}</h3>
                 </div>

                 <div className="space-y-3 mb-6">
                    {q.options.map((opt, optIdx) => {
                      let optionClass = "p-4 rounded-xl border flex items-center justify-between ";
                      if (optIdx === q.correctAnswer) {
                        optionClass += "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold";
                      } else if (optIdx === userAnswer && !isCorrect) {
                        optionClass += "bg-red-50 border-red-500 text-red-900 font-medium opacity-75";
                      } else {
                        optionClass += "bg-white border-gray-200 text-gray-500 opacity-60";
                      }

                      return (
                        <div key={optIdx} className={optionClass}>
                           <span className={textAlign}>{opt}</span>
                           {optIdx === q.correctAnswer && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                           {optIdx === userAnswer && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                        </div>
                      )
                    })}
                 </div>

                 {/* Always show explanation */}
                 {q.explanation && (
                   <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-900 text-sm leading-relaxed flex items-start gap-3" dir="rtl">
                      <div className="bg-blue-100 p-1 rounded-full mt-0.5 shrink-0">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="w-full">
                        <span className="font-bold block mb-1 text-right">تفسير الإجابة:</span>
                        <div className={textAlign} dir={dir}>{q.explanation}</div>
                      </div>
                   </div>
                 )}
               </div>
             );
           })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {view === 'SELECTION' && (
        <>
           {/* Header */}
           <div className="bg-white border-b border-gray-200 py-4 px-4 sticky top-0 z-30">
              <div className="max-w-7xl mx-auto flex items-center gap-4">
                 <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowRight className="w-6 h-6 text-gray-600" />
                 </button>
                 <span className="font-bold text-gray-900">العودة للرئيسية</span>
              </div>
           </div>
           {renderSelection()}
        </>
      )}

      {view === 'ACTIVE' && renderActiveQuiz()}
      {view === 'RESULT' && renderResult()}
      {view === 'REVIEW' && renderReview()}
    </div>
  );
};

export default StudentQuizDashboard;
