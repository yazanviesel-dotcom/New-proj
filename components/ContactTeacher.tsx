
import React from 'react';
import { ArrowRight, MessageCircle, HelpCircle, FileSearch, School, X, Send, ChevronLeft, Home, Phone, MapPin, Mail, GraduationCap } from 'lucide-react';

// Custom Icons
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.797 1.651-2.797 2.895v1.076h3.441l-1.347 3.667h-2.094v8.382a12.975 12.975 0 0 0 1.579-.098 12.9 12.9 0 0 0 4.199-1.528 12.906 12.906 0 0 0 3.334-2.715 12.825 12.825 0 0 0 2.193-3.525A12.972 12.972 0 0 0 24 12.074a12.972 12.972 0 0 0-1.405-6.075 12.906 12.906 0 0 0-3.831-4.421A12.975 12.975 0 0 0 12.074 0a12.972 12.972 0 0 0-6.075 1.405A12.906 12.906 0 0 0 1.579 5.236 12.972 12.972 0 0 0 0 12.074a12.972 12.972 0 0 0 1.405 6.075 12.906 12.906 0 0 0 3.831 4.421 12.975 12.975 0 0 0 3.865 1.121z"/>
  </svg>
);

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.694 0zM4.98 14.41c6.009-2.607 10.015-4.335 12.019-5.168 2.656-.867 3.084-.386 2.84 1.712-.366 3.157-1.408 8.873-1.93 10.364-.22.628-.648.676-1.308.244-1.68-1.044-3.896-2.532-4.812-3.132-.956-.628-1.144-1.24-.208-2.212 2.168-2.248 4.068-4.064 3.724-4.376-.428-.388-2.648.82-7.008 3.776-.784.532-1.496.524-2.192.316-1.04-.312-2.052-.648-2.828-.904-1.056-.348-1.06-1.056.172-1.576z"/>
  </svg>
);

interface ContactTeacherProps {
  onBack: () => void;
}

