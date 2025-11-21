
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation?: string; // Explanation for why the answer is correct
}

export interface Quiz {
  id?: string;
  title: string;
  subject: string;
  grade: string;
  questions: Question[];
  createdBy: string;
  createdAt: any; // Firestore Timestamp
}

export interface QuizState {
  isLoading: boolean;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  isFinished: boolean;
  error: string | null;
}

export type AppView = 'HOME' | 'PROFILE' | 'TEACHER_DASHBOARD' | 'QUIZZES' | 'TEACHER_CV' | 'ABOUT_PLATFORM' | 'SERVICES' | 'LESSONS' | 'CONTACT_TEACHER';

export type UserRole = 'student' | 'teacher' | 'guest';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  age?: string;
  role: UserRole;
  grade?: string;
  phone?: string;
  address?: string;
  school?: string;
}