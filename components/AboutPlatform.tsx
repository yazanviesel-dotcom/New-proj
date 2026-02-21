
import React from 'react';
import { ArrowRight, Target, Eye, ShieldCheck, Users, BarChart3, Globe, Home, Info } from 'lucide-react';

interface AboutPlatformProps {
  onBack: () => void;
}

const AboutPlatform: React.FC<AboutPlatformProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-950 animate-fade-in transition-colors duration-300 text-gray-100">
      
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
                <h1 className="text-lg font-black text-white tracking-tight mb-0.5">عن المنصة</h1>
                <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-medium text-gray-500">
                    <span onClick={onBack} className="hover:text-emerald-400 cursor-pointer transition-colors flex items-center gap-1">
                       <Home className="w-3 h-3" /> الرئيسية
                    </span>
                    <span className="text-gray-700">/</span>
                    <span className="text-emerald-500 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        التعريف والرؤية
                    </span>
                </div>
            </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-emerald-900/20 py-20 overflow-hidden border-b border-white/5 -mt-16 pt-32">
         <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-4 py-1 rounded-full text-sm font-medium mb-6 inline-block backdrop-blur-sm">
              المنصة التعليمية الرائدة في فلسطين
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              نصنع مستقبل التعليم <br/> برؤية عصرية متطورة
            </h1>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
              منصة إتقان ليست مجرد موقع تعليمي، بل هي بيئة تفاعلية متكاملة تهدف لرفع كفاءة الطلاب وتمكينهم من تحقيق أقصى طموحاتهم الأكاديمية.
            </p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
           <div className="bg-gray-900 p-8 rounded-3xl shadow-sm border border-white/5 hover:shadow-lg transition-all hover:bg-gray-800">
              <div className="w-16 h-16 bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
                 <Eye className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-2xl font-black text-white mb-4">رؤيتنا</h2>
              <p className="text-gray-400 leading-relaxed text-lg">
                أن نكون المرجع الأول والموثوق للتعليم الإلكتروني في فلسطين، ونموذجاً يحتذى به في دمج التكنولوجيا بالتعليم لبناء جيل مبدع ومتفوق.
              </p>
           </div>

           <div className="bg-gray-900 p-8 rounded-3xl shadow-sm border border-white/5 hover:shadow-lg transition-all hover:bg-gray-800">
              <div className="w-16 h-16 bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
                 <Target className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-black text-white mb-4">رسالتنا</h2>
              <p className="text-gray-400 leading-relaxed text-lg">
                توفير محتوى تعليمي عالي الجودة واختبارات دقيقة بإشراف نخبة من المعلمين، لضمان تجربة تعليمية ممتعة وفعالة ومتاحة لجميع الطلاب.
              </p>
           </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
             <h2 className="text-3xl font-black text-white mb-4">لماذا تختار منصة إتقان؟</h2>
             <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: ShieldCheck, title: "محتوى موثوق", desc: "تم إعداد كافة المواد والاختبارات بإشراف معلمين متخصصين." },
                { icon: Globe, title: "سهولة الوصول", desc: "تعلم في أي وقت ومن أي مكان عبر واجهة مستخدم بسيطة وسلسة." },
                { icon: BarChart3, title: "تحليل الأداء", desc: "تقارير فورية ونتائج دقيقة تساعدك على معرفة نقاط قوتك وضعفك." },
                { icon: Users, title: "نخبة المعلمين", desc: "فريق عمل متميز بقيادة الأستاذ يزن أبو كحيل لضمان أفضل جودة." },
              ].map((feature, idx) => (
                 <div key={idx} className="bg-gray-900 p-6 rounded-2xl border border-white/5 text-center hover:border-emerald-500/30 transition-all group hover:-translate-y-1">
                    <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-900/30 transition-colors border border-white/5">
                       <feature.icon className="w-7 h-7 text-gray-300 group-hover:text-emerald-400" />
                    </div>
                    <h3 className="font-bold text-white text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                 </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPlatform;
