'use client';

import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { EditorProps } from '../types';
import { AgentAction } from '@/features/ia/api/use-agent-plan';
import { useAgentChat } from '@/features/ia/api/use-agent-chat';
import { useGenerateImage } from '@/features/ia/api/use-generate-image';
import { usePaywall } from '@/features/subscriptions/hooks/use-paywall';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bot,
  Sparkles,
  Send,
  X,
  Minus,
  Maximize2,
  Loader2,
  CheckCircle2,
  ChevronDown,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  KeyRound,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getStoredBrandKit } from '@/features/brand-kit/use-brand-kit';
import { useSelectedModel } from '@/features/ai-models/use-selected-model';

interface CanAiChatProps {
  editor: EditorProps | undefined;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: AgentAction[];
  isExecuting?: boolean;
}

export const CanAiChat = ({ editor }: CanAiChatProps) => {
  const subscription = usePaywall();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');

  // Selected OpenRouter model hook
  const {
    chatModelId,
    currentChatModel,
    selectChatModel,
    chatModels,
    userApiKey,
    saveUserApiKey,
  } = useSelectedModel();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        '👋 Salut ! Je suis ton **canAI Copilote** propulsé par les meilleurs modèles d\'IA via **OpenRouter**.\n\nChoisis ton modèle préféré en haut (*Claude 3.7 Sonnet, GPT-4o, Gemini 2.0 Flash, DeepSeek R1...*) et dis-moi ce que tu veux créer ou modifier sur le canvas !',
    },
  ]);

  const [selectedInfo, setSelectedInfo] = useState<{
    id?: string;
    type?: string;
    text?: string;
    fill?: string;
    fontSize?: number;
    width?: number;
    height?: number;
  } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const chatMutation = useAgentChat();
  const generateImageMutation = useGenerateImage();

  // Speech to text (Voice input)
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Text to Speech (Audio speaker)
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("La reconnaissance vocale n'est pas supportée sur ce navigateur.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        toast.info('Parlez maintenant...');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Erreur de reconnaissance vocale : ' + event.error);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  // Text-To-Speech function
  const handleSpeak = (messageId: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      toast.error('La synthèse vocale n\'est pas supportée par votre navigateur.');
      return;
    }

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown formatting before speaking
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#/g, '')
      .replace(/`{1,3}[^`]*`{1,3}/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.05;

    utterance.onstart = () => {
      setSpeakingMessageId(messageId);
    };

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, chatMutation.isPending]);

  // Track active selection in canvas
  useEffect(() => {
    if (!editor) return;

    const updateSelection = () => {
      const selected = editor.canvas.getActiveObject();
      if (!selected) {
        setSelectedInfo(null);
        return;
      }

      const anyObj = selected as any;
      setSelectedInfo({
        id: anyObj.id || undefined,
        type: selected.type,
        text: anyObj.text || undefined,
        fill: typeof selected.fill === 'string' ? selected.fill : undefined,
        fontSize: anyObj.fontSize || undefined,
        width: selected.width ? selected.width * (selected.scaleX || 1) : undefined,
        height: selected.height ? selected.height * (selected.scaleY || 1) : undefined,
      });
    };

    editor.canvas.on('selection:created', updateSelection);
    editor.canvas.on('selection:updated', updateSelection);
    editor.canvas.on('selection:cleared', () => setSelectedInfo(null));

    return () => {
      editor.canvas.off('selection:created', updateSelection);
      editor.canvas.off('selection:updated', updateSelection);
      editor.canvas.off('selection:cleared');
    };
  }, [editor]);

  // Execute design plan actions directly on canvas
  const executeActions = async (actions: AgentAction[]) => {
    if (!editor) return;

    for (const act of actions) {
      try {
        switch (act.type) {
          case 'add_text': {
            const defaultLeft = (editor.canvas.width || 800) / 2;
            const defaultTop = (editor.canvas.height || 600) / 2;
            const textObj = new fabric.Textbox(act.text, {
              left: defaultLeft,
              top: defaultTop,
              originX: 'center',
              originY: 'center',
              fontSize: act.fontSize || 42,
              fontWeight: (act.fontWeight ? String(act.fontWeight) : 'bold') as any,
              fontFamily: act.fontFamily || 'Inter',
              fill: act.fill || '#1e293b',
              textAlign: act.textAlign || 'center',
              fontStyle: act.fontStyle || 'normal',
            });
            (textObj as any).id = act.id;
            editor.canvas.add(textObj);
            editor.canvas.setActiveObject(textObj);
            break;
          }
          case 'add_shape': {
            const centerX = (editor.canvas.width || 800) / 2;
            const centerY = (editor.canvas.height || 600) / 2;
            const w = act.width || 240;
            const h = act.height || 140;

            let shapeObj: fabric.Object;
            if (act.shape === 'circle') {
              shapeObj = new fabric.Circle({
                radius: Math.max(w, h) / 2,
                fill: act.fill || '#8b5cf6',
                stroke: act.stroke || undefined,
                strokeWidth: act.strokeWidth || 0,
                left: centerX,
                top: centerY,
                originX: 'center',
                originY: 'center',
              });
            } else {
              shapeObj = new fabric.Rect({
                width: w,
                height: h,
                rx: act.shape === 'soft_rectangle' ? 16 : 0,
                ry: act.shape === 'soft_rectangle' ? 16 : 0,
                fill: act.fill || '#6366f1',
                stroke: act.stroke || undefined,
                strokeWidth: act.strokeWidth || 0,
                left: centerX,
                top: centerY,
                originX: 'center',
                originY: 'center',
              });
            }
            (shapeObj as any).id = act.id;
            editor.canvas.add(shapeObj);
            break;
          }
          case 'set_background': {
            const workspace = editor.getWorkSpace() as fabric.Rect | undefined;
            if (workspace) {
              workspace.set('fill', act.color);
            } else {
              editor.canvas.setBackgroundColor(act.color, () => {});
            }
            break;
          }
          case 'generate_image': {
            toast.loading(`Génération d'image IA : "${act.prompt}"...`, { id: act.id });
            const res = await generateImageMutation.mutateAsync({ prompt: act.prompt });
            if (res?.data) {
              editor.addImage(res.data);
              toast.success('Image ajoutée avec succès !', { id: act.id });
            }
            break;
          }
          case 'delete': {
            const targetObj = editor.canvas.getObjects().find(
              (o: any) => o.id === act.target || (act.target === 'active' && o === editor.canvas.getActiveObject())
            );
            if (targetObj) {
              editor.canvas.remove(targetObj);
            }
            break;
          }
          case 'update_object': {
            const targetObj = editor.canvas.getObjects().find(
              (o: any) => o.id === act.target || (act.target === 'active' && o === editor.canvas.getActiveObject())
            );
            if (targetObj) {
              if (act.fill) targetObj.set('fill', act.fill);
              if (act.opacity !== undefined) targetObj.set('opacity', act.opacity);
              if (act.text && (targetObj as any).set) (targetObj as any).set('text', act.text);
              if (act.fontSize && (targetObj as any).set) (targetObj as any).set('fontSize', act.fontSize);
            }
            break;
          }
        }
      } catch (err) {
        console.warn(`Action ${act.type} skipped:`, err);
      }
    }
    editor.canvas.renderAll();
  };

  const handleApplyBrandKit = () => {
    const brandKit = getStoredBrandKit();
    if (!brandKit || !editor) return;

    const workspace = editor.getWorkSpace() as fabric.Rect | undefined;
    if (workspace && brandKit.colors.background) {
      workspace.set('fill', brandKit.colors.background);
    }

    const textObjects = editor.canvas.getObjects().filter(
      (o) => o.type === 'textbox' || o.type === 'i-text' || o.type === 'text'
    ) as fabric.Textbox[];

    if (textObjects[0]) {
      textObjects[0].set({
        fill: brandKit.colors.text || '#ffffff',
        fontFamily: brandKit.fonts.heading || 'Inter',
      });
    }

    editor.canvas.renderAll();
    toast.success(`Brand Kit "${brandKit.name}" appliqué avec succès !`);
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || chatMutation.isPending) return;

    if (!editor) return;

    if (text === '🎨 Appliquer Brand Kit' || text.toLowerCase().includes('brand kit')) {
      handleApplyBrandKit();
      setInput('');
      return;
    }

    const userMessage: Message = {
      id: String(Date.now()),
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const workspace = editor.getWorkSpace() as fabric.Rect | undefined;
    const historyPayload = messages.slice(-8).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    historyPayload.push({ role: 'user', content: text });

    chatMutation.mutate(
      {
        messages: historyPayload,
        canvas: {
          width: workspace?.width ?? 0,
          height: workspace?.height ?? 0,
          background: typeof workspace?.fill === 'string' ? workspace.fill : undefined,
          objects: editor.listCanvasObjects(),
        },
        selectedObject: selectedInfo || undefined,
        model: chatModelId,
        apiKey: userApiKey || undefined,
      },
      {
        onSuccess: async ({ data }: any) => {
          const assistantMessage: Message = {
            id: String(Date.now() + 1),
            role: 'assistant',
            content: data.reply,
            actions: data.actions as AgentAction[],
          };
          setMessages((prev) => [...prev, assistantMessage]);

          if (data.actions && data.actions.length > 0) {
            await executeActions(data.actions as AgentAction[]);
            toast.success('Design mis à jour par canAI Copilote !');
          }
        },
        onError: (err: any) => {
          toast.error(err.message || 'Erreur lors de la réponse du Co-Pilote');
        },
      }
    );
  };

  const quickChips = selectedInfo
    ? [
        '🎨 Passer en blanc',
        '🔍 Agrandir ce texte',
        '📍 Aligner au centre',
        '🗑️ Supprimer',
      ]
    : [
        '🎨 Appliquer Brand Kit',
        '✨ Ajouter un grand titre',
        '🎯 Ajouter un bouton CTA',
        '🖤 Fond sombre moderne',
      ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-16 right-6 z-50">
        <button
          type="button"
          aria-label="Ouvrir canAI Copilote"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-x-2 px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-2xl border border-slate-700/80 hover:scale-105 transition-all duration-200"
        >
          <div className="relative">
            <Bot className="size-4 text-cyan-400 group-hover:rotate-12 transition-transform duration-200" />
            <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs font-bold tracking-tight bg-gradient-to-r from-cyan-300 via-violet-300 to-amber-200 bg-clip-text text-transparent">
            canAI Copilote
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 text-cyan-300 font-mono">
            {currentChatModel.name.split(' ')[0]}
          </span>
          <Sparkles className="size-3.5 text-amber-400" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'fixed right-6 z-50 flex flex-col rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-200 overflow-hidden',
        isMinimized ? 'bottom-16 w-84 h-14' : 'bottom-16 w-[390px] h-[560px]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-slate-800 select-none">
        <div className="flex items-center gap-x-2">
          <div className="size-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
            <Bot className="size-4 text-cyan-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold leading-tight flex items-center gap-x-1.5">
              <span>canAI Copilote</span>
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </h4>
            
            {/* OpenRouter Model Switcher Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Changer le modèle d'intelligence artificielle"
                  className="flex items-center gap-x-1 mt-0.5 text-[10px] text-cyan-300 hover:text-white transition font-mono group"
                >
                  <Cpu className="size-3 text-cyan-400" />
                  <span className="font-semibold underline decoration-cyan-400/50 underline-offset-2">
                    {currentChatModel.name}
                  </span>
                  <ChevronDown className="size-3 text-slate-400 group-hover:text-white transition-transform" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72 max-h-80 overflow-y-auto no-scrollbar shadow-2xl">
                <div className="p-2 bg-slate-50 border-b">
                  <p className="text-xs font-bold text-slate-800">Modèles OpenRouter</p>
                  <p className="text-[10px] text-slate-500">Choisissez votre LLM pour la création et le design</p>
                </div>
                <DropdownMenuSeparator />
                {chatModels.map((m) => {
                  const isSelected = chatModelId === m.id;
                  return (
                    <DropdownMenuItem
                      key={m.id}
                      onClick={() => {
                        selectChatModel(m.id);
                        toast.success(`Modèle actif : ${m.name}`);
                      }}
                      className={cn(
                        "flex flex-col items-start gap-y-0.5 cursor-pointer py-2 px-2.5",
                        isSelected && "bg-violet-50 text-violet-800 font-semibold"
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-x-1.5">
                          <span className="text-xs font-medium">{m.name}</span>
                          <span className="text-[9px] px-1 rounded bg-slate-100 text-slate-500 font-mono">
                            {m.providerLabel}
                          </span>
                        </div>
                        {m.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 font-medium">
                            {m.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 leading-tight">
                        {m.description}
                      </span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Window controls */}
        <div className="flex items-center gap-x-1">
          <button
            type="button"
            aria-label={isMinimized ? "Agrandir canAI Copilote" : "Réduire canAI Copilote"}
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            {isMinimized ? <Maximize2 className="size-3.5" /> : <Minus className="size-3.5" />}
          </button>
          <button
            type="button"
            aria-label="Fermer canAI Copilote"
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Active Context Banner */}
          <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-x-1.5 truncate">
              <span className="size-2 rounded-full bg-indigo-500 shrink-0" />
              {selectedInfo ? (
                <span className="font-medium text-slate-700 truncate">
                  🎯 Focus :{' '}
                  <strong className="text-indigo-600">
                    {selectedInfo.text
                      ? `"${selectedInfo.text.slice(0, 20)}"`
                      : selectedInfo.type}
                  </strong>
                </span>
              ) : (
                <span className="text-slate-500">🎨 Canvas Global (tout le visuel)</span>
              )}
            </div>
            <span className="text-[10px] font-mono text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded shrink-0">
              {currentChatModel.providerLabel}
            </span>
          </div>

          {/* Messages Thread */}
          <div ref={scrollRef} className="flex-1 p-3.5 overflow-y-auto space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex flex-col',
                  msg.role === 'user' ? 'items-end' : 'items-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed group relative',
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-xs shadow-sm'
                      : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-xs'
                  )}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Actions badge */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-200 flex items-center gap-x-1.5 text-[10px] text-emerald-600 font-semibold">
                      <CheckCircle2 className="size-3.5" />
                      <span>{msg.actions.length} action(s) exécutée(s) sur le canvas</span>
                    </div>
                  )}

                  {/* TTS Speaker button for Assistant Messages */}
                  {msg.role === 'assistant' && (
                    <div className="mt-2 pt-1 flex items-center justify-between border-t border-slate-200/60 text-[10px] text-slate-500">
                      <span className="text-[9.5px] font-mono text-slate-400">
                        {currentChatModel.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSpeak(msg.id, msg.content)}
                        aria-label={speakingMessageId === msg.id ? "Arrêter la lecture" : "Écouter à voix haute"}
                        className={cn(
                          "flex items-center gap-x-1 px-1.5 py-0.5 rounded hover:bg-slate-200/70 transition",
                          speakingMessageId === msg.id && "bg-violet-100 text-violet-700 font-semibold animate-pulse"
                        )}
                      >
                        {speakingMessageId === msg.id ? (
                          <>
                            <VolumeX className="size-3" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="size-3" />
                            <span>Écouter</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {chatMutation.isPending && (
              <div className="flex items-start">
                <div className="bg-slate-100 p-3 rounded-2xl rounded-bl-xs text-xs flex items-center gap-x-2 text-slate-500">
                  <Loader2 className="size-3.5 animate-spin text-indigo-600" />
                  <span>{currentChatModel.name} analyse et applique vos modifications...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Context Suggestion Chips */}
          <div className="px-3 py-1.5 border-t border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  disabled={chatMutation.isPending}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-violet-400 hover:text-violet-700 text-[10px] font-medium text-slate-600 transition shadow-2xs"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 border-t bg-white flex items-center gap-x-1.5"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={chatMutation.isPending}
              aria-label="Votre message ou commande pour canAI Copilote"
              placeholder={
                isListening
                  ? '🎙️ Écoute en cours... parlez !'
                  : selectedInfo
                  ? `Demander une modif sur ${selectedInfo.text ? `"${selectedInfo.text.slice(0, 12)}..."` : 'cet élément'}...`
                  : `Discutez avec ${currentChatModel.name.split(' ')[0]}...`
              }
              className={cn(
                "h-9 text-xs rounded-xl border-slate-200 focus-visible:ring-violet-500",
                isListening && "border-rose-400 bg-rose-50/40"
              )}
            />

            {/* Speech-to-text mic button */}
            <Button
              type="button"
              onClick={toggleListening}
              size="icon"
              variant="outline"
              aria-label={isListening ? "Arrêter la dictée vocale" : "Démarrer la dictée vocale"}
              className={cn(
                "size-9 shrink-0 rounded-xl transition",
                isListening && "bg-rose-500 hover:bg-rose-600 text-white border-rose-600 animate-pulse"
              )}
            >
              {isListening ? <MicOff className="size-4" /> : <Mic className="size-4 text-slate-600" />}
            </Button>

            {/* Send button */}
            <Button
              type="submit"
              size="icon"
              disabled={chatMutation.isPending || !input.trim()}
              aria-label="Envoyer le message"
              className="size-9 shrink-0 rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow"
            >
              {chatMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          </form>
        </>
      )}
    </div>
  );
};

export default CanAiChat;
