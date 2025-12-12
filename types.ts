export interface VocabItem {
  word: string;
  meaning: string; // Target language meaning
  type: string; // noun, verb, adj, etc.
}

export interface GrammarPoint {
  rule: string;
  explanation: string; // Target language explanation
  exampleInText: string;
}

export interface AnalysisResult {
  originalText: string;
  translation: string;
  detailedExplanation: string; // New field for detailed explanation
  vocabulary: VocabItem[];
  grammar: GrammarPoint[];
  targetLanguage: string; // Store the language used for analysis
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
