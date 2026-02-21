
import React from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { AppView } from '../types';

interface ContactCTAProps {
  onNavigate: (view: AppView) => void;
}

const ContactCTA: React.FC<ContactCTAProps> = ({ onNavigate }) => {
  return (
    <section className="py-24 relative overflow-hidden bg-gray-950 border-t border-white/5">
        
        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-900/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
            
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl mb-8 border border-white/10 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <MessageCircle className="w-10 h-10 text-emerald-400" />
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
                عندك سؤال أو استفسار؟
            </h2>
            
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                فريق المعلمين في منصة إتقان جاهز دائماً لمساعدتك. تواصل معنا مباشرة للحصول على الدعم الأكاديمي أو التقني.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                
                {/* Avatars */}
                <div className="flex items-center -space-x-4 space-x-reverse">
                    <div className="w-14 h-14 rounded-full border-4 border-gray-950 overflow-hidden bg-gray-800 shadow-lg relative z-20">
                        <img src="https://lh3.googleusercontent.com/d/1tbzVNKO3FGH46Pa6MZ58OWD4BXVKdK5P" alt="Teacher" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-14 h-14 rounded-full border-4 border-gray-950 overflow-hidden bg-gray-800 shadow-lg relative z-10">
                        <img src="https://lh3.googleusercontent.com/d/1xPDpcaUPz3IH-pqv-Jgplroi6U27BVVj" alt="Teacher" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-14 h-14 rounded-full border-4 border-gray-950 bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400 shadow-lg relative z-0">
                        +2
                    </div>
                </div>

                <button 
                    onClick={() => onNavigate('CONTACT_TEACHER')}
                    className="group relative bg-white text-gray-900 px-8 py-4 rounded-2xl font-black text-lg hover:bg-emerald-50 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] flex items-center gap-3 transform hover:-translate-y-1"
                >
                    تواصل مع المعلم
                    <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform text-emerald-600" />
                </button>
            </div>

        </div>
    </section>
  );
};

export default ContactCTA;
