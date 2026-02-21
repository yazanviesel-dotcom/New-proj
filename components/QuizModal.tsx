
import React, { useState, useEffect } from 'react';
import { X, Brain, Check, AlertCircle, Loader2, Award, RefreshCw, BookOpen, Search, Volume2 } from 'lucide-react';
import { Question, QuizState, Quiz } from '../types';
import { generateQuizQuestions } from '../services/geminiService';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<'LIST' | 'QUIZ'>('LIST');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  const [state, setState] = useState<QuizState>({
    isLoading: true,
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    isFinished: false,
    error: null,
  });

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setView('LIST');
        fetchQuizzes();
    }
  }, [isOpen]);

  const fetchQuizzes = async () => {
      setIsLoadingList(true);
      try {
          const q = query(collection(db, "quizzes"), orderBy("createdAt", "desc"), limit(20));
          const querySnapshot = await getDocs(q);
          const quizList: Quiz[] = [];
          querySnapshot.forEach((doc) => {
              quizList.push({ id: doc.id, ...doc.data() } as Quiz);
          });
          setQuizzes(quizList);
      } catch (error) {
          console.error("Error fetching quizzes:", error);
      } finally {
          setIsLoadingList(false);
      }
  };

  const startSpecificQuiz = (quiz: Quiz) => {
      setState({
          isLoading: false,
          questions: quiz.questions,
          currentQuestionIndex: 0,
          score: 0,
          isFinished: false,
          error: null
      });
      setView('QUIZ');
  };

  const startAIQuiz = async () => {
    setView('QUIZ');
    setState(prev => ({ ...prev, isLoading: true, error: null, isFinished: false, score: 0, currentQuestionIndex: 0 }));
    try {
      const questions = await generateQuizQuestions("Science and Math");
      setState(prev => ({ ...prev, questions, isLoading: false }));
    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false, error: "تعذر تحميل الأسئلة، يرجى المحاولة لاحقاً." }));
    }
  };

  const handleOptionClick = (index: number) => {
    if (showFeedback) return;
    setSelectedOption(index);
    setShowFeedback(true);

    const currentQ = state.questions[state.currentQuestionIndex];
    if (index === currentQ.correctAnswer) {
      setState(prev => ({ ...prev, score: prev.score + 1 }));
    }

    setTimeout(() => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        setState(prev => ({ ...prev, isFinished: true }));
      }
    }, 2000); // Slightly longer delay to read explanation
  };

  const renderQuizList = () => (
      <div className="p-6 md:p-8 h-full flex flex-col">
          <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900">اختر اختباراً للبدء</h3>
              <p className="text-gray-500">مجموعة من الاختبارات المميزة من إعداد المعلمين والذكاء الاصطناعي</p>
          </div>

          {isLoadingList ? (
               <div className="flex-1 flex justify-center items-center">
                   <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
               </div>
          ) : (
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  {/* AI Option */}
                  <div 
                    onClick={startAIQuiz}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-5 text-white cursor-pointer transform transition-all hover:-translate-y-1 hover:shadow-lg group"
                  >
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                              <div className="bg-white/20 p-3 rounded-full">
                                  <Brain className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                  <h4 className="font-bold text-lg">تحدي الذكاء الاصطناعي</h4>
                                  <p className="text-emerald-100 text-sm">أسئلة متنوعة يتم توليدها فوراً</p>
                              </div>
                          </div>
                          <div className="bg-white/20 px-4 py-1 rounded-full text-sm font-bold group-hover:bg-white group-hover:text-emerald-600 transition-colors">
                              ابدأ الآن
                          </div>
                      </div>
                  </div>

                  <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">الاختبارات المضافة حديثاً</span>
                        </div>
                  </div>

                  {quizzes.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">لا توجد اختبارات مضافة حالياً</div>
                  ) : (
                      quizzes.map((quiz) => (
                        <div 
                            key={quiz.id}
                            onClick={() => startSpecificQuiz(quiz)}
                            className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-md font-bold">{quiz.subject}</span>
                                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-md">الصف {quiz.grade}</span>
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-lg">{quiz.title}</h4>
                                    <p className="text-sm text-gray-500 mt-1">{quiz.questions.length} أسئلة</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                                    <BookOpen className="w-5 h-5 text-gray-400 group-hover:text-emerald-700" />
                                </div>
                            </div>
                        </div>
                      ))
                  )}
              </div>
          )}
      </div>
  );

  if (!isOpen) return null;

  const currentQ = state.questions[state.currentQuestionIndex];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-white rounded-3xl w-full max-w-2xl relative shadow-2xl overflow-hidden animate-fade-in-up min-h-[500px] flex flex-col">
        
        {/* Header */}
        <div className="bg-emerald-600 p-6 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6" />
            <h2 className="text-xl font-bold">الاختبارات الإلكترونية</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-emerald-700 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {view === 'LIST' ? renderQuizList() : (
             <div className="p-6 md:p-8 flex-1 flex flex-col overflow-y-auto">
             {state.isLoading ? (
               <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-500">
                 <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
                 <p className="text-lg font-medium">جاري تحميل الأسئلة...</p>
               </div>
             ) : state.error ? (
               <div className="flex-1 flex flex-col items-center justify-center gap-4 text-red-500">
                 <AlertCircle className="w-12 h-12" />
                 <p className="text-lg font-medium">{state.error}</p>
                 <button onClick={() => setView('LIST')} className="mt-4 bg-gray-100 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                   العودة للقائمة
                 </button>
               </div>
             ) : state.isFinished ? (
               <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
                 <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                   <Award className="w-12 h-12 text-emerald-600" />
                 </div>
                 <div>
                   <h3 className="text-3xl font-bold text-gray-800 mb-2">أحسنت!</h3>
                   <p className="text-gray-600">لقد أتممت الاختبار بنجاح</p>
                 </div>
                 <div className="text-5xl font-black text-emerald-500 my-4">
                   {state.score} / {state.questions.length}
                 </div>
                 <button 
                   onClick={() => setView('LIST')}
                   className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all"
                 >
                   <RefreshCw className="w-5 h-5" />
                   اختبار آخر
                 </button>
               </div>
             ) : (
               <div className="flex flex-col h-full">
                 {/* Progress Bar */}
                 <div className="w-full bg-gray-100 h-2 rounded-full mb-8 overflow-hidden">
                   <div 
                     className="bg-emerald-500 h-full transition-all duration-500"
                     style={{ width: `${((state.currentQuestionIndex) / state.questions.length) * 100}%` }}
                   ></div>
                 </div>
   
                 {/* Question */}
                 <div className="mb-8">
                   <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full mb-4 inline-block">
                     سؤال {state.currentQuestionIndex + 1} من {state.questions.length}
                   </span>
                   <h3 className="text-2xl font-bold text-gray-900 leading-relaxed">
                     {currentQ.question}
                   </h3>
                 </div>
   
                 {/* Options */}
                 <div className="flex flex-col gap-4">
                   {currentQ.options.map((option, idx) => {
                     const isSelected = selectedOption === idx;
                     const isCorrect = idx === currentQ.correctAnswer;
                     
                     let btnClass = "w-full text-right p-4 rounded-xl border-2 border-gray-100 transition-all hover:border-emerald-200 hover:bg-emerald-50 flex justify-between items-center group";
                     
                     if (showFeedback) {
                       if (isCorrect) btnClass = "w-full text-right p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50 flex justify-between items-center";
                       else if (isSelected && !isCorrect) btnClass = "w-full text-right p-4 rounded-xl border-2 border-red-500 bg-red-50 flex justify-between items-center";
                       else btnClass = "w-full text-right p-4 rounded-xl border-2 border-gray-100 opacity-50 flex justify-between items-center";
                     }
   
                     return (
                       <button 
                         key={idx}
                         onClick={() => handleOptionClick(idx)}
                         disabled={showFeedback}
                         className={btnClass}
                       >
                         <span className="font-semibold text-lg text-gray-700">{option}</span>
                         {showFeedback && isCorrect && <Check className="w-6 h-6 text-emerald-600" />}
                         {showFeedback && isSelected && !isCorrect && <X className="w-6 h-6 text-red-600" />}
                         {!showFeedback && <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-emerald-400"></div>}
                       </button>
                     );
                   })}
                 </div>

                 {/* Explanation Box */}
                 {showFeedback && currentQ.explanation && (
                     <div className="mt-6 animate-fade-in p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                         <p className="text-yellow-800 font-bold mb-1">تفسير الإجابة:</p>
                         <p className="text-gray-700">{currentQ.explanation}</p>
                     </div>
                 )}
               </div>
             )}
           </div>
        )}
      </div>
    </div>
  );
};

export default QuizModal;