
import React, { useState, useEffect } from 'react';
import { Users, MapPin, Award, ArrowLeft, Facebook, UserPlus, CheckSquare, PieChart, BookOpen } from 'lucide-react';
import { AppView } from '../types';

interface AboutProps {
  onNavigate: (view: AppView) => void;
}

// Custom WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Custom Telegram Icon Component
const TelegramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.694 0zM4.98 14.41c6.009-2.607 10.015-4.335 12.019-5.168 2.656-.867 3.084-.386 2.84 1.712-.366 3.157-1.408 8.873-1.93 10.364-.22.628-.648.676-1.308.244-1.68-1.044-3.896-2.532-4.812-3.132-.956-.628-1.144-1.24-.208-2.212 2.168-2.248 4.068-4.064 3.724-4.376-.428-.388-2.648.82-7.008 3.776-.784.532-1.496.524-2.192.316-1.04-.312-2.052-.648-2.828-.904-1.056-.348-1.06-1.056.172-1.576z"/>
  </svg>
);

// Custom Messenger Icon Component
const MessengerIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.03 2 11c0 2.87 1.56 5.47 4 7.1V22l3.57-1.96c.78.22 1.6.34 2.43.34 5.52 0 10-4.03 10-9s-4.48-9-10-9zm1.06 12.07l-2.6-2.78-5.07 2.78 5.58-5.93 2.62 2.78 5.05-2.78-5.58 5.93z"/>
  </svg>
);

const REVIEWS = [
  { id: 1, name: "أحمد خليل", text: "فكرة المنصة رهيبة، ريحتنا من تدوير الأسئلة والدوسيات.", platform: "whatsapp", time: "10:30 ص" },
  { id: 2, name: "سارة العلي", text: "الامتحانات هون نفس نمط الوزاري، جد مفيدة للمراجعة.", platform: "messenger", time: "11:15 ص" },
  { id: 3, name: "محمود جبارين", text: "أحلى اشي اني بقدر اختبر حالي واعرف نتيجتي علطول.", platform: "telegram", time: "09:45 م" },
  { id: 4, name: "لانا محمود", text: "الأسئلة قوية وشاملة للمادة، بتخليك تتمكن منيح.", platform: "whatsapp", time: "02:20 م" },
  { id: 5, name: "كريم عبد الله", text: "والله فكرة ممتازة، بتخلي الواحد يراجع المادة وهو بالدار.", platform: "messenger", time: "04:10 م" },
  { id: 6, name: "تالا يوسف", text: "نظام الامتحانات سفاح، والوقت بخليني أتدرب للامتحان الحقيقي.", platform: "telegram", time: "08:00 ص" },
  { id: 7, name: "عمر زكارنة", text: "يا ريت كل المواد فيها هيك أسئلة، فكرة بتجنن.", platform: "whatsapp", time: "01:30 م" },
  { id: 8, name: "راما سعيد", text: "المنصة خرافية للمراجعة قبل الامتحان بيوم، بتلم المادة.", platform: "messenger", time: "06:45 م" },
  { id: 9, name: "خالد ناصر", text: "أسئلة الامتحانات دقيقة وبتغطي كل الوحدات، شكراً الكم.", platform: "telegram", time: "03:15 م" },
  { id: 10, name: "جنى أحمد", text: "فكرة انه أقدم امتحان عالتلفون كثير مريحة وحلوة.", platform: "whatsapp", time: "12:00 م" },
  { id: 11, name: "يوسف عماد", text: "حليت امتحان التجريبي هون وكان الوضع لوز، الأسئلة بمحلها.", platform: "messenger", time: "07:30 م" },
  { id: 12, name: "هديل سامر", text: "المنصة كثير ساعدتني أثبت معلوماتي بكثرة الحل.", platform: "telegram", time: "10:10 ص" },
  { id: 13, name: "معتز فايز", text: "أخيراً لقينا مكان نتدرب فيه على نمط الامتحانات بشكل مرتب.", platform: "whatsapp", time: "05:50 م" },
  { id: 14, name: "مريم عيسى", text: "التغذية الراجعة بعد الامتحان بتفيد كثير عشان نعرف أغلاطنا.", platform: "messenger", time: "09:20 ص" },
  { id: 15, name: "إبراهيم موسى", text: "كل الاحترام ع هيك شغل، الامتحانات مرتبة ومتعوب عليها.", platform: "telegram", time: "08:45 م" },
];

