
import React, { useState } from 'react';
import { ArrowRight, UploadCloud, FileText, FolderOpen, Link, Save, Loader2, CheckCircle2, BookOpen, GraduationCap, Trash2, Calendar, Search, X, AlertTriangle, Home, Backpack, University, RotateCcw } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { AppView, StudyMaterial } from '../types';

interface TeacherUploadFilesProps {
  onBack?: () => void;
  onNavigate: (view: AppView) => void;
}

const CATEGORIES = [
  { id: 'handouts', title: 'الدوسيات والشروحات', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-900/20' },
  { id: 'worksheets', title: 'أوراق العمل', icon: FolderOpen, color: 'text-emerald-400', bg: 'bg-emerald-900/20' },
  { id: 'exams', title: 'نماذج امتحانات سابقة', icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-900/20' },
];

const SUBJECTS = [
    { id: 'English', title: 'اللغة الإنجليزية (English)' },
    { id: 'Math', title: 'الرياضيات' },
    { id: 'Science', title: 'العلوم' },
];

const TeacherUploadFiles: React.FC<TeacherUploadFilesProps> = ({ onBack, onNavigate }) => {
  const { user } = useAuth();
  
  // Audience State
  const [targetAudience, setTargetAudience] = useState<'school' | 'university' | null>(null);

  // Form State
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [fileTitle, setFileTitle] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Search/Delete State
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<StudyMaterial[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Delete Confirmation State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async () => {
    if (!selectedGrade || !selectedSubject || !selectedCategory || !fileTitle || !fileUrl) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (!fileUrl.startsWith('http')) {
        alert("يرجى التأكد من أن الرابط صحيح ويبدأ بـ http أو https");
        return;
    }

    setIsSaving(true);
    try {
      await addDoc(collection(db, "study_materials"), {
        grade: selectedGrade,
        subject: selectedSubject,
        category: selectedCategory,
        title: fileTitle,
        url: fileUrl,
        size: "Drive Link", 
        teacherName: user?.displayName || "المعلم",
        teacherId: user?.uid,
        createdAt: serverTimestamp()
      });
      
      setSuccess(true);
      setTimeout(() => {
          setSuccess(false);
          setFileTitle('');
          setFileUrl('');
      }, 2000);
      
    } catch (error) {
      console.error("Error saving file:", error);
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSearch = async () => {
      if (!searchTerm.trim()) return;
      if (!user?.uid) return;

      setIsSearching(true);
      setHasSearched(true);
      setSearchResults([]);

      try {
          const q = query(
              collection(db, "study_materials"),
              where("title", ">=", searchTerm),
              where("title", "<=", searchTerm + "\uf8ff")
          );

          const snapshot = await getDocs(q);
          const results: StudyMaterial[] = [];
          
          snapshot.forEach(docSnap => {
              const d = docSnap.data();
              if (d.teacherId === user.uid) {
                  // STRICT POJO mapping
                  results.push({ 
                      id: docSnap.id, 
                      title: String(d.title || ''),
                      url: String(d.url || ''),
                      subject: String(d.subject || ''),
                      grade: String(d.grade || ''),
                      category: d.category as any,
                      size: String(d.size || ''),
                      teacherName: String(d.teacherName || ''),
                      teacherId: String(d.teacherId || ''),
                      createdAt: d.createdAt ? { seconds: d.createdAt.seconds } : null
                  } as StudyMaterial);
              }
          });

          setSearchResults(results);
      } catch (e) {
          console.error("Error searching files:", e);
      } finally {
          setIsSearching(false);
      }
  };

  const confirmDelete = async () => {
      if(!deleteId) return;
      
      setIsDeleting(true);
      try {
          await deleteDoc(doc(db, "study_materials", deleteId));
          setSearchResults(prev => prev.filter(f => f.id !== deleteId));
          setDeleteId(null);
      } catch(e) {
          console.error(e);
          alert("حدث خطأ أثناء الحذف");
      } finally {
          setIsDeleting(false);
      }
  };

  const handleBack = () => {
      if(onBack) onBack();
      else onNavigate('PROFILE');
  };

  const formatDate = (timestamp: any) => {
      if (!timestamp) return '';
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString('ar-EG');
  };

  const resetForm = () => {
    setSelectedGrade('');
    setSelectedSubject('');
    setSelectedCategory('');
    setFileTitle('');
    setFileUrl('');
  };

  if (!targetAudience) {
      return (
        <div className="min-h-screen bg-gray-950 pb-20 animate-fade-in transition-colors duration-300 text-gray-100 flex items-center justify-center">
            <div className="max-w-4xl w-full px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-white mb-3">اختر الفئة المستهدفة</h2>
                    <p className="text-gray-400">لمن تريد رفع هذا الملف؟</p>
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
                            <h3 className="text-2xl font-bold text-white mb-1">طالب مدرسي</h3>
                            <p className="text-gray-400 text-sm">صفوف مدرسية (5 - 12)</p>
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
                            <h3 className="text-2xl font-bold text-white mb-1">طالب جامعي</h3>
                            <p className="text-gray-400 text-sm">التعليم الجامعي والتخصصات</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-950 animate-fade-in transition-colors duration-300 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 pt-2 pb-2 relative z-30">
        <div className="flex items-center gap-3">
            <button 
              onClick={handleBack}
              className="p-2 bg-gray-900/50 hover:bg-gray-800 rounded-xl transition-all text-gray-400 hover:text-white border border-white/10 shadow-lg backdrop-blur-sm group"
            >
              <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
                <h1 className="text-lg font-black text-white tracking-tight mb-0.5">رفع ملفات المواد</h1>
                <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-medium text-gray-500">
                    <span onClick={handleBack} className="hover:text-emerald-400 cursor-pointer transition-colors flex items-center gap-1">
                       <Home className="w-3 h-3" /> الرئيسية
                    </span>
                    <span className="text-gray-700">/</span>
                    <span className="text-emerald-500 flex items-center gap-1">
                        <UploadCloud className="w-3 h-3" />
                        إدارة الملفات
                    </span>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="bg-gray-900 rounded-3xl shadow-sm border border-white/5 p-6 md:p-8 mb-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <UploadCloud className="w-6 h-6 text-blue-500" />
                    إضافة ملف جديد
                </h2>
                <button 
                    onClick={() => { setTargetAudience(null); resetForm(); }}
                    className="bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-gray-700 transition-colors"
                >
                    <RotateCcw className="w-3 h-3" />
                    تغيير الفئة
                </button>
            </div>

            {success ? (
                <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                    <div className="w-20 h-20 bg-green-900 rounded-full flex items-center justify-center mb-4 border border-green-500/20">
                        <CheckCircle2 className="w-10 h-10 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">تم الرفع بنجاح!</h2>
                    <p className="text-gray-400 mb-6">ظهر الملف الآن في صفحة ملفات المواد للطلاب.</p>
                    <button 
                        onClick={() => setSuccess(false)}
                        className="bg-gray-800 text-gray-300 px-6 py-2 rounded-xl font-bold hover:bg-gray-700 transition-colors border border-white/5"
                    >
                        إضافة ملف آخر
                    </button>
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-blue-500" />
                                {targetAudience === 'university' ? 'التخصص' : 'الصف الدراسي'}
                            </label>
                            <select 
                                value={selectedGrade}
                                onChange={(e) => setSelectedGrade(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-700 bg-gray-800 focus:border-blue-500 outline-none font-bold text-white appearance-none cursor-pointer"
                            >
                                <option value="">اختر</option>
                                {targetAudience === 'school' ? (
                                    [5,6,7,8,9,10,11,12].map(g => (
                                        <option key={g} value={g.toString()}>الصف {g}</option>
                                    ))
                                ) : (
                                    <option value="English Major - QOU">جامعة القدس المفتوحة</option>
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-blue-500" />
                                المادة
                            </label>
                            {targetAudience === 'university' ? (
                                <input 
                                    type="text"
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    placeholder="اسم المساق..."
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-700 bg-gray-800 focus:border-blue-500 outline-none font-bold text-white"
                                />
                            ) : (
                                <select 
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-700 bg-gray-800 focus:border-blue-500 outline-none font-bold text-white appearance-none cursor-pointer"
                                >
                                    <option value="">اختر المادة</option>
                                    {SUBJECTS.map(sub => (
                                        <option key={sub.id} value={sub.id}>{sub.title}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-3">
                            نوع الملف (التصنيف)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all text-center h-full ${
                                        selectedCategory === cat.id
                                        ? 'bg-blue-900/30 border-blue-500 text-blue-300 ring-1 ring-blue-500'
                                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-blue-500/50'
                                    }`}
                                >
                                    <div className={`p-2 rounded-lg ${cat.bg}`}>
                                        <cat.icon className={`w-6 h-6 ${cat.color}`} />
                                    </div>
                                    <span className="font-bold text-sm">{cat.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2">
                                عنوان الملف
                            </label>
                            <input 
                                type="text"
                                value={fileTitle}
                                onChange={(e) => setFileTitle(e.target.value)}
                                placeholder="مثال: دوسية القواعد الشاملة - الوحدة الأولى"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-700 focus:border-blue-500 outline-none font-bold text-white bg-gray-800 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                                <Link className="w-4 h-4 text-blue-500" />
                                رابط الملف (Google Drive Link)
                            </label>
                            <input 
                                type="url"
                                value={fileUrl}
                                onChange={(e) => setFileUrl(e.target.value)}
                                placeholder="https://drive.google.com/file/d/..."
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-700 focus:border-blue-500 outline-none font-medium text-blue-400 bg-gray-800 transition-all text-left"
                                dir="ltr"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1"
                        >
                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            حفظ ونشر الملف
                        </button>
                    </div>
                </div>
            )}
        </div>

        <div className="bg-gray-900 rounded-3xl shadow-sm border border-white/5 p-6 md:p-8">
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                <Trash2 className="w-6 h-6 text-red-500" />
                إدارة الملفات (حذف)
            </h3>
            
            <div className="mb-6">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="ابحث عن اسم الملف للحذف..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full px-5 py-3 pl-12 rounded-xl bg-gray-800 border border-gray-700 focus:border-red-500 outline-none text-white font-bold"
                    />
                    <button 
                        onClick={handleSearch}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-700 hover:bg-gray-600 p-2 rounded-lg text-gray-300 transition-colors"
                    >
                        {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {searchResults.length > 0 ? (
                <div className="space-y-3 animate-fade-in">
                    {searchResults.map((file) => (
                        <div key={file.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex items-center justify-between group hover:border-red-500/50 transition-all">
                            <div className="flex items-center gap-4 overflow-hidden">
                                <div className="w-10 h-10 rounded-lg bg-blue-900/20 flex items-center justify-center text-blue-400 shrink-0">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-white truncate mb-1">{file.title}</h4>
                                    <div className="flex items-center gap-3 text-xs text-gray-400">
                                        <span className="bg-gray-700 px-1.5 py-0.5 rounded">{file.subject}</span>
                                        <span>{file.grade === 'English Major - QOU' ? 'جامعي' : `الصف ${file.grade}`}</span>
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(file.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => file.id && setDeleteId(file.id)}
                                className="p-2 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                                title="حذف الملف"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : hasSearched && !isSearching && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-800 rounded-xl">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>لم يتم العثور على ملفات بهذا الاسم</p>
                </div>
            )}
        </div>
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-gray-900 rounded-3xl p-8 max-sm w-full border border-gray-700 shadow-2xl text-center transform scale-100">
                <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">تأكيد الحذف</h3>
                <p className="text-gray-400 mb-8 text-sm">هل أنت متأكد من حذف هذا الملف؟ لا يمكن التراجع عن هذا الإجراء.</p>
                <div className="flex gap-3">
                    <button 
                        onClick={confirmDelete}
                        disabled={isDeleting}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                    >
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "نعم، حذف"}
                    </button>
                    <button 
                        onClick={() => setDeleteId(null)}
                        disabled={isDeleting}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded-xl font-bold transition-colors"
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

export default TeacherUploadFiles;
