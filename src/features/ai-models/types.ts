export type ModelCategory = 'text' | 'image' | 'voice';

export type ModelProvider = 
  | 'anthropic' 
  | 'openai' 
  | 'google' 
  | 'deepseek' 
  | 'mistral' 
  | 'meta' 
  | 'black-forest-labs' 
  | 'stability';

export interface AIModel {
  id: string;
  name: string;
  provider: ModelProvider;
  providerLabel: string;
  category: ModelCategory;
  description: string;
  badge?: string;
  isPopular?: boolean;
  contextWindow?: string;
}
