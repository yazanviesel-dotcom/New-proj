
import React from 'react';
import { AlertTriangle, RefreshCw, MessageCircle, WifiOff, Globe } from 'lucide-react';

const GlobalFallback: React.FC = () => {
  const handleReload = () => {
    window.location.reload();
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/972568401548', '_blank');
  };

  const isOnline = navigator.onLine;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 text-center animate-fade-in relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-900/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-md w-full bg-gray-900 border border-gray-800 rounded-[2.5rem] p-8 shadow-2xl">
        
        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-gray-700 shadow-inner">
          {isOnline ? (
              <Globe className="w-10 h-10 text-yellow-500/80" />
          ) : (
              <WifiOff className="w-10 h-10 text-red-500/80" />
          )}
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
          {isOnline ? 'الاتصال بطيء' : 'انقطع الاتصال'}
        </h2>
        
        <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 font-medium">
          {isOnline 
            ? 'استغرق تحميل البيانات وقتاً أطول من المعتاد. يرجى التحقق من سرعة الإنترنت لديك.' 
            : 'يبدو أنك غير متصل بالإنترنت. يرجى التحقق من الشبكة والمحاولة مرة أخرى.'}
        </p>

        <div className="space-y-3">
          <button 
            onClick={handleReload}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
          >
            <RefreshCw className="w-5 h-5" />
            تحديث الصفحة
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="flex-shrink-0 mx-4 text-gray-500 text-xs font-bold">أو</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <p className="text-gray-300 text-xs font-bold mb-3">
              إذا استمرت المشكلة، يرجى التواصل مع الدعم الفني:
            </p>
            <div className="flex items-center justify-between bg-gray-900 p-3 rounded-lg border border-gray-700">
                <div className="text-right">
                    <p className="text-white font-bold text-sm">أ. يزن أبو كحيل</p>
                    <p className="text-emerald-500 text-xs dir-ltr">Admin Support</p>
                </div>
                <button 
                    onClick={handleWhatsApp}
                    className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-2 rounded-full transition-colors shadow-md"
                >
                    <MessageCircle className="w-5 h-5" />
                </button>
            </div>
          </div>
        </div>

      </div>
      
      <p className="mt-8 text-gray-600 text-xs font-mono">Status: {isOnline ? 'ONLINE_TIMEOUT' : 'OFFLINE'} / RETRY_PENDING</p>
    </div>
  );
};

export default GlobalFallback;
