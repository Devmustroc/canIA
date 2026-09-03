'use client';

import React, { useState } from 'react';
import { EditorProps } from "../types";
import { useRewriteText } from "@/features/ia/api/use-rewrite-text";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Hint } from "@/components/hint";
import { toast } from "sonner";
import { 
  Sparkles, 
  Wand2, 
  Flame, 
  Briefcase, 
  Smile, 
  Languages, 
  Scissors, 
  SendHorizontal,
  Loader2
} from "lucide-react";

interface AiTextPopoverProps {
  editor: EditorProps | undefined;
}

export const AiTextPopover = ({ editor }: AiTextPopoverProps) => {
  const [open, setOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const rewriteMutation = useRewriteText();

  const activeObject = editor?.canvas.getActiveObject();
  // @ts-ignore
  const currentText = (activeObject?.text as string) || "";

  const handleRewrite = (action: string, promptText?: string) => {
    if (!currentText.trim() || !activeObject) {
      toast.error("Veuillez sélectionner un calque texte avec du contenu.");
      return;
    }

    rewriteMutation.mutate(
      {
        text: currentText,
        action,
        customPrompt: promptText,
      },
      {
        onSuccess: (data: any) => {
          if (data.data && activeObject) {
            // @ts-ignore
            activeObject.set("text", data.data);
            editor?.canvas.renderAll();
            toast.success("Texte transformé par l'IA !");
            setOpen(false);
            setCustomPrompt("");
          } else {
            toast.error("Aucune réponse générée par l'IA.");
          }
        },
        onError: (err: any) => {
          toast.error(err.message || "Erreur lors de la génération IA.");
        },
      }
    );
  };

  const presets = [
    { label: "Slogan percutant", action: "slogan", icon: Flame, color: "text-amber-500 bg-amber-50 hover:bg-amber-100" },
    { label: "Améliorer la clarté", action: "improve", icon: Sparkles, color: "text-violet-600 bg-violet-50 hover:bg-violet-100" },
    { label: "Raccourcir le texte", action: "shorter", icon: Scissors, color: "text-blue-600 bg-blue-50 hover:bg-blue-100" },
    { label: "Ton professionnel", action: "formal", icon: Briefcase, color: "text-slate-700 bg-slate-100 hover:bg-slate-200" },
    { label: "Ton créatif & fun", action: "fun", icon: Smile, color: "text-pink-600 bg-pink-50 hover:bg-pink-100" },
    { label: "Traduire en Anglais", action: "translate_en", icon: Languages, color: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100" },
    { label: "Traduire en Français", action: "translate_fr", icon: Languages, color: "text-indigo-600 bg-indigo-50 hover:bg-indigo-100" },
    { label: "Traduire en Espagnol", action: "translate_es", icon: Languages, color: "text-rose-600 bg-rose-50 hover:bg-rose-100" },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Hint label="Réécrire avec l'IA (Copywriter)" side="bottom" sideOffset={10}>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-2.5 bg-gradient-to-r from-violet-50 to-indigo-50 border-violet-200 hover:border-violet-400 text-violet-700 text-xs font-semibold rounded-lg shadow-2xs gap-1.5 transition-all"
          >
            {rewriteMutation.isPending ? (
              <Loader2 className="size-3.5 animate-spin text-violet-600" />
            ) : (
              <Wand2 className="size-3.5 text-violet-600 animate-pulse" />
            )}
            <span>Copywriter IA</span>
          </Button>
        </PopoverTrigger>
      </Hint>

      <PopoverContent className="w-[340px] p-4 space-y-4 shadow-xl border-slate-200 rounded-2xl z-[60]" align="start">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="size-4 text-violet-600" />
            <h4 className="font-semibold text-xs text-slate-800">Assistant Rédaction IA</h4>
          </div>
          <p className="text-[11px] text-slate-500">
            Transformez votre texte sélectionné en 1 clic grâce à Gemini IA.
          </p>
        </div>

        {/* Action Presets */}
        <div className="grid grid-cols-2 gap-1.5">
          {presets.map((preset) => {
            const Icon = preset.icon;
            return (
              <button
                key={preset.action}
                type="button"
                disabled={rewriteMutation.isPending}
                onClick={() => handleRewrite(preset.action)}
                className={`flex items-center gap-2 p-2 rounded-xl border border-transparent transition text-left text-xs font-medium ${preset.color} disabled:opacity-50`}
              >
                <Icon className="size-3.5 shrink-0" />
                <span className="truncate">{preset.label}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Prompt Input */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <label className="text-[11px] font-semibold text-slate-600">Instruire l'IA sur-mesure</label>
          <div className="flex items-center gap-1.5">
            <Input
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Ex: Rends ça poétique et court..."
              className="h-8 text-xs rounded-lg border-slate-200 focus-visible:ring-violet-500"
              onKeyDown={(e) => {
                if (e.key === "Enter" && customPrompt.trim()) {
                  handleRewrite("custom", customPrompt);
                }
              }}
            />
            <Button
              size="icon"
              disabled={!customPrompt.trim() || rewriteMutation.isPending}
              onClick={() => handleRewrite("custom", customPrompt)}
              className="size-8 bg-violet-600 hover:bg-violet-700 text-white rounded-lg shrink-0"
            >
              {rewriteMutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <SendHorizontal className="size-3.5" />
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AiTextPopover;
