export interface VocabItem {
  word: string;
  meaning: string; // Arabic meaning
  type: string; // noun, verb, adj, etc.
}

export interface GrammarPoint {
  rule: string;
  explanation: string; // Arabic explanation
  exampleInText: string;
}

export interface AnalysisResult {
  originalText: string;
  translation: string;
  detailedExplanation: string; // New field for detailed explanation
  vocabulary: VocabItem[];
  grammar: GrammarPoint[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}