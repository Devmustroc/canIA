'use client';

import React from 'react';
import { EditorProps } from '../types';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Sparkles, 
  Sun, 
  Layers, 
  CircleDot, 
  Slash, 
  Zap 
} from "lucide-react";
import { toast } from 'sonner';

interface TextEffectsPopoverProps {
  editor: EditorProps | undefined;
}

export const TextEffectsPopover = ({ editor }: TextEffectsPopoverProps) => {
  if (!editor) return null;

  const effects = [
    {
      id: "none",
      label: "Normal",
      icon: Slash,
      color: "bg-slate-100 text-slate-700",
    },
    {
      id: "neon",
      label: "Néon Lumineux",
      icon: Sun,
      color: "bg-pink-500/10 text-pink-600 border-pink-200",
    },
    {
      id: "shadow3d",
      label: "Ombre 3D",
      icon: Layers,
      color: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
    },
    {
      id: "hollow",
      label: "Contour Creux",
      icon: CircleDot,
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    },
    {
      id: "glitch",
      label: "Glitch Rétro",
      icon: Zap,
      color: "bg-amber-500/10 text-amber-600 border-amber-200",
    },
    {
      id: "curved",
      label: "Texte en Arc",
      icon: Sparkles,
      color: "bg-violet-500/10 text-violet-600 border-violet-200",
    },
  ];

  const handleApplyEffect = (effectId: string) => {
    editor.applyTextEffect(effectId as any);
    toast.success("Effet de texte appliqué !");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs font-semibold px-2.5 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
          title="Effets de texte (Néon, 3D, Arc)"
        >
          <Sparkles className="size-3.5 text-violet-600" />
          <span>Effets</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-2 rounded-2xl shadow-xl border-slate-200">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
            Style de Texte
          </p>

          {effects.map((ef) => {
            const Icon = ef.icon;
            return (
              <button
                key={ef.id}
                type="button"
                onClick={() => handleApplyEffect(ef.id)}
                className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium text-slate-800 hover:bg-slate-100 transition text-left"
              >
                <div className={`size-6 rounded-lg flex items-center justify-center border ${ef.color}`}>
                  <Icon className="size-3.5" />
                </div>
                <span>{ef.label}</span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TextEffectsPopover;
