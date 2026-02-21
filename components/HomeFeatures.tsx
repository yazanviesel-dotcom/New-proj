
import React from 'react';
import { ArrowRight, Brain, Book, FolderOpen, CheckCircle2, PlayCircle, DownloadCloud } from 'lucide-react';
import { AppView } from '../types';

interface HomeFeaturesProps {
  onNavigate: (view: AppView) => void;
}

interface FeatureSectionProps {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  secondaryIcon: React.ElementType;
  buttonText: string;
  onClick: () => void;
  theme: 'emerald' | 'violet' | 'sky';
  direction: 'ltr' | 'rtl'; // Layout direction relative to English (LTR) or Arabic (RTL)
  isLast?: boolean;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({ 
  title, 
  subtitle,
  description, 
  icon: MainIcon, 
  secondaryIcon: SecIcon,
  buttonText, 
  onClick, 
  theme,
  direction,
  isLast = false 
}) => {
  
  const themeStyles = {
    emerald: {
      gradient: "from-emerald-500/20 to-teal-500/20",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      bgIcon: "bg-emerald-500/10",
      button: "bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/20",
      glow: "bg-emerald-500/30",
      divider: "from-transparent via-emerald-500 to-transparent"
    },
    violet: {
      gradient: "from-violet-500/20 to-purple-500/20",
      border: "border-violet-500/20",
      text: "text-violet-400",
      bgIcon: "bg-violet-500/10",
      button: "bg-gradient-to-r from-violet-600 to-purple-600 shadow-violet-500/20",
      glow: "bg-violet-500/30",
      divider: "from-transparent via-violet-500 to-transparent"
    },
    sky: {
      gradient: "from-sky-500/20 to-blue-500/20",
      border: "border-sky-500/20",
      text: "text-sky-400",
      bgIcon: "bg-sky-500/10",
      button: "bg-gradient-to-r from-sky-600 to-blue-600 shadow-sky-500/20",
      glow: "bg-sky-500/30",
      divider: "from-transparent via-sky-500 to-transparent"
    }
  };

  const s = themeStyles[theme];

  const desktopFlexDirection = direction === 'rtl' ? 'md:flex-row' : 'md:flex-row-reverse';
  const desktopTextAlign = direction === 'rtl' ? 'md:text-right' : 'md:text-left';
  
  return (
    <div className="relative py-16 md:py-28 overflow-hidden group">
      <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-10">
        
        <div className={`flex flex-col items-center gap-10 md:gap-20 ${desktopFlexDirection}`}>
          
          {/* Visual Side */}
          <div className="w-full md:w-1/2 flex justify-center relative">
             {/* Animated Glow Blob */}
             <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-96 md:h-96 rounded-full blur-[60px] md:blur-[100px] opacity-40 animate-pulse ${s.glow}`}></div>
             
             {/* Glass Card */}
             <div className={`relative w-72 h-72 md:w-full md:max-w-md md:aspect-square rounded-[2.5rem] md:rounded-[3rem] border ${s.border} bg-gray-900/60 backdrop-blur-xl shadow-2xl flex items-center justify-center overflow-hidden group-hover:scale-[1.02] transition-transform duration-700`}>
                {/* Inner Grid Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                
                {/* Floating Icons */}
                <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className={`p-6 md:p-8 rounded-3xl ${s.bgIcon} border ${s.border} shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-sm transform rotate-3 group-hover:rotate-0 transition-all duration-500`}>
                        <MainIcon className={`w-20 h-20 md:w-32 md:h-32 ${s.text} drop-shadow-lg`} strokeWidth={1.5} />
                    </div>
                    <div className={`absolute -bottom-10 -right-10 md:-bottom-12 md:-right-12 p-4 md:p-5 rounded-2xl bg-gray-800/80 border ${s.border} shadow-xl backdrop-blur-md transform -rotate-6 group-hover:rotate-0 transition-all duration-700 delay-100`}>
                        <SecIcon className={`w-8 h-8 md:w-10 md:h-10 ${s.text}`} />
                    </div>
                </div>
             </div>
          </div>

          {/* Content Side */}
          <div className={`w-full md:w-1/2 text-center ${desktopTextAlign} space-y-6 md:space-y-8`}>
            <div className="space-y-3 md:space-y-4">
                <div className={`inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-gray-900/50 border ${s.border} ${s.text} text-xs md:text-sm font-bold shadow-sm backdrop-blur-md`}>
                    <SecIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span>{subtitle}</span>
                </div>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-xl">
                  {title}
                </h2>
            </div>
            
            <p className="text-base md:text-xl text-gray-300 leading-relaxed md:leading-loose font-medium opacity-90 max-w-xl mx-auto md:mx-0">
              {description}
            </p>
            
            <div className="pt-2 md:pt-4">
                <button 
                onClick={onClick}
                className={`w-full md:w-auto inline-flex justify-center items-center gap-3 ${s.button} text-white text-base md:text-lg font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 border-t border-white/10`}
                >
                {buttonText}
                <ArrowRight className={`w-5 h-5 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
                </button>
            </div>
          </div>

        </div>
      </div>

      {/* Luxurious Divider */}
      {!isLast && (
          <div className="absolute bottom-0 left-0 w-full flex justify-center items-center">
              <div className={`w-full h-px bg-gradient-to-r ${s.divider} opacity-30`}></div>
              <div className={`absolute w-3/4 h-1 bg-gradient-to-r ${s.divider} blur-sm opacity-50`}></div>
              <div className="absolute w-1/2 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_20px_rgba(16,185,129,0.8)] opacity-80"></div>
          </div>
      )}
    </div>
  );
};

const HomeFeatures: React.FC<HomeFeaturesProps> = ({ onNavigate }) => {
  return (
    <div className="bg-gray-950 relative z-10">
      
      {/* 1. Quizzes - Standard RTL */}
      <FeatureSection 
        theme="emerald"
        direction="rtl"
        title="اختبارات ذكية.. ومستوى جديد"
        subtitle="قيّم نفسك بذكاء"
        description="نظام اختبارات متطور لا يكتفي بتقييمك، بل يعلمك! بنك أسئلة ضخم يحاكي الامتحانات الوزارية بدقة، مع تصحيح فوري وتفسيرات ذكية لكل إجابة. حولنا المراجعة من عبء ثقيل إلى تحدٍ ممتع يضمن لك التفوق."
        icon={Brain}
        secondaryIcon={CheckCircle2}
        buttonText="ابدأ التحدي الآن"
        onClick={() => onNavigate('QUIZZES')}
      />

      {/* 2. Explanations - Alternating LTR */}
      <FeatureSection 
        theme="violet"
        direction="ltr"
        title="وداعاً للغموض في المناهج"
        subtitle="افهم بعمق"
        description="مكتبة شروحات متقنة تغوص في أعماق المواد لتفكك أصعب المفاهيم. من القواعد اللغوية الدقيقة إلى النصوص الأدبية العميقة، كل درس مصمم ليثبت المعلومة في ذهنك بأسلوب سلس، مبسط، وبإشراف نخبة المعلمين."
        icon={Book}
        secondaryIcon={PlayCircle}
        buttonText="استكشف الشروحات"
        onClick={() => onNavigate('LESSONS_EXPLANATIONS')}
        isLast={true}
      />

    </div>
  );
};

export default HomeFeatures;
