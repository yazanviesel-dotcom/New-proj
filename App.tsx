
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import AuthModal from './components/AuthModal';
import TeacherDashboard from './components/TeacherDashboard';
import StudentProfile from './components/StudentProfile';
import StudentQuizDashboard from './components/StudentQuizDashboard';
import TeacherCV from './components/TeacherCV';
import AboutPlatform from './components/AboutPlatform';
import EducationalLessons from './components/EducationalLessons';
import ContactTeacher from './components/ContactTeacher';
import Achievements from './components/Achievements';
import ImpactStats from './components/ImpactStats';
import QuestionBank from './components/QuestionBank';
import SubjectExplanations from './components/SubjectExplanations';
import TeacherExplanations from './components/TeacherExplanations';
import TeacherUploadFiles from './components/TeacherUploadFiles';
import Editor from './components/Editor';
import HomeFeatures from './components/HomeFeatures';
import FounderNote from './components/FounderNote';
import JoinCTA from './components/JoinCTA';
import PlatformInfo from './components/PlatformInfo'; 
import PlatformDefinition from './components/PlatformDefinition'; 
import PlatformDefinitionSection from './components/PlatformDefinitionSection'; 
import StarsBackground from './components/StarsBackground'; 
import TeacherCorrespondence from './components/TeacherCorrespondence';
import TeacherReviews from './components/TeacherReviews';
import ContactCTA from './components/ContactCTA';
import HomeExtraSections from './components/HomeExtraSections';
import Footer from './components/Footer';
import Services from './components/Services';
import SubscriptionManagement from './components/SubscriptionManagement';
import VipArea from './components/VipArea'; 
import { AppView, Explanation } from './types';
import { useAuth } from './contexts/AuthContext';
import { LogOut, Loader2, AlertTriangle, X, ArrowLeft } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('HOME');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // States for Editor context
  const [editorInitialData, setEditorInitialData] = useState<Partial<Explanation>>({});
  const [onEditorFinishedCallback, setOnEditorFinishedCallback] = useState<((content: string, id?: string) => void) | null>(null);

  // Navigation Guard States
  const [showLeaveWarning, setShowLeaveWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<{ view: AppView, restoreScroll: boolean } | null>(null);
  const [isLogoutPending, setIsLogoutPending] = useState(false);
  
  // Refs for Scroll Restoration
  const scrollPositions = useRef<{[key: string]: number}>({});
  const isPopState = useRef(false);
  
  const { logout } = useAuth();

  // Hide Navbar/Footer for Explanations Viewer AND The Editor
  const hideLayout = currentView === 'LESSONS_EXPLANATIONS' || currentView === 'EDITOR';

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    window.history.replaceState({ view: 'HOME' }, '', '');

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        isPopState.current = true;
        setCurrentView(event.state.view);
      } else {
        isPopState.current = true;
        setCurrentView('HOME');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (isPopState.current) {
      const savedPosition = scrollPositions.current[currentView] || 0;
      setTimeout(() => window.scrollTo(0, savedPosition), 10);
    } else {
      window.scrollTo(0, 0);
    }
  }, [currentView]);

  const handleNavigate = (view: AppView, restoreScroll = false, extraData?: any) => {
    if (view === currentView) {
        if (view === 'HOME') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
    }

    // Special case for Editor initialization
    if (view === 'EDITOR' && extraData) {
        setEditorInitialData(extraData.initialData || {});
        setOnEditorFinishedCallback(() => extraData.onFinished);
    }

    // Intercept if in Teacher Dashboard
    if (currentView === 'TEACHER_DASHBOARD') {
      setPendingNavigation({ view, restoreScroll });
      setShowLeaveWarning(true);
      return;
    }
    
    performNavigation(view, restoreScroll);
  };

  const performNavigation = (view: AppView, restoreScroll = false) => {
    scrollPositions.current[currentView] = window.scrollY;
    isPopState.current = restoreScroll; 
    window.history.pushState({ view }, '', '');
    setCurrentView(view);
    setShowLeaveWarning(false);
    setPendingNavigation(null);
  };

  const handleLogout = async () => {
      if (currentView === 'TEACHER_DASHBOARD') {
        setIsLogoutPending(true);
        setShowLeaveWarning(true);
        return;
      }
      executeLogout();
  };

  const executeLogout = async () => {
      setShowLeaveWarning(false);
      setIsLogoutPending(false);
      setIsLoggingOut(true);
      setTimeout(async () => {
          await logout();
          setIsLoggingOut(false);
          handleNavigate('HOME');
      }, 2500);
  };

  const handleConfirmLeave = () => {
      if (isLogoutPending) {
          executeLogout();
      } else if (pendingNavigation) {
          performNavigation(pendingNavigation.view, pendingNavigation.restoreScroll);
      }
  };

  return (
    <div className="min-h-screen flex flex-col relative transition-colors duration-300 bg-gray-950 text-gray-100 selection:bg-emerald-500/30">
      
      {/* Global Background */}
      {currentView === 'HOME' && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gray-950">
            <StarsBackground />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-950/20 via-transparent to-gray-950/40"></div>
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/noise.png')]"></div>
        </div>
      )}

      {/* Logout Animation Overlay */}
      {isLoggingOut && (
          <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90 backdrop-blur-2xl transition-all duration-700 animate-fade-in">
              <div className="relative scale-150 transform transition-transform duration-700">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] animate-pulse"></div>
                  <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg className="w-full h-full absolute inset-0 animate-[spin_3s_linear_infinite] text-emerald-500/20" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="20 10" />
                      </svg>
                      <div className="bg-gray-900 p-4 rounded-full border border-white/10 shadow-2xl relative z-10">
                          <LogOut className="w-8 h-8 text-emerald-400" />
                      </div>
                  </div>
              </div>
              <div className="mt-12 text-center space-y-4 animate-slide-up-fade">
                  <h2 className="text-4xl font-black text-white">إلى اللقاء</h2>
                  <div className="flex items-center justify-center gap-3 text-emerald-400 text-sm font-bold bg-emerald-950/30 px-6 py-2.5 rounded-full border border-emerald-500/20 shadow-lg backdrop-blur-md">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      جاري تسجيل الخروج...
                  </div>
              </div>
          </div>
      )}

      {/* Custom Leave Warning Modal (Modern Card Design) */}
      {showLeaveWarning && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4 bg-black/80 backdrop-blur-md animate-fade-in">
              <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-12 w-full max-w-md relative border-2 border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.15)] text-center animate-fade-in-up">
                  <div className="w-24 h-24 rounded-3xl bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center mx-auto mb-8 shadow-inner">
                      <AlertTriangle className="w-12 h-12 text-red-500 animate-pulse" />
                  </div>
                  
                  <h3 className="text-3xl font-black text-white mb-4 tracking-tight">تنبيه: مغادرة الصفحة</h3>
                  <p className="text-gray-400 text-lg mb-10 leading-relaxed font-medium">
                    هل أنت متأكد من مغادرة الصفحة؟ <br/>
                    <span className="text-red-400/80 font-bold">سيتم فقدان أي بيانات غير محفوظة في الاختبار الحالي.</span>
                  </p>
                  
                  <div className="flex flex-col gap-4">
                      <button 
                        onClick={handleConfirmLeave}
                        className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-lg shadow-red-900/20 transition-all transform active:scale-95 text-lg"
                      >
                        نعم، أريد المغادرة
                      </button>
                      <button 
                        onClick={() => { setShowLeaveWarning(false); setPendingNavigation(null); setIsLogoutPending(false); }}
                        className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-2xl border border-gray-700 transition-all text-lg flex items-center justify-center gap-2"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        تراجع والبقاء
                      </button>
                  </div>

                  <button 
                    onClick={() => { setShowLeaveWarning(false); setPendingNavigation(null); setIsLogoutPending(false); }}
                    className="absolute top-6 left-6 p-2 text-gray-500 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
              </div>
          </div>
      )}

      {/* Main Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
          {!hideLayout && (
            <Navbar 
              onLoginClick={() => setIsAuthModalOpen(true)} 
              onNavigate={(view) => handleNavigate(view)}
              onLogoutClick={handleLogout}
            />
          )}
          
          <main className={`flex-grow ${!hideLayout && currentView !== 'HOME' && currentView !== 'SERVICES' ? 'pt-24' : ''}`}>
            {currentView === 'HOME' && (
                <>
                  <Hero 
                      onStartQuiz={() => handleNavigate('QUIZZES')} 
                      onLoginClick={() => setIsAuthModalOpen(true)}
                      onNavigate={(view) => handleNavigate(view)}
                  />
                  <About onNavigate={(view) => handleNavigate(view)} />
                  <Achievements onLoginClick={() => setIsAuthModalOpen(true)} />
                  <ImpactStats />
                  <PlatformDefinitionSection onNavigate={() => handleNavigate('PLATFORM_DEFINITION')} />
                  <FounderNote />
                  <JoinCTA onLoginClick={() => setIsAuthModalOpen(true)} />
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_35px_rgba(16,185,129,1)] relative z-20 opacity-100"></div>
                  <PlatformInfo />
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_30px_rgba(16,185,129,1)] relative z-20 opacity-80"></div>
                  <HomeFeatures onNavigate={(view) => handleNavigate(view)} />
                  <HomeExtraSections />
                  <ContactCTA onNavigate={(view) => handleNavigate(view)} />
                </>
            )}

            {currentView === 'ABOUT_PLATFORM' && (
                <AboutPlatform onBack={() => handleNavigate('HOME', true)} />
            )}

            {currentView === 'PLATFORM_DEFINITION' && (
                <PlatformDefinition onBack={() => handleNavigate('HOME', true)} />
            )}

            {currentView === 'TEACHER_CV' && (
                <TeacherCV onBack={() => handleNavigate('HOME', true)} />
            )}

            {currentView === 'PROFILE' && (
                <StudentProfile onNavigate={(view) => handleNavigate(view)} />
            )}

            {currentView === 'TEACHER_DASHBOARD' && (
                <TeacherDashboard />
            )}

            {currentView === 'QUESTION_BANK' && (
                <QuestionBank onBack={() => handleNavigate('HOME', true)} />
            )}
            
            {currentView === 'TEACHER_EXPLANATIONS' && (
                <TeacherExplanations onNavigate={(view, data) => handleNavigate(view, false, data)} onBack={() => handleNavigate('PROFILE', true)} />
            )}

            {currentView === 'TEACHER_UPLOAD_FILES' && (
                <TeacherUploadFiles onNavigate={(view) => handleNavigate(view)} onBack={() => handleNavigate('PROFILE', true)} />
            )}

            {currentView === 'QUIZZES' && (
                <StudentQuizDashboard 
                    onBack={() => handleNavigate('HOME', true)} 
                    onNavigate={(view) => handleNavigate(view)}
                />
            )}

            {currentView === 'LESSONS' && (
                <EducationalLessons onBack={() => handleNavigate('HOME', true)} />
            )}

            {currentView === 'LESSONS_EXPLANATIONS' && (
                <SubjectExplanations 
                    onBack={() => handleNavigate('HOME', true)} 
                    onNavigate={(view) => handleNavigate(view)}
                />
            )}

            {currentView === 'CONTACT_TEACHER' && (
                <ContactTeacher onBack={() => handleNavigate('HOME', true)} />
            )}

            {currentView === 'SERVICES' && (
                <Services onBack={() => handleNavigate('HOME', true)} />
            )}

            {currentView === 'TEACHER_CORRESPONDENCE' && (
                <TeacherCorrespondence onNavigate={(view) => handleNavigate(view)} />
            )}

            {currentView === 'TEACHER_REVIEWS' && (
                <TeacherReviews onNavigate={(view) => handleNavigate(view)} />
            )}

            {currentView === 'SUBSCRIPTION_MANAGEMENT' && (
                <SubscriptionManagement onBack={() => handleNavigate('PROFILE', true)} />
            )}

            {currentView === 'VIP_AREA' && (
                <VipArea onNavigate={(view) => handleNavigate(view)} />
            )}

            {currentView === 'EDITOR' && (
                <Editor 
                    data={editorInitialData}
                    onClose={(updatedContent, id) => {
                        if (onEditorFinishedCallback) onEditorFinishedCallback(updatedContent || '', id);
                        handleNavigate('TEACHER_EXPLANATIONS', true);
                    }}
                />
            )}
          </main>
          
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
          />

          {!hideLayout && (
            <Footer onNavigate={(view) => handleNavigate(view)} />
          )}
      </div>
    </div>
  );
}

export default App;
