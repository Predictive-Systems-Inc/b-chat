export const DEFAULT_CHAT_MODEL: string = 'chat-model';

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Advanced GPT-4 model with enhanced capabilities',
  },
  {
    id: 'chat-model',
    name: 'GPT-4 Turbo',
    description: 'Unlimited chat capabilities for everyday use',
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    description: "Google's advanced AI model for enterprise solutions",
  },
  {
    id: 'xai-chat-model',
    name: 'XAI Model',
    description: 'Using XAI Grok for chat capabilities',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Reasoning model',
    description: 'Uses advanced reasoning with step-by-step thinking',
  },
];
