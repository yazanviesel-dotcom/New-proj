
import React, { useState, useEffect } from 'react';
import { Quote, Share2 } from 'lucide-react';

const WISDOMS = [
  { text: "التعليم هو جواز السفر للمستقبل، لأن الغد ينتمي لأولئك الذين يستعدون له اليوم.", author: "مالكوم إكس", color: "from-emerald-600 to-teal-700", bg: "bg-emerald-600" },
  { text: "لا تطلب سرعة العمل بل تجويده، لأن الناس لا يسألون كم استغرقت بل ينظرون إلى إتقانه.", author: "أفلاطون", color: "from-blue-600 to-indigo-700", bg: "bg-blue-600" },
  { text: "النجاح ليس مفتاح السعادة، بل السعادة هي مفتاح النجاح.", author: "ألبرت شفايتزر", color: "from-yellow-600 to-amber-700", bg: "bg-amber-600" },
  { text: "العلم في الصغر كالنقش على الحجر.", author: "حكمة عربية", color: "from-rose-600 to-pink-700", bg: "bg-rose-600" },
  { text: "من جد وجد، ومن زرع حصد، ومن سار على الدرب وصل.", author: "حكمة عربية", color: "from-purple-600 to-violet-700", bg: "bg-purple-600" },
];

const InspirationBanner: React.FC = () => {
  const [currentWisdom, setCurrentWisdom] = useState(WISDOMS[0]);

  useEffect(() => {
    // Pick one random wisdom on mount only
    const randomIndex = Math.floor(Math.random() * WISDOMS.length);
    setCurrentWisdom(WISDOMS[randomIndex]);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`"${currentWisdom.text}" - ${currentWisdom.author}`);
    alert("تم نسخ الحكمة!");
  };

  return (
    <div className="py-16 bg-gray-950 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-6">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 md:p-12 text-center relative shadow-xl">
                
                {/* Static Quote Icon */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentWisdom.color} flex items-center justify-center shadow-lg`}>
                        <Quote className="w-6 h-6 text-white fill-white" />
                    </div>
                </div>

                {/* Content */}
                <div className="mt-4">
                    <h2 className="text-2xl md:text-3xl font-black leading-relaxed tracking-wide text-white mb-6">
                        "{currentWisdom.text}"
                    </h2>
                    <p className="text-gray-400 font-bold text-lg flex items-center justify-center gap-2">
                        <span className={`w-8 h-0.5 bg-gradient-to-r ${currentWisdom.color} rounded-full`}></span>
                        {currentWisdom.author}
                        <span className={`w-8 h-0.5 bg-gradient-to-r ${currentWisdom.color} rounded-full`}></span>
                    </p>
                </div>

                {/* Simple Copy Button */}
                <button 
                    onClick={copyToClipboard}
                    className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white bg-gray-800 rounded-full transition-colors"
                    title="نسخ الحكمة"
                >
                    <Share2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    </div>
  );
};

export default InspirationBanner;
