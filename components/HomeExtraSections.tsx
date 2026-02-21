
import React, { useState } from 'react';
import { Map, Target, Trophy, Zap, ShieldCheck, HelpCircle, ChevronDown, Rocket, Brain, Coffee } from 'lucide-react';

const GreenDivider = () => (
  <div className="relative w-full h-16 flex items-center justify-center my-8 overflow-hidden">
    <div className="absolute w-full h-px bg-gray-800/50"></div>
    <div className="absolute w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_20px_rgba(16,185,129,1)]"></div>
    <div className="relative bg-gray-950 p-2 rounded-full border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
    </div>
  </div>
);

const RoadmapSection = () => {
  const steps = [
    { icon: Map, title: 'حدد هدفك', desc: 'اختر مادتك والصف الدراسي لتبدأ الرحلة.', color: 'text-blue-400', bg: 'bg-blue-900/20' },
    { icon: Brain, title: 'تدرب بذكاء', desc: 'حل اختبارات تفاعلية تكشف نقاط ضعفك.', color: 'text-purple-400', bg: 'bg-purple-900/20' },
    { icon: Zap, title: 'طور مستواك', desc: 'راجع الشروحات والملفات لتقوية الأساسيات.', color: 'text-yellow-400', bg: 'bg-yellow-900/20' },
    { icon: Trophy, title: 'احصد التفوق', desc: 'نافس زملاءك واصل للقمة في لوحة الشرف.', color: 'text-emerald-400', bg: 'bg-emerald-900/20' },
  ];

  return (
    <div className="py-12 px-4 relative">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-white mb-3">رحلة التفوق</h2>
        <p className="text-gray-400 text-sm">خطوات بسيطة تفصلك عن القمة</p>
      </div>
      
      <div className="relative max-w-2xl mx-auto">
        {/* Vertical Line */}
        <div className="absolute right-8 md:right-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500/10 via-emerald-500 to-emerald-500/10 rounded-full"></div>

        <div className="space-y-12">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex items-center gap-6 group">
              {/* Icon Bubble */}
              <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border-4 border-gray-950 shadow-xl ${step.bg} transition-transform group-hover:scale-110 duration-300`}>
                <step.icon className={`w-8 h-8 ${step.color}`} />
              </div>
              
              {/* Content Card */}
              <div className="flex-1 bg-gray-900/60 backdrop-blur-sm p-5 rounded-2xl border border-white/5 shadow-lg group-hover:border-emerald-500/30 transition-all group-hover:-translate-x-2">
                <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FeaturesGridSection = () => {
  return (
    <div className="py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-white mb-3">لماذا نحن؟</h2>
        <p className="text-gray-400 text-sm">ميزات حصرية تجعلنا خيارك الأول</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent"></div>
            <div className="relative z-10">
                <div className="w-12 h-12 bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Rocket className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">سرعة وتفاعلية</h3>
                <p className="text-gray-400 text-sm">منصة خفيفة وسريعة مصممة لتعمل بكفاءة على جميع الأجهزة والجوالات.</p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors"></div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-blue-500 to-transparent"></div>
            <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">محتوى موثوق</h3>
                <p className="text-gray-400 text-sm">جميع الأسئلة والشروحات مدققة من قبل نخبة من المعلمين المتميزين.</p>
            </div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>
        </div>

        <div className="md:col-span-2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group text-center md:text-right flex flex-col md:flex-row items-center gap-6">
             <div className="w-16 h-16 bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-400 shrink-0 border border-yellow-500/20 shadow-lg shadow-yellow-900/20 animate-pulse">
                <Target className="w-8 h-8" />
             </div>
             <div>
                <h3 className="text-xl font-bold text-white mb-2">تغطية شاملة للمنهاج</h3>
                <p className="text-gray-400 text-sm">لا نترك شاردة ولا واردة في الكتاب إلا ونغطيها بأسئلة ذكية.</p>
             </div>
        </div>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: 'هل استخدام المنصة مجاني؟', a: 'نعم، التسجيل واستخدام المنصة مجاني، ولكن الوصول الكامل لجميع الخدمات والميزات يتطلب اشتراكاً.' },
    { q: 'كيف يمكنني التواصل مع المعلم؟', a: 'يمكنك استخدام خيار "تواصل مع المعلم" في القائمة لإرسال رسالة مباشرة عبر واتساب.' },
    { q: 'هل تعمل المنصة على الجوال؟', a: 'بالتأكيد! تم تصميم المنصة لتعمل بسلاسة تامة على هاتفك.' },
    { q: 'هل النتائج دقيقة؟', a: 'نعم، يتم تصحيح الإجابات فورياً بناءً على نماذج إجابة معتمدة ودقيقة 100%.' },
  ];

  return (
    <div className="py-12 px-4 mb-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-white mb-3">أسئلة شائعة</h2>
        <p className="text-gray-400 text-sm">كل ما يدور في ذهنك</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-3">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden transition-all duration-300">
            <button 
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full p-5 flex items-center justify-between text-right bg-gray-900 hover:bg-gray-800/50 transition-colors"
            >
              <span className="font-bold text-white text-sm md:text-base flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-emerald-500" />
                {faq.q}
              </span>
              <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openIndex === idx ? 'rotate-180 text-emerald-400' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="p-5 pt-0 text-gray-400 text-sm leading-relaxed border-t border-gray-800/50">
                {faq.a}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HomeExtraSections = () => {
  return (
    <div className="relative z-10 w-full bg-transparent">
      <GreenDivider />
      <RoadmapSection />
      
      <GreenDivider />
      <FeaturesGridSection />
      
      <GreenDivider />
      <FAQSection />
    </div>
  );
};

export default HomeExtraSections;
