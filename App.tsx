import React, { useState } from 'react';
import InputArea from './components/IdeaForm';
import AnalysisView from './components/Roadmap';
import ChatCoach from './components/ChatCoach';
import { AnalysisResult } from './types';
import { analyzeText } from './services/gemini';
import { Trash2, RotateCcw, GraduationCap } from 'lucide-react';

function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string, file?: { mimeType: string; data: string }) => {
    setIsGenerating(true);
    setError(null);
    try {
      const data = await analyzeText(text, file);
      setResult(data);
    } catch (err) {
      setError("Failed to analyze content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* Navbar / Header */}
      <header className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
               <GraduationCap className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">Ali Teacher AI</span>
          </div>

          {result && (
            <button
              onClick={handleReset}
              className="text-slate-500 hover:text-red-500 transition-colors flex items-center space-x-1 px-3 py-1.5 rounded-lg hover:bg-slate-100"
              title="New Text"
            >
              <RotateCcw size={16} />
              <span className="text-sm font-medium">New Analysis</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full">
        {error && (
            <div className="max-w-md mx-auto mt-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center justify-between animate-pulse border border-red-100">
                <span>{error}</span>
                <button onClick={() => setError(null)}><Trash2 size={16} /></button>
            </div>
        )}

        {!result ? (
          <InputArea onSubmit={handleAnalyze} isGenerating={isGenerating} />
        ) : (
          <div className="animate-fade-in">
             <AnalysisView data={result} />
             <ChatCoach contextText={result.originalText} />
          </div>
        )}
      </main>
      
      {/* Decorative background elements */}
      {!result && !isGenerating && (
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
              <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
          </div>
      )}
    </div>
  );
}

export default App;