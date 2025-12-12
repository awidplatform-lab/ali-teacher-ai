import React, { useState, useRef } from 'react';
import { BookOpen, Sparkles, Loader2, Upload, X, FileText, Image as ImageIcon, Languages } from 'lucide-react';

interface InputAreaProps {
  onSubmit: (text: string, language: string, file?: { mimeType: string; data: string }) => void;
  isGenerating: boolean;
}

const LANGUAGES = [
  { code: 'Moroccan Darija', label: '🇲🇦 Darija (Morocco)' },
  { code: 'Arabic (Modern Standard)', label: '🇸🇦 Arabic (Fusha)' },
  { code: 'French', label: '🇫🇷 Français' },
  { code: 'Spanish', label: '🇪🇸 Español' },
  { code: 'English', label: '🇬🇧 English (Simplify)' },
  { code: 'German', label: '🇩🇪 Deutsch' },
  { code: 'Italian', label: '🇮🇹 Italiano' },
  { code: 'Turkish', label: '🇹🇷 Türkçe' },
];

const InputArea: React.FC<InputAreaProps> = ({ onSubmit, isGenerating }) => {
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ name: string; type: string; data: string } | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('Moroccan Darija');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() || selectedFile) {
        const filePayload = selectedFile ? { mimeType: selectedFile.type, data: selectedFile.data } : undefined;
        onSubmit(text, selectedLanguage, filePayload);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (file.size > 5 * 1024 * 1024) {
        alert("File too large. Please select a file under 5MB.");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/png;base64,")
        const base64Data = base64String.split(',')[1];
        
        setSelectedFile({
            name: file.name,
            type: file.type,
            data: base64Data
        });
    };
    reader.readAsDataURL(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 max-w-3xl mx-auto text-center animate-fade-in">
      <div className="mb-6 p-4 bg-blue-100 rounded-full text-blue-600">
        <BookOpen size={40} />
      </div>
      
      <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
        Ali Teacher <span className="text-blue-600">AI</span>
      </h1>
      
      <p className="text-lg text-slate-600 mb-8 max-w-xl">
        Paste your text, or upload a screenshot/PDF. I will explain, translate, and teach you in your preferred language.
      </p>

      <form onSubmit={handleSubmit} className="w-full relative group">
        {/* ADDED: bg-slate-50 to container and specific styles to textarea to ensure visibility */}
        <div className="relative bg-slate-50 rounded-2xl border-2 border-slate-200 shadow-xl overflow-hidden focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
            <textarea
                className="w-full p-6 text-lg outline-none resize-none transition-all placeholder:text-slate-400 text-slate-900 bg-slate-50 focus:bg-white min-h-[150px]"
                placeholder="Paste text or type your question here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isGenerating}
                style={{ color: '#0f172a', backgroundColor: text ? '#ffffff' : '#f8fafc' }} // Hardcode colors ensuring visibility
            />
            
            {/* File Preview Area */}
            {selectedFile && (
                <div className="mx-6 mb-4 p-3 bg-white rounded-xl flex items-center justify-between border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="p-2 bg-blue-50 rounded-lg border border-blue-100 text-blue-600">
                            {selectedFile.type.includes('image') ? <ImageIcon size={20} /> : <FileText size={20} />}
                        </div>
                        <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{selectedFile.name}</span>
                    </div>
                    <button 
                        type="button" 
                        onClick={clearFile}
                        className="p-1 hover:bg-red-50 hover:text-red-500 rounded-full text-slate-400 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Toolbar */}
            <div className="px-6 py-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/*,application/pdf,text/plain"
                        onChange={handleFileChange}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isGenerating}
                        className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all text-sm font-medium border border-slate-200 hover:border-blue-200"
                        title="Upload Screenshot or PDF"
                    >
                        <Upload size={18} />
                        <span className="hidden sm:inline">Add Image/PDF</span>
                    </button>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                    {/* Language Selector */}
                    <div className="relative flex-1 sm:flex-none">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                             <Languages size={16} />
                        </div>
                        <select
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            disabled={isGenerating}
                            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 hover:bg-white transition-all appearance-none cursor-pointer"
                        >
                            {LANGUAGES.map(lang => (
                                <option key={lang.code} value={lang.code}>{lang.label}</option>
                            ))}
                        </select>
                         <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500 text-xs">
                             ▼
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={(!text.trim() && !selectedFile) || isGenerating}
                        className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 shadow-md shadow-blue-200"
                    >
                        {isGenerating ? (
                        <>
                            <Loader2 className="animate-spin w-5 h-5" />
                            <span>...</span>
                        </>
                        ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            <span>Go</span>
                        </>
                        )}
                    </button>
                </div>
            </div>
        </div>
        <p className="mt-3 text-xs text-slate-400">Supports: Text, Images (Screenshots), PDF.</p>
      </form>
    </div>
  );
};

export default InputArea;