const STEPS = [
  { 
    icon: UserPlus, 
    title: "بتسجّل دخول", 
    desc: "أنشئ حسابك الشخصي في ثوانٍ للوصول إلى كافة الميزات.",
    color: "bg-blue-100 text-blue-600"
  },
  { 
    icon: BookOpen, 
    title: "بتختار المادة", 
    desc: "حدد الصف الدراسي والمادة التي ترغب بمراجعتها من القائمة.",
    color: "bg-emerald-100 text-emerald-600"
  },
  { 
    icon: CheckSquare, 
    title: "بتحل الأسئلة", 
    desc: "ابدأ الاختبار وأجب عن الأسئلة التفاعلية الشاملة للمنهاج.",
    color: "bg-yellow-100 text-yellow-600"
  },
  { 
    icon: PieChart, 
    title: "بتشوف نتيجتك", 
    desc: "احصل على نتيجتك فوراً مع تصحيح للأخطاء لتقييم مستواك.",
    color: "bg-purple-100 text-purple-600"
  }
];

const About: React.FC<AboutProps> = ({ onNavigate }) => {
  const [indices, setIndices] = useState([0, 1, 2]);
  const [fade, setFade] = useState(true);
  
  useEffect(() => {
    // Reviews Rotation
    const interval = setInterval(() => {
        setFade(false);
        setTimeout(() => {
            const newIndices: number[] = [];
            while(newIndices.length < 3) {
                const r = Math.floor(Math.random() * REVIEWS.length);
                if(!newIndices.includes(r)) newIndices.push(r);
            }
            setIndices(newIndices);
            setFade(true);
        }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getPlatformIcon = (platform: string) => {
    switch(platform) {
        case 'whatsapp': return <WhatsAppIcon className="w-5 h-5 text-white" />;
        case 'messenger': return <MessengerIcon className="w-5 h-5 text-white" />;
        case 'telegram': return <TelegramIcon className="w-5 h-5 text-white" />;
        default: return null;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch(platform) {
        case 'whatsapp': return 'bg-green-500';
        case 'messenger': return 'bg-blue-600';
        case 'telegram': return 'bg-sky-500';
        default: return 'bg-gray-500';
    }
  };

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden bg-grid-pattern">
      {/* Background decorative blobs matching Hero */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-4">من نحن؟</h2>
          <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            نحن منصة تعليمية فلسطينية رائدة تهدف إلى تمكين الطلاب ورفع مستواهم الأكاديمي من خلال توفير محتوى تعليمي عالي الجودة واختبارات إلكترونية شاملة، بإشراف نخبة من المعلمين المتميزين.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Teacher 1 - Yazan Abu Kahil */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-100 hover:border-emerald-200 transition-all group flex flex-col h-full shadow-lg hover:shadow-xl">
            <div className="flex flex-col sm:flex-row items-center gap-8 mb-6">
              <div className="w-64 h-64 rounded-3xl shadow-xl overflow-hidden shrink-0 border-4 border-white group-hover:scale-105 transition-transform">
                <img 
                  src="https://lh3.googleusercontent.com/d/1tbzVNKO3FGH46Pa6MZ58OWD4BXVKdK5P" 
                  alt="أ. يزن أبو كحيل" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center sm:text-right flex-1">
                <h3 className="text-3xl font-black text-gray-900 mb-3">أ. يزن أبو كحيل</h3>
                <p className="text-emerald-600 font-bold text-xl mb-4">معلم اللغة الإنجليزية</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 font-medium bg-white px-4 py-2 rounded-full inline-flex shadow-sm border border-gray-100">
                  <MapPin className="w-5 h-5 text-emerald-500" />
                  مدرسة السلام الثانوية - جنين
                </div>
              </div>
            </div>
            
            {/* Social Contacts */}
            <div className="mt-auto pt-6 border-t border-slate-200">
                <p className="text-sm font-bold text-gray-700 mb-4 text-center sm:text-right">تواصلوا معنا</p>
                <div className="flex gap-4 justify-center sm:justify-start">
                  <a href="#" className="w-14 h-14 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform border-2 border-white">
                    <Facebook className="w-7 h-7" />
                  </a>
                  <a href="https://wa.me/972568401548" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform border-2 border-white">
                    <WhatsAppIcon className="w-7 h-7" />
                  </a>
                  <a href="https://t.me/yazan1342" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-[#0088cc] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform border-2 border-white">
                    <TelegramIcon className="w-7 h-7" />
                  </a>
                </div>
            </div>
          </div>

          {/* Teacher 2 - Majd Al-Din Al-Hajj */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-100 hover:border-emerald-200 transition-all group flex flex-col h-full shadow-lg hover:shadow-xl">
            <div className="flex flex-col sm:flex-row items-center gap-8 mb-6">
              <div className="w-64 h-64 rounded-3xl shadow-xl overflow-hidden shrink-0 border-4 border-white group-hover:scale-105 transition-transform">
                 <img 
                  src="https://lh3.googleusercontent.com/d/1kAAQQ-PDdvK4dw6bq9sCr3umcuamh73t" 
                  alt="أ. مجد الدين الحاج" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center sm:text-right flex-1">
                <h3 className="text-3xl font-black text-gray-900 mb-3">أ. مجد الدين الحاج</h3>
                <p className="text-blue-700 font-bold text-xl mb-4">معلم اللغة الإنجليزية</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 font-medium bg-white px-4 py-2 rounded-full inline-flex shadow-sm border border-gray-100">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  مدرسة جلقموس الثانوية - جنين
                </div>
              </div>
            </div>

            {/* Social Contacts */}
            <div className="mt-auto pt-6 border-t border-slate-200">
                <p className="text-sm font-bold text-gray-700 mb-4 text-center sm:text-right">تواصلوا معنا</p>
                <div className="flex gap-4 justify-center sm:justify-start">
                  <a href="#" className="w-14 h-14 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform border-2 border-white">
                    <Facebook className="w-7 h-7" />
                  </a>
                  <a href="#" className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform border-2 border-white">
                    <WhatsAppIcon className="w-7 h-7" />
                  </a>
                  <a href="#" className="w-14 h-14 rounded-full bg-[#0088cc] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform border-2 border-white">
                    <TelegramIcon className="w-7 h-7" />
                  </a>
                </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <button 
            onClick={() => onNavigate('TEACHER_CV')}
            className="inline-flex items-center gap-3 bg-emerald-600 text-white text-xl font-bold px-10 py-5 rounded-full shadow-lg hover:bg-emerald-700 hover:shadow-emerald-200 transition-all transform hover:-translate-y-1"
          >
            <Award className="w-6 h-6" />
            تعرف علينا أكثر
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Reviews Section */}
        <div className="mb-0 pt-10 border-t border-gray-100">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-gray-900 mb-4">شو بيحكوا طلابنا؟</h2>
                <p className="text-gray-500">آراء حقيقية من طلابنا المميزين عن تجربة الاختبارات</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {indices.map((idx, i) => {
                    const review = REVIEWS[idx];
                    return (
                        <div 
                            key={`${review.id}-${i}`}
                            className={`transform transition-all duration-500 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        >
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100 relative h-full flex flex-col hover:shadow-md transition-shadow">
                                {/* Speech Bubble Tail */}
                                <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-b border-r border-gray-100 transform rotate-45"></div>
                                
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">
                                            {review.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{review.name}</h4>
                                            <span className="text-xs text-gray-400 font-medium">{review.time}</span>
                                        </div>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full ${getPlatformColor(review.platform)} flex items-center justify-center shadow-sm`}>
                                        {getPlatformIcon(review.platform)}
                                    </div>
                                </div>

                                {/* Message Body */}
                                <p className="text-gray-700 text-base leading-relaxed font-medium">
                                    "{review.text}"
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>

        {/* How We Help Section */}
        <div className="mb-0 pt-20 mt-12 border-t border-gray-200">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-black text-gray-900 mb-4">كيف نساعدك؟</h2>
                <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
                <p className="mt-6 text-lg text-gray-600">رحلة نجاحك تبدأ بخطوات بسيطة ومدروسة</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                {/* Connector Line (Desktop only) */}
                <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 -z-10 transform -translate-y-1/2"></div>

                {STEPS.map((step, index) => (
                  <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center relative group hover:-translate-y-2 transition-transform duration-300">
                      {/* Step Number Badge */}
                      <div className="absolute -top-4 right-6 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md z-10 border-2 border-white">
                        {index + 1}
                      </div>

                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-gray-50 group-hover:border-emerald-100 transition-colors relative z-0">
                          <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center`}>
                              <step.icon className="w-8 h-8" />
                          </div>
                      </div>
                      <h3 className="font-black text-xl mb-3 text-gray-900">{step.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed font-medium px-2">{step.desc}</p>
                  </div>
                ))}
            </div>
        </div>

      </div>
    </section>
  );
};

export default About;