
import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Save, Loader2, Bold, Underline, Highlighter, Palette, 
  AlignLeft, AlignCenter, AlignRight, 
  RotateCcw, Table as TableIcon, CheckCircle2 
} from 'lucide-react';
import { db } from '../firebase';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Explanation } from '../types';

interface EditorProps {
  data: Partial<Explanation>;
  onClose: (updatedContent?: string, editingId?: string) => void;
}

const Editor: React.FC<EditorProps> = ({ data, onClose }) => {
  const { user } = useAuth();
  const [content, setContent] = useState(data.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingId, setEditingId] = useState(data.id || null);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const [textColor, setTextColor] = useState('#ffffff');
  const [highlightColor, setHighlightColor] = useState('#facc15');

  useEffect(() => {
    if (editorRef.current) {
        document.execCommand('defaultParagraphSeparator', false, 'div');
        editorRef.current.innerHTML = data.content || '<div><br></div>';
    }
  }, []);

  const execCmd = (command: string, arg: string = '') => {
    document.execCommand(command, false, arg);
    updateState();
  };

  const insertManualMarker = (marker: string) => {
    document.execCommand('insertText', false, marker + ' ');
    updateState();
    editorRef.current?.focus();
  };

  const updateState = () => {
    if (editorRef.current) setContent(editorRef.current.innerHTML);
  };

  const handleInput = () => {
    updateState();
  };

  const insertTable = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      alert("يرجى تظليل النص الذي تريد وضعه في جدول أولاً.");
      return;
    }
    const selectedText = selection.toString().trim();
    if (!selectedText) {
      alert("يرجى تظليل نص لتحويله إلى جدول.");
      return;
    }
    const rows = selectedText.split('\n').filter(r => r.trim());
    let tableHtml = `<table style="background: black; color: white; border: 1px solid #333; width: 100%; border-collapse: collapse; margin: 15px 0;"><tbody>`;
    rows.forEach(rowText => {
      tableHtml += `<tr><td style="border: 1px solid #333; padding: 12px; text-align: right; color: white;">${rowText}</td></tr>`;
    });
    tableHtml += `</tbody></table><p><br></p>`;
    execCmd('insertHTML', tableHtml);
  };

  const handleSave = async (silent = false) => {
    if (!content.trim() || content === '<div><br></div>') {
      if (!silent) alert("المحتوى فارغ!");
      return;
    }

    setIsSaving(true);
    try {
      // CRITICAL FIX: Destructure 'id' and 'content' out of data to prevent sending 'undefined' or old content
      const { id: _, content: __, ...restOfData } = data;
      
      const payload = {
        ...restOfData,
        content,
        updatedAt: serverTimestamp(),
        teacherName: user?.displayName || "المعلم",
        teacherId: user?.uid,
      };

      if (editingId) {
        await updateDoc(doc(db, "explanations", editingId), payload);
      } else {
        const docRef = await addDoc(collection(db, "explanations"), {
          ...payload,
          createdAt: serverTimestamp()
        });
        setEditingId(docRef.id);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      
      if (!silent) {
        onClose(content, editingId || undefined);
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert("حدث خطأ أثناء الحفظ. تأكد من جودة الاتصال.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-gray-950 flex flex-col animate-fade-in select-none">
      
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 px-4 py-3 flex justify-between items-center shadow-2xl relative z-[10010]">
        <div className="flex items-center gap-3">
          <button onClick={() => onClose(content, editingId || undefined)} className="p-2.5 bg-gray-800 hover:bg-red-600 hover:text-white rounded-xl text-gray-400 transition-all shadow-lg active:scale-90">
            <X className="w-6 h-6" />
          </button>
          <div className="hidden sm:block border-r border-gray-700 pr-3 mr-1">
            <h2 className="text-sm font-black text-white line-clamp-1">{data.title || 'شرح بدون عنوان'}</h2>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">المحرر اليدوي الذكي</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 animate-fade-in"><CheckCircle2 className="w-3 h-3" /> تم الحفظ</span>}
          <button onClick={() => handleSave(true)} disabled={isSaving} className="px-4 py-2 bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-emerald-600 hover:text-white transition-all">
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} حفظ
          </button>
          <button onClick={() => handleSave(false)} className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black shadow-xl shadow-emerald-900/30 hover:bg-emerald-500 transition-colors">
            حفظ وإنهاء
          </button>
        </div>
      </div>

      {/* Manual Formatting Toolbar */}
      <div className="bg-gray-900 border-b border-gray-800 p-2 flex flex-wrap items-center gap-1 z-[10005] shadow-md sticky top-0">
          <button onClick={() => execCmd('bold')} className="p-2 hover:bg-gray-800 rounded-lg text-gray-300" title="عريض"><Bold className="w-5 h-5"/></button>
          <button onClick={() => execCmd('underline')} className="p-2 hover:bg-gray-800 rounded-lg text-gray-300" title="تسطير"><Underline className="w-5 h-5"/></button>
          
          <div className="w-px h-6 bg-gray-700 mx-1"></div>
          
          {/* Manual Numbering/Bullets Buttons */}
          <button onClick={() => insertManualMarker('1.')} className="px-3 py-1.5 bg-gray-800 hover:bg-blue-600 text-white rounded-lg text-xs font-black border border-gray-700 transition-all" title="إضافة رقم 1.">1.</button>
          <button onClick={() => insertManualMarker('a.')} className="px-3 py-1.5 bg-gray-800 hover:bg-blue-600 text-white rounded-lg text-xs font-black border border-gray-700 transition-all" title="إضافة حرف a.">a.</button>
          <button onClick={() => insertManualMarker('•')} className="px-3 py-1.5 bg-gray-800 hover:bg-emerald-600 text-white rounded-lg text-xs font-black border border-gray-700 transition-all" title="إضافة نقطة •">•</button>
          
          <div className="w-px h-6 bg-gray-700 mx-1"></div>

          <div className="flex items-center gap-1 bg-gray-800 rounded-lg px-1.5 border border-gray-700 group hover:border-yellow-500/50 transition-all">
            <button onClick={() => execCmd('hiliteColor', highlightColor)} className="p-1.5 text-yellow-500" title="تضليل"><Highlighter className="w-4 h-4"/></button>
            <input type="color" value={highlightColor} onChange={(e) => setHighlightColor(e.target.value)} className="w-5 h-5 bg-transparent border-none cursor-pointer p-0" />
          </div>

          <div className="flex items-center gap-1 bg-gray-800 rounded-lg px-1.5 border border-gray-700 group hover:border-blue-500/50 transition-all">
            <button onClick={() => execCmd('foreColor', textColor)} className="p-1.5 text-blue-400" title="لون النص"><Palette className="w-4 h-4"/></button>
            <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-5 h-5 bg-transparent border-none cursor-pointer p-0" />
          </div>

          <select onChange={(e) => execCmd('fontSize', e.target.value)} className="bg-gray-800 text-white text-xs p-1.5 rounded border border-gray-700 outline-none font-bold" defaultValue="3">
            <option value="1">صغير جداً</option>
            <option value="2">صغير</option>
            <option value="3">عادي</option>
            <option value="4">متوسط</option>
            <option value="5">كبير</option>
            <option value="6">كبير جداً</option>
            <option value="7">ضخم</option>
          </select>

          <div className="w-px h-6 bg-gray-700 mx-1"></div>
          <button onClick={() => execCmd('justifyLeft')} className="p-2 hover:bg-gray-800 rounded-lg text-gray-300"><AlignLeft className="w-5 h-5"/></button>
          <button onClick={() => execCmd('justifyCenter')} className="p-2 hover:bg-gray-800 rounded-lg text-gray-300"><AlignCenter className="w-5 h-5"/></button>
          <button onClick={() => execCmd('justifyRight')} className="p-2 hover:bg-gray-800 rounded-lg text-gray-300"><AlignRight className="w-5 h-5"/></button>
          <div className="w-px h-6 bg-gray-700 mx-1"></div>
          <button onClick={insertTable} className="p-2 hover:bg-emerald-900/20 rounded-lg text-emerald-400 flex items-center gap-1" title="حول المظلل لجدول">
            <TableIcon className="w-5 h-5" />
            <span className="text-[10px] font-black">جدول</span>
          </button>
          <button onClick={() => execCmd('removeFormat')} className="p-2 hover:bg-red-900/20 rounded-lg text-red-400" title="مسح التنسيق"><RotateCcw className="w-5 h-5"/></button>
      </div>

      {/* Editable Content Area */}
      <div className={`flex-1 overflow-y-auto custom-scrollbar ${data.backgroundStyle || 'exp-bg-default'}`}>
        <div 
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="p-8 md:p-16 outline-none exp-content leading-loose transition-all duration-500"
          style={{ 
            direction: 'ltr', // Standard base, inner blocks will use plaintext logic
            textAlign: 'initial' 
          }}
        ></div>
        <div className="h-[60vh] pointer-events-none"></div>
      </div>

    </div>
  );
};

export default Editor;
