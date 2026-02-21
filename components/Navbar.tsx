
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, LogIn, LogOut, Bell, Home, BookOpen, FileText, Monitor, MessageCircle, Mail, UserCircle, Send, Loader2, ChevronDown, CheckCircle, HelpCircle, Users, Info, Book, RefreshCw, Crown, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AppView, Notification } from '../types';
import { collection, query, orderBy, limit, addDoc, serverTimestamp, doc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import Logo from './Logo';

interface NavbarProps {
  onLoginClick: () => void;
  onNavigate: (view: AppView) => void;
  onLogoutClick: () => void;
}

const TEACHERS_LIST = [
    { id: 'teacher-yazanabokaheal', name: 'أ. يزن أبو كحيل' },
    { id: 'teacher-majd', name: 'أ. مجد الدين الحاج' }
];

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onNavigate, onLogoutClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();

  // Notification State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isRefreshingNotifs, setIsRefreshingNotifs] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Contact Teacher Modal State
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('teacher-yazanabokaheal'); // Default to Yazan
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Auth Toast State
  const [showAuthToast, setShowAuthToast] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Optimized Notifications Fetching (Aggressive Caching - 1 Year)
  const fetchNotifications = async (forceRefresh = false) => {
    if (!user) {
        setNotifications([]);
        return;
    }

    const CACHE_KEY = `etqan_notifications_${user.uid}`;
    // Updated Cache TTL to 1 Year (365 Days) to prevent reads
    const CACHE_TTL = 365 * 24 * 60 * 60 * 1000; 
    const now = Date.now();

    // 1. Try Local Cache First (if not forcing refresh)
    if (!forceRefresh) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            try {
                const { data, timestamp } = JSON.parse(cached);
                if (now - timestamp < CACHE_TTL) {
                    processNotifications(data);
                    return;
                }
            } catch (e) { console.error(e); }
        }
    }

    setIsRefreshingNotifs(true);
    // 2. Fetch from Network
    try {
        // Reduced limit to 10 items.
        const limitCount = 10;
        const q = query(
            collection(db, "notifications"),
            orderBy("createdAt", "desc"),
            limit(limitCount)
        );

        const snapshot = await getDocs(q);
        const notifs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Serialize timestamp for localStorage
            createdAt: doc.data().createdAt ? { seconds: doc.data().createdAt.seconds } : null
        }));

        // Save to Cache
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: notifs,
            timestamp: now
        }));

        processNotifications(notifs);

    } catch (error) {
        console.error("Error fetching notifications:", error);
    } finally {
        setIsRefreshingNotifs(false);
    }
  };

  const processNotifications = (rawNotifs: any[]) => {
    const processedNotifs: Notification[] = [];
    let unread = 0;
    
    // Get locally stored read IDs (Source of Truth for global notifications)
    let viewedNotifications: string[] = [];
    try {
        const storedViewed = localStorage.getItem(`viewed_notifs_${user?.uid}`);
        viewedNotifications = storedViewed ? JSON.parse(storedViewed) : [];
    } catch (e) {
        console.error("Error parsing viewed notifications", e);
    }

    // Determine user creation time to filter out old notifications
    let userJoinTime = 0;
    if (user?.createdAt) {
        if (user.createdAt.seconds) {
            userJoinTime = user.createdAt.seconds * 1000;
        } else if (user.createdAt instanceof Date) {
            userJoinTime = user.createdAt.getTime();
        } else if (typeof user.createdAt === 'string') {
            userJoinTime = new Date(user.createdAt).getTime();
        }
    }

    rawNotifs.forEach((data) => {
        // Calculate Notification Time
        const notifTime = data.createdAt 
            ? (data.createdAt.seconds ? data.createdAt.seconds * 1000 : new Date(data.createdAt).getTime()) 
            : Date.now();

        // LOGIC FIX:
        // 1. If it's a personal message (recipientId === user.uid), show it regardless of date.
        // 2. If it's a global message (recipientId === 'all'), ONLY show if created AFTER user joined.
        
        const isPersonal = data.recipientId === user?.uid;
        const isGlobal = data.recipientId === 'all';
        const isNewEnough = userJoinTime === 0 || notifTime >= userJoinTime; // userJoinTime 0 means fallback (show all) or missing data

        if (isPersonal || (isGlobal && isNewEnough)) {
            
            const isReadLocally = viewedNotifications.includes(data.id);
            const isReadServer = data.read === true;
            const finalReadStatus = isReadLocally || isReadServer;

            if (!finalReadStatus) {
                unread++;
            }
            
            processedNotifs.push({ 
                ...data, 
                read: finalReadStatus
            } as Notification);
        }
    });
    
    setNotifications(processedNotifs);
    setUnreadCount(unread);
  };

  // Fetch on mount or user change
  useEffect(() => {
      fetchNotifications();
  }, [user]);

  const handleNotificationClick = async () => {
      // Toggle Dropdown
      const opening = !showNotifications;
      setShowNotifications(opening);
      
      // LOGIC: Mark as read immediately when OPENING the menu
      if (opening && unreadCount > 0) {
          const viewingNow = [...notifications];
          
          // 1. Identify all unread items currently visible
          const unreadItems = viewingNow.filter(n => !n.read);
          const unreadIds = unreadItems.map(n => n.id);

          if (unreadIds.length === 0) return;

          // 2. Update Local Storage (Immediate Client-Side Fix)
          try {
              const currentReadStr = localStorage.getItem(`viewed_notifs_${user?.uid}`);
              const currentRead = currentReadStr ? JSON.parse(currentReadStr) : [];
              const newReadSet = new Set([...currentRead, ...unreadIds]);
              localStorage.setItem(`viewed_notifs_${user?.uid}`, JSON.stringify(Array.from(newReadSet)));
              
              // Also update the main cache so next refresh sees them as read
              const CACHE_KEY = `etqan_notifications_${user?.uid}`;
              const mainCacheStr = localStorage.getItem(CACHE_KEY);
              if (mainCacheStr) {
                  const mainCache = JSON.parse(mainCacheStr);
                  // Update read status in cache but keep structure
                  localStorage.setItem(CACHE_KEY, JSON.stringify(mainCache));
              }

          } catch (e) {
              console.error("Error updating local storage for notifications", e);
          }

          // 3. Update UI State immediately
          const updatedNotifs = viewingNow.map(n => ({ ...n, read: true }));
          setNotifications(updatedNotifs);
          setUnreadCount(0);

          // 4. Batch Update Firestore (Only for personal messages to save writes)
          const personalUnread = unreadItems.filter(n => n.recipientId !== 'all');
          
          if (personalUnread.length > 0) {
              try {
                  const batch = writeBatch(db);
                  personalUnread.forEach(n => {
                      const notifRef = doc(db, "notifications", n.id);
                      batch.update(notifRef, { read: true });
                  });
                  await batch.commit();
              } catch (e) {
                  console.error("Error batch updating notifications:", e);
              }
          }
      }
  };

  const handleSendContactMessage = async () => {
      if (!contactMessage.trim()) return;
      setIsSendingMessage(true);
      try {
          const selectedTeacher = TEACHERS_LIST.find(t => t.id === selectedTeacherId);
          
          await addDoc(collection(db, "contact_messages"), {
              studentId: user?.uid,
              studentName: user?.displayName || 'طالب',
              studentEmail: user?.email,
              message: contactMessage,
              teacherId: selectedTeacherId, 
              teacherName: selectedTeacher?.name,
              createdAt: serverTimestamp(),
              read: false
          });

          await addDoc(collection(db, "notifications"), {
              recipientId: selectedTeacherId, 
              title: `رسالة جديدة من ${user?.displayName || 'طالب'}`,
              message: contactMessage.substring(0, 100) + (contactMessage.length > 100 ? '...' : ''),
              type: 'message',
              senderName: user?.displayName,
              senderId: user?.uid,
              createdAt: serverTimestamp(),
              read: false
          });

          alert("تم إرسال رسالتك للمعلم بنجاح!");
          setContactMessage('');
          setShowContactModal(false);
          setShowConfirmation(false);
      } catch (error) {
          console.error(error);
          alert("حدث خطأ أثناء الإرسال");
      } finally {
          setIsSendingMessage(false);
      }
  };

  const triggerAuthToast = () => {
    setShowAuthToast(true);
    setTimeout(() => setShowAuthToast(false), 3000);
  };

  const handleRestrictedNavigate = (view: AppView) => {
    if (!user) {
      triggerAuthToast();
      setIsOpen(false);
      return;
    }
    onNavigate(view);
    setIsOpen(false);
  };

  const getNotificationIcon = (type: string) => {
      switch(type) {
          case 'quiz': return <BookOpen className="w-4 h-4 text-yellow-400" />;
          case 'file': return <FileText className="w-4 h-4 text-blue-400" />;
          case 'explanation': return <Monitor className="w-4 h-4 text-purple-400" />;
          case 'message': return <Mail className="w-4 h-4 text-emerald-400" />;
          default: return <Bell className="w-4 h-4 text-gray-400" />;
      }
  };

  const formatDate = (timestamp: any) => {
      if (!timestamp) return '';
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleString('en-GB', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
      }).replace(',', '');
  };

  const navLinkClass = (active: boolean) => 
    `cursor-pointer px-4 py-2 rounded-xl transition-all font-bold text-sm flex items-center gap-2 ${
      active 
      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
      : 'text-gray-300 hover:text-white hover:bg-gray-800'
    }`;

  return (
    <>
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-950 border-b border-white/5 py-3 shadow-xl' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center relative">
          
          {/* Right Side: Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('HOME')}>
             <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Logo className="w-10 h-10 md:w-12 md:h-12 drop-shadow-xl hover:scale-105 transition-transform" />
             </div>
            <span className="text-2xl font-black text-white tracking-tight">إتقان</span>
          </div>

          {/* Center: Desktop Navigation */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center bg-gray-950/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/5 shadow-2xl">
            <button onClick={() => onNavigate('HOME')} className={navLinkClass(false)}>
              <Home className="w-4 h-4" /> الرئيسية
            </button>
            <button onClick={() => handleRestrictedNavigate('QUIZZES')} className={navLinkClass(false)}>
              <BookOpen className="w-4 h-4" /> الاختبارات
            </button>
            <button onClick={() => handleRestrictedNavigate('LESSONS_EXPLANATIONS')} className={navLinkClass(false)}>
              <Book className="w-4 h-4" /> الشروحات
            </button>
          </div>

          {/* Left Side: Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            
            {/* NOTIFICATION BELL */}
            {user && user.role !== 'guest' && (
                <div className="relative" ref={notificationRef}>
                    <button 
                        onClick={handleNotificationClick}
                        className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all relative border border-gray-700 flex items-center justify-center group"
                        aria-label="Notifications"
                    >
                        <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-swing' : ''}`} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-gray-900 animate-pulse">
                                {unreadCount > 9 ? '+9' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute top-full left-0 md:left-auto md:right-0 mt-3 w-80 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up origin-top-right z-[60]">
                            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 backdrop-blur-sm">
                                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                                    <Bell className="w-4 h-4 text-emerald-400" />
                                    الإشعارات
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); fetchNotifications(true); }}
                                        className="p-1.5 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
                                        title="تحديث"
                                    >
                                        <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingNotifs ? 'animate-spin text-emerald-500' : ''}`} />
                                    </button>
                                    {user.role === 'student' && (
                                        <button 
                                            onClick={() => { setShowNotifications(false); setShowContactModal(true); }}
                                            className="text-xs bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded-lg hover:bg-emerald-900/50 transition-colors font-bold border border-emerald-500/30"
                                        >
                                            <Mail className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                {isRefreshingNotifs && notifications.length === 0 ? (
                                    <div className="p-8 text-center flex justify-center">
                                        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div className="p-12 text-center text-gray-500 text-sm flex flex-col items-center">
                                        <Bell className="w-10 h-10 mb-3 opacity-20" />
                                        <p>لا توجد إشعارات جديدة</p>
                                        <button onClick={() => fetchNotifications(true)} className="mt-2 text-xs text-blue-400 underline">تحديث</button>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-800">
                                        {notifications.map((notif) => (
                                            <div key={notif.id} className={`p-4 hover:bg-gray-800/50 transition-colors relative ${!notif.read ? 'bg-emerald-900/10' : ''}`}>
                                                {!notif.read && <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-500 rounded-full"></div>}
                                                <div className="flex gap-3">
                                                    <div className="mt-1 shrink-0 bg-gray-800 p-1.5 w-8 h-8 flex items-center justify-center rounded-full border border-gray-700">
                                                        {getNotificationIcon(notif.type)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className={`text-sm font-bold mb-1 ${!notif.read ? 'text-white' : 'text-gray-400'}`}>{notif.title}</h4>
                                                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{notif.message}</p>
                                                        <span className="text-[10px] text-gray-600 mt-2 block flex items-center gap-1">
                                                            {formatDate(notif.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {user ? (
              <div className="hidden md:flex items-center gap-3">
                 {user.role !== 'guest' && (
                   <div className="relative group">
                       <button 
                          onClick={() => onNavigate('PROFILE')}
                          className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 text-white pr-1 pl-4 py-1.5 rounded-full transition-all border border-gray-700 hover:border-gray-600"
                       >
                          {user.avatar ? (
                              <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-gray-600" />
                          ) : (
                              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-xs font-bold">
                                  {user.displayName.charAt(0)}
                              </div>
                          )}
                          <div className="text-right">
                              <div className="text-sm font-bold max-w-[120px] truncate leading-tight flex items-center gap-1">
                                  {user.displayName}
                                  {user.isSubscriber && <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />}
                              </div>
                          </div>
                       </button>
                       {/* Tooltip */}
                       <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max bg-gray-900 text-emerald-400 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-xl z-50">
                          اضغط لدخول الملف الشخصي
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                       </div>
                   </div>
                 )}
                 
                 {user.role === 'guest' && (
                   <div className="flex items-center gap-3 bg-gray-800 text-white px-4 py-1.5 rounded-full border border-gray-700">
                      <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-xs font-bold">
                          <UserCircle className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold">{user.displayName}</span>
                   </div>
                 )}
                 
                 <button 
                    onClick={onLogoutClick}
                    className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-all border border-red-500/20"
                    title="تسجيل الخروج"
                 >
                    <LogOut className="w-5 h-5" />
                 </button>
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="hidden md:flex bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20 items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                دخول
              </button>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2.5 text-gray-300 hover:text-white bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors border border-gray-700"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-gray-950 border-b border-white/5 shadow-2xl animate-fade-in-up h-[calc(100vh-70px)] overflow-y-auto">
          <div className="px-4 py-6 space-y-3">
            
            {user && (
                <div className="mb-2">
                    {user.role !== 'guest' ? (
                      <>
                        <p className="text-[10px] text-emerald-500 font-bold px-4 mb-1">اضغط لدخول الملف الشخصي</p>
                        <button onClick={() => { onNavigate('PROFILE'); setIsOpen(false); }} className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-emerald-400 hover:bg-emerald-900/20 font-bold transition-colors border border-emerald-900/30">
                            <div className="flex items-center gap-3">
                                <UserCircle className="w-5 h-5" /> 
                                {user.displayName}
                                {user.isSubscriber && <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />}
                            </div>
                        </button>
                      </>
                    ) : (
                      <div className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-amber-400 bg-amber-900/10 font-bold border border-amber-900/30">
                          <UserCircle className="w-5 h-5" /> 
                          {user.displayName}
                      </div>
                    )}
                </div>
            )}

            <button onClick={() => { onNavigate('HOME'); setIsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white font-bold transition-colors">
              <Home className="w-5 h-5" /> الرئيسية
            </button>

            <button onClick={() => { onNavigate('TEACHER_CV'); setIsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white font-bold transition-colors">
              <Users className="w-5 h-5" /> تعرف على المعلمين
            </button>

            <button onClick={() => handleRestrictedNavigate('QUIZZES')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white font-bold transition-colors">
              <BookOpen className="w-5 h-5" /> الاختبارات
            </button>

            <button onClick={() => handleRestrictedNavigate('LESSONS_EXPLANATIONS')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white font-bold transition-colors">
              <Book className="w-5 h-5" /> الشروحات
            </button>

            <button onClick={() => { onNavigate('CONTACT_TEACHER'); setIsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white font-bold transition-colors">
              <MessageCircle className="w-5 h-5" /> تواصل معنا
            </button>

            <button onClick={() => { onNavigate('PLATFORM_DEFINITION'); setIsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white font-bold transition-colors">
              <Info className="w-5 h-5" /> تعريف المنصة
            </button>
            
            <div className="border-t border-gray-800 my-2 pt-2">
                {user ? (
                    <button onClick={() => { onLogoutClick(); setIsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/20 font-bold transition-colors">
                        <LogOut className="w-5 h-5" /> تسجيل خروج
                    </button>
                ) : (
                    <button onClick={() => { onLoginClick(); setIsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-600 text-white font-bold justify-center shadow-lg">
                        <LogIn className="w-5 h-5" /> تسجيل الدخول
                    </button>
                )}
            </div>
          </div>
        </div>
      )}
    </nav>

    {/* Fix: Added missing Auth Toast UI which was hinted at in component state */}
    {showAuthToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-fade-in-up">
            <div className="bg-red-900/90 backdrop-blur-md border border-red-800 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="font-bold text-sm">يجب تسجيل الدخول أولاً للوصول لهذه الصفحة</span>
            </div>
        </div>
    )}

    {/* Fix: Added missing Contact Teacher Modal which was truncated and caused missing default export error */}
    {showContactModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-gray-900 rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden border border-gray-700 animate-fade-in-up">
                <div className="bg-gray-800 p-6 flex justify-between items-center border-b border-gray-700">
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                        <Mail className="w-6 h-6 text-emerald-400" />
                        تواصل مع المعلم
                    </h3>
                    <button onClick={() => setShowContactModal(false)} className="text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-400 mb-2">اختر المعلم:</label>
                        <div className="grid grid-cols-2 gap-3">
                            {TEACHERS_LIST.map(t => (
                                <button 
                                    key={t.id}
                                    onClick={() => setSelectedTeacherId(t.id)}
                                    className={`p-3 rounded-xl border-2 transition-all text-sm font-bold ${selectedTeacherId === t.id ? 'border-emerald-500 bg-emerald-900/20 text-white' : 'border-gray-700 bg-gray-800 text-gray-400'}`}
                                >
                                    {t.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-400 mb-2">رسالتك:</label>
                        <textarea 
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            className="w-full h-32 bg-gray-800 border border-gray-700 rounded-xl p-4 text-white outline-none focus:border-emerald-500 transition-colors resize-none"
                            placeholder="اكتب استفسارك هنا..."
                        />
                    </div>
                    <button 
                        onClick={handleSendContactMessage}
                        disabled={isSendingMessage || !contactMessage.trim()}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-black rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                    >
                        {isSendingMessage ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        إرسال الرسالة
                    </button>
                </div>
            </div>
        </div>
    )}
    </>
  );
};

/* Fix: Added missing default export that caused the error in App.tsx */
export default Navbar;
