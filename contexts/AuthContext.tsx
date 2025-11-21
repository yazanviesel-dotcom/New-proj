
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  setTeacherSession: () => void;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const setTeacherSession = () => {
    const teacherProfile: UserProfile = {
      uid: 'teacher-admin-id',
      email: 'teacher@etqan.edu',
      displayName: 'المعلم',
      role: 'teacher'
    };
    setUser(teacherProfile);
    localStorage.setItem('isTeacher', 'true');
  };

  const logout = async () => {
    try {
      if (user?.role === 'teacher') {
        localStorage.removeItem('isTeacher');
        setUser(null);
      } else {
        await firebaseSignOut(auth);
      }
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      // Update local state
      setUser(prev => prev ? { ...prev, ...data } : null);

      // Update Firestore if it's a real firebase user (not the static teacher)
      if (user.role !== 'teacher') {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, data);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (localStorage.getItem('isTeacher') === 'true') {
        setTeacherSession();
        setLoading(false);
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: `${data.firstName} ${data.lastName}`,
              firstName: data.firstName,
              lastName: data.lastName,
              age: data.age,
              role: data.role as UserRole,
              grade: data.grade,
              phone: data.phone,
              address: data.address,
              school: data.school
            });
          } else {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: 'User',
              role: 'student'
            });
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      } else {
        if (localStorage.getItem('isTeacher') !== 'true') {
            setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout, setTeacherSession, updateUserProfile }}>
      {!loading && children}
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
