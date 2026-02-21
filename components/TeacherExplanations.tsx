
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Monitor, 
  Save, 
  Loader2, 
  Trash2, 
  Calendar, 
  FileText, 
  Search, 
  AlertTriangle, 
  Crown, 
  Backpack, 
  University, 
  Edit,
  Maximize2,
  PenTool
} from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { AppView, Explanation } from '../types';

interface TeacherExplanationsProps {
  onBack?: () => void;
  onNavigate: (view: AppView, extraData?: any) => void;
}

const CATEGORIES = [
  { id: 'grammar', title: 'القواعد (Grammar)' },
  { id: 'reading', title: 'القطع (Reading)' },
  { id: 'vocabulary', title: 'المفردات (Vocabulary)' },
  { id: 'writing', title: 'الكتابة (Writing)' },
];

const SUBJECTS = [
    { id: 'English', title: 'اللغة الإنجليزية (English)' },
];

const BACKGROUND_OPTIONS = [
    { id: 'exp-bg-default', label: 'الوضع الليلي (افتراضي)' },
    { id: 'exp-bg-white-ruled', label: 'دفتر مخطط أبيض' },
    { id: 'exp-bg-yellow-pad', label: 'دفتر أصفر (Legal)' },
    { id: 'exp-bg-grid', label: 'ورق مربوات (شبكي)' },
    { id: 'exp-bg-plain-white', label: 'أبيض سادة' },
    { id: 'exp-bg-sepia', label: 'ورق قديم (Sepia)' },
    { id: 'exp-bg-chalkboard', label: 'سبورة خضراء' },
    { id: 'exp-bg-blueprint', label: 'مخطط هندسي (Blue)' },
    { id: 'exp-bg-midnight-dots', label: 'نقاط ليلية' },
    { id: 'exp-bg-nebula-flow', label: 'خلفية متحركة (Nebula)' },
];

