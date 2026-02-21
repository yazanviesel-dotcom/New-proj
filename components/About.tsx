
import React, { useState, useEffect } from 'react';
import { Facebook, Home, BookOpen, FileText, Monitor, MessageCircle, Share2, Copy, Check, X, Instagram, MoreHorizontal, Link, Star, MapPin, Award, ArrowLeft } from 'lucide-react';
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
  { id: 1, name: "أحمد شريم", text: "فكرة المنصة فخمة بس في اسئلة صعبة. 🔥", platform: "whatsapp", time: "10:30 ص" },
  { id: 2, name: "سارة قديح", text: "الامتحانات هون حلوة وعنجد بتفيد بالمراجعة. ✨", platform: "messenger", time: "11:15 ص" },
  { id: 3, name: "محمود نفاع", text: "حبيييت الاسئلة الله يعطيكم العافية.", platform: "telegram", time: "09:45 م" },
  { id: 4, name: "لانا عوّاد", text: "الفكرة حلوة,استمرووو.", platform: "whatsapp", time: "02:20 م" },
  { id: 5, name: "كريم جيوسي", text: "والله إشي حلو بخلي الواحد يراجع المادة وهو قاعد بالسيارة ههه.", platform: "messenger", time: "04:10 م" },
  { id: 6, name: "تالا شاهر", text: "حلوة الفكرة الله يوفقكم وياريت تضيفوا شروحات اكثر. 🙏", platform: "telegram", time: "08:00 ص" },
  { id: 7, name: "عمر الشاعر", text: "يا ريت كل المواد فيها زي هيك… فكرة بتجنن. 🤩🔥", platform: "whatsapp", time: "01:30 م" },
  { id: 8, name: "راما عصفور", text: "المنصّة رهيبة للمراجعة قبل الامتحان، فعلياً بتلملم المادة.", platform: "messenger", time: "06:45 م" },
  { id: 9, name: "خالد عودة", text: "أسئلة دقيقة وبتغطي كل الوحدات… شغل نظيف.", platform: "telegram", time: "03:15 م" },
  { id: 10, name: "جنّى صوافطة", text: "إنه أقدّم الامتحان عالتلفون؟ إشي مريح وحلو! 💛", platform: "whatsapp", time: "12:00 م" },
  { id: 11, name: "يوسف البكري", text: "بدنا شروحات وملفات اكتر. حبيت المنصة. ✨", platform: "messenger", time: "07:30 م" },
  { id: 12, name: "هديل أبو الرب", text: "ساعدتني كثير أثبّت الافكار والمعلومات من كتر ما بحل.", platform: "telegram", time: "10:10 ص" },
  { id: 13, name: "معتز خالدي", text: "في اسئلة صعبة بس فكرة المنصة رهيبة.", platform: "whatsapp", time: "05:50 م" },
  { id: 14, name: "مريم حمّاد", text: "ماشاء الله الفكرة حلوة وجديدة عنا. 🤍", platform: "messenger", time: "09:20 ص" },
  { id: 15, name: "إبراهيم خماش", text: "كل الاحترام… الامتحانات مرتبة ومتعوب عليها عنجد. 👏", platform: "telegram", time: "08:45 م" },
];

