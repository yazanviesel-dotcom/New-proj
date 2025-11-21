import React, { useState } from 'react';
import { 
  PlusCircle, 
  Save, 
  Trash2, 
  CheckCircle2, 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  HelpCircle, 
  AlignRight,
  FileQuestion,
  PenTool,
  Loader2
} from 'lucide-react';
import { Question, Quiz } from '../types';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Quiz Metadata State
  const [quizDetails, setQuizDetails] = useState({
    title: '',
    subject: '',
    grade: '',
    description: ''
  });

  // Questions List State
  const [questions, setQuestions] = useState<Question[]>([]);

  // Current Question Form State
  const [currentQuestion, setCurrentQuestion] = useState<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  });

  // Handle Input Changes for Current Question
  const handleQuestionChange = (field: string, value: any) => {
    setCurrentQuestion(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
  };

  // Add Question to List
  const handleAddQuestion = () => {
    if (!currentQuestion.question.trim() || currentQuestion.options.some(opt => !opt.trim())) {
      alert("يرجى ملء السؤال وجميع الخيارات");
      return;
    }

    const newQuestion: Question = {
      id: Date.now(), // temporary ID
      question: currentQuestion.question,
      options: currentQuestion.options,
      correctAnswer: currentQuestion.correctAnswer,
      explanation: currentQuestion.explanation
    };

    setQuestions([...questions, newQuestion]);
    
    // Reset Form
    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });
  };

  // Remove Question
  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  // Save to Firebase
  const handleSaveQuiz = async () => {
    if (!quizDetails.title || !quizDetails.subject || !quizDetails.grade) {
      alert("يرجى تعبئة معلومات الاختبار الأساسية");
      return;
    }
    if (questions.length === 0) {
      alert("يرجى إضافة سؤال واحد على الأقل");
      return;
    }

    setIsSaving(true);
    try {
      const newQuiz: Quiz = {
        title: quizDetails.title,
        subject: quizDetails.subject,
        grade: quizDetails.grade,
        questions: questions,
        createdBy: user?.uid || 'teacher',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "quizzes"), newQuiz);
      
      alert("تم حفظ الاختبار ونشره بنجاح!");
      
      // Reset Full Form
      setQuizDetails({ title: '', subject: '', grade: '', description: '' });
      setQuestions([]);
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans animate-fade-in">
      
      {/* Aesthetic Header matching Home Theme (Emerald) */}
      <div className="bg-white pt-12 pb-24 px-4 relative overflow-hidden border-b border-gray-200">
         <div className="absolute inset-0 bg-grid-pattern opacity-60"></div>
         
         {/* Decorative Blobs matching Hero */}
         <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>

         <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-emerald-50 rounded-2xl shadow-sm border border-emerald-100">
                    <LayoutDashboard className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">لوحة إعداد الاختبارات</h1>
                    <p className="text-gray-500 mt-2 font-medium text-lg">قم ببناء اختبارات احترافية لطلابك بكل سهولة</p>
                </div>
            </div>
         </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-20">
         
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Quiz Metadata & Questions List */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Step 1: Basic Info */}
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 md:p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                        <BookOpen className="w-6 h-6 text-emerald-600" />
                        بيانات الاختبار الأساسية
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">عنوان الاختبار</label>
                            <input 
                                type="text"
                                value={quizDetails.title}
                                onChange={(e) => setQuizDetails({...quizDetails, title: e.target.value})}
                                placeholder="مثال: اختبار الوحدة الأولى - الفيزياء"
                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none font-bold text-black placeholder-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">المادة الدراسية</label>
                            <div className="relative">
                                <PenTool className="w-4 h-4 text-gray-400 absolute top-3.5 right-3" />
                                <input 
                                    type="text"
                                    value={quizDetails.subject}
                                    onChange={(e) => setQuizDetails({...quizDetails, subject: e.target.value})}
                                    placeholder="مثال: الرياضيات"
                                    className="w-full px-4 py-3 pr-10 rounded-xl bg-white border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-black placeholder-gray-400"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">الصف الدراسي</label>
                            <div className="relative">
                                <GraduationCap className="w-4 h-4 text-gray-400 absolute top-3.5 right-3" />
                                <select 
                                    value={quizDetails.grade}
                                    onChange={(e) => setQuizDetails({...quizDetails, grade: e.target.value})}
                                    className="w-full px-4 py-3 pr-10 rounded-xl bg-white border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-black appearance-none"
                                >
                                    <option value="">اختر الصف</option>
                                    <option value="5">الخامس</option>
                                    <option value="6">السادس</option>
                                    <option value="7">السابع</option>
                                    <option value="8">الثامن</option>
                                    <option value="9">التاسع</option>
                                    <option value="10">العاشر</option>
                                    <option value="11">الحادي عشر</option>
                                    <option value="12">الثاني عشر</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">وصف الاختبار (اختياري)</label>
                        <textarea 
                            value={quizDetails.description}
                            onChange={(e) => setQuizDetails({...quizDetails, description: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-black h-24 resize-none placeholder-gray-400"
                            placeholder="أضف وصفاً مختصراً للاختبار..."
                        />
                    </div>
                </div>

                {/* Step 2: Add Questions */}
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 md:p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                        <PlusCircle className="w-6 h-6 text-emerald-600" />
                        إضافة الأسئلة
                    </h3>

                    <div className="space-y-6">
                        {/* Question Text */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">نص السؤال</label>
                            <div className="relative">
                                <HelpCircle className="w-4 h-4 text-gray-400 absolute top-3.5 right-3" />
                                <input 
                                    type="text" 
                                    value={currentQuestion.question}
                                    onChange={(e) => handleQuestionChange('question', e.target.value)}
                                    placeholder="اكتب نص السؤال هنا..."
                                    className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-bold text-lg text-black bg-white placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentQuestion.options.map((opt, idx) => (
                                <div key={idx}>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex justify-between">
                                        <span>الخيار {idx + 1}</span>
                                        <button 
                                            onClick={() => handleQuestionChange('correctAnswer', idx)}
                                            className={`text-xs px-2 py-0.5 rounded-full transition-colors ${currentQuestion.correctAnswer === idx ? 'bg-emerald-100 text-emerald-700 font-bold' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                        >
                                            {currentQuestion.correctAnswer === idx ? 'الإجابة الصحيحة' : 'تحديد كإجابة صحيحة'}
                                        </button>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute top-3.5 right-3 text-gray-400 text-xs font-bold">{idx + 1}</span>
                                        <input 
                                            type="text"
                                            value={opt}
                                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                                            placeholder={`الخيار ${idx + 1}`}
                                            className={`w-full px-4 py-3 pr-8 rounded-xl border focus:ring-2 outline-none transition-all ${
                                                idx === currentQuestion.correctAnswer 
                                                ? 'border-emerald-500 bg-emerald-50 focus:ring-emerald-200 text-black font-bold' 
                                                : 'border-gray-300 bg-white focus:border-emerald-500 focus:ring-emerald-100 text-black placeholder-gray-400'
                                            }`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Explanation */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">تفسير الإجابة (يظهر للطالب بعد الحل)</label>
                            <textarea 
                                value={currentQuestion.explanation}
                                onChange={(e) => handleQuestionChange('explanation', e.target.value)}
                                placeholder="اشرح لماذا هذه الإجابة هي الصحيحة..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-black bg-white h-24 resize-none placeholder-gray-400"
                            />
                        </div>

                        <button 
                            onClick={handleAddQuestion}
                            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                        >
                            <PlusCircle className="w-5 h-5" />
                            إضافة السؤال للاختبار
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Column: Preview & Actions */}
            <div className="lg:col-span-1 space-y-8">
                
                {/* Actions Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sticky top-24">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Save className="w-5 h-5 text-emerald-600" />
                        إجراءات الاختبار
                    </h3>
                    
                    <div className="space-y-3">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">عدد الأسئلة</span>
                                <span className="font-bold text-gray-900">{questions.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">الحالة</span>
                                <span className="text-emerald-600 font-bold">مسودة</span>
                            </div>
                        </div>

                        <button 
                            onClick={handleSaveQuiz}
                            disabled={isSaving || questions.length === 0}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                                isSaving || questions.length === 0
                                ? 'bg-gray-300 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-200'
                            }`}
                        >
                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                            {isSaving ? 'جاري الحفظ...' : 'حفظ ونشر الاختبار'}
                        </button>
                    </div>
                </div>

                {/* Questions List Preview */}
                {questions.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 px-2">الأسئلة المضافة ({questions.length})</h3>
                        {questions.map((q, idx) => (
                            <div key={q.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm group hover:border-emerald-300 transition-all">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex items-start gap-2">
                                        <span className="bg-emerald-100 text-emerald-700 font-bold w-6 h-6 flex items-center justify-center rounded-full text-xs shrink-0 mt-0.5">
                                            {idx + 1}
                                        </span>
                                        <p className="font-bold text-gray-800 text-sm line-clamp-2">{q.question}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteQuestion(q.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
         </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;