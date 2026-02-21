
import React from 'react';
import { ArrowRight, MapPin, Briefcase, Award, Star, Facebook, Home, Users, GraduationCap, CheckCircle2 } from 'lucide-react';
import StarsBackground from './StarsBackground';

interface TeacherCVProps {
  onBack: () => void;
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

const TeacherCV: React.FC<TeacherCVProps> = ({ onBack }) => {
  const teachers = [
    {
      name: "أ. يزن أبو كحيل",
      image: "https://lh3.googleusercontent.com/d/1tbzVNKO3FGH46Pa6MZ58OWD4BXVKdK5P",
      title: "معلم اللغة الإنجليزية",
      workplace: "مدرسة السلام الثانوية",
      location: "جنين، فلسطين",
      color: "emerald",
      education: "بكالوريوس أدب إنجليزي فرعي تربية - جامعة القدس المفتوحة",
      rating: "ممتاز",
      bio: "معلم شغوف بخبرة في تدريس اللغة الإنجليزية لجميع المراحل. أؤمن بأهمية دمج التكنولوجيا في التعليم لتبسيط المفاهيم وجعل العملية التعليمية أكثر متعة وفاعلية.",
      skills: ["تدريس اللغة الإنجليزية", "إعداد الاختبارات الإلكترونية", "تصميم المواقع الإلكترونية"],
      social: {
        facebook: "https://www.facebook.com/yazanabokaheal2?locale=ms_MY",
        whatsapp: "https://wa.me/972568401548",
        telegram: "https://t.me/yazan1342"
      }
    },
    {
      name: "أ. مجد الدين الحاج",
      image: "https://lh3.googleusercontent.com/d/1xPDpcaUPz3IH-pqv-Jgplroi6U27BVVj",
      title: "معلم اللغة الإنجليزية",
      workplace: "مدرسة جلقموس الثانوية",
      location: "جنين، فلسطين",
      color: "blue",
      education: "بكالوريوس أدب إنجليزي - جامعة القدس المفتوحة",
      rating: "ممتاز",
      bio: "متخصص في تعليم اللغة الإنجليزية بأساليب حديثة ومبتكرة. أسعى دائماً لتحفيز الطلاب وبناء الثقة لديهم لاستخدام اللغة بطلاقة، مع التركيز على المهارات الأربع الأساسية.",
      skills: ["تدريس اللغة الإنجليزية", "الترجمة"],
      social: {
        facebook: "#",
        whatsapp: "#",
        telegram: "#"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 animate-fade-in transition-colors duration-300 text-gray-100 relative overflow-hidden">
      
      {/* Animated Stars Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <StarsBackground />
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/90 via-gray-900/60 to-gray-950"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      </div>

      {/* Integrated Header - Compact */}
      <div className="max-w-6xl mx-auto px-4 pt-2 pb-2 relative z-30">
        <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-2 bg-gray-900/50 hover:bg-emerald-900/30 rounded-xl transition-all text-gray-400 hover:text-white border border-gray-700 hover:border-emerald-500/30 shadow-lg backdrop-blur-sm group"
            >
              <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
                <h1 className="text-lg font-black text-white tracking-tight mb-0.5">الكادر التعليمي</h1>
                <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-medium text-gray-400">
                    <span onClick={onBack} className="hover:text-emerald-400 cursor-pointer transition-colors flex items-center gap-1">
                       <Home className="w-3 h-3" /> الرئيسية
                    </span>
                    <span className="text-gray-600">/</span>
                    <span className="text-emerald-500 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        السيرة الذاتية
                    </span>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-full mb-4 border border-emerald-500/20 backdrop-blur-md">
             <Star className="w-6 h-6 text-emerald-400 fill-emerald-400 animate-pulse" />
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">تعرف على الخبرات الأكاديمية التي تقود مسيرة التميز في منصة إتقان</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {teachers.map((teacher, index) => (
            <div key={index} className="bg-gray-900/60 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-gray-700/50 flex flex-col hover:border-emerald-500/30 transition-all duration-300 p-8 group relative overflow-hidden">
              
              {/* Top Decorative Line */}
              <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-${teacher.color}-500 to-transparent opacity-80`}></div>

              {/* Image Section */}
              <div className="flex justify-center mb-8 relative">
                 <div className={`w-40 h-40 rounded-full p-1.5 bg-gradient-to-br from-${teacher.color}-500/20 to-gray-800 shadow-2xl relative z-10 border border-${teacher.color}-500/30`}>
                    <img 
                        src={teacher.image} 
                        alt={teacher.name} 
                        className="w-full h-full rounded-full object-cover border-4 border-gray-900"
                    />
                    <div className="absolute bottom-2 right-2 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-gray-900 shadow-sm">
                        <CheckCircle2 className="w-4 h-4" />
                    </div>
                 </div>
                 {/* Glow behind image */}
                 <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-${teacher.color}-500/10 rounded-full blur-3xl animate-pulse`}></div>
              </div>

              <div className="text-center mb-8">
                 <h2 className="text-3xl font-black text-white mb-2 tracking-tight">{teacher.name}</h2>
                 <p className={`text-${teacher.color}-400 font-bold text-lg mb-5`}>{teacher.title}</p>
                 
                 <div className="flex flex-wrap justify-center gap-3 text-gray-300 text-sm font-medium">
                    <div className="flex items-center gap-1.5 bg-gray-800/80 px-3 py-1.5 rounded-full border border-gray-700 shadow-sm">
                      <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                      {teacher.workplace}
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-800/80 px-3 py-1.5 rounded-full border border-gray-700 shadow-sm">
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      {teacher.location}
                    </div>
                 </div>
              </div>

              <div className="flex-1 space-y-6">
                 
                 {/* Education Section */}
                 <div className="bg-gray-800/40 p-5 rounded-2xl border border-gray-700/50 relative hover:bg-gray-800/60 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-white font-bold">
                            <div className={`p-1.5 rounded-lg bg-${teacher.color}-500/20 text-${teacher.color}-400`}>
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            <h3>المؤهل العلمي</h3>
                        </div>
                        {teacher.rating && (
                            <span className="text-[10px] font-black bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-400" />
                                {teacher.rating}
                            </span>
                        )}
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed font-medium pr-2 border-r-2 border-gray-700 mr-1">
                        {teacher.education}
                    </p>
                 </div>

                 {/* Bio Section */}
                 <div className="text-center px-2">
                   <div className="flex items-center justify-center gap-2 mb-3">
                      <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                      <h3 className="font-bold text-gray-200">الرؤية والخبرة</h3>
                   </div>
                   <p className="text-gray-400 leading-relaxed text-sm">
                     {teacher.bio}
                   </p>
                 </div>

                 {/* Skills */}
                 <div>
                    <div className="flex flex-wrap justify-center gap-2">
                        {teacher.skills.map((skill, i) => (
                        <span key={i} className={`bg-${teacher.color}-900/20 text-${teacher.color}-300 px-3 py-1.5 rounded-lg text-xs font-bold border border-${teacher.color}-500/20 flex items-center gap-1.5`}>
                            <Award className="w-3 h-3" />
                            {skill}
                        </span>
                        ))}
                    </div>
                 </div>
              </div>

              {/* Social Media Section */}
              <div className="pt-8 mt-4 border-t border-gray-800/50">
                  <div className="flex justify-center gap-4">
                    <a 
                      href={teacher.social.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all border border-[#1877F2]/20 hover:-translate-y-1 shadow-lg"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a 
                      href={teacher.social.whatsapp} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all border border-[#25D366]/20 hover:-translate-y-1 shadow-lg"
                    >
                      <WhatsAppIcon className="w-5 h-5" />
                    </a>
                    <a 
                      href={teacher.social.telegram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-[#0088cc]/10 text-[#0088cc] flex items-center justify-center hover:bg-[#0088cc] hover:text-white transition-all border border-[#0088cc]/20 hover:-translate-y-1 shadow-lg"
                    >
                      <TelegramIcon className="w-5 h-5" />
                    </a>
                  </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherCV;
