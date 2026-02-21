
import React from 'react';
import { UserPlus, BookOpen, CheckSquare, PieChart } from 'lucide-react';

const STEPS = [
  { 
    icon: UserPlus, 
    title: "سجّل دخول", 
    desc: "أنشئ حسابك في ثوانٍ.",
    color: "text-blue-400",
    bg: "bg-blue-500/10"
  },
  { 
    icon: BookOpen, 
    title: "اختار المادة", 
    desc: "حدد الصف والمادة المطلوبة.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10"
  },
  { 
    icon: CheckSquare, 
    title: "حل الأسئلة", 
    desc: "جاوب على الاختبار التفاعلي.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10"
  },
  { 
    icon: PieChart, 
    title: "شوف نتيجتك", 
    desc: "تقييم فوري لمستواك.",
    color: "text-purple-400",
    bg: "bg-purple-500/10"
  }
];

const HowWeHelp: React.FC = () => {
  return (
    <section className="py-20 bg-transparent border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4 drop-shadow-lg">كيف نساعدك؟</h2>
                <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
                {/* Connector Line (Desktop only) */}
                <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10 transform -translate-y-1/2 border-t border-dashed border-white/10"></div>

                {STEPS.map((step, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-lg p-6 rounded-[2rem] shadow-lg border border-white/10 text-center relative group hover:-translate-y-2 transition-all duration-300 hover:bg-white/10 flex flex-col items-center">
                      {/* Step Number Badge */}
                      <div className="absolute -top-3 right-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-black text-sm shadow-lg z-10 border border-white/20 ring-2 ring-black/50">
                        {index + 1}
                      </div>

                      <div className="w-24 h-24 bg-black/30 rounded-full flex items-center justify-center mb-4 border border-white/10 group-hover:border-emerald-500/50 transition-colors relative z-0 shadow-inner">
                          <div className={`w-16 h-16 ${step.bg} ${step.color} rounded-full flex items-center justify-center shadow-[0_0_15px_inset_rgba(0,0,0,0.5)]`}>
                              <step.icon className="w-8 h-8" />
                          </div>
                      </div>
                      <h3 className="font-black text-lg mb-2 text-white group-hover:text-emerald-300 transition-colors">{step.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed font-medium">{step.desc}</p>
                  </div>
                ))}
            </div>
        </div>
    </section>
  );
};

export default HowWeHelp;
