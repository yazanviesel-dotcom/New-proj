
import React from 'react';
import { ArrowRight, Target, Eye, ShieldCheck, Users, BarChart3, Globe } from 'lucide-react';

interface AboutPlatformProps {
  onBack: () => void;
}

const AboutPlatform: React.FC<AboutPlatformProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 animate-fade-in">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6 px-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2 text-gray-600 font-bold"
            >
              <ArrowRight className="w-6 h-6" />
              العودة للرئيسية
            </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-emerald-600 py-20 overflow-hidden">
         <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
         {/* Decorative circles */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
         
         <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
            <span className="bg-emerald-500/50 text-white px-4 py-1 rounded-full text-sm font-medium mb-6 inline-block backdrop-blur-sm">
              المنصة التعليمية الرائدة في فلسطين
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              نصنع مستقبل التعليم <br/> برؤية عصرية متطورة
            </h1>
            <p className="text-emerald-100 text-xl max-w-2xl mx-auto leading-relaxed">
              منصة إتقان ليست مجرد موقع تعليمي، بل هي بيئة تفاعلية متكاملة تهدف لرفع كفاءة الطلاب وتمكينهم من تحقيق أقصى طموحاتهم الأكاديمية.
            </p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                 <Eye className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-4">رؤيتنا</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                أن نكون المرجع الأول والموثوق للتعليم الإلكتروني في فلسطين، ونموذجاً يحتذى به في دمج التكنولوجيا بالتعليم لبناء جيل مبدع ومتفوق.
              </p>
           </div>

           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                 <Target className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-4">رسالتنا</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                توفير محتوى تعليمي عالي الجودة واختبارات دقيقة بإشراف نخبة من المعلمين، لضمان تجربة تعليمية ممتعة وفعالة ومتاحة لجميع الطلاب.
              </p>
           </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
             <h2 className="text-3xl font-black text-gray-900 mb-4">لماذا تختار منصة إتقان؟</h2>
             <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: ShieldCheck, title: "محتوى موثوق", desc: "تم إعداد كافة المواد والاختبارات بإشراف معلمين متخصصين." },
                { icon: Globe, title: "سهولة الوصول", desc: "تعلم في أي وقت ومن أي مكان عبر واجهة مستخدم بسيطة وسلسة." },
                { icon: BarChart3, title: "تحليل الأداء", desc: "تقارير فورية ونتائج دقيقة تساعدك على معرفة نقاط قوتك وضعفك." },
                { icon: Users, title: "نخبة المعلمين", desc: "فريق عمل متميز بقيادة الأستاذ يزن أبو كحيل لضمان أفضل جودة." },
              ].map((feature, idx) => (
                 <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 text-center hover:border-emerald-300 transition-all group">
                    <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-100 transition-colors">
                       <feature.icon className="w-7 h-7 text-gray-600 group-hover:text-emerald-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                 </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPlatform;
