import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Clock, CheckCircle2, Crown, Zap, BookOpen, GraduationCap, Video, Calendar, Sparkles, MessageCircle, Lock, Monitor, FileText, Home, Headphones, Book, Backpack, University, Library, RotateCcw, CreditCard, Wallet, Briefcase, ClipboardList } from 'lucide-react';

interface ServicesProps {
  onBack: () => void;
}

const Services: React.FC<ServicesProps> = ({ onBack }) => {
  const handleOrder = () => {
      const message = 'مرحباً، أرغب بالاشتراك في باقة التفوق المدرسية وتفعيل حسابي.';
      window.open(`https://wa.me/972568401548?text=${encodeURIComponent(message)}`, '_blank');
  };

  const content = {
      title: 'باقة التفوق',
      subtitle: 'المدرسية',
      description: 'استثمر في مستقبلك الدراسي واحصل على مفتاح الوصول الكامل لجميع ميزات منصة إتقان للمرحلة المدرسية.',
      color: 'amber',
      gradient: 'from-amber-500 to-orange-600',
      border: 'border-amber-500/30',
      shadow: 'shadow-amber-500/20',
      features: [
          { icon: CheckCircle2, text: 'فتح جميع الاختبارات', sub: 'وصول غير محدود لكل الاختبارات' },
          { icon: Book, text: 'فتح جميع الشروحات', sub: 'شروحات مميزة ومكثفة للمنهاج' }
      ]
  };

  return (
    <div className="min-h-screen bg-gray-950 animate-fade-in flex flex-col transition-colors duration-300 text-gray-100">
      
      {/* Header & Hero Wrapper */}
      <div className="relative overflow-hidden pt-28 pb-8">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-950/80 to-gray-950 pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 relative z-30 mb-6">
            <div className="flex items-center justify-start gap-4">
                <button onClick={onBack} className="p-2 bg-gray-900/50 hover:bg-gray-800 rounded-xl transition-all text-gray-300 hover:text-white border border-white/10 shadow-lg backdrop-blur-sm group">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <div>
                    <h1 className="text-xl font-black text-white leading-none mb-1">تفاصيل الاشتراك</h1>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                        <span onClick={onBack} className="hover:text-white cursor-pointer transition-colors flex items-center gap-1"><Home className="w-3.5 h-3.5" /> الرئيسية</span>
                        <span className="text-gray-600">/</span>
                        <span className="text-white flex items-center gap-1"><Backpack className="w-3.5 h-3.5" /> باقة المدارس</span>
                    </div>
                </div>
            </div>
        </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
              <div className={`inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-1.5 rounded-full text-xs font-bold mb-4 shadow-lg animate-fade-in-up`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>العرض الأقوى للطلاب</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight leading-tight">
                  باقة التفوق <span className={`text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600`}>المدرسية</span>
              </h1>
              <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                  {content.description}
              </p>
          </div>
      </div>

      {/* Main Pricing Card */}
      <div className="max-w-md mx-auto px-4 relative z-10 w-full -mt-4 mb-20">
          <div className={`bg-gray-900 rounded-[2.5rem] p-1 border-2 ${content.border} ${content.shadow} relative overflow-hidden`}>
              <div className={`bg-gray-900/90 backdrop-blur-xl rounded-[2.3rem] p-5 md:p-8 relative h-full flex flex-col`}>
                  
                  <div className="text-center mb-6">
                      <div className={`w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-2xl`}>
                          <Crown className="w-6 h-6 text-white fill-white" />
                      </div>
                      <h2 className="text-lg font-black text-white mb-2">اشتراك المدارس (Premium)</h2>
                  </div>

                  <div className="space-y-2 mb-8 flex-1">
                      {content.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-gray-800/50 p-2.5 rounded-xl border border-gray-700/50">
                              <div className={`bg-amber-500/20 p-1.5 rounded-lg text-amber-400`}>
                                  <feature.icon className="w-4 h-4" />
                              </div>
                              <div className="text-right">
                                  <h4 className="font-bold text-white text-xs">{feature.text}</h4>
                                  {feature.sub && <p className="text-gray-400 text-[9px]">{feature.sub}</p>}
                              </div>
                          </div>
                      ))}
                  </div>

                  <button 
                    onClick={handleOrder}
                    className={`w-full py-3 rounded-xl font-black text-sm text-white shadow-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 active:scale-95 bg-gradient-to-r from-amber-500 to-orange-600 mb-3`}
                  >
                      <MessageCircle className="w-4 h-4" />
                      اطلب التفعيل عبر واتساب
                  </button>
                  
                  <div className="pt-2 border-t border-gray-800 text-center">
                        <p className="text-[9px] text-gray-400 font-bold mb-2 flex items-center justify-center gap-1">
                            <CreditCard className="w-2.5 h-2.5" />
                            متوفر الدفع عبر:
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 text-[9px] font-bold text-gray-300">
                            <div className="bg-gray-800 px-2 py-1 rounded-lg border border-gray-700 flex items-center gap-1">PalPay</div>
                            <div className="bg-gray-800 px-2 py-1 rounded-lg border border-gray-700 flex items-center gap-1">Reflect</div>
                            <div className="bg-gray-800 px-2 py-1 rounded-lg border border-gray-700 flex items-center gap-1">Jawwal Pay</div>
                        </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Services;