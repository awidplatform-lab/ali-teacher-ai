import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { ChatMessage } from '../types';
import { generateCoachResponse } from '../services/gemini';

interface ChatCoachProps {
  contextText: string;
  targetLanguage: string;
}

const ChatCoach: React.FC<ChatCoachProps> = ({ contextText, targetLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message when language changes
  useEffect(() => {
    setMessages([
        {
          id: 'welcome',
          role: 'model',
          text: `Salam! 👋 I am Ali Teacher. I can explain things in ${targetLanguage}. Do you have any questions?`,
          timestamp: Date.now()
        }
    ]);
  }, [targetLanguage]);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
        const apiHistory = messages.concat(userMsg).map(m => ({ role: m.role, text: m.text }));
        
        const responseText = await generateCoachResponse(apiHistory, input, contextText, targetLanguage);

        const aiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: responseText,
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
        console.error("Chat error", error);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all duration-300 z-50 flex items-center justify-center
            ${isOpen ? 'bg-slate-800 hover:bg-slate-900 rotate-90' : 'bg-blue-600 hover:bg-blue-700 hover:scale-110'}
        `}
      >
        {isOpen ? <X className="text-white" /> : <MessageSquare className="text-white" />}
      </button>

      <div className={`fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-40 overflow-hidden flex flex-col transition-all duration-300 origin-bottom-right
        ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none translate-y-10'}
      `}
        style={{ maxHeight: 'calc(100vh - 120px)', height: '500px' }}
      >
        <div className="bg-blue-600 p-4 flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Bot className="text-white w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Ali Teacher AI</h3>
            <p className="text-blue-200 text-xs">English Assistant ({targetLanguage})</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl p-3 rounded-bl-none shadow-sm flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 bg-white border-t border-slate-100">
          <div className="flex items-center space-x-2 bg-slate-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 placeholder:text-slate-400"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="text-blue-600 disabled:text-slate-300 hover:scale-110 transition-transform"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatCoach;
