
import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';

interface ServicesProps {
  onBack: () => void;
}

const Services: React.FC<ServicesProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 animate-fade-in flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6 px-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2 text-gray-600 font-bold"
            >
              <ArrowRight className="w-6 h-6" />
              العودة للرئيسية
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white p-12 rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 max-w-md w-full flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <Clock className="w-12 h-12 text-emerald-600" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-3">قريباً</h1>
            <p className="text-gray-500 text-lg font-medium">نعمل حالياً على تجهيز هذه الصفحة لخدمتكم بشكل أفضل</p>
        </div>
      </div>
    </div>
  );
};

export default Services;
