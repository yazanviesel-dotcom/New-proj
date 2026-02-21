
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option (For MCQ/TF) or ignored for Reorder
  correctAnswerText?: string; // Model answer for REWRITE type
  explanation?: string; // Explanation for why the answer is correct
  passageContent?: string; // The text/passage for Reading questions
  generalInstruction?: string; // The header instruction (e.g., "Read the following text...")
  passageFontSize?: 'sm' | 'md' | 'lg' | 'xl'; // Font size for the passage
  type?: 'MCQ' | 'TF' | 'READING' | 'REORDER' | 'REWRITE';
}

export interface Quiz {
  id?: string;
  title: string;
  subject: string;
  grade: string;
  semester?: 'First' | 'Second'; // New Semester Field
  category?: string; // New field for Quiz Type (Language, Reading, etc.)
  questions: Question[];
  createdBy?: string;
  teacherName?: string;
  description?: string;
  duration?: number; // Duration in minutes
  questionDuration?: number; // Duration per question in seconds
  createdAt?: any;
  updatedAt?: any;
  isPremium?: boolean; // New Subscription Field
  keepOrder?: boolean; // New field for keeping question order
}

export type UserRole = 'student' | 'teacher' | 'guest';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  grade?: string; // "10", "11", "12"
  age?: string;
  phone?: string;
  address?: string; // City/Area
  school?: string;
  gender?: 'male' | 'female';
  avatar?: string; // URL to avatar image
  profileBackground?: string; // URL/ID for profile background
  genderChanged?: boolean; // Lock gender after first set
  createdAt?: any;
  totalXP?: number;
  quizzesCompleted?: number;
  lastQuizDate?: any;
  isSubscriber?: boolean; // New Subscription Field
  subscriptionExpiry?: any; // Timestamp for when subscription ends
}

export interface QuizState {
  isLoading: boolean;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  isFinished: boolean;
  error: string | null;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'quiz' | 'file' | 'explanation' | 'message' | 'info';
    date: string;
    read: boolean;
    link?: string;
    senderName?: string;
    senderId?: string;
    recipientId?: string;
    createdAt?: any;
}

export interface StudyMaterial {
    id?: string;
    grade: string;
    subject: string;
    category: 'handouts' | 'worksheets' | 'exams'; // Dosiyat, Worksheets, Previous Exams
    title: string;
    url: string; // PDF Link (Drive)
    size?: string; // "2MB", "Drive Link"
    teacherName?: string;
    teacherId?: string;
    createdAt?: any;
}

export interface Explanation {
    id?: string;
    grade: string;
    subject: string;
    semester?: 'First' | 'Second'; // New Semester Field
    category: string; // Grammar, Reading, Vocab
    title: string;
    content: string; // Rich Text or HTML
    backgroundStyle?: string; // Added for UI customization
    teacherName?: string;
    teacherId?: string;
    createdAt?: any;
    isPremium?: boolean; // New Subscription Field for Explanations
}

export interface ContactMessage {
    id: string;
    studentId: string;
    studentName: string;
    studentEmail?: string;
    teacherId: string;
    teacherName?: string;
    message: string;
    createdAt: any;
    read: boolean;
}

export type AppView = 'HOME' | 'QUIZZES' | 'PROFILE' | 'TEACHER_DASHBOARD' | 'ABOUT_PLATFORM' | 'TEACHER_CV' | 'LESSONS' | 'CONTACT_TEACHER' | 'LESSONS_EXPLANATIONS' | 'QUESTION_BANK' | 'TEACHER_EXPLANATIONS' | 'TEACHER_UPLOAD_FILES' | 'PLATFORM_DEFINITION' | 'TEACHER_CORRESPONDENCE' | 'TEACHER_REVIEWS' | 'SERVICES' | 'SUBSCRIPTION_MANAGEMENT' | 'VIP_AREA' | 'EDITOR';
