
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import AuthModal from './components/AuthModal';
import TeacherDashboard from './components/TeacherDashboard';
import StudentProfile from './components/StudentProfile';
import StudentQuizDashboard from './components/StudentQuizDashboard';
import TeacherCV from './components/TeacherCV';
import AboutPlatform from './components/AboutPlatform';
import Services from './components/Services';
import EducationalLessons from './components/EducationalLessons';
import ContactTeacher from './components/ContactTeacher';
import { AppView } from './types';
import { useAuth } from './contexts/AuthContext';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('HOME');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const { logout } = useAuth();

  // Prevent browser from restoring scroll position to bottom on refresh/mobile load
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Scroll to top whenever the view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const handleLogout = async () => {
      setIsLoggingOut(true);
      // Animation delay
      setTimeout(async () => {
          await logout();
          setIsLoggingOut(false);
          setCurrentView('HOME');
      }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col relative transition-colors duration-500 bg-slate-50">
      
      {/* Logout Animation Overlay */}
      {isLoggingOut && (
          <div className="fixed inset-0 z-[200] bg-emerald-600 flex items-center justify-center animate-fade-in">
              <div className="text-white text-2xl font-bold animate-bounce">جاري تسجيل الخروج...</div>
          </div>
      )}

      <Navbar 
        onLoginClick={() => setIsAuthModalOpen(true)} 
        onNavigate={(view) => setCurrentView(view)}
        onLogoutClick={handleLogout}
      />
      
      <main className="flex-grow">
        {currentView === 'HOME' && (
            <>
              <Hero 
                  onStartQuiz={() => setCurrentView('QUIZZES')} 
                  onLoginClick={() => setIsAuthModalOpen(true)}
                  onNavigate={setCurrentView}
              />
              <About onNavigate={setCurrentView} />
            </>
        )}

        {currentView === 'ABOUT_PLATFORM' && (
            <AboutPlatform onBack={() => setCurrentView('HOME')} />
        )}

        {currentView === 'SERVICES' && (
            <Services onBack={() => setCurrentView('HOME')} />
        )}

        {currentView === 'TEACHER_CV' && (
            <TeacherCV onBack={() => setCurrentView('HOME')} />
        )}

        {currentView === 'PROFILE' && (
            <StudentProfile />
        )}

        {currentView === 'TEACHER_DASHBOARD' && (
            <TeacherDashboard />
        )}

        {currentView === 'QUIZZES' && (
            <StudentQuizDashboard onBack={() => setCurrentView('HOME')} />
        )}

        {currentView === 'LESSONS' && (
            <EducationalLessons onBack={() => setCurrentView('HOME')} />
        )}

        {currentView === 'CONTACT_TEACHER' && (
            <ContactTeacher onBack={() => setCurrentView('HOME')} />
        )}
      </main>
      
      {/* Authentication */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white py-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} منصة إتقان التعليمية. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
}

export default App;
