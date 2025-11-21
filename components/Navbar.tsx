
import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn, LogOut, PlusCircle, User, UserCircle, Briefcase, Info, Video, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AppView } from '../types';

interface NavbarProps {
  onLoginClick: () => void;
  onNavigate: (view: AppView) => void;
  onLogoutClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onNavigate, onLogoutClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (view: AppView) => {
    onNavigate(view);
    setIsOpen(false);
  };

  return (
    <nav 
      className={`w-full z-50 sticky top-0 transition-all duration-500 ${
        isScrolled 
          ? 'bg-emerald-700/95 backdrop-blur-md shadow-lg' 
          : 'bg-emerald-600 shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNav('HOME')}>
            <div className="p-1 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
                <img 
                    src="https://lh3.googleusercontent.com/d/13x8Gorb7y4H2qcQ1LVJtHY9-RoUhxg2z" 
                    alt="شعار منصة إتقان" 
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/30 shadow-sm"
                />
            </div>
            <span className="text-2xl font-black text-white tracking-tight drop-shadow-sm">إتقان</span>
          </div>

          {/* Desktop Menu - Centered & Stylized */}
          <div className="hidden md:flex items-center justify-center flex-1 px-8">
             <div className="flex items-center gap-1 bg-black/10 px-2 py-1.5 rounded-full border border-white/10 backdrop-blur-sm shadow-inner">
                <button 
                    onClick={() => handleNav('HOME')} 
                    className="px-6 py-2 text-white font-bold rounded-full hover:bg-white/20 transition-all"
                >
                    الرئيسية
                </button>
                <div className="w-px h-5 bg-white/20 mx-1"></div>
                <button 
                    onClick={() => handleNav('LESSONS')} 
                    className="px-6 py-2 text-white font-bold rounded-full hover:bg-white/20 transition-all flex items-center gap-2"
                >
                    <Video className="w-4 h-4" />
                    الدروس
                </button>
             </div>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <button 
                  onClick={() => handleNav('PROFILE')}
                  className="flex items-center gap-2 text-white hover:bg-white/15 px-4 py-2.5 rounded-full transition-all font-bold"
                >
                  <UserCircle className="w-5 h-5" />
                  <span>الملف الشخصي</span>
                </button>

                <div className="flex items-center gap-2 text-white bg-white/10 px-3 py-1.5 rounded-full border border-white/10 mr-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-bold">{user.displayName}</span>
                  {user.role === 'teacher' && <span className="text-xs bg-emerald-400 text-emerald-900 px-2 py-0.5 rounded-full">معلم</span>}
                </div>

                {user.role === 'teacher' && (
                  <button
                    onClick={() => handleNav('TEACHER_DASHBOARD')}
                    className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg border border-blue-400/50"
                    title="إنشاء اختبار"
                  >
                    <PlusCircle className="w-5 h-5" />
                  </button>
                )}

                <button 
                  onClick={onLogoutClick}
                  className="bg-red-500/80 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-600 transition-all border border-red-400/30"
                  title="خروج"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button 
                onClick={onLoginClick}
                className="bg-white text-emerald-700 px-6 py-2.5 rounded-full font-bold hover:bg-emerald-50 transition-all shadow-lg flex items-center gap-2 transform hover:scale-105"
              >
                <LogIn className="w-4 h-4" />
                تسجيل الدخول
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-emerald-100 p-2 transition-colors">
              {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full z-50 animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {user && (
               <div className="flex items-center gap-3 mb-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center text-emerald-800 font-bold text-lg">
                    {user.displayName.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{user.displayName}</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
               </div>
            )}
            
            <button onClick={() => handleNav('HOME')} className="block w-full text-right px-4 py-3 font-bold text-gray-700 hover:bg-emerald-50 rounded-xl transition-colors">الرئيسية</button>
            <button onClick={() => handleNav('LESSONS')} className="block w-full text-right px-4 py-3 font-bold text-gray-700 hover:bg-emerald-50 rounded-xl transition-colors flex items-center gap-2">
              <Video className="w-5 h-5 text-emerald-600" /> الدروس التعليمية
            </button>
            
            <button onClick={() => handleNav('CONTACT_TEACHER')} className="block w-full text-right px-4 py-3 font-bold text-gray-700 hover:bg-emerald-50 rounded-xl transition-colors flex items-center gap-2">
               <MessageCircle className="w-5 h-5 text-emerald-600" /> تواصل مع المعلم
            </button>
            <button onClick={() => handleNav('ABOUT_PLATFORM')} className="block w-full text-right px-4 py-3 font-bold text-gray-700 hover:bg-emerald-50 rounded-xl transition-colors flex items-center gap-2">
               <Info className="w-5 h-5 text-emerald-600" /> عن المنصة
            </button>
            <button onClick={() => handleNav('SERVICES')} className="block w-full text-right px-4 py-3 font-bold text-gray-700 hover:bg-emerald-50 rounded-xl transition-colors flex items-center gap-2">
               <Briefcase className="w-5 h-5 text-emerald-600" /> خدمات
            </button>
            
            {user && (
              <button onClick={() => handleNav('PROFILE')} className="block w-full text-right px-4 py-3 font-bold text-gray-700 hover:bg-emerald-50 rounded-xl transition-colors">
                الملف الشخصي
              </button>
            )}

            <div className="border-t border-gray-100 my-2 pt-2"></div>

            {user ? (
              <div className="space-y-3 mt-2">
                {user.role === 'teacher' && (
                   <button 
                    onClick={() => handleNav('TEACHER_DASHBOARD')}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-md flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-5 h-5" />
                    إنشاء اختبار جديد
                  </button>
                )}
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    onLogoutClick();
                  }}
                  className="w-full bg-red-50 text-red-600 border border-red-100 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  تسجيل خروج
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setIsOpen(false);
                  onLoginClick();
                }}
                className="w-full mt-2 bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-md flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                تسجيل الدخول
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
