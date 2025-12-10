export type Operator = '+' | '-' | '×' | '÷' | '%' | null;

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  isError?: boolean;
}

export enum CalculatorMode {
  STANDARD = 'STANDARD',
  AI_ASSISTANT = 'AI_ASSISTANT'
}
