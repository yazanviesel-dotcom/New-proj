
import React, { useState, useEffect } from 'react';
import { ArrowRight, Send, Users, Mail, Search, CheckCircle2, Loader2, User, Trash2, RefreshCw, Clock, Home } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, where, updateDoc, doc, deleteDoc, orderBy, limit } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { ContactMessage, AppView } from '../types';

interface TeacherCorrespondenceProps {
  onBack?: () => void;
  onNavigate: (view: AppView) => void;
}

const TeacherCorrespondence: React.FC<TeacherCorrespondenceProps> = ({ onBack, onNavigate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'COMPOSE' | 'INBOX'>('INBOX');
  
  // Compose State
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [messageTitle, setMessageTitle] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');

  // Inbox State
  const [inboxMessages, setInboxMessages] = useState<ContactMessage[]>([]);
  const [loadingInbox, setLoadingInbox] = useState(false);

  useEffect(() => {
      if (activeTab === 'COMPOSE') {
          fetchStudents();
      } else {
          fetchInbox();
      }
  }, [activeTab, user]);

  const fetchStudents = async () => {
      setLoadingStudents(true);
      try {
          const q = query(collection(db, "users"), where("role", "==", "student"));
          const snapshot = await getDocs(q);
          const list = snapshot.docs.map(docSnap => {
              const d = docSnap.data();
              return { 
                  id: docSnap.id, 
                  displayName: String(d.displayName || ''),
                  email: String(d.email || ''),
                  avatar: String(d.avatar || '')
              };
          });
          setStudents(list);
      } catch (e) {
          console.error("Error fetching students", e);
      } finally {
          setLoadingStudents(false);
      }
  };

  const fetchInbox = async (forceRefresh = false) => {
      if (!user) return;
      
      const CACHE_KEY = `etqan_inbox_${user.uid}`;
      const CACHE_TTL = 365 * 24 * 60 * 60 * 1000; 
      const now = Date.now();

      if (!forceRefresh) {
          const cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
              try {
                  const { data, timestamp } = JSON.parse(cached);
                  if (now - timestamp < CACHE_TTL) {
                      setInboxMessages(data);
                      return;
                  }
              } catch (e) { console.error(e); }
          }
      }

      setLoadingInbox(true);
      try {
          const q = query(
              collection(db, "contact_messages"), 
              where("teacherId", "==", user.uid)
          );
          const snapshot = await getDocs(q);
          const list = snapshot.docs.map(docSnap => {
              const d = docSnap.data();
              // STRICT POJO Mapping
              return { 
                id: docSnap.id, 
                studentId: String(d.studentId || ''),
                studentName: String(d.studentName || ''),
                studentEmail: String(d.studentEmail || ''),
                teacherId: String(d.teacherId || ''),
                teacherName: String(d.teacherName || ''),
                message: String(d.message || ''),
                read: Boolean(d.read),
                createdAt: d.createdAt ? { seconds: d.createdAt.seconds } : null
              } as ContactMessage;
          });
          
          list.sort((a, b) => {
              const tA = a.createdAt?.seconds || 0;
              const tB = b.createdAt?.seconds || 0;
              return tB - tA;
          });
          
          setInboxMessages(list);
          localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: now, data: list }));
      } catch (e) {
          console.error("Error fetching inbox", e);
      } finally {
          setLoadingInbox(false);
      }
  };

  const handleSendMessage = async () => {
      if (!messageTitle || !messageBody) {
          alert("الرجاء تعبئة العنوان ونص الرسالة");
          return;
      }
      if (!selectedStudentId) {
          alert("الرجاء اختيار المستقبل");
          return;
      }

      setIsSending(true);
      try {
          await addDoc(collection(db, "notifications"), {
              recipientId: selectedStudentId,
              title: messageTitle,
              message: messageBody,
              type: 'message',
              senderName: user?.displayName || 'المعلم',
              senderId: user?.uid,
              createdAt: serverTimestamp(),
              read: false
          });
          
          alert("تم إرسال الرسالة بنجاح!");
          setMessageTitle('');
          setMessageBody('');
          setSelectedStudentId('');
          setStudentSearch('');
      } catch (e) {
          console.error("Error sending message", e);
          alert("حدث خطأ أثناء الإرسال");
      } finally {
          setIsSending(false);
      }
  };

  const handleDeleteMessage = async (id: string) => {
      if(!window.confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;
      try {
          await deleteDoc(doc(db, "contact_messages", id));
          const updatedList = inboxMessages.filter(m => m.id !== id);
          setInboxMessages(updatedList);
          
          const CACHE_KEY = `etqan_inbox_${user?.uid}`;
          const cachedStr = localStorage.getItem(CACHE_KEY);
          if (cachedStr) {
              const cachedObj = JSON.parse(cachedStr);
              cachedObj.data = updatedList;
              localStorage.setItem(CACHE_KEY, JSON.stringify(cachedObj));
          }
      } catch (e) { console.error(e); }
  };

  const handleMarkAsRead = async (id: string) => {
      try {
          await updateDoc(doc(db, "contact_messages", id), { read: true });
          const updatedList = inboxMessages.map(m => m.id === id ? { ...m, read: true } : m);
          setInboxMessages(updatedList);

          const CACHE_KEY = `etqan_inbox_${user?.uid}`;
          const cachedStr = localStorage.getItem(CACHE_KEY);
          if (cachedStr) {
              const cachedObj = JSON.parse(cachedStr);
              cachedObj.data = updatedList;
              localStorage.setItem(CACHE_KEY, JSON.stringify(cachedObj));
          }
      } catch (e) { console.error(e); }
  };

  const filteredStudents = students.filter(s => {
      const name = s.displayName ? s.displayName.toLowerCase() : '';
      const email = s.email ? s.email.toLowerCase() : '';
      const search = studentSearch.toLowerCase();
      return name.includes(search) || email.includes(search);
  });

  const formatDate = (timestamp: any) => {
      if (!timestamp) return '';
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
      return date.toLocaleString('en-GB', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
      }).replace(',', '');
  };

  return (
    <div className="min-h-screen bg-gray-950 animate-fade-in transition-colors duration-300 text-gray-100">
        <div className="max-w-5xl mx-auto px-4 pt-2 pb-2 relative z-30">
            <div className="flex items-center gap-3">
                <button onClick={() => onNavigate('PROFILE')} className="p-2 bg-gray-900/50 hover:bg-gray-800 rounded-xl transition-all text-gray-400 hover:text-white border border-white/10 shadow-lg backdrop-blur-sm group">
                <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                    <h1 className="text-lg font-black text-white tracking-tight mb-0.5">المراسلات</h1>
                    <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-medium text-gray-500">
                        <span onClick={() => onNavigate('PROFILE')} className="hover:text-emerald-400 cursor-pointer transition-colors flex items-center gap-1">
                        <Home className="w-3 h-3" /> الرئيسية
                        </span>
                        <span className="text-gray-700">/</span>
                        <span className="text-emerald-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            البريد والرسائل
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="bg-gray-900 rounded-3xl shadow-xl border border-gray-700 overflow-hidden min-h-[600px] flex flex-col md:flex-row">
                <div className="w-full md:w-64 bg-gray-800/50 border-l border-gray-700 p-4 flex flex-col gap-2">
                    <button onClick={() => setActiveTab('INBOX')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'INBOX' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <Mail className="w-5 h-5" />
                        البريد الوارد
                        {inboxMessages.some(m => !m.read) && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
                    </button>
                    <button onClick={() => setActiveTab('COMPOSE')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'COMPOSE' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <Send className="w-5 h-5" />
                        إرسال رسالة
                    </button>
                </div>

                <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {activeTab === 'COMPOSE' ? (
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                                <Send className="w-6 h-6 text-emerald-400" />
                                إرسال رسالة جديدة
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">إلى:</label>
                                    <div className="space-y-3">
                                        <div className="flex gap-4">
                                            <label className={`flex items-center gap-2 cursor-pointer bg-gray-800 px-4 py-3 rounded-xl border transition-colors flex-1 ${selectedStudentId === 'all' ? 'border-emerald-500 bg-emerald-900/20' : 'border-gray-700 hover:border-emerald-500'}`}>
                                                <input type="radio" name="recipient" checked={selectedStudentId === 'all'} onChange={() => setSelectedStudentId('all')} className="w-4 h-4 accent-emerald-500" />
                                                <span className="font-bold text-sm text-white">جميع الطلاب</span>
                                                <Users className="w-4 h-4 text-emerald-400 mr-auto" />
                                            </label>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <Search className="h-4 w-4 text-gray-500" />
                                            </div>
                                            <input type="text" placeholder="أو ابحث عن طالب محدد..." value={studentSearch} onChange={(e) => { setStudentSearch(e.target.value); if (selectedStudentId === 'all') setSelectedStudentId(''); }} className="block w-full pr-10 pl-3 py-3 border border-gray-700 rounded-xl leading-5 bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-gray-900 focus:border-emerald-500 transition duration-150 ease-in-out sm:text-sm font-bold" />
                                        </div>
                                        {studentSearch && (
                                            <div className="max-h-40 overflow-y-auto bg-gray-800 border border-gray-700 rounded-xl custom-scrollbar">
                                                {filteredStudents.map(student => (
                                                    <div key={student.id} onClick={() => { setSelectedStudentId(student.id); setStudentSearch(student.displayName); }} className={`p-3 cursor-pointer flex items-center gap-3 hover:bg-gray-700 transition-colors ${selectedStudentId === student.id ? 'bg-emerald-900/20' : ''}`}>
                                                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                                                            {student.avatar ? <img src={student.avatar} className="w-full h-full rounded-full object-cover" /> : <User className="w-4 h-4" />}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-white">{student.displayName}</div>
                                                            <div className="text-xs text-gray-400">{student.email}</div>
                                                        </div>
                                                        {selectedStudentId === student.id && <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-auto" />}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">عنوان الرسالة</label>
                                    <input type="text" value={messageTitle} onChange={(e) => setMessageTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 text-white focus:border-emerald-500 outline-none font-bold" placeholder="مثال: هام بخصوص امتحان الغد" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">نص الرسالة</label>
                                    <textarea value={messageBody} onChange={(e) => setMessageBody(e.target.value)} className="w-full h-32 px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 text-white focus:border-emerald-500 outline-none resize-none leading-relaxed" placeholder="اكتب رسالتك هنا..." />
                                </div>
                                <button onClick={handleSendMessage} disabled={isSending} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2">
                                    {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                    إرسال الرسالة
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                                    <Mail className="w-6 h-6 text-emerald-400" />
                                    البريد الوارد
                                </h2>
                                <button onClick={() => fetchInbox(true)} className="p-2 hover:bg-gray-800 rounded-full transition-colors" title="تحديث">
                                    <RefreshCw className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {loadingInbox ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                                </div>
                            ) : inboxMessages.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                                    <Mail className="w-16 h-16 mb-4 opacity-20" />
                                    <p>لا توجد رسائل واردة</p>
                                </div>
                            ) : (
                                <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                                    {inboxMessages.map((msg) => (
                                        <div key={msg.id} className={`bg-gray-800 p-5 rounded-2xl border transition-all hover:border-emerald-500/30 relative overflow-hidden ${!msg.read ? 'border-emerald-500/50 bg-emerald-900/5' : 'border-gray-700'}`}>
                                            <div className="flex flex-row items-start gap-4 relative z-10">
                                                <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-base font-bold shadow-md border-2 ${!msg.read ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-gray-700 border-gray-600 text-gray-400'}`}>
                                                    {msg.studentName ? msg.studentName.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div>
                                                            <h4 className={`font-bold text-base leading-tight ${!msg.read ? 'text-white' : 'text-gray-300'}`}>{msg.studentName || 'طالب'}</h4>
                                                            <p className="text-xs text-gray-500 font-mono mt-0.5">{msg.studentEmail}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-1 rounded-full border border-gray-700/50">
                                                            <Clock className="w-3 h-3 text-gray-500" />
                                                            <span className="text-[10px] font-bold text-gray-400 dir-ltr">{formatDate(msg.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-gray-900/50 rounded-xl border border-gray-700/30 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{msg.message}</div>
                                                    <div className="flex justify-end gap-3 mt-3">
                                                        {!msg.read && (
                                                            <button onClick={() => handleMarkAsRead(msg.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-colors">
                                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                                تحديد كمقروء
                                                            </button>
                                                        )}
                                                        <button onClick={() => handleDeleteMessage(msg.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-colors">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                            حذف
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-center justify-center gap-1 self-center opacity-30">
                                                    <div className="w-8 h-10 border-2 border-gray-500 rounded-lg flex items-center justify-center"><Mail className="w-4 h-4 text-gray-500" /></div>
                                                </div>
                                            </div>
                                            {!msg.read && <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500"></div>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default TeacherCorrespondence;
