
import React, { useEffect, useState, useRef } from 'react';
/* Added serverTimestamp to imports */
import { collection, query, orderBy, doc, updateDoc, deleteDoc, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Quiz, Question } from '../types';
import { ArrowRight, Calendar, User, Layers, HelpCircle, Search, Loader2, Edit, Trash2, Save, X, CheckCircle2, Crown, Home, Backpack, University, RotateCcw, AlertCircle } from 'lucide-react';

interface QuestionBankProps {
  onBack: () => void;
}

const QuestionBank: React.FC<QuestionBankProps> = ({ onBack }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Audience State
  const [targetAudience, setTargetAudience] = useState<'school' | 'university' | null>(null);

  // Edit State
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string, title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Real-time listener effect
  useEffect(() => {
    setLoading(true);
    setError(null);

    const q = query(
      collection(db, "quizzes"), 
      orderBy("createdAt", "desc")
    );

    // إعداد مستمع الوقت الفعلي (Real-time Listener)
    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
          const data = snapshot.docs.map(docSnap => {
              const d = docSnap.data();
              // STRICT POJO Mapping to prevent circular reference errors
              return { 
                id: docSnap.id, 
                title: String(d.title || ''),
                subject: String(d.subject || ''),
                grade: String(d.grade || ''),
                semester: d.semester || 'First',
                category: d.category || 'General',
                description: String(d.description || ''),
                duration: Number(d.duration || 30),
                questionDuration: d.questionDuration ? Number(d.questionDuration) : null,
                isPremium: Boolean(d.isPremium),
                keepOrder: Boolean(d.keepOrder),
                teacherName: String(d.teacherName || ''),
                createdBy: String(d.createdBy || ''),
                // Deep clean questions
                questions: (d.questions || []).map((q: any) => ({
                    id: q.id,
                    question: String(q.question || ''),
                    options: (q.options || []).map((o: any) => String(o)),
                    correctAnswer: Number(q.correctAnswer || 0),
                    correctAnswerText: String(q.correctAnswerText || ''),
                    explanation: String(q.explanation || ''),
                    passageContent: String(q.passageContent || ''),
                    generalInstruction: String(q.generalInstruction || ''),
                    passageFontSize: q.passageFontSize || 'md',
                    type: q.type || 'MCQ'
                })),
                createdAt: d.createdAt ? { seconds: d.createdAt.seconds } : null,
                updatedAt: d.updatedAt ? { seconds: d.updatedAt.seconds } : null
              } as Quiz;
          });
          setQuizzes(data);
      } catch (err) {
          console.error("Mapping error in question bank:", err);
      } finally {
          setLoading(false);
          setError(null);
      }
    }, (err) => {
      console.error("Error listening to quizzes:", err);
      setError("حدث خطأ أثناء الاتصال بالخادم لجلب البيانات الحية.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEditClick = (quiz: Quiz) => {
    setEditingQuiz({ ...quiz });
  };

  const onRequestDelete = (e: React.MouseEvent, quiz: Quiz) => {
      e.stopPropagation();
      if (quiz.id) {
          setDeleteConfirmation({ id: quiz.id, title: quiz.title });
      }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation) return;

    setIsDeleting(true);
    try {
        await deleteDoc(doc(db, "quizzes", deleteConfirmation.id));
        setDeleteConfirmation(null);
    } catch (error: any) {
        console.error("Error deleting quiz:", error);
        alert("حدث خطأ أثناء الحذف: " + error.message);
    } finally {
        setIsDeleting(false);
    }
  };

  const handleQuizInfoChange = (field: keyof Quiz, value: string) => {
    if (!editingQuiz) return;
    setEditingQuiz({ ...editingQuiz, [field]: value });
  };

  const handleQuestionChange = (qIndex: number, field: keyof Question, value: any) => {
    if (!editingQuiz) return;
    const updatedQuestions = [...editingQuiz.questions];
    updatedQuestions[qIndex] = { ...updatedQuestions[qIndex], [field]: value };
    setEditingQuiz({ ...editingQuiz, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    if (!editingQuiz) return;
    const updatedQuestions = [...editingQuiz.questions];
    const updatedOptions = [...updatedQuestions[qIndex].options];
    updatedOptions[oIndex] = value;
    updatedQuestions[qIndex] = { ...updatedQuestions[qIndex], options: updatedOptions };
    setEditingQuiz({ ...editingQuiz, questions: updatedQuestions });
  };

  const handleDeleteQuestion = (qIndex: number) => {
    if (!editingQuiz) return;
    if (window.confirm("هل أنت متأكد من حذف هذا السؤال؟")) {
        const updatedQuestions = editingQuiz.questions.filter((_, idx) => idx !== qIndex);
        setEditingQuiz({ ...editingQuiz, questions: updatedQuestions });
    }
  };

  const handleSaveChanges = async () => {
    if (!editingQuiz || !editingQuiz.id) return;
    
    if (editingQuiz.questions.length === 0) {
        alert("لا يمكن حفظ اختبار بدون أسئلة!");
        return;
    }

    setIsSaving(true);
    try {
        const quizRef = doc(db, "quizzes", editingQuiz.id);
        /* Fixed: Added serverTimestamp to imports and using it to update the quiz record */
        await updateDoc(quizRef, {
            title: editingQuiz.title,
            subject: editingQuiz.subject,
            grade: editingQuiz.grade,
            category: editingQuiz.category,
            questions: editingQuiz.questions,
            updatedAt: serverTimestamp()
        });
        
        setEditingQuiz(null);
        alert("تم حفظ التعديلات بنجاح");
    } catch (error) {
        console.error("Error updating quiz:", error);
        alert("حدث خطأ أثناء الحفظ");
    } finally {
        setIsSaving(false);
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = (quiz.title ? quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) : false) || 
                          (quiz.teacherName && quiz.teacherName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const isUni = quiz.grade === 'English Major - QOU' || (quiz.grade && quiz.grade.includes('University'));
    let matchesAudience = false;

    if (targetAudience === 'university') {
        matchesAudience = isUni;
    } else {
        matchesAudience = !isUni;
    }

    return matchesSearch && matchesAudience;
  });

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString('ar-EG');
    } catch (e) {
        return '';
    }
  };

  const inputStyle = "w-full p-3 rounded-xl border-2 border-gray-600 focus:border-blue-400 outline-none font-bold text-white bg-gray-700 shadow-sm transition-colors placeholder-gray-400";

  if (!targetAudience) {
      return (
        <div className="min-h-screen bg-gray-950 pb-20 animate-fade-in transition-colors duration-300 text-gray-100 flex items-center justify-center">
            <div className="max-w-4xl w-full px-4">
                <div className="flex items-center gap-3 mb-8">
                    <button 
                        onClick={onBack}
                        className="p-2 bg-gray-900/50 hover:bg-gray-800 rounded-xl transition-all text-gray-400 hover:text-white border border-white/10 shadow-lg group backdrop-blur-sm"
                    >
                        <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <span className="text-gray-400 text-sm font-bold">العودة</span>
                </div>

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-white mb-3">بنك الأسئلة Live</h2>
                    <p className="text-gray-400">جميع الاختبارات يتم تحديثها بالوقت الفعلي</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button 
                        onClick={() => setTargetAudience('school')}
                        className="bg-gray-900 p-10 rounded-[2.5rem] border border-gray-700 hover:border-emerald-500 hover:bg-gray-800 transition-all group shadow-2xl flex flex-col items-center gap-6"
                    >
                        <div className="w-24 h-24 rounded-full bg-emerald-900/20 flex items-center justify-center group-hover:scale-110 transition-transform border border-emerald-500/20">
                            <Backpack className="w-12 h-12 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1">المدارس</h3>
                            <p className="text-gray-400 text-sm">اختبارات الصفوف (5 - 12)</p>
                        </div>
                    </button>

                    <button 
                        onClick={() => setTargetAudience('university')}
                        className="bg-gray-900 p-10 rounded-[2.5rem] border border-gray-700 hover:border-blue-500 hover:bg-gray-800 transition-all group shadow-2xl flex flex-col items-center gap-6"
                    >
                        <div className="w-24 h-24 rounded-full bg-blue-900/20 flex items-center justify-center group-hover:scale-110 transition-transform border border-blue-500/20">
                            <University className="w-12 h-12 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1">الجامعات</h3>
                            <p className="text-gray-400 text-sm">اختبارات التخصصات الجامعية</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-950 pb-20 animate-fade-in relative transition-colors duration-300 text-gray-100">
      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #475569 transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 pt-2 pb-2 relative z-30">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
            <button 
                onClick={onBack}
                className="p-2 bg-gray-900/50 hover:bg-gray-800 rounded-xl transition-all text-gray-400 hover:text-white border border-white/10 shadow-lg backdrop-blur-sm group"
            >
                <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-lg font-black text-white tracking-tight mb-0.5 flex items-center gap-2">
                            بنك الأسئلة Live
                            <span className={`text-xs px-2 py-0.5 rounded-lg border ${targetAudience === 'school' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' : 'bg-blue-900/30 text-blue-400 border-blue-500/30'}`}>
                                {targetAudience === 'school' ? 'المدارس' : 'الجامعات'}
                            </span>
                        </h1>
                        <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-medium text-gray-500">
                            <span onClick={onBack} className="hover:text-emerald-400 cursor-pointer transition-colors flex items-center gap-1">
                            <Home className="w-3 h-3" /> الرئيسية
                            </span>
                            <span className="text-gray-700">/</span>
                            <span className="text-emerald-500 flex items-center gap-1">
                                <Layers className="w-3 h-3" />
                                إدارة الاختبارات المباشرة
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                        <div className="w-full md:w-auto bg-gray-800 p-2 rounded-2xl shadow-lg border border-gray-600 flex items-center gap-2">
                            <Search className="w-5 h-5 text-gray-300 mr-2" />
                            <input 
                                type="text" 
                                placeholder="ابحث عن اختبار..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-64 outline-none text-sm font-bold text-gray-200 placeholder-gray-500 bg-transparent"
                            />
                        </div>
                        <button 
                            onClick={() => { setTargetAudience(null); setSearchTerm(''); }}
                            className="bg-gray-800 text-gray-300 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-gray-700 transition-colors border border-gray-700"
                        >
                            <RotateCcw className="w-3 h-3" />
                            تغيير القسم
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 relative z-20">
          {loading ? (
              <div className="flex flex-col justify-center items-center py-20 gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
                  <p className="text-gray-400 font-bold text-sm">جاري جلب البيانات الحية...</p>
              </div>
          ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 bg-gray-900 rounded-3xl border border-red-500/20 p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">تعذر الاتصال</h3>
                  <p className="text-gray-400 mb-6">{error}</p>
              </div>
          ) : filteredQuizzes.length === 0 ? (
              <div className="bg-gray-800 rounded-3xl shadow-sm border border-white/5 p-12 text-center">
                  <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Layers className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white">لا توجد اختبارات</h3>
                  <p className="text-gray-400 mt-1">
                      {searchTerm 
                        ? 'لم يتم العثور على أي اختبارات تطابق بحثك.' 
                        : `لا توجد اختبارات مضافة حالياً.`}
                  </p>
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredQuizzes.map((quiz) => (
                      <div key={quiz.id} className="bg-gray-900 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-white/5 overflow-hidden group flex flex-col">
                          <div className="p-6 flex-1">
                              <div className="flex justify-between items-start mb-4">
                                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${targetAudience === 'school' ? 'bg-emerald-900/30 text-emerald-300' : 'bg-blue-900/30 text-blue-300'}`}>
                                      {quiz.subject}
                                  </span>
                                  <div className="flex gap-2">
                                      <button 
                                        onClick={() => handleEditClick(quiz)}
                                        className="bg-emerald-900/20 text-emerald-400 p-1.5 rounded-lg hover:bg-emerald-900/40 transition-colors"
                                        title="تعديل الاختبار"
                                      >
                                          <Edit className="w-4 h-4" />
                                      </button>
                                      <button 
                                        onClick={(e) => onRequestDelete(e, quiz)}
                                        className="bg-red-900/20 text-red-400 p-1.5 rounded-lg hover:bg-red-900/40 transition-colors"
                                        title="حذف الاختبار"
                                      >
                                          <Trash2 className="w-4 h-4" />
                                      </button>
                                  </div>
                              </div>
                              
                              <h3 className="text-xl font-black text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors flex items-center gap-2">
                                  {quiz.title}
                                  {quiz.isPremium && (
                                    <div className="bg-amber-500/10 border border-amber-500/30 p-1 rounded-full" title="محتوى مدفوع">
                                        <Crown className="w-4 h-4 text-amber-500 fill-amber-400" />
                                    </div>
                                  )}
                              </h3>
                              
                              {quiz.category && (
                                  <span className="inline-block mb-4 bg-amber-900/20 text-amber-400 text-[10px] font-bold px-2 py-1 rounded-md border border-amber-800/50">
                                      {quiz.category}
                                  </span>
                              )}
                              
                              <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                                  <span className="bg-gray-700 px-2 py-0.5 rounded border border-gray-600 font-bold">
                                      {quiz.grade === 'English Major - QOU' ? 'جامعي' : `الصف ${quiz.grade}`}
                                  </span>
                                  <span className="text-gray-600">|</span>
                                  <span className="bg-gray-700/50 text-gray-400 px-2 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {formatDate(quiz.createdAt)}
                                  </span>
                              </div>
                          </div>
                          
                          <div className="bg-gray-900/50 p-4 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gray-700 rounded-full border border-gray-600 flex items-center justify-center shadow-sm text-gray-300">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-300">{quiz.teacherName || 'معلم'}</p>
                                </div>
                                <span className="flex items-center gap-1 text-xs font-bold text-gray-400 bg-gray-700 px-2 py-1 rounded-md border border-gray-600">
                                    <HelpCircle className="w-3 h-3" />
                                    {quiz.questions.length} أسئلة
                                </span>
                          </div>
                      </div>
                  ))}
              </div>
          )}
      </div>

      {/* EDIT MODAL */}
      {editingQuiz && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-900 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-fade-in-up overflow-hidden border border-gray-700">
                
                <div className="bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center shrink-0 sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-900/30 p-2 rounded-xl">
                            <Edit className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white">تعديل الاختبار</h2>
                            <p className="text-sm text-gray-400">التعديلات تنعكس فوراً عند الحفظ</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setEditingQuiz(null)}
                        className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-900 custom-scrollbar">
                    
                    <div className="bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-700 mb-8">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Layers className="w-5 h-5 text-blue-400" />
                            معلومات الاختبار
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-400 mb-1">عنوان الاختبار</label>
                                <input 
                                    type="text"
                                    value={editingQuiz.title}
                                    onChange={(e) => handleQuizInfoChange('title', e.target.value)}
                                    className={inputStyle}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">المادة</label>
                                <input 
                                    type="text"
                                    value={editingQuiz.subject}
                                    onChange={(e) => handleQuizInfoChange('subject', e.target.value)}
                                    className={inputStyle}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">
                                    {targetAudience === 'university' ? 'التخصص' : 'الصف'}
                                </label>
                                {targetAudience === 'school' ? (
                                    <select 
                                        value={editingQuiz.grade}
                                        onChange={(e) => handleQuizInfoChange('grade', e.target.value)}
                                        className={inputStyle}
                                    >
                                        {[5,6,7,8,9,10,11,12].map(g => (
                                            <option key={g} value={String(g)}>الصف {g}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input 
                                        type="text"
                                        value={editingQuiz.grade}
                                        onChange={(e) => handleQuizInfoChange('grade', e.target.value)}
                                        className={inputStyle}
                                        disabled
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="font-bold text-white flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-blue-400" />
                                الأسئلة ({editingQuiz.questions.length})
                            </span>
                        </h3>

                        {editingQuiz.questions.map((q, qIdx) => (
                            <div key={qIdx} className="bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-700 relative group">
                                <button 
                                    onClick={() => handleDeleteQuestion(qIdx)}
                                    className="absolute top-4 left-4 p-2 text-gray-400 hover:bg-red-900/20 hover:text-red-400 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>

                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-gray-400 mb-1.5">نص السؤال {qIdx + 1}</label>
                                    <input 
                                        type="text"
                                        dir="ltr"
                                        value={q.question}
                                        onChange={(e) => handleQuestionChange(qIdx, 'question', e.target.value)}
                                        className="w-full p-3 rounded-xl border-2 border-gray-600 focus:border-emerald-500 outline-none font-bold text-white bg-gray-700 shadow-sm text-lg transition-colors text-left"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    {q.options.map((opt, oIdx) => (
                                        <div key={oIdx} className="relative">
                                            <label className="flex items-center justify-between text-xs font-bold text-gray-400 mb-1 px-1">
                                                <span>الخيار {oIdx + 1}</span>
                                                <button 
                                                    onClick={() => handleQuestionChange(qIdx, 'correctAnswer', oIdx)}
                                                    className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                                                        q.correctAnswer === oIdx 
                                                        ? 'bg-emerald-900/30 text-emerald-400' 
                                                        : 'bg-gray-700 text-gray-500 hover:bg-gray-600'
                                                    }`}
                                                >
                                                    {q.correctAnswer === oIdx ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-3 h-3 border border-gray-400 rounded-full"></div>}
                                                    {q.correctAnswer === oIdx ? 'صحيح' : 'تحديد'}
                                                </button>
                                            </label>
                                            <input 
                                                type="text"
                                                dir="ltr"
                                                value={opt}
                                                onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                                                className={`w-full p-3 rounded-xl border-2 outline-none font-bold transition-colors shadow-sm text-left ${
                                                    q.correctAnswer === oIdx
                                                    ? 'border-emerald-500 bg-emerald-900/20 text-emerald-300'
                                                    : 'border-gray-600 focus:border-blue-400 text-white bg-gray-700'
                                                }`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 bg-gray-800 border-t border-gray-700 flex justify-end gap-3 shrink-0 sticky bottom-0 z-10">
                    <button 
                        onClick={() => setEditingQuiz(null)}
                        className="px-6 py-3 rounded-xl font-bold text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors"
                    >
                        إلغاء
                    </button>
                    <button 
                        onClick={handleSaveChanges}
                        disabled={isSaving}
                        className="px-8 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        حفظ التغييرات Live
                    </button>
                </div>

            </div>
        </div>
      )}

      {deleteConfirmation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-gray-900 rounded-3xl p-8 max-sm w-full border border-gray-700 shadow-2xl text-center">
                <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                    <Trash2 className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">تأكيد الحذف</h3>
                <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                    سيتم حذف <span className="text-white font-bold">"{deleteConfirmation.title}"</span> نهائياً من كافة الأجهزة فوراً.
                </p>
                
                <div className="flex gap-3">
                    <button 
                        onClick={confirmDelete}
                        disabled={isDeleting}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                    >
                        {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "نعم، حذف"}
                    </button>
                    <button 
                        onClick={() => setDeleteConfirmation(null)}
                        disabled={isDeleting}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded-xl font-bold transition-colors border border-gray-700"
                    >
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBank;
