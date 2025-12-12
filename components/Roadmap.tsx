import React, { useState } from 'react';
import { Book, GraduationCap, Languages, ScrollText, Lightbulb, Volume2 } from 'lucide-react';
import { AnalysisResult } from '../types';

interface AnalysisViewProps {
  data: AnalysisResult;
}

// Helper to guess locale from language name
const getSpeechLocale = (langName: string): string => {
    const l = langName.toLowerCase();
    if (l.includes('arabic') || l.includes('darija')) return 'ar-SA';
    if (l.includes('french')) return 'fr-FR';
    if (l.includes('spanish')) return 'es-ES';
    if (l.includes('german')) return 'de-DE';
    if (l.includes('italian')) return 'it-IT';
    if (l.includes('turkish')) return 'tr-TR';
    return 'en-US'; // Default
};

// Helper to determine text direction
const getDirection = (langName: string): 'rtl' | 'ltr' => {
    const l = langName.toLowerCase();
    if (l.includes('arabic') || l.includes('darija') || l.includes('hebrew') || l.includes('persian')) return 'rtl';
    return 'ltr';
};

const AnalysisView: React.FC<AnalysisViewProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'explanation' | 'translation' | 'grammar' | 'vocab'>('explanation');
  
  const targetLocale = getSpeechLocale(data.targetLanguage);
  const textDir = getDirection(data.targetLanguage);

  const speak = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop any current speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        window.speechSynthesis.speak(utterance);
    } else {
        alert("Sorry, your browser doesn't support text-to-speech.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20 pt-8">
      
      {/* Original Text Preview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8 relative group">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Original Text</h3>
            <button 
                onClick={() => speak(data.originalText, 'en-US')}
                className="p-2 bg-slate-100 hover:bg-blue-100 text-slate-500 hover:text-blue-600 rounded-full transition-colors"
                title="Listen (English)"
            >
                <Volume2 size={18} />
            </button>
        </div>
        <p className="text-slate-800 leading-relaxed font-medium max-h-40 overflow-y-auto">{data.originalText}</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
        <button 
            onClick={() => setActiveTab('explanation')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all ${activeTab === 'explanation' ? 'bg-amber-500 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
        >
            <Lightbulb size={18} />
            <span>Explanation</span>
        </button>
        <button 
            onClick={() => setActiveTab('translation')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all ${activeTab === 'translation' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
        >
            <Languages size={18} />
            <span>Translation</span>
        </button>
        <button 
            onClick={() => setActiveTab('grammar')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all ${activeTab === 'grammar' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
        >
            <GraduationCap size={18} />
            <span>Grammar</span>
        </button>
        <button 
            onClick={() => setActiveTab('vocab')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all ${activeTab === 'vocab' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
        >
            <Book size={18} />
            <span>Vocabulary</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="animate-fade-in-up">
        
        {/* Explanation Tab */}
        {activeTab === 'explanation' && (
            <div className="bg-white rounded-3xl p-8 shadow-md border border-amber-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full mix-blend-multiply filter blur-2xl opacity-70 -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                        <Lightbulb className="mr-3 text-amber-500" />
                        Detailed Explanation
                    </h2>
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-md uppercase">{data.targetLanguage}</span>
                        <button 
                            onClick={() => speak(data.detailedExplanation, targetLocale)}
                            className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-full transition-colors"
                            title="Listen"
                        >
                            <Volume2 size={20} />
                        </button>
                    </div>
                </div>
                <div className={`prose prose-lg max-w-none ${textDir === 'rtl' ? 'text-right' : 'text-left'}`} dir={textDir}>
                    <p className={`text-slate-700 leading-loose text-xl font-medium whitespace-pre-line ${textDir === 'rtl' ? 'font-arabic' : ''}`}>
                        {data.detailedExplanation}
                    </p>
                </div>
            </div>
        )}

        {/* Translation Tab */}
        {activeTab === 'translation' && (
            <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full mix-blend-multiply filter blur-2xl opacity-70 -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                        <ScrollText className="mr-3 text-blue-500" />
                        Translation
                    </h2>
                    <button 
                        onClick={() => speak(data.translation, targetLocale)}
                        className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
                        title="Listen"
                    >
                        <Volume2 size={20} />
                    </button>
                </div>
                <div className={`prose prose-lg max-w-none ${textDir === 'rtl' ? 'text-right' : 'text-left'}`} dir={textDir}>
                    <p className={`text-slate-700 leading-loose text-xl ${textDir === 'rtl' ? 'font-arabic' : ''}`}>
                        {data.translation}
                    </p>
                </div>
            </div>
        )}

        {/* Grammar Tab */}
        {activeTab === 'grammar' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.grammar.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 hover:border-emerald-300 transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">{item.rule}</h3>
                            <span className="text-emerald-200 group-hover:text-emerald-500 transition-colors">#{idx + 1}</span>
                        </div>
                        <div className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                             <p className="text-sm text-slate-500 mb-1 font-semibold">Example:</p>
                             <p className="text-slate-800 italic">"{item.exampleInText}"</p>
                        </div>
                        <div dir={textDir} className={textDir === 'rtl' ? 'text-right' : 'text-left'}>
                            <p className="text-slate-600 leading-relaxed">{item.explanation}</p>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* Vocab Tab */}
        {activeTab === 'vocab' && (
            <div className="bg-white rounded-3xl shadow-md overflow-hidden border border-purple-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-purple-50 border-b border-purple-100 text-purple-900">
                                <th className="p-4 font-bold">Word</th>
                                <th className="p-4 font-bold">Type</th>
                                <th className={`p-4 font-bold ${textDir === 'rtl' ? 'text-right' : 'text-left'}`}>Meaning ({data.targetLanguage})</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.vocabulary.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-bold text-slate-800 flex items-center justify-between">
                                        {item.word}
                                        <button 
                                            onClick={() => speak(item.word, 'en-US')}
                                            className="ml-2 text-slate-300 hover:text-purple-600"
                                        >
                                            <Volume2 size={14} />
                                        </button>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-block bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded uppercase tracking-wider">
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className={`p-4 text-lg text-slate-700 ${textDir === 'rtl' ? 'text-right' : 'text-left'}`} dir={textDir}>{item.meaning}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default AnalysisView;
