

import React, { useState } from 'react';
import { X, Sparkles, BookOpen, GraduationCap, Layers, FileText, Check, Loader2, Eye, Save } from 'lucide-react';
import { Question } from '../types';
import { generateTeacherQuiz, TeacherQuizParams } from '../services/geminiService';

interface TeacherQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TeacherQuizModal: React.FC<TeacherQuizModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'FORM' | 'PREVIEW'>('FORM');
  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  
  // Form State
  const [formData, setFormData] = useState<TeacherQuizParams>({
    subject: '',
    topic: '',
    grade: '',
    unit: '',
    type: 'mcq'
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const questions = await generateTeacherQuiz(formData);
      setGeneratedQuestions(questions);
      setStep('PREVIEW');
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء إنشاء الاختبار');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-white rounded-3xl w-full max-w-3xl relative shadow-2xl overflow-hidden animate-fade-in-up max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-yellow-300" />
            <h2 className="text-xl font-bold">نظام إنشاء الاختبارات الذكي</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-blue-700 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          
          {step === 'FORM' ? (
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    المادة الدراسية
                  </label>
                  <input 
                    required
                    type="text"
                    placeholder="مثال: العلوم، الرياضيات"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    عنوان الاختبار / الموضوع
                  </label>
                  <input 
                    required
                    type="text"
                    placeholder="مثال: الجدول الدوري، المعادلات الخطية"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    value={formData.topic}
                    onChange={(e) => setFormData({...formData, topic: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    الصف الدراسي
                  </label>
                  <select 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-white"
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                  >
                    <option value="">اختر الصف</option>
                    <option value="5">الخامس</option>
                    <option value="6">السادس</option>
                    <option value="7">السابع</option>
                    <option value="8">الثامن</option>
                    <option value="9">التاسع</option>
                    <option value="10">العاشر</option>
                    <option value="11">الحادي عشر</option>
                    <option value="12">الثاني عشر</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    الوحدة الدراسية
                  </label>
                  <input 
                    required
                    type="text"
                    placeholder="مثال: الوحدة الأولى"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">نوع الأسئلة</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'mcq'})}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${formData.type === 'mcq' ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'border-gray-100 text-gray-500 hover:border-blue-200'}`}
                  >
                    اختيار من متعدد
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'true_false'})}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${formData.type === 'true_false' ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'border-gray-100 text-gray-500 hover:border-blue-200'}`}
                  >
                    صح أو خطأ
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      جاري توليد الأسئلة...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      توليد الاختبار بالذكاء الاصطناعي
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{formData.subject} - {formData.topic}</h3>
                  <p className="text-sm text-gray-500">عدد الأسئلة: {generatedQuestions.length}</p>
                </div>
                <div className="flex gap-2">
                   <button 
                    onClick={() => setStep('FORM')}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium text-sm"
                   >
                     تعديل الإعدادات
                   </button>
                   <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-green-700">
                     <Save className="w-4 h-4" />
                     حفظ الاختبار
                   </button>
                </div>
              </div>

              <div className="space-y-6">
                {generatedQuestions.map((q, idx) => (
                  <div key={idx} className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="bg-blue-100 text-blue-700 font-bold w-8 h-8 flex items-center justify-center rounded-full shrink-0">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-gray-800 text-lg leading-relaxed">{q.question}</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-11">
                      {q.options.map((opt, optIdx) => (
                        <div 
                          key={optIdx} 
                          className={`p-3 rounded-lg border ${optIdx === q.correctAnswer ? 'bg-green-100 border-green-300 text-green-800 font-bold' : 'bg-white border-gray-200 text-gray-600'}`}
                        >
                          {opt} {optIdx === q.correctAnswer && <Check className="w-4 h-4 inline mr-2"/>}
                        </div>
                      ))}
                    </div>

                    {q.explanation && (
                        <div className="mt-4 mr-11 p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-sm text-yellow-800">
                            <span className="font-bold block mb-1">💡 التفسير:</span>
                            {q.explanation}
                        </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherQuizModal;