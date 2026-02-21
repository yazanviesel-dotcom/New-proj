
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { UserProfile, UserRole } from '../types';
import GlobalFallback from '../components/GlobalFallback';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  setTeacherSession: (name: string, email: string) => void;
  setGuestSession: () => void;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);
  
  // Refs for subscriptions to clear them when switching modes
  const unsubscribeSnapshotRef = useRef<(() => void) | null>(null);
  
  // Use a ref to track if auth check has completed to avoid stale closures in setTimeout
  const isAuthCheckComplete = useRef(false);

  // Helper to validate subscription status based on time STRICTLY
  const validateSubscription = (userData: any): boolean => {
      if (!userData) return false;
      
      // NOTE: Teachers are now subject to subscription checks as well.
      // Previously: if (userData.role === 'teacher') return true;

      // 1. Check Flag Presence (Must be explicitly true)
      if (userData.isSubscriber !== true) return false;
      
      // 2. Check Expiry Presence
      if (!userData.subscriptionExpiry) return false;

      const now = Date.now();
      let expiryTime = 0;

      // Handle Firestore Timestamp or Date or String
      try {
          if (userData.subscriptionExpiry.seconds) {
              expiryTime = userData.subscriptionExpiry.seconds * 1000;
          } else if (typeof userData.subscriptionExpiry === 'string') {
              expiryTime = new Date(userData.subscriptionExpiry).getTime();
          } else if (userData.subscriptionExpiry instanceof Date) {
              expiryTime = userData.subscriptionExpiry.getTime();
          } else {
              // Invalid format
              return false;
          }
      } catch (e) {
          console.error("Date parse error", e);
          return false;
      }

      // 3. STRICT Time Check
      if (expiryTime <= now) {
          return false; // Expired
      }

      return true;
  };

  // Centralized function to sync profile from Firestore
  const syncUserProfile = (uid: string, defaultData?: Partial<UserProfile>) => {
      // 1. Clean up previous listener
      if (unsubscribeSnapshotRef.current) {
          unsubscribeSnapshotRef.current();
          unsubscribeSnapshotRef.current = null;
      }

      // 2. Setup new listener
      const userRef = doc(db, "users", uid);
      unsubscribeSnapshotRef.current = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
              const data = docSnap.data();
              // Validate subscription status on every update
              const isActiveSubscriber = validateSubscription(data);

              setUser(prev => {
                  if (!prev && !defaultData) return null; 
                  const base = prev || defaultData || {};
                  return {
                      ...base,
                      ...data,
                      uid: uid, // Ensure UID is consistent
                      role: defaultData?.role || data.role || 'student', 
                      isSubscriber: isActiveSubscriber,
                      // Ensure created at is preserved properly
                      createdAt: data.createdAt || base.createdAt
                  } as UserProfile;
              });
          } else {
              // Doc doesn't exist yet (e.g. new teacher without record)
              if (defaultData) {
                  setUser(prev => ({
                      ...defaultData,
                      isSubscriber: false // Default deny subscription if no record found
                  } as UserProfile));
              }
          }
          setLoading(false);
      }, (error) => {
          console.error("Error syncing profile:", error);
          setLoading(false);
      });
  };

  const setTeacherSession = (name: string, email: string) => {
    // 1. Persist to LocalStorage
    localStorage.setItem('isTeacher', 'true');
    localStorage.setItem('teacherName', name);
    localStorage.setItem('teacherEmail', email);
    
    // 2. Instant UI Update (SPA Behavior - No Reload)
    const uniqueId = `teacher-${email.split('@')[0]}`;
    
    let avatarUrl = "https://img.freepik.com/free-vector/teacher-standing-near-blackboard_23-2147517173.jpg"; 
    if (name.includes("يزن")) {
        avatarUrl = "https://lh3.googleusercontent.com/d/1tbzVNKO3FGH46Pa6MZ58OWD4BXVKdK5P"; 
    } else if (name.includes("مجد")) {
        avatarUrl = "https://lh3.googleusercontent.com/d/1xPDpcaUPz3IH-pqv-Jgplroi6U27BVVj";
    }

    const teacherProfile: UserProfile = {
        uid: uniqueId,
        email: email,
        displayName: name,
        role: 'teacher',
        avatar: avatarUrl,
        gender: 'male',
        isSubscriber: false, // Default false until validated by DB
        createdAt: { seconds: Date.now() / 1000 }
    };

    // Update state immediately
    setUser(teacherProfile);
    setLoading(false);

    // 3. Start Data Sync (Check subscription)
    syncUserProfile(uniqueId, teacherProfile);
  };

  const setGuestSession = () => {
    localStorage.setItem('isGuest', 'true');
    const guestProfile: UserProfile = {
        uid: 'guest-user',
        email: 'guest@etqan.edu',
        displayName: 'زائر المنصة',
        role: 'guest',
        avatar: 'https://lh3.googleusercontent.com/d/1ep_ggXFs0rCkGJ212WkY5DuRbLNkyLyr',
        gender: 'male',
        isSubscriber: false,
        createdAt: { seconds: Date.now() / 1000 }
    };
    setUser(guestProfile);
    setLoading(false);
  };

  const logout = async () => {
    try {
      // Clear snapshot listener
      if (unsubscribeSnapshotRef.current) {
          unsubscribeSnapshotRef.current();
          unsubscribeSnapshotRef.current = null;
      }

      if (user?.role === 'teacher') {
        localStorage.removeItem('isTeacher');
        localStorage.removeItem('teacherName');
        localStorage.removeItem('teacherEmail');
        setUser(null);
        // Removed reload to maintain SPA experience
      } else if (user?.role === 'guest') {
        localStorage.removeItem('isGuest');
        setUser(null);
      } else {
        await firebaseSignOut(auth);
        if (user?.uid) {
            localStorage.removeItem(`etqan_user_profile_${user.uid}`);
        }
        setUser(null);
      }
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      let updatedData = { ...data };
      
      if (data.firstName !== undefined || data.lastName !== undefined) {
          const newFirst = data.firstName !== undefined ? data.firstName : (user.firstName || '');
          const newLast = data.lastName !== undefined ? data.lastName : (user.lastName || '');
          updatedData.displayName = `${newFirst} ${newLast}`.trim();
      }

      // Allow teachers to update their profile in Firestore if a doc exists (for subscription syncing etc)
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, updatedData, { merge: true });
      
      // Optimistic update for local state
      setUser(prev => prev ? { ...prev, ...updatedData } : null);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  // Real-time Expiry Checker (Runs every minute)
  useEffect(() => {
      if (!user || !user.isSubscriber) return;

      const checkInterval = setInterval(() => {
          const isValid = validateSubscription(user);
          if (!isValid) {
              // Force update state if expired locally
              setUser(prev => prev ? { ...prev, isSubscriber: false } : null);
          }
      }, 60000); // Check every 1 minute

      return () => clearInterval(checkInterval);
  }, [user]);

  // Main Authentication Effect
  useEffect(() => {
    // Increased timeout to 90 seconds to aggressively handle very slow connections
    const timeoutId = setTimeout(() => {
        if (!isAuthCheckComplete.current) {
            setShowFallback(true);
        }
    }, 90000);

    let unsubscribeAuth: (() => void) | null = null;

    const isTeacher = localStorage.getItem('isTeacher') === 'true';
    const isGuest = localStorage.getItem('isGuest') === 'true';

    // --- SCENARIO A: TEACHER MODE ---
    if (isTeacher) {
        const name = localStorage.getItem('teacherName') || 'المعلم';
        const email = localStorage.getItem('teacherEmail') || 'teacher@etqan.edu';
        const uniqueId = `teacher-${email.split('@')[0]}`;
    
        let avatarUrl = "https://img.freepik.com/free-vector/teacher-standing-near-blackboard_23-2147517173.jpg"; 
        if (name.includes("يزن")) {
            avatarUrl = "https://lh3.googleusercontent.com/d/1tbzVNKO3FGH46Pa6MZ58OWD4BXVKdK5P"; 
        } else if (name.includes("مجد")) {
            avatarUrl = "https://lh3.googleusercontent.com/d/1xPDpcaUPz3IH-pqv-Jgplroi6U27BVVj";
        }

        const teacherProfile: UserProfile = {
            uid: uniqueId,
            email: email,
            displayName: name,
            role: 'teacher',
            avatar: avatarUrl,
            gender: 'male',
            isSubscriber: false // Default to false until DB sync
        };
        
        // Set initial state immediately
        setUser(teacherProfile);
        setLoading(false);
        isAuthCheckComplete.current = true;
        clearTimeout(timeoutId);

        // Start Data Sync for Teacher (Check Subscription)
        syncUserProfile(uniqueId, teacherProfile);

    } 
    // --- SCENARIO B: GUEST MODE ---
    else if (isGuest) {
        const guestProfile: UserProfile = {
            uid: 'guest-user',
            email: 'guest@etqan.edu',
            displayName: 'زائر المنصة',
            role: 'guest',
            avatar: 'https://lh3.googleusercontent.com/d/1ep_ggXFs0rCkGJ212WkY5DuRbLNkyLyr',
            gender: 'male',
            isSubscriber: false,
            createdAt: { seconds: Date.now() / 1000 }
        };
        setUser(guestProfile);
        setLoading(false);
        isAuthCheckComplete.current = true;
        clearTimeout(timeoutId);
    }
    // --- SCENARIO C: STUDENT MODE (FIREBASE) ---
    else {
        unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
            // Guard Clause: Prevent Firebase from overriding Teacher/Guest Session if active
            // This is crucial for SPA behavior when switching modes without reload
            if (localStorage.getItem('isTeacher') === 'true' || localStorage.getItem('isGuest') === 'true') {
                return;
            }

            // Mark auth check as complete immediately when Firebase responds
            isAuthCheckComplete.current = true;
            clearTimeout(timeoutId);

            if (firebaseUser) {
                // Initialize student session sync
                syncUserProfile(firebaseUser.uid, {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    displayName: 'User',
                    role: 'student',
                    isSubscriber: false
                });
            } else {
                setUser(null);
                setLoading(false);
                // Clear any existing snapshot listener
                if (unsubscribeSnapshotRef.current) {
                    unsubscribeSnapshotRef.current();
                    unsubscribeSnapshotRef.current = null;
                }
            }
        });
    }

    // Cleanup function for useEffect
    return () => {
        if (unsubscribeAuth) unsubscribeAuth();
        if (unsubscribeSnapshotRef.current) unsubscribeSnapshotRef.current();
        clearTimeout(timeoutId);
    };
  }, []);

  if (showFallback) {
      return <GlobalFallback />;
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, setTeacherSession, setGuestSession, updateUserProfile }}>
      {!loading ? children : (
          <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
              <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
                  <Loader2 className="w-12 h-12 text-emerald-500 animate-spin relative z-10" />
              </div>
              <p className="mt-4 text-gray-400 font-bold text-sm animate-pulse">جاري التحميل...</p>
          </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
