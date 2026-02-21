
import React from 'react';
import { Users, BookOpen, FileText, Monitor, Activity } from 'lucide-react';

const ImpactStats: React.FC = () => {
  // Static data - Zero Database Reads
  const stats = [
    {
      id: 1,
      label: "طالب وطالبة",
      value: "+500",
      icon: Users,
      gradient: "from-blue-400 via-indigo-400 to-cyan-400",
      shadow: "hover:shadow-blue-500/20",
      border: "group-hover:border-blue-500/50",
      bgIcon: "bg-blue-500/10 text-blue-400"
    },
    {
      id: 2,
      label: "اختبار إلكتروني",
      value: "+50",
      icon: BookOpen,
      gradient: "from-emerald-400 via-green-400 to-teal-400",
      shadow: "hover:shadow-emerald-500/20",
      border: "group-hover:border-emerald-500/50",
      bgIcon: "bg-emerald-500/10 text-emerald-400"
    },
    {
      id: 3,
      label: "ملف دراسي",
      value: "+20",
      icon: FileText,
      gradient: "from-amber-400 via-orange-400 to-yellow-400",
      shadow: "hover:shadow-amber-500/20",
      border: "group-hover:border-amber-500/50",
      bgIcon: "bg-amber-500/10 text-amber-400"
    },
    {
      id: 4,
      label: "شرح تفاعلي",
      value: "+30",
      icon: Monitor,
      gradient: "from-purple-400 via-fuchsia-400 to-pink-400",
      shadow: "hover:shadow-purple-500/20",
      border: "group-hover:border-purple-500/50",
      bgIcon: "bg-purple-500/10 text-purple-400"
    }
  ];

  return (
    <section className="py-20 bg-gray-950 relative overflow-hidden border-t border-white/5">
      
      {/* Background Decor - Lightweight CSS Shapes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[20%] w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[20%] right-[20%] w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header with Heartbeat Effect */}
        <div className="flex flex-col items-center justify-center mb-16 text-center">
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping duration-[3s]"></div>
                <div className="relative p-4 bg-gray-900 rounded-full border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <Activity className="w-10 h-10 text-emerald-400 animate-pulse" />
                </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
                نبض <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">الإنجاز</span>
            </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, index) => (
            <div key={stat.id} className="group relative" style={{ animationDelay: `${index * 100}ms` }}>
              
              {/* Card Container */}
              <div className={`
                  relative h-full bg-gray-900/40 backdrop-blur-xl rounded-[2rem] p-6 
                  border border-white/5 ${stat.border} transition-all duration-500 
                  hover:-translate-y-2 hover:shadow-2xl ${stat.shadow}
                  flex flex-col items-center justify-center text-center overflow-hidden
              `}>
                
                {/* Hover Glow Background */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${stat.gradient}`}></div>
                
                {/* Icon Circle */}
                <div className={`mb-4 p-4 rounded-2xl ${stat.bgIcon} border border-white/5 group-hover:scale-110 transition-transform duration-300 relative z-10 shadow-lg`}>
                    <stat.icon className="w-8 h-8" strokeWidth={1.5} />
                </div>

                {/* Number with Gradient */}
                <div className={`text-3xl md:text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-br ${stat.gradient} tracking-tight drop-shadow-sm relative z-10`}>
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-gray-400 text-xs md:text-sm font-bold relative z-10 group-hover:text-white transition-colors">
                  {stat.label}
                </div>

                {/* Decorative Shine */}
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ImpactStats;