const ContactTeacher: React.FC<ContactTeacherProps> = ({ onBack }) => {
  const teachers = [
    {
      name: "أ. يزن أبو كحيل",
      role: "مؤسس المنصة - لغة إنجليزية",
      image: "https://lh3.googleusercontent.com/d/1tbzVNKO3FGH46Pa6MZ58OWD4BXVKdK5P",
      whatsapp: "https://wa.me/972568401548",
      facebook: "https://www.facebook.com/yazanabokaheal2?locale=ms_MY",
      telegram: "https://t.me/yazan1342",
      theme: "emerald",
      glowColor: "rgba(16,185,129,0.6)",
      borderColor: "border-emerald-500/50",
      textColor: "text-emerald-400"
    },
    {
      name: "أ. مجد الدين الحاج",
      role: "مشرف المنصة - لغة إنجليزية",
      image: "https://lh3.googleusercontent.com/d/1xPDpcaUPz3IH-pqv-Jgplroi6U27BVVj",
      whatsapp: "#",
      facebook: "#",
      telegram: "#",
      theme: "blue",
      glowColor: "rgba(59,130,246,0.6)",
      borderColor: "border-blue-500/50",
      textColor: "text-blue-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 animate-fade-in transition-colors duration-300 text-gray-100">
      
      {/* Integrated Header - Compact */}
      <div className="max-w-4xl mx-auto px-4 pt-2 pb-2">
        <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-2 bg-gray-900/50 hover:bg-gray-800 rounded-xl transition-all text-gray-400 hover:text-white border border-white/10 shadow-lg backdrop-blur-sm group"
            >
              <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
                <h1 className="text-lg font-black text-white tracking-tight mb-0.5">تواصل مع المعلم</h1>
                <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-medium text-gray-500">
                    <span onClick={onBack} className="hover:text-emerald-400 cursor-pointer transition-colors flex items-center gap-1">
                       <Home className="w-3 h-3" /> الرئيسية
                    </span>
                    <span className="text-gray-700">/</span>
                    <span className="text-emerald-500 flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        الدعم والاستفسارات
                    </span>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Department Header */}
        <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-gray-900 rounded-2xl mb-4 border border-gray-800 shadow-xl">
                <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-black text-white mb-2">قسم اللغة الإنجليزية</h2>
            <p className="text-gray-400 text-sm">نخبة من أفضل المعلمين لخدمتكم</p>
        </div>

        {/* Teachers Grid - Mobile First (Stacked) -> Desktop (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {teachers.map((teacher, index) => (
                <div 
                    key={index} 
                    className={`bg-gray-950 rounded-[2.5rem] p-8 text-center relative overflow-hidden group border-2 ${teacher.borderColor} transition-all duration-500 hover:-translate-y-2`}
                    style={{
                        boxShadow: `0 0 60px -10px ${teacher.glowColor}, inset 0 0 20px -15px ${teacher.glowColor}`
                    }}
                >
                    {/* Inner Texture */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
                    
                    {/* Background Light Effect (Sun Radiation) */}
                    <div 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-20 pointer-events-none"
                        style={{
                            background: `radial-gradient(circle, ${teacher.glowColor} 0%, transparent 70%)`
                        }}
                    ></div>
                    
                    <div className="relative z-10">
                        <div className={`w-36 h-36 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl border-4 ${teacher.borderColor} overflow-hidden p-1 group-hover:scale-105 transition-transform duration-500`}>
                            <img 
                                src={teacher.image} 
                                alt={teacher.name} 
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>

                        <h2 className="text-2xl md:text-3xl font-black text-white mb-3">{teacher.name}</h2>
                        
                        <div className={`flex items-center justify-center gap-2 mb-8 ${teacher.textColor} font-bold text-sm bg-gray-900/80 px-5 py-2 rounded-full w-fit mx-auto border border-white/10 backdrop-blur-sm shadow-lg`}>
                            <School className="w-4 h-4" />
                            <span>{teacher.role}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-3 gap-3">
                            <button 
                                onClick={() => window.open(teacher.whatsapp, '_blank')}
                                className="flex flex-col items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white py-4 rounded-2xl font-bold transition-all border border-[#25D366]/20 group/btn shadow-lg"
                            >
                                <WhatsAppIcon className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
                                <span className="text-[10px]">واتساب</span>
                            </button>
                            
                            <button 
                                onClick={() => window.open(teacher.facebook, '_blank')}
                                className="flex flex-col items-center justify-center gap-2 bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#1877F2] hover:text-white py-4 rounded-2xl font-bold transition-all border border-[#1877F2]/20 group/btn shadow-lg"
                            >
                                <FacebookIcon className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
                                <span className="text-[10px]">فيسبوك</span>
                            </button>

                            <button 
                                onClick={() => window.open(teacher.telegram, '_blank')}
                                className="flex flex-col items-center justify-center gap-2 bg-[#0088cc]/10 hover:bg-[#0088cc] text-[#0088cc] hover:text-white py-4 rounded-2xl font-bold transition-all border border-[#0088cc]/20 group/btn shadow-lg"
                            >
                                <TelegramIcon className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
                                <span className="text-[10px]">تلجرام</span>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Coming Soon Note */}
        <div className="text-center py-8 border-t border-white/5">
            <p className="text-gray-500 text-sm font-medium animate-pulse flex items-center justify-center gap-2">
                <HelpCircle className="w-4 h-4" />
                سيتم إضافة باقي الأقسام (الرياضيات، العلوم، وغيرها) قريباً...
            </p>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800 hover:border-emerald-500/30 transition-colors">
                <HelpCircle className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">كيف أشترك؟</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    يمكنك الاشتراك في الباقات المدفوعة عبر التواصل معنا مباشرة على واتساب، وسيتم تفعيل حسابك فوراً.
                </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800 hover:border-emerald-500/30 transition-colors">
                <FileSearch className="w-8 h-8 text-purple-500 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">بحاجة لملخصات؟</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    تحقق من قسم "ملفات المواد" في القائمة الرئيسية، ستجد هناك العديد من الملخصات المجانية.
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ContactTeacher;