const TeacherExplanations: React.FC<TeacherExplanationsProps> = ({ onBack, onNavigate }) => {
  const { user } = useAuth();
  
  const [targetAudience, setTargetAudience] = useState<'school' | 'university' | null>(null);
  const [showResetWarning, setShowResetWarning] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [selectedSubject, setSelectedSubject] = useState('English');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<'First' | 'Second'>('First');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); 
  const [backgroundStyle, setBackgroundStyle] = useState('exp-bg-default');
  const [isPremium, setIsPremium] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);

  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Explanation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getCategoryTitle = (id: string) => CATEGORIES.find(c => c.id === id)?.title || id;

  const handleOpenEditor = () => {
    if (!selectedSubject || !selectedGrade || !selectedCategory || !title) {
        alert("يرجى ملء البيانات الأساسية (المادة، الصف، القسم، العنوان) أولاً.");
        return;
    }

    const initialData: Partial<Explanation> = {
        id: editingId || undefined,
        subject: selectedSubject,
        grade: selectedGrade,
        semester: selectedSemester,
        category: selectedCategory,
        title: title,
        content: content,
        backgroundStyle: backgroundStyle,
        isPremium: isPremium
    };

    onNavigate('EDITOR', {
        initialData,
        onFinished: (newContent: string, id?: string) => {
            setContent(newContent);
            if (id) setEditingId(id);
        }
    });
  };

  const handleSave = async () => {
    if (!selectedSubject || !selectedGrade || !selectedCategory || !title || !content) {
      alert("يرجى ملء جميع الحقول المطلوبة (بما في ذلك كتابة المحتوى في المحرر)");
      return;
    }

    setIsSaving(true);
    try {
      const data = {
        subject: selectedSubject,
        grade: selectedGrade,
        semester: selectedSemester,
        category: selectedCategory,
        title: title,
        content: content, 
        backgroundStyle: backgroundStyle,
        teacherName: user?.displayName || "المعلم",
        teacherId: user?.uid,
        isPremium: isPremium,
        updatedAt: serverTimestamp()
      };

      if (editingId) {
          await updateDoc(doc(db, "explanations", editingId), data);
          alert("تم تحديث الشرح بنجاح!");
      } else {
          await addDoc(collection(db, "explanations"), {
              ...data,
              createdAt: serverTimestamp()
          });
          alert("تم نشر الشرح بنجاح!");
      }
      
      resetForm(false);
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSearch = async () => {
      if (!searchTerm.trim()) return;
      setIsSearching(true);
      setHasSearched(true);
      setSearchResults([]);
      try {
          const q = query(collection(db, "explanations"), where("title", ">=", searchTerm), where("title", "<=", searchTerm + "\uf8ff"));
          const snapshot = await getDocs(q);
          const results: Explanation[] = [];
          snapshot.forEach(docSnap => {
              const d = docSnap.data();
              if (d.teacherId === user?.uid) {
                  // STRICT POJO mapping
                  results.push({ 
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
              }
          });
          setSearchResults(results);
      } catch (e) { console.error(e); } finally { setIsSearching(false); }
  };

  const startEdit = (exp: Explanation) => {
      setEditingId(exp.id || null);
      setTitle(exp.title);
      setContent(exp.content);
      setSelectedSubject(exp.subject || 'English');
      setSelectedGrade(exp.grade);
      setSelectedSemester(exp.semester || 'First');
      setSelectedCategory(exp.category);
      setBackgroundStyle(exp.backgroundStyle || 'exp-bg-default');
      setIsPremium(exp.isPremium || false);
      const isUni = exp.grade === 'English Major - QOU';
      setTargetAudience(isUni ? 'university' : 'school');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = async () => {
      if(!deleteId) return;
      setIsDeleting(true);
      try {
          await deleteDoc(doc(db, "explanations", deleteId));
          setSearchResults(prev => prev.filter(e => e.id !== deleteId));
          setDeleteId(null);
      } catch(e) { console.error(e); } finally { setIsDeleting(false); }
  };

  const resetForm = (resetPhase = true) => {
      if (resetPhase) setTargetAudience(null);
      setEditingId(null);
      setTitle('');
      setContent('');
      setIsPremium(false);
      setSelectedCategory('');
  };

  if (!targetAudience) {
      return (
        <div className="min-h-screen bg-gray-950 pb-20 animate-fade-in flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-white mb-3">إدارة الشروحات</h2>
                    <p className="text-gray-400">اختر الفئة لبدء العمل</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button onClick={() => setTargetAudience('school')} className="bg-gray-900 p-10 rounded-[2.5rem] border border-gray-700 hover:border-emerald-500 hover:bg-gray-800 transition-all group shadow-2xl flex flex-col items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-emerald-900/20 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform"><Backpack className="w-12 h-12 text-emerald-400" /></div>
                        <div><h3 className="text-2xl font-bold text-white mb-1">المدارس</h3><p className="text-gray-400 text-sm">صفوف (5 - 12)</p></div>
                    </button>
                    <button onClick={() => setTargetAudience('university')} className="bg-gray-900 p-10 rounded-[2.5rem] border border-gray-700 hover:border-blue-500 hover:bg-gray-800 transition-all group shadow-2xl flex flex-col items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-blue-900/20 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform"><University className="w-12 h-12 text-blue-400" /></div>
                        <div><h3 className="text-2xl font-bold text-white mb-1">الجامعات</h3><p className="text-gray-400 text-sm">تخصصات جامعية</p></div>
                    </button>
                </div>
                <div className="mt-12 text-center">
                    <button onClick={onBack} className="text-gray-500 font-bold hover:text-white flex items-center gap-2 mx-auto"><ArrowRight className="w-4 h-4" /> عودة للملف الشخصي</button>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-950 animate-fade-in text-gray-100 pb-20">
      
      {showResetWarning && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-md animate-fade-in">
              <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-12 w-full max-w-md relative border-2 border-red-500/20 shadow-2xl text-center animate-fade-in-up">
                  <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center mx-auto mb-8 border-2 border-red-500/20"><AlertTriangle className="w-10 h-10 text-red-500 animate-pulse" /></div>
                  <h3 className="text-2xl font-black text-white mb-4">تنبيه: مسح البيانات</h3>
                  <p className="text-gray-400 mb-10 leading-relaxed font-medium">هل أنت متأكد من تغيير الفئة؟ سيتم مسح النص المكتوب حالياً.</p>
                  <div className="flex gap-4">
                      <button onClick={() => { setShowResetWarning(false); resetForm(); }} className="flex-1 py-4 bg-red-600 text-white font-black rounded-2xl shadow-lg transform active:scale-95 text-lg">نعم</button>
                      <button onClick={() => setShowResetWarning(false)} className="flex-1 py-4 bg-gray-800 text-gray-300 font-bold rounded-2xl border border-gray-700 transition-all text-lg">تراجع</button>
                  </div>
              </div>
          </div>
      )}

      <div className="max-w-5xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <button onClick={() => setShowResetWarning(true)} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all text-gray-400 hover:text-white border border-gray-700 shadow-lg group"><ArrowRight className="w-5 h-5 group-hover:-translate-x-1" /></button>
                <div>
                    <h1 className="text-2xl font-black text-white">{editingId ? 'تعديل شرح' : 'إضافة شرح جديد'}</h1>
                    <p className="text-gray-500 text-xs font-bold">{targetAudience === 'school' ? 'المرحلة المدرسية' : 'المرحلة الجامعية'}</p>
                </div>
            </div>
            {editingId && <button onClick={() => resetForm(false)} className="bg-gray-800 text-orange-400 px-4 py-2 rounded-xl text-xs font-bold border border-orange-400/20">إلغاء التعديل</button>}
        </div>

        <div className="bg-gray-900 rounded-[2.5rem] border border-gray-800 p-6 md:p-8 shadow-xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">المادة</label>
                    <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full bg-gray-800 border-2 border-gray-700 rounded-2xl px-4 py-3.5 font-bold outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer">
                        {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">{targetAudience === 'university' ? 'التخصص' : 'الصف'}</label>
                    <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)} className="w-full bg-gray-800 border-2 border-gray-700 rounded-2xl px-4 py-3.5 font-bold outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer">
                        <option value="">اختر</option>
                        {targetAudience === 'school' ? [5,6,7,8,9,10,11,12].map(g => <option key={g} value={g.toString()}>الصف {g}</option>) : <option value="English Major - QOU">جامعة القدس المفتوحة</option>}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">القسم</label>
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full bg-gray-800 border-2 border-gray-700 rounded-2xl px-4 py-3.5 font-bold outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer">
                        <option value="">اختر القسم</option>
                        {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">عنوان الشرح</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="اكتب عنواناً جذاباً..." className="w-full bg-gray-800 border-2 border-gray-700 rounded-2xl px-5 py-3.5 font-black outline-none focus:border-emerald-500 transition-all" />
                </div>
                <div>
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">نمط الخلفية</label>
                    <select value={backgroundStyle} onChange={(e) => setBackgroundStyle(e.target.value)} className="w-full bg-gray-800 border-2 border-gray-700 rounded-2xl px-4 py-3.5 font-bold outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer">
                        {BACKGROUND_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                    </select>
                </div>
            </div>

            <div className="p-8 bg-gray-800/40 rounded-[2.5rem] border border-dashed border-gray-700 flex flex-col items-center justify-center text-center gap-6">
                <div className="w-20 h-20 rounded-full bg-emerald-900/20 flex items-center justify-center border border-emerald-500/20">
                    <PenTool className="w-10 h-10 text-emerald-400" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-white mb-2">محتوى الشرح</h3>
                    <p className="text-gray-400 text-sm max-w-sm mx-auto">انقر على الزر أدناه لفتح المحرر في صفحة كاملة وبدء كتابة شرحك بلمسة احترافية.</p>
                </div>
                <button 
                  onClick={handleOpenEditor} 
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-900/30 flex items-center gap-3 transition-all transform active:scale-95"
                >
                    <Maximize2 className="w-6 h-6" />
                    {content ? 'تعديل المحتوى المكتوب' : 'ابدأ الكتابة الآن'}
                </button>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-800">
                <label className="flex items-center gap-4 cursor-pointer group bg-gray-800/50 p-4 rounded-3xl border border-gray-700 hover:border-amber-500/30 transition-all">
                    <div className={`w-14 h-7 rounded-full relative transition-colors ${isPremium ? 'bg-amber-500' : 'bg-gray-600'}`}>
                        <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow-md ${isPremium ? 'right-1' : 'right-8'}`}></div>
                    </div>
                    <input type="checkbox" className="hidden" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} />
                    <div>
                        <span className="font-black text-white text-sm flex items-center gap-2">محتوى بريميوم <Crown className="w-4 h-4 text-amber-400 fill-amber-400" /></span>
                        <p className="text-[10px] text-gray-500 font-bold">متاح فقط للمشتركين</p>
                    </div>
                </label>
                <button onClick={handleSave} disabled={isSaving || !content} className={`w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-4 rounded-2xl font-black text-xl shadow-xl shadow-emerald-900/20 transition-all flex items-center justify-center gap-3 active:scale-95 ${!content ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}>
                    {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                    {editingId ? 'تحديث الشرح المختار' : 'نشر الشرح الآن'}
                </button>
            </div>
        </div>

        {/* Search & Manage Section */}
        <div className="bg-gray-900 rounded-[2.5rem] border border-gray-800 p-6 md:p-8 shadow-xl mt-8">
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2"><Search className="w-6 h-6 text-blue-500" /> إدارة شروحاتك السابقة</h3>
            <div className="flex gap-2 mb-8">
                <input type="text" placeholder="ابحث عن عنوان الشرح..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} className="flex-1 bg-gray-800 border-2 border-gray-700 rounded-2xl px-5 py-3 font-bold outline-none focus:border-blue-500" />
                <button onClick={handleSearch} disabled={isSearching} className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-2xl shadow-lg shadow-blue-900/20">{isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}</button>
            </div>

            {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.map((exp) => (
                        <div key={exp.id} className="bg-gray-800/50 p-5 rounded-3xl border border-gray-700 flex flex-col justify-between hover:border-blue-500/40 transition-all group">
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded-lg border border-blue-500/20">{getCategoryTitle(exp.category)}</span>
                                    {exp.isPremium && <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />}
                                </div>
                                <h4 className="text-lg font-black text-white line-clamp-1 mb-1">{exp.title}</h4>
                                <p className="text-xs text-gray-500 font-bold flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {exp.createdAt ? new Date(exp.createdAt.seconds * 1000).toLocaleDateString('ar-EG') : 'جديد'} • {exp.grade === 'English Major - QOU' ? 'جامعي' : `الصف ${exp.grade}`}</p>
                            </div>
                            <div className="flex gap-2 pt-4 border-t border-gray-700/50">
                                <button onClick={() => startEdit(exp)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all"><Edit className="w-4 h-4" /> تعديل</button>
                                <button onClick={() => setDeleteId(exp.id || null)} className="p-2 bg-red-900/20 text-red-400 hover:bg-red-600 hover:text-white rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : hasSearched && !isSearching && <div className="text-center py-10 text-gray-600 font-bold">لم يتم العثور على نتائج</div>}
        </div>
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center px-4 bg-black/90 backdrop-blur-sm animate-fade-in">
            <div className="bg-gray-900 rounded-3xl p-8 max-sm w-full border border-red-500/30 shadow-2xl text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-500/20"><Trash2 className="w-10 h-10 text-red-500" /></div>
                <h3 className="text-2xl font-black text-white mb-2">حذف الشرح؟</h3>
                <p className="text-gray-400 mb-8 font-medium">هذا الإجراء سيقوم بمسح الشرح نهائياً.</p>
                <div className="flex gap-3">
                    <button onClick={confirmDelete} disabled={isDeleting} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-black">{isDeleting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "حذف"}</button>
                    <button onClick={() => setDeleteId(null)} className="flex-1 bg-gray-800 text-gray-300 py-3 rounded-xl font-bold">إلغاء</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default TeacherExplanations;
