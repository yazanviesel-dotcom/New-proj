
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Star, ChevronLeft, BookOpen, User, FileText, MessageCircle, AlertCircle, X, Monitor, LogIn, Book, Share2, Copy, Check, Facebook, Instagram, MoreHorizontal, Sparkles, Briefcase, Users, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AppView } from '../types';

interface HeroProps {
  onStartQuiz: () => void;
  onLoginClick: () => void;
  onNavigate: (view: AppView) => void;
}

// Custom Icons for Share Menu
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.694 0zM4.98 14.41c6.009-2.607 10.015-4.335 12.019-5.168 2.656-.867 3.084-.386 2.84 1.712-.366 3.157-1.408 8.873-1.93 10.364-.22.628-.648.676-1.308.244-1.68-1.044-3.896-2.532-4.812-3.132-.956-.628-1.144-1.24-.208-2.212 2.168-2.248 4.068-4.064 3.724-4.376-.428-.388-2.648.82-7.008 3.776-.784.532-1.496.524-2.192.316-1.04-.312-2.052-.648-2.828-.904-1.056-.348-1.06-1.056.172-1.576z"/>
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/>
  </svg>
);

const Hero: React.FC<HeroProps> = ({ onStartQuiz, onLoginClick, onNavigate }) => {
  const { user } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [showFollowMenu, setShowFollowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const websiteUrl = window.location.origin;

  // Prevent background scrolling when Follow Menu is open
  useEffect(() => {
    if (showFollowMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showFollowMenu]);

  const triggerAuthToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleQuizClick = () => {
    if (user) {
      onNavigate('QUIZZES');
    } else {
      triggerAuthToast();
    }
  };

  const handleExplanationsClick = () => {
    onNavigate('LESSONS_EXPLANATIONS');
  };

  const handleServicesClick = () => {
    onNavigate('SERVICES');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(websiteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center bg-transparent overflow-hidden animate-fade-in transition-colors duration-300 pt-24 md:pt-32">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none px-4">
           <div className="bg-red-900/90 border border-red-800 shadow-xl rounded-xl p-4 flex items-center gap-3 relative w-full max-w-md animate-fade-in-up pointer-events-auto backdrop-blur-md">
              <div className="bg-red-800 p-2 rounded-full shrink-0">
                <AlertCircle className="w-6 h-6 text-red-200" />
              </div>
              <div className="flex-1">
                 <h4 className="font-bold text-white text-sm">تسجيل الدخول مطلوب</h4>
                 <p className="text-gray-300 text-xs mt-1">عذراً، يجب عليك تسجيل الدخول أولاً للوصول لهذه الميزة.</p>
              </div>
              <button 
                onClick={() => setShowToast(false)} 
                className="absolute top-2 left-2 text-gray-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <button 
                onClick={() => { setShowToast(false); onLoginClick(); }}
                className="mr-auto bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors shrink-0"
              >
                دخول
              </button>
           </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col items-center text-center">
          
            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.2] lg:leading-[1.15] mb-6 drop-shadow-lg">
              رحلتك نحو <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 inline-block relative pb-2">
                التفوق الدراسي
                <svg className="absolute w-full h-3 -bottom-1 right-0 text-emerald-900/50 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                   <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
              <br /> تبدأ هنا
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-10">
              محتوى تعليمي شامل للطلاب بإدارة وإشراف <span className="text-emerald-400 font-black text-2xl px-1 relative inline-block">الأستاذ يزن أبو كحيل</span>.
            </p>

            {/* Buttons */}
            <div className="flex flex-col w-full max-w-md gap-3 justify-center">
              {/* Quiz Button */}
              <button 
                onClick={handleQuizClick}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-base font-bold py-3 px-5 rounded-xl shadow-lg hover:shadow-emerald-900/50 transition-all flex items-center justify-between group transform hover:-translate-y-1 border border-emerald-400/20"
              >
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-1.5 rounded-lg">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <span>الاختبارات الإلكترونية</span>
                </div>
                <ChevronLeft className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
              </button>

              {/* Explanations Button */}
              <button 
                onClick={handleExplanationsClick}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-base font-bold py-3 px-5 rounded-xl shadow-lg hover:shadow-emerald-900/50 transition-all flex items-center justify-between group transform hover:-translate-y-1 border border-emerald-400/20"
              >
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-1.5 rounded-lg">
                        <Book className="w-5 h-5 text-white" />
                    </div>
                    <span>شروحات المواد</span>
                </div>
                <ChevronLeft className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
              </button>

              {/* Services Button */}
              <button 
                onClick={handleServicesClick}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-base font-bold py-3 px-5 rounded-xl shadow-lg hover:shadow-emerald-900/50 transition-all flex items-center justify-between group transform hover:-translate-y-1 border border-emerald-400/20"
              >
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-1.5 rounded-lg">
                        <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <span>خدمات</span>
                </div>
                <ChevronLeft className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
              </button>

              <div className="w-full mt-2">
                  {user ? (
                    <button 
                      onClick={() => onNavigate('PROFILE')}
                      className="w-full bg-gray-900 border-2 border-emerald-900 text-emerald-400 hover:bg-emerald-900/20 text-base font-bold py-3 px-5 rounded-xl transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
                    >
                      <User className="w-5 h-5" />
                      الملف الشخصي
                    </button>
                  ) : (
                    <button 
                      onClick={onLoginClick}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-base font-bold py-3 px-5 rounded-xl shadow-lg hover:shadow-orange-500/40 transition-all flex items-center justify-between group transform hover:-translate-y-1 border border-orange-400/20"
                    >
                      <div className="flex items-center gap-4">
                          <div className="bg-white/20 p-1.5 rounded-lg">
                              <LogIn className="w-5 h-5 text-white" />
                          </div>
                          <span>تسجيل الدخول الآن</span>
                      </div>
                      <ChevronLeft className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
                    </button>
                  )}
              </div>

              {/* Follow Button (Replaces Share Button) */}
              <div className="relative mt-2 flex justify-center z-50">
                  <button 
                      onClick={() => setShowFollowMenu(true)}
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-bold bg-white/5 px-6 py-3 rounded-full border border-white/10 hover:bg-white/10 hover:border-emerald-500/30 group shadow-lg backdrop-blur-sm"
                  >
                      <div className="p-1.5 bg-emerald-500/10 rounded-full group-hover:bg-emerald-500/20 transition-colors">
                        <Users className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
                      </div>
                      <span>تابعنا على صفحاتنا</span>
                  </button>
              </div>

              {/* Follow Menu Modal - Rendered via Portal to be on top of everything */}
              {showFollowMenu && createPortal(
                  <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in" onClick={() => setShowFollowMenu(false)}>
                      <div 
                          className="bg-gray-950 border-2 border-gray-800 rounded-[2.5rem] shadow-2xl p-8 w-full max-w-md flex flex-col gap-8 animate-fade-in-up relative overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                      >
                          {/* Background Glow */}
                          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-900/20 rounded-full blur-[80px] pointer-events-none"></div>

                          {/* Header */}
                          <div className="flex items-center justify-between relative z-10">
                              <div>
                                <span className="text-2xl font-black text-white flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                        <Users className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    تابعنا على المنصات
                                </span>
                                <p className="text-gray-400 text-sm mt-2 font-bold pr-1">كن جزءاً من مجتمعنا التعليمي المتنامي</p>
                              </div>
                              <button onClick={() => setShowFollowMenu(false)} className="self-start p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors border border-gray-700">
                                  <X className="w-5 h-5" />
                              </button>
                          </div>

                          {/* Social Grid */}
                          <div className="grid grid-cols-3 gap-4 relative z-10">
                              {/* Facebook */}
                              <a href="https://www.facebook.com/yazanabokaheal2?locale=ms_MY" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-3 group">
                                  <div className="w-20 h-20 rounded-3xl bg-[#1877F2]/10 flex items-center justify-center group-hover:bg-[#1877F2] transition-all shadow-lg group-hover:shadow-[#1877F2]/40 group-hover:-translate-y-1 border border-[#1877F2]/20">
                                      <Facebook className="w-10 h-10 text-[#1877F2] group-hover:text-white" />
                                  </div>
                                  <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">فيسبوك</span>
                              </a>

                              {/* Instagram */}
                              <a href="#" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-3 group">
                                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-yellow-400/10 via-red-500/10 to-purple-500/10 flex items-center justify-center group-hover:from-yellow-400 group-hover:via-red-500 group-hover:to-purple-500 transition-all shadow-lg group-hover:shadow-pink-500/40 group-hover:-translate-y-1 border border-pink-500/20">
                                      <Instagram className="w-10 h-10 text-pink-500 group-hover:text-white" />
                                  </div>
                                  <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">انستجرام</span>
                              </a>

                              {/* TikTok */}
                              <a href="#" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-3 group">
                                  <div className="w-20 h-20 rounded-3xl bg-[#00f2ea]/10 flex items-center justify-center group-hover:bg-black transition-all shadow-lg group-hover:shadow-[#00f2ea]/40 group-hover:-translate-y-1 border border-[#00f2ea]/20 relative overflow-hidden">
                                       <div className="absolute inset-0 bg-gradient-to-br from-[#00f2ea] to-[#ff0050] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                      <TikTokIcon className="w-10 h-10 text-white relative z-10" />
                                  </div>
                                  <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">تيك توك</span>
                              </a>
                          </div>

                          {/* Copy Link */}
                          <div className="bg-gray-800 rounded-2xl p-2 pl-2 pr-4 flex items-center border border-gray-700/50 relative z-10">
                              <div className="flex-1 text-xs text-gray-400 font-mono truncate dir-ltr opacity-70 tracking-wider">{websiteUrl}</div>
                              <button 
                                  onClick={handleCopyLink}
                                  className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg shrink-0 ${copied ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                              >
                                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                  {copied ? 'تم النسخ' : 'نسخ الرابط'}
                              </button>
                          </div>
                      </div>
                  </div>,
                  document.body
              )}

            </div>
      </div>
    </section>
  );
};

export default Hero;
