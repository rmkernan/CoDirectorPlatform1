/**
 * @file index.ts
 * @description Type definitions for the chat feature
 * @created 2025-05-22 21:42 ET
 * @lastUpdated 2025-05-22 21:42 ET
 * @module features/chat/types
 */

/**
 * Represents a single message in the chat
 */
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: Date;
  isError?: boolean;
}

/**
 * Represents the chat state
 */
export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  activeSessionId: string | null;
}

/**
 * Represents a chat session
 */
export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
}
