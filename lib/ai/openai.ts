import OpenAI from 'openai';

// Create OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// OpenAI model configurations
export const openaiModels = {
  chat: 'gpt-4-turbo-preview',
  reasoning: 'gpt-4-turbo-preview',
  title: 'gpt-3.5-turbo',
  artifact: 'gpt-4-turbo-preview',
  image: 'dall-e-3',
} as const;
