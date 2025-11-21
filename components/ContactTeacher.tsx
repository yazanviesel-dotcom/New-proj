
import React from 'react';
import { ArrowRight, MessageCircle, HelpCircle, FileSearch, School, GraduationCap } from 'lucide-react';

// Custom Icons
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
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
  
  const handleContact = (type: string) => {
    let message = "";
    switch(type) {
        case 'message': message = "مرحباً أستاذ يزن، أريد التواصل معك بخصوص دروسي."; break;
        case 'question': message = "مرحباً أستاذ، لدي سؤال في مادة اللغة الإنجليزية..."; break;
        case 'review': message = "مرحباً أستاذ، أرغب بطلب مراجعة لموضوع معين."; break;
        case 'inquiry': message = "مرحباً، لدي استفسار أكاديمي عام."; break;
        default: message = "مرحباً أستاذ يزن.";
    }
    const url = `https://wa.me/972568401548?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 animate-fade-in pb-20">
      {/* Header */}
      <div className="bg-white border-b border-emerald-100 py-6 px-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-emerald-50 rounded-full transition-colors flex items-center gap-2 text-gray-600 font-bold group"
            >
              <ArrowRight className="w-6 h-6 group-hover:text-emerald-600" />
              العودة للرئيسية
            </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
             <h1 className="text-4xl font-black text-gray-900 mb-4">مركز تواصل الطلاب</h1>
             <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
             <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
               نحن هنا لدعمك في كل خطوة. اختر الطريقة الأنسب للتواصل مع معلمك والحصول على المساعدة.
             </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden transform hover:shadow-2xl transition-all duration-300">
              <div className="bg-emerald-600 p-8 text-white text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
                  {/* Decorative circles */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

                  <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 border border-white/20">
                      <MessageCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-black mb-2 relative z-10">كيف يمكننا مساعدتك اليوم؟</h3>
                  <p className="text-emerald-100 opacity-90 relative z-10 font-medium text-lg">اختر نوع الاستفسار ليتم توجيهك بشكل صحيح</p>
              </div>

              <div className="p-8 md:p-12">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                      {/* Contact Actions */}
                      <button 
                        onClick={() => handleContact('message')} 
                        className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-emerald-50 hover:bg-emerald-100 transition-all group border-2 border-emerald-100 hover:border-emerald-200 hover:-translate-y-2 duration-300"
                      >
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform text-emerald-600 border border-emerald-100">
                              <MessageCircle className="w-8 h-8" />
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 text-lg block mb-1">راسل معلمك</span>
                            <span className="text-gray-500 text-sm">للمحادثات العامة والسريعة</span>
                          </div>
                      </button>
                      
                      <button 
                        onClick={() => handleContact('question')} 
                        className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-emerald-50 hover:bg-emerald-100 transition-all group border-2 border-emerald-100 hover:border-emerald-200 hover:-translate-y-2 duration-300"
                      >
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform text-emerald-600 border border-emerald-100">
                              <HelpCircle className="w-8 h-8" />
                          </div>
                          <div>
                             <span className="font-bold text-gray-900 text-lg block mb-1">إرسال سؤال</span>
                             <span className="text-gray-500 text-sm">لديك سؤال في المادة؟</span>
                          </div>
                      </button>

                      <button 
                        onClick={() => handleContact('review')} 
                        className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-emerald-50 hover:bg-emerald-100 transition-all group border-2 border-emerald-100 hover:border-emerald-200 hover:-translate-y-2 duration-300"
                      >
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform text-emerald-600 border border-emerald-100">
                              <FileSearch className="w-8 h-8" />
                          </div>
                          <div>
                             <span className="font-bold text-gray-900 text-lg block mb-1">طلب مراجعة</span>
                             <span className="text-gray-500 text-sm">مراجعة موضوع أو امتحان</span>
                          </div>
                      </button>

                      <button 
                        onClick={() => handleContact('inquiry')} 
                        className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-emerald-50 hover:bg-emerald-100 transition-all group border-2 border-emerald-100 hover:border-emerald-200 hover:-translate-y-2 duration-300"
                      >
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform text-emerald-600 border border-emerald-100">
                              <School className="w-8 h-8" />
                          </div>
                          <div>
                             <span className="font-bold text-gray-900 text-lg block mb-1">استفسار أكاديمي</span>
                             <span className="text-gray-500 text-sm">حول المنصة أو الدراسة</span>
                          </div>
                      </button>
                  </div>

                  <div className="border-t-2 border-gray-100 pt-10">
                      <h4 className="text-center text-gray-500 font-bold mb-6 uppercase tracking-wide text-sm">مشرف المنصة</h4>
                      <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                          <div className="relative shrink-0 group cursor-pointer">
                              <div className="absolute inset-0 bg-emerald-500 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                              <img 
                                  src="https://lh3.googleusercontent.com/d/1tbzVNKO3FGH46Pa6MZ58OWD4BXVKdK5P" 
                                  alt="أ. يزن أبو كحيل" 
                                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg relative z-10"
                              />
                              <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full z-20"></div>
                          </div>
                          
                          <div className="text-center md:text-right flex-1">
                              <h4 className="font-black text-2xl text-gray-900 mb-2">أ. يزن أبو كحيل</h4>
                              <p className="text-emerald-600 font-bold text-base mb-6 flex items-center justify-center md:justify-start gap-2 bg-emerald-50 w-fit mx-auto md:mx-0 px-4 py-1 rounded-full">
                                <GraduationCap className="w-5 h-5" />
                                مسؤول المنصة ومدرس اللغة الإنجليزية
                              </p>
                              
                              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                  <a 
                                      href="https://wa.me/972568401548" 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:scale-105 transition-all shadow-green-200"
                                  >
                                      <WhatsAppIcon className="w-5 h-5" />
                                      تواصل عبر واتساب
                                  </a>
                                  <a 
                                      href="https://t.me/yazan1342" 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 bg-[#0088cc] text-white px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:scale-105 transition-all shadow-sky-200"
                                  >
                                      <TelegramIcon className="w-5 h-5" />
                                      تواصل عبر تيليجرام
                                  </a>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ContactTeacher;