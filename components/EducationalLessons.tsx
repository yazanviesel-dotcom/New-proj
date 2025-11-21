
import React, { useState } from 'react';
import { BookOpen, GraduationCap, ArrowRight, Video, FileText, File, Layout, ChevronLeft, Search, MonitorPlay, Library } from 'lucide-react';

interface EducationalLessonsProps {
  onBack: () => void;
}

const EducationalLessons: React.FC<EducationalLessonsProps> = ({ onBack }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [view, setView] = useState<'SELECTION' | 'CONTENT'>('SELECTION');
  const [activeTab, setActiveTab] = useState<'VIDEO' | 'SUMMARY' | 'PDF'>('VIDEO');

  const handleNext = () => {
    if (selectedSubject && selectedGrade) {
      setView('CONTENT');
    } else {
      // Input validation handled by disabled button state
    }
  };

  const renderSelection = () => (
    <div className="w-full animate-fade-in pb-12">
      {/* Hero Section for Lessons */}
      <div className="relative bg-blue-600 py-20 px-4 overflow-hidden rounded-b-[3rem] shadow-xl shadow-blue-200 mb-12">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-x-10 -translate-y-10 blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-400 opacity-20 rounded-full translate-x-10 translate-y-10 blur-3xl"></div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
              <div className="inline-flex items-center justify-center p-3 bg-blue-500/30 backdrop-blur-md rounded-2xl mb-6 border border-blue-400/30">
                  <MonitorPlay className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                  مكتبة الدروس التعليمية
              </h2>
              <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                  بوابتك نحو التفوق.. اختر مادتك الدراسية واستمتع بشرح مبسط وشامل لجميع الوحدات
              </p>
          </div>
      </div>

      {/* Selection Cards */}
      <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-20 mb-16">
        <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {/* Subject Selection */}
                <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        المادة الدراسية
                    </label>
                    <div className="relative">
                        <select 
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent hover:border-blue-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg font-bold text-gray-800 appearance-none cursor-pointer"
                        >
                            <option value="" className="text-gray-400">اختر المادة</option>
                            <option value="English" className="text-gray-800">اللغة الإنجليزية (English)</option>
                            {/* Add more subjects here */}
                        </select>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <ChevronLeft className="w-5 h-5 -rotate-90" />
                        </div>
                    </div>
                </div>

                {/* Grade Selection */}
                <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <GraduationCap className="w-5 h-5 text-blue-600" />
                        </div>
                        الصف الدراسي
                    </label>
                    <div className="relative">
                        <select 
                            value={selectedGrade}
                            onChange={(e) => setSelectedGrade(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent hover:border-blue-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg font-bold text-gray-800 appearance-none cursor-pointer"
                        >
                            <option value="" className="text-gray-400">اختر الصف</option>
                            {[5, 6, 7, 8, 9, 10, 11, 12].map(g => (
                                <option key={g} value={g} className="text-gray-800">الصف {g}</option>
                            ))}
                        </select>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <ChevronLeft className="w-5 h-5 -rotate-90" />
                        </div>
                    </div>
                </div>
            </div>

            <button 
                onClick={handleNext}
                disabled={!selectedSubject || !selectedGrade}
                className={`w-full py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all shadow-lg ${
                    !selectedSubject || !selectedGrade 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-300 hover:-translate-y-1'
                }`}
            >
                <Search className="w-6 h-6" />
                عرض المحتوى التعليمي
            </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in-up">
          {/* Breadcrumb & Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
             <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2 font-medium">
                    <span className="cursor-pointer hover:text-blue-600" onClick={() => setView('SELECTION')}>الدروس</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-blue-600">{selectedSubject}</span>
                </div>
                <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                    {selectedSubject} 
                    <span className="text-lg font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
                        الصف {selectedGrade}
                    </span>
                </h2>
             </div>
             
             <button 
                onClick={() => setView('SELECTION')} 
                className="bg-white border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 w-fit shadow-sm"
             >
                 <ArrowRight className="w-4 h-4" />
                 تغيير المادة
             </button>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/50 border border-white overflow-hidden min-h-[600px] flex flex-col">
              
              {/* Stylish Tabs */}
              <div className="flex border-b border-gray-100 p-2 bg-gray-50/50 gap-2">
                  <button 
                    onClick={() => setActiveTab('VIDEO')}
                    className={`flex-1 py-3 rounded-xl font-bold text-center flex items-center justify-center gap-2 transition-all duration-300 ${
                        activeTab === 'VIDEO' 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                        : 'text-gray-500 hover:bg-white hover:text-blue-600'
                    }`}
                  >
                      <Video className="w-5 h-5" />
                      دروس فيديو
                  </button>
                  <button 
                    onClick={() => setActiveTab('SUMMARY')}
                    className={`flex-1 py-3 rounded-xl font-bold text-center flex items-center justify-center gap-2 transition-all duration-300 ${
                        activeTab === 'SUMMARY' 
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                        : 'text-gray-500 hover:bg-white hover:text-indigo-600'
                    }`}
                  >
                      <FileText className="w-5 h-5" />
                      ملخصات
                  </button>
                  <button 
                    onClick={() => setActiveTab('PDF')}
                    className={`flex-1 py-3 rounded-xl font-bold text-center flex items-center justify-center gap-2 transition-all duration-300 ${
                        activeTab === 'PDF' 
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-200' 
                        : 'text-gray-500 hover:bg-white hover:text-sky-600'
                    }`}
                  >
                      <File className="w-5 h-5" />
                      ملفات PDF
                  </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-8 md:p-16 bg-gradient-to-b from-white to-gray-50 flex flex-col items-center justify-center text-center animate-fade-in">
                  <div className="w-32 h-32 mb-6 relative">
                      <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
                      <div className="relative w-full h-full bg-white rounded-full shadow-lg border-4 border-blue-50 flex items-center justify-center">
                          {activeTab === 'VIDEO' && <Video className="w-14 h-14 text-blue-500" />}
                          {activeTab === 'SUMMARY' && <Layout className="w-14 h-14 text-indigo-500" />}
                          {activeTab === 'PDF' && <Library className="w-14 h-14 text-sky-500" />}
                      </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-gray-900 mb-3">لا يوجد محتوى مضاف حالياً</h3>
                  <p className="text-gray-500 max-w-md text-lg leading-relaxed">
                      نعمل حالياً على إعداد ورفع {activeTab === 'VIDEO' ? 'شروحات الفيديو' : activeTab === 'SUMMARY' ? 'الملخصات الدراسية' : 'ملفات ومراجع PDF'} لهذا القسم. يرجى التحقق مرة أخرى قريباً!
                  </p>
              </div>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
       {/* Top Nav for this page */}
       <div className="bg-white/80 backdrop-blur-md border-b border-blue-100 py-4 px-4 sticky top-0 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
             <button 
                onClick={onBack} 
                className="p-2 hover:bg-blue-50 rounded-full transition-colors group"
             >
                <ArrowRight className="w-6 h-6 text-gray-500 group-hover:text-blue-600 transition-colors" />
             </button>
             <span className="font-bold text-gray-800 text-lg">العودة للرئيسية</span>
          </div>
       </div>

       {view === 'SELECTION' ? renderSelection() : renderContent()}
    </div>
  );
};

export default EducationalLessons;