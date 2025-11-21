
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, BookOpen, Calendar, Save, Loader2, CheckCircle, Phone, MapPin, Building2, TrendingUp, FileCheck, XCircle, AlertCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Simple SVG Line Chart Component
const ProgressChart = ({ data }: { data: number[] }) => {
  if (!data || data.length === 0) return (
    <div className="h-40 flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed">
      لا توجد بيانات كافية للرسم البياني
    </div>
  );

  const height = 100;
  const width = 300;
  const maxData = 100; // Max percentage

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1 || 1)) * width;
    const y = height - (val / maxData) * height;
    return `${x},${y}`;
  }).join(' ');

  // Gradient Fill Path
  const fillPath = `${points} ${width},${height} 0,${height}`;

  return (
    <div className="w-full h-48 bg-white rounded-xl p-4 border border-gray-100 relative overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
        {/* Grid Lines */}
        <line x1="0" y1="0" x2={width} y2="0" stroke="#e5e7eb" strokeWidth="0.5" />
        <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="#e5e7eb" strokeWidth="0.5" />
        <line x1="0" y1={height} x2={width} y2={height} stroke="#e5e7eb" strokeWidth="0.5" />

        {/* Fill Gradient */}
        <defs>
          <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(16, 185, 129, 0.2)" />
            <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
          </linearGradient>
        </defs>
        <path d={`M0,${height} ${fillPath}`} fill="url(#chartGradient)" />

        {/* Line */}
        <polyline points={points} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Points */}
        {data.map((val, idx) => {
           const x = (idx / (data.length - 1 || 1)) * width;
           const y = height - (val / maxData) * height;
           return (
             <circle key={idx} cx={x} cy={y} r="3" fill="white" stroke="#10b981" strokeWidth="2" />
           );
        })}
      </svg>
      <div className="absolute top-2 right-2 text-xs font-bold text-gray-400">مستوى التقدم</div>
    </div>
  );
};

interface QuizResult {
  id: string;
  quizTitle: string;
  subject: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  createdAt: any;
}

const StudentProfile: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Progress Data
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    age: user?.age || '',
    grade: user?.grade || '',
    phone: user?.phone || '',
    address: user?.address || '',
    school: user?.school || ''
  });

  // Fetch Quiz Results
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      try {
        // Removed orderBy from query to prevent "Missing Index" error in Firestore
        const q = query(
          collection(db, "quiz_results"),
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const history: QuizResult[] = [];
        snapshot.forEach(doc => {
          history.push({ id: doc.id, ...doc.data() } as QuizResult);
        });

        // Sort client-side instead
        history.sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeA - timeB;
        });

        setQuizHistory(history);
      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchProgress();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg(null);

    try {
      await updateUserProfile(formData);
      setSuccessMsg("تم تحديث البيانات بنجاح!");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء التحديث");
    } finally {
      setIsLoading(false);
    }
  };

  // Chart Data (Last 10 scores)
  const chartData = quizHistory.map(q => q.percentage);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Edit Profile */}
        <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 h-32 relative">
                    <div className="absolute -bottom-12 right-8">
                        <div className="w-24 h-24 bg-white p-1 rounded-full shadow-lg">
                            <div className="w-full h-full bg-emerald-100 rounded-full flex items-center justify-center">
                                <User className="w-10 h-10 text-emerald-600" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-8 px-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">{user?.displayName}</h2>
                        <p className="text-gray-500">{user?.email}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Info Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2">المعلومات الشخصية</h3>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الأول</label>
                                        <input 
                                            type="text" 
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-white text-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">اسم العائلة</label>
                                        <input 
                                            type="text" 
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-white text-black"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-emerald-600" />
                                        العمر
                                    </label>
                                    <input 
                                        type="number" 
                                        value={formData.age}
                                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-white text-black"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-emerald-600" />
                                        رقم الجوال
                                    </label>
                                    <input 
                                        type="tel" 
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        placeholder="05xxxxxxxx"
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-white text-black"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-emerald-600" />
                                        مكان السكن
                                    </label>
                                    <input 
                                        type="text" 
                                        value={formData.address}
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                        placeholder="المدينة / المنطقة"
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-white text-black"
                                    />
                                </div>
                            </div>

                            {/* Academic Info Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2">المعلومات الأكاديمية</h3>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-emerald-600" />
                                        الصف الدراسي
                                    </label>
                                    <select 
                                        value={formData.grade}
                                        onChange={(e) => setFormData({...formData, grade: e.target.value})}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-white text-black"
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

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-emerald-600" />
                                        المدرسة الحالية
                                    </label>
                                    <input 
                                        type="text" 
                                        value={formData.school}
                                        onChange={(e) => setFormData({...formData, school: e.target.value})}
                                        placeholder="اسم مدرستك"
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-white text-black"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end pt-6 border-t border-gray-50 gap-4">
                            {successMsg && (
                                <div className="flex items-center gap-2 text-green-600 font-medium animate-fade-in">
                                    <CheckCircle className="w-5 h-5" />
                                    {successMsg}
                                </div>
                            )}
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center gap-2"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> حفظ التغييرات</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        {/* Right Column: Progress System */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* Chart Card */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                   <TrendingUp className="w-5 h-5 text-emerald-600" />
                   تقدمي الأكاديمي
                </h3>
                {statsLoading ? (
                    <div className="h-48 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                    </div>
                ) : (
                    <div className="space-y-4">
                       <ProgressChart data={chartData} />
                       <div className="text-center text-sm text-gray-500">
                           مخطط يوضح تطور درجاتك في الاختبارات الأخيرة
                       </div>
                       <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                           <span className="text-gray-600 text-sm">متوسط الدرجات</span>
                           <span className="font-bold text-emerald-600 text-lg">
                             {chartData.length > 0 ? Math.round(chartData.reduce((a,b)=>a+b,0)/chartData.length) : 0}%
                           </span>
                       </div>
                    </div>
                )}
            </div>

            {/* History List */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 max-h-[500px] overflow-y-auto">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 sticky top-0 bg-white pb-2 border-b">
                   <FileCheck className="w-5 h-5 text-blue-600" />
                   سجل الاختبارات
                </h3>
                
                {statsLoading ? (
                     <div className="flex justify-center py-8">
                         <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                     </div>
                ) : quizHistory.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 flex flex-col items-center gap-2">
                        <AlertCircle className="w-8 h-8 opacity-50" />
                        <p>لم تقم بحل أي اختبارات بعد</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {/* Reverse to show newest first */}
                        {[...quizHistory].reverse().map((quiz) => (
                            <div key={quiz.id} className="p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-gray-800 text-sm line-clamp-1">{quiz.quizTitle}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${quiz.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {quiz.passed ? 'ناجح' : 'راسب'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span>{quiz.subject}</span>
                                    <span className="font-bold text-gray-900 text-sm">{quiz.percentage}%</span>
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

export default StudentProfile;
    