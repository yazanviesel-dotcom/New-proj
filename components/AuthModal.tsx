import React, { useState } from 'react';
import { X, User, GraduationCap, ChevronRight, Loader2, Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = 'ROLE_SELECTION' | 'TEACHER_LOGIN' | 'STUDENT_LOGIN' | 'STUDENT_SIGNUP';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<AuthStep>('ROLE_SELECTION');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { setTeacherSession } = useAuth();

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
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (teacherCode === '2001') {
      setTeacherSession(); // Activate teacher session in global context
      setSuccess('تم تسجيل دخول المعلم بنجاح!');
      setTimeout(() => handleClose(), 1500);
    } else {
      setError('رمز المعلم غير صحيح');
    }
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setSuccess('تم تسجيل الدخول بنجاح!');
      setTimeout(() => handleClose(), 1500);
    } catch (err: any) {
      console.error(err);
      setError('خطأ في البريد الإلكتروني أو كلمة المرور');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        age,
        grade,
        email: signupEmail,
        role: 'student',
        createdAt: new Date()
      });

      setSuccess('تم إنشاء الحساب بنجاح!');
      setTimeout(() => handleClose(), 1500);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('البريد الإلكتروني مستخدم بالفعل');
      } else if (err.code === 'auth/weak-password') {
        setError('كلمة المرور ضعيفة جداً');
      } else {
        setError('حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleSelection = () => (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-bold text-center mb-6 text-gray-800">اختر نوع الحساب للمتابعة</h3>
      
      <button 
        onClick={() => setStep('STUDENT_LOGIN')}
        className="group flex items-center p-4 border-2 border-gray-100 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all"
      >
        <div className="bg-emerald-100 p-3 rounded-full ml-4 group-hover:bg-emerald-200 transition-colors">
          <User className="w-8 h-8 text-emerald-600" />
        </div>
        <div className="text-right flex-1">
          <div className="font-bold text-lg text-gray-900">أنا طالب</div>
          <div className="text-sm text-gray-500">سجل دخولك للوصول للكورسات والاختبارات</div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500" />
      </button>

      <button 
        onClick={() => setStep('TEACHER_LOGIN')}
        className="group flex items-center p-4 border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all"
      >
        <div className="bg-blue-100 p-3 rounded-full ml-4 group-hover:bg-blue-200 transition-colors">
          <GraduationCap className="w-8 h-8 text-blue-600" />
        </div>
        <div className="text-right flex-1">
          <div className="font-bold text-lg text-gray-900">أنا معلم</div>
          <div className="text-sm text-gray-500">دخول خاص للمعلمين والمشرفين</div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500" />
      </button>
    </div>
  );

  const renderTeacherLogin = () => (
    <form onSubmit={handleTeacherLogin} className="flex flex-col gap-4">
      <div className="text-center mb-6">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">دخول المعلم</h3>
        <p className="text-gray-500 text-sm mt-1">الرجاء إدخال الرمز السري الخاص بك</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">الرمز السري</label>
        <input 
          type="password" 
          value={teacherCode}
          onChange={(e) => setTeacherCode(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-center text-lg tracking-widest bg-white text-black placeholder-gray-500"
          placeholder="••••"
          required
        />
      </div>

      <button 
        type="submit"
        className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
      >
        دخول
      </button>
    </form>
  );

  const renderStudentLogin = () => (
    <form onSubmit={handleStudentLogin} className="flex flex-col gap-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">تسجيل دخول الطالب</h3>
        <p className="text-gray-500 text-sm mt-1">مرحباً بعودتك! تابع رحلتك التعليمية</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label>
        <div className="relative">
          <input 
            type="email" 
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white text-black placeholder-gray-500"
            placeholder="student@example.com"
            required
          />
          <Mail className="w-5 h-5 text-gray-400 absolute top-3.5 right-3" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">كلمة المرور</label>
        <div className="relative">
          <input 
            type="password" 
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white text-black placeholder-gray-500"
            placeholder="••••••••"
            required
          />
          <Lock className="w-5 h-5 text-gray-400 absolute top-3.5 right-3" />
        </div>
      </div>

      <button 
        type="submit"
        disabled={isLoading}
        className="mt-4 w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تسجيل الدخول'}
      </button>

      <div className="mt-4 text-center">
        <p className="text-gray-600 text-sm">
          ليس لديك حساب؟ {' '}
          <button 
            type="button"
            onClick={() => setStep('STUDENT_SIGNUP')}
            className="text-emerald-600 font-bold hover:underline"
          >
            إنشاء حساب جديد
          </button>
        </p>
      </div>
    </form>
  );

  const renderStudentSignup = () => (
    <form onSubmit={handleStudentSignup} className="flex flex-col gap-3">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">إنشاء حساب طالب جديد</h3>
        <p className="text-gray-500 text-sm mt-1">املأ البيانات التالية للبدء</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">الاسم الأول</label>
          <input 
            type="text" 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none bg-white text-black placeholder-gray-500"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">اسم العائلة</label>
          <input 
            type="text" 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none bg-white text-black placeholder-gray-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">العمر</label>
          <input 
            type="number" 
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none bg-white text-black placeholder-gray-500"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">الصف الدراسي</label>
          <select 
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none bg-white text-black"
            required
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
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label>
        <input 
          type="email" 
          value={signupEmail}
          onChange={(e) => setSignupEmail(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none bg-white text-black placeholder-gray-500"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">كلمة المرور</label>
        <input 
          type="password" 
          value={signupPassword}
          onChange={(e) => setSignupPassword(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 outline-none bg-white text-black placeholder-gray-500"
          required
          minLength={6}
        />
      </div>

      <button 
        type="submit"
        disabled={isLoading}
        className="mt-2 w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'إنشاء الحساب'}
      </button>

      <div className="text-center mt-2">
        <button 
          type="button"
          onClick={() => setStep('STUDENT_LOGIN')}
          className="text-sm text-gray-500 hover:text-emerald-600 transition-colors"
        >
          لديك حساب بالفعل؟ تسجيل الدخول
        </button>
      </div>
    </form>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose}></div>
      
      <div className="bg-white rounded-3xl w-full max-w-md relative shadow-2xl overflow-hidden animate-fade-in-up p-6">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 left-4 p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Back Button (if not in initial step) */}
        {step !== 'ROLE_SELECTION' && !success && (
          <button 
            onClick={() => setStep('ROLE_SELECTION')}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors z-10 flex items-center gap-1"
          >
            <ChevronRight className="w-5 h-5" />
            <span className="text-xs font-bold">عودة</span>
          </button>
        )}

        <div className="mt-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">{success}</h3>
            </div>
          ) : (
            <>
              {step === 'ROLE_SELECTION' && renderRoleSelection()}
              {step === 'TEACHER_LOGIN' && renderTeacherLogin()}
              {step === 'STUDENT_LOGIN' && renderStudentLogin()}
              {step === 'STUDENT_SIGNUP' && renderStudentSignup()}
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default AuthModal;