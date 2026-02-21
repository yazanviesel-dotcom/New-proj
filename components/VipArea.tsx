
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Crown, Lock, BarChart3, TrendingUp, Home, ArrowRight, Target, FileText, BookOpen, Sparkles, Award, Scroll, CheckCircle2, Download, Star, X, ChevronLeft } from 'lucide-react';
import { AppView } from '../types';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
// @ts-ignore
import html2canvas from 'html2canvas';
// @ts-ignore
import jsPDF from 'jspdf';

interface VipAreaProps {
  onNavigate: (view: AppView) => void;
}

type VipSection = 'MENU' | 'ANALYSIS' | 'CERTIFICATE_PREVIEW';

const VipArea: React.FC<VipAreaProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<VipSection>('MENU');
  
  // Certificate State
  const [showCertificateConfirm, setShowCertificateConfirm] = useState(false);
  const [showDownloadSuccess, setShowDownloadSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Logic: Check real subscription status including expiry
  const isSubscribed = () => {
      if (!user?.isSubscriber) return false;
      if (!user.subscriptionExpiry) return false;
      const expiry = user.subscriptionExpiry.seconds 
        ? user.subscriptionExpiry.seconds * 1000 
        : new Date(user.subscriptionExpiry).getTime();
      return Date.now() < expiry;
  };

  const isUserVIP = isSubscribed() || user?.role === 'teacher';

  // --- Analysis State ---
  const [analysisStats, setAnalysisStats] = useState({ grammar: 0, vocab: 0, reading: 0, total: 0, overallAvg: 0 });
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // Calculate Level for Certificate restriction
  const currentLevel = user ? Math.floor((user.totalXP || 0) / 500) + 1 : 1;
  // Certificate available to all VIPs regardless of level now
  
  useEffect(() => {
      if (isUserVIP) {
          calculateAnalysis();
      }
  }, [user]);

  const calculateAnalysis = async () => {
      setLoadingAnalysis(true);
      const CACHE_KEY = `etqan_quiz_history_${user?.uid}`;
      const cached = localStorage.getItem(CACHE_KEY);
      
      if (cached) {
          try {
              const { history } = JSON.parse(cached);
              processHistory(history);
              setLoadingAnalysis(false);
              return;
          } catch(e) { console.error(e); }
      }

      try {
          const q = query(collection(db, "quiz_results"), where("userId", "==", user?.uid));
          const snap = await getDocs(q);
          const history = snap.docs.map(doc => doc.data());
          processHistory(history);
      } catch (e) { console.error(e); }
      finally { setLoadingAnalysis(false); }
  };

  const processHistory = (history: any[]) => {
      let grammarScore = 0, grammarCount = 0;
      let vocabScore = 0, vocabCount = 0;
      let readingScore = 0, readingCount = 0;
      let totalPercentage = 0;

      history.forEach(h => {
          if (h.quizTitle.includes('قواعد') || h.quizTitle.includes('Grammar')) {
              grammarScore += h.percentage; grammarCount++;
          } else if (h.quizTitle.includes('كلمات') || h.quizTitle.includes('Vocab')) {
              vocabScore += h.percentage; vocabCount++;
          } else {
              readingScore += h.percentage; readingCount++;
          }
          totalPercentage += h.percentage;
      });

      setAnalysisStats({
          grammar: grammarCount ? Math.round(grammarScore / grammarCount) : 0,
          vocab: vocabCount ? Math.round(vocabScore / vocabCount) : 0,
          reading: readingCount ? Math.round(readingScore / readingCount) : 0,
          total: history.length,
          overallAvg: history.length ? Math.round(totalPercentage / history.length) : 0
      });
  };

  const handleBack = () => {
      if (activeSection !== 'MENU') {
          setActiveSection('MENU');
      } else {
          onNavigate('HOME');
      }
  };

  // Certificate Logic
  const handleOpenCertificatePreview = () => {
      setActiveSection('CERTIFICATE_PREVIEW');
  };

  const handleExportCertificate = async () => {
    setShowCertificateConfirm(false);
    setIsExporting(true);
    // Certificate is hidden but present in DOM
    const element = document.getElementById('certificate-node');
    if (element) {
        try {
            const canvas = await html2canvas(element, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`certificate-${user?.displayName || 'student'}.pdf`);
            
            // Show Success UI
            setShowDownloadSuccess(true);
            setTimeout(() => setShowDownloadSuccess(false), 4000);

        } catch (err) {
            console.error(err);
            alert("حدث خطأ أثناء تصدير الشهادة");
        } finally {
            setIsExporting(false);
        }
    } else {
        setIsExporting(false);
    }
  };

  // --- LOCKED VIEW (Non-Subscriber) ---
  if (!isUserVIP) {
      return (
        <div className="min-h-screen bg-[#050505] animate-fade-in flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Premium Background for Locked State */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-amber-900/20 via-black to-black pointer-events-none"></div>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px]"></div>

            <div className="relative z-10 max-w-lg w-full bg-gray-900/80 backdrop-blur-xl border border-amber-500/30 rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl shadow-amber-900/20">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.5)] border-4 border-gray-900">
                        <Lock className="w-8 h-8 text-white drop-shadow-md" />
                    </div>
                </div>

                <div className="mt-8 mb-8">
                    <h2 className="text-3xl font-black text-white mb-2 tracking-tight">مساحة المتميزين VIP</h2>
                    <p className="text-amber-400 font-medium text-sm">هذا المحتوى حصري للمشتركين في الباقة الذهبية</p>
                </div>

                <div className="space-y-4 mb-10 text-right">
                    <div className="flex items-center gap-4 bg-gray-800/50 p-4 rounded-2xl border border-gray-700/50">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                            <BarChart3 className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-sm">تحليل نقاط الضعف</h4>
                            <p className="text-gray-400 text-xs">تقرير ذكي يحدد لك ما تحتاج لتقويته لتحسين معدلك.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-gray-800/50 p-4 rounded-2xl border border-gray-700/50">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                            <Award className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-sm">شهادات التقدير</h4>
                            <p className="text-gray-400 text-xs">إمكانية إصدار شهادات موثقة عند تحقيق مستويات متقدمة.</p>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => onNavigate('SERVICES')}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white font-black text-lg shadow-lg hover:shadow-amber-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                    <Crown className="w-5 h-5 fill-white" />
                    اشترك الآن واحصل على التميز
                </button>
                
                <button onClick={() => onNavigate('HOME')} className="mt-6 text-gray-500 text-sm font-bold hover:text-white transition-colors">
                    العودة للرئيسية
                </button>
            </div>
        </div>
      );
  }

  // --- SUBSCRIBER VIEW ---
  return (
    <div className="min-h-screen bg-[#020202] animate-fade-in text-gray-100 pb-20 relative overflow-hidden">
        
        {/* Premium Royal Theme Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03]"></div>
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-[150px]"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-900/5 rounded-full blur-[150px]"></div>
        </div>

        {/* Integrated Header - Compact Style */}
        <div className="max-w-6xl mx-auto px-4 pt-2 pb-2 relative z-30">
            <div className="flex items-center gap-3">
                <button 
                onClick={handleBack}
                className="p-2 bg-gray-900/50 hover:bg-amber-900/20 rounded-xl transition-all text-gray-400 hover:text-amber-400 border border-white/5 hover:border-amber-500/30 shadow-lg backdrop-blur-sm group"
                >
                <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                    <h1 className="text-lg font-black text-white tracking-tight mb-0.5 flex items-center gap-2">
                        مساحة المتميزين
                        <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                    </h1>
                    <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-medium text-gray-500">
                        <span onClick={() => onNavigate('HOME')} className="hover:text-amber-400 cursor-pointer transition-colors flex items-center gap-1">
                        <Home className="w-3 h-3" /> الرئيسية
                        </span>
                        <span className="text-gray-700">/</span>
                        <span className="text-amber-500 flex items-center gap-1">
                            {activeSection === 'ANALYSIS' ? 'تحليل الأداء' : activeSection === 'CERTIFICATE_PREVIEW' ? 'شهادة التقدير' : 'القائمة الرئيسية'}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6 relative z-10">
            
            {/* MAIN MENU */}
            {activeSection === 'MENU' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    
                    {/* Performance Analysis Card */}
                    <button
                        onClick={() => setActiveSection('ANALYSIS')}
                        className="group relative w-full bg-[#080808] rounded-[2.5rem] p-8 border border-white/5 hover:border-amber-500/30 transition-all duration-500 shadow-xl overflow-hidden text-right h-64 flex flex-col justify-center"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                        
                        <div className="relative z-10 flex flex-col items-center text-center gap-4">
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                <BarChart3 className="w-10 h-10 text-amber-500" />
                            </div>
                            
                            <div>
                                <h3 className="text-2xl font-black text-white mb-2 group-hover:text-amber-100 transition-colors">تحليل الأداء</h3>
                                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                                    تعرف على نقاط قوتك وضعفك من خلال تقارير ذكية
                                </p>
                            </div>
                        </div>
                    </button>

                    {/* Certificate Card */}
                    <button
                        onClick={handleOpenCertificatePreview}
                        className="group relative w-full bg-[#080808] rounded-[2.5rem] p-8 border transition-all duration-500 shadow-xl overflow-hidden text-right h-64 flex flex-col justify-center border-white/5 hover:border-emerald-500/30"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                        
                        <div className="relative z-10 flex flex-col items-center text-center gap-4">
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 border flex items-center justify-center shrink-0 transition-transform duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)] border-emerald-500/20 group-hover:scale-110">
                                <Scroll className="w-10 h-10 text-emerald-500" />
                            </div>
                            
                            <div>
                                <h3 className="text-2xl font-black text-white mb-2 group-hover:text-emerald-100 transition-colors">شهادة التقدير</h3>
                                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                                    اطلب شهادة تفوق موثقة بناءً على أدائك
                                </p>
                            </div>
                        </div>
                    </button>

                </div>
            )}

            {/* PERFORMANCE ANALYSIS SECTION */}
            {activeSection === 'ANALYSIS' && (
                <div className="animate-fade-in">
                    <div className="bg-[#080808] rounded-[2rem] p-8 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
                        
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="flex flex-col md:flex-row items-center gap-6 mb-10 pb-8 border-b border-white/5 relative z-10">
                            <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 shadow-inner">
                                <TrendingUp className="w-8 h-8 text-amber-500" />
                            </div>
                            <div className="text-center md:text-right">
                                <h2 className="text-2xl font-black text-white mb-1">تقرير الأداء الشخصي</h2>
                                <p className="text-gray-500 text-sm">تحليل دقيق بناءً على {analysisStats.total} اختبارات</p>
                            </div>
                        </div>

                        {loadingAnalysis ? (
                            <div className="py-20 text-center flex flex-col items-center gap-4">
                                <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
                                <p className="text-amber-500/80 font-bold text-sm animate-pulse">جاري معالجة البيانات...</p>
                            </div>
                        ) : analysisStats.total === 0 ? (
                            <div className="text-center py-16 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
                                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-600 opacity-50" />
                                <h3 className="text-lg font-bold text-white mb-2">لا توجد بيانات كافية</h3>
                                <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">ابدأ بحل الاختبارات ليقوم النظام بتحليل مستواك.</p>
                                <button onClick={() => onNavigate('QUIZZES')} className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-lg text-sm">
                                    الذهاب للاختبارات
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-8 relative z-10">
                                {/* Skill Bars */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs font-bold text-gray-400">
                                            <span className="flex items-center gap-2"><Target className="w-3.5 h-3.5 text-blue-400"/> القواعد (Grammar)</span>
                                            <span className={analysisStats.grammar < 50 ? "text-red-400" : "text-emerald-400"}>{analysisStats.grammar}%</span>
                                        </div>
                                        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full transition-all duration-1000 ${analysisStats.grammar < 50 ? 'bg-red-500' : analysisStats.grammar < 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${analysisStats.grammar}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs font-bold text-gray-400">
                                            <span className="flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-purple-400"/> المفردات (Vocabulary)</span>
                                            <span className={analysisStats.vocab < 50 ? "text-red-400" : "text-emerald-400"}>{analysisStats.vocab}%</span>
                                        </div>
                                        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full transition-all duration-1000 ${analysisStats.vocab < 50 ? 'bg-red-500' : analysisStats.vocab < 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${analysisStats.vocab}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 md:col-span-2">
                                        <div className="flex justify-between text-xs font-bold text-gray-400">
                                            <span className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5 text-emerald-400"/> القراءة (Reading)</span>
                                            <span className={analysisStats.reading < 50 ? "text-red-400" : "text-emerald-400"}>{analysisStats.reading}%</span>
                                        </div>
                                        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full transition-all duration-1000 ${analysisStats.reading < 50 ? 'bg-red-500' : analysisStats.reading < 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${analysisStats.reading}%` }}></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recommendation Box */}
                                <div className="mt-8 bg-gradient-to-r from-amber-900/10 to-transparent border-r-2 border-amber-500/50 p-5 rounded-l-xl flex gap-4 items-start">
                                    <div className="p-2 bg-amber-500/10 rounded-lg shrink-0 border border-amber-500/20">
                                        <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-white mb-1">نصيحة المعلم:</h4>
                                        <p className="text-gray-400 leading-relaxed text-sm">
                                            {Math.min(analysisStats.grammar, analysisStats.vocab, analysisStats.reading) === analysisStats.grammar 
                                                ? "يبدو أنك بحاجة لتركيز أكبر على القواعد. ننصحك بمراجعة قسم الشروحات وحل المزيد من تمارين Grammar لتحسين الدقة."
                                                : Math.min(analysisStats.grammar, analysisStats.vocab, analysisStats.reading) === analysisStats.vocab
                                                    ? "حاول زيادة حصيلتك اللغوية. ركز على مراجعة الكلمات الموجودة في قسم الملفات واستخدمها في جمل مفيدة."
                                                    : "ركز على قراءة النصوص وتحليلها بتمعن. قسم Reading في الاختبارات سيساعدك على تطوير مهارة الاستنتاج."
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* CERTIFICATE PREVIEW SECTION */}
            {activeSection === 'CERTIFICATE_PREVIEW' && (
                <div className="animate-fade-in flex flex-col items-center">
                    <div className="w-full max-w-2xl bg-[#080808] rounded-[2.5rem] border border-amber-500/20 shadow-2xl p-8 md:p-12 text-center relative overflow-hidden">
                        
                        {/* Golden Glow Background */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-amber-900/10 to-transparent pointer-events-none"></div>
                        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-[80px]"></div>

                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(245,158,11,0.4)] border-4 border-gray-900">
                                <Award className="w-12 h-12 text-white drop-shadow-md" />
                            </div>

                            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                                شهادة التفوق
                            </h2>
                            
                            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg mx-auto">
                                هذه الشهادة هي تقدير لجهودك المستمرة وتميزك الأكاديمي. إنها وثيقة تثبت تفوقك ومثابرتك في رحلتك التعليمية مع منصة إتقان.
                            </p>

                            <div className="flex flex-col gap-4">
                                <button 
                                    onClick={() => setShowCertificateConfirm(true)}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white font-black text-lg shadow-lg hover:shadow-amber-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                                >
                                    <Download className="w-6 h-6" />
                                    تصدير الشهادة (PDF)
                                </button>
                                
                                <button 
                                    onClick={() => setActiveSection('MENU')}
                                    className="text-gray-500 text-sm font-bold hover:text-white transition-colors flex items-center justify-center gap-2"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    العودة للقائمة
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* --- MODALS & OVERLAYS --- */}

        {/* Toast Notification for Download Success */}
        {showDownloadSuccess && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] animate-slide-up-fade">
                <div className="bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="font-bold text-sm">تم تحميل الشهادة بنجاح!</p>
                        <p className="text-xs text-emerald-100">تفقد مجلد التنزيلات في جهازك.</p>
                    </div>
                </div>
            </div>
        )}

        {/* Confirmation Modal */}
        {showCertificateConfirm && (
            <div className="fixed inset-0 z-[250] flex items-center justify-center px-4 bg-black/90 backdrop-blur-sm animate-fade-in">
                <div className="bg-gray-900 rounded-[2.5rem] p-8 max-w-sm w-full relative z-10 text-center border border-white/10 shadow-2xl shadow-black/50 animate-fade-in-up">
                    
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-gray-800 bg-emerald-500/20">
                        <Download className="w-10 h-10 text-emerald-500" />
                    </div>
                    
                    <h3 className="text-2xl font-black text-white mb-3">تأكيد الإصدار</h3>
                    <p className="text-gray-400 mb-8 text-base font-medium leading-relaxed">
                        هل أنت متأكد من إصدار الشهادة وحفظها كملف PDF؟
                    </p>
                    
                    <div className="flex gap-4 justify-center">
                        <button 
                            onClick={handleExportCertificate}
                            disabled={isExporting}
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/30 transform hover:scale-105 active:scale-95 disabled:opacity-50"
                        >
                            {isExporting ? 'جاري التحميل...' : 'نعم، تحميل'}
                        </button>
                        <button 
                            onClick={() => setShowCertificateConfirm(false)}
                            disabled={isExporting}
                            className="flex-1 bg-gray-800 text-gray-300 py-3.5 rounded-xl font-bold hover:bg-gray-700 transition-colors border border-gray-700 disabled:opacity-50"
                        >
                            إلغاء
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Hidden Certificate Node for Generation */}
        <div className="fixed top-0 left-0 w-0 h-0 overflow-hidden">
            <div 
                id="certificate-node"
                className="bg-[#fffef0] text-black relative w-[800px] h-[560px] p-8 shrink-0 shadow-2xl mx-auto"
                style={{ fontFamily: "serif" }} 
            >
                {/* Ornamental Border */}
                <div className="absolute inset-4 border-4 border-double border-amber-600 pointer-events-none"></div>
                <div className="absolute inset-6 border border-amber-800/30 pointer-events-none"></div>
                
                {/* Corners */}
                <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-amber-700"></div>
                <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-amber-700"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-amber-700"></div>
                <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-amber-700"></div>

                {/* Platform Seal (Stamp) */}
                <div className="absolute top-8 left-8 w-24 h-24 border-4 border-double border-red-800/60 rounded-full flex items-center justify-center transform -rotate-12 opacity-80 pointer-events-none">
                    <div className="text-center">
                        <div className="text-[8px] font-bold text-red-900 uppercase tracking-widest mb-1">Etqan Platform</div>
                        <Star className="w-6 h-6 text-red-800 mx-auto" />
                        <div className="text-[10px] font-black text-red-900 mt-1">معتمدة</div>
                    </div>
                </div>

                {/* Content */}
                <div className="h-full flex flex-col items-center justify-center text-center relative z-10 space-y-5">
                    
                    <div className="mb-2">
                        <h1 className="text-4xl font-black text-amber-800 mb-2" style={{ fontFamily: 'Amiri, serif' }}>منصة إتقان التعليمية</h1>
                        <p className="text-gray-600 text-sm tracking-widest uppercase">Etqan Educational Platform</p>
                    </div>

                    <h2 className="text-5xl font-bold text-amber-600" style={{ fontFamily: 'Great Vibes, cursive' }}>شهادة تفوق</h2>
                    
                    <p className="text-xl text-gray-800 mt-2 max-w-xl leading-relaxed">
                        تشهد إدارة المنصة بأن الطالب/ة
                    </p>

                    <h3 className="text-4xl font-black text-black border-b-2 border-amber-500/50 pb-2 px-10 min-w-[300px]">
                        {user?.displayName}
                    </h3>

                    {/* Enriched Stats Row */}
                    <div className="flex items-center justify-center gap-8 py-4 w-full px-12">
                        <div className="text-center border-l-2 border-amber-200 pl-8">
                            <p className="text-xs text-gray-500 font-bold uppercase mb-1">المعدل العام</p>
                            <p className="text-2xl font-black text-emerald-700">{analysisStats.overallAvg}%</p>
                        </div>
                        <div className="text-center border-l-2 border-amber-200 pl-8">
                            <p className="text-xs text-gray-500 font-bold uppercase mb-1">المستوى</p>
                            <p className="text-xl font-black text-amber-700">{currentLevel}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500 font-bold uppercase mb-1">اختبارات منجزة</p>
                            <p className="text-2xl font-black text-blue-700">{analysisStats.total}</p>
                        </div>
                    </div>

                    <p className="text-base text-gray-700 max-w-2xl leading-relaxed font-medium">
                        قد أتم المتطلبات الدراسية بنجاح، وتُمنح هذه الشهادة تقديراً لجهوده المبذولة ومستواه المتميز في التحصيل العلمي.
                    </p>

                    <div className="flex justify-between items-end w-full px-16 mt-6">
                        <div className="text-center">
                            <p className="text-sm font-bold text-gray-500 mb-2">التاريخ</p>
                            <p className="font-mono font-bold text-base border-b border-gray-400 pb-1">{new Date().toLocaleDateString('ar-EG')}</p>
                        </div>

                        <div className="text-center relative">
                            {/* Gold Seal Placeholder */}
                            <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg border-4 border-amber-600 border-double absolute -top-8 left-1/2 -translate-x-1/2 opacity-20">
                                <Award className="w-10 h-10" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-sm font-bold text-gray-500 mb-1">المدير العام</p>
                                <p className="font-bold text-lg text-amber-800" style={{ fontFamily: 'Great Vibes, cursive' }}>Yazan Abu Kahil</p>
                                <p className="text-[10px] font-bold text-black mt-0.5">أ. يزن أبو كحيل</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
  );
};

export default VipArea;
