
import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, GraduationCap, ArrowRight, FileText, FolderOpen, Search, Download, ChevronDown, AlertCircle, Loader2, CheckCircle, Home, Backpack, University, RotateCcw } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { StudyMaterial } from '../types';

interface EducationalLessonsProps {
  onBack: () => void;
}

interface Folder {
  id: string;
  title: string;
  files: StudyMaterial[];
}

// --- Custom Select Component ---
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
         className={`w-full px-3 py-3 rounded-xl font-bold text-right border-2 flex justify-between items-center outline-none transition-all text-xs md:text-sm
            ${disabled 
               ? 'bg-gray-800 border-gray-700 text-gray-400 cursor-not-allowed' 
               : isOpen 
                 ? 'bg-gray-800 border-emerald-500 ring-4 ring-emerald-900/20 text-white shadow-lg' 
                 : 'bg-gray-700 border-transparent hover:border-emerald-700 text-white shadow-sm'
            }
         `}
       >
          <span className={`truncate ${!selectedOption ? 'text-gray-500' : ''}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`} />
       </button>

       {isOpen && (
         <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-2xl shadow-xl max-h-72 overflow-y-auto custom-scrollbar animate-fade-in p-2 z-50">
            {options.map((opt, idx) => {
               if(opt.isHeader) {
                 return <div key={idx} className="px-4 py-2 text-[10px] font-black text-gray-500 uppercase tracking-wider mt-2 first:mt-0 bg-gray-700/50 rounded-lg mb-1">{opt.label}</div>
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

const EducationalLessons: React.FC<EducationalLessonsProps> = ({ onBack }) => {
  const [studentLevel, setStudentLevel] = useState<'school' | 'university' | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [view, setView] = useState<'SELECTION' | 'CONTENT'>('SELECTION');
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['handouts']); // Default open first folder
  
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (view === 'CONTENT' && selectedGrade && selectedSubject) {
        fetchMaterials();
    }
  }, [view, selectedGrade, selectedSubject]);

  const fetchMaterials = async () => {
      setLoading(true);
      const CACHE_KEY = `etqan_materials_${selectedGrade}_${selectedSubject}`;
      const CACHE_TTL = 365 * 24 * 60 * 60 * 1000; // 1 Year Cache (365 days)

      // 1. Try Local Storage Cache
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
          try {
              const { data, timestamp } = JSON.parse(cached);
              if (Date.now() - timestamp < CACHE_TTL) {
                  setMaterials(data);
                  setLoading(false);
                  return;
              }
          } catch (e) {
              console.error("Cache parsing error", e);
          }
      }

      // 2. Fetch from Firestore (Fallback)
      try {
          const q = query(
              collection(db, "study_materials"),
              where("grade", "==", selectedGrade),
              where("subject", "==", selectedSubject)
          );
          
          const snapshot = await getDocs(q);
          const fetchedMaterials: StudyMaterial[] = [];
          snapshot.forEach(doc => {
              const data = doc.data();
              fetchedMaterials.push({ 
                  id: doc.id, 
                  ...data,
                  // Sanitize timestamp for caching to prevent circular reference error
                  createdAt: data.createdAt ? { seconds: data.createdAt.seconds } : null
              } as StudyMaterial);
          });

          // Client-side sort
          fetchedMaterials.sort((a, b) => {
             const timeA = a.createdAt?.seconds || 0;
             const timeB = b.createdAt?.seconds || 0;
             return timeB - timeA;
          });

          setMaterials(fetchedMaterials);

          // 3. Save to Local Storage
          localStorage.setItem(CACHE_KEY, JSON.stringify({
              data: fetchedMaterials,
              timestamp: Date.now()
          }));

      } catch (error) {
          console.error("Error fetching materials:", error);
      } finally {
          setLoading(false);
      }
  };

  const handleNext = () => {
    if (selectedSubject && selectedGrade) {
      setView('CONTENT');
    }
  };

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const organizeFolders = (): Folder[] => {
    const handouts = materials.filter(m => m.category === 'handouts');
    const worksheets = materials.filter(m => m.category === 'worksheets');
    const exams = materials.filter(m => m.category === 'exams');
    
    return [
        {
            id: 'handouts',
            title: 'الدوسيات والشروحات',
            files: handouts
        },
        {
            id: 'worksheets',
            title: 'أوراق العمل',
            files: worksheets
        },
        {
            id: 'exams',
            title: 'نماذج الامتحانات',
            files: exams
        }
    ];
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'جديد';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('ar-EG');
  };

  const currentFolders = organizeFolders();

  const renderSelection = () => {
    // If level is not selected, show level selection cards
    if (!studentLevel) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in relative z-20">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-white mb-3">اختر نوع التعليم</h2>
                    <p className="text-gray-400">حدد مرحلتك الدراسية للوصول للمكتبة</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button 
                        onClick={() => setStudentLevel('school')}
                        className="bg-gray-900 p-8 rounded-3xl border border-gray-700 hover:border-emerald-500 hover:bg-gray-800 transition-all group shadow-xl flex flex-col items-center gap-4"
                    >
                        <div className="w-20 h-20 rounded-full bg-emerald-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Backpack className="w-10 h-10 text-emerald-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">طالب مدرسي</h3>
                        <p className="text-gray-400 text-sm">للصفوف المدرسية من الخامس حتى التوجيهي</p>
                    </button>

                    <button 
                        onClick={() => setStudentLevel('university')}
                        className="bg-gray-900 p-8 rounded-3xl border border-gray-700 hover:border-blue-500 hover:bg-gray-800 transition-all group shadow-xl flex flex-col items-center gap-4"
                    >
                        <div className="w-20 h-20 rounded-full bg-blue-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <University className="w-10 h-10 text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">طالب جامعي</h3>
                        <p className="text-gray-400 text-sm">لطلاب الجامعات (جامعة القدس المفتوحة)</p>
                    </button>
                </div>
            </div>
        );
    }

    // Adapt Options based on Level
    let gradeOptions: Option[] = [];
    if (studentLevel === 'school') {
        gradeOptions = [
            { label: 'المرحلة المدرسية', value: 'school_header', isHeader: true },
            ...[5, 6, 7, 8, 9, 10, 11, 12].map(g => ({ label: `الصف ${g}`, value: g.toString() }))
        ];
    } else {
        gradeOptions = [
            { label: 'تخصص اللغة الإنجليزية - جامعة القدس المفتوحة', value: 'English Major - QOU' }
        ];
    }

    // Subject Options - Keep Only English
    const subjectOptions: Option[] = [
        { label: 'اللغة الإنجليزية (English)', value: 'English' },
    ];

    return (
    <div className="w-full animate-fade-in pb-20 bg-gray-950 min-h-screen text-gray-100">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
        }
      `}</style>

      {/* Integrated Header - Compact */}
      <div className="max-w-7xl mx-auto px-4 pt-2 pb-2 relative z-20">
        <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-2 bg-gray-900/50 hover:bg-gray-800 rounded-xl transition-all text-gray-400 hover:text-white border border-white/10 shadow-lg backdrop-blur-sm group"
            >
              <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
                <h1 className="text-lg font-black text-white hidden md:block leading-none mb-1">ملفات المواد</h1>
                <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-gray-500">
                    <span onClick={onBack} className="hover:text-emerald-400 cursor-pointer transition-colors flex items-center gap-1">
                        <Home className="w-3 h-3" /> الرئيسية
                    </span>
                    <span className="text-gray-700">/</span>
                    <span className="text-emerald-500 flex items-center gap-1">
                        <FolderOpen className="w-3 h-3" />
                        المكتبة
                    </span>
                </div>
            </div>
        </div>
      </div>

      {/* Hero Section with Background Image */}
      <div className="relative pt-32 pb-48 px-4 overflow-hidden rounded-b-[3rem] shadow-2xl shadow-gray-900/50 mb-16 border-b border-white/5 -mt-16">
          
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 z-0">
              <img 
                src="https://lh3.googleusercontent.com/d/1gSDH-0a3cWa8m8APr5qXGkKxINXZcSid" 
                alt="Background" 
                className="w-full h-full object-cover object-center scale-105 opacity-50"
              />
              {/* Dark Overlay for Text Readability */}
              <div className="absolute inset-0 bg-emerald-900/80 mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/90"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
              <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-2xl mb-4 border border-white/20 shadow-inner ring-1 ring-white/30 animate-fade-in-up">
                  <FolderOpen className="w-8 h-8 text-white drop-shadow-md" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-2xl animate-fade-in-up delay-100">
                  ملفات المواد الدراسية
              </h2>
              <p className="text-white/95 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-lg mb-6 animate-fade-in-up delay-200">
                  مكتبة شاملة تحتوي على الدوسيات، الملخصات، وأوراق العمل بصيغة PDF.
              </p>
          </div>
      </div>

      {/* Selection Box */}
      <div className="max-w-3xl mx-auto px-4 -mt-32 relative z-20 animate-fade-in-up delay-300">
        <div className="bg-gray-900 rounded-[2rem] shadow-2xl border border-white/5 p-6 md:p-6 backdrop-blur-xl mb-6">
            
            <button 
                onClick={() => { setStudentLevel(null); setSelectedGrade(''); setSelectedSubject(''); }}
                className="text-xs font-bold text-gray-500 hover:text-white flex items-center gap-1 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700 transition-colors mb-4 w-fit"
            >
                <RotateCcw className="w-3 h-3" /> تغيير المرحلة
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Subject Selection */}
                <div className="group relative z-20">
                    <label className="block text-xs font-bold text-gray-300 mb-2 flex items-center gap-2 group-hover:text-emerald-400 transition-colors">
                        <div className="p-1.5 bg-emerald-900/20 rounded-lg group-hover:bg-emerald-900/40 transition-colors">
                            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        {studentLevel === 'university' ? 'المساق / المادة' : 'المادة الدراسية'}
                    </label>
                    
                    <CustomSelect 
                        options={subjectOptions}
                        value={selectedSubject}
                        onChange={setSelectedSubject}
                        placeholder="اختر المادة"
                    />
                </div>

                {/* Grade/Major Selection */}
                <div className="group relative z-10">
                    <label className="block text-xs font-bold text-gray-300 mb-2 flex items-center gap-2 group-hover:text-teal-400 transition-colors">
                        <div className="p-1.5 bg-teal-900/20 rounded-lg group-hover:bg-teal-900/40 transition-colors">
                            {studentLevel === 'university' ? <University className="w-3.5 h-3.5 text-teal-400" /> : <GraduationCap className="w-3.5 h-3.5 text-teal-400" />}
                        </div>
                        {studentLevel === 'university' ? 'التخصص' : 'الصف الدراسي'}
                    </label>
                    
                    <CustomSelect 
                        options={gradeOptions}
                        value={selectedGrade}
                        onChange={setSelectedGrade}
                        placeholder={studentLevel === 'university' ? "اختر التخصص" : "اختر الصف"}
                    />
                </div>
            </div>

            <button 
                onClick={handleNext}
                disabled={!selectedSubject || !selectedGrade}
                className={`w-full py-3.5 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                    !selectedSubject || !selectedGrade 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed shadow-none' 
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 hover:shadow-emerald-900/50 hover:-translate-y-1'
                }`}
            >
                <Search className="w-5 h-5" />
                استعراض الملفات
            </button>
        </div>
      </div>
    </div>
    );
  };

  const renderContent = () => (
      <div className="max-w-2xl mx-auto px-4 py-4 animate-fade-in-up min-h-screen">
          
          {/* Integrated Header */}
          <div className="max-w-7xl mx-auto px-4 pt-2 pb-2 relative z-20">
            <div className="flex items-center gap-3">
                <button 
                onClick={() => setView('SELECTION')}
                className="p-2 bg-gray-900/50 hover:bg-gray-800 rounded-xl transition-all text-gray-400 hover:text-white border border-white/10 shadow-lg backdrop-blur-sm group"
                >
                <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                    <h1 className="text-lg font-black text-white tracking-tight mb-0.5">ملفات {selectedSubject}</h1>
                    <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-gray-500">
                        <span onClick={() => setView('SELECTION')} className="hover:text-emerald-400 cursor-pointer transition-colors flex items-center gap-1">
                            <FolderOpen className="w-3 h-3" />
                            العودة للبحث
                        </span>
                        <span className="text-gray-700">/</span>
                        <span className="text-emerald-500 flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            المحتوى
                        </span>
                    </div>
                </div>
            </div>
          </div>

          {/* Header / Explanation Card */}
          <div className="text-center mb-8 bg-gray-900 p-6 rounded-3xl shadow-sm border border-white/5 relative overflow-hidden mt-4">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
              <div className="w-16 h-16 bg-emerald-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">
                  ملفات {selectedSubject}
              </h2>
              <p className="text-gray-400 font-medium text-sm md:text-base">
                  تصفح وحمل الدوسيات، أوراق العمل، والملخصات الخاصة بـ <span className="font-bold text-emerald-400">
                    {selectedGrade === 'English Major - QOU' ? 'جامعة القدس المفتوحة' : `الصف ${selectedGrade}`}
                  </span>
              </p>
          </div>

          {/* Loading State */}
          {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-emerald-400" />
                  <p className="text-gray-400 font-bold">جاري تحميل الملفات...</p>
              </div>
          ) : (
            /* Tree View */
            <div className="space-y-4">
               {currentFolders.map((folder) => {
                   const isOpen = expandedFolders.includes(folder.id);
                   return (
                       <div key={folder.id} className="bg-gray-900 rounded-2xl border border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                           <button 
                              onClick={() => toggleFolder(folder.id)}
                              className={`w-full flex items-center justify-between p-5 transition-colors ${isOpen ? 'bg-gray-700/30' : 'hover:bg-gray-700/30'}`}
                           >
                               <div className="flex items-center gap-4">
                                   <div className={`p-2.5 rounded-xl ${isOpen ? 'bg-emerald-900/30 text-emerald-400' : 'bg-gray-700 text-gray-400'}`}>
                                       <FolderOpen className="w-6 h-6" />
                                   </div>
                                   <div className="text-right">
                                      <span className="font-bold text-base text-white block">{folder.title}</span>
                                      <span className="text-xs text-gray-400 font-medium">{folder.files.length} ملفات</span>
                                   </div>
                               </div>
                               <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                   <ChevronDown className="w-5 h-5 text-gray-400" />
                               </div>
                           </button>
  
                           {isOpen && (
                               <div className="bg-gray-900 border-t border-gray-700">
                                   {folder.files.length === 0 ? (
                                      <div className="p-8 text-center flex flex-col items-center justify-center text-gray-400">
                                          <FolderOpen className="w-10 h-10 mb-2 opacity-20" />
                                          <p className="text-sm font-medium">لا توجد ملفات مضافة في هذا القسم حالياً</p>
                                      </div>
                                   ) : (
                                      <div className="divide-y divide-gray-700/50">
                                          {folder.files.map((file, idx) => (
                                              <div 
                                                  key={idx} 
                                                  onClick={() => file.url && window.open(file.url, '_blank')}
                                                  className="flex items-center justify-between p-4 hover:bg-emerald-900/10 transition-colors group cursor-pointer"
                                              >
                                                  <div className="flex items-center gap-4 min-w-0 flex-1">
                                                      <div className="w-10 h-10 rounded-lg bg-red-900/20 flex items-center justify-center shrink-0 text-red-500">
                                                          <FileText className="w-5 h-5" />
                                                      </div>
                                                      <div className="flex flex-col min-w-0 flex-1">
                                                          <span className="text-sm font-bold text-gray-200 group-hover:text-emerald-300 transition-colors whitespace-normal break-words">{file.title}</span>
                                                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                              <span>{formatDate(file.createdAt)}</span>
                                                              <span>•</span>
                                                              <span>{file.size || 'PDF'}</span>
                                                          </div>
                                                      </div>
                                                  </div>
                                                  <div className="p-2 text-gray-500 group-hover:text-emerald-400 transition-colors">
                                                      <Download className="w-5 h-5" />
                                                  </div>
                                              </div>
                                          ))}
                                      </div>
                                   )}
                               </div>
                           )}
                       </div>
                   );
               })}
            </div>
          )}
      </div>
  );

  return (
    <>
        {view === 'SELECTION' ? renderSelection() : renderContent()}
    </>
  );
};

export default EducationalLessons;
