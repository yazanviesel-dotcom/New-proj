
import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, User, Flame, Award, Loader2, Flag, BookOpen, Search, Zap, Info, X, GraduationCap, School, Quote } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { UserProfile } from '../types';

const RANKS = [
    { minLevel: 1, title: 'مبتدئ طموح', icon: Flag, color: 'text-gray-400', border: 'border-gray-400', gradient: 'from-gray-500 to-gray-700' },
    { minLevel: 5, title: 'طالب مجتهد', icon: BookOpen, color: 'text-emerald-400', border: 'border-emerald-400', gradient: 'from-emerald-500 to-teal-600' },
    { minLevel: 10, title: 'مستكشف', icon: Search, color: 'text-blue-400', border: 'border-blue-400', gradient: 'from-blue-500 to-indigo-600' },
    { minLevel: 15, title: 'قائد أكاديمي', icon: Award, color: 'text-indigo-400', border: 'border-indigo-400', gradient: 'from-indigo-500 to-purple-600' },
    { minLevel: 20, title: 'عبقري', icon: Zap, color: 'text-purple-400', border: 'border-purple-400', gradient: 'from-purple-500 to-fuchsia-600' },
    { minLevel: 30, title: 'أسطورة', icon: Crown, color: 'text-amber-400', border: 'border-amber-400', gradient: 'from-amber-400 to-orange-600' },
];

interface AchievementsProps {
  onLoginClick: () => void;
}

