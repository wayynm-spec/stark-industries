export type MessageRole = 'user' | 'assistant' | 'system';

export interface AIMessage {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  provider?: string;
  model?: string;
  toolCalls?: ToolCall[];
  createdAt: Date;
}

export interface AIConversation {
  id: string;
  workspaceId: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
  result?: unknown;
}

export interface AIToolSchema {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface ChatRequest {
  conversationId?: string;
  message: string;
  workspaceId: string;
}

export interface ChatResponse {
  conversationId: string;
  message: AIMessage;
  toolsExecuted?: ToolCall[];
}
