import { env } from '@/lib/env';
import { logger } from '@/lib/logger';
import { ToolCall, AIToolSchema } from '@/types/ai';

export interface AIProviderConfig {
  name: string;
  isConfigured: boolean;
  model?: string;
}

export interface ChatInput {
  messages: Array<{ role: string; content: string }>;
  tools?: AIToolSchema[];
  temperature?: number;
}

export interface ChatOutput {
  content: string;
  toolCalls?: ToolCall[];
  model: string;
  provider: string;
}

export abstract class AIProvider {
  abstract name: string;
  abstract isConfigured(): boolean;
  abstract chat(input: ChatInput): Promise<ChatOutput>;
}

export class OpenAIProvider extends AIProvider {
  name = 'openai';

  isConfigured(): boolean {
    return !!env.OPENAI_API_KEY;
  }

  async chat(input: ChatInput): Promise<ChatOutput> {
    throw new Error('OpenAI provider not yet implemented');
  }
}

export class AnthropicProvider extends AIProvider {
  name = 'anthropic';

  isConfigured(): boolean {
    return !!env.ANTHROPIC_API_KEY;
  }

  async chat(input: ChatInput): Promise<ChatOutput> {
    throw new Error('Anthropic provider not yet implemented');
  }
}

export class MockProvider extends AIProvider {
  name = 'mock';

  isConfigured(): boolean {
    return true;
  }

  async chat(input: ChatInput): Promise<ChatOutput> {
    // Development-only mock provider
    return {
      content: 'This is a mock response for development. Configure an AI provider to enable real responses.',
      model: 'mock',
      provider: 'mock',
    };
  }
}

export class AIProviderRegistry {
  private providers: Map<string, AIProvider> = new Map();
  private activeProvider: AIProvider | null = null;

  constructor() {
    this.registerProvider(new OpenAIProvider());
    this.registerProvider(new AnthropicProvider());
    this.registerProvider(new MockProvider());
  }

  registerProvider(provider: AIProvider): void {
    this.providers.set(provider.name, provider);
  }

  getProvider(): AIProvider {
    if (this.activeProvider) {
      return this.activeProvider;
    }

    // Find first configured provider
    const selectedProvider = Array.from(this.providers.values()).find(
      (p) => p.isConfigured()
    );

    if (!selectedProvider) {
      logger.warn('No AI provider configured, using mock provider');
      return this.providers.get('mock')!;
    }

    this.activeProvider = selectedProvider;
    logger.info('AI provider selected', { provider: selectedProvider.name });
    return selectedProvider;
  }

  getConfig(): AIProviderConfig {
    const provider = this.getProvider();
    return {
      name: provider.name,
      isConfigured: provider.isConfigured(),
    };
  }
}

export const aiRegistry = new AIProviderRegistry();
