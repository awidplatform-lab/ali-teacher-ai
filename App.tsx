import React, { useState, useEffect } from 'react';
import InputArea from './components/IdeaForm';
import AnalysisView from './components/Roadmap';
import ChatCoach from './components/ChatCoach';
import ApiKeyModal from './components/ApiKeyModal';
import { AnalysisResult } from './types';
import { analyzeText, getApiKey } from './services/gemini';
import { Trash2, RotateCcw, GraduationCap, AlertTriangle, Settings, Key } from 'lucide-react';

function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  
  // Check for API key on mount
  useEffect(() => {
    const key = getApiKey();
    if (!key) {
        setShowApiKeyModal(true);
    }
  }, []);

  const handleAnalyze = async (text: string, language: string, file?: { mimeType: string; data: string }) => {
    setIsGenerating(true);
    setError(null);
    try {
      const data = await analyzeText(text, language, file);
      setResult(data);
    } catch (err: any) {
      if (err.message === "API_KEY_MISSING") {
        setShowApiKeyModal(true);
        setError("Please enter your API Key to continue.");
      } else {
        setError("Failed to analyze content. Please try again. " + (err.message || ""));
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen relative selection:bg-blue-100 selection:text-blue-900 font-sans text-slate-900">
      
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-[-1]">
        {/* University Image */}
        <img 
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format&fit=crop" 
            alt="University Background" 
            className="w-full h-full object-cover"
        />
        {/* White/Light Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-slate-50/90 backdrop-blur-[2px]"></div>
        
        {/* Subtle Gradient Texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-100/80"></div>
      </div>

      {/* API Key Modal */}
      {showApiKeyModal && (
          <ApiKeyModal 
            onSave={() => {
                setShowApiKeyModal(false);
                setError(null);
            }} 
            onClose={() => setShowApiKeyModal(false)}
            isMandatory={!getApiKey()}
          />
      )}

      {/* Navbar / Header */}
      <header className="w-full bg-white/70 backdrop-blur-md sticky top-0 z-30 border-b border-white/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-blue-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
               <GraduationCap className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">Ali Teacher AI</span>
          </div>

          <div className="flex items-center space-x-3">
            {result && (
                <button
                onClick={handleReset}
                className="text-slate-600 hover:text-red-600 transition-colors flex items-center space-x-1 px-3 py-1.5 rounded-lg hover:bg-white/50 font-medium"
                title="New Text"
                >
                <RotateCcw size={16} />
                <span className="hidden sm:inline text-sm">New Analysis</span>
                </button>
            )}
            
            <button
                onClick={() => setShowApiKeyModal(true)}
                className="text-slate-500 hover:text-blue-700 transition-colors p-2 rounded-lg hover:bg-white/50"
                title="Settings (API Key)"
            >
                <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full relative z-10">
        {error && (
            <div className="max-w-2xl mx-auto mt-6 p-4 bg-red-50/95 backdrop-blur text-red-700 rounded-xl flex items-start justify-between border border-red-200 shadow-lg animate-fade-in-up">
                <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold">Connection Error</p>
                        <p className="text-sm mt-1 opacity-90">{error}</p>
                    </div>
                </div>
                <button onClick={() => setError(null)} className="p-1 hover:bg-red-100 rounded text-red-500"><Trash2 size={16} /></button>
            </div>
        )}

        {!result ? (
          <InputArea onSubmit={handleAnalyze} isGenerating={isGenerating} />
        ) : (
          <div className="animate-fade-in">
             <AnalysisView data={result} />
             <ChatCoach contextText={result.originalText} targetLanguage={result.targetLanguage} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;