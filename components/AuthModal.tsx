
import React, { useState, useEffect, useRef } from 'react';
import { X, User, GraduationCap, ChevronRight, Loader2, Lock, Mail, AlertCircle, CheckCircle, ArrowLeft, ChevronDown, FileText, ShieldCheck } from 'lucide-react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = 'ROLE_SELECTION' | 'TEACHER_LOGIN' | 'STUDENT_LOGIN' | 'STUDENT_SIGNUP' | 'FORGOT_PASSWORD';

// --- Custom Select Component (Reused for Consistency) ---
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
    <div className={`relative ${isOpen ? 'z-[100]' : 'z-0'}`} ref={containerRef}>
       <button 
         type="button"
         onClick={() => !disabled && setIsOpen(!isOpen)}
         className={`w-full px-3 py-2.5 rounded-lg border flex justify-between items-center outline-none transition-all font-bold text-sm
            ${disabled 
               ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 cursor-not-allowed' 
               : isOpen 
                 ? 'bg-white dark:bg-gray-800 border-emerald-500 ring-1 ring-emerald-500/20 text-gray-800 dark:text-white shadow-sm' 
                 : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-emerald-500 text-gray-800 dark:text-white'
            }
         `}
       >
          <span className={`truncate ${!selectedOption ? 'text-gray-500' : ''}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`} />
       </button>

       {isOpen && (
         <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-48 overflow-y-auto custom-scrollbar animate-fade-in p-1 z-[100]">
            {options.map((opt, idx) => {
               if(opt.isHeader) {
                 return <div key={idx} className="px-3 py-1.5 text-[10px] font-black text-gray-500 uppercase tracking-wider mt-1 first:mt-0 bg-gray-100 dark:bg-gray-800 rounded-md mb-1">{opt.label}</div>
               }
               const isSelected = opt.value === value;
               return (
                 <div 
                   key={idx}
                   onClick={() => {
                     onChange(opt.value);
                     setIsOpen(false);
                   }}
                   className={`px-3 py-2 rounded-md font-bold text-xs cursor-pointer transition-colors flex justify-between items-center mb-1 group
                      ${isSelected 
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                   `}
                 >
                    {opt.label}
                    {isSelected && <CheckCircle className="w-3 h-3" />}
                 </div>
               );
            })}
         </div>
       )}
    </div>
  );
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<AuthStep>('ROLE_SELECTION');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { setTeacherSession, setGuestSession } = useAuth();

  // Teacher Form
  const [teacherCode, setTeacherCode] = useState('');

  // Student Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Student Signup Form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [customUniversity, setCustomUniversity] = useState('');
  
  // Privacy Policy
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  // Forgot Password Form
  const [resetEmail, setResetEmail] = useState('');

  if (!isOpen) return null;

  const resetForms = () => {
    setStep('ROLE_SELECTION');
    setError(null);
    setSuccess(null);
    setTeacherCode('');
    setLoginEmail('');
    setLoginPassword('');
    setFirstName('');
    setLastName('');
    setAge('');
    setGrade('');
    setSignupEmail('');
    setSignupPassword('');
    setGender('male');
    setResetEmail('');
    setCustomUniversity('');
    setAcceptedPrivacy(false);
    setShowPrivacyPolicy(false);
    setIsLoading(false);
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    // Minimized delay for initial processing, then extended success message
    setTimeout(() => {
        if (teacherCode === '2001') {
            // Admin: Yazan Abu Kahil
            setTeacherSession('أ. يزن أبو كحيل', 'yazanabokaheal@gmail.com');
            setSuccess('مرحباً بك أستاذ يزن! جاري الدخول...');
            setTimeout(() => window.location.reload(), 1000); 
        } else if (teacherCode === '2003') {
            // Admin: Majd Al-Din Al-Hajj
            setTeacherSession('أ. مجد الدين الحاج', 'majd@etqan.edu');
            setSuccess('مرحباً بك أستاذ مجد الدين! جاري الدخول...');
            setTimeout(() => window.location.reload(), 1000);
        } else {
            setError('رمز المعلم غير صحيح');
            setIsLoading(false);
        }
    }, 100);
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
      setSuccess('تم تسجيل الدخول بنجاح! جاري تحميل الصفحة...');
      // Force reload after 1 second to ensure session is recognized
      setTimeout(() => {
          window.location.reload();
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setError('خطأ في البريد الإلكتروني أو كلمة المرور');
      setIsLoading(false);
    }
  };

  const handleStudentSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptedPrivacy) {
        setError("يجب الموافقة على سياسة الخصوصية للمتابعة");
        return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail.trim(), signupPassword);
      const user = userCredential.user;

      // Initial Avatar is empty (No picture)
      const defaultAvatar = "";
      
      // Handle University Logic
      const finalSchool = grade === 'university' && customUniversity ? customUniversity : '';

      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        age,
        grade,
        gender,
        school: finalSchool,
        avatar: defaultAvatar,
        profileBackground: "https://lh3.googleusercontent.com/d/16IHotAb2_MEMsfpUxEIx8CBx94kLVYCs", // Default Background (New Nature Free)
        email: signupEmail.trim(),
        role: 'student',
        totalXP: 0, 
        quizzesCompleted: 0,
        createdAt: new Date(),
        acceptedPrivacy: true,
        acceptedPrivacyDate: new Date()
      });

      setSuccess('تم إنشاء الحساب بنجاح! جاري الدخول...');
      // Force reload after 1 second to ensure session is recognized
      setTimeout(() => {
          window.location.reload();
      }, 1000);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('البريد الإلكتروني مستخدم بالفعل');
      } else if (err.code === 'auth/weak-password') {
        setError('كلمة المرور ضعيفة جداً');
      } else {
        setError('حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.');
      }
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, resetEmail.trim());
      setSuccess('تم إرسال الرابط بنجاح!');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
          setError('البريد الإلكتروني غير مسجل لدينا');
      } else if (err.code === 'auth/invalid-email') {
          setError('صيغة البريد الإلكتروني غير صحيحة');
      } else if (err.code === 'auth/too-many-requests') {
          setError('تم إرسال طلبات كثيرة في وقت قصير، يرجى الانتظار قليلاً والمحاولة مجدداً.');
      } else {
          setError('حدث خطأ أثناء إرسال الرابط، يرجى التحقق من الاتصال والمحاولة مجدداً.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getLoadingText = () => {
    switch(step) {
        case 'TEACHER_LOGIN': return 'جاري التحقق من بيانات المعلم...';
        case 'STUDENT_LOGIN': return 'جاري تسجيل الدخول...';
        case 'STUDENT_SIGNUP': return 'جاري إنشاء الحساب الجديد...';
        case 'FORGOT_PASSWORD': return 'جاري إرسال رابط الاستعادة...';
        default: return 'جاري المعالجة...';
    }
  };

  const handleGuestLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setGuestSession();
      setSuccess('مرحباً بك كزائر! يمكنك الآن حل الاختبارات.');
      setTimeout(() => window.location.reload(), 1000);
    }, 500);
  };

  const renderRoleSelection = () => (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-bold text-center mb-6 text-gray-800 dark:text-white">اختر نوع الحساب للمتابعة</h3>
      
      <button 
        onClick={() => setStep('STUDENT_LOGIN')}
        className="group flex items-center p-4 border-2 border-gray-100 dark:border-gray-700 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
      >
        <div className="bg-emerald-100 dark:bg-emerald-900 p-3 rounded-full ml-4 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800 transition-colors">
          <User className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="text-right flex-1">
          <div className="font-bold text-lg text-gray-900 dark:text-white">أنا طالب</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">سجل دخولك للوصول للكورسات والاختبارات</div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500" />
      </button>

      <button 
        onClick={handleGuestLogin}
        className="group flex items-center p-4 border-2 border-gray-100 dark:border-gray-700 rounded-2xl hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all"
      >
        <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-full ml-4 group-hover:bg-amber-200 dark:group-hover:bg-amber-800 transition-colors">
          <ShieldCheck className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="text-right flex-1">
          <div className="font-bold text-lg text-gray-900 dark:text-white">دخول كزائر</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">تجربة المنصة وحل الاختبارات بدون حساب</div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-amber-500" />
      </button>

      <button 
        onClick={() => setStep('TEACHER_LOGIN')}
        className="group flex items-center p-4 border-2 border-gray-100 dark:border-gray-700 rounded-2xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
      >
        <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full ml-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
          <GraduationCap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="text-right flex-1">
          <div className="font-bold text-lg text-gray-900 dark:text-white">أنا معلم</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">دخول خاص للمعلمين والمشرفين</div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500" />
      </button>
    </div>
  );

  const renderTeacherLogin = () => (
    <form onSubmit={handleTeacherLogin} className="flex flex-col gap-4">
      <div className="text-center mb-6">
        <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">دخول المعلم</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">الرجاء إدخال الرمز السري الخاص بك</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">الرمز السري</label>
        <input 
          type="password" 
          value={teacherCode}
          onChange={(e) => setTeacherCode(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all text-center text-lg tracking-widest bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500"
          placeholder="••••"
          required
        />
      </div>

      <button 
        type="submit"
        className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 dark:shadow-none"
      >
        دخول
      </button>
    </form>
  );

  const renderStudentLogin = () => (
    <form onSubmit={handleStudentLogin} className="flex flex-col gap-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">تسجيل دخول الطالب</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">مرحباً بعودتك! تابع رحلتك التعليمية</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">البريد الإلكتروني</label>
        <div className="relative">
          <input 
            type="email" 
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900 outline-none transition-all bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500"
            placeholder="student@example.com"
            required
          />
          <Mail className="w-5 h-5 text-gray-400 absolute top-3.5 right-3" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">كلمة المرور</label>
        <div className="relative">
          <input 
            type="password" 
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900 outline-none transition-all bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500"
            placeholder="••••••••"
            required
          />
          <Lock className="w-5 h-5 text-gray-400 absolute top-3.5 right-3" />
        </div>
        <div className="text-left">
             <button 
                type="button"
                onClick={() => setStep('FORGOT_PASSWORD')}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
             >
                 نسيت كلمة المرور؟
             </button>
        </div>
      </div>

      <button 
        type="submit"
        disabled={isLoading}
        className="mt-4 w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 dark:shadow-none flex items-center justify-center gap-2"
      >
         تسجيل الدخول
      </button>

      <div className="mt-4 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          ليس لديك حساب؟ {' '}
          <button 
            type="button"
            onClick={() => setStep('STUDENT_SIGNUP')}
            className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
          >
            إنشاء حساب جديد
          </button>
        </p>
      </div>
    </form>
  );

  const renderStudentSignup = () => {
    const gradeOptions: Option[] = [
        { label: 'المرحلة المدرسية', value: 'school_header', isHeader: true },
        ...[5, 6, 7, 8, 9, 10, 11, 12].map(g => ({ label: `الصف ${g}`, value: g.toString() })),
        { label: 'المرحلة الجامعية', value: 'uni_header', isHeader: true },
        { label: 'جامعة القدس المفتوحة', value: 'English Major - QOU' },
        { label: 'طالب جامعي', value: 'university' }
    ];

    const genderOptions: Option[] = [
        { label: 'ذكر', value: 'male' },
        { label: 'أنثى', value: 'female' }
    ];

    return (
    <form onSubmit={handleStudentSignup} className="flex flex-col gap-3">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">إنشاء حساب طالب جديد</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">املأ البيانات التالية للبدء</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400">الاسم الأول</label>
          <input 
            type="text" 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-none bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 text-sm"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400">اسم العائلة</label>
          <input 
            type="text" 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-none bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 text-sm"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400">العمر</label>
          <input 
            type="number" 
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-none bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 text-sm"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400">الجنس</label>
          <CustomSelect 
            options={genderOptions}
            value={gender}
            onChange={(val) => setGender(val as 'male' | 'female')}
            placeholder="اختر الجنس"
          />
        </div>
      </div>

      <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">المرحلة الدراسية</label>
          <CustomSelect 
            options={gradeOptions}
            value={grade}
            onChange={(val) => setGrade(val)}
            placeholder="اختر الصف / المرحلة"
          />
      </div>

      {/* University Name Input */}
      {grade === 'university' && (
          <div className="space-y-1 animate-fade-in">
              <label className="text-xs font-bold text-blue-400 block mb-1">اسم الجامعة / التخصص</label>
              <input 
                type="text" 
                value={customUniversity}
                onChange={(e) => setCustomUniversity(e.target.value)}
                placeholder="مثال: جامعة النجاح - هندسة"
                className="w-full px-3 py-2 rounded-lg border border-blue-500/50 focus:border-blue-500 outline-none bg-blue-50 dark:bg-blue-900/10 text-black dark:text-white placeholder-gray-500 text-sm"
                required
              />
          </div>
      )}

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 dark:text-gray-400">البريد الإلكتروني</label>
        <input 
          type="email" 
          value={signupEmail}
          onChange={(e) => setSignupEmail(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-none bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 text-sm"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 dark:text-gray-400">كلمة المرور</label>
        <input 
          type="password" 
          value={signupPassword}
          onChange={(e) => setSignupPassword(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-none bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 text-sm"
          required
          minLength={6}
        />
      </div>

      {/* Privacy Policy Checkbox */}
      <div className="flex items-center gap-2 px-1 mt-2">
          <input 
            id="privacy-policy" 
            type="checkbox" 
            checked={acceptedPrivacy} 
            onChange={(e) => setAcceptedPrivacy(e.target.checked)} 
            className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
          />
          <label htmlFor="privacy-policy" className="text-xs font-bold text-gray-500 dark:text-gray-400 select-none">
              أوافق على <span onClick={(e) => { e.preventDefault(); setShowPrivacyPolicy(true); }} className="text-emerald-500 dark:text-emerald-400 hover:underline cursor-pointer">سياسة الخصوصية وشروط الاستخدام</span>
          </label>
      </div>

      <button 
        type="submit"
        disabled={isLoading || !acceptedPrivacy}
        className={`mt-2 w-full text-white py-3 rounded-xl font-bold transition-all shadow-lg dark:shadow-none flex items-center justify-center gap-2 ${acceptedPrivacy ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-gray-400 cursor-not-allowed opacity-50'}`}
      >
        إنشاء الحساب
      </button>

      <div className="text-center mt-2">
        <button 
          type="button"
          onClick={() => setStep('STUDENT_LOGIN')}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 transition-colors"
        >
          لديك حساب بالفعل؟ تسجيل الدخول
        </button>
      </div>
    </form>
    );
  };

  const renderForgotPassword = () => (
    <form onSubmit={handlePasswordReset} className="flex flex-col gap-4">
        <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">استعادة كلمة المرور</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">أدخل بريدك الإلكتروني لنرسل لك <strong>رابط</strong> إعادة التعيين</p>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">البريد الإلكتروني</label>
            <div className="relative">
            <input 
                type="email" 
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900 outline-none transition-all bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500"
                placeholder="student@example.com"
                required
            />
            <Mail className="w-5 h-5 text-gray-400 absolute top-3.5 right-3" />
            </div>
        </div>

        <button 
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 dark:shadow-none flex items-center justify-center gap-2"
        >
            إرسال رابط الاستعادة
        </button>

        <div className="text-center mt-4">
            <button 
                type="button"
                onClick={() => setStep('STUDENT_LOGIN')}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 transition-colors flex items-center justify-center gap-1 mx-auto"
            >
                <ArrowLeft className="w-4 h-4" />
                العودة لتسجيل الدخول
            </button>
        </div>
    </form>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300" onClick={handleClose}></div>
      
      <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md relative shadow-2xl overflow-visible animate-fade-in-up p-6 min-h-[400px] flex flex-col border border-gray-100 dark:border-gray-800">
        
        {/* Loading Overlay - Enhanced */}
        {isLoading && !success && (
            <div className="absolute inset-0 bg-gray-950/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center animate-fade-in rounded-3xl border border-white/10 transition-all duration-500">
                <div className="relative mb-8">
                    {/* Animated Background Orbs */}
                    <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse"></div>
                    
                    {/* Modern Spinner */}
                    <div className="relative w-24 h-24">
                        <div className="absolute inset-0 border-t-4 border-emerald-500 border-solid rounded-full animate-spin"></div>
                        <div className="absolute inset-2 border-r-4 border-blue-500 border-solid rounded-full animate-spin-reverse"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                             <User className="w-8 h-8 text-white/80" />
                        </div>
                    </div>
                </div>
                
                <h4 className="text-xl font-black text-white mb-2 tracking-tight animate-pulse">{getLoadingText()}</h4>
                <p className="text-gray-400 text-sm font-medium flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    يرجى الانتظار، جاري معالجة البيانات...
                </p>
            </div>
        )}

        {/* Close Button */}
        <button 
          onClick={handleClose}
          disabled={isLoading}
          className="absolute top-4 left-4 p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors z-10 disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Back Button */}
        {step !== 'ROLE_SELECTION' && !success && step !== 'FORGOT_PASSWORD' && (
          <button 
            onClick={() => setStep('ROLE_SELECTION')}
            disabled={isLoading}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors z-10 flex items-center gap-1 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
            <span className="text-xs font-bold">عودة</span>
          </button>
        )}

        <div className="mt-6 flex-1 flex flex-col justify-center">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center gap-4 animate-fade-in">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-2 animate-[bounce_1s_infinite]">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white leading-relaxed px-4 whitespace-pre-line">{success}</h3>
              
              {step === 'FORGOT_PASSWORD' && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-xl p-4 mx-4 text-sm text-yellow-800 dark:text-yellow-200 text-right shadow-sm mt-4">
                      <p className="font-bold flex items-center gap-2 mb-2 text-yellow-900 dark:text-yellow-100">
                          <AlertCircle className="w-5 h-5" />
                          تنبيه هام جداً:
                      </p>
                      <p className="leading-relaxed">
                        في معظم الأحيان، تصل رسالة إعادة التعيين إلى مجلد <strong>الرسائل غير المرغوب فيها (Spam)</strong> أو (Junk).
                      </p>
                  </div>
              )}

              {/* If it's not forgot password, it's login/signup success, page will reload automatically via setTimeout */}
              {step === 'FORGOT_PASSWORD' && (
                  <button 
                    onClick={() => {
                        setStep('STUDENT_LOGIN');
                        setSuccess(null);
                    }}
                    className="mt-8 bg-emerald-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 dark:shadow-none transform hover:scale-105 duration-200"
                  >
                    العودة لتسجيل الدخول
                  </button>
              )}
            </div>
          ) : (
            <>
              {step === 'ROLE_SELECTION' && renderRoleSelection()}
              {step === 'TEACHER_LOGIN' && renderTeacherLogin()}
              {step === 'STUDENT_LOGIN' && renderStudentLogin()}
              {step === 'STUDENT_SIGNUP' && renderStudentSignup()}
              {step === 'FORGOT_PASSWORD' && renderForgotPassword()}
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900 rounded-lg flex items-start gap-2 text-red-600 dark:text-red-400 text-sm animate-fade-in">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span className="font-medium">{error}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Privacy Policy Modal Overlay */}
        {showPrivacyPolicy && (
            <div className="absolute inset-0 bg-gray-900 z-[150] rounded-3xl overflow-hidden flex flex-col animate-fade-in-up">
                <div className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        سياسة الخصوصية
                    </h3>
                    <button onClick={() => setShowPrivacyPolicy(false)} className="text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 text-gray-300 text-sm leading-relaxed space-y-4 custom-scrollbar text-right">
                    <div className="bg-emerald-900/20 p-4 rounded-xl border border-emerald-500/20 mb-4">
                        <p className="font-bold text-white mb-1">مرحباً بك في منصة إتقان!</p>
                        <p className="text-xs">نحن نلتزم بحماية خصوصيتك وضمان تجربة تعليمية آمنة.</p>
                    </div>
                    
                    <ul className="space-y-4 list-disc list-inside">
                        <li>
                            <strong className="text-white">جمع المعلومات:</strong> نقوم بجمع اسمك، صفك الدراسي، واسم مدرستك وبريدك الإلكتروني لغايات إنشاء ملفك الشخصي ومتابعة تقدمك الدراسي.
                        </li>
                        <li>
                            <strong className="text-white">استخدام المعلومات:</strong> نستخدم بياناتك لإصدار شهادات التقدير، عرض اسمك في لوحة الشرف، وتحليل نتائج اختباراتك لمساعدتك على التحسن.
                        </li>
                        <li>
                            <strong className="text-white">سرية البيانات:</strong> بياناتك محفوظة بأمان ولا يتم مشاركتها مع أي أطراف خارجية لأغراض تجارية. فقط المعلمون المسؤولون يمكنهم الاطلاع على نتائجك الأكاديمية.
                        </li>
                        <li>
                            <strong className="text-white">الاستخدام المقبول:</strong> بإنشاء حساب، تتعهد باستخدام المنصة لأغراض تعليمية، واحترام حقوق الملكية الفكرية للمحتوى (الاختبارات والشروحات).
                        </li>
                    </ul>

                    <div className="mt-6 pt-4 border-t border-gray-700 text-center">
                        <button 
                            onClick={() => setShowPrivacyPolicy(false)}
                            className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors w-full"
                        >
                            فهمت وموافق
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default AuthModal;
