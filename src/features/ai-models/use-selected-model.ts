'use client';

import { useState, useEffect } from 'react';
import { CHAT_MODELS, DEFAULT_CHAT_MODEL, DEFAULT_IMAGE_MODEL, IMAGE_MODELS } from './model-catalog';
import { AIModel } from './types';

const CHAT_MODEL_KEY = 'canai_selected_chat_model';
const IMAGE_MODEL_KEY = 'canai_selected_image_model';
const USER_OPENROUTER_KEY = 'canai_user_openrouter_api_key';

export const useSelectedModel = () => {
  const [chatModelId, setChatModelId] = useState<string>(DEFAULT_CHAT_MODEL);
  const [imageModelId, setImageModelId] = useState<string>(DEFAULT_IMAGE_MODEL);
  const [userApiKey, setUserApiKey] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedChat = localStorage.getItem(CHAT_MODEL_KEY);
      if (savedChat && CHAT_MODELS.some((m) => m.id === savedChat)) {
        setChatModelId(savedChat);
      }

      const savedImage = localStorage.getItem(IMAGE_MODEL_KEY);
      if (savedImage && IMAGE_MODELS.some((m) => m.id === savedImage)) {
        setImageModelId(savedImage);
      }

      const savedKey = localStorage.getItem(USER_OPENROUTER_KEY);
      if (savedKey) {
        setUserApiKey(savedKey);
      }
    } catch (e) {
      console.warn('Unable to access localStorage for AI models:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const selectChatModel = (modelId: string) => {
    setChatModelId(modelId);
    try {
      localStorage.setItem(CHAT_MODEL_KEY, modelId);
    } catch {}
  };

  const selectImageModel = (modelId: string) => {
    setImageModelId(modelId);
    try {
      localStorage.setItem(IMAGE_MODEL_KEY, modelId);
    } catch {}
  };

  const saveUserApiKey = (key: string) => {
    setUserApiKey(key);
    try {
      if (key) {
        localStorage.setItem(USER_OPENROUTER_KEY, key);
      } else {
        localStorage.removeItem(USER_OPENROUTER_KEY);
      }
    } catch {}
  };

  const currentChatModel: AIModel =
    CHAT_MODELS.find((m) => m.id === chatModelId) || CHAT_MODELS[0];

  const currentImageModel: AIModel =
    IMAGE_MODELS.find((m) => m.id === imageModelId) || IMAGE_MODELS[0];

  return {
    chatModelId,
    currentChatModel,
    selectChatModel,
    imageModelId,
    currentImageModel,
    selectImageModel,
    userApiKey,
    saveUserApiKey,
    isLoaded,
    chatModels: CHAT_MODELS,
    imageModels: IMAGE_MODELS,
  };
};
