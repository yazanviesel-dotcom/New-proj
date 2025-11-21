
import React from 'react';
import { Play, Star, ChevronLeft, BookOpen, User, Video, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AppView } from '../types';

interface HeroProps {
  onStartQuiz: () => void;
  onLoginClick: () => void;
  onNavigate: (view: AppView) => void;
}

const Hero: React.FC<HeroProps> = ({ onStartQuiz, onLoginClick, onNavigate }) => {
  const { user } = useAuth();

  const handleQuizClick = () => {
    if (user) {
      onNavigate('QUIZZES');
    } else {
      alert("عذراً، يجب عليك تسجيل الدخول أولاً للوصول للاختبارات");
      onLoginClick();
    }
  };

  const handleLessonsClick = () => {
    if (user) {
      onNavigate('LESSONS');
    } else {
      alert("عذراً، يجب عليك تسجيل الدخول أولاً للوصول للدروس");
      onLoginClick();
    }
  };

  const handleContactClick = () => {
      onNavigate('CONTACT_TEACHER');
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-80px)] flex items-center justify-center bg-grid-pattern overflow-hidden animate-fade-in">
      {/* Background decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-0 w-full relative z-10 flex flex-col items-center text-center">
          
            {/* Badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full shadow-sm">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-emerald-800 font-bold text-sm">المنصة الأولى في فلسطين</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.2] lg:leading-[1.15] mb-6">
              رحلتك نحو <br />
              <span className="text-emerald-600 inline-block relative">
                التفوق الدراسي
                <svg className="absolute w-full h-3 -bottom-1 right-0 text-emerald-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                   <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
              <br /> تبدأ هنا
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-10">
              محتوى تعليمي شامل لطلاب المدارس بإدارة وإشراف معلم اللغة الإنجليزية <span className="text-emerald-600 font-black text-2xl px-1 relative inline-block">الأستاذ يزن أبو كحيل</span>.
            </p>

            {/* Buttons */}
            <div className="flex flex-col w-full max-w-md gap-4 justify-center">
              <button 
                onClick={handleQuizClick}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-emerald-200/50 transition-all flex items-center justify-center gap-3 group transform hover:-translate-y-1"
              >
                <BookOpen className="w-6 h-6" />
                الاختبارات الإلكترونية
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={handleLessonsClick}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-blue-200/50 transition-all flex items-center justify-center gap-3 group transform hover:-translate-y-1"
              >
                <Video className="w-6 h-6" />
                الدروس التعليمية
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={handleContactClick}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-teal-200/50 transition-all flex items-center justify-center gap-3 group transform hover:-translate-y-1"
              >
                <MessageCircle className="w-6 h-6" />
                تواصل مع المعلم
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                  {user && (
                    <button 
                      onClick={() => onNavigate('PROFILE')}
                      className="flex-1 bg-white border-2 border-emerald-100 text-emerald-600 hover:bg-emerald-50 text-lg font-bold px-8 py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <User className="w-5 h-5" />
                      الملف الشخصي
                    </button>
                  )}

                  {!user && (
                    <button 
                      onClick={onLoginClick}
                      className="flex-1 bg-white border-2 border-emerald-100 text-emerald-600 hover:bg-emerald-50 text-lg font-bold px-8 py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Play className="w-5 h-5 fill-emerald-600 text-emerald-600" />
                      تسجيل الدخول
                    </button>
                  )}
              </div>
            </div>
      </div>
    </section>
  );
};

export default Hero;