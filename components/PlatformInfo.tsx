
import React from 'react';

const PlatformInfo: React.FC = () => {
  return (
    <section className="relative w-full min-h-[800px] flex items-center bg-gray-950 overflow-hidden">
      
      {/* Image Background Layer */}
      <div className="absolute inset-0 z-0">
        <img 
            src="https://lh3.googleusercontent.com/d/1ZcMqKedYcXUq7RPYqUGCRr2RsEA6F6JN" 
            alt="عن منصة إتقان" 
            className="w-full h-full object-cover object-center opacity-30"
        />
        
        {/* Gradient Overlays for Blending & Shadows */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-gray-950 via-gray-950/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gray-950/50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-transparent to-gray-950/80"></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full py-24 px-6 md:px-12 flex flex-col justify-center h-full">
        <div className="max-w-4xl mx-auto text-center transform translate-y-0 transition-all duration-700 animate-fade-in-up">
            
            <h2 className="text-4xl md:text-7xl font-black text-white mb-8 drop-shadow-2xl tracking-tight">
                عن المنصة
            </h2>
            
            <div className="h-1.5 w-32 bg-emerald-500 rounded-full mx-auto mb-12 shadow-[0_0_20px_rgba(16,185,129,0.6)]"></div>

            <div className="space-y-8 text-gray-100 font-medium leading-relaxed drop-shadow-lg">
                
                <p className="text-2xl md:text-4xl font-black text-emerald-400 mb-6">
                    منصة إتقان: رفيقك نحو القمة
                </p>

                <p className="text-lg md:text-2xl opacity-95 leading-loose">
                    نحن لسنا مجرد موقع تعليمي، بل مجتمع أكاديمي متكامل تأسس برؤية فلسطينية طموحة. نهدف إلى كسر حواجز التعليم التقليدي وتحويل الدراسة إلى رحلة ممتعة وتفاعلية تعتمد على أحدث التقنيات الذكية لخدمة الطالب الفلسطيني.
                </p>

                <p className="text-lg md:text-2xl opacity-95 leading-loose">
                    نوفر لطلابنا مكتبة ضخمة ومتجددة من الاختبارات الإلكترونية الدقيقة التي تحاكي نظام الامتحانات الرسمي، بالإضافة إلى شروحات مفصلة، أوراق عمل، وملفات دراسية تغطي كافة جوانب المنهاج. كل ذلك يتم بإشراف نخبة من الأساتذة المتميزين.
                </p>

                <p className="text-lg md:text-2xl opacity-95 leading-loose">
                    سواء كنت تسعى لتحسين معدلك، أو التحضير للامتحانات النهائية، أو حتى استكشاف موادك الدراسية بطريقة جديدة ومبتكرة، منصة إتقان صُممت خصيصاً لتكون بوابتك الأولى نحو التفوق، متاحة لك في أي وقت ومن أي مكان لترافقك خطوة بخطوة نحو النجاح.
                </p>

            </div>

        </div>
      </div>

    </section>
  );
};

export default PlatformInfo;
