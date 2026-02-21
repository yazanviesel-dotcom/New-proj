
import React from 'react';
import { Star, ArrowRight } from 'lucide-react';
import StarsBackground from './StarsBackground';

interface PlatformDefinitionSectionProps {
  onNavigate: () => void;
}

const PlatformDefinitionSection: React.FC<PlatformDefinitionSectionProps> = ({ onNavigate }) => {
  return (
    <div className="relative w-full py-20 overflow-hidden bg-gray-950 border-t border-white/5 border-b border-white/5">
        
        {/* Stars Background within the section */}
        <div className="absolute inset-0 z-0 opacity-100">
            <StarsBackground />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-transparent to-gray-950 z-0 pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            
            {/* Glowing Icon */}
            <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-full mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-white/10 animate-pulse">
                <Star className="w-8 h-8 text-emerald-400 fill-emerald-400" />
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-2xl leading-tight">
                ما هي منصة <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">إتقان</span>؟
            </h2>

            <p className="text-gray-300 text-xl md:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed font-medium drop-shadow-md">
                بيئة تعليمية فلسطينية متكاملة تهدف لكسر الروتين الدراسي وتحويل التعلم إلى رحلة تفاعلية ممتعة تقودك نحو التفوق.
            </p>

            <button 
                onClick={onNavigate}
                className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-bold px-10 py-4 rounded-2xl shadow-lg hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all transform hover:-translate-y-1 border-b-4 border-emerald-800 hover:border-emerald-700 active:border-b-0 active:translate-y-1"
            >
                <span>اكتشف المزيد</span>
                <ArrowRight className="w-5 h-5" />
            </button>

        </div>
    </div>
  );
};

export default PlatformDefinitionSection;