const About: React.FC<AboutProps> = ({ onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  
  useEffect(() => {
    // Reviews Rotation - Lighter interval (7 seconds)
    const interval = setInterval(() => {
        setFade(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % REVIEWS.length);
            setFade(true);
        }, 500);
    }, 7000);
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

  const renderReviewCard = (review: typeof REVIEWS[0]) => (
    <div className="bg-gray-900 md:bg-white/5 md:backdrop-blur-md rounded-3xl p-6 shadow-sm md:shadow-lg border border-gray-800 md:border-white/5 relative h-full flex flex-col hover:border-white/20 hover:bg-gray-800 md:hover:bg-white/10 transition-all">
        {/* Speech Bubble Tail */}
        <div className="absolute -bottom-2 right-8 w-4 h-4 bg-gray-900 md:bg-white/5 border-b border-r border-gray-800 md:border-white/5 transform rotate-45"></div>
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-300 font-bold text-lg border border-emerald-500/20">
                    {review.name.charAt(0)}
                </div>
                <div>
                    <h4 className="font-bold text-white">{review.name}</h4>
                    <span className="text-xs text-gray-500 font-medium">{review.time}</span>
                </div>
            </div>
            <div className={`w-8 h-8 rounded-full ${getPlatformColor(review.platform)} flex items-center justify-center shadow-md ring-2 ring-black/20`}>
                {getPlatformIcon(review.platform)}
            </div>
        </div>

        {/* Message Body */}
        <p className="text-gray-300 text-base leading-relaxed font-medium">
            "{review.text}"
        </p>
    </div>
  );

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white mb-4 drop-shadow-md">مين احنا؟</h2>
          <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
          
          <p className="mt-8 text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed text-center px-4 font-medium" style={{ lineHeight: '1.8' }}>
            نحن في <span className="text-emerald-400 font-bold">منصة إتقان التعليمية</span> نؤمن بأن التعليم هو مفتاح المستقبل، لذا صممنا لكم بيئة تفاعلية شاملة تضع التفوق بين أيديكم. نقدم محتوى تعليمي متطور يرتكز على <span className="text-emerald-400 font-bold">اختبارات إلكترونية</span> دقيقة تقيس مستواكم الحقيقي، بالإضافة إلى <span className="text-emerald-400 font-bold">شروحات مبسطة</span> وملفات مراجعة شاملة. كل هذا بإشراف ومتابعة من <span className="text-emerald-400 font-bold">نخبة المعلمين</span> لضمان رحلة دراسية ممتعة ومكللة بالنجاح.
          </p>
          
          {/* Badge Moved Here */}
          <div className="mt-10 flex justify-center animate-fade-in-up delay-200">
            <div className="inline-flex items-center gap-2 bg-emerald-900/20 border border-emerald-500/30 px-5 py-2.5 rounded-full shadow-lg backdrop-blur-sm">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-emerald-300 font-bold text-sm">المنصة الأولى في فلسطين</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Teacher 1 - Yazan Abu Kahil */}
          <div className="bg-gray-900 md:bg-white/5 md:backdrop-blur-xl p-6 rounded-[2.5rem] border border-gray-800 md:border-white/10 hover:border-emerald-500/50 transition-all group flex flex-col h-full shadow-lg md:shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-4">
              <div className="w-64 h-64 rounded-3xl shadow-2xl overflow-hidden shrink-0 border-4 border-gray-800 md:border-white/10 group-hover:border-emerald-500/30 group-hover:scale-105 transition-all">
                <img 
                  src="https://lh3.googleusercontent.com/d/1tbzVNKO3FGH46Pa6MZ58OWD4BXVKdK5P" 
                  alt="أ. يزن أبو كحيل" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center sm:text-right flex-1">
                <h3 className="text-2xl font-black text-emerald-400 mb-2 inline-block border-b-2 border-emerald-500/30 pb-1 shadow-[0_2px_10px_-2px_rgba(16,185,129,0.2)]">أ. يزن أبو كحيل</h3>
                <p className="text-gray-200 font-bold text-base mb-3 drop-shadow-sm">معلم اللغة الإنجليزية</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-400 text-xs font-medium bg-black/30 px-3 py-1.5 rounded-full inline-flex shadow-inner border border-white/5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  مدرسة السلام الثانوية - جنين
                </div>
              </div>
            </div>
            
            {/* Social Contacts */}
            <div className="mt-auto pt-4 border-t border-white/10">
                <p className="text-xs font-bold text-gray-500 mb-3 text-center sm:text-right">تواصلوا معنا</p>
                <div className="flex gap-3 justify-center sm:justify-start">
                  <a href="https://www.facebook.com/yazanabokaheal2?locale=ms_MY" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform border border-white/10">
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a href="https://wa.me/972568401548" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform border border-white/10">
                    <WhatsAppIcon className="w-6 h-6" />
                  </a>
                  <a href="https://t.me/yazan1342" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#0088cc] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform border border-white/10">
                    <TelegramIcon className="w-6 h-6" />
                  </a>
                </div>
            </div>
          </div>

          {/* Teacher 2 - Majd Al-Din Al-Hajj */}
          <div className="bg-gray-900 md:bg-white/5 md:backdrop-blur-xl p-6 rounded-[2.5rem] border border-gray-800 md:border-white/10 hover:border-blue-500/50 transition-all group flex flex-col h-full shadow-lg md:shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-4">
              <div className="w-64 h-64 rounded-3xl shadow-2xl overflow-hidden shrink-0 border-4 border-gray-800 md:border-white/10 group-hover:border-blue-500/30 group-hover:scale-105 transition-all">
                 <img 
                  src="https://lh3.googleusercontent.com/d/1xPDpcaUPz3IH-pqv-Jgplroi6U27BVVj" 
                  alt="أ. مجد الدين الحاج" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center sm:text-right flex-1">
                <h3 className="text-2xl font-black text-emerald-400 mb-2 inline-block border-b-2 border-emerald-500/30 pb-1 shadow-[0_2px_10px_-2px_rgba(16,185,129,0.2)]">أ. مجد الدين الحاج</h3>
                <p className="text-gray-200 font-bold text-base mb-3 drop-shadow-sm">معلم اللغة الإنجليزية</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-400 text-xs font-medium bg-black/30 px-3 py-1.5 rounded-full inline-flex shadow-inner border border-white/5">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  مدرسة جلقموس الثانوية - جنين
                </div>
              </div>
            </div>

            {/* Social Contacts */}
            <div className="mt-auto pt-4 border-t border-white/10">
                <p className="text-xs font-bold text-gray-500 mb-3 text-center sm:text-right">تواصلوا معنا</p>
                <div className="flex gap-3 justify-center sm:justify-start">
                  <a href="#" className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform border border-white/10">
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform border border-white/10">
                    <WhatsAppIcon className="w-6 h-6" />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-[#0088cc] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform border border-white/10">
                    <TelegramIcon className="w-6 h-6" />
                  </a>
                </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <button 
            onClick={() => onNavigate('TEACHER_CV')}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xl font-bold px-10 py-5 rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all transform hover:-translate-y-1 border border-emerald-500/50"
          >
            <Award className="w-6 h-6" />
            تعرف علينا أكثر
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Reviews Section - Optimized for Mobile */}
        <div className="mb-0 pt-10 border-t border-white/10">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-white mb-4">شو بيحكوا <span className="text-emerald-400">طلابنا</span>؟</h2>
                <p className="text-gray-400">آراء حقيقية من طلابنا المميزين عن تجربة الموقع خلال الفترة التجريبية</p>
            </div>

            <div className={`transform transition-all duration-700 ease-out ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {/* Mobile View: Show 2 Reviews */}
                <div className="block md:hidden space-y-4">
                    {renderReviewCard(REVIEWS[currentIndex])}
                    {renderReviewCard(REVIEWS[(currentIndex + 1) % REVIEWS.length])}
                </div>

                {/* Desktop View: Show 3 Reviews in Grid */}
                <div className="hidden md:grid md:grid-cols-3 gap-6">
                    {/* Calculate indices for 3 items: current, current+1, current+2, wrapping around */}
                    {[0, 1, 2].map(offset => {
                        const idx = (currentIndex + offset) % REVIEWS.length;
                        return (
                            <div key={REVIEWS[idx].id}>
                                {renderReviewCard(REVIEWS[idx])}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

      </div>
    </section>
  );
};

export default About;
