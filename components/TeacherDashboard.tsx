
import React, { useState, useRef, useEffect } from 'react';
import { 
  PlusCircle, 
  Save, 
  Trash2, 
  CheckCircle2, 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  HelpCircle, 
  Loader2, 
  PenTool,
  Tag,
  ChevronDown,
  FileText,
  AlignLeft,
  Type,
  MoveRight,
  Download,
  Search,
  X,
  Edit,
  RotateCcw,
  RefreshCw,
  Clock,
  Timer,
  Crown,
  School,
  University,
  Backpack,
  CalendarDays,
  ToggleLeft,
  List,
  ListOrdered,
  ClipboardPaste,
  Wand2,
  PencilLine,
  AlertTriangle,
  Bold,
  Underline,
  Highlighter,
  AlignRight,
  AlignCenter,
  Palette,
  Type as FontIcon,
  ArrowLeft
} from 'lucide-react';
import { Question, Quiz } from '../types';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc, updateDoc, limit } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

// --- Visual Rich Text Editor for Passage (Advanced Version) ---
const VisualPassageEditor = ({ value, onChange, placeholder }: { value: string, onChange: (val: string) => void, placeholder?: string }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [highlightColor, setHighlightColor] = useState('#facc15');
    const [textColor, setTextColor] = useState('#ffffff');

    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
             if (value === '') editorRef.current.innerHTML = '';
             else if (!editorRef.current.innerHTML) editorRef.current.innerHTML = value;
        }
    }, [value]);

    const execCmd = (command: string, arg: string = '') => {
        document.execCommand(command, false, arg);
        if (editorRef.current) onChange(editorRef.current.innerHTML);
        editorRef.current?.focus();
    };

    const handleInput = () => {
        if (editorRef.current) onChange(editorRef.current.innerHTML);
    };

    return (
        <div className="border-2 border-blue-800/50 rounded-2xl overflow-hidden bg-gray-800 flex flex-col min-h-[300px] shadow-2xl relative">
            {/* Toolbar */}
            <div className="bg-gray-900 border-b border-gray-700 p-2 flex flex-wrap items-center gap-1">
                <button type="button" onClick={() => execCmd('bold')} className="p-2 hover:bg-gray-700 rounded text-gray-300 transition-colors" title="عريض">
                    <Bold className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => execCmd('underline')} className="p-2 hover:bg-gray-700 rounded text-gray-300 transition-colors" title="تسطير">
                    <Underline className="w-4 h-4" />
                </button>
                
                <div className="w-px h-6 bg-gray-700 mx-1"></div>

                {/* Highlighter Color Picker */}
                <div className="flex items-center gap-1 bg-gray-800 rounded-lg px-1 border border-gray-700 group hover:border-yellow-500/50 transition-all">
                    <button type="button" onClick={() => execCmd('hiliteColor', highlightColor)} className="p-1.5 text-yellow-500" title="تضليل">
                        <Highlighter className="w-4 h-4" />
                    </button>
                    <input 
                        type="color" 
                        value={highlightColor}
                        onChange={(e) => setHighlightColor(e.target.value)}
                        className="w-5 h-5 bg-transparent border-none cursor-pointer p-0"
                    />
                </div>

                {/* Text Color Picker */}
                <div className="flex items-center gap-1 bg-gray-800 rounded-lg px-1 border border-gray-700 group hover:border-blue-500/50 transition-all ml-1">
                    <button type="button" onClick={() => execCmd('foreColor', textColor)} className="p-1.5 text-blue-400" title="لون النص">
                        <Palette className="w-4 h-4" />
                    </button>
                    <input 
                        type="color" 
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-5 h-5 bg-transparent border-none cursor-pointer p-0"
                    />
                </div>

                <div className="w-px h-6 bg-gray-700 mx-1"></div>

                <select 
                    onChange={(e) => execCmd('fontSize', e.target.value)} 
                    className="bg-gray-800 text-white text-[10px] p-1.5 rounded border border-gray-700 outline-none"
                    defaultValue="3"
                >
                    <option value="1">صغير جداً</option>
                    <option value="2">صغير</option>
                    <option value="3">عادي</option>
                    <option value="4">كبير</option>
                    <option value="5">ضخم</option>
                </select>

                <div className="w-px h-6 bg-gray-700 mx-1"></div>

                <button type="button" onClick={() => execCmd('insertUnorderedList')} className="p-2 hover:bg-gray-700 rounded text-gray-300" title="قائمة منقطة">
                    <List className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => execCmd('insertOrderedList')} className="p-2 hover:bg-gray-700 rounded text-gray-300" title="قائمة مرقمة">
                    <ListOrdered className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-gray-700 mx-1"></div>

                <button type="button" onClick={() => execCmd('justifyLeft')} className="p-2 hover:bg-gray-700 rounded text-gray-300" title="يسار">
                    <AlignLeft className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => execCmd('justifyCenter')} className="p-2 hover:bg-gray-700 rounded text-gray-300" title="توسيط">
                    <AlignCenter className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => execCmd('justifyRight')} className="p-2 hover:bg-gray-700 rounded text-gray-300" title="يمين">
                    <AlignRight className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-gray-700 mx-1"></div>
                <button type="button" onClick={() => execCmd('removeFormat')} className="p-2 hover:bg-red-900/20 rounded text-red-400" title="مسح التنسيق">
                    <RotateCcw className="w-4 h-4" />
                </button>
            </div>

            {/* Editable Area */}
            <div className="relative flex-1 flex flex-col">
                <div 
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    className="flex-1 p-5 outline-none text-white overflow-y-auto text-left min-h-[250px] leading-relaxed"
                    style={{ direction: 'ltr' }}
                    dir="ltr"
                ></div>
                {(!value || value === '<br>') && (
                    <div className="absolute top-5 left-5 pointer-events-none text-gray-500 text-sm italic">
                        {placeholder || 'اكتب نص القطعة هنا وقم بتنسيقه بحرية...'}
                    </div>
                )}
            </div>
        </div>
    );
};

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // --- AUDIENCE STATE ---
  const [targetAudience, setTargetAudience] = useState<'school' | 'university' | null>(null);
  const [showResetWarning, setShowResetWarning] = useState(false);

  // --- QUIZ STATES ---
  const [isSaving, setIsSaving] = useState(false);
  const [currentQuizId, setCurrentQuizId] = useState<string | null>(null);

  const [questionType, setQuestionType] = useState<'MCQ' | 'TF' | 'READING' | 'REORDER' | 'REWRITE'>('MCQ');
  const [readingSubType, setReadingSubType] = useState<'MCQ' | 'TF'>('MCQ');

  const [quizDetails, setQuizDetails] = useState<{
    title: string;
    subject: string;
    grade: string;
    semester: 'First' | 'Second';
    category: string;
    description: string;
    duration: string;
    questionDuration: string;
    isPremium: boolean;
    keepOrder: boolean;
  }>({
    title: '',
    subject: 'English',
    grade: '',
    semester: 'First',
    category: 'Language',
    description: '',
    duration: '30',
    questionDuration: '',
    isPremium: false,
    keepOrder: false
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);

  // --- SMART PASTE STATE ---
  const [showSmartPaste, setShowSmartPaste] = useState(false);
  const [smartPasteContent, setSmartPasteContent] = useState('');

  const [currentQuestion, setCurrentQuestion] = useState<{
    question: string;
    options: string[];
    correctAnswer: number;
    correctAnswerText: string;
    explanation: string;
    passageContent: string;
    generalInstruction: string;
    passageFontSize: 'sm' | 'md' | 'lg' | 'xl';
  }>({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    correctAnswerText: '',
    explanation: '',
    passageContent: '',
    generalInstruction: '',
    passageFontSize: 'md',
  });

  const [reorderSentence, setReorderSentence] = useState('');

  // --- IMPORT QUIZ STATES (Live from Server - STRICT POJO Mapping) ---
  const [showImportModal, setShowImportModal] = useState(false);
  const [importList, setImportList] = useState<Quiz[]>([]);
  const [isLoadingImport, setIsLoadingImport] = useState(false);
  const [importSearchTerm, setImportSearchTerm] = useState('');

  // Live Import Effect with Full Serialization
  useEffect(() => {
      let unsubscribe: () => void;
      if (showImportModal) {
          setIsLoadingImport(true);
          const q = query(collection(db, "quizzes"), orderBy("createdAt", "desc"), limit(50));
          
          unsubscribe = onSnapshot(q, (snapshot) => {
              try {
                  const data = snapshot.docs.map(docSnap => {
                      const d = docSnap.data();
                      // STRICT POJO Mapping to prevent circular reference errors (Q$1, Sa, etc.)
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
                  setImportList(data);
              } catch (e) {
                  console.error("Data mapping error in import:", e);
              } finally {
                  setIsLoadingImport(false);
              }
          }, (error) => {
              console.error("Live fetch error", error);
              setIsLoadingImport(false);
          });
      }
      return () => { if(unsubscribe) unsubscribe(); };
  }, [showImportModal]);

  const handleQuestionChange = (field: string, value: any) => {
    setCurrentQuestion(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
  };

  const resetForm = (resetType: boolean = false, preservePassage: boolean = false) => {
    setCurrentQuestion(prev => ({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      correctAnswerText: '',
      explanation: '',
      passageContent: preservePassage ? prev.passageContent : '',
      generalInstruction: preservePassage ? prev.generalInstruction : '',
      passageFontSize: preservePassage ? prev.passageFontSize : 'md',
    }));
    setReorderSentence('');
    setEditingQuestionId(null);
    setSmartPasteContent(''); 
    
    if (resetType) {
        setQuestionType('MCQ');
        setReadingSubType('MCQ');
        setShowSmartPaste(false);
    }
  };

  const handleSmartParse = () => {
    if (!smartPasteContent.trim()) return;

    const lines = smartPasteContent.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length < 2) {
        alert("النص قصير جداً. يرجى التأكد من نسخ السؤال والخيارات.");
        return;
    }

    let parsedQuestion = "";
    let parsedOptions = ["", "", "", ""];
    let parsedExplanation = "";

    const expIndex = lines.findIndex(l => l.match(/^(explanation|answer note|reason|التفسير|تفسير|الإجابة|الشرح|الشرح|السبب)[:\-\s]/i));
    if (expIndex > -1) {
        parsedExplanation = lines[expIndex].trim();
        if (expIndex < lines.length - 1) {
             const extraExp = lines.slice(expIndex + 1).join(' ');
             parsedExplanation += " " + extraExp;
        }
        lines.splice(expIndex, lines.length - expIndex); 
    }

    const optionPattern = /^([a-d]|[1-4]|أ|ب|ج|د|A-D)[\.\)\-]\s*(.*)/i;
    const optionLinesIndices = lines.map((l, i) => l.match(optionPattern) ? i : -1).filter(i => i !== -1);

    if (optionLinesIndices.length >= 2) {
        const firstOptIndex = optionLinesIndices[0];
        parsedQuestion = lines.slice(0, firstOptIndex).join('\n');
        
        optionLinesIndices.slice(0, 4).forEach((lineIdx, i) => {
            const match = lines[lineIdx].match(optionPattern);
            if (match) parsedOptions[i] = match[2].trim();
        });
    } else {
        parsedQuestion = lines[0];
        for (let i = 0; i < 4; i++) {
            if (lines[i + 1]) parsedOptions[i] = lines[i + 1];
        }
    }

    setCurrentQuestion(prev => ({
        ...prev,
        question: parsedQuestion,
        options: parsedOptions,
        explanation: parsedExplanation
    }));
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.question.trim()) {
      alert("يرجى كتابة نص السؤال");
      return;
    }
    
    const isEffectiveTF = questionType === 'TF' || (questionType === 'READING' && readingSubType === 'TF');
    const isEffectiveMCQ = questionType === 'MCQ' || (questionType === 'READING' && readingSubType === 'MCQ');

    if (isEffectiveMCQ && currentQuestion.options.some(opt => !opt.trim())) {
        alert("يرجى ملء جميع الخيارات");
        return;
    }
    if (questionType === 'READING' && !currentQuestion.passageContent.trim()) {
        alert("يرجى إدخال نص القطعة");
        return;
    }
    if (questionType === 'REORDER' && !reorderSentence.trim()) {
        alert("يرجى كتابة الجملة المراد ترتيبها");
        return;
    }
    if (questionType === 'REWRITE' && !currentQuestion.correctAnswerText.trim()) {
        alert("يرجى كتابة الإجابة النموذجية");
        return;
    }

    let finalOptions: string[] = [];
    
    if (isEffectiveTF) {
        finalOptions = ["صح", "خطأ"];
    } else if (questionType === 'REORDER') {
        finalOptions = reorderSentence.split(' ').filter(w => w.trim().length > 0);
        if (finalOptions.length < 2) {
            alert("يجب أن تتكون الجملة من كلمتين على الأقل");
            return;
        }
    } else {
        finalOptions = currentQuestion.options;
    }

    const newQuestion: Question = {
      id: editingQuestionId ? editingQuestionId : Date.now(),
      question: currentQuestion.question,
      options: finalOptions,
      correctAnswer: currentQuestion.correctAnswer,
      correctAnswerText: currentQuestion.correctAnswerText,
      explanation: currentQuestion.explanation || "",
      type: questionType
    };

    if (questionType === 'READING') {
        newQuestion.passageContent = currentQuestion.passageContent;
        newQuestion.generalInstruction = currentQuestion.generalInstruction;
        newQuestion.passageFontSize = currentQuestion.passageFontSize;
    }

    if (editingQuestionId) {
        setQuestions(questions.map(q => q.id === editingQuestionId ? newQuestion : q));
        setEditingQuestionId(null);
        resetForm(false);
    } else {
        setQuestions([...questions, newQuestion]);
        resetForm(false, questionType === 'READING');
    }
  };

  const handleEditQuestion = (id: number) => {
      const q = questions.find(item => item.id === id);
      if (!q) return;

      setEditingQuestionId(id);
      setQuestionType(q.type || 'MCQ');
      
      if (q.type === 'READING') {
          if (q.options.length === 2 && q.options.includes("صح") && q.options.includes("خطأ")) {
              setReadingSubType('TF');
          } else {
              setReadingSubType('MCQ');
          }
      }

      if (q.type === 'REORDER') {
          setReorderSentence(q.options.join(' '));
          setCurrentQuestion({
              question: q.question,
              options: ['', '', '', ''], 
              correctAnswer: q.correctAnswer,
              correctAnswerText: '',
              explanation: q.explanation || '',
              passageContent: q.passageContent || '',
              generalInstruction: q.generalInstruction || '',
              passageFontSize: q.passageFontSize || 'md',
          });
      } else {
          const isTF = q.type === 'TF' || (q.type === 'READING' && q.options.length === 2 && q.options.includes("صح"));
          
          setCurrentQuestion({
              question: q.question,
              options: isTF ? ['', '', '', ''] : (q.options.length >= 4 ? q.options : [...q.options, ...Array(4 - q.options.length).fill('')]), 
              correctAnswer: q.correctAnswer,
              correctAnswerText: q.correctAnswerText || '',
              explanation: q.explanation || '',
              passageContent: q.passageContent || '',
              generalInstruction: q.generalInstruction || '',
              passageFontSize: q.passageFontSize || 'md',
          });
          setReorderSentence('');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    resetForm(false);
  };

  const handleDeleteQuestion = (id: number) => {
    if(window.confirm("هل أنت متأكد من حذف هذا السؤال؟")) {
        setQuestions(questions.filter(q => q.id !== id));
        if (editingQuestionId === id) {
            resetForm(false);
        }
    }
  };

  const handleSaveQuiz = async () => {
    if (!quizDetails.title || !quizDetails.grade) {
      alert("يرجى تعبئة عنوان الاختبار والصف/التخصص");
      return;
    }
    if (questions.length === 0) {
      alert("يرجى إضافة سؤال واحد على الأقل");
      return;
    }

    setIsSaving(true);
    try {
      const quizData = {
        title: quizDetails.title,
        subject: quizDetails.subject,
        grade: quizDetails.grade,
        semester: quizDetails.semester,
        category: quizDetails.category,
        questions: questions,
        createdBy: user?.uid || 'teacher',
        teacherName: user?.displayName || 'المعلم',
        description: quizDetails.description || "",
        duration: parseInt(quizDetails.duration) || 30,
        questionDuration: quizDetails.questionDuration ? parseInt(quizDetails.questionDuration) : null,
        isPremium: quizDetails.isPremium || false,
        keepOrder: quizDetails.keepOrder || false
      };

      if (currentQuizId) {
          const quizRef = doc(db, "quizzes", currentQuizId);
          await updateDoc(quizRef, {
              ...quizData,
              updatedAt: serverTimestamp()
          });
          alert("تم تحديث بيانات الاختبار بنجاح!");
      } else {
          await addDoc(collection(db, "quizzes"), {
              ...quizData,
              createdAt: serverTimestamp()
          });
          
          alert("تم حفظ الاختبار ونشره بنجاح!");
      }

      setQuizDetails({ title: '', subject: 'English', grade: '', semester: 'First', category: 'Language', description: '', duration: '30', questionDuration: '', isPremium: false, keepOrder: false });
      setQuestions([]);
      setCurrentQuizId(null);
      resetForm(true);
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelQuizEdit = () => {
      if(window.confirm("هل أنت متأكد من إلغاء التعديل؟ سيتم تفريغ الحقول.")) {
        setQuizDetails({ title: '', subject: 'English', grade: '', semester: 'First', category: 'Language', description: '', duration: '30', questionDuration: '', isPremium: false, keepOrder: false });
        setQuestions([]);
        setCurrentQuizId(null);
        resetForm(true);
      }
  };

  const handleOpenImport = () => {
      setShowImportModal(true);
  };

  const handleImportQuiz = (quiz: Quiz) => {
      if (questions.length > 0) {
          if (!window.confirm("هل أنت متأكد؟ سيتم استبدال البيانات الحالية ببيانات الاختبار المختار.")) return;
      }
      setCurrentQuizId(quiz.id || null);
      const isUni = quiz.grade === 'English Major - QOU' || quiz.grade.includes('University');
      setTargetAudience(isUni ? 'university' : 'school');

      setQuizDetails({
          title: quiz.title,
          subject: quiz.subject,
          grade: quiz.grade,
          semester: quiz.semester || 'First', 
          category: quiz.category || 'Language',
          description: quiz.description || '',
          duration: quiz.duration ? quiz.duration.toString() : '30',
          questionDuration: quiz.questionDuration ? quiz.questionDuration.toString() : '',
          isPremium: quiz.isPremium || false,
          keepOrder: quiz.keepOrder || false
      });
      setQuestions(quiz.questions);
      setShowImportModal(false);
      resetForm(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChangePhaseRequest = () => {
      if (questions.length > 0 || quizDetails.title.trim() !== '') {
          setShowResetWarning(true);
      } else {
          setTargetAudience(null);
          setCurrentQuizId(null);
          resetForm(true);
      }
  };

  const confirmPhaseChange = () => {
      setShowResetWarning(false);
      setTargetAudience(null);
      setCurrentQuizId(null);
      resetForm(true);
  };

  const filteredImportList = importList.filter(q => 
      (q.title ? q.title.toLowerCase().includes(importSearchTerm.toLowerCase()) : false) ||
      (q.grade ? q.grade.includes(importSearchTerm) : false)
  );

  const fontSizeOptions: { value: 'sm' | 'md' | 'lg' | 'xl', label: string }[] = [
      { value: 'sm', label: 'صغير' },
      { value: 'md', label: 'متوسط' },
      { value: 'lg', label: 'كبير' },
      { value: 'xl', label: 'كبير جداً' },
  ];

  if (!targetAudience && !currentQuizId) {
      return (
        <div className="min-h-screen bg-gray-950 pb-20 animate-fade-in transition-colors duration-300 text-gray-100 flex items-center justify-center">
            <div className="max-w-4xl w-full px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-white mb-3">اختر الفئة المستهدفة</h2>
                    <p className="text-gray-400">لمن تريد إنشاء هذا الاختبار؟</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button onClick={() => setTargetAudience('school')} className="bg-gray-900 p-10 rounded-[2.5rem] border border-gray-700 hover:border-emerald-500 hover:bg-gray-800 transition-all group shadow-2xl flex flex-col items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-emerald-900/20 flex items-center justify-center group-hover:scale-110 transition-transform border border-emerald-500/20"><Backpack className="w-12 h-12 text-emerald-400" /></div>
                        <div><h3 className="text-2xl font-bold text-white mb-1">طالب مدرسي</h3><p className="text-gray-400 text-sm">صفوف مدرسية (5 - 12)</p></div>
                    </button>
                    <button onClick={() => setTargetAudience('university')} className="bg-gray-900 p-10 rounded-[2.5rem] border border-gray-700 hover:border-blue-500 hover:bg-gray-800 transition-all group shadow-2xl flex flex-col items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-blue-900/20 flex items-center justify-center group-hover:scale-110 transition-transform border border-blue-500/20"><University className="w-12 h-12 text-blue-400" /></div>
                        <div><h3 className="text-2xl font-bold text-white mb-1">طالب جامعي</h3><p className="text-gray-400 text-sm">التعليم الجامعي والتخصصات</p></div>
                    </button>
                </div>
            </div>
        </div>
      );
  }

  const isEffectiveMCQ = questionType === 'MCQ' || (questionType === 'READING' && readingSubType === 'MCQ');

  return (
    <div className="min-h-screen bg-gray-950 pb-20 animate-fade-in transition-colors duration-300 text-gray-100">
      
      {/* Custom Reset Warning Modal (Modern Card Design) */}
      {showResetWarning && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4 bg-black/80 backdrop-blur-md animate-fade-in">
              <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-12 w-full max-w-md relative border-2 border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.15)] text-center animate-fade-in-up">
                  <div className="w-24 h-24 rounded-3xl bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center mx-auto mb-8 shadow-inner">
                      <AlertTriangle className="w-12 h-12 text-red-500 animate-pulse" />
                  </div>
                  
                  <h3 className="text-3xl font-black text-white mb-4 tracking-tight">تنبيه: تغيير المرحلة</h3>
                  <p className="text-gray-400 text-lg mb-10 leading-relaxed font-medium">
                    هل أنت متأكد من تغيير المرحلة؟ <br/>
                    <span className="text-red-400/80 font-bold">سيتم فقدان الأسئلة الحالية والبيانات التي لم تُحفظ بعد.</span>
                  </p>
                  
                  <div className="flex flex-col gap-4">
                      <button 
                        onClick={confirmPhaseChange}
                        className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-lg shadow-red-900/20 transition-all transform active:scale-95 text-lg"
                      >
                        نعم، أريد التغيير
                      </button>
                      <button 
                        onClick={() => setShowResetWarning(false)}
                        className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-2xl border border-gray-700 transition-all text-lg flex items-center justify-center gap-2"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        تراجع والبقاء
                      </button>
                  </div>
              </div>
          </div>
      )}

      <div className="bg-gray-950 pt-10 pb-28 px-4 border-b border-white/5 shadow-sm relative overflow-hidden">
         <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-blue-900/30 rounded-3xl shadow-inner border border-blue-800"><LayoutDashboard className="w-10 h-10 text-blue-400" /></div>
                    <div className="text-center md:text-right">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2">إدارة الاختبارات</h1>
                        <p className="text-blue-400 font-bold text-lg flex items-center gap-2 justify-center md:justify-start">
                            {targetAudience === 'university' ? <University className="w-5 h-5"/> : <Backpack className="w-5 h-5"/>}
                            نظام {targetAudience === 'university' ? 'التعليم الجامعي' : 'التعليم المدرسي'}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleChangePhaseRequest} className="bg-gray-800 text-gray-300 px-4 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-700 transition-colors"><RotateCcw className="w-5 h-5" /> تغيير المرحلة</button>
                    <button onClick={handleOpenImport} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg"><Download className="w-5 h-5" /> استيراد اختبار</button>
                </div>
            </div>
         </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-20">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className={`bg-gray-900 rounded-[2rem] shadow-xl border p-6 md:p-8 transition-all ${currentQuizId ? 'border-blue-500 ring-2 ring-blue-900' : 'border-gray-700'}`}>
                        <div className="flex justify-between items-start mb-8 border-b border-gray-700 pb-4">
                            <h3 className="text-xl font-black text-white flex items-center gap-3"><div className="bg-blue-900/30 p-2 rounded-lg"><BookOpen className="w-5 h-5 text-blue-400" /></div> {currentQuizId ? 'تعديل بيانات الاختبار' : 'بيانات الاختبار الأساسية'}</h3>
                            {currentQuizId && (
                                <div className="flex gap-2">
                                    <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs font-bold animate-pulse">وضع التعديل</span>
                                    <button onClick={handleCancelQuizEdit} className="text-red-500 hover:bg-red-900/20 px-2 rounded"><X className="w-4 h-4"/></button>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-gray-300 mb-2">عنوان الاختبار</label>
                                <input type="text" value={quizDetails.title} onChange={(e) => setQuizDetails({...quizDetails, title: e.target.value})} placeholder="مثال: اختبار الوحدة الأولى - قواعد" className="w-full px-5 py-4 rounded-2xl bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-900/30 transition-all outline-none font-bold text-white placeholder-gray-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">المادة الدراسية</label>
                                <div className="relative">
                                    <PenTool className="w-5 h-5 text-gray-400 absolute top-4 right-4 pointer-events-none" />
                                    {targetAudience === 'university' ? (
                                        <input type="text" value={quizDetails.subject} onChange={(e) => setQuizDetails({...quizDetails, subject: e.target.value})} placeholder="اكتب اسم المساق..." className="w-full px-5 py-4 rounded-2xl bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none font-bold text-white" />
                                    ) : (
                                        <select value={quizDetails.subject} onChange={(e) => setQuizDetails({...quizDetails, subject: e.target.value})} className="w-full px-5 py-4 pr-12 rounded-2xl bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-900/30 outline-none transition-all font-bold text-white appearance-none cursor-pointer">
                                            <option value="English">English</option>
                                            <option value="Science">العلوم</option>
                                            <option value="Math">الرياضيات</option>
                                        </select>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">{targetAudience === 'university' ? 'التخصص الجامعي' : 'الصف الدراسي'}</label>
                                <div className="relative">
                                    <GraduationCap className="w-5 h-5 text-gray-400 absolute top-4 right-4 pointer-events-none" />
                                    <select value={quizDetails.grade} onChange={(e) => setQuizDetails({...quizDetails, grade: e.target.value})} className="w-full px-5 py-4 pr-12 rounded-2xl bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-900/30 outline-none transition-all font-bold text-white appearance-none cursor-pointer">
                                        <option value="" className="text-gray-400">-- اختر --</option>
                                        {targetAudience === 'school' ? [5, 6, 7, 8, 9, 10, 11, 12].map((g) => (<option key={g} value={g.toString()}>الصف {g}</option>)) : <option value="English Major - QOU">جامعة القدس المفتوحة</option>}
                                    </select>
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"><ChevronDown className="w-5 h-5" /></div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">الفصل الدراسي</label>
                                <div className="relative">
                                    <CalendarDays className="w-5 h-5 text-gray-400 absolute top-4 right-4 pointer-events-none" />
                                    <select value={quizDetails.semester} onChange={(e) => setQuizDetails({...quizDetails, semester: e.target.value as 'First' | 'Second'})} className="w-full px-5 py-4 pr-12 rounded-2xl bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-900/30 outline-none transition-all font-bold text-white appearance-none cursor-pointer">
                                        <option value="First">الفصل الدراسي الأول</option>
                                        <option value="Second">الفصل الدراسي الثاني</option>
                                    </select>
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"><ChevronDown className="w-5 h-5" /></div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">نوع المهارة / الاختبار</label>
                                <div className="relative">
                                    <Tag className="w-5 h-5 text-gray-400 absolute top-4 right-4 pointer-events-none" />
                                    <select value={quizDetails.category} onChange={(e) => setQuizDetails({...quizDetails, category: e.target.value})} className="w-full px-5 py-4 pr-12 rounded-2xl bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-900/30 outline-none transition-all font-bold text-white appearance-none cursor-pointer">
                                        <option value="Language">Language (القواعد)</option>
                                        <option value="Reading">Reading (القطعة)</option>
                                        <option value="Writing">Writing (الكتابة)</option>
                                        <option value="Vocabulary">Vocabulary (المفردات)</option>
                                        <option value="General">اختبار عام</option>
                                    </select>
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"><ChevronDown className="w-5 h-5" /></div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2"><Clock className="w-4 h-4 text-blue-600" /> مدة الامتحان (د)</label>
                                <input type="number" min="1" value={quizDetails.duration} onChange={(e) => setQuizDetails({...quizDetails, duration: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none font-bold text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2"><Timer className="w-4 h-4 text-blue-600" /> وقت كل سؤال (ث)</label>
                                <input type="number" min="5" value={quizDetails.questionDuration} onChange={(e) => setQuizDetails({...quizDetails, questionDuration: e.target.value})} placeholder="وقت مفتوح" className="w-full px-5 py-4 rounded-2xl bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none font-bold text-white" />
                            </div>
                            <div className="col-span-1">
                                <label className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${quizDetails.keepOrder ? 'bg-indigo-900/20 border-indigo-500/50' : 'bg-gray-800 border-gray-700'}`}>
                                    <div className={`w-12 h-6 rounded-full relative transition-colors ${quizDetails.keepOrder ? 'bg-indigo-500' : 'bg-gray-600'}`}><div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${quizDetails.keepOrder ? 'right-1' : 'right-7'}`}></div></div>
                                    <input type="checkbox" className="hidden" checked={quizDetails.keepOrder} onChange={(e) => setQuizDetails({...quizDetails, keepOrder: e.target.checked})} />
                                    <div className="flex-1"><span className="font-bold text-white text-sm">ترتيب ثابت</span></div>
                                </label>
                            </div>
                            <div className="col-span-1">
                                <label className="flex items-center gap-3 p-4 rounded-2xl bg-amber-900/10 border border-amber-500/20 cursor-pointer">
                                    <div className={`w-12 h-6 rounded-full relative transition-colors ${quizDetails.isPremium ? 'bg-amber-500' : 'bg-gray-600'}`}><div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${quizDetails.isPremium ? 'right-1' : 'right-8'}`}></div></div>
                                    <input type="checkbox" className="hidden" checked={quizDetails.isPremium} onChange={(e) => setQuizDetails({...quizDetails, isPremium: e.target.checked})} />
                                    <div className="flex-1"><span className="font-bold text-white text-sm">محتوى Premium</span></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-[2rem] shadow-xl border border-gray-700 p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gray-700 pb-4">
                            <h3 className="text-xl font-black text-white flex items-center gap-3"><div className="bg-blue-900/30 p-2 rounded-lg"><PlusCircle className="w-5 h-5 text-blue-400" /></div> {editingQuestionId ? 'تعديل السؤال' : 'إضافة الأسئلة'}</h3>
                            <div className="flex flex-wrap gap-2 bg-gray-800 p-1.5 rounded-xl">
                                <button onClick={() => setQuestionType('MCQ')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${questionType === 'MCQ' ? 'bg-gray-700 text-blue-400' : 'text-gray-400'}`}>اختيار</button>
                                <button onClick={() => setQuestionType('TF')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${questionType === 'TF' ? 'bg-gray-700 text-blue-400' : 'text-gray-400'}`}>صح/خطأ</button>
                                <button onClick={() => setQuestionType('READING')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${questionType === 'READING' ? 'bg-gray-700 text-blue-400' : 'text-gray-400'}`}>قطعة</button>
                                <button onClick={() => setQuestionType('REORDER')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${questionType === 'REORDER' ? 'bg-gray-700 text-blue-400' : 'text-gray-400'}`}>ترتيب</button>
                                <button onClick={() => setQuestionType('REWRITE')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${questionType === 'REWRITE' ? 'bg-gray-700 text-blue-400' : 'text-gray-400'}`}>أعد كتابة</button>
                            </div>
                        </div>

                        {!editingQuestionId && (
                            <div className="mb-8">
                                {!showSmartPaste ? (
                                    <button onClick={() => setShowSmartPaste(true)} className="text-xs font-bold text-emerald-400 bg-emerald-900/10 px-4 py-2 rounded-lg border border-emerald-500/20 transition-colors w-fit"><Wand2 className="w-4 h-4" /> استيراد ذكي من النص (نسخ ولصق)</button>
                                ) : (
                                    <div className="bg-gray-800/50 p-4 rounded-xl border border-emerald-500/30 animate-fade-in relative">
                                        <button onClick={() => setShowSmartPaste(false)} className="absolute top-2 left-2 text-gray-500 hover:text-white p-1"><X className="w-4 h-4" /></button>
                                        <h4 className="text-emerald-400 font-bold text-sm mb-2 flex items-center gap-2"><ClipboardPaste className="w-4 h-4" /> لصق السؤال والخيارات</h4>
                                        <textarea value={smartPasteContent} onChange={(e) => setSmartPasteContent(e.target.value)} className="w-full h-32 bg-gray-900 border border-gray-700 rounded-xl p-3 text-sm text-white focus:border-emerald-500 outline-none resize-none mb-3" />
                                        <div className="flex gap-2 justify-end"><button onClick={handleSmartParse} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1"><Wand2 className="w-3 h-3" /> تحليل وتعبئة الحقول</button></div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-6">
                            {questionType === 'READING' && (
                                <div className="space-y-4 bg-blue-900/20 p-5 rounded-2xl border border-blue-800 mb-6">
                                    <div className="flex justify-between items-center"><h4 className="font-bold text-blue-300 flex items-center gap-2"><AlignLeft className="w-5 h-5" /> إعدادات القطعة</h4></div>
                                    
                                    <div><label className="block text-xs font-bold text-blue-300 mb-1">السؤال العام</label><input type="text" value={currentQuestion.generalInstruction} onChange={(e) => handleQuestionChange('generalInstruction', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-blue-700 focus:border-blue-500 outline-none bg-gray-800 text-sm font-medium" /></div>
                                    
                                    <div>
                                        <label className="block text-xs font-bold text-blue-300 mb-1 flex justify-between">
                                            <span>نص القطعة (تعديل مرئي)</span>
                                            <span className="text-[10px] text-blue-400">حدد النص لتنسيقه فوراً</span>
                                        </label>
                                        <VisualPassageEditor 
                                            value={currentQuestion.passageContent}
                                            onChange={(val) => handleQuestionChange('passageContent', val)}
                                        />
                                    </div>

                                    <div className="flex flex-wrap gap-4 justify-between items-end">
                                        <div className="flex gap-2">
                                            {fontSizeOptions.map(opt => (
                                                <button key={opt.value} onClick={() => handleQuestionChange('passageFontSize', opt.value)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${currentQuestion.passageFontSize === opt.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-800 text-gray-300 border-gray-600 hover:border-blue-400'}`}>{opt.label}</button>
                                            ))}
                                        </div>
                                        <div className="bg-gray-800 p-1.5 rounded-xl border border-blue-700/50 flex gap-2">
                                            <button onClick={() => setReadingSubType('MCQ')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${readingSubType === 'MCQ' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}><List className="w-3 h-3" /> اختيارات</button>
                                            <button onClick={() => setReadingSubType('TF')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${readingSubType === 'TF' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}><ToggleLeft className="w-3 h-3" /> صح/خطأ</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div><label className="block text-sm font-bold text-gray-300 mb-2">نص السؤال</label><div className="relative"><HelpCircle className="w-5 h-5 text-gray-400 absolute top-4 right-4" /><input type="text" value={currentQuestion.question} onChange={(e) => handleQuestionChange('question', e.target.value)} className="w-full px-5 py-4 pr-12 rounded-2xl border-2 border-gray-600 focus:border-blue-500 outline-none font-bold text-lg text-white bg-gray-800 transition-all" /></div></div>

                            {isEffectiveMCQ ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {currentQuestion.options.map((opt, idx) => (
                                        <div key={idx} className={`relative group transition-all duration-300 ${currentQuestion.correctAnswer === idx ? 'scale-[1.02]' : ''}`}>
                                            <label className="flex items-center justify-between mb-2 px-1"><span className={`text-xs font-bold ${currentQuestion.correctAnswer === idx ? 'text-blue-400' : 'text-gray-400'}`}>الخيار {idx + 1}</span><button onClick={() => handleQuestionChange('correctAnswer', idx)} className={`text-[10px] px-2 py-1 rounded-md font-bold ${currentQuestion.correctAnswer === idx ? 'bg-blue-900/30 text-blue-300' : 'bg-gray-700 text-gray-500'}`}>{currentQuestion.correctAnswer === idx ? 'صحيحة' : 'تحديد'}</button></label>
                                            <input type="text" value={opt} onChange={(e) => handleOptionChange(idx, e.target.value)} className={`w-full px-4 py-3 rounded-xl border-2 outline-none font-medium ${idx === currentQuestion.correctAnswer ? 'border-blue-500 bg-blue-900/20 text-white' : 'border-gray-600 bg-gray-700 text-gray-200'}`} />
                                        </div>
                                    ))}
                                </div>
                            ) : questionType === 'REORDER' ? (
                                <div className="space-y-4"><label className="block text-sm font-bold text-gray-300 mb-1">الجملة الصحيحة</label><input type="text" dir="ltr" value={reorderSentence} onChange={(e) => setReorderSentence(e.target.value)} className="w-full px-5 py-4 rounded-2xl border-2 border-emerald-800 focus:border-emerald-500 outline-none text-lg font-medium text-white bg-emerald-900/10 text-left" /></div>
                            ) : questionType === 'REWRITE' ? (
                                <div className="space-y-4"><label className="block text-sm font-bold text-gray-300 mb-1">الاجابة النموذجية</label><textarea dir="ltr" value={currentQuestion.correctAnswerText} onChange={(e) => handleQuestionChange('correctAnswerText', e.target.value)} className="w-full px-5 py-4 rounded-2xl border-2 border-blue-800 focus:border-blue-500 outline-none text-lg font-medium text-white bg-blue-900/10 text-left h-24 resize-none" /></div>
                            ) : (
                                <div className="flex gap-4">
                                    <button onClick={() => handleQuestionChange('correctAnswer', 0)} className={`flex-1 py-4 rounded-2xl border-2 font-black text-lg flex items-center justify-center gap-2 ${currentQuestion.correctAnswer === 0 ? 'border-blue-500 bg-blue-900/30 text-blue-400' : 'border-gray-600 bg-gray-700'}`}>صح (True)</button>
                                    <button onClick={() => handleQuestionChange('correctAnswer', 1)} className={`flex-1 py-4 rounded-2xl border-2 font-black text-lg flex items-center justify-center gap-2 ${currentQuestion.correctAnswer === 1 ? 'border-red-500 bg-red-900/30 text-red-400' : 'border-gray-600 bg-gray-700'}`}>خطأ (False)</button>
                                </div>
                            )}

                            <div className="bg-yellow-900/10 p-4 rounded-2xl border border-yellow-900/30">
                                <label className="block text-sm font-bold text-yellow-500 mb-2 flex items-center gap-2">تفسير الإجابة (اختياري)</label>
                                <textarea value={currentQuestion.explanation} onChange={(e) => handleQuestionChange('explanation', e.target.value)} placeholder="Type explanation here..." className="w-full px-4 py-3 rounded-xl border border-yellow-800/50 focus:border-yellow-400 outline-none text-gray-200 bg-gray-800 h-20 resize-none text-right" dir="rtl" />
                            </div>

                            <div className="flex gap-3">
                                {editingQuestionId && (<button onClick={handleCancelEdit} className="flex-1 bg-gray-700 text-gray-300 py-4 rounded-2xl font-bold hover:bg-gray-600 transition-all flex items-center justify-center gap-2"><RotateCcw className="w-5 h-5" /> إلغاء التعديل</button>)}
                                <button onClick={handleAddQuestion} className={`flex-1 bg-gray-800 text-white py-4 rounded-2xl font-bold hover:bg-gray-900 transition-all flex items-center justify-center gap-2 border border-gray-700 ${editingQuestionId ? 'bg-blue-600 hover:bg-blue-700 border-blue-600' : ''}`}>{editingQuestionId ? <><Save className="w-5 h-5" /> تحديث السؤال</> : <><PlusCircle className="w-5 h-5" /> إضافة السؤال للقائمة</>}</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-900 rounded-[2rem] shadow-xl border border-gray-700 p-6">
                        <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2"><Save className="w-5 h-5 text-blue-400" /> إجراءات النشر</h3>
                        <div className="space-y-4">
                            <div className="p-5 bg-gray-800 rounded-2xl border border-gray-600 flex flex-col gap-3">
                                <div className="flex justify-between text-sm"><span className="text-gray-400 font-medium">عدد الأسئلة</span><span className="font-black text-white">{questions.length}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-400 font-medium">نوع الاختبار</span><span className="text-blue-400 font-bold">{quizDetails.category}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-400 font-medium">الحالة</span>{currentQuizId ? <span className="text-emerald-400 font-bold">تحديث</span> : <span className="text-blue-400 font-bold">جديد</span>}</div>
                            </div>
                            <button onClick={handleSaveQuiz} disabled={isSaving || questions.length === 0} className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all flex items-center justify-center gap-2 ${isSaving || questions.length === 0 ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>{isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : currentQuizId ? <RefreshCw className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}{isSaving ? 'جاري الحفظ...' : currentQuizId ? 'تحديث الاختبار' : 'نشر الاختبار الآن'}</button>
                        </div>
                    </div>
                    {questions.length > 0 && (
                        <div className="bg-gray-900 rounded-[2rem] shadow-xl border border-gray-700 p-6 animate-fade-in-up">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><LayoutDashboard className="w-4 h-4 text-blue-400" /> الأسئلة المضافة ({questions.length})</h3>
                            <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2 custom-scrollbar">
                                {questions.map((q, idx) => (
                                    <div key={q.id} className={`p-3 rounded-xl border transition-all group relative ${editingQuestionId === q.id ? 'bg-blue-900/20 border-blue-500 ring-1 ring-blue-500' : 'bg-gray-700/50 border-gray-600'}`}>
                                        <div className="flex items-start gap-3"><span className="bg-gray-600 text-gray-300 font-bold w-6 h-6 flex items-center justify-center rounded-lg text-xs shrink-0">{idx + 1}</span><div className="flex-1 min-w-0"><p className="font-bold text-gray-200 text-sm line-clamp-2">{q.question}</p></div></div>
                                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-600/50 justify-end"><button onClick={() => handleEditQuestion(q.id)} className="text-xs font-bold text-blue-400 flex items-center gap-1"><Edit className="w-3.5 h-3.5" /> تعديل</button><div className="w-px h-3 bg-gray-600"></div><button onClick={() => handleDeleteQuestion(q.id)} className="text-xs font-bold text-red-500 flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> حذف</button></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
             </div>
      </div>

      {showImportModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-900 rounded-3xl w-full max-w-3xl flex flex-col shadow-2xl animate-fade-in-up overflow-hidden max-h-[85vh]">
                <div className="bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-900/30 p-2 rounded-xl">
                            <Download className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white">استيراد اختبار (Live)</h2>
                            <p className="text-sm text-gray-400">قائمة مباشرة من السيرفر - اختر اختباراً لتعديله</p>
                        </div>
                    </div>
                    <button onClick={() => setShowImportModal(false)} className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-4 bg-gray-800 border-b border-gray-700">
                    <div className="relative">
                        <Search className="w-5 h-5 text-gray-400 absolute top-3.5 right-4 pointer-events-none" />
                        <input 
                            type="text" 
                            placeholder="ابحث عن اسم الاختبار..." 
                            value={importSearchTerm} 
                            onChange={(e) => setImportSearchTerm(e.target.value)} 
                            className="w-full px-12 py-3 rounded-xl border border-gray-700 focus:border-emerald-500 outline-none bg-gray-700 font-bold text-white transition-all" 
                        />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 bg-gray-900 custom-scrollbar">
                    {isLoadingImport ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
                            <p className="text-gray-500 font-bold text-sm">جاري جلب البيانات الحية...</p>
                        </div>
                    ) : filteredImportList.length === 0 ? (
                        <div className="text-center py-20 text-gray-400 flex flex-col items-center gap-4">
                            <AlertTriangle className="w-12 h-12 opacity-20" />
                            <p>لا توجد اختبارات متاحة للاستيراد حالياً</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredImportList.map((quiz) => (
                                <div 
                                    key={quiz.id} 
                                    onClick={() => handleImportQuiz(quiz)} 
                                    className="bg-gray-800 p-5 rounded-2xl border border-gray-700 cursor-pointer hover:border-emerald-500 hover:shadow-xl transition-all group relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="bg-blue-900/40 text-blue-300 text-[10px] font-black px-2.5 py-1 rounded-lg border border-blue-500/20">{quiz.subject}</span>
                                        <span className="text-[10px] font-bold text-gray-500 bg-gray-950/50 px-2 py-1 rounded-md border border-white/5">{quiz.grade === 'English Major - QOU' ? 'جامعي' : `الصف ${quiz.grade}`}</span>
                                    </div>
                                    <h4 className="font-black text-white mb-2 line-clamp-1 group-hover:text-emerald-400 transition-colors text-base">{quiz.title}</h4>
                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
                                            <HelpCircle className="w-3.5 h-3.5 text-gray-600" />
                                            {quiz.questions.length} أسئلة
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[9px] text-gray-600 font-mono">
                                            <CalendarDays className="w-3 h-3" />
                                            {quiz.createdAt ? new Date(quiz.createdAt.seconds * 1000).toLocaleDateString('ar-EG') : 'جديد'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <div className="p-4 bg-gray-800 border-t border-gray-700 flex justify-end shrink-0">
                    <button 
                        onClick={() => setShowImportModal(false)}
                        className="px-6 py-2 rounded-xl font-bold text-gray-400 hover:bg-gray-700 transition-colors"
                    >
                        إغلاق القائمة
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
