
import React, { useState, useEffect } from 'react';
import { ArrowRight, User, GraduationCap, Calendar, Send, Loader2, Minus, Plus, Type, X } from 'lucide-react';
import { Explanation } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface ExplanationViewerProps {
  explanation: Explanation;
  onBack: () => void;
}

const ExplanationViewer: React.FC<ExplanationViewerProps> = ({ explanation, onBack }) => {
  const { user } = useAuth();
  const [fontSize, setFontSize] = useState(20); // Default font size in pixels
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const handleSecurity = (e: Event) => e.preventDefault();
    document.addEventListener('contextmenu', handleSecurity);
    document.addEventListener('copy', handleSecurity);
    return () => {
      document.removeEventListener('contextmenu', handleSecurity);
      document.removeEventListener('copy', handleSecurity);
    };
  }, []);

  const handleSubmitReview = async () => {
    if (reviewRating === 0 || !explanation || !user) return;
    setIsSubmittingReview(true);
    try {
      await addDoc(collection(db, "reviews"), {
        type: 'explanation',
        targetId: explanation.id,
        targetTitle: explanation.title,
        teacherId: explanation.teacherId || 'المعلم',
        teacherName: explanation.teacherName || 'المعلم',
        rating: reviewRating,
        comment: reviewComment,
        studentId: user.uid,
        studentName: user.displayName,
        createdAt: serverTimestamp()
      });
      setReviewSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'جديد';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('ar-EG');
  };

  return (
    <div className={`min-h-screen animate-fade-in transition-all duration-700 pb-32 pt-20 ${explanation.backgroundStyle || 'exp-bg-default'}`}>
      
      {/* Floating Font Controls */}
      <div className="fixed bottom-10 left-5 z-[60] flex flex-col gap-2 group">
        <button 
          onClick={() => setFontSize(prev => Math.min(prev + 2, 40))}
          className="w-10 h-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-90 border border-white/20"
          title="تكبير الخط"
        >
          <Plus className="w-4 h-4" />
        </button>
        <div className="bg-black/50 backdrop-blur-md text-white text-[9px] font-black py-1 px-1.5 rounded-lg text-center border border-white/10">
          {fontSize}
        </div>
        <button 
          onClick={() => setFontSize(prev => Math.max(prev - 2, 14))}
          className="w-10 h-10 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-90 border border-white/20"
          title="تصغير الخط"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 relative">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 mb-6 font-black bg-black/20 hover:bg-black/40 text-white px-6 py-3 rounded-2xl transition-all border border-white/5 shadow-lg backdrop-blur-sm"
        >
          <ArrowRight className="w-5 h-5" /> عودة للقائمة
        </button>

        <div className="bg-white/5 backdrop-blur-sm rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/10 relative overflow-hidden">
          <h1 className="text-3xl md:text-5xl font-black mb-10 leading-tight tracking-tight border-b-4 border-emerald-500/20 pb-6">
            {explanation.title}
          </h1>
          
          <div 
            className="exp-content prose max-w-none leading-loose select-none overflow-x-auto"
            style={{ fontSize: `${fontSize}px` }}
            dangerouslySetInnerHTML={{ __html: explanation.content }}
          ></div>

          <div className="mt-16 pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-black opacity-60">
            <div className="flex items-center gap-2"><User className="w-4 h-4" /> إعداد: {explanation.teacherName}</div>
            <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4" /> الصف: {explanation.grade}</div>
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> تاريخ النشر: {formatDate(explanation.createdAt)}</div>
          </div>
        </div>

        {user && !reviewSubmitted && (
          <div className="mt-12 bg-black/40 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white/10 text-center shadow-2xl">
            <h3 className="text-2xl font-black text-white mb-8">قيم هذا الشرح لتعم الفائدة</h3>
            <div className="flex justify-center gap-2 mb-10 flex-wrap">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <button 
                  key={n} 
                  onClick={() => setReviewRating(n)} 
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-xl font-black text-lg transition-all ${reviewRating === n ? 'bg-emerald-600 text-white shadow-lg scale-125 z-10' : 'bg-gray-800/50 text-gray-500 hover:bg-gray-700 hover:text-gray-300'}`}
                >
                  {n}
                </button>
              ))}
            </div>
            <textarea 
              value={reviewComment} 
              onChange={(e) => setReviewComment(e.target.value)} 
              placeholder="أضف ملاحظاتك للمعلم لتحسين المحتوى..." 
              className="w-full h-32 bg-black/30 border border-white/10 rounded-2xl p-6 text-white outline-none focus:border-emerald-500 mb-8 resize-none shadow-inner" 
            />
            <button 
              onClick={handleSubmitReview} 
              disabled={isSubmittingReview || reviewRating === 0} 
              className="w-full md:w-auto px-12 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 mx-auto active:scale-95"
            >
              {isSubmittingReview ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />} إرسال التقييم الموثق
            </button>
          </div>
        )}
        
        {reviewSubmitted && (
          <div className="mt-12 text-center p-12 bg-emerald-900/40 border border-emerald-500/20 rounded-[3rem] shadow-xl animate-bounce-subtle backdrop-blur-md">
            <h3 className="text-3xl font-black text-emerald-400">شكراً لتقييمك الرائع! ✨</h3>
            <p className="text-emerald-300/60 mt-2 font-bold">رأيك يساعدنا على التطوير المستمر</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplanationViewer;
