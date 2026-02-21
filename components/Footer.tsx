
import React, { useState } from 'react';
import { Facebook, Home, BookOpen, FileText, Monitor, MessageCircle, Share2, Copy, Check, X, Instagram, MoreHorizontal, Link } from 'lucide-react';
import { AppView } from '../types';
import Logo from './Logo';

interface FooterProps {
  onNavigate?: (view: AppView) => void;
}

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

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const websiteUrl = window.location.origin;
  const shareText = "منصة إتقان التعليمية - رفيقك نحو التفوق";

  const handleShareTelegram = () => {
      const url = `https://t.me/share/url?url=${encodeURIComponent(websiteUrl)}&text=${encodeURIComponent(shareText)}`;
      window.open(url, '_blank');
      setShowShareMenu(false);
  };

  const handleShareWhatsApp = () => {
      const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + websiteUrl)}`;
      window.open(url, '_blank');
      setShowShareMenu(false);
  };

  const handleShareFacebook = () => {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(websiteUrl)}`;
      window.open(url, '_blank');
      setShowShareMenu(false);
  };

  const handleCopyLink = () => {
      navigator.clipboard.writeText(websiteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const handleShareNative = async () => {
      if (navigator.share) {
          try {
              await navigator.share({
                  title: 'منصة إتقان',
                  text: shareText,
                  url: websiteUrl,
              });
              setShowShareMenu(false);
          } catch (error) {
              console.log('Error sharing', error);
          }
      } else {
          handleCopyLink();
      }
  };

  return (
    <footer className="relative bg-gray-950 border-t border-white/5 py-4 md:py-6">
        <div className="w-full px-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
            
            {/* Left: Brand */}
            <div className="flex items-center gap-3 shrink-0">
                 <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-900 rounded-xl flex items-center justify-center border border-emerald-500/30 overflow-hidden shadow-md shadow-emerald-900/20">
                    <Logo className="w-full h-full p-1" />
                 </div>
                 <div className="text-right">
                    <span className="text-lg font-bold text-white tracking-tight block leading-none">إتقان</span>
                    <span className="text-[10px] text-gray-500">منصة تعليمية</span>
                 </div>
            </div>

            {/* Center: Links (Horizontal on Desktop) */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                <button onClick={() => onNavigate && onNavigate('HOME')} className="text-xs font-bold text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                    <Home className="w-3 h-3" /> الرئيسية
                </button>
                <button onClick={() => onNavigate && onNavigate('QUIZZES')} className="text-xs font-bold text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3" /> الاختبارات
                </button>
                <button onClick={() => onNavigate && onNavigate('LESSONS')} className="text-xs font-bold text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                    <FileText className="w-3 h-3" /> الملفات
                </button>
                <button onClick={() => onNavigate && onNavigate('LESSONS_EXPLANATIONS')} className="text-xs font-bold text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                    <Monitor className="w-3 h-3" /> الشروحات
                </button>
                <button onClick={() => onNavigate && onNavigate('CONTACT_TEACHER')} className="text-xs font-bold text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                    <MessageCircle className="w-3 h-3" /> تواصل معنا
                </button>
            </div>

            {/* Right: Socials & Share */}
            <div className="flex items-center gap-3 shrink-0">
                <div className="h-4 w-px bg-gray-800 mx-1 hidden md:block"></div>
                
                <a href="https://www.facebook.com/yazanabokaheal2?locale=ms_MY" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#1877F2] transition-colors">
                    <Facebook className="w-4 h-4" />
                </a>
                <a href="https://wa.me/972568401548" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#25D366] transition-colors">
                    <WhatsAppIcon className="w-4 h-4" />
                </a>
                
                <button 
                    onClick={() => setShowShareMenu(true)}
                    className="flex items-center gap-2 bg-emerald-600/10 text-emerald-500 px-3 py-1.5 rounded-lg hover:bg-emerald-600/20 transition-colors text-[10px] font-bold border border-emerald-500/20 ml-2"
                >
                    <Share2 className="w-3 h-3" />
                    مشاركة
                </button>
            </div>
        </div>

        {/* Tiny Copyright Line */}
        <div className="text-center mt-4 border-t border-gray-900 pt-2">
            <p className="text-[9px] text-gray-600 font-mono dir-ltr">
                © {new Date().getFullYear()} Etqan. By Mr. Yazan Abu Kahil
            </p>
        </div>

        {/* Share Menu Modal */}
        {showShareMenu && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setShowShareMenu(false)}>
                <div 
                    className="w-full max-w-xs bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-4 flex flex-col gap-4 animate-fade-in-up relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                        <span className="text-white font-bold text-sm flex items-center gap-2">
                            <Share2 className="w-4 h-4 text-emerald-500" />
                            مشاركة المنصة
                        </span>
                        <button onClick={() => setShowShareMenu(false)} className="text-gray-500 hover:text-white transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        <button onClick={handleShareWhatsApp} className="flex flex-col items-center gap-1 group">
                            <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366] transition-all border border-[#25D366]/20">
                                <WhatsAppIcon className="w-5 h-5 text-[#25D366] group-hover:text-white" />
                            </div>
                            <span className="text-[9px] text-gray-400">واتساب</span>
                        </button>
                        <button onClick={handleShareTelegram} className="flex flex-col items-center gap-1 group">
                            <div className="w-10 h-10 rounded-xl bg-[#0088cc]/10 flex items-center justify-center group-hover:bg-[#0088cc] transition-all border border-[#0088cc]/20">
                                <TelegramIcon className="w-5 h-5 text-[#0088cc] group-hover:text-white" />
                            </div>
                            <span className="text-[9px] text-gray-400">تلجرام</span>
                        </button>
                        <button onClick={handleShareFacebook} className="flex flex-col items-center gap-1 group">
                            <div className="w-10 h-10 rounded-xl bg-[#1877F2]/10 flex items-center justify-center group-hover:bg-[#1877F2] transition-all border border-[#1877F2]/20">
                                <Facebook className="w-5 h-5 text-[#1877F2] group-hover:text-white" />
                            </div>
                            <span className="text-[9px] text-gray-400">فيسبوك</span>
                        </button>
                        <button onClick={handleShareNative} className="flex flex-col items-center gap-1 group">
                            <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-all border border-gray-700">
                                <MoreHorizontal className="w-5 h-5 text-gray-300 group-hover:text-white" />
                            </div>
                            <span className="text-[9px] text-gray-400">المزيد</span>
                        </button>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-2 flex items-center border border-gray-700">
                        <div className="flex-1 px-2 text-[10px] text-gray-400 font-mono truncate dir-ltr">{websiteUrl}</div>
                        <button 
                            onClick={handleCopyLink}
                            className={`p-1.5 rounded-md transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </footer>
  );
}

export default Footer;
