
import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface JoinCTAProps {
    onLoginClick: () => void;
}

const JoinCTA: React.FC<JoinCTAProps> = ({ onLoginClick }) => {
  return (
    <section className="py-32 relative overflow-hidden">
        {/* Gradient Background - Ends in gray-950 to blend with next section */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-emerald-950/40 to-gray-950"></div>
        
        {/* Decorative Patterns */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-8 animate-pulse">
                <Sparkles className="w-4 h-4" />
                <span>انضم لعائلة المتميزين</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight tracking-tight drop-shadow-2xl">
                لا تنتظر المستقبل<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">اصنعه الآن</span>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
                ابدأ رحلتك التعليمية اليوم مع منصة إتقان. سجل مجاناً واحصل على وصول فوري لأفضل الاختبارات والشروحات.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                    onClick={onLoginClick}
                    className="w-full sm:w-auto bg-white text-emerald-950 px-10 py-5 rounded-2xl font-black text-xl hover:bg-emerald-50 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(16,185,129,0.4)] transform hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                    سجل مجاناً الآن
                    <ArrowRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    </section>
  );
};

export default JoinCTA;
