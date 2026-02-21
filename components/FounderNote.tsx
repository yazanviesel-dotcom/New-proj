
import React from 'react';

const FounderNote: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gray-950">
      
      {/* Full Width Container */}
      <div className="w-full h-[650px] md:h-[900px] relative group">
            
            {/* Image Background Layer */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://lh3.googleusercontent.com/d/11PvY6sdTvurXqkNuWjoEpYTcM8FUHOB0" 
                    alt="أ. يزن أبو كحيل - مؤسس المنصة" 
                    className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105"
                />
                {/* Gradient Overlay for Text Readability & Dark Edges */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-transparent to-gray-950/90"></div>
            </div>

            {/* Content Container - Centered at Bottom */}
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-24 flex flex-col items-center text-center z-20">
                
                <div className="max-w-5xl mx-auto transform translate-y-0 transition-all duration-700">
                    
                    {/* Name & Title */}
                    <div className="mb-8">
                        <h2 className="text-5xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl tracking-tight">
                            أ. يزن أبو كحيل
                        </h2>
                        <div className="h-2 w-40 bg-emerald-500 rounded-full mx-auto mb-8 shadow-[0_0_20px_rgba(16,185,129,0.6)]"></div>
                        <p className="text-2xl md:text-4xl text-emerald-400 font-bold drop-shadow-lg tracking-wide">
                            مؤسس ومدير عام المنصة
                        </p>
                    </div>

                    {/* Text Box */}
                    <div className="relative">
                        <p className="text-gray-200 text-xl md:text-3xl leading-loose font-medium relative z-10 px-4 max-w-4xl mx-auto drop-shadow-md">
                            بنينا هذه المنصة لتكون منارةً للعلم، ورفيقاً للطالب في رحلة تفوقه. طموحنا لا حدود له، وهدفنا أن نضع بين أيديكم أفضل تجربة تعليمية تليق بمستقبلكم.
                        </p>
                    </div>

                </div>

            </div>

      </div>
    </section>
  );
};

export default FounderNote;