const Achievements: React.FC<AchievementsProps> = ({ onLoginClick }) => {
  const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const LEADERBOARD_CACHE_KEY = 'etqan_leaderboard_cache_v3_safe'; 
      const LEADERBOARD_TTL = 24 * 60 * 60 * 1000; // 1 Day Cache
      
      const cachedLeaderboard = localStorage.getItem(LEADERBOARD_CACHE_KEY);
      const now = Date.now();
      let leaderboardData: UserProfile[] = [];
      let leaderboardValid = false;

      if (cachedLeaderboard) {
          try {
              const parsed = JSON.parse(cachedLeaderboard);
              if (now - parsed.timestamp < LEADERBOARD_TTL) {
                  leaderboardData = parsed.data;
                  leaderboardValid = true;
              }
          } catch (e) { console.error("Cache parse error", e); }
      }

      if (leaderboardValid) {
          setLeaderboard(leaderboardData);
      } else {
          try {
              const q = query(
                  collection(db, "users"),
                  orderBy("totalXP", "desc"),
                  limit(10) 
              );
              const snapshot = await getDocs(q);
              const users = snapshot.docs.map(doc => {
                  const data = doc.data();
                  return { 
                      ...data, 
                      uid: doc.id,
                      // CRITICAL: Sanitize timestamps to prevent circular JSON error
                      createdAt: data.createdAt ? { seconds: data.createdAt.seconds } : null,
                      lastQuizDate: data.lastQuizDate ? { seconds: data.lastQuizDate.seconds } : null,
                      subscriptionExpiry: data.subscriptionExpiry ? { seconds: data.subscriptionExpiry.seconds } : null
                  } as UserProfile;
              });
              
              setLeaderboard(users);
              localStorage.setItem(LEADERBOARD_CACHE_KEY, JSON.stringify({
                  timestamp: now,
                  data: users
              }));
          } catch (error) {
              console.error("Error fetching leaderboard:", error);
          }
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const getRankIcon = (index: number) => {
      switch(index) {
          case 0: return <Crown className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 fill-yellow-400" />;
          case 1: return <Medal className="w-5 h-5 md:w-6 md:h-6 text-gray-300 fill-gray-300" />;
          case 2: return <Medal className="w-5 h-5 md:w-6 md:h-6 text-amber-600 fill-amber-600" />;
          default: return <Trophy className="w-4 h-4 md:w-5 md:h-5 text-emerald-600/50" />;
      }
  };

  const getStudentRankInfo = (xp: number) => {
      const level = Math.floor((xp || 0) / 500) + 1;
      return [...RANKS].reverse().find(r => level >= r.minLevel) || RANKS[0];
  };

  const getAvatarBorderClass = (xp: number) => {
      const lvl = Math.floor((xp || 0) / 500) + 1;
      if (lvl >= 30) return 'border-red-600 ring-2 ring-red-600/50 shadow-[0_0_15px_rgba(220,38,38,0.5)]'; // Legendary
      if (lvl >= 20) return 'border-orange-700 ring-1 ring-orange-700/30'; // Dark Orange
      if (lvl >= 15) return 'border-yellow-400 ring-1 ring-yellow-400/30'; // Yellow
      if (lvl >= 10) return 'border-blue-800 ring-1 ring-blue-800/30'; // Dark Blue
      if (lvl >= 5) return 'border-emerald-500 ring-1 ring-emerald-500/30'; // Green
      return 'border-gray-600'; // Gray
  };

  return (
    <section className="py-12 md:py-20 relative overflow-hidden bg-gray-950" id="achievements">
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-20 w-72 h-72 bg-emerald-900/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-1/4 -left-20 w-72 h-72 bg-blue-900/10 rounded-full blur-[80px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-5xl font-black mb-3 drop-shadow-lg flex items-center justify-center gap-2">
                <Trophy className="w-8 h-8 md:w-10 md:h-10 text-yellow-500" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">لوحة الشرف</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-lg">
                أبطال منصة إتقان المتميزين (أفضل 10)
            </p>
        </div>

        <div className="flex justify-center">
            
            <div className="w-full max-w-3xl">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-[2rem] border border-white/10 p-4 md:p-8 shadow-2xl relative">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                            <Flame className="w-5 h-5 text-orange-500" />
                            الأكثر تفاعلاً
                        </h3>
                        <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-medium bg-gray-800 text-gray-400 px-3 py-1.5 rounded-full border border-gray-700">
                            <Info className="w-3 h-3 md:w-3.5 md:h-3.5 text-blue-400" />
                            يتم تحديث القائمة دورياً
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
                            <p className="text-gray-500 text-xs font-bold">جاري تحميل الأبطال...</p>
                        </div>
                    ) : leaderboard.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 text-sm">
                            <p>لم يتم تسجيل نقاط بعد، كن الأول!</p>
                        </div>
                    ) : (
                        <div className="space-y-2 md:space-y-3">
                            {leaderboard.map((student, idx) => (
                                <div 
                                    key={idx}
                                    onClick={() => setSelectedStudent(student)}
                                    className={`relative flex items-center justify-between p-3 md:p-4 rounded-2xl border transition-all active:scale-98 cursor-pointer
                                        ${idx === 0 ? 'bg-gradient-to-r from-yellow-900/20 to-gray-900 border-yellow-500/30 shadow-lg shadow-yellow-900/10' : 
                                          idx === 1 ? 'bg-gray-800/60 border-gray-600/50' : 
                                          idx === 2 ? 'bg-gray-800/40 border-amber-800/40' : 'bg-gray-900 border-gray-800 hover:bg-gray-800'}`}
                                >
                                    <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                                        <div className={`flex items-center justify-center w-6 md:w-8 font-black text-base md:text-lg ${idx < 3 ? 'text-white' : 'text-gray-600'}`}>
                                            {idx < 3 ? getRankIcon(idx) : idx + 1}
                                        </div>
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shrink-0 border-2 transition-all duration-300 ${getAvatarBorderClass(student.totalXP || 0)}`}>
                                            {student.avatar ? (
                                                <img src={student.avatar} alt={student.displayName} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-full h-full p-2 text-gray-400 bg-gray-800" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-white text-sm md:text-base truncate">{student.displayName}</h4>
                                            <div className="flex items-center gap-1 text-[10px] md:text-xs text-gray-400 truncate">
                                                <GraduationCap className="w-3 h-3" />
                                                {student.school || 'مدرسة إتقان'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="shrink-0 flex items-center gap-1 md:gap-2 bg-black/30 px-2 md:px-3 py-1 rounded-lg border border-white/5">
                                        <span className="font-black text-emerald-400 text-sm md:text-base">{student.totalXP || 0}</span>
                                        <span className="text-[10px] text-gray-500 font-bold">XP</span>
                                    </div>
                                    
                                    {idx === 0 && (
                                        <div className="absolute -top-1 -right-1 pointer-events-none">
                                            <span className="flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-gray-900 w-full max-w-sm rounded-[2.5rem] overflow-hidden border border-gray-700 shadow-2xl relative animate-fade-in-up">
                
                <button 
                    onClick={() => setSelectedStudent(null)}
                    className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors z-20"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className={`h-32 bg-gradient-to-br ${getStudentRankInfo(selectedStudent.totalXP || 0).gradient} relative`}>
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                </div>

                <div className="px-6 pb-8 -mt-16 text-center relative z-10">
                    <div className={`w-32 h-32 mx-auto rounded-full border-[6px] overflow-hidden shadow-xl mb-4 bg-gray-800 ${getAvatarBorderClass(selectedStudent.totalXP || 0)}`}>
                        {selectedStudent.avatar ? (
                            <img src={selectedStudent.avatar} alt={selectedStudent.displayName} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-full h-full p-6 text-gray-500" />
                        )}
                    </div>

                    <h2 className="text-2xl font-black text-white mb-1">{selectedStudent.displayName}</h2>
                    
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-4">
                        <School className="w-3 h-3" />
                        {selectedStudent.school || 'مدرسة إتقان'}
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-800 border border-gray-700 mb-6 shadow-sm">
                        {React.createElement(getStudentRankInfo(selectedStudent.totalXP || 0).icon, { className: `w-4 h-4 ${getStudentRankInfo(selectedStudent.totalXP || 0).color}` })}
                        <span className={`text-sm font-bold ${getStudentRankInfo(selectedStudent.totalXP || 0).color}`}>
                            {getStudentRankInfo(selectedStudent.totalXP || 0).title}
                        </span>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700/50 mb-6 relative">
                        <Quote className="w-6 h-6 text-gray-600 absolute -top-3 right-4 bg-gray-900 px-1" />
                        <p className="text-gray-300 text-sm font-medium leading-relaxed italic">
                            "تفتخر منصة إتقان بوجود طالب مثابر مثلك ضمن عائلتها. هذا الإنجاز هو ثمرة جهدك واجتهادك، ونتمنى لك دوام التفوق والنجاح."
                        </p>
                    </div>

                    <div className="pt-4 border-t border-gray-800">
                        <div className="flex justify-between items-center px-4">
                            <div className="text-center">
                                <div className="text-xl md:text-2xl text-emerald-500" style={{ fontFamily: "'Great Vibes', cursive" }}>Yazan Abu Kahil</div>
                                <div className="text-[9px] text-gray-600 mt-1 font-bold">أ. يزن أبو كحيل</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl md:text-2xl text-blue-500" style={{ fontFamily: "'Great Vibes', cursive" }}>Majd Al-Din</div>
                                <div className="text-[9px] text-gray-600 mt-1 font-bold">أ. مجد الدين الحاج</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

    </section>
  );
};

export default Achievements;
