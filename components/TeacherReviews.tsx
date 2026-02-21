
import React, { useState, useEffect } from 'react';
import { ArrowRight, MessageSquare, Star, Loader2, Calendar, Filter, Home, User } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs, where, limit } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { AppView } from '../types';

interface TeacherReviewsProps {
  onBack?: () => void;
  onNavigate: (view: AppView) => void;
}

interface Review {
    id: string;
    type: 'quiz' | 'explanation';
    targetTitle: string;
    studentName: string;
    rating: number;
    comment?: string;
    createdAt: any;
}

const TeacherReviews: React.FC<TeacherReviewsProps> = ({ onBack, onNavigate }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'QUIZ' | 'EXPLANATION'>('ALL');

  useEffect(() => {
      fetchReviews();
  }, []);

  const fetchReviews = async () => {
      setLoading(true);
      const CACHE_KEY = `etqan_teacher_reviews_v1`;
      const CACHE_TTL = 365 * 24 * 60 * 60 * 1000; 
      const now = Date.now();

      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
          try {
              const { data, timestamp } = JSON.parse(cached);
              if (now - timestamp < CACHE_TTL) {
                  setReviews(data);
                  setLoading(false);
                  return;
              }
          } catch (e) { console.error(e); }
      }

      try {
          const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"), limit(50));
          const snapshot = await getDocs(q);
          const fetchedReviews = snapshot.docs.map(docSnap => {
              const d = docSnap.data();
              // STRICT POJO Mapping
              return { 
                id: docSnap.id, 
                type: d.type as any,
                targetTitle: String(d.targetTitle || ''),
                studentName: String(d.studentName || ''),
                rating: Number(d.rating || 0),
                comment: String(d.comment || ''),
                createdAt: d.createdAt ? { seconds: d.createdAt.seconds } : null
              } as Review;
          });
          
          setReviews(fetchedReviews);
          localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: now, data: fetchedReviews }));
      } catch (error) {
          console.error("Error fetching reviews:", error);
      } finally {
          setLoading(false);
      }
  };

  const filteredReviews = reviews.filter(r => {
      if (filter === 'ALL') return true;
      if (filter === 'QUIZ') return r.type === 'quiz';
      if (filter === 'EXPLANATION') return r.type === 'explanation';
      return true;
  });

  const formatDate = (timestamp: any) => {
      if (!timestamp) return '';
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString('ar-EG');
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : '0.0';

  return (
    <div className="min-h-screen bg-gray-950 animate-fade-in transition-colors duration-300 text-gray-100">
        <div className="max-w-5xl mx-auto px-4 pt-2 pb-2 relative z-30">
            <div className="flex items-center gap-3">
                <button onClick={() => onNavigate('PROFILE')} className="p-2 bg-gray-900/50 hover:bg-gray-800 rounded-xl transition-all text-gray-400 hover:text-white border border-white/10 shadow-lg backdrop-blur-sm group">
                <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                    <h1 className="text-lg font-black text-white tracking-tight mb-0.5">التعليقات والتقييمات</h1>
                    <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-medium text-gray-500">
                        <span onClick={() => onNavigate('PROFILE')} className="hover:text-emerald-400 cursor-pointer transition-colors flex items-center gap-1">
                        <Home className="w-3 h-3" /> الرئيسية
                        </span>
                        <span className="text-gray-700">/</span>
                        <span className="text-emerald-500 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            مراجعات الطلاب
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="bg-gray-900 rounded-3xl shadow-xl border border-gray-700 p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-yellow-900/20 rounded-2xl flex items-center justify-center border border-yellow-500/20 text-yellow-400">
                        <Star className="w-8 h-8 fill-yellow-400" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white">{avgRating}</h2>
                        <p className="text-gray-400 text-sm font-bold">متوسط التقييم العام</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-center px-6 py-3 bg-gray-800 rounded-xl border border-gray-700">
                        <span className="block text-2xl font-bold text-white">{reviews.length}</span>
                        <span className="text-xs text-gray-400">إجمالي التقييمات</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                <button onClick={() => setFilter('ALL')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${filter === 'ALL' ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>الكل</button>
                <button onClick={() => setFilter('QUIZ')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${filter === 'QUIZ' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>تقييمات الاختبارات</button>
                <button onClick={() => setFilter('EXPLANATION')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${filter === 'EXPLANATION' ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>تقييمات الشروحات</button>
            </div>

            <div className="bg-gray-900 rounded-3xl border border-gray-700 min-h-[400px] p-6 relative">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                    </div>
                ) : filteredReviews.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                        <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg font-bold">لا توجد تعليقات في هذا القسم</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredReviews.map((review) => (
                            <div key={review.id} className="bg-gray-800 p-5 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-bold text-white text-lg flex items-center gap-2">
                                            {review.studentName}
                                            <span className="text-xs font-normal text-gray-500 bg-gray-900 px-2 py-0.5 rounded-md border border-gray-700">{formatDate(review.createdAt)}</span>
                                        </h4>
                                        <div className="flex items-center gap-1 mt-1">
                                            {[...Array(5)].map((_, i) => (<Star key={i} className={`w-3 h-3 ${i < Math.round(review.rating / 2) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />))}
                                            <span className="text-xs text-yellow-500 font-bold mr-1">({review.rating}/10)</span>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${review.type === 'quiz' ? 'bg-blue-900/30 text-blue-300 border border-blue-900' : 'bg-purple-900/30 text-purple-300 border border-purple-900'}`}>{review.type === 'quiz' ? 'امتحان' : 'شرح'}</span>
                                </div>
                                <div className="mb-3">
                                    <span className="text-xs text-gray-500 block mb-1">على المحتوى:</span>
                                    <p className="text-emerald-400 font-bold text-sm line-clamp-1">{review.targetTitle}</p>
                                </div>
                                {review.comment ? (<div className="bg-gray-900/50 p-3 rounded-xl border border-gray-700/50"><p className="text-gray-300 text-sm leading-relaxed">"{review.comment}"</p></div>) : (<p className="text-gray-600 text-xs italic">لا يوجد تعليق مكتوب</p>)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default TeacherReviews;
