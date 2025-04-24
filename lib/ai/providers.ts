import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
  type Message,
  type LanguageModel,
  type ImageModel,
  type LanguageModelV1,
  type LanguageModelV1CallOptions,
  type LanguageModelV1StreamPart,
  type ImageModelCallWarning,
} from 'ai';
import { groq } from '@ai-sdk/groq';
import { xai } from '@ai-sdk/xai';
import { openai, openaiModels } from './openai';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

type OpenAIRole = 'system' | 'user' | 'assistant' | 'tool';
type MessageRole = 'system' | 'user' | 'assistant' | 'data';

const convertToOpenAIRole = (role: MessageRole): OpenAIRole => {
  switch (role) {
    case 'user':
      return 'user';
    case 'assistant':
      return 'assistant';
    case 'system':
      return 'system';
    case 'data':
      return 'tool';
    default:
      return 'user';
  }
};

const convertToMessageRole = (role: OpenAIRole): MessageRole => {
  switch (role) {
    case 'user':
      return 'user';
    case 'assistant':
      return 'assistant';
    case 'system':
      return 'system';
    case 'tool':
      return 'data';
    default:
      return 'user';
  }
};

const createOpenAIModel = (modelName: string): LanguageModelV1 => ({
  specificationVersion: 'v1',
  provider: 'openai',
  modelId: modelName,
  defaultObjectGenerationMode: 'json',
  doGenerate: async (options: LanguageModelV1CallOptions) => {
    const response = await openai.chat.completions.create({
      model: modelName,
      messages: options.prompt.map((m) => ({
        role: convertToOpenAIRole(m.role as MessageRole),
        content:
          typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
      })) as ChatCompletionMessageParam[],
    });
    return {
      text: response.choices[0].message?.content || '',
      finishReason: 'stop',
      usage: {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
      },
      response: {
        id: response.id,
        timestamp: new Date(),
        modelId: modelName,
      },
      rawCall: {
        rawPrompt: options.prompt,
        rawSettings: {},
      },
    };
  },
  doStream: async (options: LanguageModelV1CallOptions) => {
    const response = await openai.chat.completions.create({
      model: modelName,
      messages: options.prompt.map((m) => ({
        role: convertToOpenAIRole(m.role as MessageRole),
        content:
          typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
      })) as ChatCompletionMessageParam[],
      stream: true,
    });

    // Convert the OpenAI response to a proper ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            controller.enqueue({
              type: 'text-delta',
              textDelta: content,
            } as LanguageModelV1StreamPart);
          }
        }
        controller.close();
      },
    });

    return {
      stream,
      rawCall: {
        rawPrompt: options.prompt,
        rawSettings: {},
      },
      response: {
        id: '',
        timestamp: new Date(),
        modelId: modelName,
      },
    };
  },
});

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': createOpenAIModel(openaiModels.chat),
        'chat-model-reasoning': wrapLanguageModel({
          model: groq('deepseek-r1-distill-llama-70b'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': createOpenAIModel(openaiModels.title),
        'artifact-model': createOpenAIModel(openaiModels.artifact),
        'xai-chat-model': xai('xai-1.0'),
      },
      imageModels: {
        'small-model': {
          specificationVersion: 'v1',
          provider: 'openai',
          modelId: openaiModels.image,
          maxImagesPerCall: 1,
          doGenerate: async (options) => {
            const response = await openai.images.generate({
              model: openaiModels.image,
              prompt: options.prompt,
              quality: 'standard',
              style: 'natural',
              n: 1,
            });
            return {
              images: [response.data[0].url || ''],
              warnings: [] as ImageModelCallWarning[],
              response: {
                timestamp: new Date(),
                modelId: openaiModels.image,
                headers: {},
              },
            };
          },
        },
      },
    });
