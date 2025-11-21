
import React from 'react';
import { ArrowRight, MapPin, Mail, Briefcase, GraduationCap, Award, Star, Facebook } from 'lucide-react';

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
      school: "مدرسة السلام الثانوية",
      location: "جنين، فلسطين",
      color: "emerald",
      bio: "معلم شغوف بخبرة واسعة في تدريس اللغة الإنجليزية للمراحل الثانوية. أؤمن بأهمية دمج التكنولوجيا في التعليم لتبسيط المفاهيم وجعل العملية التعليمية أكثر متعة وفاعلية.",
      skills: ["تدريس اللغة الإنجليزية", "إعداد الاختبارات الإلكترونية", "تطوير المناهج", "استراتيجيات التعلم النشط"],
      social: {
        facebook: "#",
        whatsapp: "https://wa.me/972568401548",
        telegram: "https://t.me/yazan1342"
      }
    },
    {
      name: "أ. مجد الدين الحاج",
      image: "https://lh3.googleusercontent.com/d/1kAAQQ-PDdvK4dw6bq9sCr3umcuamh73t",
      title: "معلم اللغة الإنجليزية",
      school: "مدرسة جلقموس الثانوية",
      location: "جنين، فلسطين",
      color: "blue",
      bio: "متخصص في تعليم اللغة الإنجليزية بأساليب حديثة ومبتكرة. أسعى دائماً لتحفيز الطلاب وبناء الثقة لديهم لاستخدام اللغة بطلاقة، مع التركيز على المهارات الأربع الأساسية.",
      skills: ["تعليم اللغات", "الإدارة الصفية", "تكنولوجيا التعليم", "التوجيه والإرشاد الأكاديمي"],
      social: {
        facebook: "#",
        whatsapp: "#",
        telegram: "#"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 animate-fade-in">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6 px-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2 text-gray-600 font-bold"
            >
              <ArrowRight className="w-6 h-6" />
              العودة للرئيسية
            </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-gray-900 mb-4">السيرة الذاتية للمعلمين</h1>
          <p className="text-xl text-gray-600">تعرف على فريق العمل القائم على منصة إتقان</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {teachers.map((teacher, index) => (
            <div key={index} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col h-full hover:shadow-2xl transition-shadow duration-300">
              {/* Card Header */}
              <div className={`bg-${teacher.color}-600 h-32 relative`}>
                 <div className="absolute -bottom-12 right-8">
                    <div className="w-24 h-24 bg-white p-1 rounded-2xl shadow-lg transform rotate-3">
                       <div className={`w-full h-full bg-${teacher.color}-50 rounded-xl flex items-center justify-center overflow-hidden`}>
                          <img 
                            src={teacher.image} 
                            alt={teacher.name} 
                            className="w-full h-full object-cover"
                          />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="pt-16 pb-8 px-8 flex-1 flex flex-col">
                 <div>
                   <h2 className="text-3xl font-bold text-gray-900 mb-1">{teacher.name}</h2>
                   <p className={`text-${teacher.color}-600 font-bold text-lg mb-4`}>{teacher.title}</p>
                   
                   <div className="flex flex-col gap-2 text-gray-500 text-sm mb-6">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        {teacher.school}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {teacher.location}
                      </div>
                   </div>

                   <div className="mb-6">
                     <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        نبذة شخصية
                     </h3>
                     <p className="text-gray-600 leading-relaxed">
                       {teacher.bio}
                     </p>
                   </div>
                 </div>

                 <div className="mt-auto">
                   <div className="mb-6">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Award className={`w-5 h-5 text-${teacher.color}-600`} />
                        المهارات والخبرات
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {teacher.skills.map((skill, i) => (
                        <span key={i} className={`bg-${teacher.color}-50 text-${teacher.color}-700 px-3 py-1 rounded-lg text-sm font-medium`}>
                            {skill}
                        </span>
                        ))}
                    </div>
                   </div>

                   {/* Social Media Section */}
                   <div className="pt-6 border-t border-gray-100">
                      <h3 className="font-bold text-gray-900 mb-4 text-sm">تواصلوا معنا</h3>
                      <div className="flex gap-3">
                        <a 
                          href={teacher.social.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <Facebook className="w-5 h-5" />
                        </a>
                        <a 
                          href={teacher.social.whatsapp} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all"
                        >
                          <WhatsAppIcon className="w-5 h-5" />
                        </a>
                        <a 
                          href={teacher.social.telegram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center hover:bg-sky-600 hover:text-white transition-all"
                        >
                          <TelegramIcon className="w-5 h-5" />
                        </a>
                      </div>
                   </div>
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