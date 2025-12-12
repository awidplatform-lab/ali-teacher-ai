import React, { useState } from 'react';
import { Key, Check, AlertCircle, Play, Loader2, Clipboard } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// HADA HOWA L-FICHIER DIAL "BOITE" (POPUP)
// Hna fin katban l-fenetre bach dakhal l-API Key.

interface ApiKeyModalProps {
  onSave: () => void;
  onClose: () => void;
  isMandatory?: boolean;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave, onClose, isMandatory = false }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setApiKey(text);
      setError('');
      setTestStatus('idle');
    } catch (err) {
      setError('Maqdernach n-copiw l-key. Ktbha b ydik.');
    }
  };

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
        setError("Enter Key first!");
        return;
    }
    
    setTestStatus('testing');
    setError('');

    try {
        const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
        // Simple test call to check if key works
        await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Hello",
        });
        setTestStatus('success');
    } catch (e: any) {
        setTestStatus('failed');
        setError("Key Invalid. Please check again.");
    }
  };

  const handleSave = () => {
    if (!apiKey.trim().startsWith('AIza')) {
      setError('Key usually starts with "AIza". Check it again.');
      return;
    }
    localStorage.setItem('gemini_api_key', apiKey.trim());
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-fade-in px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-lg w-full border border-slate-200">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mb-4 rotate-3">
                <Key size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">API Key Settings</h2>
            <p className="text-slate-500 text-center mt-2 max-w-xs text-sm">
                Bach ykhdam Site, khassk <strong>Google Gemini API Key</strong>.
            </p>
        </div>

        {/* Input Area */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError('');
                setTestStatus('idle');
              }}
              placeholder="AIzaSy..."
              className={`w-full pl-4 pr-24 py-4 rounded-xl border-2 outline-none transition-all font-mono text-sm tracking-wide
                ${testStatus === 'success' ? 'border-green-500 bg-green-50 text-green-700' : 
                  testStatus === 'failed' || error ? 'border-red-300 bg-red-50 text-red-900' : 
                  'border-slate-200 focus:border-blue-500 text-slate-800 bg-slate-50 focus:bg-white'}
              `}
            />
            
            {/* Paste Button inside input */}
            <button 
                onClick={handlePaste}
                className="absolute right-2 top-2 bottom-2 px-3 bg-white hover:bg-slate-100 text-slate-500 rounded-lg text-xs font-bold border border-slate-200 transition-colors"
                title="Paste"
            >
                Paste
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100 animate-shake">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          
          {testStatus === 'success' && (
             <div className="flex items-center space-x-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg border border-green-100">
                <Check size={16} />
                <span>Great! Key is working. Click "Save & Start".</span>
             </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
            {/* Test Button */}
            <button
                onClick={handleTestKey}
                disabled={!apiKey || testStatus === 'testing'}
                className={`px-4 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all border-2
                    ${testStatus === 'success' 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-slate-50'}
                `}
            >
                {testStatus === 'testing' ? (
                    <Loader2 size={18} className="animate-spin" />
                ) : (
                    <Play size={18} className={testStatus === 'success' ? 'text-green-600' : 'text-blue-500'} />
                )}
                <span>{testStatus === 'testing' ? 'Testing...' : 'Test Key'}</span>
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={!apiKey || (isMandatory && testStatus === 'failed')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              <span>Save & Start</span>
              <Check size={20} strokeWidth={3} />
            </button>
        </div>

        {/* Footer Links */}
        <div className="mt-6 flex justify-between items-center text-xs">
            {!isMandatory && (
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-medium">
                    Cancel
                </button>
            )}
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="ml-auto text-blue-600 hover:text-blue-700 font-semibold flex items-center">
               <span>Get Free Key</span>
               <span className="ml-1 text-lg">→</span>
            </a>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;