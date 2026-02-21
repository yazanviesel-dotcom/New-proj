
import React, { useState, useEffect } from 'react';
import { Search, Loader2, CheckCircle2, UserCheck, Ban, Users, ArrowRight, CreditCard, Trash2, X, Clock, Timer, AlertTriangle, ShieldCheck, Home, University, Backpack } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, getDoc, limit, setDoc, deleteDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

interface SubscriptionManagementProps {
  onBack: () => void;
}

// Separate cache key for the new collection strategy
const ACTIVE_SUBS_COLLECTION_CACHE = 'etqan_active_subs_v3_strict';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 Hours Cache

// --- Helper Component: Real-time Countdown Timer ---
const SubscriptionCountdown = ({ expiryDate }: { expiryDate: any }) => {
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const calculateTime = () => {
            let targetTime = 0;
            
            if (!expiryDate) return 0;
            
            if (expiryDate.seconds) {
                targetTime = expiryDate.seconds * 1000;
            } else if (expiryDate instanceof Date) {
                targetTime = expiryDate.getTime();
            } else if (typeof expiryDate === 'number') {
                targetTime = expiryDate;
            } else {
                targetTime = new Date(expiryDate).getTime();
            }

            const now = Date.now();
            const diff = targetTime - now;

            if (diff <= 0) {
                setIsExpired(true);
                return 0;
            }

            return diff;
        };

        const updateTimer = () => {
            const diff = calculateTime();
            if (diff <= 0) {
                setTimeLeft("منتهي");
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            if (days > 0) {
                setTimeLeft(`${days} يوم و ${hours} ساعة`);
            } else {
                setTimeLeft(`${hours}:${minutes.toString().padStart(2, '0')}`);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 60000); 

        return () => clearInterval(interval);
    }, [expiryDate]);

    return (
        <span className={`font-mono font-bold text-[10px] ${isExpired ? 'text-red-400' : 'text-emerald-400'}`}>
            {timeLeft}
        </span>
    );
};

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeSubscribers, setActiveSubscribers] = useState<any[]>([]);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [processingStudentId, setProcessingStudentId] = useState<string | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
      isOpen: boolean;
      studentId: string;
      studentName: string;
      isCurrentlyActive: boolean;
      studentData: any;
  } | null>(null);

  // --- 1. Fetch Active Subscribers ---
  useEffect(() => {
      const loadActiveSubscribers = async () => {
          const cached = localStorage.getItem(ACTIVE_SUBS_COLLECTION_CACHE);
          const now = Date.now();
          if (cached) {
              try {
                  const { data, timestamp } = JSON.parse(cached);
                  if (now - timestamp < CACHE_TTL) {
                      setActiveSubscribers(data);
                  }
              } catch (e) { console.error(e); }
          }

          try {
              const q = query(collection(db, "subscriptions"), orderBy("expiryDate", "desc"));
              const snapshot = await getDocs(q);
              
              const activeSubs: any[] = [];
              snapshot.forEach(doc => {
                  const data = doc.data();
                  activeSubs.push({ 
                      id: doc.id, 
                      ...data,
                      // CRITICAL: Sanitize for cache
                      expiryDate: data.expiryDate ? { seconds: data.expiryDate.seconds } : null,
                      startDate: data.startDate ? { seconds: data.startDate.seconds } : null
                  });
              });

              setActiveSubscribers(activeSubs);
              localStorage.setItem(ACTIVE_SUBS_COLLECTION_CACHE, JSON.stringify({
                  data: activeSubs,
                  timestamp: now
              }));
          } catch (e) { console.error(e); }
      };

      loadActiveSubscribers();
  }, []);

  // --- 2. Search Users ---
  const handleSearch = async () => {
      if (!studentSearchTerm.trim()) return;
      setIsSearching(true);
      setSearchResults([]); 

      const term = studentSearchTerm.trim();
      let foundStudents: any[] = [];

      try {
          // A. Try Direct ID Fetch
          const docRef = doc(db, "users", term);
          try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                foundStudents.push({ 
                    id: docSnap.id, 
                    ...data,
                    // Sanitize all timestamps to prevent circular JSON
                    subscriptionExpiry: data.subscriptionExpiry ? { seconds: data.subscriptionExpiry.seconds } : null,
                    createdAt: data.createdAt ? { seconds: data.createdAt.seconds } : null,
                    lastQuizDate: data.lastQuizDate ? { seconds: data.lastQuizDate.seconds } : null
                });
            }
          } catch(e) { /* ignore */ }

          // B. Email or Name Search
          if (foundStudents.length === 0) {
              const queries = [
                  query(collection(db, "users"), where("email", "==", term)),
                  query(collection(db, "users"), where("displayName", ">=", term), where("displayName", "<=", term + "\uf8ff"), limit(5))
              ];

              const snapshots = await Promise.all(queries.map(q => getDocs(q)));

              snapshots.forEach(snap => {
                  snap.forEach(doc => {
                      const data = doc.data();
                      if (!foundStudents.find(s => s.id === doc.id)) {
                          foundStudents.push({ 
                              id: doc.id, 
                              ...data,
                              // Sanitize all timestamps
                              subscriptionExpiry: data.subscriptionExpiry ? { seconds: data.subscriptionExpiry.seconds } : null,
                              createdAt: data.createdAt ? { seconds: data.createdAt.seconds } : null,
                              lastQuizDate: data.lastQuizDate ? { seconds: data.lastQuizDate.seconds } : null
                          });
                      }
                  });
              });
          }
          setSearchResults(foundStudents);
      } catch (e) { console.error(e); } finally { setIsSearching(false); }
  };

  // --- 3. Toggle Logic ---
  const requestToggleSubscription = (studentId: string, currentStatus: boolean, studentName: string, studentData: any) => {
      setConfirmModal({
          isOpen: true,
          studentId,
          isCurrentlyActive: currentStatus,
          studentName,
          studentData
      });
  };

  const executeSubscriptionToggle = async () => {
      if (!confirmModal) return;
      const { studentId, isCurrentlyActive, studentName, studentData } = confirmModal;
      
      setConfirmModal(null);
      setProcessingStudentId(studentId);

      try {
          const userRef = doc(db, "users", studentId);
          const subscriptionRef = doc(db, "subscriptions", studentId); 
          const isActivating = !isCurrentlyActive;
          
          const SUBSCRIPTION_DAYS = 30;
          const expiryDate = isActivating ? new Date(Date.now() + SUBSCRIPTION_DAYS * 24 * 60 * 60 * 1000) : null; 
          const firestoreExpiry = expiryDate ? { seconds: Math.floor(expiryDate.getTime() / 1000) } : null;

          if (isActivating) {
              const subData = {
                  studentId: studentId,
                  displayName: studentData.displayName || studentName,
                  email: studentData.email || '',
                  avatar: studentData.avatar || '',
                  grade: studentData.grade || '',
                  isActive: true,
                  startDate: serverTimestamp(),
                  expiryDate: expiryDate 
              };
              await setDoc(subscriptionRef, subData);
              await updateDoc(userRef, { isSubscriber: true, subscriptionExpiry: expiryDate });

              const sanitizedSub = { ...subData, id: studentId, expiryDate: firestoreExpiry, startDate: { seconds: Math.floor(Date.now()/1000) } };
              setActiveSubscribers(prev => [sanitizedSub, ...prev.filter(s => s.id !== studentId)]);

          } else {
              await deleteDoc(subscriptionRef);
              await updateDoc(userRef, { isSubscriber: false, subscriptionExpiry: null });
              setActiveSubscribers(prev => prev.filter(s => s.id !== studentId));
          }

          // Update Search results view
          setSearchResults(prev => prev.map(s => {
              if (s.id === studentId) {
                  return { ...s, isSubscriber: isActivating, subscriptionExpiry: firestoreExpiry };
              }
              return s;
          }));

          // Re-cache active list safely
          localStorage.setItem(ACTIVE_SUBS_COLLECTION_CACHE, JSON.stringify({
              data: activeSubscribers.filter(s => s.id !== studentId).concat(isActivating ? [{...studentData, id: studentId, expiryDate: firestoreExpiry}] : []),
              timestamp: Date.now()
          }));

      } catch (e) {
          console.error(e);
          alert("حدث خطأ أثناء التحديث");
      } finally {
          setProcessingStudentId(null);
      }
  };

  const clearSearchResults = () => {
      setSearchResults([]);
      setStudentSearchTerm('');
  };

  const formatDate = (expiryObj: any) => {
      if (!expiryObj) return '-';
      let date: Date;
      if (expiryObj.seconds) date = new Date(expiryObj.seconds * 1000);
      else date = new Date(expiryObj);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const isUniversityStudent = (grade: string | undefined) => {
      return grade === 'English Major - QOU' || (grade && grade.includes('University'));
  };

  return (
    <div className="min-h-screen bg-gray-950 animate-fade-in transition-colors duration-300 text-gray-100">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 pt-2 pb-2 relative z-30">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 bg-gray-900/50 hover:bg-gray-800 rounded-xl transition-all text-gray-400 hover:text-white border border-gray-800 shadow-lg group backdrop-blur-sm">
              <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
                <h1 className="text-lg font-black text-white tracking-tight mb-0.5">إدارة الاشتراكات</h1>
                <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-medium text-gray-500">
                    <span onClick={onBack} className="hover:text-emerald-400 cursor-pointer transition-colors flex items-center gap-1">
                       <Home className="w-3 h-3" /> الرئيسية
                    </span>
                    <span className="text-gray-700">/</span>
                    <span className="text-emerald-500 flex items-center gap-1">
                        <CreditCard className="w-3 h-3" /> التحكم في الوصول
                    </span>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4 space-y-8">
         <div className="bg-gray-900 rounded-[2.5rem] shadow-xl border border-gray-700 p-6 md:p-8 animate-fade-in-up">
             <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 border-b border-gray-700 pb-6">
                 <div>
                     <h2 className="text-2xl font-black text-white flex items-center gap-2 mb-2">
                         <CreditCard className="w-8 h-8 text-amber-500" /> البحث عن طالب
                     </h2>
                     <p className="text-gray-400 text-sm">ابحث عن طالب لتفعيل اشتراكه أو التحقق من حالته</p>
                 </div>
                 
                 <div className="flex gap-2 w-full md:w-auto">
                     <div className="relative w-full md:w-80">
                         <input 
                             type="text" 
                             placeholder="بحث بالاسم، الإيميل أو ID..." 
                             value={studentSearchTerm}
                             onChange={(e) => setStudentSearchTerm(e.target.value)}
                             onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                             className="w-full px-5 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-amber-500 outline-none text-white font-bold transition-all text-sm pr-10"
                         />
                         {studentSearchTerm && <button onClick={clearSearchResults} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>}
                     </div>
                     <button onClick={handleSearch} disabled={isSearching} className="bg-amber-600 hover:bg-amber-700 text-white px-4 rounded-xl flex items-center justify-center transition-colors shadow-lg disabled:opacity-50">
                        {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                     </button>
                 </div>
             </div>

             <div className="overflow-x-auto min-h-[100px]">
                 {searchResults.length === 0 ? (
                     <div className="flex flex-col items-center justify-center h-32 text-gray-500 bg-gray-800/20 rounded-3xl border border-dashed border-gray-800">
                         <Search className="w-10 h-10 mb-3 opacity-20" />
                         <p className="font-bold text-sm">القائمة فارغة. ابحث لإظهار النتائج.</p>
                     </div>
                 ) : (
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="border-b border-gray-700 text-gray-400 text-[10px] uppercase tracking-wider font-bold">
                                <th className="pb-3 pr-4">المستخدم</th>
                                <th className="pb-3">نوع الحساب</th>
                                <th className="pb-3">المعرف (ID)</th>
                                <th className="pb-3">الحالة الحالية</th>
                                <th className="pb-3 pl-4 text-left">الإجراء</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {searchResults.map(student => (
                                <tr key={student.id} className="group hover:bg-gray-800/50 transition-colors">
                                    <td className="py-3 pr-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-600 shrink-0">
                                                {student.avatar ? <img src={student.avatar} className="w-full h-full object-cover" alt="avatar"/> : <Users className="w-4 h-4 text-gray-400"/>}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-xs">{student.displayName}</div>
                                                <div className="text-[10px] text-gray-500">{student.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        {isUniversityStudent(student.grade) ? (
                                            <span className="inline-flex items-center gap-1 bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded-full text-[10px] font-bold border border-blue-500/20">
                                                <University className="w-3 h-3" /> جامعي
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 bg-emerald-900/30 text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-500/20">
                                                <Backpack className="w-3 h-3" /> مدرسي
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 font-mono text-[10px] text-amber-200/70 select-all">{student.id}</td>
                                    <td className="py-3">
                                        {student.isSubscriber ? (
                                            <span className="inline-flex items-center gap-1 bg-green-900/30 text-green-400 px-2 py-0.5 rounded-full text-[10px] font-bold border border-green-500/20">
                                                <CheckCircle2 className="w-3 h-3" /> مشترك
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 bg-gray-700/50 text-gray-400 px-2 py-0.5 rounded-full text-[10px] font-bold border border-gray-600">غير مشترك</span>
                                        )}
                                    </td>
                                    <td className="py-3 pl-4 text-left">
                                        <button onClick={() => requestToggleSubscription(student.id, student.isSubscriber, student.displayName, student)} disabled={processingStudentId === student.id} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ml-auto w-28 ${processingStudentId === student.id ? 'bg-gray-700 cursor-not-allowed text-gray-400' : student.isSubscriber ? 'bg-red-900/20 text-red-400 hover:bg-red-900/40 border border-red-900/30' : 'bg-amber-600 text-white hover:bg-amber-700 shadow-md'}`}>
                                            {processingStudentId === student.id ? <Loader2 className="w-3 h-3 animate-spin" /> : student.isSubscriber ? <><Ban className="w-3 h-3" /> إلغاء التفعيل</> : <><UserCheck className="w-3 h-3" /> تفعيل 30 يوم</>}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 )}
             </div>
         </div>

         <div className="bg-gray-900 rounded-[2.5rem] shadow-xl border border-emerald-500/20 p-6 md:p-8 animate-fade-in-up">
             <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                 <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20"><ShieldCheck className="w-6 h-6 text-emerald-500" /></div>
                 <div>
                     <h3 className="text-xl font-black text-white">قاعدة بيانات المشتركين</h3>
                     <p className="text-xs text-gray-400">قائمة حية من جدول الاشتراكات - العدد: {activeSubscribers.length}</p>
                 </div>
             </div>

             {activeSubscribers.length === 0 ? (
                 <div className="text-center py-10 text-gray-500">
                     <Ban className="w-12 h-12 mx-auto mb-3 opacity-20" />
                     <p>لا يوجد مشتركون حالياً</p>
                 </div>
             ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {activeSubscribers.map(student => (
                         <div key={student.id} className="bg-gray-800/50 rounded-2xl p-4 border border-emerald-500/10 hover:border-emerald-500/30 transition-all flex items-center justify-between group">
                             <div className="flex items-center gap-3 overflow-hidden">
                                 <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-600 shrink-0">
                                     {student.avatar ? <img src={student.avatar} className="w-full h-full object-cover" alt="avatar"/> : <Users className="w-4 h-4 text-gray-400"/>}
                                 </div>
                                 <div className="min-w-0">
                                     <h4 className="font-bold text-white text-xs truncate flex items-center gap-1">
                                         {student.displayName}
                                         {isUniversityStudent(student.grade) && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" title="طالب جامعي"></div>}
                                     </h4>
                                     <div className="flex items-center gap-1 text-[9px] text-gray-400 font-mono mt-0.5">
                                         <Clock className="w-2.5 h-2.5 text-emerald-500" /> ينتهي: {formatDate(student.expiryDate || student.subscriptionExpiry)}
                                     </div>
                                     <div className="flex items-center gap-1 text-[9px] mt-0.5 bg-gray-900/50 w-fit px-1.5 py-0.5 rounded border border-gray-700">
                                         <Timer className="w-2.5 h-2.5 text-emerald-400" /> <SubscriptionCountdown expiryDate={student.expiryDate || student.subscriptionExpiry} />
                                     </div>
                                 </div>
                             </div>
                             <button onClick={() => requestToggleSubscription(student.id, true, student.displayName, student)} disabled={processingStudentId === student.id} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg transition-colors disabled:opacity-50">
                                 {processingStudentId === student.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                             </button>
                         </div>
                     ))}
                 </div>
             )}
         </div>
      </div>

      {confirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-gray-900 rounded-[2.5rem] p-8 max-sm w-full border border-gray-700 shadow-2xl relative text-center animate-fade-in-up">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-gray-800 ${confirmModal.isCurrentlyActive ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                    {confirmModal.isCurrentlyActive ? <Ban className="w-10 h-10" /> : <UserCheck className="w-10 h-10" />}
                </div>
                <h3 className="text-2xl font-black text-white mb-3">{confirmModal.isCurrentlyActive ? 'إلغاء الاشتراك' : 'تفعيل الاشتراك'}</h3>
                <p className="text-gray-400 mb-8 text-base font-medium leading-relaxed">
                    {confirmModal.isCurrentlyActive 
                        ? <>هل أنت متأكد من إلغاء اشتراك الطالب <span className="text-white font-bold">{confirmModal.studentName}</span>؟</>
                        : <>هل تريد تفعيل اشتراك الطالب <span className="text-white font-bold">{confirmModal.studentName}</span> لمدة 30 يوم؟</>
                    }
                </p>
                <div className="flex gap-4 justify-center">
                    <button onClick={executeSubscriptionToggle} className={`flex-1 py-3.5 rounded-xl font-bold text-white transition-all shadow-lg transform hover:scale-105 active:scale-95 ${confirmModal.isCurrentlyActive ? 'bg-gradient-to-r from-red-600 to-pink-600' : 'bg-gradient-to-r from-emerald-600 to-teal-600'}`}>
                        {confirmModal.isCurrentlyActive ? 'نعم، إلغاء' : 'نعم، تفعيل'}
                    </button>
                    <button onClick={() => setConfirmModal(null)} className="flex-1 bg-gray-800 text-gray-300 py-3.5 rounded-xl font-bold hover:bg-gray-700 border border-gray-700">تراجع</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default SubscriptionManagement;
