
import React from 'react';
import { ArrowRight, Star, CheckCircle2, Target, Zap, FileText, Smartphone, Brain, Home, Info } from 'lucide-react';
import StarsBackground from './StarsBackground';

interface PlatformDefinitionProps {
  onBack: () => void;
}

const PlatformDefinition: React.FC<PlatformDefinitionProps> = ({ onBack }) => {
  const features = [
    {
        icon: Brain,
        title: "اختبارات ذكية",
        desc: "بنك أسئلة ضخم يغطي كافة جوانب المنهاج، مع تصحيح فوري وتفسير للإجابات لضمان الفهم العميق."
    },
    {
        icon: Smartphone,
        title: "متاح 24/7",
        desc: "ادرس في أي وقت ومن أي مكان، سواء كنت في البيت أو المواصلات، عبر هاتفك المحمول بكل سهولة."
    },
    {
        icon: Zap,
        title: "نظام تحفيز (XP)",
        desc: "حوّل دراستك للعبة! اجمع نقاط الخبرة (XP) مع كل اختبار تجتازه ونافس زملاءك في لوحة الشرف."
    },
    {
        icon: FileText,
        title: "ملفات وشروحات",
        desc: "مكتبة غنية بأوراق العمل والملخصات والدوسيات لتكون مرجعك الشامل للمراجعة قبل الامتحانات."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden text-gray-100">
      
      {/* Animated Stars Background */}
      <div className="absolute inset-0 z-0">
        <StarsBackground />
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/90 via-gray-900/60 to-gray-950 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Integrated Header - Compact */}
        <div className="max-w-7xl mx-auto px-4 pt-2 pb-2 relative z-30">
            <div className="flex items-center gap-3">
                <button 
                onClick={onBack}
                className="p-2 bg-gray-900/50 hover:bg-gray-800 rounded-xl transition-all text-gray-400 hover:text-white border border-white/10 shadow-lg backdrop-blur-sm group"
                >
                <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                    <h1 className="text-lg font-black text-white tracking-tight mb-0.5">تعريف المنصة</h1>
                    <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-medium text-gray-500">
                        <span onClick={onBack} className="hover:text-emerald-400 cursor-pointer transition-colors flex items-center gap-1">
                        <Home className="w-3 h-3" /> الرئيسية
                        </span>
                        <span className="text-gray-700">/</span>
                        <span className="text-emerald-500 flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            ما هي إتقان؟
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12 pb-20">
            
            {/* Hero Section */}
            <div className="text-center mb-16 animate-fade-in-up">
                <div className="inline-flex items-center justify-center p-5 bg-emerald-500/10 backdrop-blur-xl rounded-full mb-8 border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.3)] relative group">
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                    <Star className="w-12 h-12 text-emerald-400 fill-emerald-400 animate-pulse relative z-10" />
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
                    ما هي منصة <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">إتقان</span>؟
                </h1>
                <p className="text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto font-medium drop-shadow-md">
                    منصة إتقان هي بيئة تعليمية إلكترونية فلسطينية متكاملة، صُممت خصيصاً لكسر الروتين الدراسي التقليدي وتحويل عملية التعلم إلى تجربة تفاعلية ممتعة ومثمرة.
                </p>
            </div>

            {/* Why Etqan? Card - Glassmorphism */}
            <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-white/10 mb-16 relative overflow-hidden group hover:bg-white/10 transition-all duration-500">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] -ml-16 -mb-16 pointer-events-none"></div>
                
                <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-3 relative z-10">
                    <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30">
                        <Target className="w-8 h-8 text-blue-400" />
                    </div>
                    فكرة المنصة
                </h2>
                
                <div className="space-y-6 text-gray-200 font-medium leading-loose text-lg relative z-10">
                    <p>
                        جاءت فكرة "إتقان" من حاجة الطالب الفلسطيني لمصدر موثوق وشامل للمراجعة والتدريب. بدلاً من الاعتماد فقط على الكتاب المدرسي، نوفر لك مكتبة متجددة من الاختبارات الإلكترونية التي تحاكي نمط الامتحانات الوزارية والنهائية.
                    </p>
                    <p>
                        نحن لا نقدم مجرد أسئلة، بل نقدم <span className="text-white font-bold border-b-2 border-emerald-500 shadow-[0_4px_20px_-5px_rgba(16,185,129,0.5)]">منهجية للمراجعة الذكية</span>. من خلال المنصة، يمكنك معرفة نقاط ضعفك فوراً، والعمل على تقويتها من خلال الشروحات والملفات المرفقة.
                    </p>
                </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                {features.map((feature, idx) => (
                    <div key={idx} className="bg-gray-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex flex-col gap-4 hover:border-emerald-500/40 hover:bg-gray-900/60 transition-all group hover:-translate-y-2 shadow-lg">
                        <div className="bg-gray-800/50 p-4 rounded-2xl w-fit group-hover:bg-emerald-900/30 transition-colors border border-white/5 group-hover:border-emerald-500/20">
                            <feature.icon className="w-8 h-8 text-gray-300 group-hover:text-emerald-400 transition-colors" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">{feature.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300">
                                {feature.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Target Audience - Glassmorphism */}
            <div className="bg-gradient-to-br from-emerald-900/40 to-gray-900/40 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 border border-emerald-500/20 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <h2 className="text-3xl font-black text-white mb-8 relative z-10">لمن هذه المنصة؟</h2>
                <div className="flex flex-col gap-4 relative z-10">
                    <div className="bg-gray-950/40 p-5 rounded-2xl flex items-center gap-4 border border-white/10 hover:border-emerald-500/30 transition-colors">
                        <div className="bg-emerald-500/20 p-2 rounded-full shrink-0">
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        </div>
                        <span className="text-gray-200 font-bold text-right text-lg">طلاب المدارس من الصف الخامس حتى التوجيهي.</span>
                    </div>
                    <div className="bg-gray-950/40 p-5 rounded-2xl flex items-center gap-4 border border-white/10 hover:border-emerald-500/30 transition-colors">
                        <div className="bg-emerald-500/20 p-2 rounded-full shrink-0">
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        </div>
                        <span className="text-gray-200 font-bold text-right text-lg">طلاب الجامعات.</span>
                    </div>
                    <div className="bg-gray-950/40 p-5 rounded-2xl flex items-center gap-4 border border-white/10 hover:border-emerald-500/30 transition-colors">
                        <div className="bg-emerald-500/20 p-2 rounded-full shrink-0">
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        </div>
                        <span className="text-gray-200 font-bold text-right text-lg">كل طالب يطمح للتميز والحصول على العلامة الكاملة.</span>
                    </div>
                </div>
            </div>

            {/* Closing */}
            <div className="mt-16 text-center">
                <p className="text-gray-400 text-sm font-medium bg-gray-900/50 inline-block px-6 py-3 rounded-full border border-white/5 backdrop-blur-sm">
                    بإشراف وتطوير <span className="text-emerald-400 font-black">الأستاذ يزن أبو كحيل</span>
                </p>
            </div>

        </div>
      </div>
    </div>
  );
};

export default PlatformDefinition;
